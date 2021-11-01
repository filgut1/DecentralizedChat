import { Injectable } from '@angular/core';
import { NavController } from '@ionic/angular';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from '@app/_models';
import { GunDB } from '@app/_services';

@Injectable({ providedIn: 'root' })
export class AccountService {
    private userSubject: BehaviorSubject<User>;
    public user: Observable<User>;

    constructor(
        private gunDB: GunDB,
        private navCtrl: NavController
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
        this.navCtrl.navigateRoot(['/login']);
    }

    register(user: User) {
        return this.gunDB.createUser(user);
    }
}