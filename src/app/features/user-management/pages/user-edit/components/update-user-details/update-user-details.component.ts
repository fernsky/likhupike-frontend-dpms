import {
  Component,
  Input,
  OnInit,
  OnDestroy,
  ChangeDetectorRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Store } from '@ngrx/store';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { TranslocoModule } from '@jsverse/transloco';
import {
  UserResponse,
  UpdateUserRequest,
} from '../../../../models/user.interface';
import { UserActions } from '../../../../store/user.actions';
import * as UserSelectors from '../../../../store/user.selectors';
import { Location } from '@angular/common';
import { takeUntil, filter } from 'rxjs/operators';
import { Subject, combineLatest } from 'rxjs';
import { BaseButtonComponent } from '@app/shared/components/base-button/base-button.component';

@Component({
  selector: 'app-update-user-details',
  templateUrl: './update-user-details.component.html',
  styleUrls: ['./update-user-details.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    TranslocoModule,
    BaseButtonComponent,
  ],
})
export class UpdateUserDetailsComponent implements OnInit, OnDestroy {
  @Input() set user(value: UserResponse) {
    if (value && (!this._user || this._user.id === value.id)) {
      this._user = value;
      if (this.updateForm) {
        this.updateForm.patchValue(
          {
            email: value.email,
            isWardLevelUser: value.isWardLevelUser,
            wardNumber: value.wardNumber,
          },
          { emitEvent: false }
        );
        this.updateForm.markAsPristine();
      }
    }
  }
  get user(): UserResponse {
    return this._user!;
  }
  private _user!: UserResponse;

  updateForm!: FormGroup;
  loading$ = this.store.select(UserSelectors.selectUserUpdating);
  errors$ = this.store.select(UserSelectors.selectUserErrors);
  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private store: Store,
    private location: Location,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.initForm();

    // Subscribe to store selectors for updates
    combineLatest([
      this.store.select(UserSelectors.selectUserUpdating),
      this.store.select(UserSelectors.selectSelectedUser),
      this.store.select(UserSelectors.selectUserErrors),
    ])
      .pipe(
        takeUntil(this.destroy$),
        filter(([updating]) => updating === false) // Only proceed when not updating
      )
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      .subscribe(([_, updatedUser, errors]) => {
        if (!errors && updatedUser) {
          // Update form with new values and mark as pristine
          this.updateForm.patchValue(
            {
              email: updatedUser.email,
              isWardLevelUser: updatedUser.isWardLevelUser,
              wardNumber: updatedUser.wardNumber,
            },
            { emitEvent: false }
          );

          // Reset form state
          this.updateForm.markAsPristine();
          this.updateForm.markAsUntouched();

          // Force change detection
          this.cd.detectChanges();
        }
      });

    // Monitor form changes for dirty state
    this.updateForm.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.cd.detectChanges();
      });
  }

  private initForm(): void {
    if (this.user) {
      this.updateForm = this.fb.group({
        email: [this.user.email, [Validators.required, Validators.email]],
        isWardLevelUser: [this.user.isWardLevelUser],
        wardNumber: [
          {
            value: this.user.wardNumber,
            disabled: !this.user.isWardLevelUser,
          },
          [Validators.min(1), Validators.max(33)],
        ],
      });

      // Handle ward level user changes
      this.updateForm
        .get('isWardLevelUser')
        ?.valueChanges.subscribe((isWardLevel) => {
          const wardControl = this.updateForm.get('wardNumber');
          if (isWardLevel) {
            wardControl?.enable();
          } else {
            wardControl?.disable();
            wardControl?.setValue(null);
          }
        });
    }
  }

  onSubmit(): void {
    if (this.updateForm.valid && this.updateForm.dirty) {
      const formValue = this.updateForm.getRawValue();
      const request: UpdateUserRequest = {
        email: formValue.email,
        isWardLevelUser: formValue.isWardLevelUser,
        wardNumber: formValue.isWardLevelUser ? formValue.wardNumber : null,
      };

      this.store.dispatch(
        UserActions.updateUser({
          id: this.user.id,
          request,
        })
      );
    }
  }

  onCancel(): void {
    // Reset form to initial values
    this.initForm();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
