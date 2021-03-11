import { Component, OnInit } from '@angular/core';

import { AccountService } from './_services';
import { User } from '@app/_models';

@Component({ selector: 'app', templateUrl: 'app.component.html' })
export class AppComponent {
    user: User;
    profile: any;
    constructor(
        public accountService: AccountService,
    ) { this.accountService.user.subscribe(x => this.user = x);}

    logout() {
        this.accountService.logout();
    }
}