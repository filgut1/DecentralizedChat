import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GunDB } from '@app/_services';
import { NavController } from '@ionic/angular';
import { ModalController } from '@ionic/angular';
import { AddEditComponent } from '@app/contacts/add-edit.component';
import { JoinChatComponent } from '@app/join-chat/join-chat.component';
import { Subject } from 'rxjs';


@Component({
  selector: 'app-chats',
  templateUrl: './chats.page.html'
})
export class ChatsPage implements OnInit {
  public chats: Map<any, any>;
  public searchString: String;
  public asyncChats = new Subject<any>();

  constructor(
    private db: GunDB,
    public modalController: ModalController,
    public navCtrl: NavController
  ) { 
    this.chats = new Map();
  }

  ngOnInit() {
    this.db.on$(this.db.myChats.map()).subscribe(async convo => {
      if (convo.members) {
        convo.members = await this.db.getConvoMembers(convo.members['#']);
      } 
      this.chats.set(convo.uuid, convo);
      this.asyncChats.next(Array.from(this.chats.keys()));
    });
  }

  async doRefresh(event) {
    await this._loadChats();
    event.target.complete();
  }

  private async _loadChats() {
    const res = await this.db.getUserConversations();
    
    res.forEach(async convo => {
      if (convo.members) {
        convo.members = await this.db.getConvoMembers(convo.members['#']);
      } 
      this.chats.set(convo.uuid, convo);
      this.asyncChats.next(Array.from(this.chats.keys()));
    });
  }

  async loadConvo(convo) {
   this.navCtrl.navigateForward(['conversation'], {state: convo});
  }

  async newChat() {
    const modal = await this.modalController.create({
        component: AddEditComponent,
        swipeToClose: true
    });
    return await modal.present();
  }

  async joinChat() {
    const modal = await this.modalController.create({
      component: JoinChatComponent,
      swipeToClose: true
    });
    return await modal.present();
  }

  getChatName(chat) {
    if (chat.name) return chat.name
    else {
      const res = chat.members && chat.members.find(e => e.alias !== this.db.myAlias);
      return res && res.alias || 'unnamed chat';
    }
  }

  trackByUuid(_index: number, item: any) {
    return item;
  }

  get chatKeys() {
    return Array.from(this.chats.keys());
  }


}
