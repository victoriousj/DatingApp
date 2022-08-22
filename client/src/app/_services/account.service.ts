import { PresenceService } from './presence.service';
import { User } from './../_models/user';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { ReplaySubject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { JsonPipe } from '@angular/common';

@Injectable({
    providedIn: 'root',
})
export class AccountService {
    baseUrl = environment.apiUrl;

    private currentUserSource = new ReplaySubject<User>(1);
    currentUser$ = this.currentUserSource?.asObservable();

    constructor(private http: HttpClient, private presence: PresenceService) {}

    login(model: User) {
        return this.http.post(this.baseUrl + 'account/login', model).pipe(
            map((response: any) => {
                const user = response;
                if (user) {
                    this.setCurrentUser(user as User);
                    this.presence.createHubConnection(user);
                }
            })
        );
    }

    register(model: any) {
        return this.http.post(this.baseUrl + 'account/register', model).pipe(
            map((user) => {
                console.log('user', user);
                if (user) {
                    this.setCurrentUser(user as User);
                    this.presence.createHubConnection(user as User);
                }
                return user;
            })
        );
    }

    setCurrentUser(user: User): void {
        user.roles = [];
        const roles = this.getDecodedToken(user.token).role;

        Array.isArray(roles) ? (user.roles = roles) : user.roles.push(roles);

        localStorage.setItem('user', JSON.stringify(user));

        this.currentUserSource?.next(user);
    }

    logout(): void {
        localStorage.removeItem('user');
        this.currentUserSource?.next(undefined);
        this.presence.stopHubConnection();
    }

    getDecodedToken(token: string) {
        return JSON.parse(atob(token.split('.')[1]));
    }
}
