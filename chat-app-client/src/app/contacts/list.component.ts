import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';

import { AccountService } from '@app/_services';
import { GunDB } from '@app/_services';
import { on$ } from '@app/_helpers';

@Component({ templateUrl: 'list.component.html' })
export class ListComponent implements OnInit {
    contacts: Array<any> = [];

    constructor(
        private db: GunDB
    ) {}

    async ngOnInit() {
        this.contacts = await this.db.getAllContacts();
    }

    deleteContact(id: string) {
    }
}