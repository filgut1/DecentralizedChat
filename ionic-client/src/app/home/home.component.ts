import { Component, OnInit } from '@angular/core';
import { User } from '@app/_models';
import { AccountService } from '@app/_services';
import { GunDB } from '@app/_services';
import { on$ } from '@app/_helpers';

@Component({ 
    templateUrl: 'home.component.html'
})
export class HomeComponent {
    user: User;
    public epub;
    public message;
    public alias;
    public contacts;
    loading = false;
    currentConvo: any;

    constructor(
        private accountService: AccountService
    ) {
        this.user = this.accountService.userValue;
    }

    logout() {
        this.accountService.logout();        
    }
}