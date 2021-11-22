import { Component, OnInit, Input, Output, EventEmitter, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GunDB } from '@app/_services';
import { NavController } from '@ionic/angular';
import { ModalController } from '@ionic/angular';
import { AddEditComponent } from '@app/_components/add-edit.component';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';


@Component({
  selector: 'app-chats',
  templateUrl: './chats.page.html'
})
export class ChatsPage implements OnInit, OnDestroy  {
  public searchString: String;
  public chats = [];
  private chatsMap = new Map();
  private readonly destroy = new Subject();

  constructor(
    private db: GunDB,
    private cd: ChangeDetectorRef,
    private navCtrl: NavController,
    public modalController: ModalController,
  ) { }

  ngOnInit() {
    this.db.myChatsObservable()
    .pipe(takeUntil(this.destroy))
    .subscribe(chat => {
      this._updateChats(chat);
    });
  }

  async doRefresh(event) {
    await this._loadChats();
    event.target.complete();
  }

  private async _loadChats() {
    const res = await this.db.getUserConversations();
    res.forEach(chat => {
      this._updateChats(chat);
    });
  }

  private async _updateChats(chat) {
    if (chat.uuid) {
      this.chatsMap.set(chat.uuid, chat);
      this.chats = [...this.chatsMap.values()];
    }
  }

  async loadConvo(convo) {
   this.navCtrl.navigateForward(['conversation'], {state: convo});
  }

  async newChat() {
    const modal = await this.modalController.create({
        component: AddEditComponent,
        swipeToClose: true,
        componentProps: {
          'type': 'create'
        }
    });
    await modal.present();
  }

  async joinChat() {
    const modal = await this.modalController.create({
      component: AddEditComponent,
      swipeToClose: true,
      componentProps: {
        'type': 'join'
      }
    });
    await modal.present();
  }

  trackByUuid(_index: number, item: any) {
    return item;
  }

  get chatKeys() {
    return Array.from(this.chats.keys());
  }

  ngOnDestroy() {
    this.destroy.next();
    this.destroy.complete();
  }
}
