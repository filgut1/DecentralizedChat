import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { GunDB } from '@app/_services';
import { AlertController, ModalController } from '@ionic/angular';
import { NavController } from '@ionic/angular';
import { AlertService } from '@app/_services';
import { Subject } from 'rxjs';

@Component({ templateUrl: 'add-edit.component.html' })
export class AddEditComponent implements OnInit {
    form: FormGroup;
    id: string;
    success = false;
    contacts = [];
    title: string;
    asyncContacts = new Subject<any>();
    contactCheckbox = [];

    @Input() type: string;

    constructor(
        private formBuilder: FormBuilder,
        private db: GunDB,
        private alertService: AlertService,
        private alertController: AlertController,
        public modalController: ModalController,
        public navCtrl: NavController
    ) { }

    async ngOnInit() {
        switch (this.type) {
            case 'create':
                this.title = 'New Chat';
                this.form = this.formBuilder.group({
                    name: ['', Validators.required],
                    uuid: ['']
                });
                await this._loadContacts();
                this.contactCheckbox = this.contacts.map(c => {
                    return {
                        val: c, isChecked: false
                    }
                });
                break;
            case 'join':
                this.title = 'Join Chat';
                this.form = this.formBuilder.group({
                    uuid: ['']
                });
                break;
            case 'addContact':
                this.title = 'Add Contact';
                this.form = this.formBuilder.group({
                    alias: ['']
                });
                break;
        }
    }

    private async _loadContacts() {
        this.contacts = await this.db.getAllContacts();
        this.asyncContacts.next([...this.contacts]);
    }

    // convenience getter for easy access to form fields
    get f() { return this.form.controls; }

    async onSubmit() {
        // stop here if form is invalid
        if (this.form.invalid) {
            return;
        }
        try {
            let members;
            switch(this.type) {
                case 'create':
                    members = this.contactCheckbox.filter(c => c.isChecked).map(c => c.val);
                    if (!members.length) {
                        throw new Error('Must select chat members');
                    }
                    const chatUUID = await this.db.createNewChat(members, this.f.name.value);
                    this.f.uuid.setValue(chatUUID);
                    // this.presentAlertConfirm(chatUUID);
                    this.alertService.success('Create chat success.');
                    break;
                case 'join':
                    const chatLink = this.f.uuid.value;
                    const url = new URL(chatLink);
                    const chatId = url.searchParams.get('chatId');
                    const inviter = url.searchParams.get('inviter');
                    const sharedSecret = url.searchParams.get('sharedSecret');
                    members = await this.db.getChatMembers(chatId, inviter);
                    if (!members.some(m => m.pub === this.db.myPub)) {
                        throw new Error('You are not a member of this chat!');
                    }
                    await this.db.joinExistingChat(chatId, inviter, sharedSecret);
                    this.dismiss();
                    break;
                case 'addContact':
                    await this.db.userExists(this.f.alias.value);
                    await this.db.addContactByAlias(this.f.alias.value);
                    this.dismiss();
                    break;
            }
            
        } catch(err) {
            this.alertService.error(err);
        }
    }

    async presentAlertConfirm(chatLink: string) {
        const alert = await this.alertController.create({
          cssClass: 'my-custom-class',
          header: 'Confirm!',
          message: `Chat Link: <strong>${chatLink}</strong>!!!`,
          buttons: [
            {
              text: 'Cancel',
              role: 'cancel',
              cssClass: 'secondary',
              handler: () => {
                console.log('Confirm Cancel');
              }
            }, {
              text: 'Okay',
              handler: () => {
                console.log('Confirm Okay');
              }
            }
          ]
        });
        await alert.present();
      }
 
    dismiss() {
        // using the injected ModalController this page
        // can "dismiss" itself and optionally pass back data
        this.modalController.dismiss({
          'dismissed': true
        });
      }
}