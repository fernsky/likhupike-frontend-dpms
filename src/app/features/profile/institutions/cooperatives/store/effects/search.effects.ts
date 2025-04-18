import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { map, catchError, switchMap, withLatestFrom, filter } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslocoService } from '@jsverse/transloco';

import { CooperativeSearchService } from '../../services/cooperative-search.service';
import { CooperativeSearchActions } from '../actions';
import * as fromCooperatives from '../selectors';
import { SearchMethod } from '../state';

@Injectable()
export class SearchEffects {
  constructor(
    private actions$: Actions,
    private searchService: CooperativeSearchService,
    private snackBar: MatSnackBar,
    private transloco: TranslocoService,
    private store: Store
  ) {}

  // Search cooperatives by name
  searchByName$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CooperativeSearchActions.searchByName),
      switchMap(({ nameQuery, page, size }) =>
        this.searchService.searchCooperativesByName(nameQuery, page, size).pipe(
          map((response) =>
            CooperativeSearchActions.searchByNameSuccess({ response })
          ),
          catchError((error) => {
            this.showError('cooperative.messages.searchError');
            return of(CooperativeSearchActions.searchByNameFailure({ error }));
          })
        )
      )
    )
  );

  // Get cooperatives by type
  getByType$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CooperativeSearchActions.getByType),
      switchMap(({ cooperativeType, page, size }) =>
        this.searchService.getCooperativesByType(cooperativeType, page, size).pipe(
          map((response) =>
            CooperativeSearchActions.getByTypeSuccess({
              cooperativeType,
              response,
            })
          ),
          catchError((error) => {
            this.showError('cooperative.messages.searchByTypeError');
            return of(CooperativeSearchActions.getByTypeFailure({ error }));
          })
        )
      )
    )
  );

  // Get cooperatives by status
  getByStatus$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CooperativeSearchActions.getByStatus),
      switchMap(({ status, page, size }) =>
        this.searchService.getCooperativesByStatus(status, page, size).pipe(
          map((response) =>
            CooperativeSearchActions.getByStatusSuccess({ status, response })
          ),
          catchError((error) => {
            this.showError('cooperative.messages.searchByStatusError');
            return of(CooperativeSearchActions.getByStatusFailure({ error }));
          })
        )
      )
    )
  );

  // Get cooperatives by ward
  getByWard$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CooperativeSearchActions.getByWard),
      switchMap(({ ward, page, size }) =>
        this.searchService.getCooperativesByWard(ward, page, size).pipe(
          map((response) =>
            CooperativeSearchActions.getByWardSuccess({ ward, response })
          ),
          catchError((error) => {
            this.showError('cooperative.messages.searchByWardError');
            return of(CooperativeSearchActions.getByWardFailure({ error }));
          })
        )
      )
    )
  );

  // Find cooperatives near location
  findNear$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CooperativeSearchActions.findNear),
      switchMap(({ longitude, latitude, distanceInMeters, page, size }) =>
        this.searchService
          .findCooperativesNear(
            longitude,
            latitude,
            distanceInMeters,
            page,
            size
          )
          .pipe(
            map((response) =>
              CooperativeSearchActions.findNearSuccess({ response })
            ),
            catchError((error) => {
              this.showError('cooperative.messages.findNearError');
              return of(CooperativeSearchActions.findNearFailure({ error }));
            })
          )
      )
    )
  );

  // Handle pagination changes - re-run the active search method with new pagination
  handlePaginationChanges$ = createEffect(() =>
    this.actions$.pipe(
      ofType(
        CooperativeSearchActions.setSearchPage,
        CooperativeSearchActions.setSearchPageSize
      ),
      withLatestFrom(
        this.store.select(fromCooperatives.selectSearchFilters),
        this.store.select(fromCooperatives.selectActiveSearchMethod)
      ),
      // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
      map(([_, filters, activeMethod]: [unknown, any, SearchMethod]) => {
        // Based on the active search method, dispatch the appropriate action
        switch (activeMethod) {
          case SearchMethod.ByName:
            if (filters.nameQuery) {
              return CooperativeSearchActions.searchByName({
                nameQuery: filters.nameQuery,
                page: filters.page || 0,
                size: filters.size || 10
              });
            }
            break;
            
          case SearchMethod.ByType:
            if (filters.type) {
              return CooperativeSearchActions.getByType({
                cooperativeType: filters.type,
                page: filters.page || 0,
                size: filters.size || 10
              });
            }
            break;
            
          case SearchMethod.ByStatus:
            if (filters.status) {
              return CooperativeSearchActions.getByStatus({
                status: filters.status,
                page: filters.page || 0,
                size: filters.size || 10
              });
            }
            break;
            
          case SearchMethod.ByWard:
            if (filters.ward) {
              return CooperativeSearchActions.getByWard({
                ward: filters.ward,
                page: filters.page || 0,
                size: filters.size || 10
              });
            }
            break;
            
          case SearchMethod.NearLocation:
            if (filters.longitude && filters.latitude && filters.distanceInMeters) {
              return CooperativeSearchActions.findNear({
                longitude: filters.longitude,
                latitude: filters.latitude,
                distanceInMeters: filters.distanceInMeters,
                page: filters.page || 0,
                size: filters.size || 10
              });
            }
            break;
        }
        
        // If no valid action could be dispatched, return a no-op action
        return { type: 'NO_ACTION' };
      }),
      // Filter out the 'NO_ACTION' dummy action to prevent effects from running with it
      // Only let valid actions pass through
      filter((action: { type: string }) => action.type !== 'NO_ACTION')
    )
  );

  // Get statistics by type
  getStatisticsByType$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CooperativeSearchActions.getStatisticsByType),
      switchMap(() =>
        this.searchService.getCooperativeStatisticsByType().pipe(
          map((response) =>
            CooperativeSearchActions.getStatisticsByTypeSuccess({ response })
          ),
          catchError((error) => {
            this.showError('cooperative.messages.statisticsError');
            return of(
              CooperativeSearchActions.getStatisticsByTypeFailure({ error })
            );
          })
        )
      )
    )
  );

  // Get statistics by ward
  getStatisticsByWard$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CooperativeSearchActions.getStatisticsByWard),
      switchMap(() =>
        this.searchService.getCooperativeStatisticsByWard().pipe(
          map((response) =>
            CooperativeSearchActions.getStatisticsByWardSuccess({ response })
          ),
          catchError((error) => {
            this.showError('cooperative.messages.statisticsError');
            return of(
              CooperativeSearchActions.getStatisticsByWardFailure({ error })
            );
          })
        )
      )
    )
  );

  // Helper methods
  private showError(message: string): void {
    this.snackBar.open(
      this.transloco.translate(message),
      this.transloco.translate('common.actions.close'),
      { duration: 5000, panelClass: ['error-snackbar'] }
    );
  }
}
