import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { provideTranslocoScope, TranslocoModule } from '@jsverse/transloco';
import { Observable, Subject, of, shareReplay, takeUntil } from 'rxjs';
import {
  debounceTime,
  distinctUntilChanged,
  switchMap,
  filter,
} from 'rxjs/operators';
import { LocationService } from '../../../../services/location.service';
import {
  AddressResponse,
  District,
  Municipality,
  Province,
} from '../../../../types';

@Component({
  selector: 'app-address-form',
  templateUrl: './address-form.component.html',
  styleUrls: ['./address-form.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    TranslocoModule,
  ],
  providers: [
    provideTranslocoScope({
      scope: 'citizen-edit',
      alias: 'citizen',
    }),
  ],
})
export class AddressFormComponent implements OnInit, OnDestroy {
  @Input() parentForm!: FormGroup;
  @Input() controlName!: string;
  @Input() address: AddressResponse | null | undefined;
  @Input() required = false;
  @Input() disabled = false;

  form!: FormGroup;
  provinces: Province[] = [];
  districts: District[] = [];
  municipalities: Municipality[] = [];

  // Cache for API responses to prevent duplicate calls
  private provinceCache: { [key: string]: Province[] } = {};
  private districtCache: { [key: string]: District[] } = {};
  private municipalityCache: { [key: string]: Municipality[] } = {};

  // Track ongoing API calls to prevent duplicate concurrent requests
  private loadingProvinces = false;
  private loadingDistricts = false;
  private loadingMunicipalities = false;

  private destroy$ = new Subject<void>();
  private provinceChange$ = new Subject<string>();
  private districtChange$ = new Subject<string>();

  constructor(
    private fb: FormBuilder,
    private locationService: LocationService
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadProvinces();
    this.setupFormListeners();

    // Populate the form with address data if available
    if (this.address) {
      this.populateForm();
    }
  }

  private initForm(): void {
    // Create required validator based on input
    const requiredValidator = this.required ? [Validators.required] : [];

    this.form = this.fb.group({
      provinceCode: [null, requiredValidator],
      districtCode: [null, requiredValidator],
      municipalityCode: [null, requiredValidator],
      wardNumber: [
        null,
        [...requiredValidator, Validators.min(1), Validators.max(33)],
      ],
      streetAddress: [null, [Validators.maxLength(200)]],
    });

    // Add form to parent form
    this.parentForm.setControl(this.controlName, this.form);

    // Disable form if required
    if (this.disabled) {
      this.form.disable();
    }
  }

  private populateForm(): void {
    if (!this.address) return;

    // Need to load dependencies in order (province -> district -> municipality)
    this.form.patchValue({
      provinceCode: this.address.provinceCode,
      streetAddress: this.address.streetAddress,
    });

    // Set up a chain of operations to load district and municipality data
    // only after the previous step completes
    if (this.address.provinceCode) {
      this.loadDistrictsById(this.address.provinceCode).subscribe(
        (districts) => {
          this.districts = districts;
          this.form.patchValue({ districtCode: this.address?.districtCode });

          if (this.address?.districtCode) {
            this.loadMunicipalitiesById(this.address.districtCode).subscribe(
              (municipalities) => {
                this.municipalities = municipalities;
                this.form.patchValue({
                  municipalityCode: this.address?.municipalityCode,
                  wardNumber: this.address?.wardNumber,
                });
              }
            );
          }
        }
      );
    }
  }

  private loadProvinces(): void {
    // Check if we're already loading provinces or if we have them cached
    if (this.loadingProvinces || this.provinces.length > 0) {
      return;
    }

    this.loadingProvinces = true;

    this.locationService
      .getProvinces()
      .pipe(
        takeUntil(this.destroy$),
        shareReplay(1) // Cache the result for multiple subscribers
      )
      .subscribe({
        next: (provinces) => {
          this.provinces = provinces;
          this.loadingProvinces = false;
        },
        error: () => {
          this.loadingProvinces = false;
        },
      });
  }

  private setupFormListeners(): void {
    // When province changes, load districts - with debounce to prevent multiple calls
    this.form
      .get('provinceCode')
      ?.valueChanges.pipe(
        takeUntil(this.destroy$),
        debounceTime(300),
        distinctUntilChanged(),
        filter((provinceCode) => !!provinceCode)
      )
      .subscribe((provinceCode) => {
        this.provinceChange$.next(provinceCode);
        this.form.get('districtCode')?.setValue(null);
        this.form.get('municipalityCode')?.setValue(null);
        this.form.get('wardNumber')?.setValue(null);
        this.municipalities = [];
      });

    // Handle province changes with switchMap to cancel previous observables
    this.provinceChange$
      .pipe(
        takeUntil(this.destroy$),
        switchMap((provinceCode) => this.loadDistrictsById(provinceCode))
      )
      .subscribe((districts) => {
        this.districts = districts;
      });

    // When district changes, load municipalities - with debounce to prevent multiple calls
    this.form
      .get('districtCode')
      ?.valueChanges.pipe(
        takeUntil(this.destroy$),
        debounceTime(300),
        distinctUntilChanged(),
        filter((districtCode) => !!districtCode)
      )
      .subscribe((districtCode) => {
        this.districtChange$.next(districtCode);
        this.form.get('municipalityCode')?.setValue(null);
        this.form.get('wardNumber')?.setValue(null);
      });

    // Handle district changes with switchMap to cancel previous observables
    this.districtChange$
      .pipe(
        takeUntil(this.destroy$),
        switchMap((districtCode) => this.loadMunicipalitiesById(districtCode))
      )
      .subscribe((municipalities) => {
        this.municipalities = municipalities;
      });
  }

  private loadDistrictsById(provinceCode: string): Observable<District[]> {
    // Check cache first
    if (this.districtCache[provinceCode]) {
      return of(this.districtCache[provinceCode]);
    }

    // Check if already loading districts for this province
    if (this.loadingDistricts) {
      return of([]);
    }

    this.loadingDistricts = true;

    return this.locationService.getDistrictsByProvince(provinceCode).pipe(
      takeUntil(this.destroy$),
      shareReplay(1),
      switchMap((districts) => {
        // Cache the result
        this.districtCache[provinceCode] = districts;
        this.loadingDistricts = false;
        return of(districts);
      })
    );
  }

  private loadMunicipalitiesById(
    districtCode: string
  ): Observable<Municipality[]> {
    // Check cache first
    if (this.municipalityCache[districtCode]) {
      return of(this.municipalityCache[districtCode]);
    }

    // Check if already loading municipalities for this district
    if (this.loadingMunicipalities) {
      return of([]);
    }

    this.loadingMunicipalities = true;

    return this.locationService.getMunicipalitiesByDistrict(districtCode).pipe(
      takeUntil(this.destroy$),
      shareReplay(1),
      switchMap((municipalities) => {
        // Cache the result
        this.municipalityCache[districtCode] = municipalities;
        this.loadingMunicipalities = false;
        return of(municipalities);
      })
    );
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
