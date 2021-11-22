import { Component, OnDestroy, OnInit } from '@angular/core';
import { AccountService, GunDB } from '@app/_services';
import { Subject } from 'rxjs';
import { ModalController, NavController } from '@ionic/angular';
import { AddEditComponent } from '@app/_components/add-edit.component';
import { User } from '@app/_models';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.page.html',
  styleUrls: ['./contacts.page.css'],
})
export class ContactsPage implements OnInit, OnDestroy {
  public asyncContacts = new Subject<any>();
  public user: User;
  public contacts = [];
  private readonly destroy = new Subject();
  private contactsMap = new Map();

  constructor(
    private db: GunDB,
    private modalController: ModalController,
    private navCtrl: NavController,
    private accountService: AccountService
  ) { 
    this.user = this.accountService.userValue;
   }

  ngOnInit() {
    this.db.myContactsObservable()
    .pipe(takeUntil(this.destroy))
    .subscribe((contact: User) => {
      this.contactsMap.set(contact.pub, contact);
      this.contacts = [...this.contactsMap.values()];
    });
  }

  async ionViewDidEnter() {
    await this._loadContacts();
  }

  async doRefresh(event) {
    await this._loadContacts();
    event.target.complete();
  }

  async addContact() {
    const modal = await this.modalController.create({
      component: AddEditComponent,
      componentProps: {
        'type': 'addContact'
      },
      swipeToClose: true
    });
    await modal.present();
  }

  private async _loadContacts() {
    const contacts = await this.db.getAllContacts();
    this.contacts = [...contacts];
  }

  async openDirectChat(contact) {
    const directChat = await this.db.gunUser.get('chats').get(contact.epub).then();
    if (!directChat) {
      await this.db.createDirectChat(contact);
      const chat = await this.db.gunUser.get('chats').get(contact.epub).then();
      chat.members = [contact, this.user];
      this.navCtrl.navigateForward(['conversation'], {state: chat});
    } else {
      this.navCtrl.navigateForward(['conversation'], {state: directChat});
    }
  }

  ngOnDestroy() {
    this.destroy.next();
    this.destroy.complete();
  }

}
