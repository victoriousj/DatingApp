import { Component, Input, OnInit, Self } from '@angular/core';
import { ControlValueAccessor, NgControl, FormControl } from '@angular/forms';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';

@Component({
    selector: 'app-date-input',
    templateUrl: './date-input.component.html',
    styleUrls: ['./date-input.component.html'],
})
export class DateInputComponent implements ControlValueAccessor {
    @Input() label: string;
    @Input() maxDate: Date;
    bsConfig: Partial<BsDatepickerConfig>;

    get control() {
        return this.ngControl.control as FormControl;
    }

    constructor(@Self() public ngControl: NgControl) {
        this.ngControl.valueAccessor = this;
        this.bsConfig = {
            containerClass: 'theme-red',
            dateInputFormat: 'DD MMMM YYYY',
        };
    }

    writeValue(obj: any): void {}
    registerOnChange(fn: any): void {}
    registerOnTouched(fn: any): void {}
}
