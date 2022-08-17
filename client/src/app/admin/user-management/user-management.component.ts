import { AdminService } from './../../_services/admin.service';
import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/_models/user';

@Component({
    selector: 'app-user-management',
    templateUrl: './user-management.component.html',
    styleUrls: ['./user-management.component.css'],
})
export class UserManagementComponent implements OnInit {
    users: Partial<User[]>;

    constructor(private adminService: AdminService) {}

    ngOnInit(): void {
        this.getUsersWithRoles();
    }

    getUsersWithRoles() {
        this.adminService.getUsersWithRoles().subscribe((users) => {
            this.users = users;
        });
    }
}
