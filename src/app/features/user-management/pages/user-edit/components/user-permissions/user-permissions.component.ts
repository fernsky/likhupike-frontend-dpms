import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { TranslocoModule } from '@jsverse/transloco';
import { UserResponse } from '../../../../models/user.interface';
import { UserActions } from '../../../../store/user.actions';
import * as UserSelectors from '../../../../store/user.selectors';
import { PermissionType } from '@app/core/models/permission.enum';

@Component({
  selector: 'app-user-permissions',
  templateUrl: './user-permissions.component.html',
  styleUrls: ['./user-permissions.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCheckboxModule,
    MatButtonModule,
    MatIconModule,
    TranslocoModule,
  ],
})
export class UserPermissionsComponent implements OnInit {
  @Input() user!: UserResponse;

  permissionsForm: FormGroup;
  loading$ = this.store.select(UserSelectors.selectUserUpdating);
  errors$ = this.store.select(UserSelectors.selectUserErrors);
  permissionTypes = Object.values(PermissionType);

  constructor(
    private fb: FormBuilder,
    private store: Store
  ) {
    this.permissionsForm = this.fb.group({
      permissions: this.fb.group(
        Object.values(PermissionType).reduce(
          (acc, permission) => ({
            ...acc,
            [permission]: [false],
          }),
          {}
        )
      ),
    });
  }

  ngOnInit(): void {
    // Initialize form with user's current permissions
    const permissionsValue = Object.values(PermissionType).reduce(
      (acc, permission) => ({
        ...acc,
        [permission]: this.user.permissions.includes(permission),
      }),
      {}
    );
    this.permissionsForm.get('permissions')?.patchValue(permissionsValue);
  }

  onSubmit(): void {
    if (this.permissionsForm.valid) {
      const formValue = this.permissionsForm.getRawValue();
      const permissions = formValue.permissions;

      this.store.dispatch(
        UserActions.updatePermissions({
          id: this.user.id,
          request: { permissions },
        })
      );
    }
  }
}
