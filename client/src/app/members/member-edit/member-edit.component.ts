import { MembersService } from './../../_services/members.service';
import { AccountService } from './../../_services/account.service';
import { Component, OnInit } from '@angular/core';
import { Member } from 'src/app/_models/member';
import { User } from 'src/app/_models/user';
import { take } from 'rxjs/operators';

@Component({
    selector: 'app-member-edit',
    templateUrl: './member-edit.component.html',
    styleUrls: ['./member-edit.component.css'],
})
export class MemberEditComponent implements OnInit {
    member: Member | null = null;
    user: User | null = null;

    constructor(private accountService: AccountService, private membersService: MembersService) {
        this.accountService.currentUser$.pipe(take(1)).subscribe((user) => (this.user = user));
    }

    ngOnInit(): void {
        this.loadMember();
    }

    loadMember() {
        this.membersService.getMember(this.user?.username ?? '').subscribe((member) => (this.member = member));
    }
}
