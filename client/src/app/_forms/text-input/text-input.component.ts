import { Component, Input, Self } from '@angular/core';
import { ControlValueAccessor, NgControl, FormControl } from '@angular/forms';

@Component({
    selector: 'app-text-input',
    templateUrl: './text-input.component.html',
    styleUrls: ['./text-input.component.css'],
})
export class TextInputComponent implements ControlValueAccessor {
    @Input() label: string;
    @Input() type: string = 'text';

    constructor(@Self() public ngControl: NgControl) {
        this.ngControl.valueAccessor = this;
    }

    get control() {
        return this.ngControl.control as FormControl;
    }

    writeValue(obj: any): void {}
    registerOnChange(fn: any): void {}
    registerOnTouched(fn: any): void {}

    ngOnInit(): void {}
}
