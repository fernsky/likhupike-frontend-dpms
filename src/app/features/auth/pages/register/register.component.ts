import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { Store } from '@ngrx/store';
import { Subject, Observable } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import * as AuthActions from '@app/core/store/auth/auth.actions';
import {
  selectAuthState,
  selectIsLoading,
  selectAuthError,
} from '@app/core/store/auth/auth.selectors';
import { AppState } from '@app/core/store';
import {
  provideTranslocoScope,
  TranslocoModule,
  TranslocoService,
} from '@jsverse/transloco';
import { PasswordValidatorService } from '@app/shared/validators/password-validator.service';
import { NumberFormatService } from '@app/shared/services/number-format.service';
import { MatIconModule } from '@angular/material/icon';

// Carbon imports
import {
  ButtonModule,
  CheckboxModule,
  DropdownModule,
  NFormsModule,
  InputModule,
  LinkModule,
  NotificationModule,
  UIShellModule,
} from 'carbon-components-angular';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatIconModule,
    TranslocoModule,
    // Carbon modules
    ButtonModule,
    CheckboxModule,
    DropdownModule,
    NFormsModule,
    InputModule,
    LinkModule,
    NotificationModule,
    UIShellModule,
  ],
  providers: [
    provideTranslocoScope({
      scope: 'registration',
      alias: 'register',
    }),
  ],
})
export class RegisterComponent implements OnInit, OnDestroy {
  registerForm!: FormGroup;
  hidePassword = true;
  hideConfirmPassword = true;

  // Properly formatted for Carbon dropdown-list
  wardNumbers = Array.from({ length: 5 }, (_, i) => {
    const number = i + 1;
    return {
      content: `${this.getFormattedWardNumber(number)}`,
      value: number,
      selected: false,
    };
  });

  private destroy$ = new Subject<void>();

  // Initialize observables properly
  loading$: Observable<boolean>;
  apiError$: Observable<string | null>;

  constructor(
    private fb: FormBuilder,
    private store: Store<AppState>,
    private passwordValidator: PasswordValidatorService,
    private numberFormat: NumberFormatService,
    private translocoService: TranslocoService
  ) {
    // Initialize observables in constructor
    this.loading$ = this.store.select(selectIsLoading);
    this.apiError$ = this.store.select(selectAuthError);
    this.initForm();
  }

  private initForm(): void {
    this.registerForm = this.fb.group(
      {
        email: ['', [Validators.required, Validators.email]],
        password: [
          '',
          [Validators.required, this.passwordValidator.createValidator()],
        ],
        confirmPassword: ['', Validators.required],
        isWardLevelUser: [false],
        wardNumber: [{ value: null, disabled: true }],
      },
      {
        validators: [
          this.passwordValidator.createMatchValidator(
            'password',
            'confirmPassword'
          ),
          this.passwordValidator.createWardNumberValidator(),
        ],
      }
    );

    this.registerForm
      .get('isWardLevelUser')
      ?.valueChanges.subscribe((isWardLevel) => {
        const wardControl = this.registerForm.get('wardNumber');
        if (isWardLevel) {
          wardControl?.enable();
          wardControl?.setValidators([
            Validators.required,
            Validators.min(1),
            Validators.max(5),
          ]);
        } else {
          wardControl?.disable();
          wardControl?.clearValidators();
        }
        wardControl?.updateValueAndValidity();
      });
  }

  getFormattedWardNumber(number: number): string {
    return this.numberFormat.formatNumber(number);
  }

  togglePasswordVisibility(field: 'password' | 'confirm'): void {
    if (field === 'password') {
      this.hidePassword = !this.hidePassword;
    } else {
      this.hideConfirmPassword = !this.hideConfirmPassword;
    }
  }

  ngOnInit(): void {
    // Subscribe to auth state changes
    this.store
      .select(selectAuthState)
      .pipe(takeUntil(this.destroy$))
      .subscribe((authState) => {
        if (authState.error) {
          this.registerForm.setErrors({ serverError: authState.error });
        }
      });
  }

  onSubmit(): void {
    if (this.registerForm.valid) {
      this.store.dispatch(
        AuthActions.register({
          userData: this.registerForm.getRawValue(),
        })
      );
    } else {
      this.registerForm.markAllAsTouched();
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
