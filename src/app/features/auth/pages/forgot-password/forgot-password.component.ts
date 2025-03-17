import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDividerModule } from '@angular/material/divider';
import { Store } from '@ngrx/store';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import * as AuthActions from '../../../../core/store/auth/auth.actions';
import { selectAuthState } from '../../../../core/store/auth/auth.selectors';
import { RequestPasswordResetRequest } from '../../../../core/models/auth.interface';
import {
  authAnimations,
  combineAnimations,
} from '@shared/animations/auth.animations';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatCardModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatFormFieldModule,
    MatDividerModule,
  ],
  animations: combineAnimations(
    authAnimations.fadeSlideInOut,
    authAnimations.formControls,
    authAnimations.successState,
    authAnimations.brandingAnimation,
    authAnimations.errorShake,
    authAnimations.loadingState,
    authAnimations.cardHover
  ),
})
export class ForgotPasswordComponent implements OnInit, OnDestroy {
  forgotPasswordForm!: FormGroup;
  loading = false;
  requestSent = false;
  private destroy$ = new Subject<void>();
  cardState = 'normal';

  constructor(
    private fb: FormBuilder,
    private store: Store
  ) {
    this.initializeForm();
  }

  private initializeForm(): void {
    this.forgotPasswordForm = this.fb.group({
      email: [
        '',
        [
          Validators.required,
          Validators.email,
          Validators.pattern(
            /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
          ),
        ],
      ],
    });
  }

  ngOnInit(): void {
    this.store
      .select(selectAuthState)
      .pipe(takeUntil(this.destroy$))
      .subscribe((authState) => {
        this.loading = authState.isLoading;
        if (authState.error) {
          this.forgotPasswordForm.setErrors({ serverError: authState.error });
        }
        // Check if password reset request was successful
        if (
          !authState.isLoading &&
          !authState.error &&
          this.forgotPasswordForm.dirty
        ) {
          this.requestSent = true;
        }
      });
  }

  onSubmit(): void {
    if (this.forgotPasswordForm.valid) {
      const request: RequestPasswordResetRequest = {
        email: this.forgotPasswordForm.get('email')?.value,
      };
      this.store.dispatch(AuthActions.requestPasswordReset({ email: request }));
    } else {
      this.forgotPasswordForm.markAllAsTouched();
    }
  }

  onTryAgain(): void {
    this.requestSent = false;
    this.forgotPasswordForm.reset();
    this.forgotPasswordForm.markAsUntouched();
  }

  @HostListener('mouseenter')
  onMouseEnter() {
    this.cardState = 'hovered';
  }

  @HostListener('mouseleave')
  onMouseLeave() {
    this.cardState = 'normal';
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
