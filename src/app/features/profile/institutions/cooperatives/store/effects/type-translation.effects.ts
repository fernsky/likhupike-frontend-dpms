import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, catchError, switchMap, exhaustMap } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslocoService } from '@jsverse/transloco';

import { CooperativeTypeTranslationService } from '../../services/cooperative-type-translation.service';
import { CooperativeTypeTranslationActions } from '../actions';

@Injectable()
export class TypeTranslationEffects {
  constructor(
    private actions$: Actions,
    private typeTranslationService: CooperativeTypeTranslationService,
    private snackBar: MatSnackBar,
    private transloco: TranslocoService
  ) {}

  // Create or update type translation
  createOrUpdateTypeTranslation$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CooperativeTypeTranslationActions.createOrUpdateTypeTranslation),
      exhaustMap(({ translation }) =>
        this.typeTranslationService.createOrUpdateTypeTranslation(translation).pipe(
          map((response) => {
            this.showSuccess('cooperative.messages.typeTranslationSaveSuccess');
            return CooperativeTypeTranslationActions.createOrUpdateSuccess({
              response,
            });
          }),
          catchError((error) => {
            this.showError('cooperative.messages.typeTranslationSaveError');
            return of(
              CooperativeTypeTranslationActions.createOrUpdateFailure({ error })
            );
          })
        )
      )
    )
  );

  // Get type translation by ID
  getTypeTranslation$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CooperativeTypeTranslationActions.getTypeTranslation),
      switchMap(({ id }) =>
        this.typeTranslationService.getTypeTranslationById(id).pipe(
          map((response) =>
            CooperativeTypeTranslationActions.getTypeTranslationSuccess({
              response,
            })
          ),
          catchError((error) => {
            this.showError('cooperative.messages.getTypeTranslationError');
            return of(
              CooperativeTypeTranslationActions.getTypeTranslationFailure({
                error,
              })
            );
          })
        )
      )
    )
  );

  // Get type translation by type and locale
  getTypeTranslationByTypeAndLocale$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CooperativeTypeTranslationActions.getTypeTranslationByTypeAndLocale),
      switchMap(({ cooperativeType, locale }) =>
        this.typeTranslationService
          .getTypeTranslationByTypeAndLocale(cooperativeType, locale)
          .pipe(
            map((response) =>
              CooperativeTypeTranslationActions.getByTypeAndLocaleSuccess({
                response,
              })
            ),
            catchError((error) => {
              this.showError('cooperative.messages.getTypeTranslationError');
              return of(
                CooperativeTypeTranslationActions.getByTypeAndLocaleFailure({
                  error,
                })
              );
            })
          )
      )
    )
  );

  // Get all translations for a specific type
  getAllForType$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CooperativeTypeTranslationActions.getAllForType),
      switchMap(({ cooperativeType }) =>
        this.typeTranslationService.getAllTranslationsForType(cooperativeType).pipe(
          map((response) =>
            CooperativeTypeTranslationActions.getAllForTypeSuccess({
              cooperativeType,
              response,
            })
          ),
          catchError((error) => {
            this.showError('cooperative.messages.getAllTypeTranslationsError');
            return of(
              CooperativeTypeTranslationActions.getAllForTypeFailure({
                error,
              })
            );
          })
        )
      )
    )
  );

  // Get translations by locale with pagination
  getByLocale$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CooperativeTypeTranslationActions.getByLocale),
      switchMap(({ locale, page, size }) =>
        this.typeTranslationService
          .getTypeTranslationsByLocale(locale, page, size)
          .pipe(
            map((response) =>
              CooperativeTypeTranslationActions.getByLocaleSuccess({
                locale,
                response,
              })
            ),
            catchError((error) => {
              this.showError('cooperative.messages.getTypeTranslationsByLocaleError');
              return of(
                CooperativeTypeTranslationActions.getByLocaleFailure({
                  error,
                })
              );
            })
          )
      )
    )
  );

  // Delete type translation
  deleteTypeTranslation$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CooperativeTypeTranslationActions.deleteTypeTranslation),
      exhaustMap(({ cooperativeType, locale }) =>
        this.typeTranslationService
          .deleteTypeTranslation(cooperativeType, locale)
          .pipe(
            map((response) => {
              this.showSuccess('cooperative.messages.deleteTypeTranslationSuccess');
              return CooperativeTypeTranslationActions.deleteTypeTranslationSuccess({
                cooperativeType,
                locale,
                response,
              });
            }),
            catchError((error) => {
              this.showError('cooperative.messages.deleteTypeTranslationError');
              return of(
                CooperativeTypeTranslationActions.deleteTypeTranslationFailure({
                  error,
                })
              );
            })
          )
      )
    )
  );

  // Get all types with translations for a specific locale
  getAllTypesForLocale$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CooperativeTypeTranslationActions.getAllTypesForLocale),
      switchMap(({ locale }) =>
        this.typeTranslationService.getAllTypeTranslationsForLocale(locale).pipe(
          map((response) =>
            CooperativeTypeTranslationActions.getAllTypesForLocaleSuccess({
              locale,
              response,
            })
          ),
          catchError((error) => {
            this.showError('cooperative.messages.getAllTypeTranslationsError');
            return of(
              CooperativeTypeTranslationActions.getAllTypesForLocaleFailure({
                error,
              })
            );
          })
        )
      )
    )
  );

  // Helper methods
  private showSuccess(message: string): void {
    this.snackBar.open(
      this.transloco.translate(message),
      this.transloco.translate('common.actions.close'),
      { duration: 3000, panelClass: ['success-snackbar'] }
    );
  }

  private showError(message: string): void {
    this.snackBar.open(
      this.transloco.translate(message),
      this.transloco.translate('common.actions.close'),
      { duration: 5000, panelClass: ['error-snackbar'] }
    );
  }
}
