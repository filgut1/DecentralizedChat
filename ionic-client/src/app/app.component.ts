import { Component, OnInit } from '@angular/core';
import { User } from './_models';
import { AccountService } from './_services';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  user: User;
  loading = false;
  constructor(
      public accountService: AccountService,
  ) { this.accountService.user.subscribe(x => this.user = x);}

  logout() {
      this.accountService.logout();
  }
}
