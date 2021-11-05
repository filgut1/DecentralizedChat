import { Component, OnInit } from '@angular/core';
import { GunDB } from '@app/_services';
import { Subject } from 'rxjs';
import { ModalController } from '@ionic/angular';
import { AddEditComponent } from '@app/_components/add-edit.component';

@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.page.html',
  styleUrls: ['./contacts.page.css'],
})
export class ContactsPage implements OnInit {
  public asyncContacts = new Subject<any>();

  constructor(
    private db: GunDB,
    private modalController: ModalController
  ) { }

  ngOnInit() {
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
    return await modal.present();
  }

  private async _loadContacts() {
    const contacts = await this.db.getAllContacts();
    this.asyncContacts.next([...contacts]);
  }

}
