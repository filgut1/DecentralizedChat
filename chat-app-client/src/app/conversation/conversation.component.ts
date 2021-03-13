import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { GunDB } from '@app/_services';

@Component({
  selector: 'app-conversation',
  templateUrl: './conversation.component.html',
  styleUrls: ['./conversation.component.less']
})
export class ConversationComponent implements OnInit {
  public loading: Boolean = false;
  public messageContent: String = '';
  public conversation: Array<any>;
  @Input() currentConvo: any;
  constructor(
    private db: GunDB
  ) { 
  }

  ngOnInit(): void {

  }

  async ngOnChanges(changes: SimpleChanges) {
    if (changes.currentConvo.currentValue) {
      const epub = changes.currentConvo.currentValue.epub;
      this.loading = true;
      const [msgPathsFrom, msgPathsTo] = await Promise.all([
        this.db.$once(this.db.messagesFrom(epub)),
        this.db.$once(this.db.messagesTo(epub)),
      ]);

      // Create a flattened array of message paths 
      const msgPaths = [].concat.apply([], [
        ...Object.values(msgPathsFrom), 
        ...Object.values(msgPathsTo)].map(e => Object.values(e)));

      // Need to load and sort existing messages first
      this.conversation = await this.loadMessages(msgPaths);
      this.loading = false;

      // Subscribe to new messages
      this.db.on$(this.db.messagesFrom(epub).map(),
        {change: true}).subscribe(async data => {
          await this.db.decryptMessage(data);
          // Make the message appear as a received message (see ngClass in template)
          data.received = true;
          // Check for duplicate messages just in case
          if (!this.conversation.some(e => e.uuid === data.uuid)) {
            this.conversation.push(data);
          }
        });
    }
  }

  async loadMessages(messagePaths) {
    const getPromises = [];
    const decryptPromises = [];
    for (const path of messagePaths) {
        const node = this.db.gun.get(path);
        getPromises.push(this.db.$once(node));
    }
    const results = await Promise.all(getPromises);

    for (const data of results) {
      if (data.epub === this.db.myEpub) {
        decryptPromises.push(this.db.decryptMyOwnMessage(data));
      } else {
        data.received = true;
        decryptPromises.push(this.db.decryptMessage(data));
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
    }
  }
}
