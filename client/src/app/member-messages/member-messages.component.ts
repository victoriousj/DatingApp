import { NgForm } from '@angular/forms';
import { AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { Message } from '../_models/message';
import { MessageService } from '../_services/message.service';

@Component({
    selector: 'app-member-messages',
    templateUrl: './member-messages.component.html',
    styleUrls: ['./member-messages.component.css'],
})
export class MemberMessagesComponent implements OnInit, AfterViewInit {
    @ViewChild('content') content: ElementRef;
    @ViewChild('messageForm') messageForm: NgForm;
    @Input() username: string;
    messageContent: string;

    constructor(public messageService: MessageService) {}

    ngOnInit(): void {}

    sendMessage() {
        this.messageService.sendMessage(this.username, this.messageContent).then(() => {
            this.messageForm.reset();
        });
    }

    ngAfterViewInit() {
        this.scrollToBottom();
        // this.messages.changes.subscribe(this.scrollToBottom);
    }

    scrollToBottom = () => {
        try {
            this.content.nativeElement.scrollTop = this.content.nativeElement.scrollHeight;
        } catch (err) {}
    };
}
