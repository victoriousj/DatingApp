import { HttpClient } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { User } from '../_models/user';

@Injectable({
    providedIn: 'root',
})
export class AdminService implements OnInit {
    baseUrl = environment.apiUrl;

    constructor(private http: HttpClient) {}

    ngOnInit(): void {
        this.getUsersWithRoles();
    }

    getUsersWithRoles() {
        return this.http.get<Partial<User[]>>(this.baseUrl + 'admin/users-with-roles');
    }

    updateRoles(username: string, roles: string[]) {
        return this.http.post(this.baseUrl + 'admin/edit-roles/' + username + '?roles=' + roles, { roles });
    }
}
