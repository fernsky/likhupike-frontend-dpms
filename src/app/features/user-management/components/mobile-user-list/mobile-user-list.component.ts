import {
  Component,
  Input,
  Output,
  EventEmitter,
  ChangeDetectorRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatChipsModule } from '@angular/material/chips';
import { MatRippleModule } from '@angular/material/core';
import { TranslocoModule } from '@jsverse/transloco';
import { UserResponse } from '../../models/user.interface';
import { MatDividerModule } from '@angular/material/divider';

@Component({
  selector: 'app-mobile-user-list',
  templateUrl: './mobile-user-list.component.html',
  styleUrls: ['./mobile-user-list.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatChipsModule,
    MatRippleModule,
    TranslocoModule,
    MatDividerModule,
  ],
})
export class MobileUserListComponent {
  @Input() set users(value: UserResponse[]) {
    this._users = value;
    this.cdr.detectChanges(); // Force change detection when users are updated
  }
  get users(): UserResponse[] {
    return this._users;
  }
  private _users: UserResponse[] = [];

  @Output() edit = new EventEmitter<string>();
  @Output() delete = new EventEmitter<UserResponse>();
  @Output() toggleStatus = new EventEmitter<UserResponse>();

  constructor(private cdr: ChangeDetectorRef) {}

  trackByFn(index: number, item: UserResponse): string {
    return item.id;
  }
}
