import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import {
  CitizenSearchFilters,
  CitizenState,
  DocumentState,
  Province,
  District,
  Municipality,
} from '../../../../types';
import { LocationService } from '../../../../services/location.service';
import { Observable } from 'rxjs';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { provideTranslocoScope, TranslocoModule } from '@jsverse/transloco';

@Component({
  selector: 'app-citizen-filter',
  templateUrl: './citizen-filter.component.html',
  styleUrls: ['./citizen-filter.component.scss'],
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    MatProgressSpinnerModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatChipsModule,
    MatMenuModule,
    MatDividerModule,
    MatExpansionModule,
    TranslocoModule,
    ReactiveFormsModule,
  ],
  providers: [
    provideTranslocoScope({
      scope: 'citizen-list',
      alias: 'citizen',
    }),
  ],
})
export class CitizenFilterComponent implements OnInit, OnChanges {
  @Input() currentFilter: CitizenSearchFilters | null = null;
  @Output() filterChange = new EventEmitter<Partial<CitizenSearchFilters>>();
  @Output() resetFilters = new EventEmitter<void>();

  filterForm: FormGroup;
  isAdvancedFiltersOpen = false;
  citizenStates = Object.values(CitizenState);
  documentStates = Object.values(DocumentState);

  provinces$!: Observable<Province[]>;
  districts$!: Observable<District[]>;
  municipalities$!: Observable<Municipality[]>;

  constructor(
    private fb: FormBuilder,
    private locationService: LocationService
  ) {
    this.filterForm = this.createFilterForm();
  }

  ngOnInit(): void {
    // Load provinces
    this.provinces$ = this.locationService.getProvinces();

    // Subscribe to province changes to load districts
    this.filterForm
      .get('permanentProvinceCode')
      ?.valueChanges.pipe(distinctUntilChanged())
      .subscribe((provinceCode) => {
        if (provinceCode) {
          this.districts$ =
            this.locationService.getDistrictsByProvince(provinceCode);
          this.filterForm.get('permanentDistrictCode')?.setValue(null);
          this.filterForm.get('permanentMunicipalityCode')?.setValue(null);
        }
      });

    // Subscribe to district changes to load municipalities
    this.filterForm
      .get('permanentDistrictCode')
      ?.valueChanges.pipe(distinctUntilChanged())
      .subscribe((districtCode) => {
        if (districtCode) {
          this.municipalities$ =
            this.locationService.getMunicipalitiesByDistrict(districtCode);
          this.filterForm.get('permanentMunicipalityCode')?.setValue(null);
        }
      });

    // Subscribe to form changes after a debounce time
    this.filterForm.valueChanges
      .pipe(
        debounceTime(500),
        distinctUntilChanged(
          (prev, curr) => JSON.stringify(prev) === JSON.stringify(curr)
        )
      )
      .subscribe((filters) => {
        // Clean up empty values
        const cleanFilters = this.cleanFilterValues(filters);
        this.filterChange.emit(cleanFilters);
      });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['currentFilter'] && changes['currentFilter'].currentValue) {
      // Reset form with new values, but don't emit events
      this.filterForm.patchValue(changes['currentFilter'].currentValue, {
        emitEvent: false,
      });
    }
  }

  createFilterForm(): FormGroup {
    return this.fb.group({
      name: [null],
      nameDevnagari: [null],
      citizenshipNumber: [null],
      citizenshipIssuedOffice: [null],
      citizenshipIssuedDateStart: [null],
      citizenshipIssuedDateEnd: [null],
      email: [null],
      phoneNumber: [null],
      state: [null],
      states: [null],
      isApproved: [null],
      photoState: [null],
      citizenshipFrontState: [null],
      citizenshipBackState: [null],
      documentStates: [null],
      notesSearch: [null],
      addressTerm: [null],
      permanentProvinceCode: [null],
      permanentDistrictCode: [null],
      permanentMunicipalityCode: [null],
      permanentWardNumber: [null],
      createdAfter: [null],
      createdBefore: [null],
      stateUpdatedAfter: [null],
      stateUpdatedBefore: [null],
      sortBy: ['createdAt'],
      sortDirection: ['DESC'],
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  cleanFilterValues(filters: any): Partial<CitizenSearchFilters> {
    const result: Partial<CitizenSearchFilters> = {};

    // Only include non-null, non-empty values
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== '') {
        // Handle date objects by converting to ISO strings
        if (value instanceof Date) {
          result[key as keyof CitizenSearchFilters] = value
            .toISOString()
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            .split('T')[0] as any;
        } else {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          result[key as keyof CitizenSearchFilters] = value as any;
        }
      }
    });

    return result;
  }

  onReset(): void {
    this.filterForm.reset();
    // Add default sort values
    this.filterForm.patchValue(
      {
        sortBy: 'createdAt',
        sortDirection: 'DESC',
      },
      { emitEvent: false }
    );
    this.resetFilters.emit();
  }

  toggleAdvancedFilters(): void {
    this.isAdvancedFiltersOpen = !this.isAdvancedFiltersOpen;
  }
}
