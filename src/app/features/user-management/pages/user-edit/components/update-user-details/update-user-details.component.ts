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
import { TranslocoModule, TranslocoService } from '@jsverse/transloco';
import { MatIconModule } from '@angular/material/icon';
import {
  UserResponse,
  UpdateUserRequest,
} from '../../../../models/user.interface';
import { UserActions } from '../../../../store/user.actions';
import * as UserSelectors from '../../../../store/user.selectors';
import { Location } from '@angular/common';
import { takeUntil, filter } from 'rxjs/operators';
import { Subject, combineLatest } from 'rxjs';
import { NumberFormatService } from '@app/shared/services/number-format.service';

// Carbon imports
import {
  ButtonModule,
  CheckboxModule,
  DropdownModule,
  NFormsModule,
  InputModule,
  NotificationModule,
} from 'carbon-components-angular';

@Component({
  selector: 'app-update-user-details',
  templateUrl: './update-user-details.component.html',
  styleUrls: ['./update-user-details.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TranslocoModule,
    MatIconModule,
    // Carbon modules
    ButtonModule,
    CheckboxModule,
    DropdownModule,
    NFormsModule,
    InputModule,
    NotificationModule,
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
            wardNumber: value.wardNumber, // Simple value now, not an object
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

  // Format array for Carbon dropdown
  get wardNumbers() {
    return Array.from({ length: 33 }, (_, i) => {
      const number = i + 1;
      return {
        content: `Ward ${this.getFormattedWardNumber(number)}`,
        value: number, // Simple number value
        selected: number === this.updateForm?.get('wardNumber')?.value,
      };
    });
  }

  constructor(
    private fb: FormBuilder,
    private store: Store,
    private location: Location,
    public cd: ChangeDetectorRef,
    private numberFormat: NumberFormatService,
    private transloco: TranslocoService
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
        filter(([updating]) => updating === false)
      )
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      .subscribe(([_, updatedUser, errors]) => {
        if (!errors && updatedUser) {
          // Update form with new values and mark as pristine
          this.updateForm.patchValue(
            {
              email: updatedUser.email,
              isWardLevelUser: updatedUser.isWardLevelUser,
              wardNumber: updatedUser.wardNumber, // Simple number value
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
            value: this.user.wardNumber, // Simple number value
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
            wardControl?.setValidators([
              Validators.required,
              Validators.min(1),
              Validators.max(33),
            ]);
            // Set a default ward number if none is selected
            if (!wardControl?.value) {
              wardControl?.setValue(1);
            }
          } else {
            wardControl?.disable();
            wardControl?.clearValidators();
          }
          wardControl?.updateValueAndValidity();
          this.cd.detectChanges(); // Force update UI
        });

      // Listen for ward number changes to update the selected state in dropdown
      this.updateForm
        .get('wardNumber')
        ?.valueChanges.pipe(takeUntil(this.destroy$))
        .subscribe(() => {
          // Force refresh to update selected state in dropdown
          this.cd.detectChanges();
        });
    }
  }

  getFormattedWardNumber(number: number): string {
    return this.numberFormat.formatNumber(number);
  }

  hasEmailError(): boolean {
    const control = this.updateForm.get('email');
    return (
      Boolean(control?.invalid && control?.touched) ||
      Boolean(this.updateForm.get('email')?.hasError('email'))
    );
  }

  hasWardNumberError(): boolean {
    if (!this.updateForm.get('isWardLevelUser')?.value) return false;

    const wardControl = this.updateForm.get('wardNumber');
    return Boolean(
      (wardControl?.invalid && wardControl?.touched) ||
        (this.updateForm.hasError('wardNumberRequired') && wardControl?.touched)
    );
  }

  getEmailErrorText(): string {
    if (!this.hasEmailError()) return '';

    const control = this.updateForm.get('email');
    if (control?.hasError('required')) {
      return this.transloco.translate('user.form.errors.emailRequired');
    }
    if (control?.hasError('email')) {
      return this.transloco.translate('user.form.errors.emailInvalid');
    }
    return '';
  }

  onSubmit(): void {
    if (this.updateForm.valid && this.updateForm.dirty) {
      const formValue = this.updateForm.getRawValue();

      // Ensure wardNumber is extracted correctly if it's an object
      let wardNumber = formValue.wardNumber;
      if (
        wardNumber &&
        typeof wardNumber === 'object' &&
        wardNumber.value !== undefined
      ) {
        wardNumber = wardNumber.value;
      }

      const request: UpdateUserRequest = {
        email: formValue.email,
        isWardLevelUser: formValue.isWardLevelUser,
        wardNumber: formValue.isWardLevelUser ? wardNumber : null,
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
