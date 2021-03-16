import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavController } from '@ionic/angular';
import { AlertService } from '@app/_services';


import { AccountService } from '@app/_services';

@Component({ templateUrl: 'register.component.html' })
export class RegisterComponent implements OnInit {
    form: FormGroup;
    loading = false;
    submitted = false;

    constructor(
        private formBuilder: FormBuilder,
        private accountService: AccountService,
        private alertService: AlertService,
        public navCtrl: NavController
    ) { }

    ngOnInit() {
        this.form = this.formBuilder.group({
            alias: ['', Validators.required],
            password: ['', [Validators.required, Validators.minLength(6)]]
        });
    }

    // convenience getter for easy access to form fields
    get f() { return this.form.controls; }

    onSubmit() {
        this.submitted = true;

        // stop here if form is invalid
        if (this.form.invalid) {
            return;
        }

        this.loading = true;
        this.accountService.register(this.form.value).then(() => {
            this.alertService.success('Registration successful', { keepAfterRouteChange: true });
            this.navCtrl.navigateRoot(['/login']);
        }).catch(err => {
            this.alertService.error(err);
            this.loading = false;
        });
    }
}