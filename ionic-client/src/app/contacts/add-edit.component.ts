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
    loading = false;
    submitted = false;

    constructor(
        private formBuilder: FormBuilder,
        private db: GunDB,
        public modalController: ModalController,
        private alertService: AlertService,
        public navCtrl: NavController
    ) { }

    ngOnInit() {
        this.isAddMode = !this.id;

        this.form = this.formBuilder.group({
            alias: ['', Validators.required]
        });
    }

    // convenience getter for easy access to form fields
    get f() { return this.form.controls; }

    async onSubmit() {
        this.submitted = true;

        // stop here if form is invalid
        if (this.form.invalid) {
            return;
        }
        try {
            const res = await this.db.$findUserByAlias(this.f.alias.value);
            await this.db.addContact(this.f.alias.value, res.epub);
            this.dismiss();
        } catch(err) {
            this.alertService.error('User not found')
        }
        this.loading = false;
    }

    dismiss() {
        // using the injected ModalController this page
        // can "dismiss" itself and optionally pass back data
        this.modalController.dismiss({
          'dismissed': true
        });
      }
}