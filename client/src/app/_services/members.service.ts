import { Member } from './../_models/member';
import { environment } from 'src/environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
    providedIn: 'root',
})
export class MembersService {
    baseUrl = environment.apiUrl;
    members: Member[] = [];

    constructor(private http: HttpClient) {}

    getMembers(): Observable<Member[]> {
        if (this.members.length > 0) {
            return of(this.members);
        }
        return this.http.get<Member[]>(this.baseUrl + 'users').pipe(
            map((members) => {
                this.members = members;
                return members;
            })
        );
    }

    getMember(username: string): Observable<Member> {
        const member = this.members.find((x) => x.username === username);
        if (member !== undefined) {
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

    deleteMember(member: Member) {
        return this.http.delete(this.baseUrl + 'users/delete-member/' + member.username);
    }

    setMainPhoto(photoId: number) {
        return this.http.put(this.baseUrl + 'users/set-main-photo/' + photoId, {});
    }

    deletePhoto(photoId: number) {
        return this.http.delete(this.baseUrl + 'users/delete-photo/' + photoId);
    }
}
