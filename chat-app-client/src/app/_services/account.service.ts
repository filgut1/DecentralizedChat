import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from '@environments/environment';
import { User } from '@app/_models';
import { GunDB } from '@app/_services';

@Injectable({ providedIn: 'root' })
export class AccountService {
    private userSubject: BehaviorSubject<User>;
    public user: Observable<User>;

    constructor(
        private router: Router,
        private gunDB: GunDB
    ) {
        this.userSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('user')));
        this.user = this.userSubject.asObservable();
    }

    public get userValue(): User {
        return this.userSubject.value;
    }

    login(username, password) {
        return this.gunDB.authenticate(username, password)
            .then((user:User) => {
                this.userSubject.next(user);
                return user; 
            });
    }

    logout() {
        // remove user from local storage and set current user to null
        localStorage.removeItem('user');
        this.userSubject.next(null);
        this.gunDB.logout();
        this.router.navigate(['/login']);
    }

    register(user: User) {
        return this.gunDB.createUser(user)
            .then((user: User) => {
                this.userSubject.next(user);
                return user;
            });
    }
}