import { Component, OnInit } from '@angular/core';
import { AccountService, GunDB } from '@app/_services';
import { Router } from '@angular/router';
import { User } from '@app/_models';

@Component({ templateUrl: 'list.component.html' })
export class ListComponent implements OnInit {
    public user: User;
    contacts: Array<any> = [];
    loading = true;

    constructor(
        private db: GunDB,
        private router: Router,
        private accountService: AccountService
    ) {
        this.user = this.accountService.userValue;
    }

    async ngOnInit() {
        this.contacts = await this.db.getAllContacts();
        this.loading = false;
    }

    async openDirectChat(contact) {
        const directChat = await this.db.gunUser.get('chats').get(contact.epub).then();
        if (!directChat) {
          await this.db.createDirectChat(contact);
          const chat = await this.db.gunUser.get('chats').get(contact.epub).then();
          chat.members = [contact, this.user];
          this.router.navigate(['/'], {state: chat});
        } else {
          if (!Array.isArray(directChat.members)) {
            directChat.members = await this.db.getConvoMembers(directChat.members['#']);
          } 
          this.router.navigate(['/'], {state: directChat});
        }
      }
}