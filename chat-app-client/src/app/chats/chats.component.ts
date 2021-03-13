import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { GunDB } from '@app/_services';
import { on$ } from '@app/_helpers';
import { Observable } from 'rxjs';


@Component({
  selector: 'app-chats',
  templateUrl: './chats.component.html',
  styleUrls: ['./chats.component.less']
})
export class ChatsComponent implements OnInit {
  @Input() currentConvo: any;
  @Output() currentConvoChange = new EventEmitter<any>();
  public chats: Map<any, any>;
  private contacts$: Observable<any>;
  public searchString: String;
  public loading: Boolean = false;

  constructor(
    private db: GunDB
  ) { 
    this.chats = new Map();
  }

  ngOnInit() {


    this.db.on$(this.db.gunUser.get('contacts')).subscribe(res => {
      Object.keys(res).forEach(async path => {
        const userPath = this.db.gun.get(path);
        const user = await this.db.$once(userPath);

        this.chats.set(path, { 
          epub: user.epub,
          alias: user.alias
        });
      });
    });

    // Subscribe to my received messages table
    /* const contacts = this.db.gunUser
        .get('contacts');
    this.contacts$ = on$(contacts, true);
    this.contacts$.subscribe(this.handleNewContactChat.bind(this)); */
  }

  async loadConvo(user) {

    this.currentConvoChange.emit(user);
  }

  handleNewContactChat(data) {
    for (const [key, value] of Object.entries(data)) {
      this.db.gunUser.get('contacts').get(key).once(c => {
        this.chats.set(key, c.epub);
        this.loading = false;
      });
    }
  }
}
