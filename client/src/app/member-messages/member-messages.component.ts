import { Observable } from 'rxjs';
import { NgForm } from '@angular/forms';
import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { Message } from '../_models/message';
import { MessageService } from '../_services/message.service';

@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
    selector: 'app-member-messages',
    templateUrl: './member-messages.component.html',
    styleUrls: ['./member-messages.component.css'],
})
export class MemberMessagesComponent implements OnInit {
    @ViewChild('content') content: ElementRef;
    @ViewChild('messageForm') messageForm: NgForm;
    @Input() username: string;
    messageContent: string;

    constructor(public messageService: MessageService) {
        this.messageService.messageThread$.subscribe(() => this.scrollToBottom());
    }

    ngOnInit(): void {}

    sendMessage() {
        this.messageService.sendMessage(this.username, this.messageContent).then(() => {
            this.messageForm.reset();
        });
    }

    scrollToBottom = () => {
        window.scrollTo(0, document.body.scrollHeight);
    };
}
