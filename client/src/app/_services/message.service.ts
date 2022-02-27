import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { getPaginatedResults, getPaginationHeaders } from './paginationHelper';
import { Message } from '../_models/message';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root',
})
export class MessageService {
    baseUrl = environment.apiUrl;

    constructor(private http: HttpClient) {}

    getMessages(pageNumber: number, pageSize: number, container: string) {
        let params = getPaginationHeaders(pageNumber, pageSize);

        params = params.append('Container', container);

        return getPaginatedResults<Partial<Message[]>>(this.baseUrl + 'messages', params, this.http);
    }
}
