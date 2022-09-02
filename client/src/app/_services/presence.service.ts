import { Router } from '@angular/router';
import { take } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment';
import { Injectable } from '@angular/core';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { User } from '../_models/user';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class PresenceService {
    hubUrl = environment.hubUrl;
    private hubConnection: HubConnection;
    private onlineUsersSource = new BehaviorSubject<string[]>([]);
    onlineUsers$ = this.onlineUsersSource.asObservable();

    constructor(private toastr: ToastrService, private router: Router) {}

    createHubConnection(user: User) {
        this.hubConnection = new HubConnectionBuilder()
            .withUrl(this.hubUrl + 'presence', {
                accessTokenFactory: () => user.token,
            })
            .withAutomaticReconnect()
            .build();

        this.hubConnection.start().catch((err) => console.error(err));

        this.hubConnection.on('UserIsOnline', (username) => {
            this.onlineUsers$
                .pipe(take(1))
                .subscribe((usernames) => this.onlineUsersSource.next([...usernames, username]));
        });

        this.hubConnection.on('UserIsOffline', (username) => {
            this.onlineUsers$
                .pipe(take(1))
                .subscribe((usernames) =>
                    this.onlineUsersSource.next([...usernames.filter((x: string) => x !== username)])
                );
        });

        this.hubConnection.on('NewMessageReceived', ({ username, knownAs, content, photo }) => {
            this.toastr
                .info(
                    `<img src="${photo}"><span class="d-flex flex-column">
                    <b>${knownAs}:</b>
                ${content}
                </span>`,
                    '',
                    {
                        enableHtml: true,
                        toastClass: 'toastr-custom-class',
                        messageClass: 'toastr-message-class',
                    }
                )
                .onTap.pipe(take(1))
                .subscribe(() => this.router.navigateByUrl('/members/' + username + '?tab=3'));
        });

        this.hubConnection.on('GetOnlineUsers', (usernames: string[]) => {
            this.onlineUsersSource.next(usernames);
        });
    }

    stopHubConnection() {
        this.hubConnection.stop().catch((err) => console.error(err));
    }
}
