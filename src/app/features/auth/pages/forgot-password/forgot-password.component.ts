import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Store } from '@ngrx/store';
import { Observable, Subject } from 'rxjs';
import { takeUntil, take } from 'rxjs/operators';
import * as AuthActions from '@app/core/store/auth/auth.actions';
import {
  selectAuthError,
  selectIsLoading,
  selectAuthState,
  selectForgotPasswordEmail,
} from '@app/core/store/auth/auth.selectors';
import { TranslocoModule } from '@jsverse/transloco';
import { PasswordValidatorService } from '@app/shared/validators/password-validator.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: [
    './forgot-password.component.scss',
    '../../components/base-auth/base-auth.component.scss',
  ],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatCardModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    TranslocoModule,
  ],
})
export class ForgotPasswordComponent implements OnInit, OnDestroy {
  forgotPasswordForm!: FormGroup;
  loading$: Observable<boolean>;
  apiError$: Observable<string | null>;
  savedEmail$: Observable<string | null>;
  currentStep: 'email' | 'otp' | 'reset' = 'email';
  hidePassword = true;
  hideConfirmPassword = true;
  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    public store: Store,
    private passwordValidator: PasswordValidatorService
  ) {
    this.initForm();
    this.loading$ = this.store.select(selectIsLoading);
    this.apiError$ = this.store.select(selectAuthError);
    this.savedEmail$ = this.store.select(selectForgotPasswordEmail);
  }

  private initForm(): void {
    this.forgotPasswordForm = this.fb.group(
      {
        email: ['', [Validators.required, Validators.email]],
        otp: ['', [Validators.required, Validators.pattern('^[0-9]{6}$')]],
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
      {
        validators: [
          this.passwordValidator.createMatchValidator(
            'newPassword',
            'confirmPassword'
          ),
        ],
      }
    );

    // Disable fields initially but preserve validators
    this.forgotPasswordForm.get('otp')?.disable();
    this.forgotPasswordForm.get('newPassword')?.disable();
    this.forgotPasswordForm.get('confirmPassword')?.disable();
  }

  onEmailSubmit(): void {
    if (this.forgotPasswordForm.get('email')?.valid) {
      const email = this.forgotPasswordForm.get('email')?.value;
      this.store.dispatch(
        AuthActions.requestPasswordReset({
          email: { email },
        })
      );
    }
  }

  onOtpChange(): void {
    const otpControl = this.forgotPasswordForm.get('otp');
    if (otpControl?.valid && otpControl.value.length === 6) {
      this.currentStep = 'reset';
      const newPasswordControl = this.forgotPasswordForm.get('newPassword');
      const confirmPasswordControl =
        this.forgotPasswordForm.get('confirmPassword');

      if (newPasswordControl?.disabled) {
        newPasswordControl.enable();
        newPasswordControl.updateValueAndValidity();
      }
      if (confirmPasswordControl?.disabled) {
        confirmPasswordControl.enable();
        confirmPasswordControl.updateValueAndValidity();
      }
    }
  }

  onSubmit(): void {
    if (this.forgotPasswordForm.valid && this.currentStep === 'reset') {
      const formValue = this.forgotPasswordForm.getRawValue(); // Use getRawValue to get disabled control values
      this.savedEmail$.pipe(take(1)).subscribe((email) => {
        if (email) {
          this.store.dispatch(
            AuthActions.resetPassword({
              resetData: {
                email: email,
                otp: formValue.otp,
                newPassword: formValue.newPassword,
                confirmPassword: formValue.confirmPassword,
              },
            })
          );
        }
      });
    } else {
      this.forgotPasswordForm.markAllAsTouched();
    }
  }

  resetForm(): void {
    this.currentStep = 'email';
    this.forgotPasswordForm.reset();
    this.forgotPasswordForm.get('email')?.enable();
    this.forgotPasswordForm.get('otp')?.disable();
    this.forgotPasswordForm.get('newPassword')?.disable();
    this.forgotPasswordForm.get('confirmPassword')?.disable();
  }

  getEmailError(): string | null {
    const control = this.forgotPasswordForm.get('email');
    if (control?.errors && control.touched) {
      if (control.errors['required']) {
        return 'forgotPassword.fields.email.errors.required';
      }
      if (control.errors['email']) {
        return 'forgotPassword.fields.email.errors.invalid';
      }
    }
    return null;
  }

  getOtpError(): string | null {
    const control = this.forgotPasswordForm.get('otp');
    if (control?.errors && control.touched) {
      if (control.errors['required']) {
        return 'forgotPassword.fields.otp.errors.required';
      }
      if (control.errors['pattern']) {
        return 'forgotPassword.fields.otp.errors.pattern';
      }
    }
    return null;
  }

  getNewPasswordError(): string | null {
    const control = this.forgotPasswordForm.get('newPassword');
    if (control?.errors && control.touched) {
      if (control.errors['required']) {
        return 'forgotPassword.fields.newPassword.errors.required';
      }
      if (control.errors['minlength']) {
        return 'forgotPassword.fields.newPassword.errors.minlength';
      }
      if (control.errors['pattern']) {
        return 'forgotPassword.fields.newPassword.errors.pattern';
      }
    }
    return null;
  }

  getConfirmPasswordError(): string | null {
    const control = this.forgotPasswordForm.get('confirmPassword');
    if (
      this.forgotPasswordForm.hasError('passwordMismatch') &&
      control?.touched
    ) {
      return 'forgotPassword.fields.confirmPassword.errors.mismatch';
    }
    if (control?.errors && control.touched) {
      if (control.errors['required']) {
        return 'forgotPassword.fields.confirmPassword.errors.required';
      }
    }
    return null;
  }

  ngOnInit(): void {
    // Reset form state when component initializes
    this.resetForm();

    // Listen for auth state changes
    this.store
      .select(selectAuthState)
      .pipe(takeUntil(this.destroy$))
      .subscribe((state) => {
        if (state.error) {
          this.forgotPasswordForm.setErrors({ serverError: state.error });
        }
      });

    // Clear any previous forgot password state
    this.store.dispatch(AuthActions.clearForgotPasswordState());
  }

  ngOnDestroy(): void {
    // Reset form and clear state when component is destroyed
    this.resetForm();
    this.store.dispatch(AuthActions.clearForgotPasswordState());
    this.destroy$.next();
    this.destroy$.complete();
  }
}
