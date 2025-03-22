import { Component, Input, OnDestroy } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Store } from '@ngrx/store';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { TranslocoModule } from '@jsverse/transloco';
import { UserResponse } from '../../../../models/user.interface';
import { UserActions } from '../../../../store/user.actions';
import * as UserSelectors from '../../../../store/user.selectors';
import { Subject } from 'rxjs';
import { takeUntil, filter } from 'rxjs/operators';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    TranslocoModule,
  ],
})
export class ResetPasswordComponent implements OnDestroy {
  @Input() user!: UserResponse;

  passwordForm: FormGroup;
  loading$ = this.store.select(UserSelectors.selectUserUpdating);
  errors$ = this.store.select(UserSelectors.selectUserErrors);
  hidePassword = true;
  hideConfirmPassword = true;
  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private store: Store,
    private location: Location
  ) {
    this.passwordForm = this.fb.group(
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
  }

  private passwordMatchValidator(g: FormGroup) {
    const newPassword = g.get('newPassword')?.value;
    const confirmPassword = g.get('confirmPassword')?.value;
    return newPassword === confirmPassword ? null : { passwordMismatch: true };
  }

  onSubmit(): void {
    if (this.passwordForm.valid) {
      this.store.dispatch(
        UserActions.resetUserPassword({
          id: this.user.id,
          request: {
            newPassword: this.passwordForm.value.newPassword,
            confirmPassword: this.passwordForm.value.confirmPassword,
          },
        })
      );

      // Navigate back on success
      this.store
        .select(UserSelectors.selectUserErrors)
        .pipe(
          takeUntil(this.destroy$),
          filter((errors) => !errors)
        )
        .subscribe(() => {
          this.location.back();
        });
    }
  }

  onCancel(): void {
    this.location.back();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
