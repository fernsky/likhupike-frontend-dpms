import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatStepperModule, MatStepper } from '@angular/material/stepper';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import {
  provideTranslocoScope,
  TranslocoModule,
  TranslocoService,
} from '@jsverse/transloco';
import { Observable, Subject, takeUntil } from 'rxjs';
import { CreateCitizenDto } from '../../types';
import { CitizenFacade } from '../../store/citizen.facade';
import { CreateSuccessComponent } from './components/create-success/create-success.component';
import { PersonalInfoFormComponent } from './components/personal-info-form/personal-info-form.component';
import { CitizenshipFormComponent } from './components/citizenship-form/citizenship-form.component';
import { AddressFormComponent } from './components/address-form/address-form.component';
import { CanComponentDeactivate } from '@app/core/guards/unsaved-changes.guard';
import { ConfirmDialogComponent } from '@app/shared/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-citizen-create',
  templateUrl: './citizen-create.component.html',
  styleUrls: ['./citizen-create.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatStepperModule,
    MatButtonModule,
    MatCardModule,
    MatCheckboxModule,
    MatProgressSpinnerModule,
    MatIconModule,
    MatFormFieldModule,
    TranslocoModule,
    PersonalInfoFormComponent,
    CitizenshipFormComponent,
    AddressFormComponent,
  ],
  providers: [
    provideTranslocoScope({
      scope: 'citizen-create',
      alias: 'citizen',
    }),
  ],
})
export class CitizenCreateComponent
  implements OnInit, OnDestroy, CanComponentDeactivate
{
  @ViewChild('stepper') stepper!: MatStepper;

  creating$: Observable<boolean> = this.citizenFacade.creating$;
  createSuccess$: Observable<boolean> = this.citizenFacade.createSuccess$;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  errors$: Observable<any> = this.citizenFacade.errors$;

  personalInfoForm!: FormGroup;
  citizenshipForm!: FormGroup;
  addressForm!: FormGroup;
  summaryForm!: FormGroup;

  private destroy$ = new Subject<void>();
  private isSubmitting = false;

  constructor(
    private fb: FormBuilder,
    private citizenFacade: CitizenFacade,
    private router: Router,
    private dialog: MatDialog,
    private transloco: TranslocoService
  ) {}

  ngOnInit(): void {
    this.initForms();

    // Listen for creation success and show dialog
    this.createSuccess$.pipe(takeUntil(this.destroy$)).subscribe((success) => {
      if (success) {
        this.isSubmitting = true;
        this.showSuccessDialog();
      }
    });

    // Reset status when component initializes
    this.citizenFacade.resetCreateStatus();
  }

  canDeactivate(): Observable<boolean> | boolean {
    // If submitting or succeeded, allow navigation
    if (this.isSubmitting) {
      return true;
    }

    // Check if any of the forms are dirty
    const hasUnsavedChanges =
      this.personalInfoForm.dirty ||
      this.citizenshipForm.dirty ||
      this.addressForm.dirty ||
      this.summaryForm.dirty;

    if (!hasUnsavedChanges) {
      return true;
    }

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: this.transloco.translate('common.dialogs.unsavedChanges.title'),
        message: this.transloco.translate(
          'common.dialogs.unsavedChanges.message'
        ),
        confirmButton: this.transloco.translate(
          'common.dialogs.unsavedChanges.confirmButton'
        ),
        cancelButton: this.transloco.translate(
          'common.dialogs.unsavedChanges.cancelButton'
        ),
      },
    });

    return dialogRef.afterClosed();
  }

  private initForms(): void {
    // Create basic forms
    this.personalInfoForm = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(100)]],
      nameDevnagari: ['', Validators.maxLength(100)],
      email: ['', [Validators.email, Validators.maxLength(100)]],
      phoneNumber: ['', Validators.maxLength(20)],
      fatherName: ['', Validators.maxLength(100)],
      grandfatherName: ['', Validators.maxLength(100)],
      spouseName: ['', Validators.maxLength(100)],
    });

    this.citizenshipForm = this.fb.group({
      citizenshipNumber: ['', [Validators.maxLength(50)]],
      citizenshipIssuedDate: [null],
      citizenshipIssuedOffice: ['', [Validators.maxLength(100)]],
    });

    this.addressForm = this.fb.group({
      permanentAddress: this.fb.group({
        provinceCode: ['', Validators.required],
        districtCode: ['', Validators.required],
        municipalityCode: ['', Validators.required],
        wardNumber: [
          null,
          [Validators.required, Validators.min(1), Validators.max(33)],
        ],
        streetAddress: ['', Validators.maxLength(200)],
      }),
      tempSameAsPermanent: [false],
      temporaryAddress: this.fb.group({
        provinceCode: [''],
        districtCode: [''],
        municipalityCode: [''],
        wardNumber: [null, [Validators.min(1), Validators.max(33)]],
        streetAddress: ['', Validators.maxLength(200)],
      }),
    });

    this.summaryForm = this.fb.group({
      isApproved: [false],
    });

    // Handle the "same as permanent" checkbox
    this.addressForm
      .get('tempSameAsPermanent')
      ?.valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe((sameAsPermanent) => {
        if (sameAsPermanent) {
          // Copy values from permanent to temporary
          const permanentAddressValue =
            this.addressForm.get('permanentAddress')?.value;
          this.addressForm
            .get('temporaryAddress')
            ?.patchValue(permanentAddressValue);
          this.addressForm.get('temporaryAddress')?.disable();
        } else {
          this.addressForm.get('temporaryAddress')?.enable();
        }
      });
  }

  onSubmit(): void {
    if (
      this.personalInfoForm.invalid ||
      this.addressForm.get('permanentAddress')?.invalid
    ) {
      // Mark all fields as touched to show validation errors
      this.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    const createData: CreateCitizenDto = this.prepareCreateData();
    this.citizenFacade.createCitizen(createData);
  }

  private prepareCreateData(): CreateCitizenDto {
    const personalInfo = this.personalInfoForm.value;
    const citizenshipInfo = this.citizenshipForm.value;
    const permanentAddress = this.addressForm.get('permanentAddress')?.value;

    // Handle temporary address based on checkbox
    let temporaryAddress = null;
    if (!this.addressForm.get('tempSameAsPermanent')?.value) {
      const tempAddressControl = this.addressForm.get('temporaryAddress');
      // Only include if at least province is selected
      if (tempAddressControl?.value?.provinceCode) {
        temporaryAddress = tempAddressControl.value;
      }
    } else {
      // If same as permanent, copy the values
      temporaryAddress = { ...permanentAddress };
    }

    // Format citizenship date if present
    let citizenshipIssuedDate = null;
    if (citizenshipInfo.citizenshipIssuedDate) {
      const date = new Date(citizenshipInfo.citizenshipIssuedDate);
      citizenshipIssuedDate = date.toISOString().split('T')[0];
    }

    const isApproved = this.summaryForm.get('isApproved')?.value || false;

    return {
      ...personalInfo,
      ...{
        citizenshipNumber: citizenshipInfo.citizenshipNumber || null,
        citizenshipIssuedDate: citizenshipIssuedDate,
        citizenshipIssuedOffice:
          citizenshipInfo.citizenshipIssuedOffice || null,
      },
      permanentAddress,
      temporaryAddress,
      isApproved,
    };
  }

  markAllAsTouched(): void {
    this.personalInfoForm.markAllAsTouched();
    this.citizenshipForm.markAllAsTouched();

    const permanentAddressGroup = this.addressForm.get('permanentAddress');
    if (permanentAddressGroup && permanentAddressGroup instanceof FormGroup) {
      Object.keys(permanentAddressGroup.controls).forEach((key) => {
        permanentAddressGroup.get(key)?.markAsTouched();
      });
    }

    if (!this.addressForm.get('tempSameAsPermanent')?.value) {
      const temporaryAddressGroup = this.addressForm.get('temporaryAddress');
      if (temporaryAddressGroup && temporaryAddressGroup instanceof FormGroup) {
        Object.keys(temporaryAddressGroup.controls).forEach((key) => {
          temporaryAddressGroup.get(key)?.markAsTouched();
        });
      }
    }
  }

  showSuccessDialog(): void {
    const dialogRef = this.dialog.open(CreateSuccessComponent, {
      width: '400px',
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result === 'list') {
        this.router.navigate(['/dashboard/citizens/list']);
      } else if (result === 'new') {
        // Reset forms and stepper
        this.resetForms();
        this.stepper.reset();
        // Reset creation status
        this.citizenFacade.resetCreateStatus();
      }
    });
  }

  resetForms(): void {
    this.personalInfoForm.reset();
    this.citizenshipForm.reset();
    this.addressForm.reset({
      tempSameAsPermanent: false,
    });
    this.summaryForm.reset({
      isApproved: false,
    });
  }

  onCancel(): void {
    this.router.navigate(['/dashboard/citizens/list']);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    // Reset citizen creation status
    this.citizenFacade.resetCreateStatus();
  }

  // Helper method to safely cast AbstractControl to FormControl
  getFormControl(formGroup: FormGroup, controlName: string): FormControl {
    return formGroup.get(controlName) as FormControl;
  }
}
