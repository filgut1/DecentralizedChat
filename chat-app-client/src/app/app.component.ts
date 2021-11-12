import { Component, OnInit } from '@angular/core';

import { AccountService } from './_services';
import { User } from '@app/_models';
import { GunDB } from '@app/_services';

@Component({ selector: 'app', templateUrl: 'app.component.html' })
export class AppComponent implements OnInit {
    user: User;
    loading = false;
    constructor(
        public accountService: AccountService,
        private db: GunDB
    ) { this.accountService.user.subscribe(x => this.user = x);}

    async ngOnInit() {
        if (this.user && !this.db.isLoggedIn) {
            this.loading = true;
            await this.db.onAuth();
            this.loading = false;
        }
        // In case of refresh, need to wait for authentication
        // to occurr again automatically since user.recall({sessionStorage: true}) was used
    }

    logout() {
        this.accountService.logout();
    }
}