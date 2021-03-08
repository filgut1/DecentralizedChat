import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { User } from '@app/_models';

import Gun from 'gun/gun';
require('gun/sea');

@Injectable({ providedIn: 'root' })
export class GunDB {
    private gun:any
    private gundbUser:any
    constructor() {
        this.gun = Gun('http://127.0.0.1:3001/gun');
        this.gundbUser = this.gun.user();
    }

    authenticate(username:String, password:String) {
        return new Promise((resolve, reject) => {
            this.gundbUser.auth(username, password, ack => {
                if (ack.err) {
                    reject(ack.err);
                } else {
                    this.gundbUser.get('profile').once((data:User) => {
                        resolve(data)
                    });
                }
            });
        });
    }

    createUser(user:User) {
        return new Promise((resolve, reject) => {
            this.gundbUser.create(user.username, user.password, ack => {
                if (ack.err) {
                    reject(ack.err);
                } else {
                    this.gundbUser.auth(user.username, user.password, ack => { 
                        this.gundbUser.get('profile').put(user, () => {
                            resolve(user)
                        });
                    });
                }
            });
        });
    }

    getCurrentUserProfile() {
        return new Promise(resolve => {
            this.gundbUser.get('profile').once(data => {
                resolve(data);
            });
        });
    }
}