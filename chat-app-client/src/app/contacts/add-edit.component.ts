import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GunDB } from '@app/_services';
import { first } from 'rxjs/operators';

import { AccountService, AlertService } from '@app/_services';

@Component({ templateUrl: 'add-edit.component.html' })
export class AddEditComponent implements OnInit {
    form: FormGroup;
    id: string;
    isAddMode: boolean;
    loading = false;
    submitted = false;

    constructor(
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private accountService: AccountService,
        private alertService: AlertService,
        private db: GunDB
    ) { }

    ngOnInit() {
        this.isAddMode = !this.id;

        this.form = this.formBuilder.group({
            alias: ['', Validators.required]
        });

        if (!this.isAddMode) {
            this.accountService.getCurrentUserProfile()
                .then(x => this.form.patchValue(x));
        }
    }

    // convenience getter for easy access to form fields
    get f() { return this.form.controls; }

    async onSubmit() {
        this.submitted = true;

        // reset alerts on submit
        this.alertService.clear();

        // stop here if form is invalid
        if (this.form.invalid) {
            return;
        }
        const res = await this.db.findUserByAlias(this.f.alias.value);
        if (res) {
            await this.db.addContact(this.f.alias.value);
            this.router.navigate(['../../'], { relativeTo: this.route });
        } else {
            this.alertService.error('User not found');
        }
        this.loading = false;
    }
}