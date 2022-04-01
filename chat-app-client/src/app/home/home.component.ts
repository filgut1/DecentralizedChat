import { ChangeDetectorRef, Component, OnChanges, OnInit } from '@angular/core';
import { User } from '@app/_models';
import { AccountService, AlertService } from '@app/_services';
import { GunDB } from '@app/_services';
import { on$ } from '@app/_helpers';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal, ModalDismissReasons, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Subject } from 'rxjs';

@Component({ 
    templateUrl: 'home.component.html',
    styleUrls: ['./home.component.less']
})
export class HomeComponent {
    user: User;
    form: FormGroup;
    loading = false;
    currentConvo: any;
    contactCheckbox = [];
    title = '';
    closeResult = '';
    type = '';
    modalRef: NgbModalRef;
    errorMessage = '';
    successMessage = '';

    constructor(
        private accountService: AccountService,
        private formBuilder: FormBuilder,
        private db: GunDB,
        private router: Router,
        private cd: ChangeDetectorRef,
        private modalService: NgbModal,
        private alertService: AlertService,
    ) {
        this.user = this.accountService.userValue;
        this.currentConvo = this.router.getCurrentNavigation() &&
            this.router.getCurrentNavigation().extras.state;
    }

    // convenience getter for easy access to form fields
    get f() { return this.form.controls; }

    async openChatJoinCreateDialog(content, type) {
        this.type = type;
        this.contactCheckbox = [];
        switch (type) {
            case 'create':
                this.title = 'New Chat';
                this.form = this.formBuilder.group({
                    name: ['', Validators.required],
                    uuid: ['']
                });
                const contacts = await this.db.getAllContacts();
                this.contactCheckbox = contacts.map(c => {
                    return { val: c, isChecked: false }
                });
                break;
            case 'join':
                this.title = 'Join Chat';
                this.form = this.formBuilder.group({
                    uuid: ['']
                });
                break;
        }

        this.modalRef = this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'});

        this.modalRef.result.then(async result => {

          }, (reason) => {
            this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
          });
    }

    async onSubmit() {
        this.errorMessage = '';
        this.successMessage = '';
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
                    this.successMessage = 'Create chat success. Share the link with the chat members.';
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
                    this.modalRef.close();
                    break;
            }
        } catch(err) {
            this.errorMessage = err;
        }
    }

    private getDismissReason(reason: any): string {
        if (reason === ModalDismissReasons.ESC) {
          return 'by pressing ESC';
        } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
          return 'by clicking on a backdrop';
        } else {
          return `with: ${reason}`;
        }
      }

}