import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { TranslocoModule } from '@jsverse/transloco';
import { PasswordValidatorService } from '@app/shared/validators/password-validator.service';
import { NumberFormatService } from '@app/shared/services/number-format.service';
import { FormSectionComponent } from '@app/shared/components/form-section/form-section.component';
import { CreateUserRequest } from '../../models/user.interface';
import { PermissionType } from '@app/core/models/permission.enum';
import { UserValidationError } from '../../models/user-validation-error.interface';
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
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatIconModule,
    TranslocoModule,
    FormSectionComponent,
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
})
export class UserFormComponent implements OnInit {
  @Input() loading = false;
  @Input() errors: UserValidationError | string | null = null;
  l = null;
  @Output() submitForm = new EventEmitter<CreateUserRequest>();
  @Output() cancelForm = new EventEmitter<void>();

  userForm!: FormGroup;
  hidePassword = true;
  permissionTypes = Object.values(PermissionType);

  // Formatted for Carbon dropdown-list
  wardNumbers = Array.from({ length: 33 }, (_, i) => {
    const number = i + 1;
    return {
      content: `${this.getFormattedWardNumber(number)}`,
      value: number,
      selected: false,
    };
  });

  constructor(
    private fb: FormBuilder,
    private passwordValidator: PasswordValidatorService,
    private numberFormat: NumberFormatService
  ) {}

  ngOnInit(): void {
    this.initForm();
  }

  private initForm(): void {
    // Create permissions group with all permissions set to false by default
    const permissionsGroup = this.permissionTypes.reduce(
      (group, permission) => {
        group[permission] = [false];
        return group;
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      {} as Record<string, any>
    );

    this.userForm = this.fb.group(
      {
        email: ['', [Validators.required, Validators.email]],
        password: [
          '',
          [Validators.required, this.passwordValidator.createValidator()],
        ],
        isWardLevelUser: [false],
        wardNumber: [{ value: null, disabled: true }],
        permissions: this.fb.group(permissionsGroup),
      },
      {
        validators: [this.passwordValidator.createWardNumberValidator()],
      }
    );

    // Toggle ward number field based on ward level user checkbox
    this.userForm
      .get('isWardLevelUser')
      ?.valueChanges.subscribe((isWardLevel) => {
        const wardControl = this.userForm.get('wardNumber');
        if (isWardLevel) {
          wardControl?.enable();
          wardControl?.setValidators([
            Validators.required,
            Validators.min(1),
            Validators.max(33),
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

  togglePasswordVisibility(): void {
    this.hidePassword = !this.hidePassword;
  }

  getErrorMessage(): string {
    if (!this.errors) return '';

    if (typeof this.errors === 'string') {
      return this.errors;
    }

    return this.errors.message || JSON.stringify(this.errors);
  }

  onSubmit(): void {
    if (this.userForm.valid) {
      const formData = this.userForm.getRawValue();
      this.submitForm.emit(formData);
    } else {
      this.userForm.markAllAsTouched();
    }
  }

  onCancelClick(): void {
    this.cancelForm.emit();
  }

  resetForm(): void {
    this.userForm.reset();
    this.initForm();
  }
}
