import { Component, Input, OnInit, SimpleChanges, AfterViewChecked, ViewChild, ElementRef } from '@angular/core';
import { Observable, Subject, Subscriber, Subscription  } from 'rxjs';
import { GunDB } from '@app/_services';
import { User } from '@app/_models';
import { AccountService } from '@app/_services';

@Component({
  selector: 'app-conversation',
  templateUrl: './conversation.component.html',
  styleUrls: ['./conversation.component.less']
})
export class ConversationComponent implements OnInit, AfterViewChecked  {
  @ViewChild('scrollBottom') private scrollBottom: ElementRef;
  public loading: Boolean = false;
  public messageContent: String = '';
  public user: User;
  public conversation: Array<any> = [];
  public messagesSubscription: Subscription;
  public asyncConvo$ = new Subject<any[]>();
  private members: Array<any> = [];
  @Input() currentConvo: any;
  constructor(
    private db: GunDB,
    private accountService: AccountService,
  ) { 
    this.user = this.accountService.userValue;
  }

  ngOnInit(): void {

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
    if (changes.currentConvo.currentValue) {
      this.members = await this.db.getConvoMembers(this.currentConvo.members['#']);
   
      this.db.messagesObservable(this.currentConvo.uuid)
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
    }
  }

  sendMessage() {
    console.log(this.messageContent);
    const ts = (new Date()).getTime();
    if (this.currentConvo) {
      this.db.sendMessage(this.currentConvo, this.members, this.messageContent, ts);
      this._clearChat();
    }
  }

  isReceivedMessage(message) {
    return this.user.alias !== message.from;
  }

  private _clearChat() {
    this.messageContent = '';
  }
}
