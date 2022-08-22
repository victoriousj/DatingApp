import { BehaviorSubject } from 'rxjs';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { getPaginatedResults, getPaginationHeaders } from './paginationHelper';
import { Message } from '../_models/message';
import { environment } from 'src/environments/environment';
import { User } from '../_models/user';

@Injectable({
    providedIn: 'root',
})
export class MessageService {
    hubUrl = environment.hubUrl;
    baseUrl = environment.apiUrl;
    private hubConnection: HubConnection;
    private messageThreadSource = new BehaviorSubject<Message[]>([]);
    messageThread$ = this.messageThreadSource.asObservable();

    constructor(private http: HttpClient) {}

    createHubConnection(user: User, otherUsername: string) {
        this.hubConnection = new HubConnectionBuilder()
            .withUrl(this.hubUrl + 'message?user=' + otherUsername, {
                accessTokenFactory: () => user.token,
            })
            .withAutomaticReconnect()
            .build();

        this.hubConnection.start().catch((err) => console.error(err));

        this.hubConnection.on('ReceiveMessageThread', (messages) => {
            this.messageThreadSource.next(messages);
        });
    }

    stopHubConnection() {
        this.hubConnection.stop();
    }

    getMessages(pageNumber: number, pageSize: number, container: string) {
        let params = getPaginationHeaders(pageNumber, pageSize);

        params = params.append('Container', container);

        return getPaginatedResults<Partial<Message[]>>(this.baseUrl + 'messages', params, this.http);
    }

    getMessageThread(username: string) {
        return this.http.get<Message[]>(this.baseUrl + 'messages/thread/' + username);
    }

    sendMessage(username: string, content: string) {
        return this.http.post<Message>(this.baseUrl + 'messages', { recipientUsername: username, content });
    }

    deleteMessage(id: number) {
        return this.http.delete(this.baseUrl + 'messages/' + id);
    }
}
