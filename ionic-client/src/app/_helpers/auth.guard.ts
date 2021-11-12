import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { NavController } from '@ionic/angular';
import { AccountService } from '@app/_services';
import { GunDB } from '@app/_services';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
    constructor(
        private router: Router,
        private accountService: AccountService,
        private db: GunDB,
        public navCtrl: NavController
    ) {}

    async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        try {
            const user = this.db.isLoggedIn && this.accountService.userValue || await this.db.onAuth();
            if (user) {
                // authorised so return true
                return true;
            }
        } catch(err) {
            // not logged in so redirect to login page with the return url
            this.navCtrl.navigateRoot(['/login']);
            this.router.navigate(['/login'], { queryParams: { returnUrl: state.url }});
            return false;
        }

        // not logged in so redirect to login page with the return url
        this.navCtrl.navigateRoot(['/login']);
        this.router.navigate(['/login'], { queryParams: { returnUrl: state.url }});
        return false;
    }
}