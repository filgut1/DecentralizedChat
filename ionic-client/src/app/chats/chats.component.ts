import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { GunDB } from '@app/_services';
import { NavController } from '@ionic/angular';
import { ModalController } from '@ionic/angular';


@Component({
  selector: 'app-chats',
  templateUrl: './chats.component.html'
})
export class ChatsComponent implements OnInit {
  @Input() currentConvo: any;
  @Output() currentConvoChange = new EventEmitter<any>();
  public chats: Map<any, any>;
  public searchString: String;
  public loading: Boolean = false;

  constructor(
    private db: GunDB,
    public modalController: ModalController,
    public navCtrl: NavController
  ) { 
    this.chats = new Map();
  }

  ngOnInit() {
    this.db.on$(this.db.myConversations.map()).subscribe(convo => {
      this.chats.set(convo.uuid, convo);
    });
  }

  async doRefresh(event) {
    await this._loadChats();
    event.target.complete();
  }

  private async _loadChats() {
    this.loading = true;
    const friends = await this.db.getAllContacts();
    const res = await this.db.getUserConversations();
    
    res.forEach(convo => {
      this.chats.set(convo.uuid, convo);
    });
  }

  async loadConvo(convo) {
   const chatData = await this.db.getConversation(convo.uuid);
   this.navCtrl.navigateForward(['conversation'], {state: chatData});
  }

  get chatKeys() {
    return Array.from(this.chats.keys());
  }
}
