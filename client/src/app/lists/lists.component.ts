import { Pagination } from 'src/app/_models/pagination';
import { LikesParams } from './../_models/likeParams';
import { MembersService } from './../_services/members.service';
import { Component, OnInit } from '@angular/core';
import { Member } from '../_models/member';

@Component({
    selector: 'app-lists',
    templateUrl: './lists.component.html',
    styleUrls: ['./lists.component.css'],
})
export class ListsComponent implements OnInit {
    members: Partial<Member[]>;
    likesParams: LikesParams;
    pagination: Pagination;

    constructor(private memberService: MembersService) {}

    ngOnInit(): void {
        this.likesParams = {
            pageNumber: 1,
            pageSize: 5,
            predicate: 'liked',
        };

        this.loadLikes();
    }

    loadLikes() {
        this.memberService.getLikes(this.likesParams).subscribe((response) => {
            this.members = response.result;
            console.log(this.members);
            this.pagination = response.pagination;
        });
    }

    pageChange(event: any) {
        this.likesParams.pageNumber = event.page;
        this.loadLikes();
    }
}
