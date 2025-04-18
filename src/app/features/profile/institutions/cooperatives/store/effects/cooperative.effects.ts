import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import {
  map,
  catchError,
  switchMap,
  exhaustMap,
  withLatestFrom,
  tap,
} from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslocoService } from '@jsverse/transloco';
import { Router } from '@angular/router';

import { CooperativeService } from '../../services/cooperative.service';
import { CooperativeActions } from '../actions';
import * as CooperativeSelectors from '../selectors/cooperative.selectors';

@Injectable()
export class CooperativeEffects {
  constructor(
    private actions$: Actions,
    private cooperativeService: CooperativeService,
    private store: Store,
    private snackBar: MatSnackBar,
    private transloco: TranslocoService,
    private router: Router
  ) {}

  // Load cooperatives with pagination
  loadCooperatives$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CooperativeActions.loadCooperatives),
      switchMap(({ page, size }) =>
        this.cooperativeService.getAllCooperatives(page, size).pipe(
          map((response) =>
            CooperativeActions.loadCooperativesSuccess({ response })
          ),
          catchError((error) => {
            this.showError('cooperative.messages.loadError');
            return of(CooperativeActions.loadCooperativesFailure({ error }));
          })
        )
      )
    )
  );

  // Load single cooperative by ID
  loadCooperative$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CooperativeActions.loadCooperative),
      switchMap(({ id }) =>
        this.cooperativeService.getCooperativeById(id).pipe(
          map((response) =>
            CooperativeActions.loadCooperativeSuccess({ response })
          ),
          catchError((error) => {
            this.showError('cooperative.messages.loadError');
            return of(CooperativeActions.loadCooperativeFailure({ error }));
          })
        )
      )
    )
  );

  // Load single cooperative by code
  loadCooperativeByCode$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CooperativeActions.loadCooperativeByCode),
      switchMap(({ code }) =>
        this.cooperativeService.getCooperativeByCode(code).pipe(
          map((response) =>
            CooperativeActions.loadCooperativeSuccess({ response })
          ),
          catchError((error) => {
            this.showError('cooperative.messages.loadError');
            return of(CooperativeActions.loadCooperativeFailure({ error }));
          })
        )
      )
    )
  );

  // Create cooperative
  createCooperative$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CooperativeActions.createCooperative),
      exhaustMap(({ cooperative }) =>
        this.cooperativeService.createCooperative(cooperative).pipe(
          map((response) => {
            this.showSuccess('cooperative.messages.createSuccess');
            return CooperativeActions.createCooperativeSuccess({ response });
          }),
          catchError((error) => {
            this.showError('cooperative.messages.createError');
            return of(CooperativeActions.createCooperativeFailure({ error }));
          })
        )
      )
    )
  );

  // Navigate after successful creation
  createSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(CooperativeActions.createCooperativeSuccess),
        tap(({ response }) => {
          if (response.data) {
            this.router.navigate([
              '/dashboard/cooperatives/edit',
              response.data.id,
            ]);
          }
        })
      ),
    { dispatch: false }
  );

  // Update cooperative
  updateCooperative$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CooperativeActions.updateCooperative),
      exhaustMap(({ id, cooperative }) =>
        this.cooperativeService.updateCooperative(id, cooperative).pipe(
          map((response) => {
            this.showSuccess('cooperative.messages.updateSuccess');
            return CooperativeActions.updateCooperativeSuccess({ response });
          }),
          catchError((error) => {
            this.showError('cooperative.messages.updateError');
            return of(CooperativeActions.updateCooperativeFailure({ error }));
          })
        )
      )
    )
  );

  // Delete cooperative
  deleteCooperative$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CooperativeActions.deleteCooperative),
      exhaustMap(({ id }) =>
        this.cooperativeService.deleteCooperative(id).pipe(
          map((response) => {
            this.showSuccess('cooperative.messages.deleteSuccess');
            return CooperativeActions.deleteCooperativeSuccess({
              id,
              response,
            });
          }),
          catchError((error) => {
            this.showError('cooperative.messages.deleteError');
            return of(CooperativeActions.deleteCooperativeFailure({ error }));
          })
        )
      )
    )
  );

  // Navigate after successful deletion
  deleteSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(CooperativeActions.deleteCooperativeSuccess),
        tap(() => {
          this.router.navigate(['/dashboard/cooperatives/list']);
        })
      ),
    { dispatch: false }
  );

  // Change cooperative status
  changeStatus$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CooperativeActions.changeCooperativeStatus),
      exhaustMap(({ id, status }) =>
        this.cooperativeService.changeCooperativeStatus(id, status).pipe(
          map((response) => {
            this.showSuccess('cooperative.messages.statusChangeSuccess');
            return CooperativeActions.changeStatusSuccess({ response });
          }),
          catchError((error) => {
            this.showError('cooperative.messages.statusChangeError');
            return of(CooperativeActions.changeStatusFailure({ error }));
          })
        )
      )
    )
  );

  // Pagination effects
  changePage$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CooperativeActions.setPage, CooperativeActions.setPageSize),
      withLatestFrom(
        this.store.select(CooperativeSelectors.selectCurrentPage),
        this.store.select(CooperativeSelectors.selectPageSize)
      ),
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      map(([_, page, size]) =>
        CooperativeActions.loadCooperatives({ page, size })
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
