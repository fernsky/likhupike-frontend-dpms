import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, catchError, switchMap, exhaustMap, tap } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslocoService } from '@jsverse/transloco';
import { Router } from '@angular/router';

import { CooperativeTranslationService } from '../../services/cooperative-translation.service';
import { CooperativeTranslationActions } from '../actions';

@Injectable()
export class TranslationEffects {
  constructor(
    private actions$: Actions,
    private translationService: CooperativeTranslationService,
    private snackBar: MatSnackBar,
    private transloco: TranslocoService,
    private router: Router
  ) {}

  // Load translations for a cooperative
  loadTranslations$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CooperativeTranslationActions.loadTranslations),
      switchMap(({ cooperativeId }) =>
        this.translationService.getAllTranslations(cooperativeId).pipe(
          map((response) =>
            CooperativeTranslationActions.loadTranslationsSuccess({
              cooperativeId,
              response,
            })
          ),
          catchError((error) => {
            this.showError('cooperative.messages.loadTranslationsError');
            return of(
              CooperativeTranslationActions.loadTranslationsFailure({ error })
            );
          })
        )
      )
    )
  );

  // Load a specific translation by ID
  loadTranslation$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CooperativeTranslationActions.loadTranslation),
      switchMap(({ cooperativeId, translationId }) =>
        this.translationService
          .getTranslationById(cooperativeId, translationId)
          .pipe(
            map((response) =>
              CooperativeTranslationActions.loadTranslationSuccess({ response })
            ),
            catchError((error) => {
              this.showError('cooperative.messages.loadTranslationError');
              return of(
                CooperativeTranslationActions.loadTranslationFailure({ error })
              );
            })
          )
      )
    )
  );

  // Load a translation by locale
  loadTranslationByLocale$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CooperativeTranslationActions.loadTranslationByLocale),
      switchMap(({ cooperativeId, locale }) =>
        this.translationService
          .getTranslationByLocale(cooperativeId, locale)
          .pipe(
            map((response) =>
              CooperativeTranslationActions.loadTranslationSuccess({ response })
            ),
            catchError((error) => {
              this.showError('cooperative.messages.loadTranslationError');
              return of(
                CooperativeTranslationActions.loadTranslationFailure({ error })
              );
            })
          )
      )
    )
  );

  // Create a new translation
  createTranslation$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CooperativeTranslationActions.createTranslation),
      exhaustMap(({ cooperativeId, translation }) =>
        this.translationService
          .createTranslation(cooperativeId, translation)
          .pipe(
            map((response) => {
              this.showSuccess('cooperative.messages.createTranslationSuccess');
              return CooperativeTranslationActions.createTranslationSuccess({
                cooperativeId,
                response,
              });
            }),
            catchError((error) => {
              this.showError('cooperative.messages.createTranslationError');
              return of(
                CooperativeTranslationActions.createTranslationFailure({
                  error,
                })
              );
            })
          )
      )
    )
  );

  // Update an existing translation
  updateTranslation$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CooperativeTranslationActions.updateTranslation),
      exhaustMap(({ cooperativeId, translationId, translation }) =>
        this.translationService
          .updateTranslation(cooperativeId, translationId, translation)
          .pipe(
            map((response) => {
              this.showSuccess('cooperative.messages.updateTranslationSuccess');
              return CooperativeTranslationActions.updateTranslationSuccess({
                response,
              });
            }),
            catchError((error) => {
              this.showError('cooperative.messages.updateTranslationError');
              return of(
                CooperativeTranslationActions.updateTranslationFailure({
                  error,
                })
              );
            })
          )
      )
    )
  );

  // Delete a translation
  deleteTranslation$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CooperativeTranslationActions.deleteTranslation),
      exhaustMap(({ cooperativeId, translationId }) =>
        this.translationService
          .deleteTranslation(cooperativeId, translationId)
          .pipe(
            map((response) => {
              this.showSuccess('cooperative.messages.deleteTranslationSuccess');
              return CooperativeTranslationActions.deleteTranslationSuccess({
                cooperativeId,
                translationId,
                response,
              });
            }),
            catchError((error) => {
              this.showError('cooperative.messages.deleteTranslationError');
              return of(
                CooperativeTranslationActions.deleteTranslationFailure({
                  error,
                })
              );
            })
          )
      )
    )
  );

  // Update translation status
  updateTranslationStatus$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CooperativeTranslationActions.updateTranslationStatus),
      exhaustMap(({ cooperativeId, translationId, status }) =>
        this.translationService
          .updateTranslationStatus(cooperativeId, translationId, status)
          .pipe(
            map((response) => {
              this.showSuccess('cooperative.messages.updateStatusSuccess');
              return CooperativeTranslationActions.updateStatusSuccess({
                response,
              });
            }),
            catchError((error) => {
              this.showError('cooperative.messages.updateStatusError');
              return of(
                CooperativeTranslationActions.updateStatusFailure({ error })
              );
            })
          )
      )
    )
  );

  // Navigate to translation detail after create success
  createTranslationSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(CooperativeTranslationActions.createTranslationSuccess),
        tap(({ response, cooperativeId }) => {
          if (response.data) {
            this.router.navigate([
              '/dashboard/cooperatives/edit',
              cooperativeId,
              'translations',
              response.data.id,
            ]);
          }
        })
      ),
    { dispatch: false }
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
