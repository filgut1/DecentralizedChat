import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '@app/_models';
import { pick }  from 'underscore/underscore-esm';
import { v4 } from 'uuid';
import * as Gun from 'gun/gun';
require('gun/lib/then.js');
require('gun/sea');
require('gun/lib/time.js');

@Injectable({ providedIn: 'root' })
export class GunDB {
    readonly gun:any;
    readonly gunUser:any;
    readonly sea:any;
    constructor() {
        this.gun = Gun('http://localhost:3001/gun');
        this.sea = Gun.SEA;
        this.gunUser = this.gun.user();
        this.gunUser.recall({sessionStorage: true});
    }

    isLoggedIn() {
        return this.gunUser.is;
    }

    get myEpub() { return this.gunUser.is.epub; }
    get myAlias() { return this.gunUser.is.alias; }

    messagesFrom(epub) {
        return this.gun.get('convos').get(this.myEpub).get(epub);
    }

    messagesTo(epub) {
        return this.gun.get('convos').get(epub).get(this.myEpub);
    }

    authenticate(username:String, password:String): Promise<any> {
        return new Promise((resolve, reject) => {
            this.gunUser.auth(username, password, ack => {                
                if (ack.err && !this.gunUser.is) {
                    reject(ack.err);
                } else {
                    resolve(this.gunUser.is);
                }
            });
        });
    }

    createUser(user:User): Promise<any> {
        return new Promise(async (resolve, reject) => {
            const res  = await this.gun.get(`~@${user.alias}`).then();
            if (res) {
                reject('User already exists.');
            } else {
                this.gunUser.create(user.alias, user.password, ack => {
                    if (ack.err) {
                        reject(ack.err);
                    } else {
                        this.gunUser.auth(user.alias, user.password, async ack => {
                            const { alias } = user;
                            this.gun.get('users').get(alias)
                            .put({epub: ack.sea.epub, pub: ack.sea.pub, alias}, ack => {
                                resolve(this.gunUser.is);
                            });
                        });
                    }
                });
            }
        });
    }

    addContact(alias): Promise<any> {
        if (this.isLoggedIn()) {
            const contact = this.gun.get('users').get(alias);
            const me = this.gun.get('users').get(this.myAlias);

            return new Promise(resolve => {
                // Create placeholder convo for contact

                const uuid = v4();
                const userConvoNode = this.gun.get(uuid).put({
                    uuid,
                    name: 'chat',
                    ts: new Date().getTime()
                }, ack => {
                    userConvoNode.get('members').set(contact);
                    userConvoNode.get('members').set(me);
    
                    contact.get('friends').set(me);
                    contact.get('conversations').set(userConvoNode);
                    me.get('friends').set(contact);
                    me.get('conversations').set(userConvoNode);

                    resolve(true);
                });
               
            });
        }
    }

    get myConversations() {
        return this.gun.get('users').get(this.myAlias).get('conversations');
    }

    getAllContacts(): Promise<any> {
        return this.gun.get('users').get(this.myAlias).get('friends')
            .then(this.cleanup)
            .then(refs => this.nodeData(refs));
    }

    getUserConversations() {
        return this.gun.get('users').get(this.myAlias).get('conversations')
            .then(this.cleanup)
            .then(refs => this.nodeData(refs));
    }

    getConversation(uuid) {
        return this.gun.get(uuid).then(this.cleanup);
    }

    getUser(alias) {
        return this.gun.get('users').get(alias).then(this.cleanup);
    }

    getConvoMembers(ref) {
        return this.gun.get(ref).then(this.cleanup).then(ref => this.nodeData(ref));
    }

    getCurrentUserProfile(): Promise<any> {
        if (this.isLoggedIn()) {
            return new Promise(resolve => {
                this.gunUser.get('profile').once(data => {
                    resolve(data);
                });
            });
        } else {
            return Promise.reject();
        }
    } 
    
    findUserByAlias(alias): Promise<any> {
        if (this.isLoggedIn()) {
            return new Promise(async(resolve, reject) => {
                const res = await this.gun.get(`~@${alias}`).then(this.cleanup);
                if (res) {
                    resolve(res);
                } else {
                    reject(res);
                }
            });
        }
    }

    messagesObservable(uuid, opts = {}) {
        return new Observable(o => {
            let stopped = false;
            this.gun.get(uuid).get('messages').map(message => 
                message.fromEpub === this.myEpub || message.toEpub === this.myEpub ? message : undefined)
                .once((data, key, at, ev) => {
                if (stopped) {
                    o.complete()
                    return ev.off()
                }
                o.next(this.cleanup(data));
            }, opts);
            return () => {
                // Caller unsubscribe
                stopped = true
            }
        });
    } 

    async sendMessage(conversation, members, message, ts) {
        if (this.isLoggedIn()) {
            members.forEach(async member => {
                if (member.epub !== this.myEpub) { // Don't send message to self
                    const epub = member.epub;
                    const secret = await this.sea.secret(epub, this.gunUser._.sea);
                    const enc = await this.sea.encrypt(message, secret);
                    const encForMe = await this.sea.encrypt(message, this.gunUser._.sea);
                    const uuid = v4();

                    const msgNode = this.gun
                        .get(uuid)
                        .put({
                            from: this.myAlias,
                            to: member.alias,
                            fromEpub: this.myEpub,
                            toEpub: epub,
                            ts,
                            uuid,
                            encForMe,
                            message: enc
                        }, ack => { 
                            this.gun.get(conversation.uuid).get('messages').set(msgNode); 
                        });
                    }
            });
        }
    }

    async decryptMyOwnMessage(messageObj) {
        messageObj.message = await this.sea.decrypt(messageObj.encForMe, this.gunUser._.sea);
        return messageObj;
    }

    async decryptMessage(messageObj) {
        const msgCpy = Object.assign({}, messageObj);
        const secret = await this.sea.secret(messageObj.fromEpub, this.gunUser._.sea);
        msgCpy.message = await this.sea.decrypt(messageObj.message, secret);
        return msgCpy;
    }

    onAuth$(): Observable<any> {
        return new Observable(o => this.gun.on('auth', ack => {
            o.next(ack);
            o.complete();
        }));
    }

    onAuth(): Promise<any> {
          // Create a promise that rejects in <ms> milliseconds
          let timeout = new Promise((resolve, reject) => {
            let id = setTimeout(() => {
              clearTimeout(id);
              reject('Timed out in '+ 1000 + 'ms.')
            }, 1000)
          });

        const promise = new Promise(resolve => {
            this.gun.on('auth', ack => {
                if (!ack.err) {
                    localStorage.setItem('user', JSON.stringify({
                        alias: ack.put.alias,
                        epub: ack.sea.epub,
                        pub: ack.sea.pub
                    }));
                    resolve({
                        alias: ack.put.alias,
                        epub: ack.sea.epub,
                        pub: ack.sea.pub
                    });
                }
            });
        });

        return Promise.race([
            promise,
            timeout
          ])
    }

    on$(node, opts = {}): Observable<any> {
        return new Observable(o => {
            let stopped = false
            node.on((data, key, at, ev) => {
                if (stopped) {
                    o.complete()
                    return ev.off()
                }
                o.next(this.cleanup(data));
            }, opts);
            return () => {
                // Caller unsubscribe
                stopped = true
            }
        });
    }

    once(node): Promise<any> {
        return new Promise(resolve => {
            node.once(data => resolve(this.cleanup(data)));
        });
    }

    once$(node): Observable<any> {
        return new Observable(o => node.once(data => {
            o.next(this.cleanup(data));
            o.complete();
        }));
    }

    private cleanup(data) {
        return pick(data, (v, k, o) => v !== null && k !== '_');
    }

    private nodeData(refs) {
        return Promise.all(Object.keys(refs).map(k => this.gun.get(k)
            .then(this.cleanup)));
    }

    logout() {
        this.gunUser.leave();
    }
}