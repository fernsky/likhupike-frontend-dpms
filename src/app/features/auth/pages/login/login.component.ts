import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, RouterLink } from '@angular/router';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Store } from '@ngrx/store';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import * as AuthActions from '@app/core/store/auth/auth.actions';
import { selectAuthState } from '@app/core/store/auth/auth.selectors';
import {
  provideTranslocoScope,
  TranslocoModule,
  TranslocoService,
} from '@jsverse/transloco';
import { MatIconModule } from '@angular/material/icon';

// Carbon Imports
import {
  ButtonModule,
  NFormsModule,
  InputModule,
  LinkModule,
  NotificationModule,
  UIShellModule,
} from 'carbon-components-angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    RouterLink,
    TranslocoModule,
    MatIconModule,

    ButtonModule,
    NFormsModule,
    InputModule,
    LinkModule,
    UIShellModule,
    NotificationModule,
  ],
  providers: [
    provideTranslocoScope({
      scope: 'login',
      alias: 'login',
    }),
  ],
})
export class LoginComponent implements OnInit, OnDestroy {
  loginForm: FormGroup;
  hidePassword = true;
  loading = false;
  formSubmitted = false;
  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private store: Store,
    private transloco: TranslocoService
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
    });
  }

  ngOnInit(): void {
    this.store
      .select(selectAuthState)
      .pipe(takeUntil(this.destroy$))
      .subscribe((authState) => {
        this.loading = authState.isLoading;
        if (authState.error) {
          this.loginForm.setErrors({ serverError: authState.error });
        }
      });
  }

  hasEmailError(): boolean {
    const control = this.loginForm.get('email');
    return Boolean(
      control?.invalid && (control?.touched || this.formSubmitted)
    );
  }

  hasPasswordError(): boolean {
    const control = this.loginForm.get('password');
    return Boolean(
      control?.invalid && (control?.touched || this.formSubmitted)
    );
  }

  getEmailErrorText(): string {
    if (!this.hasEmailError()) return '';

    const control = this.loginForm.get('email');
    if (control?.hasError('required')) {
      return this.transloco.translate('login.fields.email.errors.required');
    }
    if (control?.hasError('email')) {
      return this.transloco.translate('login.fields.email.errors.invalid');
    }
    return '';
  }

  getPasswordErrorText(): string {
    if (!this.hasPasswordError()) return '';

    const control = this.loginForm.get('password');
    if (control?.hasError('required')) {
      return this.transloco.translate('login.fields.password.errors.required');
    }
    if (control?.hasError('minlength')) {
      return this.transloco.translate('login.fields.password.errors.minlength');
    }
    return '';
  }

  onSubmit(): void {
    this.formSubmitted = true;

    if (this.loginForm.valid) {
      this.store.dispatch(
        AuthActions.login({ credentials: this.loginForm.value })
      );
    } else {
      this.loginForm.markAllAsTouched();
    }
  }

  togglePasswordVisibility(): void {
    this.hidePassword = !this.hidePassword;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
