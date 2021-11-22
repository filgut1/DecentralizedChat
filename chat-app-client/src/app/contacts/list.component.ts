import { Component, OnDestroy, OnInit } from '@angular/core';
import { AccountService, GunDB } from '@app/_services';
import { Router } from '@angular/router';
import { User } from '@app/_models';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({ templateUrl: 'list.component.html' })
export class ListComponent implements OnInit, OnDestroy {
    public user: User;
    contacts: Array<any> = [];
    private contactsMap = new Map();
    private readonly destroy = new Subject();

    constructor(
        private db: GunDB,
        private router: Router,
        private accountService: AccountService
    ) {
        this.user = this.accountService.userValue;
    }

    async ngOnInit() {
      this.db.myContactsObservable()
      .pipe(takeUntil(this.destroy))
      .subscribe((contact: User) => {
        this.contactsMap.set(contact.pub, contact);
        this.contacts = [...this.contactsMap.values()];
      });
    }

    async openDirectChat(contact) {
      const directChat = await this.db.gunUser.get('chats').get(contact.epub).then();
      if (!directChat) {
        await this.db.createDirectChat(contact);
        const chat = await this.db.gunUser.get('chats').get(contact.epub).then();
        chat.members = [contact, this.user];
        this.router.navigate(['/'], {state: chat});
      } else {
        this.router.navigate(['/'], {state: directChat});
      }
    }

    ngOnDestroy() {
      this.destroy.next();
      this.destroy.complete();
    }
}