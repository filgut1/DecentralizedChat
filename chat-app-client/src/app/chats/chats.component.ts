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
    this.db.on$(this.db.myConversations.map()).subscribe(convo => {
      this.chats.set(convo.uuid, convo);
    });
  }

  async loadConvo(user) {
    this.currentConvoChange.emit(user);
  }

  get chatKeys() {
    return Array.from(this.chats.keys());
  }
}
