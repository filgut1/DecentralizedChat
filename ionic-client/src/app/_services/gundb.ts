import { Injectable } from '@angular/core';
import { Observable, fromEventPattern  } from 'rxjs';
import { User } from '@app/_models';
import { pick }  from 'underscore/underscore-esm';
import { v4 } from 'uuid';
import * as Gun from 'gun/gun';

require('gun/sea');

@Injectable({ providedIn: 'root' })
export class GunDB {
    readonly gun:any;
    readonly gunUser:any;
    readonly sea:any;
    constructor() {
        this.gun = Gun('http://192.168.0.15:3001/gun');
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
        return this.gun.get('convos').get('to').get(this.myEpub).get('from').get(epub);
    }

    messagesTo(epub) {
        return this.gunUser.get('sent').get(epub);
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
        return new Promise((resolve, reject) => {
            this.gunUser.create(user.alias, user.password, ack => {
                if (ack.err) {
                    reject(ack.err);
                } else {
                    this.gunUser.auth(user.alias, user.password, async ack => {
                        const { alias } = user; // Don't store the password!
                        this.gun.get('users')
                            .get(alias)
                            .put({epub: ack.sea.epub, alias});

                        resolve(this.gunUser.is);
                    });
                }
            });
        });
    }

    addContact(alias, epub): Promise<any> {
        if (this.isLoggedIn()) {
            const contact = this.gun.get('users').get(alias);

            return new Promise(resolve => {
                this.gunUser.get('contacts').set(contact, () => resolve(true));
            });
        }
    }

    $getAllContacts(): Promise<any> {
        if (this.isLoggedIn()) {
            const node = this.gunUser.get('contacts');
            return this.$once(node);
        } else {
            return Promise.reject();
        }
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
    
    // Find and subscribe to user
    $findUserByAlias(alias): Promise<any> {
        if (this.isLoggedIn()) {
            return new Promise((resolve, reject) => {
                this.gun.get('users').get(alias).once(d => {
                    d ? resolve(this.cleanup(d)) : reject(d);
                });
            });
        }
    }

    async sendMessage(epub, alias, message, ts) {
        if (this.isLoggedIn()) {
            const secret = await this.sea.secret(epub, this.gunUser._.sea);
            const enc = await this.sea.encrypt(message, secret);
            const encForMe = await this.sea.encrypt(message, this.gunUser._.sea);
            const uuid = v4();
    
            this.gunUser
                .get('sent')
                .get(epub)
                .get(uuid)
                .put(JSON.stringify({
                    from: this.myAlias,
                    epub: this.myEpub,
                    ts: ts,
                    uuid,
                    message: encForMe
                }));
            this.gun
                .get('convos')
                .get('to')
                .get(epub)
                .get('from')
                .get(this.myEpub)
                .get(uuid)
                .put(JSON.stringify({
                    from: this.myAlias,
                    epub: this.myEpub,
                    ts: ts,
                    uuid,
                    message: enc
                }));
        }
    }

    async decryptMyOwnMessage(messageObj) {
        messageObj.message = await this.sea.decrypt(messageObj.message, this.gunUser._.sea);
        return messageObj;
    }

    async decryptMessage(messageObj) {
        const secret = await this.sea.secret(messageObj.epub, this.gunUser._.sea);
        messageObj.message = await this.sea.decrypt(messageObj.message, secret);
        return messageObj;
    }

    onAuth$(): Observable<any> {
        return new Observable(o => this.gun.on('auth', ack => {
            o.next(ack);
            o.complete();
        }));
    }

    $onAuth(): Promise<any> {
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

    $once(node): Promise<any> {
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

    logout() {
        this.gunUser.leave();
    }
}