import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { map, catchError, switchMap, exhaustMap, } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslocoService } from '@jsverse/transloco';

import { MunicipalityActions } from './municipality.actions';
import { ProfileMunicipalityService } from '../services/profile-municipality.service';

@Injectable()
export class MunicipalityEffects {
  constructor(
    private actions$: Actions,
    private municipalityService: ProfileMunicipalityService,
    private store: Store,
    private snackBar: MatSnackBar,
    private transloco: TranslocoService
  ) {}

  // Load municipality profile
  loadMunicipality$ = createEffect(() =>
    this.actions$.pipe(
      ofType(MunicipalityActions.loadMunicipality),
      switchMap(() =>
        this.municipalityService.getMunicipalityInfo().pipe(
          map((response) =>
            MunicipalityActions.loadMunicipalitySuccess({ response })
          ),
          catchError((error) => {
            this.showError(
              error.message || 'municipality.messages.loadError'
            );
            return of(MunicipalityActions.loadMunicipalityFailure({ error }));
          })
        )
      )
    )
  );

  // Create municipality profile
  createMunicipality$ = createEffect(() =>
    this.actions$.pipe(
      ofType(MunicipalityActions.createMunicipality),
      exhaustMap(({ request }) =>
        this.municipalityService.createMunicipality(request).pipe(
          map((response) => {
            this.showSuccess(
              'message' in response
                ? response.message
                : 'municipality.messages.createSuccess'
            );
            return MunicipalityActions.createMunicipalitySuccess({ response });
          }),
          catchError((error) => {
            this.showError(
              error.message || 'municipality.messages.createError'
            );
            return of(MunicipalityActions.createMunicipalityFailure({ error }));
          })
        )
      )
    )
  );

  // Update municipality basic info
  updateMunicipalityInfo$ = createEffect(() =>
    this.actions$.pipe(
      ofType(MunicipalityActions.updateMunicipalityInfo),
      exhaustMap(({ request }) =>
        this.municipalityService.updateMunicipalityInfo(request).pipe(
          map((response) => {
            this.showSuccess(
              'message' in response
                ? response.message
                : 'municipality.messages.updateSuccess'
            );
            return MunicipalityActions.updateMunicipalityInfoSuccess({
              response,
            });
          }),
          catchError((error) => {
            this.showError(
              error.message || 'municipality.messages.updateError'
            );
            return of(
              MunicipalityActions.updateMunicipalityInfoFailure({ error })
            );
          })
        )
      )
    )
  );

  // Update municipality geo-location
  updateMunicipalityGeoLocation$ = createEffect(() =>
    this.actions$.pipe(
      ofType(MunicipalityActions.updateMunicipalityGeoLocation),
      exhaustMap(({ request }) =>
        this.municipalityService.updateMunicipalityGeoLocation(request).pipe(
          map((response) => {
            this.showSuccess(
              'message' in response 
                ? response.message
                : 'municipality.messages.updateGeoSuccess'
            );
            return MunicipalityActions.updateMunicipalityGeoLocationSuccess({
              response,
            });
          }),
          catchError((error) => {
            this.showError(
              error.message || 'municipality.messages.updateGeoError'
            );
            return of(
              MunicipalityActions.updateMunicipalityGeoLocationFailure({ error })
            );
          })
        )
      )
    )
  );

  // Helper method to show success messages
  private showSuccess(message: string): void {
    this.snackBar.open(
      this.transloco.translate(message),
      this.transloco.translate('common.actions.close'),
      { duration: 3000, panelClass: ['success-snackbar'] }
    );
  }

  // Helper method to show error messages
  private showError(message: string): void {
    this.snackBar.open(
      this.transloco.translate(message),
      this.transloco.translate('common.actions.close'),
      { duration: 5000, panelClass: ['error-snackbar'] }
    );
  }
}
