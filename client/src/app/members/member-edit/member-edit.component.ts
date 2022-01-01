import { ToastrService } from 'ngx-toastr';
import { MembersService } from './../../_services/members.service';
import { AccountService } from './../../_services/account.service';
import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { Member } from 'src/app/_models/member';
import { User } from 'src/app/_models/user';
import { take } from 'rxjs/operators';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
    selector: 'app-member-edit',
    templateUrl: './member-edit.component.html',
    styleUrls: ['./member-edit.component.css'],
})
export class MemberEditComponent implements OnInit {
    @ViewChild('editForm') editForm: NgForm | null = null;
    member: Member;
    user: User;
    @HostListener('window:beforeunload', ['$events']) unloadNotifications($event: any) {
        if (this.editForm?.dirty) {
            $event.returnValue = true;
        }
    }

    constructor(
        private accountService: AccountService,
        private membersService: MembersService,
        private toastr: ToastrService,
        private router: Router
    ) {
        this.accountService.currentUser$.pipe(take(1)).subscribe((user) => (this.user = user));
    }

    ngOnInit(): void {
        this.loadMember();
    }

    loadMember() {
        this.membersService.getMember(this.user?.username ?? '').subscribe((member) => (this.member = member));
    }

    updateMember() {
        if (this.member === undefined) return;

        this.membersService.updateMember(this.member).subscribe(() => {
            this.toastr.success('Profile updated successfully');
            this.editForm?.reset(this.member);
        });
    }

    deleteAccount() {
        if (this.member === undefined) return;

        if (confirm('delete member?')) {
            console.log('deleted');
            this.membersService.deleteMember(this.member).subscribe((response) => {
                debugger;
                this.accountService.logout();
                this.router.navigateByUrl('/');
            });
        } else {
            console.log('not deleted');
        }
    }
}
