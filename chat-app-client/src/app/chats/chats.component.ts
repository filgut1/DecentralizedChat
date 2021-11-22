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
  public searchString: String;
  public chats = [];
  private chatsMap = new Map();
  private readonly destroy = new Subject();

  constructor(
    private db: GunDB,
    private cd: ChangeDetectorRef,
) { }

  ngOnInit() {
    if (this.currentConvo) {
      this.cd.detectChanges();
      setTimeout(() => {
        this.currentConvoChange.emit(this.currentConvo);
      }, 500);
    }
    this.db.myChatsObservable()
    .pipe(takeUntil(this.destroy))
    .subscribe(chat => {
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
