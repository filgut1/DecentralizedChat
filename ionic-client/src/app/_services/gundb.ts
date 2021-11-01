import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '@app/_models';
import { pick }  from 'underscore/underscore-esm';
import { v4 } from 'uuid';
import * as Gun from 'gun/gun';
import { resolve } from 'node:dns';
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
    get myPub() { return this.gunUser.is.pub; }
    get myProfile() { 
        return this.gunUser.get('profile').then(this.cleanup);
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
                            this.gunUser.get('profile')
                            .put({epub: ack.sea.epub, pub: ack.sea.pub, alias}, ack => {
                                resolve(this.gunUser.is);
                            });
                        });
                    }
                });
            }
        });
    }

    async addContactByAlias(alias) {
        return new Promise(async resolve => {
            if (this.isLoggedIn()) {
                const contact = await this.getUserByAlias(alias);
                if (contact.length) {
                    const contactProfile = this.gun.user(contact[0].pub).get('profile');
                    this.gunUser.get('contacts').set(contactProfile, async ack => {
                        const profile = await contactProfile.then().then(this.cleanup)
                        resolve(profile);
                    });
                }
            }        
        });
    }

    async addContactByPub(pub) {
        return new Promise(async resolve => {
            if (this.isLoggedIn()) {
                const contactProfile = this.gun.user(pub).get('profile');
                this.gunUser.get('contacts').set(contactProfile, async ack => {
                    const profile = await contactProfile.then().then(this.cleanup)
                    resolve(profile);
                });
            }        
        });
    }

    async createNewChat(members, chatName) {
        return new Promise(async resolve => {
            const uuid = v4();
            const sharedKey = await this.sea.pair();
            const sharedKeyString = JSON.stringify(sharedKey);
            const sharedSecret = await this.sea.secret(sharedKey.epub, sharedKey);
            const encryptedSharedKey = await this.sea.encrypt(sharedKeyString, sharedSecret);
            const ownerEncryptedSharedSecret = await this.sea.encrypt(sharedSecret, this.gunUser._.sea);
            const ownerEncryptedSharedKey = await this.sea.encrypt(sharedKey, this.gunUser._.sea);

            this.gunUser.get('chatLinks').get(uuid).put({
                encryptedSharedKey, ownerEncryptedSharedKey, ownerEncryptedSharedSecret
            });

            const chat = {
                uuid,
                name: chatName,
                ts: new Date().getTime()
            }
            
            const chatNode = this.gunUser.get('chats').get(uuid).put(chat, ack => {
                this.addMembersToChat(members, chatNode);
                resolve(
                    encodeURI(`https://fakelink?chatId=${uuid}&inviter=${this.myPub}&sharedSecret=${sharedSecret}`)
                );
            });
        });
    }

    async joinExistingChat(uuid, pub, members, sharedSecret) {
        return new Promise(async resolve => {
            const chat = await this.gun.user(pub).get('chats').get(uuid).then().then(this.cleanup);
            const ownerEncryptedSharedSecret = await this.sea.encrypt(sharedSecret, this.gunUser._.sea);
    
            this.gunUser.get('chatLinks').get(uuid).put({
                ownerEncryptedSharedSecret
            });
    
            this.gunUser.get('chats').get(uuid).put(chat, ack => {
                resolve(true);
            });
        });
    }

    async addMembersToChat(members, chatNode) {
        for (const member of members) {
            const user = this.gun.user(member.pub).get('profile');
            chatNode.get('members').set(user);
        }
    }

    get myChats() {
        return this.gunUser.get('chats');
    }

    getAllContacts(): Promise<any> {
        return this.gunUser.get('contacts')
            .then(this.cleanup)
            .then(refs => this.nodeData(refs));
    }

    getUserConversations() {
        return this.gunUser.get('chats')
            .then(this.cleanup)
            .then(uuids => Promise.all(Object.keys(uuids).map(e => this.gunUser.get('chats').get(e)
            .then(this.cleanup))));
    }

    getConversation(uuid) {
        return this.gun.get(uuid).then(this.cleanup);
    }

    getUserByAlias(alias) {
        return this.gun.get(`~@${alias}`).then(this.cleanup).then(ref => this.nodeData(ref));
    }

    getUserByPub(pub) {
        return this.gun.user(pub).get('profile').then(this.cleanup);
    }

    getConvoMembers(ref) {
        return this.gun.get(ref).then(this.cleanup).then(ref => this.nodeData(ref));
    }
    
    userExists(alias): Promise<any> {
        if (this.isLoggedIn()) {
            return new Promise(async(resolve, reject) => {
                const res = await this.gun.get(`~@${alias}`).then();
                if (res) {
                    resolve(true);
                } else {
                    reject('User not found');
                }
            });
        }
    }

    async getChatMembers(uuid, pub) {
        const members = await this.gun.user(pub).get('chats').get(uuid).get('members')
            .then(this.cleanup)
            .then(refs => this.nodeData(refs));

        return members;
    }

    messagesObservable2(uuid, pub, opts = {}) {
        return new Observable(o => {
            let stopped = false;
            this.gun.user(pub).get('chats').get(uuid).get('messages').map().once((data, key, at, ev) => {
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

    async sendMessage3(conversation, message, ts) {
        if (this.isLoggedIn()) {

            const chatLink = this.gunUser.get('chatLinks').get(conversation.uuid);

            const ownerEncryptedSharedSecret = await chatLink.get('ownerEncryptedSharedSecret').then();
            const sharedSecret =  await this.sea.decrypt(ownerEncryptedSharedSecret, this.gunUser._.sea);

            const enc = await this.sea.encrypt(message, sharedSecret);
            const uuid = v4();

            const msgNode = this.gun
                .get(uuid)
                .put({
                    from: this.myAlias,
                    ts,
                    uuid,
                    message: enc
                }, ack => { 
                    this.gunUser.get('chats').get(conversation.uuid).get('messages').set(msgNode); 
                });
        }
    }

    async sendMessage2(conversation, message, ts) {
        if (this.isLoggedIn()) {
            conversation.members.forEach(async member => {
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
                            this.gunUser.get('chats').get(conversation.uuid).get('messages').set(msgNode); 
                        });
                    }
            });
        }
    }

    async sendMessage(conversation, message, ts) {
        if (this.isLoggedIn()) {
            conversation.members.forEach(async member => {
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

    async decryptMessage3(chatId, messageObj) {
        const msgCpy = Object.assign({}, messageObj);
        const chatLink = this.gunUser.get('chatLinks').get(chatId);

        const ownerEncryptedSharedSecret = await chatLink.get('ownerEncryptedSharedSecret').then();
        const sharedSecret =  await this.sea.decrypt(ownerEncryptedSharedSecret, this.gunUser._.sea);

        msgCpy.message = await this.sea.decrypt(messageObj.message, sharedSecret);
        return msgCpy;
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
        const copy = {...data};
        delete copy._;
        return copy;
    }

    private nodeData(refs) {
        return Promise.all(Object.keys(refs).map(k => this.gun.get(k)
            .then(this.cleanup)));
    }


    logout() {
        this.gunUser.leave();
    }
}