import { ConfirmService } from './../_services/confirm.service';
import { MemberEditComponent } from './../members/member-edit/member-edit.component';
import { Injectable } from '@angular/core';
import { CanDeactivate } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class PreventUnsavedChangesGuard implements CanDeactivate<unknown> {
    constructor(public confirmService: ConfirmService) {}

    canDeactivate(component: MemberEditComponent): Observable<boolean> | boolean {
        if (component.editForm?.dirty) {
            return this.confirmService.confirm({
                btnOkText: 'Yes',
                btnCancelText: 'No',
                message: 'Are you sure you want to leave this page?',
            });
        }

        return true;
    }
}
