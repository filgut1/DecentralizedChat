import { Component, Input, OnInit, SimpleChanges, AfterViewChecked, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { Observable, Subject, Subscriber, Subscription  } from 'rxjs';
import { Router } from '@angular/router';
import { GunDB } from '@app/_services';
import { User } from '@app/_models';
import { AccountService } from '@app/_services';
import { ThisReceiver } from '@angular/compiler';

@Component({
  selector: 'app-conversation',
  templateUrl: './conversation.component.html',
  styleUrls: ['./conversation.component.less']
})
export class ConversationComponent implements OnInit, AfterViewChecked  {
  @ViewChild('scrollBottom') scrollBottom:any;
  public loading: Boolean = false;
  public messageContent: String = '';
  public user: User;
  public conversation: Array<any>;
  public asyncConvo$ = new Subject<any[]>();
  public messagesSubscription: Subscription;
  public messagesSubscriber: Subscriber<any>;
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
    const epub = this.currentConvo.epub;
    this.loading = true;
    const [msgPathsFrom, msgPathsTo] = await Promise.all([
      this.db.$once(this.db.messagesFrom(epub)),
      this.db.$once(this.db.messagesTo(epub)),
    ]);

    // Create a flattened array of message paths 
    const msgPaths = [].concat.apply([], [
      ...Object.values(msgPathsFrom), 
      ...Object.values(msgPathsTo)]);
    // Need to load and sort existing messages first
    this.conversation = await this.loadMessages(msgPaths);
    this.asyncConvo$.next(this.conversation);
    this.cdr.detectChanges();  
    // this.conversation = [];
    this.loading = false;


    let stopped = false;
    this.db.messagesFrom(epub).map().once(async (data, key, at, ev) => {
      if (stopped) {
        return ev.off()
    }
      const res = await this.db.decryptMessage(data);
      // Check for duplicate messages just in case
      if (!this.conversation.some(e => e.uuid === res.uuid)) {
        this.conversation.push({
          message: res.message,
          ts: res.ts,
          from:res.from
        });
        this.asyncConvo$.next([...this.conversation]);
        this.cdr.detectChanges();    
      }
    });
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
        this.scrollBottom.scrollToBottom(500);
    } catch(err) { }
  }

  async loadMessages(messages) {
    const decryptPromises = [];
    for (let message of messages) {
      message = await this.db.$once(this.db.gun.get(message['#']));
      if (this.isReceivedMessage(message)) {
        decryptPromises.push(this.db.decryptMessage(message));
      } else {
        decryptPromises.push(this.db.decryptMyOwnMessage(message));
      }
    }
    const final = await Promise.all(decryptPromises);
    return final.sort((a, b) => a.ts - b.ts);
  }

  sendMessage() {
    console.log(this.messageContent);
    const ts = (new Date()).getTime();
    if (this.currentConvo) {
      this.db.sendMessage(this.currentConvo.epub, this.currentConvo.alias, this.messageContent, ts);
      this.conversation.push({
          from: this.db.myAlias,
          ts: ts,
          message: this.messageContent
      });
      this.asyncConvo$.next(this.conversation);
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
