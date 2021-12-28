import { Injectable } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';

@Injectable({
    providedIn: 'root',
})
export class BusyService {
    busyServicequestCount = 0;

    constructor(private spinnerService: NgxSpinnerService) {}

    busy() {
        this.busyServicequestCount++;

        this.spinnerService.show(undefined, {
            type: 'line-scale-party',
            bdColor: 'rgba(255,255,255,0)',
            color: '#333333',
        });
    }

    idle() {
        this.busyServicequestCount--;
        if (this.busyServicequestCount <= 0) {
            this.busyServicequestCount = 0;
            this.spinnerService.hide();
        }
    }
}
