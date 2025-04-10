import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import {
  TranslocoService,
  TranslocoModule,
  provideTranslocoScope,
} from '@jsverse/transloco';
import { Observable, Subject, takeUntil } from 'rxjs';
import { filter, map, tap } from 'rxjs/operators';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { ConfirmDialogComponent } from '@app/shared/components/confirm-dialog/confirm-dialog.component';
import { CanComponentDeactivate } from '@app/core/guards/unsaved-changes.guard';
import { CitizenFacade } from '../../store/citizen.facade';
import { CitizenResponse, UpdateCitizenDto } from '../../types';
import { BasicInfoTabComponent } from './components/basic-info-tab/basic-info-tab.component';
import { AddressTabComponent } from './components/address-tab/address-tab.component';
import { DocumentsTabComponent } from './components/documents-tab/documents-tab.component';

@Component({
  selector: 'app-citizen-edit',
  templateUrl: './citizen-edit.component.html',
  styleUrls: ['./citizen-edit.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TranslocoModule,
    MatButtonModule,
    MatIconModule,
    MatTabsModule,
    MatProgressSpinnerModule,
    BasicInfoTabComponent,
    AddressTabComponent,
    DocumentsTabComponent,
  ],
  providers: [
    provideTranslocoScope({
      scope: 'citizen-edit',
      alias: 'citizen',
    }),
  ],
})
export class CitizenEditComponent
  implements OnInit, OnDestroy, CanComponentDeactivate
{
  citizen$: Observable<CitizenResponse | null> =
    this.citizenFacade.selectedCitizen$;
  loading$: Observable<boolean> = this.citizenFacade.loadingSelected$;
  updating$: Observable<boolean> = this.citizenFacade.updating$;
  hasUnsavedChanges$: Observable<boolean> =
    this.citizenFacade.hasUnsavedChanges$;
  updateSuccess$: Observable<boolean> = this.citizenFacade.updateSuccess$;

  citizenId: string | null = null;
  editForm: FormGroup = this.fb.group({});

  private destroy$ = new Subject<void>();
  private formInitialized = false;

  constructor(
    private fb: FormBuilder,
    private citizenFacade: CitizenFacade,
    private route: ActivatedRoute,
    private router: Router,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private transloco: TranslocoService
  ) {}

  ngOnInit(): void {
    // Extract citizen ID from route params
    this.route.paramMap
      .pipe(
        takeUntil(this.destroy$),
        map((params) => params.get('id')),
        filter((id) => !!id),
        tap((id) => {
          this.citizenId = id;
          this.citizenFacade.loadCitizen(id!);
        })
      )
      .subscribe();

    // Initialize the form
    this.editForm = this.fb.group({});
    this.formInitialized = true;

    // Handle update success
    this.updateSuccess$
      .pipe(
        takeUntil(this.destroy$),
        filter((success) => success)
      )
      .subscribe(() => {
        this.citizenFacade.resetUpdateStatus();
        this.resetFormDirtyState();
      });
  }

  canDeactivate(): Observable<boolean> | boolean {
    // Check if the form has been initialized and is dirty
    const hasUnsavedChanges = this.formInitialized && this.editForm.dirty;

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

  onBackToDetails(): void {
    if (this.citizenId) {
      this.router.navigate(['/dashboard/citizens/view', this.citizenId]);
    } else {
      this.router.navigate(['/dashboard/citizens/list']);
    }
  }

  onSaveChanges(): void {
    if (this.editForm.valid && this.citizenId) {
      const updateData: UpdateCitizenDto = this.prepareUpdateData();
      this.citizenFacade.updateCitizen(this.citizenId, updateData);
    } else {
      this.showValidationErrors();
    }
  }

  private prepareUpdateData(): UpdateCitizenDto {
    const formValue = this.editForm.value;

    // Extract basic info
    const basicData = {
      name: formValue.name,
      nameDevnagari: formValue.nameDevnagari,
      email: formValue.email,
      phoneNumber: formValue.phoneNumber,
      fatherName: formValue.fatherName,
      grandfatherName: formValue.grandfatherName,
      spouseName: formValue.spouseName,
      citizenshipNumber: formValue.citizenshipNumber,
      citizenshipIssuedDate: formValue.citizenshipIssuedDate,
      citizenshipIssuedOffice: formValue.citizenshipIssuedOffice,
    };

    // Extract address data
    let permanentAddress = null;
    if (formValue.permanentAddress && formValue.permanentAddress.provinceCode) {
      permanentAddress = {
        provinceCode: formValue.permanentAddress.provinceCode,
        districtCode: formValue.permanentAddress.districtCode,
        municipalityCode: formValue.permanentAddress.municipalityCode,
        wardNumber: formValue.permanentAddress.wardNumber,
        streetAddress: formValue.permanentAddress.streetAddress,
      };
    }

    let temporaryAddress = null;
    if (formValue.temporaryAddress && formValue.temporaryAddress.provinceCode) {
      temporaryAddress = {
        provinceCode: formValue.temporaryAddress.provinceCode,
        districtCode: formValue.temporaryAddress.districtCode,
        municipalityCode: formValue.temporaryAddress.municipalityCode,
        wardNumber: formValue.temporaryAddress.wardNumber,
        streetAddress: formValue.temporaryAddress.streetAddress,
      };
    }

    return {
      ...basicData,
      permanentAddress,
      temporaryAddress,
    };
  }

  private showValidationErrors(): void {
    this.markFormGroupTouched(this.editForm);

    this.snackBar.open(
      this.transloco.translate('citizen.messages.validationError'),
      this.transloco.translate('common.actions.close'),
      { duration: 5000, panelClass: ['error-snackbar'] }
    );
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.values(formGroup.controls).forEach((control) => {
      control.markAsTouched();

      if ((control as FormGroup)?.controls) {
        this.markFormGroupTouched(control as FormGroup);
      }
    });
  }

  protected resetFormDirtyState(): void {
    this.editForm.markAsPristine();
    this.citizenFacade.setUnsavedChanges(false);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.citizenFacade.clearSelectedCitizen();
  }
}
