import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  template: `
    <div class="admin-container">
      <router-outlet></router-outlet>
    </div>
  `,
  styles: [
    `
      .admin-container {
        padding: 20px;
      }
    `,
  ],
})
export class AdminComponent {}
