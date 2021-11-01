import { Component, Input, OnInit, SimpleChanges, AfterViewChecked, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { combineLatest, merge, Observable, Subject, Subscriber, Subscription  } from 'rxjs';
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
export class ConversationComponent implements OnInit, AfterViewChecked  {
  @ViewChild(IonContent, { static: false }) scrollBottom: IonContent;
  public loading: Boolean = false;
  public messageContent: String = '';
  public user: User;
  public conversation: Array<any> = [];
  public asyncConvo$ = new Subject<any[]>();
  public messagesSubscription: Subscription;
  public messagesSubscriber: Subscriber<any>;
  private members: Array<any> = [];
  @Input() currentConvo: any;
  constructor(
    private db: GunDB,
    private accountService: AccountService,
    private router: Router,
    private cdr: ChangeDetectorRef,
  ) { 
    this.user = this.accountService.userValue;
  }

  async ngOnInit() {
    this.currentConvo = this.router.getCurrentNavigation().extras.state;
    
    merge(
      ...this.currentConvo.members.map(m => this.db.messagesObservable2(this.currentConvo.uuid, m.pub))
    ).subscribe(async (message: any) => {
      const res = await this.db.decryptMessage3(this.currentConvo.uuid, message);
      this.conversation.push({
        message: res.message,
        ts: res.ts,
        from: res.from
      });
      this.conversation.sort((a, b) => a.ts - b.ts);
      this.asyncConvo$.next([...this.conversation]);
      this.scrollToBottom();
    });

    /* this.db.messagesObservable(this.currentConvo.uuid)
    .subscribe(async (message: any) => {
      let res;
      if (message.fromEpub === this.db.myEpub) {
        res = await this.db.decryptMyOwnMessage(message);
      } else {
        res = await this.db.decryptMessage(message);
      }
      this.conversation.push({
        message: res.message,
        ts: res.ts,
        from: res.from
      });
      this.conversation.sort((a, b) => a.ts - b.ts);
      this.asyncConvo$.next([...this.conversation]);
      this.scrollToBottom();
    });
    */
  }

  ngOnChanges(changes: SimpleChanges) {
    this.scrollToBottom();
  }

  ngAfterViewChecked() {        
    this.scrollToBottom();    
  } 

  ionViewDidEnter(){
    this.scrollToBottom();
  }

  scrollToBottom(): void {
    try {
        this.scrollBottom.scrollToBottom(300);
    } catch(err) { }
  }

  sendMessage() {
    console.log(this.messageContent);
    const ts = new Date().getTime();
    if (this.currentConvo) {
      this.db.sendMessage3(this.currentConvo, this.messageContent, ts);
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

  private _clearChat() {
    this.messageContent = '';
  }
}
