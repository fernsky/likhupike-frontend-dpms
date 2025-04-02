import {
  Component,
  Input,
  OnInit,
  OnDestroy,
  ChangeDetectorRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { TranslocoModule } from '@jsverse/transloco';
import { MatIconModule } from '@angular/material/icon';
import { UserResponse } from '../../../../models/user.interface';
import { UserActions } from '../../../../store/user.actions';
import * as UserSelectors from '../../../../store/user.selectors';
import { PermissionType } from '@app/core/models/permission.enum';
import { combineLatest, Subject } from 'rxjs';
import { takeUntil, filter } from 'rxjs/operators';

// Carbon imports
import {
  ButtonModule,
  CheckboxModule,
  NFormsModule,
  NotificationModule,
} from 'carbon-components-angular';

@Component({
  selector: 'app-user-permissions',
  templateUrl: './user-permissions.component.html',
  styleUrls: ['./user-permissions.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TranslocoModule,
    MatIconModule,
    // Carbon modules
    ButtonModule,
    CheckboxModule,
    NFormsModule,
    NotificationModule,
  ],
})
export class UserPermissionsComponent implements OnInit, OnDestroy {
  @Input() set user(value: UserResponse) {
    if (value && (!this._user || this._user.id === value.id)) {
      this._user = value;
      if (this.permissionsForm) {
        // Update form with new permissions when user input changes
        const permissionsValue = Object.values(PermissionType).reduce(
          (acc, permission) => ({
            ...acc,
            [permission]: value.permissions.includes(permission),
          }),
          {}
        );
        this.permissionsForm.patchValue(
          { permissions: permissionsValue },
          { emitEvent: false }
        );
        this.permissionsForm.markAsPristine();
      }
    }
  }
  get user(): UserResponse {
    return this._user!;
  }
  private _user!: UserResponse;

  permissionsForm!: FormGroup;
  loading$ = this.store.select(UserSelectors.selectUserUpdating);
  errors$ = this.store.select(UserSelectors.selectUserErrors);
  permissionTypes = Object.values(PermissionType);
  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private store: Store,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.initForm();

    // Subscribe to store updates
    combineLatest([
      this.store.select(UserSelectors.selectUserUpdating),
      this.store.select(UserSelectors.selectSelectedUser),
      this.store.select(UserSelectors.selectUserErrors),
    ])
      .pipe(
        takeUntil(this.destroy$),
        filter(([updating]) => updating === false)
      )
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      .subscribe(([_, updatedUser, errors]) => {
        if (!errors && updatedUser) {
          // Update form with new permissions
          const permissionsValue = Object.values(PermissionType).reduce(
            (acc, permission) => ({
              ...acc,
              [permission]: updatedUser.permissions.includes(permission),
            }),
            {}
          );
          this.permissionsForm.patchValue(
            { permissions: permissionsValue },
            { emitEvent: false }
          );
          this.permissionsForm.markAsPristine();
          this.cd.detectChanges();
        }
      });
  }

  private initForm(): void {
    // Initialize form with user's current permissions
    const permissionsValue = Object.values(PermissionType).reduce<
      Record<PermissionType, boolean>
    >(
      (acc, permission) => ({
        ...acc,
        [permission]: this.user.permissions.includes(permission),
      }),
      {} as Record<PermissionType, boolean>
    );

    this.permissionsForm = this.fb.group({
      permissions: this.fb.group(
        Object.values(PermissionType).reduce(
          (acc, permission) => ({
            ...acc,
            [permission]: [permissionsValue[permission]],
          }),
          {}
        )
      ),
    });

    this.permissionsForm.patchValue({ permissions: permissionsValue });
    this.permissionsForm.markAsPristine();
  }

  onCancel(): void {
    // Reset to original permissions
    const originalPermissions = Object.values(PermissionType).reduce(
      (acc, permission) => ({
        ...acc,
        [permission]: this.user.permissions.includes(permission),
      }),
      {}
    );

    this.permissionsForm.patchValue({ permissions: originalPermissions });
    this.permissionsForm.markAsPristine();
  }

  onSubmit(): void {
    if (this.permissionsForm.valid && this.permissionsForm.dirty) {
      const formValue = this.permissionsForm.getRawValue();
      // Convert form values to API expected format
      const permissions = Object.entries(formValue.permissions).reduce(
        (acc, [key, value]) => ({
          ...acc,
          [key]: !!value,
        }),
        {} as { [key in PermissionType]: boolean }
      );

      this.store.dispatch(
        UserActions.updatePermissions({
          id: this.user.id,
          request: { permissions },
        })
      );
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
