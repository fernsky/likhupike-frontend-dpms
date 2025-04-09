import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Observable, Subject, distinctUntilChanged, takeUntil } from 'rxjs';
import { LocationService } from '../../../../services/location.service';
import { Province, District, Municipality } from '../../../../types';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { provideTranslocoScope, TranslocoModule } from '@jsverse/transloco';

@Component({
  selector: 'app-address-form',
  templateUrl: './address-form.component.html',
  styleUrls: ['./address-form.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatCheckboxModule,
    MatIconModule,
    TranslocoModule,
  ],
  providers: [
    provideTranslocoScope({
      scope: 'citizen-create',
      alias: 'citizen',
    }),
  ],
})
export class AddressFormComponent implements OnInit, OnDestroy {
  @Input() addressForm!: FormGroup;

  // Provinces for both permanent and temporary addresses
  provinces$!: Observable<Province[]>;

  // Districts based on selected province
  permanentDistricts$!: Observable<District[]>;
  temporaryDistricts$!: Observable<District[]>;

  // Municipalities based on selected district
  permanentMunicipalities$!: Observable<Municipality[]>;
  temporaryMunicipalities$!: Observable<Municipality[]>;

  private destroy$ = new Subject<void>();

  constructor(private locationService: LocationService) {}

  ngOnInit(): void {
    // Load all provinces
    this.provinces$ = this.locationService.getProvinces();

    // Set up listeners for permanent address province changes
    this.addressForm
      .get('permanentAddress.provinceCode')
      ?.valueChanges.pipe(distinctUntilChanged(), takeUntil(this.destroy$))
      .subscribe((provinceCode) => {
        if (provinceCode) {
          this.permanentDistricts$ =
            this.locationService.getDistrictsByProvince(provinceCode);
          // Reset dependent fields
          this.addressForm.get('permanentAddress.districtCode')?.setValue('');
          this.addressForm
            .get('permanentAddress.municipalityCode')
            ?.setValue('');
        }
      });

    // Set up listeners for permanent address district changes
    this.addressForm
      .get('permanentAddress.districtCode')
      ?.valueChanges.pipe(distinctUntilChanged(), takeUntil(this.destroy$))
      .subscribe((districtCode) => {
        if (districtCode) {
          this.permanentMunicipalities$ =
            this.locationService.getMunicipalitiesByDistrict(districtCode);
          // Reset dependent field
          this.addressForm
            .get('permanentAddress.municipalityCode')
            ?.setValue('');
        }
      });

    // Set up listeners for temporary address province changes
    this.addressForm
      .get('temporaryAddress.provinceCode')
      ?.valueChanges.pipe(distinctUntilChanged(), takeUntil(this.destroy$))
      .subscribe((provinceCode) => {
        if (provinceCode) {
          this.temporaryDistricts$ =
            this.locationService.getDistrictsByProvince(provinceCode);
          // Reset dependent fields
          this.addressForm.get('temporaryAddress.districtCode')?.setValue('');
          this.addressForm
            .get('temporaryAddress.municipalityCode')
            ?.setValue('');
        }
      });

    // Set up listeners for temporary address district changes
    this.addressForm
      .get('temporaryAddress.districtCode')
      ?.valueChanges.pipe(distinctUntilChanged(), takeUntil(this.destroy$))
      .subscribe((districtCode) => {
        if (districtCode) {
          this.temporaryMunicipalities$ =
            this.locationService.getMunicipalitiesByDistrict(districtCode);
          // Reset dependent field
          this.addressForm
            .get('temporaryAddress.municipalityCode')
            ?.setValue('');
        }
      });
  }

  get tempSameAsPermanent(): boolean {
    return this.addressForm.get('tempSameAsPermanent')?.value || false;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
