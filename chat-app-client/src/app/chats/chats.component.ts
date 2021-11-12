import { Component, OnInit, Input, Output, EventEmitter, OnDestroy, ChangeDetectorRef } from '@angular/core';
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
  public asyncChats = new Subject<any>();
  private readonly destroy = new Subject();

  constructor(
    private db: GunDB,
    private cd: ChangeDetectorRef,
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
    if (chat.members && !Array.isArray(chat.members) && chat.members['#']) {
      chat.members = await this.db.getConvoMembers(chat.members['#']);
    } 
    if (chat.uuid) {
      this.chats.set(chat.uuid, chat);
      this.asyncChats.next(Array.from(this.chats.keys()));
      this.cd.detectChanges();
    }
  }

  async loadConvo(convo) {
    this.currentConvoChange.emit(convo);
  }

  get chatKeys() {
    return Array.from(this.chats.keys());
  }

  ngOnDestroy() {
    this.destroy.next();
    this.destroy.complete();
  }
}
