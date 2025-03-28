import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  OnDestroy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  AbstractControl,
  ValidatorFn,
  ValidationErrors,
} from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import {
  provideTranslocoScope,
  TranslocoModule,
  TranslocoService,
} from '@jsverse/transloco';
import { provideNativeDateAdapter } from '@angular/material/core';
import { Location } from '@angular/common';

import {
  CreateUserRequest,
  UserValidationError,
} from '../../models/user.interface';
import { PermissionType } from '@app/core/models/permission.enum';
import { NumberFormatService } from '@app/shared/services/number-format.service';
import { BaseButtonComponent } from '@app/shared/components/base-button/base-button.component';
import { FormSectionComponent } from '@app/shared/components/form-section/form-section.component';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TranslocoModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatDatepickerModule,
    MatCheckboxModule,
    MatIconModule,
    MatTooltipModule,
    MatProgressSpinnerModule,
    BaseButtonComponent,
    FormSectionComponent,
  ],
  providers: [
    provideNativeDateAdapter(),
    provideTranslocoScope({
      scope: 'user-management',
      alias: 'user',
    }),
  ],
})
export class UserFormComponent implements OnInit, OnDestroy {
  @Input() loading = false;
  @Input() errors: UserValidationError | null = null;
  @Output() submitForm = new EventEmitter<CreateUserRequest>();
  @Output() cancelForm = new EventEmitter<void>();

  userForm!: FormGroup;
  permissionTypes = Object.values(PermissionType);
  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private numberFormat: NumberFormatService,
    private translocoService: TranslocoService,
    private location: Location
  ) {
    this.initializeForm();
  }

  initializeForm(): void {
    this.userForm = this.fb.group(
      {
        email: ['', [Validators.required, Validators.email]],
        password: [
          '',
          [
            Validators.required,
            Validators.minLength(8),
            Validators.pattern(
              /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=]).*$/
            ),
          ],
        ],
        isWardLevelUser: [false],
        wardNumber: [{ value: null, disabled: true }],
        permissions: this.fb.group(
          Object.values(PermissionType).reduce(
            (acc, permission) => ({
              ...acc,
              [permission]: [false],
            }),
            {}
          )
        ),
      },
      {
        validators: [this.wardNumberValidator()],
      }
    );

    // Reset all validation states
    this.userForm.markAsUntouched();
    this.userForm.markAsPristine();

    // Reset all child controls
    Object.keys(this.userForm.controls).forEach((key) => {
      const control = this.userForm.get(key);
      control?.markAsUntouched();
      control?.markAsPristine();
      if (control instanceof FormGroup) {
        Object.keys(control.controls).forEach((childKey) => {
          control.get(childKey)?.markAsUntouched();
          control.get(childKey)?.markAsPristine();
        });
      }
    });
  }

  resetForm(): void {
    // Create form with empty values but without triggering validation
    const emptyForm = {
      email: '',
      password: '',
      isWardLevelUser: false,
      wardNumber: null,
      permissions: Object.values(PermissionType).reduce(
        (acc, permission) => ({
          ...acc,
          [permission]: false,
        }),
        {}
      ),
    };

    // Reset with empty values
    this.userForm.reset(emptyForm);

    // Disable ward number field as it should be disabled initially
    this.userForm.get('wardNumber')?.disable();

    // Clear all states and errors
    Object.keys(this.userForm.controls).forEach((key) => {
      const control = this.userForm.get(key);
      control?.setErrors(null);
      control?.markAsUntouched();
      control?.markAsPristine();

      if (control instanceof FormGroup) {
        Object.keys(control.controls).forEach((childKey) => {
          const childControl = control.get(childKey);
          childControl?.setErrors(null);
          childControl?.markAsUntouched();
          childControl?.markAsPristine();
        });
      }
    });

    // Clear form-level validation
    this.userForm.setErrors(null);
  }

  ngOnInit(): void {
    this.setupWardLevelSubscription();

    // Reset form validity when user makes changes after an error
    this.userForm.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(() => {
      if (this.userForm.dirty) {
        this.userForm.updateValueAndValidity();
      }
    });
  }

  private wardNumberValidator(): ValidatorFn {
    return (formGroup: AbstractControl): ValidationErrors | null => {
      const isWardLevel = formGroup.get('isWardLevelUser')?.value;
      const wardNumber = formGroup.get('wardNumber')?.value;

      if (isWardLevel && !wardNumber) {
        return { wardNumberRequired: true };
      }

      if (wardNumber && (wardNumber < 1 || wardNumber > 33)) {
        return { wardNumberRange: true };
      }

      return null;
    };
  }

  private setupWardLevelSubscription(): void {
    this.userForm
      .get('isWardLevelUser')
      ?.valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe((isWardLevel) => {
        const wardControl = this.userForm.get('wardNumber');
        if (isWardLevel) {
          wardControl?.enable();
        } else {
          wardControl?.disable();
          wardControl?.setValue(null);
        }
      });
  }

  onSubmit(): void {
    if (this.userForm.valid) {
      const formValue = this.userForm.getRawValue();
      const createRequest: CreateUserRequest = {
        email: formValue.email,
        password: formValue.password,
        isWardLevelUser: formValue.isWardLevelUser,
        wardNumber: formValue.isWardLevelUser ? formValue.wardNumber : null,
        permissions: formValue.permissions,
      };

      this.submitForm.emit(createRequest);
      // Don't reset form - it will only be reset on successful creation
    } else {
      this.markFormGroupTouched(this.userForm);
    }
  }

  private markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach((control) => {
      control.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

  onCancel(): void {
    this.location.back();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  getFormattedWardNumber(number: number): string {
    return this.numberFormat.formatNumber(number);
  }
}
