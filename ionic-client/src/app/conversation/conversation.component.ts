import { Component, Input, OnInit, SimpleChanges, AfterViewChecked, ViewChild, OnDestroy, ChangeDetectorRef, ChangeDetectionStrategy, NgZone, ApplicationRef } from '@angular/core';
import { merge, Subject, Subscriber, Subscription  } from 'rxjs';
import { delay, takeUntil } from 'rxjs/operators';
import { Router } from '@angular/router';
import { GunDB } from '@app/_services';
import { Message, User } from '@app/_models';
import { AccountService } from '@app/_services';
import { IonContent } from '@ionic/angular'

@Component({
  selector: 'app-conversation',
  templateUrl: './conversation.component.html',
  styleUrls: ['./conversation.component.less']
})
export class ConversationComponent implements OnInit, OnDestroy {
  @ViewChild(IonContent, { static: false }) scrollBottom: IonContent;
  public loading: Boolean = false;
  public messageContent: String = '';
  public user: User;
  public sortedMessages: Array<Message>;
  public messagesSubscription: Subscription;
  public messagesSubscriber: Subscriber<any>;
  private readonly destroy = new Subject();
  private dmContact;
  @Input() currentConvo: any;
  constructor(
    private db: GunDB,
    private accountService: AccountService,
    private router: Router,
    private cd: ChangeDetectorRef,
    private ngZone: NgZone,
    private appRef: ApplicationRef
  ) { 
    this.user = this.accountService.userValue;
  }

  async ngOnInit() {
    this.currentConvo = this.router.getCurrentNavigation().extras.state;
    this.currentConvo.members = await this.db.getConvoMembers(this.currentConvo.members);
    this._setupSubscriptions();
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
      merge(
        ...this.currentConvo.members.map(m => 
          this.db.messagesObservable(this.currentConvo.uuid, m.pub))
      ).pipe(takeUntil(this.destroy))
      .subscribe(handleMessage);
    } else {
      this.dmContact = this.currentConvo.members.filter(m => m.pub && m.pub !== this.user.pub)[0];
      merge(
        this.db.messagesObservable(this.dmContact.epub, this.user.pub),
        this.db.messagesObservable(this.user.epub, this.dmContact.pub)
      ).pipe(takeUntil(this.destroy))
      .subscribe(handleMessage);
    }
  }
 
  ionViewDidEnter(){
    this.scrollToBottom();
  }

  scrollToBottom() {  
    setTimeout(() => {
      this.scrollBottom.scrollToBottom(300);
    }, 500)
  }

  async sendMessage() {
    if (this.messageContent) {
      console.log(this.messageContent);
      const ts = new Date().getTime();
      if (this.currentConvo.type === 'group') {
        await this.db.sendGroupMessage(this.currentConvo, this.messageContent, ts);
        this._clearChat();
      } else {
        await this.db.sendDirectMessage(this.dmContact, this.messageContent, ts);
        this._clearChat();
      }
    }
  }  

  isReceivedMessage(message) {
    return message && this.user.alias !== message.from;
  }

  checkLastMessage(i) {
    return i > 0 && this.sortedMessages.length > 1 &&
      this.sortedMessages[i - 1].from === this.sortedMessages[i].from;
  }

  trackByUuid(_index: number, item: any) {
    return item.uuid;
  }

  ngOnDestroy() {
    this.destroy.next();
    this.destroy.complete();
  }

  private _clearChat() {
    this.messageContent = new String('');
  }
}
