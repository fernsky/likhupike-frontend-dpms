import {
  Component,
  Input,
  OnInit,
  Output,
  EventEmitter,
  OnDestroy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  AbstractControl,
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

import { RoleType } from '@app/core/models/role.enum';
import { CreateUserRequest, UserResponse } from '../../models/user.interface';
import { PasswordValidatorService } from '@app/shared/validators/password-validator.service';

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
  @Output() cancelForm = new EventEmitter<void>();

  userForm: FormGroup;
  roleTypes = Object.values(RoleType);
  selectedFile: File | null = null;
  previewUrl: string | null = null;
  passwordErrors: string[] = [];
  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private passwordValidator: PasswordValidatorService
  ) {
    this.userForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: [
        '',
        [
          Validators.required,
          (control: AbstractControl) =>
            this.passwordValidator.validatePassword(control),
        ],
      ],
      fullName: ['', [Validators.required]],
      fullNameNepali: ['', [Validators.required]],
      dateOfBirth: ['', [Validators.required]],
      address: ['', [Validators.required]],
      officePost: ['', [Validators.required]],
      wardNumber: [null],
      isMunicipalityLevel: [false],
      roles: [[], [Validators.required]],
      profilePicture: [null],
    });

    if (this.isEdit) {
      this.userForm.get('password')?.clearValidators();
      this.userForm.get('password')?.updateValueAndValidity();
    }
  }

  ngOnInit(): void {
    if (this.user) {
      this.userForm.patchValue({
        ...this.user,
        password: '',
      });
      this.previewUrl = this.user.profilePictureUrl || null;
    }

    // Watch for municipality level changes
    this.userForm
      .get('isMunicipalityLevel')
      ?.valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe((isMunicipal) => {
        const wardControl = this.userForm.get('wardNumber');
        if (isMunicipal) {
          wardControl?.setValue(null);
          wardControl?.disable();
        } else {
          wardControl?.enable();
        }
      });
  }

  onFileSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      this.selectedFile = file;
      const reader = new FileReader();
      reader.onload = () => {
        this.previewUrl = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  removeImage(): void {
    this.selectedFile = null;
    this.previewUrl = null;
    this.userForm.patchValue({ profilePicture: null });
  }

  onSubmit(): void {
    if (this.userForm.valid) {
      const formData: CreateUserRequest = {
        ...this.userForm.value,
        profilePicture: this.selectedFile,
      };
      this.submitForm.emit(formData);
    } else {
      this.markFormGroupTouched(this.userForm);
    }
  }

  onPasswordChange(): void {
    const passwordControl = this.userForm.get('password');
    if (passwordControl?.errors) {
      this.passwordErrors = this.passwordValidator.getPasswordErrorMessages(
        passwordControl.errors
      );
    } else {
      this.passwordErrors = [];
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
