import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  status: 'active' | 'inactive';
}

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-list.component.html',
})
export class UserListComponent implements OnInit {
  users: User[] = [];
  isLoading = false;
  error: string | null = null;

  constructor() {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.isLoading = true;
    this.error = null;

    setTimeout(() => {
      this.users = [
        {
          id: 1,
          name: 'John Doe',
          email: 'john@example.com',
          role: 'Admin',
          status: 'active',
        },
        {
          id: 2,
          name: 'Jane Smith',
          email: 'jane@example.com',
          role: 'User',
          status: 'active',
        },
        {
          id: 3,
          name: 'Mike Johnson',
          email: 'mike@example.com',
          role: 'Editor',
          status: 'inactive',
        },
      ];
      this.isLoading = false;
    }, 1000);

    // Actual API implementation would look like:
    // this.userService.getUsers().subscribe({
    //   next: (users) => {
    //     this.users = users;
    //     this.isLoading = false;
    //   },
    //   error: (err) => {
    //     this.error = 'Failed to load users';
    //     this.isLoading = false;
    //   }
    // });
  }
}
