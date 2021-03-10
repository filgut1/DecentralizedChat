import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';

import { AccountService } from '@app/_services';
import { GunDB } from '@app/_services';
import { on$ } from '@app/_helpers';

@Component({ templateUrl: 'list.component.html' })
export class ListComponent implements OnInit {
    contacts = null;

    constructor(
        private accountService: AccountService,
        private db: GunDB
    ) {}

    ngOnInit() {

    }

    deleteUser(id: string) {
    }
}