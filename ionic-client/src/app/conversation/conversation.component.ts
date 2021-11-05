import { Component, Input, OnInit, SimpleChanges, AfterViewChecked, ViewChild, OnDestroy } from '@angular/core';
import { merge, Subject, Subscriber, Subscription  } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Router } from '@angular/router';
import { GunDB } from '@app/_services';
import { User } from '@app/_models';
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
  public conversation: Array<any> = [];
  public asyncConvo$ = new Subject<any[]>();
  public messagesSubscription: Subscription;
  public messagesSubscriber: Subscriber<any>;
  private readonly destroy = new Subject();
  private members: Array<any> = [];
  @Input() currentConvo: any;
  constructor(
    private db: GunDB,
    private accountService: AccountService,
    private router: Router,
  ) { 
    this.user = this.accountService.userValue;
  }

  async ngOnInit() {
    this.currentConvo = this.router.getCurrentNavigation().extras.state;
    
    merge(
      ...this.currentConvo.members.map(m => 
        this.db.messagesObservable(this.currentConvo.uuid, m.pub))
    ).pipe(takeUntil(this.destroy))
    .subscribe(async (message: any) => {
      const res = await this.db.decryptMessage(this.currentConvo.uuid, message);
      this.conversation.push({
        message: res.message,
        ts: res.ts,
        from: res.from
      });
      this.conversation.sort((a, b) => a.ts - b.ts);
      this.asyncConvo$.next([...this.conversation]);
      this.scrollToBottom();
    });
  }

  ionViewDidEnter(){
    this.scrollToBottom();
  }

  scrollToBottom(): void {
        setTimeout(() => {
      this.scrollBottom.scrollToBottom(300);
   }, 1000);
  }

  sendMessage() {
    console.log(this.messageContent);
    const ts = new Date().getTime();
    if (this.currentConvo) {
      this.db.sendMessage(this.currentConvo, this.messageContent, ts);
      this._clearChat();
    }
  }  

  isReceivedMessage(message) {
    return message && this.user.alias !== message.from;
  }

  checkLastMessage(i) {
    return this.conversation && i > 0 && 
      this.conversation.length > 1 &&
      this.conversation[i - 1].from === this.conversation[i].from;
  }

  trackByUuid(_index: number, item: any) {
    return item.uuid;
  }

  ngOnDestroy() {
    this.destroy.next();
    this.destroy.complete();
  }

  private _clearChat() {
    this.messageContent = '';
  }
}
