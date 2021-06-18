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

  constructor(
    private http: HttpClient,
    private accountService: AccountService
  ) {}

  ngOnInit(): void {
    this.getUsers();
    this.setCurrentUser();
  }
  getUsers() {
    this.http.get('https://localhost:5001/api/users').subscribe(
      (response) => {
        this.users = response;
        console.log(this.users);
      },
      (error) => {
        console.log(error);
      }
    );
  }

  setCurrentUser() {
    const userData = localStorage.getItem('user') ?? '';
    const user: User = JSON.parse(userData);
    this.accountService.setCurrentUser(user);
  }
}
