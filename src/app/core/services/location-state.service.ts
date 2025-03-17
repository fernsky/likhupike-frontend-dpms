import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map, tap, catchError, shareReplay } from 'rxjs/operators';
import { LoadingStateService } from './loading-state.service';
import { LocationService } from './location.service';
import {
  Province,
  District,
  Municipality,
  Ward,
} from '../models/location.model';

export interface LocationSelections {
  provinceCode: string | null;
  districtCode: string | null;
  municipalityCode: string | null;
  wardNumber: number | null;
}

@Injectable({ providedIn: 'root' })
export class LocationStateService {
  private selections = new BehaviorSubject<LocationSelections>({
    provinceCode: null,
    districtCode: null,
    municipalityCode: null,
    wardNumber: null,
  });

  // Cached data streams
  private provinces$ = new BehaviorSubject<Province[]>([]);
  private districts$ = new BehaviorSubject<District[]>([]);
  private municipalities$ = new BehaviorSubject<Municipality[]>([]);
  private wards$ = new BehaviorSubject<Ward[]>([]);

  constructor(
    private locationService: LocationService,
    private loadingState: LoadingStateService
  ) {}

  // Getter methods for location data
  getProvinces(): Observable<Province[]> {
    if (this.provinces$.value.length === 0) {
      return this.loadProvinces();
    }
    return this.provinces$.asObservable();
  }

  getDistricts(provinceCode: string): Observable<District[]> {
    return this.loadDistricts(provinceCode);
  }

  getMunicipalities(districtCode: string): Observable<Municipality[]> {
    return this.loadMunicipalities(districtCode);
  }

  getWards(municipalityCode: string): Observable<Ward[]> {
    return this.loadWards(municipalityCode);
  }

  // Private loading methods with error handling
  private loadProvinces(): Observable<Province[]> {
    this.loadingState.startLoading('provinces');
    return this.locationService
      .getProvinces({
        fields: ['CODE', 'NAME', 'NAME_NEPALI'],
        limit: 100,
      })
      .pipe(
        tap((provinces) => {
          this.provinces$.next(provinces);
          this.loadingState.stopLoading('provinces');
        }),
        catchError((error) => {
          this.loadingState.stopLoading(
            'provinces',
            'Failed to load provinces'
          );
          console.error('Error loading provinces:', error);
          return of([]);
        }),
        shareReplay(1)
      );
  }

  private loadDistricts(provinceCode: string): Observable<District[]> {
    this.loadingState.startLoading('districts');
    return this.locationService
      .getDistricts({
        fields: ['CODE', 'NAME', 'NAME_NEPALI'],
        provinceCode,
        limit: 100,
      })
      .pipe(
        tap((districts) => {
          this.districts$.next(districts);
          this.loadingState.stopLoading('districts');
        }),
        catchError((error) => {
          this.loadingState.stopLoading(
            'districts',
            'Failed to load districts'
          );
          console.error('Error loading districts:', error);
          return of([]);
        }),
        shareReplay(1)
      );
  }

  private loadMunicipalities(districtCode: string): Observable<Municipality[]> {
    this.loadingState.startLoading('municipalities');
    return this.locationService
      .getMunicipalities({
        fields: ['CODE', 'NAME', 'NAME_NEPALI'],
        districtCode,
        limit: 100,
      })
      .pipe(
        tap((municipalities) => {
          this.municipalities$.next(municipalities);
          this.loadingState.stopLoading('municipalities');
        }),
        catchError((error) => {
          this.loadingState.stopLoading(
            'municipalities',
            'Failed to load municipalities'
          );
          console.error('Error loading municipalities:', error);
          return of([]);
        }),
        shareReplay(1)
      );
  }

  private loadWards(municipalityCode: string): Observable<Ward[]> {
    this.loadingState.startLoading('wards');
    return this.locationService
      .getWards({
        fields: ['WARD_NUMBER'],
        municipalityCode,
        limit: 100,
      })
      .pipe(
        tap((wards) => {
          this.wards$.next(wards);
          this.loadingState.stopLoading('wards');
        }),
        catchError((error) => {
          this.loadingState.stopLoading('wards', 'Failed to load wards');
          console.error('Error loading wards:', error);
          return of([]);
        }),
        shareReplay(1)
      );
  }

  // Selection management
  updateSelection(selection: Partial<LocationSelections>): void {
    const current = this.selections.value;
    const updated = { ...current, ...selection };

    // Clear dependent selections
    if (selection.provinceCode !== undefined) {
      updated.districtCode = null;
      updated.municipalityCode = null;
      updated.wardNumber = null;
    }
    if (selection.districtCode !== undefined) {
      updated.municipalityCode = null;
      updated.wardNumber = null;
    }
    if (selection.municipalityCode !== undefined) {
      updated.wardNumber = null;
    }

    this.selections.next(updated);
  }

  getCurrentSelection(): Observable<LocationSelections> {
    return this.selections.asObservable();
  }

  clearCache(): void {
    this.provinces$.next([]);
    this.districts$.next([]);
    this.municipalities$.next([]);
    this.wards$.next([]);
    this.selections.next({
      provinceCode: null,
      districtCode: null,
      municipalityCode: null,
      wardNumber: null,
    });
  }
}
