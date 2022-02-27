import { LikesParams } from './../_models/likeParams';
import { User } from 'src/app/_models/user';
import { AccountService } from './account.service';
import { UserParams } from './../_models/userParams';
import { PaginatedResults } from './../_models/pagination';
import { Member } from './../_models/member';
import { environment } from 'src/environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { getPaginatedResults, getPaginationHeaders } from './paginationHelper';

@Injectable({
    providedIn: 'root',
})
export class MembersService {
    baseUrl = environment.apiUrl;
    members: Member[] = [];
    memberCache = new Map();
    user: User;
    userParams: UserParams;

    constructor(private http: HttpClient, private accountService: AccountService) {
        this.accountService.currentUser$.pipe(take(1)).subscribe((user) => {
            this.user = user;
            this.userParams = new UserParams(user);
        });
    }

    getUserParams(): UserParams {
        return this.userParams;
    }

    setUserParams(params: UserParams) {
        this.userParams = params;
    }

    resetUserParams() {
        this.setUserParams(new UserParams(this.user));
        return this.userParams;
    }

    getMembers(userParams: UserParams) {
        var response = this.memberCache.get(JSON.stringify(userParams));
        if (response) {
            return of(response);
        }

        let params = getPaginationHeaders(userParams.pageNumber, userParams.pageSize);

        params = params.append('minAge', userParams.minAge.toString());
        params = params.append('maxAge', userParams.maxAge.toString());
        params = params.append('gender', userParams.gender);
        params = params.append('orderBy', userParams.orderBy);

        return getPaginatedResults<Member[]>(this.baseUrl + 'users', params, this.http).pipe(
            map((response) => {
                this.memberCache.set(JSON.stringify(userParams), response);
                return response;
            })
        );
    }

    getMember(username: string): Observable<Member> {
        const member = [...this.memberCache.values()]
            .reduce((arr: Member[], elem: PaginatedResults<Member>) => arr.concat(elem.result), [])
            .find((member: Member) => member.username === username);

        if (member) {
            return of(member);
        }
        return this.http.get<Member>(this.baseUrl + 'users/' + username);
    }

    updateMember(member: Member) {
        return this.http.put(this.baseUrl + 'users', member).pipe(
            map(() => {
                const index = this.members.indexOf(member);
                this.members[index] = member;
            })
        );
    }

    deleteMember() {
        return this.http.delete(this.baseUrl + 'users/delete-member/');
    }

    setMainPhoto(photoId: number) {
        return this.http.put(this.baseUrl + 'users/set-main-photo/' + photoId, {});
    }

    deletePhoto(photoId: number) {
        return this.http.delete(this.baseUrl + 'users/delete-photo/' + photoId);
    }

    addLike(username: string) {
        return this.http.post(this.baseUrl + 'likes/' + username, {});
    }

    getLikes(likesParams: LikesParams) {
        let params = getPaginationHeaders(likesParams.pageNumber, likesParams.pageSize);

        params = params.append('predicate', likesParams.predicate);

        return getPaginatedResults<Partial<Member[]>>(this.baseUrl + 'likes', params, this.http);
    }
}
