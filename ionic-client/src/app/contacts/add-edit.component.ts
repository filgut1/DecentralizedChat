import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GunDB } from '@app/_services';
import { ModalController } from '@ionic/angular';
import { NavController } from '@ionic/angular';
import { AlertService } from '@app/_services';

@Component({ templateUrl: 'add-edit.component.html' })
export class AddEditComponent implements OnInit {
    form: FormGroup;
    id: string;
    isAddMode: boolean;
    success = false;
    contacts = [];

    constructor(
        private formBuilder: FormBuilder,
        private db: GunDB,
        public modalController: ModalController,
        private alertService: AlertService,
        public navCtrl: NavController
    ) { 
        this.form = this.formBuilder.group({
            alias: [''],
            name: [''],
            uuid: ['']
        });
     }

    async ngOnInit() {
        this.isAddMode = !this.id;
        this.contacts = await this.db.getAllContacts();
    }

    // convenience getter for easy access to form fields
    get f() { return this.form.controls; }

    async onSubmit() {

        // stop here if form is invalid
        if (this.form.invalid) {
            return;
        }
        try {
            if (this.f.alias.value === this.db.myAlias) { throw new Error('Cannot add yourself'); }
            
            if (!this.f.uuid.value) {
                await this.db.userExists(this.f.alias.value);
                const contactProfile = await this.db.addContactByAlias(this.f.alias.value);
                const myProfile = await this.db.myProfile
                const chatUUID = await this.db.createNewChat([contactProfile, myProfile], this.f.name.value);
                this.f.uuid.setValue(chatUUID);
                this.alertService.success('Create chat success.');
            } else {
                const chatLink = this.f.uuid.value;
                const url = new URL(chatLink);
                const chatId = url.searchParams.get('chatId');
                const inviter = url.searchParams.get('inviter');
                const sharedSecret = url.searchParams.get('sharedSecret');
                const members = await this.db.getChatMembers(chatId, inviter);
                if (!members.some(m => m.pub === this.db.myPub)) {
                    throw new Error('You are not a member of this chat!');
                }
                await this.db.addContactByPub(inviter);
                await this.db.joinExistingChat(chatId, inviter, members, sharedSecret);
                
            }
        } catch(err) {
            this.alertService.error(err);
        }
    }

    newContact() {

    }

    newGroup() {

    }
 
    dismiss() {
        // using the injected ModalController this page
        // can "dismiss" itself and optionally pass back data
        this.modalController.dismiss({
          'dismissed': true
        });
      }
}