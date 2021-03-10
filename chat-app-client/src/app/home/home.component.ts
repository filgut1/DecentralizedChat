import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { User } from '@app/_models';
import { AccountService } from '@app/_services';
import { GunDB } from '@app/_services';
import { on$ } from '@app/_helpers';

@Component({ templateUrl: 'home.component.html' })
export class HomeComponent implements OnInit {
    user: User;
    public epub;
    public message;
    public alias;

    constructor(
        private accountService: AccountService,
        private db: GunDB
    ) {
        this.user = this.accountService.userValue;
    }

    ngOnInit() {
        // Subscribe to my received messages table
        const receivedMessages = this.db.gun
            .get('convos')
            .get('to')
            .get(this.db.gunUser.is.epub)
            .get('messages');
        const receivedMessages$ = on$(receivedMessages, true, {change: true});
        receivedMessages$.subscribe(this.handleNewMessage.bind(this));
    }

    handleNewMessage(data) {
        this.db.gun.get(Object.values(data)[0]).once(async e => {
            const secret = await this.db.sea.secret(e.epub, this.db.gunUser._.sea);
            const msg = await this.db.sea.decrypt(e.message, secret);
            console.log(msg);
        });
    }

    sendMessage() {
        this.db.sendMessage(this.epub, this.alias, this.message);
    }
}