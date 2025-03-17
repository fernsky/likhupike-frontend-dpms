import { Injectable } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import { Observable, BehaviorSubject, combineLatest, of } from 'rxjs';
import {
  map,
  distinctUntilChanged,
  shareReplay,
  filter,
  startWith,
} from 'rxjs/operators';
import { LocationStateService } from './location-state.service';
import { LoadingStateService } from './loading-state.service';
import { UserType } from '../models/user-type.enum';
import { ElectedPosition } from '../models/office.enum';
import { Store } from '@ngrx/store';
import { selectUserType } from '@app/features/auth/store/register-form.selectors';
import {
  Province,
  District,
  Municipality,
  Ward,
} from '../models/location.model';

export interface LocationFormState {
  provinces: Province[];
  districts: District[];
  municipalities: Municipality[];
  wards: Ward[];
  loadingState: {
    provinces: boolean;
    districts: boolean;
    municipalities: boolean;
    wards: boolean;
  };
  errors: {
    provinces: string | null;
    districts: string | null;
    municipalities: string | null;
    wards: string | null;
  };
}

@Injectable({ providedIn: 'root' })
export class LocationFormService {
  private formState = new BehaviorSubject<LocationFormState>({
    provinces: [],
    districts: [],
    municipalities: [],
    wards: [],
    loadingState: {
      provinces: false,
      districts: false,
      municipalities: false,
      wards: false,
    },
    errors: {
      provinces: null,
      districts: null,
      municipalities: null,
      wards: null,
    },
  });

  constructor(
    private locationState: LocationStateService,
    private loadingState: LoadingStateService,
    private store: Store
  ) {}

  initializeForm(form: FormGroup): void {
    // Setup form control subscriptions
    this.setupProvinceChanges(form);
    this.setupDistrictChanges(form);
    this.setupMunicipalityChanges(form);

    // Load initial provinces
    this.loadProvinces();
  }

  private setupProvinceChanges(form: FormGroup): void {
    const provinceControl = form.get('provinceCode');
    if (!provinceControl) return;

    provinceControl.valueChanges
      .pipe(distinctUntilChanged())
      .subscribe((provinceCode) => {
        if (provinceCode) {
          this.loadDistricts(provinceCode);
          // Clear dependent fields
          form.patchValue(
            {
              districtCode: '',
              municipalityCode: '',
              wardNumber: '',
            },
            { emitEvent: false }
          );
        }
      });
  }

  private setupDistrictChanges(form: FormGroup): void {
    const districtControl = form.get('districtCode');
    if (!districtControl) return;

    districtControl.valueChanges
      .pipe(distinctUntilChanged())
      .subscribe((districtCode) => {
        if (districtCode) {
          this.loadMunicipalities(districtCode);
          // Clear dependent fields
          form.patchValue(
            {
              municipalityCode: '',
              wardNumber: '',
            },
            { emitEvent: false }
          );
        }
      });
  }

  private setupMunicipalityChanges(form: FormGroup): void {
    const municipalityControl = form.get('municipalityCode');
    if (!municipalityControl) return;

    municipalityControl.valueChanges
      .pipe(distinctUntilChanged())
      .subscribe((municipalityCode) => {
        if (municipalityCode) {
          this.loadWards(municipalityCode);
          // Clear dependent field
          form.patchValue(
            {
              wardNumber: '',
            },
            { emitEvent: false }
          );
        }
      });
  }

  private loadProvinces(): void {
    this.updateLoadingState('provinces', true);
    this.locationState.getProvinces().subscribe({
      next: (provinces) => {
        this.updateState({ provinces });
        this.updateLoadingState('provinces', false);
      },
      error: (error) => {
        this.updateError('provinces', 'Failed to load provinces');
        this.updateLoadingState('provinces', false);
        console.error('Error loading provinces:', error);
      },
    });
  }

  private loadDistricts(provinceCode: string): void {
    this.updateLoadingState('districts', true);
    this.locationState.getDistricts(provinceCode).subscribe({
      next: (districts) => {
        this.updateState({ districts });
        this.updateLoadingState('districts', false);
      },
      error: (error) => {
        this.updateError('districts', 'Failed to load districts');
        this.updateLoadingState('districts', false);
        console.error('Error loading districts:', error);
      },
    });
  }

  private loadMunicipalities(districtCode: string): void {
    this.updateLoadingState('municipalities', true);
    this.locationState.getMunicipalities(districtCode).subscribe({
      next: (municipalities) => {
        this.updateState({ municipalities });
        this.updateLoadingState('municipalities', false);
      },
      error: (error) => {
        this.updateError('municipalities', 'Failed to load municipalities');
        this.updateLoadingState('municipalities', false);
        console.error('Error loading municipalities:', error);
      },
    });
  }

  private loadWards(municipalityCode: string): void {
    this.updateLoadingState('wards', true);
    this.locationState.getWards(municipalityCode).subscribe({
      next: (wards) => {
        this.updateState({ wards });
        this.updateLoadingState('wards', false);
      },
      error: (error) => {
        this.updateError('wards', 'Failed to load wards');
        this.updateLoadingState('wards', false);
        console.error('Error loading wards:', error);
      },
    });
  }

  private updateState(update: Partial<LocationFormState>): void {
    this.formState.next({
      ...this.formState.value,
      ...update,
    });
  }

  private updateLoadingState(
    key: keyof LocationFormState['loadingState'],
    isLoading: boolean
  ): void {
    this.updateState({
      loadingState: {
        ...this.formState.value.loadingState,
        [key]: isLoading,
      },
    });
  }

  private updateError(
    key: keyof LocationFormState['errors'],
    error: string | null
  ): void {
    this.updateState({
      errors: {
        ...this.formState.value.errors,
        [key]: error,
      },
    });
  }

  getState(): Observable<LocationFormState> {
    return this.formState
      .asObservable()
      .pipe(distinctUntilChanged(), shareReplay(1));
  }

  clearState(): void {
    this.formState.next({
      provinces: [],
      districts: [],
      municipalities: [],
      wards: [],
      loadingState: {
        provinces: false,
        districts: false,
        municipalities: false,
        wards: false,
      },
      errors: {
        provinces: null,
        districts: null,
        municipalities: null,
        wards: null,
      },
    });
  }

  // Add these new methods to support template usage
  isLoading(key: keyof LocationFormState['loadingState']): Observable<boolean> {
    return this.formState.pipe(
      map((state) => state.loadingState[key]),
      distinctUntilChanged()
    );
  }

  isAnyLoading(): Observable<boolean> {
    return this.formState.pipe(
      map((state) =>
        Object.values(state.loadingState).some((loading) => loading)
      ),
      distinctUntilChanged()
    );
  }

  getError(key: keyof LocationFormState['errors']): Observable<string | null> {
    return this.formState.pipe(
      map((state) => state.errors[key]),
      distinctUntilChanged()
    );
  }

  // Add these getters for location data
  get provinces$(): Observable<Province[]> {
    return this.formState.pipe(
      map((state) => state.provinces),
      distinctUntilChanged()
    );
  }

  get districts$(): Observable<District[]> {
    return this.formState.pipe(
      map((state) => state.districts),
      distinctUntilChanged()
    );
  }

  get municipalities$(): Observable<Municipality[]> {
    return this.formState.pipe(
      map((state) => state.municipalities),
      distinctUntilChanged()
    );
  }

  get wards$(): Observable<Ward[]> {
    return this.formState.pipe(
      map((state) => state.wards),
      distinctUntilChanged()
    );
  }

  // Add these new methods for ward selection logic
  shouldShowWardSelection(form: FormGroup): Observable<boolean> {
    return combineLatest([
      this.store.select(selectUserType),
      form.get('position')?.valueChanges.pipe(startWith('')) || of(''),
      form.get('isWardOffice')?.valueChanges.pipe(startWith(false)) ||
        of(false),
    ]).pipe(
      map(([userType, position, isWardOffice]) => {
        if (userType === UserType.CITIZEN) {
          return true;
        }
        if (userType === UserType.ELECTED_REPRESENTATIVE) {
          return (
            position === ElectedPosition.WARD_CHAIRPERSON ||
            position === ElectedPosition.WARD_MEMBER
          );
        }
        if (userType === UserType.LOCAL_LEVEL_EMPLOYEE) {
          return isWardOffice;
        }
        return false;
      }),
      distinctUntilChanged(),
      shareReplay(1)
    );
  }

  updateWardValidation(form: FormGroup, isRequired: boolean): void {
    const wardControl = form.get('wardNumber');
    if (wardControl) {
      if (isRequired) {
        wardControl.setValidators([Validators.required]);
      } else {
        wardControl.clearValidators();
      }
      wardControl.updateValueAndValidity({ emitEvent: false });
    }
  }

  resetWardSelection(form: FormGroup): void {
    form.patchValue({ wardNumber: '' }, { emitEvent: false });
  }
}
