import { Component, Input, OnDestroy, ChangeDetectorRef } from '@angular/core';
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
import { UserResponse } from '../../../../models/user.interface';
import { UserActions } from '../../../../store/user.actions';
import * as UserSelectors from '../../../../store/user.selectors';
import { Subject } from 'rxjs';
import { takeUntil, filter, take } from 'rxjs/operators';

// Carbon imports
import {
  ButtonModule,
  NFormsModule,
  InputModule,
  NotificationModule,
} from 'carbon-components-angular';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatIconModule,
    TranslocoModule,
    // Carbon modules
    ButtonModule,
    NFormsModule,
    InputModule,
    NotificationModule,
  ],
})
export class ResetPasswordComponent implements OnDestroy {
  @Input() user!: UserResponse;

  passwordForm = this.fb.group(
    {
      newPassword: [
        '',
        [
          Validators.required,
          Validators.minLength(8),
          Validators.pattern(
            /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=]).*$/
          ),
        ],
      ],
      confirmPassword: ['', [Validators.required]],
    },
    { validators: this.passwordMatchValidator }
  );

  loading$ = this.store.select(UserSelectors.selectUserUpdating);
  errors$ = this.store.select(UserSelectors.selectUserErrors);
  hidePassword = true;
  hideConfirmPassword = true;
  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private store: Store,
    private cd: ChangeDetectorRef,
    private transloco: TranslocoService
  ) {
    // Setup form reset subscription with error clearing
    this.store
      .select(UserSelectors.selectUserUpdating)
      .pipe(
        takeUntil(this.destroy$),
        filter((updating) => updating === false)
      )
      .subscribe(() => {
        this.store
          .select(UserSelectors.selectUserErrors)
          .pipe(take(1))
          .subscribe((errors) => {
            if (!errors) {
              this.store.dispatch(UserActions.clearErrors());
              this.resetForm();
            }
          });
      });
  }

  private passwordMatchValidator(g: FormGroup) {
    const newPassword = g.get('newPassword')?.value;
    const confirmPassword = g.get('confirmPassword')?.value;
    return newPassword === confirmPassword ? null : { passwordMismatch: true };
  }

  hasNewPasswordError(): boolean {
    const control = this.passwordForm.get('newPassword');
    return Boolean(control?.invalid && control?.touched);
  }

  hasConfirmPasswordError(): boolean {
    const control = this.passwordForm.get('confirmPassword');
    return Boolean(
      (control?.invalid && control?.touched) ||
        (this.passwordForm.hasError('passwordMismatch') && control?.touched)
    );
  }

  getNewPasswordError(): string {
    if (!this.hasNewPasswordError()) return '';

    const control = this.passwordForm.get('newPassword');
    if (control?.hasError('required')) {
      return 'user.form.errors.passwordRequired';
    }
    if (control?.hasError('minlength')) {
      return 'user.form.errors.passwordLength';
    }
    if (control?.hasError('pattern')) {
      return 'user.form.errors.passwordPattern';
    }
    return '';
  }

  getConfirmPasswordError(): string {
    if (!this.hasConfirmPasswordError()) return '';

    if (this.passwordForm.hasError('passwordMismatch')) {
      return 'user.form.errors.passwordMismatch';
    }

    const control = this.passwordForm.get('confirmPassword');
    if (control?.hasError('required')) {
      return 'user.form.errors.passwordRequired';
    }

    return '';
  }

  onSubmit(): void {
    if (this.passwordForm.valid) {
      this.store.dispatch(
        UserActions.resetUserPassword({
          id: this.user.id,
          request: {
            newPassword: this.passwordForm.value.newPassword!,
            confirmPassword: this.passwordForm.value.confirmPassword!,
          },
        })
      );
    }
  }

  onCancel(): void {
    this.store.dispatch(UserActions.clearErrors());
    this.resetForm();
  }

  // Reset form
  private resetForm(): void {
    // Clear all form values without triggering validation
    this.passwordForm.reset(
      {
        newPassword: '',
        confirmPassword: '',
      },
      { emitEvent: false }
    );

    // Clear all validation states
    Object.keys(this.passwordForm.controls).forEach((key) => {
      const control = this.passwordForm.get(key);
      control?.setErrors(null);
      control?.markAsUntouched();
      control?.markAsPristine();
    });

    // Clear form level errors
    this.passwordForm.setErrors(null);

    // Reset visibility states
    this.hidePassword = true;
    this.hideConfirmPassword = true;

    this.cd.detectChanges();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
