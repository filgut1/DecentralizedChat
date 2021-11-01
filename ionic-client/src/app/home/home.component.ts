import { Component, OnInit } from '@angular/core';
import { User } from '@app/_models';
import { AccountService } from '@app/_services';
import { ModalController } from '@ionic/angular';
import { AddEditComponent } from '@app/contacts/add-edit.component';

@Component({ 
    templateUrl: 'home.component.html'
})
export class HomeComponent {
    user: User;
    public epub;
    public message;
    public alias;
    public contacts;
    loading = false;
    currentConvo: any;

    constructor(
        private accountService: AccountService,
        public modalController: ModalController,
    ) {
        this.user = this.accountService.userValue;
    }

    logout() {
        this.accountService.logout();        
    }
}