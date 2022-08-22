import { PresenceService } from './_services/presence.service';
import { AccountService } from './_services/account.service';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { User } from './_models/user';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],
})
export class AppComponent {
    title = 'The Dating App';
    users: any;

    constructor(private http: HttpClient, private accountService: AccountService, private presence: PresenceService) {}

    ngOnInit(): void {
        this.setCurrentUser();
    }

    setCurrentUser() {
        const userData = localStorage.getItem('user') ?? '';
        if (userData) {
            const user: User = JSON.parse(userData);
            this.accountService.setCurrentUser(user);
            this.presence.createHubConnection(user);
        }
    }
}
