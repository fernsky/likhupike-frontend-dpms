import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { provideTranslocoScope, TranslocoModule } from '@jsverse/transloco';
import { CitizenFacade } from '../../../../store/citizen.facade';
import { AddressDto, CitizenResponse } from '../../../../types';
import { AddressFormComponent } from '../address-form/address-form.component';

@Component({
  selector: 'app-address-tab',
  templateUrl: './address-tab.component.html',
  styleUrls: ['./address-tab.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatCheckboxModule,
    MatIconModule,
    TranslocoModule,
    AddressFormComponent,
  ],
  providers: [
    provideTranslocoScope({
      scope: 'citizen-edit',
      alias: 'citizen',
    }),
  ],
})
export class AddressTabComponent implements OnInit {
  @Input() parentForm!: FormGroup;
  @Input() citizen!: CitizenResponse;

  addressForm!: FormGroup;
  useSameAddress = false;

  constructor(
    private fb: FormBuilder,
    private citizenFacade: CitizenFacade
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.setupSameAddressCheck();
    this.setupFormChangeTracking();
  }

  private initForm(): void {
    this.addressForm = this.fb.group({
      permanentAddress: this.fb.group({}),
      temporaryAddress: this.fb.group({}),
    });

    // Add address forms to parent form
    this.parentForm.addControl(
      'permanentAddress',
      this.addressForm.get('permanentAddress')!
    );
    this.parentForm.addControl(
      'temporaryAddress',
      this.addressForm.get('temporaryAddress')!
    );

    // Check if addresses are the same
    if (
      this.citizen.permanentAddress &&
      this.citizen.temporaryAddress &&
      this.isSameAddress(
        this.citizen.permanentAddress,
        this.citizen.temporaryAddress
      )
    ) {
      this.useSameAddress = true;
    }
  }

  private setupSameAddressCheck(): void {
    // When same address checkbox changes
    this.addressForm.valueChanges.subscribe(() => {
      if (this.useSameAddress) {
        const permanentAddressValue =
          this.addressForm.get('permanentAddress')?.value;
        if (permanentAddressValue) {
          this.addressForm
            .get('temporaryAddress')
            ?.patchValue(permanentAddressValue);
        }
      }
    });
  }

  private setupFormChangeTracking(): void {
    this.addressForm.valueChanges.subscribe(() => {
      if (this.addressForm.dirty) {
        this.citizenFacade.setUnsavedChanges(true);
      }
    });
  }

  onSameAddressChange(isChecked: boolean): void {
    this.useSameAddress = isChecked;

    if (isChecked) {
      // Copy permanent address to temporary address
      const permanentAddressValue =
        this.addressForm.get('permanentAddress')?.value;
      if (permanentAddressValue) {
        this.addressForm
          .get('temporaryAddress')
          ?.patchValue(permanentAddressValue);
      }
    }
  }

  private isSameAddress(address1: AddressDto, address2: AddressDto): boolean {
    return (
      address1.provinceCode === address2.provinceCode &&
      address1.districtCode === address2.districtCode &&
      address1.municipalityCode === address2.municipalityCode &&
      address1.wardNumber === address2.wardNumber &&
      address1.streetAddress === address2.streetAddress
    );
  }
}
