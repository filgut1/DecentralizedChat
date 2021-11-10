import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { GunDB } from '@app/_services';
import { on$ } from '@app/_helpers';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';


@Component({
  selector: 'app-chats',
  templateUrl: './chats.component.html',
  styleUrls: ['./chats.component.less']
})
export class ChatsComponent implements OnInit, OnDestroy {
  @Input() currentConvo: any;
  @Output() currentConvoChange = new EventEmitter<any>();
  public chats: Map<any, any>;
  public searchString: String;
  public loading: Boolean = false;
  public asyncChats = new Subject<any>();
  private readonly destroy = new Subject();

  constructor(
    private db: GunDB
  ) { 
    this.chats = new Map();
  }

  ngOnInit() {
    this.db.myChatsObservable()
    .pipe(takeUntil(this.destroy))
    .subscribe(chat => {
      this._updateChats(chat);
    });
  }

  private async _updateChats(chat) {
    if (!Array.isArray(chat.members)) {
      chat.members = await this.db.getConvoMembers(chat.members['#']);
    } 
    if (chat.uuid) {
      this.chats.set(chat.uuid, chat);
      this.asyncChats.next(Array.from(this.chats.keys()));
    }
  }

  async loadConvo(user) {
    this.currentConvoChange.emit(user);
  }

  get chatKeys() {
    return Array.from(this.chats.keys());
  }

  ngOnDestroy() {
    this.destroy.next();
    this.destroy.complete();
  }
}
