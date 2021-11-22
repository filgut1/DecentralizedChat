import { Component, Input, OnInit, SimpleChanges, AfterViewChecked, ViewChild, ElementRef, OnDestroy, ChangeDetectorRef, OnChanges } from '@angular/core';
import { merge, Observable, Subject, Subscriber, Subscription  } from 'rxjs';
import { GunDB } from '@app/_services';
import { Message, User } from '@app/_models';
import { AccountService } from '@app/_services';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-conversation',
  templateUrl: './conversation.component.html',
  styleUrls: ['./conversation.component.less']
})
export class ConversationComponent implements OnDestroy, OnChanges, AfterViewChecked  {
  @ViewChild('scrollBottom') private scrollBottom: ElementRef;
  public loading: Boolean = false;
  public messageContent: String = '';
  public user: User;
  public conversation = new Map<any, any>();
  public asyncConvo$ = new Subject<any[]>();
  public dmContact;
  public sortedMessages: Array<Message>;
  private members: Array<any> = [];
  private messagesSubscription: Subscription;
  private readonly destroy = new Subject();
  @Input() currentConvo: any;
  constructor(
    private db: GunDB,
    private accountService: AccountService,
    private cd: ChangeDetectorRef
  ) { 
    this.user = this.accountService.userValue;
  }

  ngAfterViewChecked() {        
    this.scrollToBottom();        
  } 

  scrollToBottom(): void {
    try {
      this.scrollBottom.nativeElement.scrollTop = this.scrollBottom.nativeElement.scrollHeight;
    } catch(err) { }
  }

  async ngOnChanges(changes: SimpleChanges) {
    // Cleanup any previous subscriptions
    if (this.messagesSubscription) {
      this.messagesSubscription.unsubscribe();
    }
    if (changes.currentConvo.currentValue) {
      this.currentConvo.members = await this.db.getConvoMembers(changes.currentConvo.currentValue.members);
      this._setupSubscriptions();
    }
  }

  private _setupSubscriptions() {
    const conversation = new Map<string, Message>();
    const handleMessage = async (message: Message) => {
      let res;
      if (message.message) {
        if (this.currentConvo.type === 'group') {
          res = await this.db.decryptMessage(this.currentConvo.uuid, message);
        } else {
          if (message.from === this.user.alias) {
            res = await this.db.decryptMyOwnMessage(message);
          } else {
            res = await this.db.decryptDirectMessage(this.dmContact.epub, message);
          }
        } 
        conversation.set(res.uuid, res);
      }
      this.sortedMessages = [...conversation.values()]
        .sort((a, b) => a.ts - b.ts);
      this.scrollToBottom();
    };
    if (this.currentConvo.type === 'group') {
      this.messagesSubscription = merge(
        ...this.currentConvo.members.map(m => 
          this.db.messagesObservable(this.currentConvo.uuid, m.pub))
      ).pipe(takeUntil(this.destroy))
      .subscribe(handleMessage);
    } else {
      this.dmContact = this.currentConvo.members.filter(m => m.pub && m.pub !== this.user.pub)[0];
      this.messagesSubscription = merge(
        this.db.messagesObservable(this.dmContact.epub, this.user.pub),
        this.db.messagesObservable(this.user.epub, this.dmContact.pub)
      ).pipe(takeUntil(this.destroy))
      .subscribe(handleMessage);
    }
  }
 

  sendMessage() {
    console.log(this.messageContent);
    const ts = new Date().getTime();
    if (this.currentConvo.type === 'group') {
      this.db.sendGroupMessage(this.currentConvo, this.messageContent, ts);
      this._clearChat();
    } else {
      this.db.sendDirectMessage(this.dmContact, this.messageContent, ts);
      this._clearChat();
    }
  } 

  isReceivedMessage(message) {
    return this.user.alias !== message.from;
  }

  checkLastMessage(i) {
    return i > 0 && this.conversation.size > 1 &&
      [...this.conversation.values()][i - 1].from === [...this.conversation.values()][i].from;
  }

  trackByUuid(_index: number, item: any) {
    return item.uuid;
  }

  private _clearChat() {
    this.messageContent = '';
  }

  ngOnDestroy() {
    this.destroy.next();
    this.destroy.complete();
  }
}
