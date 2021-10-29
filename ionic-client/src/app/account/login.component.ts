import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavController } from '@ionic/angular';
import { AccountService } from '@app/_services';
import { AlertService } from '@app/_services';


@Component({ templateUrl: './login.component.html' })
export class LoginComponent implements OnInit {
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
            password: ['1', Validators.required]
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
        this.accountService.login(this.f.alias.value, this.f.password.value)
            .then(user => {
               
                this.submitted = false;
                this.navCtrl.navigateRoot(['/']);
            }).catch(err => {
                this.alertService.error(err);
                this.loading = false;
                this.submitted = false;
            });
    }
}