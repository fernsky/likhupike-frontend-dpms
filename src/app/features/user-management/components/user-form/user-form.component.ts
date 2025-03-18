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
import { TranslocoModule } from '@jsverse/transloco';
import { provideNativeDateAdapter } from '@angular/material/core';

import {
  CreateUserRequest,
  UpdateUserRequest,
  UserResponse,
} from '../../models/user.interface';
import { PermissionType } from '@app/core/models/permission.enum';

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
  ],
  providers: [provideNativeDateAdapter()],
})
export class UserFormComponent implements OnInit, OnDestroy {
  @Input() loading = false;
  @Input() errors: Record<string, string[]> | null = null;
  @Input() user: UserResponse | null = null;
  @Input() isEdit = false;
  @Output() submitForm = new EventEmitter<CreateUserRequest>();
  @Output() submitUpdateForm = new EventEmitter<UpdateUserRequest>();
  @Output() cancelForm = new EventEmitter<void>();

  userForm!: FormGroup;
  permissionTypes = Object.values(PermissionType);
  private destroy$ = new Subject<void>();

  constructor(private fb: FormBuilder) {
    this.initForm();
  }

  private initForm(): void {
    const baseControls = {
      email: ['', [Validators.required, Validators.email]],
      isWardLevelUser: [false],
      wardNumber: [{ value: null, disabled: true }],
    };

    if (!this.isEdit) {
      Object.assign(baseControls, {
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
        permissions: this.fb.group(
          Object.values(PermissionType).reduce(
            (acc, permission) => ({
              ...acc,
              [permission]: [false],
            }),
            {}
          )
        ),
      });
    }

    this.userForm = this.fb.group(baseControls, {
      validators: [this.wardNumberValidator()],
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

  ngOnInit(): void {
    if (this.user) {
      const formValue = this.isEdit
        ? {
            email: this.user.email,
            isWardLevelUser: this.user.isWardLevelUser,
            wardNumber: this.user.wardNumber,
          }
        : {
            email: this.user.email,
            isWardLevelUser: this.user.isWardLevelUser,
            wardNumber: this.user.wardNumber,
            permissions: Object.entries(this.user.permissions).reduce(
              (acc, [key, value]) => ({
                ...acc,
                [key]: value,
              }),
              {}
            ),
          };

      this.userForm.patchValue(formValue);
    }

    this.setupWardLevelSubscription();
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
      if (this.isEdit) {
        const updateRequest: UpdateUserRequest = {
          email: formValue.email || null,
          isWardLevelUser: formValue.isWardLevelUser || null,
          wardNumber: formValue.wardNumber || null,
        };
        this.submitUpdateForm.emit(updateRequest);
      } else {
        const createRequest: CreateUserRequest = {
          email: formValue.email,
          password: formValue.password,
          isWardLevelUser: formValue.isWardLevelUser,
          wardNumber: formValue.wardNumber || null,
          permissions: Object.entries(formValue.permissions).reduce(
            (acc, [key, value]) => ({
              ...acc,
              [key]: value as boolean,
            }),
            {} as { [key in PermissionType]: boolean }
          ),
        };
        this.submitForm.emit(createRequest);
      }
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

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
