import { ChangeDetectorRef, Component, OnChanges, OnInit } from '@angular/core';
import { User } from '@app/_models';
import { AccountService } from '@app/_services';
import { GunDB } from '@app/_services';
import { on$ } from '@app/_helpers';
import { Router } from '@angular/router';

@Component({ 
    templateUrl: 'home.component.html',
    styleUrls: ['./home.component.less']
})
export class HomeComponent implements OnInit, OnChanges  {
    user: User;
    public epub;
    public message;
    public alias;
    public contacts;
    loading = false;
    currentConvo: any;

    constructor(
        private accountService: AccountService,
        private db: GunDB, 
        private router: Router,
        private cd: ChangeDetectorRef,
    ) {
        this.user = this.accountService.userValue;
        this.currentConvo = this.router.getCurrentNavigation() && 
            this.router.getCurrentNavigation().extras.state;
    }

    ngOnInit() {
    }

    ngOnChanges() {
        debugger;
    }

    convoChange(convo) {
        this.currentConvo = {...convo};
        this.cd.detectChanges();
    }

}