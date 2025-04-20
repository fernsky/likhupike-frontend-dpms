import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { TranslocoModule } from '@jsverse/transloco';

import { FormSectionComponent } from '@app/shared/components/form-section/form-section.component';
import { BaseButtonComponent } from '@app/shared/components/base-button/base-button.component';

import { CooperativeStatus, CooperativeType } from '../../../../types';

@Component({
  selector: 'app-basic-info-form',
  templateUrl: './basic-info-form.component.html',
  styleUrls: ['./basic-info-form.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    TranslocoModule,
    FormSectionComponent,
    BaseButtonComponent,
  ],
})
export class BasicInfoFormComponent {
  @Input() parentForm!: FormGroup;
  @Input() cooperativeTypes: CooperativeType[] = [];
  @Input() cooperativeStatuses: CooperativeStatus[] = [];
  @Input() availableLocales: string[] = [];

  @Output() nextStepClicked = new EventEmitter<void>();
  @Output() cancelClicked = new EventEmitter<void>();

  get codeControl(): FormControl {
    return this.parentForm.get('code') as FormControl;
  }

  get defaultLocaleControl(): FormControl {
    return this.parentForm.get('defaultLocale') as FormControl;
  }

  get typeControl(): FormControl {
    return this.parentForm.get('type') as FormControl;
  }

  get wardControl(): FormControl {
    return this.parentForm.get('ward') as FormControl;
  }

  get statusControl(): FormControl {
    return this.parentForm.get('status') as FormControl;
  }

  get establishedDateControl(): FormControl {
    return this.parentForm.get('establishedDate') as FormControl;
  }

  get registrationNumberControl(): FormControl {
    return this.parentForm.get('registrationNumber') as FormControl;
  }

  get contactEmailControl(): FormControl {
    return this.parentForm.get('contactEmail') as FormControl;
  }

  get contactPhoneControl(): FormControl {
    return this.parentForm.get('contactPhone') as FormControl;
  }

  get websiteUrlControl(): FormControl {
    return this.parentForm.get('websiteUrl') as FormControl;
  }

  onNext(): void {
    this.nextStepClicked.emit();
  }

  onCancel(): void {
    this.cancelClicked.emit();
  }
}
