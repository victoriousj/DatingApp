import { ToastrService } from 'ngx-toastr';
import { AccountService } from './../_services/account.service';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
    providedIn: 'root',
})
export class AdminGuard implements CanActivate {
    constructor(private AccountService: AccountService, private toastr: ToastrService) {}

    canActivate(): Observable<boolean> {
        return this.AccountService.currentUser$.pipe(
            map((user) => {
                if (user.roles.includes('admin') || user.roles.includes('Moderator')) {
                    return true;
                }

                this.toastr.error('You cannot enter this area');

                return false;
            })
        );
    }
}
