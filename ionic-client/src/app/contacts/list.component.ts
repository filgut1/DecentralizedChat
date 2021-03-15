import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';

import { AccountService } from '@app/_services';
import { GunDB } from '@app/_services';
import { on$ } from '@app/_helpers';

@Component({ templateUrl: 'list.component.html' })
export class ListComponent implements OnInit {
    contacts: Map<any, any>;

    constructor(
        private db: GunDB
    ) {
        this.contacts = new Map();
    }

    ngOnInit() {
        this.db.on$(this.db.gunUser.get('contacts')).subscribe(res => {
            Object.keys(res).forEach(async path => {
              const user = this.db.gun.get(path);
              this.contacts.set(path, (await this.db.$once(user)).epub);
            });
          });
    }

    deleteContact(id: string) {
    }
}