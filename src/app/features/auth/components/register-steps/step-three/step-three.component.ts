import {
  Component,
  OnInit,
  OnDestroy,
  Output,
  EventEmitter,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatOptionModule } from '@angular/material/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { TranslocoPipe } from '@jsverse/transloco';
import { BaseStepComponent } from '../base-step.component';
import { LocationService } from '@app/core/services/location.service';
import { LocationFormService } from '@app/core/services/location-form.service';
import { LoadingOverlayComponent } from '@app/shared/components/loading-overlay/loading-overlay.component';
import { locationFormValidator } from '@app/shared/validators/location-form.validator';
import { UserType } from '@app/core/models/user-type.enum';
import {
  OfficeSection,
  ElectedPosition,
  OFFICE_SECTION_TRANSLATION_KEYS,
  ELECTED_POSITION_TRANSLATION_KEYS,
} from '@app/core/models/office.enum';
import { Observable, Subject, combineLatest, of, BehaviorSubject } from 'rxjs';
import {
  map,
  startWith,
  takeUntil,
  switchMap,
  filter,
  tap,
  catchError,
  take,
  shareReplay,
} from 'rxjs/operators';
import {
  selectStepFormData,
  selectUserType,
} from '../../../store/register-form.selectors';
import {
  Province,
  District,
  Municipality,
  Ward,
} from '@app/core/models/location.model';
import { Store } from '@ngrx/store';
import { RegisterFormActions } from '@app/features/auth/store/register-form.actions';
import { NepaliNumberPipe } from '@app/shared/pipes/nepali-number.pipe';
import { LocationInfo } from '@app/features/auth/store/register-form.state';

@Component({
  selector: 'app-register-step-three',
  templateUrl: './step-three.component.html',
  styleUrls: ['./step-three.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatIconModule,
    MatCheckboxModule,
    MatOptionModule,
    MatProgressSpinnerModule,
    TranslocoPipe,
    NepaliNumberPipe,
    LoadingOverlayComponent,
  ],
})
export class StepThreeComponent
  extends BaseStepComponent
  implements OnInit, OnDestroy
{
  override stepForm!: FormGroup;
  override stepNumber = 3;
  @Output() override stepValid = new EventEmitter<boolean>();

  provinces$!: Observable<Province[]>;
  districts$!: Observable<District[]>;
  municipalities$!: Observable<Municipality[]>;
  wards$!: Observable<Ward[]>;

  showWardSelection$!: Observable<boolean>;
  showOfficeSection$!: Observable<boolean>;
  showPosition$!: Observable<boolean>;

  readonly officeSections = Object.values(OfficeSection);
  readonly electedPositions = Object.values(ElectedPosition);
  readonly officeSectionTranslationKeys = OFFICE_SECTION_TRANSLATION_KEYS;
  readonly electedPositionTranslationKeys = ELECTED_POSITION_TRANSLATION_KEYS;

  private destroy$ = new Subject<void>();

  // Loading states
  loading = {
    provinces: new BehaviorSubject<boolean>(false),
    districts: new BehaviorSubject<boolean>(false),
    municipalities: new BehaviorSubject<boolean>(false),
    wards: new BehaviorSubject<boolean>(false),
  };

  // Error states
  errors = {
    provinces: new BehaviorSubject<string | null>(null),
    districts: new BehaviorSubject<string | null>(null),
    municipalities: new BehaviorSubject<string | null>(null),
    wards: new BehaviorSubject<string | null>(null),
  };

  constructor(
    private fb: FormBuilder,
    private locationService: LocationService,
    public locationForm: LocationFormService,
    protected override store: Store
  ) {
    super();
    this.initForm();
    this.setupLocationCascading();
  }

  // Helper method for translations
  getTranslationKey(type: OfficeSection | ElectedPosition): string {
    if (Object.values(OfficeSection).includes(type as OfficeSection)) {
      return this.officeSectionTranslationKeys[type as OfficeSection];
    }
    return this.electedPositionTranslationKeys[type as ElectedPosition];
  }

  private initForm(): void {
    this.stepForm = this.fb.group(
      {
        provinceCode: ['', Validators.required],
        districtCode: ['', Validators.required],
        municipalityCode: ['', Validators.required],
        wardNumber: [''],
        officeSection: [''],
        isWardOffice: [false],
        position: [''],
      },
      { validators: locationFormValidator() }
    );

    // Clear dependent fields when parent selection changes
    this.stepForm
      .get('provinceCode')
      ?.valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.stepForm.patchValue(
          {
            districtCode: '',
            municipalityCode: '',
            wardNumber: '',
          },
          { emitEvent: false }
        );
      });

    this.stepForm
      .get('districtCode')
      ?.valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.stepForm.patchValue(
          {
            municipalityCode: '',
            wardNumber: '',
          },
          { emitEvent: false }
        );
      });

    this.stepForm
      .get('municipalityCode')
      ?.valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.stepForm.patchValue(
          {
            wardNumber: '',
          },
          { emitEvent: false }
        );
      });

    const userType$ = this.store.select(selectUserType);

    this.showWardSelection$ = this.locationForm
      .shouldShowWardSelection(this.stepForm)
      .pipe(
        tap((shouldShow) => {
          if (!shouldShow) {
            this.locationForm.resetWardSelection(this.stepForm);
          }
          this.locationForm.updateWardValidation(this.stepForm, shouldShow);
        }),
        shareReplay(1)
      );

    this.showOfficeSection$ = userType$.pipe(
      map((userType) => userType === UserType.LOCAL_LEVEL_EMPLOYEE)
    );

    this.showPosition$ = userType$.pipe(
      map((userType) => userType === UserType.ELECTED_REPRESENTATIVE)
    );
  }

  private setupLocationCascading(): void {
    // Initialize the location form service
    this.locationForm.initializeForm(this.stepForm);

    // The rest of the cascading logic can be simplified since LocationFormService handles it
    this.provinces$ = this.locationForm
      .getState()
      .pipe(map((state) => state.provinces));

    this.districts$ = this.locationForm
      .getState()
      .pipe(map((state) => state.districts));

    this.municipalities$ = this.locationForm
      .getState()
      .pipe(map((state) => state.municipalities));

    this.wards$ = this.locationForm
      .getState()
      .pipe(map((state) => state.wards));
  }

  ngOnInit(): void {
    // Trigger provinces load immediately
    this.provinces$.pipe(take(1)).subscribe();

    // Load saved form data first
    this.store
      .select(selectStepFormData(3))
      .pipe(
        filter((data): data is LocationInfo => !!data),
        take(1),
        takeUntil(this.destroy$)
      )
      .subscribe(async (data: LocationInfo) => {
        if (data) {
          // Load provinces
          await this.provinces$.pipe(take(1)).toPromise();

          // If province is selected, load districts
          if (data.provinceCode) {
            await this.locationService
              .getDistricts({
                fields: ['CODE', 'NAME', 'NAME_NEPALI'],
                provinceCode: data.provinceCode,
                limit: 100,
              })
              .pipe(take(1))
              .toPromise();
          }

          // If district is selected, load municipalities
          if (data.districtCode) {
            await this.locationService
              .getMunicipalities({
                fields: ['CODE', 'NAME', 'NAME_NEPALI'],
                districtCode: data.districtCode,
                limit: 100,
              })
              .pipe(take(1))
              .toPromise();
          }

          // If municipality is selected, load wards
          if (data.municipalityCode) {
            await this.locationService
              .getWards({
                fields: ['WARD_NUMBER'],
                municipalityCode: data.municipalityCode,
                limit: 100,
              })
              .pipe(take(1))
              .toPromise();
          }

          // Now patch all the form values at once
          this.stepForm.patchValue(data);
        }
      });

    // Monitor form changes
    this.stepForm.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.updateStepValidity();
      // Update form data regardless of validity
      this.updateFormData();
    });
  }

  protected override updateStepValidity(): void {
    const isValid = this.stepForm.valid;

    // Update store with form data regardless of validity
    this.updateFormData();

    this.store.dispatch(
      RegisterFormActions.updateStepValidity({
        step: this.stepNumber,
        isValid,
      })
    );
    this.stepValid.emit(isValid);
  }

  protected override updateFormData(): void {
    const formValue = this.stepForm.value;
    const userType$ = this.store.select(selectUserType);

    userType$.pipe(take(1)).subscribe((userType) => {
      if (userType === UserType.LOCAL_LEVEL_EMPLOYEE) {
        this.store.dispatch(
          RegisterFormActions.updateEmployeeInfo({
            employeeInfo: {
              provinceCode: formValue.provinceCode,
              districtCode: formValue.districtCode,
              municipalityCode: formValue.municipalityCode,
              wardNumber: formValue.wardNumber,
              officeSection: formValue.officeSection,
              isWardOffice: formValue.isWardOffice,
            },
          })
        );
      } else if (userType === UserType.ELECTED_REPRESENTATIVE) {
        this.store.dispatch(
          RegisterFormActions.updateElectedRepInfo({
            electedRepInfo: {
              provinceCode: formValue.provinceCode,
              districtCode: formValue.districtCode,
              municipalityCode: formValue.municipalityCode,
              wardNumber: formValue.wardNumber,
              position: formValue.position,
            },
          })
        );
      } else {
        this.store.dispatch(
          RegisterFormActions.updateLocationInfo({
            locationInfo: {
              provinceCode: formValue.provinceCode,
              districtCode: formValue.districtCode,
              municipalityCode: formValue.municipalityCode,
              wardNumber: formValue.wardNumber,
            },
          })
        );
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.locationForm.clearState();
  }
}
