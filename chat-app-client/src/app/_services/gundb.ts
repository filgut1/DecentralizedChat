import { Injectable } from '@angular/core';
import { Observable, fromEventPattern  } from 'rxjs';
import { User } from '@app/_models';

import Gun from 'gun/gun';
import { on$ } from '@app/_helpers';
require('gun/sea');

@Injectable({ providedIn: 'root' })
export class GunDB {
    readonly gun:any;
    readonly gunUser:any;
    readonly sea:any;
    constructor() {
        this.gun = Gun('http://127.0.0.1:3001/gun');
        this.sea = Gun.SEA;
        this.gunUser = this.gun.user();
    }

    authenticate(username:String, password:String): Promise<any> {
        return new Promise((resolve, reject) => {
            this.gunUser.auth(username, password, ack => {                
                if (ack.err) {
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
                            .put({pub: ack.sea.pub, epub: ack.sea.epub});

                        resolve(this.gunUser.is);
                    });
                }
            });
        });
    }

    addContact(alias, epub): void {
        if (this.gunUser.is) {
            this.gunUser.get('contacts').get(alias).put({epub});
        }
    }

    getCurrentUserProfile(): Promise<any> {
        return new Promise(resolve => {
            this.gunUser.get('profile').once(data => {
                resolve(data);
            });
        });
    }

    async sendMessage(epub, message) {
        if (this.gunUser.is) {
            const secret = await this.sea.secret(epub, this.gunUser._.sea);
            const enc = await this.sea.encrypt(message, secret);
            this.gunUser.get
            this.gun.get('convos')
                .get(epub)
                .get('messages')
                .get((new Date()).getTime())
                .put({
                    from: this.gunUser.is.alias,
                    epub: this.gunUser.is.epub,
                    message: enc
                });
        }
    }

    logout() {
        this.gunUser.leave();
    }
}