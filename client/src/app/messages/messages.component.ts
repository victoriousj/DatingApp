import { ConfirmService } from './../_services/confirm.service';
import { MessageService } from './../_services/message.service';
import { Component, OnInit } from '@angular/core';
import { Message } from '../_models/message';
import { Pagination } from '../_models/pagination';

@Component({
    selector: 'app-messages',
    templateUrl: './messages.component.html',
    styleUrls: ['./messages.component.css'],
})
export class MessagesComponent implements OnInit {
    messages: (Message | undefined)[];
    pagination: Pagination;
    container = 'Unread';
    pageNumber = 1;
    pageSize = 5;
    loading: boolean = false;

    constructor(private messageService: MessageService, private confirmService: ConfirmService) {}

    ngOnInit(): void {
        this.loadMessages();
    }

    loadMessages() {
        this.loading = true;
        this.messageService.getMessages(this.pageNumber, this.pageSize, this.container).subscribe((response) => {
            this.messages = response.result;
            this.pagination = response.pagination;
            this.loading = false;
        });
    }

    deleteMessage(id: number) {
        this.confirmService
            .confirm({
                message: 'Are you sure you want to delete this message',
                btnOkText: 'Yes',
                btnCancelText: 'No',
            })
            .subscribe((result) => {
                if (result) {
                    const messageIndex = this.messages.findIndex((x) => x?.id === id);

                    this.messageService.deleteMessage(id).subscribe(() => {
                        this.messages.splice(messageIndex, 1);
                    });
                }
            });
    }

    pageChanged(event: any) {
        if (this.pageNumber !== event.page) {
            this.pageNumber = event.page;
            this.loadMessages();
        }
    }
}
