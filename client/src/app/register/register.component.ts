import { MembersService } from './../_services/members.service';
import { AccountService } from './../_services/account.service';
import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { AbstractControl, Form, FormBuilder, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
    selector: 'app-register',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {
    @Output() cancelRegister = new EventEmitter();
    registrationForm: FormGroup;
    maxDate: Date = new Date();
    validationErrors: string[] = [];

    constructor(
        private accountService: AccountService,
        private fb: FormBuilder,
        private router: Router,
        private membersService: MembersService
    ) {}

    ngOnInit(): void {
        this.initializeForm();
        this.maxDate.setFullYear(this.maxDate.getFullYear() - 18);
    }

    register() {
        this.accountService.register(this.registrationForm.value).subscribe(
            (response) => {
                this.membersService.getMembers();
                this.router.navigateByUrl('/members');
            },
            (error) => {
                this.validationErrors = error;
            }
        );
    }

    toControl(abstractControl: AbstractControl | null): FormControl {
        return abstractControl as FormControl;
    }

    initializeForm() {
        this.registrationForm = this.fb.group({
            gender: ['male'],
            username: ['', Validators.required],
            knownAs: ['', Validators.required],
            dateOfBirth: ['', Validators.required],
            city: ['', Validators.required],
            country: ['', Validators.required],
            password: ['', [Validators.required, Validators.minLength(4)]],
            confirmPassword: ['', [Validators.required, this.matchValues('password')]],
        });

        this.registrationForm.controls.password.valueChanges.subscribe(() => {
            this.registrationForm.controls.confirmPassword.updateValueAndValidity();
        });
    }

    matchValues(matchTo: string): ValidatorFn {
        return (control: AbstractControl) => {
            return control?.value === control?.parent?.get(matchTo)?.value ? null : { isMatching: true };
        };
    }

    cancel() {
        this.cancelRegister.emit(false);
    }
}
