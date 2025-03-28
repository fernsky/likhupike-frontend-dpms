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
import { takeUntil } from 'rxjs/operators';
import * as AuthActions from '@app/core/store/auth/auth.actions';
import {
  selectAuthError,
  selectIsLoading,
  selectAuthState,
} from '@app/core/store/auth/auth.selectors';
import { BaseAuthComponent } from '../../components/base-auth/base-auth.component';
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
    BaseAuthComponent,
  ],
})
export class ForgotPasswordComponent
  extends BaseAuthComponent
  implements OnInit, OnDestroy
{
  forgotPasswordForm!: FormGroup;
  loading$: Observable<boolean>;
  apiError$: Observable<string | null>;
  currentStep: 'email' | 'otp' | 'reset' = 'email';
  hidePassword = true;
  hideConfirmPassword = true;
  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private store: Store,
    private passwordValidator: PasswordValidatorService
  ) {
    super();
    this.initForm();
    this.loading$ = this.store.select(selectIsLoading);
    this.apiError$ = this.store.select(selectAuthError);

    // Subscribe to auth state changes to handle success/failure
    this.store
      .select(selectAuthState)
      .pipe(takeUntil(this.destroy$))
      .subscribe((authState) => {
        if (authState.error) {
          this.forgotPasswordForm.setErrors({ serverError: authState.error });
        }
      });
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
            this.passwordValidator.validatePassword.bind(
              this.passwordValidator
            ),
          ],
        ],
        confirmPassword: ['', [Validators.required]],
      },
      {
        validators: [
          this.passwordValidator.passwordMatchValidator(
            'newPassword',
            'confirmPassword'
          ),
        ],
      }
    );

    // Initially disable OTP and password fields
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
      // Don't change step here - let the effect handle success
    }
  }

  onOtpChange(): void {
    const otpControl = this.forgotPasswordForm.get('otp');
    if (otpControl?.valid && otpControl.value.length === 6) {
      this.currentStep = 'reset';
      this.forgotPasswordForm.get('newPassword')?.enable();
      this.forgotPasswordForm.get('confirmPassword')?.enable();
    }
  }

  onSubmit(): void {
    if (this.forgotPasswordForm.valid && this.currentStep === 'reset') {
      const formValue = this.forgotPasswordForm.value;
      this.store.dispatch(
        AuthActions.resetPassword({
          resetData: {
            email: formValue.email,
            otp: formValue.otp,
            newPassword: formValue.newPassword,
            confirmPassword: formValue.confirmPassword,
          },
        })
      );
    }
  }

  ngOnInit(): void {
    // Listen for success actions to update steps
    this.store
      .select(selectAuthState)
      .pipe(takeUntil(this.destroy$))
      .subscribe((state) => {
        if (!state.isLoading && !state.error) {
          if (this.currentStep === 'email') {
            this.currentStep = 'otp';
            this.forgotPasswordForm.get('otp')?.enable();
          }
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
