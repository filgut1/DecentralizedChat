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
    this.conversation = new Map();
    this.asyncConvo$.next([...this.conversation.values()]);
    if (changes.currentConvo.currentValue) {
      if (this.currentConvo.type === 'group') {
        this.messagesSubscription = merge(
          ...this.currentConvo.members.map(m => 
            this.db.messagesObservable(this.currentConvo.uuid, m.pub))
        ).pipe(takeUntil(this.destroy))
        .subscribe(async (messages: Array<Message>) => {
          for (const message of Object.values(messages)) {
            const res = await this.db.decryptMessage(this.currentConvo.uuid, message);
            this.conversation.set(message.uuid, {
              message: res.message,
              ts: res.ts,
              from: res.from
            });
          }
          this.conversation = new Map([...this.conversation.entries()].sort((a, b) => a[1].ts - b[1].ts));
          this.asyncConvo$.next([...this.conversation.values()]);
          this.cd.detectChanges();
          this.scrollToBottom();
        });
      } else {
        this.dmContact = this.currentConvo.members.filter(m => m.pub && m.pub !== this.user.pub)[0];
        this.messagesSubscription = merge(
          this.db.messagesObservable(this.dmContact.epub, this.user.pub),
          this.db.messagesObservable(this.user.epub, this.dmContact.pub)
        ).pipe(takeUntil(this.destroy))
        .subscribe(async (messages: Array<Message>) => {
          for (const message of Object.values(messages)) {
            let res;
            if (message.from === this.user.alias) {
              res = await this.db.decryptMyOwnMessage(message);
            } else {
              res = await this.db.decryptDirectMessage(this.dmContact.epub, message);
            }
            this.conversation.set(message.uuid, {
              message: res.message,
              ts: res.ts,
              from: res.from
            });
          }
          this.conversation = new Map([...this.conversation.entries()].sort((a, b) => a[1].ts - b[1].ts));
          this.asyncConvo$.next([...this.conversation.values()]);
          this.cd.detectChanges();
          this.scrollToBottom();
        });
      }
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

  private _clearChat() {
    this.messageContent = '';
  }

  ngOnDestroy() {
    this.destroy.next();
    this.destroy.complete();
  }
}
