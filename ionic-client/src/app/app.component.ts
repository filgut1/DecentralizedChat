import { Component, OnInit } from '@angular/core';
import { User } from './_models';
import { GunDB } from './_services';
import { AccountService } from './_services';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  user: User;
  loading = false;
  constructor(
      public accountService: AccountService,
      private db: GunDB
  ) { this.accountService.user.subscribe(x => this.user = x);}

  async ngOnInit() {
      if (this.user && !this.db.isLoggedIn()) {
          this.loading = true;
          try {
            await this.db.onAuth();
          } catch (err) {
          }
          this.loading = false;
      }
      // In case of refresh, need to wait for authentication
      // to occurr again automatically since user.recall({sessionStorage: true}) was used
  }

  logout() {
      this.accountService.logout();
  }
}
