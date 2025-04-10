import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { provideTranslocoScope, TranslocoModule } from '@jsverse/transloco';
import { CitizenFacade } from '../../../../store/citizen.facade';
import { CitizenResponse } from '../../../../types';

@Component({
  selector: 'app-basic-info-tab',
  templateUrl: './basic-info-tab.component.html',
  styleUrls: ['./basic-info-tab.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    TranslocoModule,
  ],
  providers: [
    provideTranslocoScope({
      scope: 'citizen-edit',
      alias: 'citizen',
    }),
  ],
})
export class BasicInfoTabComponent implements OnInit {
  @Input() parentForm!: FormGroup;
  @Input() citizen!: CitizenResponse;

  basicInfoForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private citizenFacade: CitizenFacade
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.setupFormChangeTracking();
  }

  private initForm(): void {
    this.basicInfoForm = this.fb.group({
      name: [
        this.citizen.name,
        [Validators.required, Validators.maxLength(100)],
      ],
      nameDevnagari: [this.citizen.nameDevnagari, [Validators.maxLength(100)]],
      email: [
        this.citizen.email,
        [Validators.email, Validators.maxLength(100)],
      ],
      phoneNumber: [this.citizen.phoneNumber, [Validators.maxLength(20)]],
      fatherName: [this.citizen.fatherName, [Validators.maxLength(100)]],
      grandfatherName: [
        this.citizen.grandfatherName,
        [Validators.maxLength(100)],
      ],
      spouseName: [this.citizen.spouseName, [Validators.maxLength(100)]],
      citizenshipNumber: [
        this.citizen.citizenshipNumber,
        [Validators.maxLength(50)],
      ],
      citizenshipIssuedDate: [
        this.citizen.citizenshipIssuedDate
          ? new Date(this.citizen.citizenshipIssuedDate)
          : null,
      ],
      citizenshipIssuedOffice: [
        this.citizen.citizenshipIssuedOffice,
        [Validators.maxLength(100)],
      ],
    });

    // Add form controls to parent form
    Object.keys(this.basicInfoForm.controls).forEach((key) => {
      this.parentForm.addControl(key, this.basicInfoForm.get(key)!);
    });
  }

  private setupFormChangeTracking(): void {
    this.basicInfoForm.valueChanges.subscribe(() => {
      if (this.basicInfoForm.dirty) {
        this.citizenFacade.setUnsavedChanges(true);
      }
    });
  }
}
