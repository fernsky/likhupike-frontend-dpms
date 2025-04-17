import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Router, ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { map, tap, withLatestFrom } from 'rxjs/operators';

import { CooperativeUIActions, CooperativeSearchActions } from '../actions';
import * as fromCooperatives from '../selectors';
import { CooperativeFilter } from '../state';

/**
 * Effects for synchronizing URL query parameters with store state
 * Restricted to parameters available in CooperativeSearchService
 */
@Injectable()
export class UrlSyncEffects {
  constructor(
    private actions$: Actions,
    private router: Router,
    private route: ActivatedRoute,
    private store: Store
  ) {}

  // Sync URL params to state when requested
  syncUrlToState$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CooperativeUIActions.syncUrlToState),
      map(() => {
        const queryParams = this.route.snapshot.queryParams;
        const filter: CooperativeFilter = {};

        // Map query params to filter object - only include params supported by search service
        if (queryParams.nameQuery) filter.nameQuery = queryParams.nameQuery;
        if (queryParams.type) filter.type = queryParams.type;
        if (queryParams.status) filter.status = queryParams.status;
        if (queryParams.ward) filter.ward = parseInt(queryParams.ward, 10);

        // Geographic search params
        if (queryParams.longitude)
          filter.longitude = parseFloat(queryParams.longitude);
        if (queryParams.latitude)
          filter.latitude = parseFloat(queryParams.latitude);
        if (queryParams.distanceInMeters)
          filter.distanceInMeters = parseFloat(queryParams.distanceInMeters);

        // Pagination params
        if (queryParams.page) filter.page = parseInt(queryParams.page, 10);
        if (queryParams.size) filter.size = parseInt(queryParams.size, 10);

        return CooperativeSearchActions.filterChange({ filter });
      })
    )
  );

  // Update URL based on filter changes
  updateUrlFromFilterChange$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(CooperativeSearchActions.filterChange),
        withLatestFrom(this.store.select(fromCooperatives.selectSearchFilters)),
        tap(([_, filters]) => {
          const queryParams: Record<string, string | number | null> = {};

          // Only add defined values to query params that the search service supports
          if (filters.nameQuery) queryParams.nameQuery = filters.nameQuery;
          if (filters.type) queryParams.type = filters.type;
          if (filters.status) queryParams.status = filters.status;
          if (filters.ward) queryParams.ward = filters.ward;

          // Geographic search params
          if (filters.longitude) queryParams.longitude = filters.longitude;
          if (filters.latitude) queryParams.latitude = filters.latitude;
          if (filters.distanceInMeters)
            queryParams.distanceInMeters = filters.distanceInMeters;

          // Pagination params
          if (filters.page && filters.page > 0) queryParams.page = filters.page;
          if (filters.size && filters.size !== 10)
            queryParams.size = filters.size;

          // Update URL without reloading
          this.router.navigate([], {
            relativeTo: this.route,
            queryParams,
            queryParamsHandling: 'merge',
            replaceUrl: true,
          });
        })
      ),
    { dispatch: false }
  );

  // Reset URL when filters are reset
  resetUrlOnFilterReset$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(CooperativeSearchActions.resetFilters),
        tap(() => {
          this.router.navigate([], {
            relativeTo: this.route,
            queryParams: {},
            replaceUrl: true,
          });
        })
      ),
    { dispatch: false }
  );

  // Update URL directly from UI actions
  updateQueryParams$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(CooperativeUIActions.updateQueryParams),
        tap(({ ...queryParams }) => {
          this.router.navigate([], {
            relativeTo: this.route,
            queryParams,
            queryParamsHandling: 'merge',
            replaceUrl: true,
          });
        })
      ),
    { dispatch: false }
  );

  // Handle search actions specifically
  syncSearchActionsToUrl$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(
          CooperativeSearchActions.searchByName,
          CooperativeSearchActions.getByType,
          CooperativeSearchActions.getByStatus,
          CooperativeSearchActions.getByWard,
          CooperativeSearchActions.findNear
        ),
        tap((action) => {
          const queryParams: Record<string, string | number> = {};

          // Handle pagination for all search actions
          if ('page' in action) queryParams.page = action.page;
          if ('size' in action) queryParams.size = action.size;

          // Add specific parameters based on action type
          if (action.type === CooperativeSearchActions.searchByName.type) {
            if ('nameQuery' in action) queryParams.nameQuery = action.nameQuery;
          }

          if (action.type === CooperativeSearchActions.getByType.type) {
            if ('type' in action) queryParams.type = action.type;
          }

          if (action.type === CooperativeSearchActions.getByStatus.type) {
            if ('status' in action) queryParams.status = action.status;
          }

          if (action.type === CooperativeSearchActions.getByWard.type) {
            if ('ward' in action) queryParams.ward = action.ward;
          }

          if (action.type === CooperativeSearchActions.findNear.type) {
            if ('longitude' in action) queryParams.longitude = action.longitude;
            if ('latitude' in action) queryParams.latitude = action.latitude;
            if ('distanceInMeters' in action)
              queryParams.distanceInMeters = action.distanceInMeters;
          }

          this.router.navigate([], {
            relativeTo: this.route,
            queryParams,
            queryParamsHandling: 'merge',
            replaceUrl: true,
          });
        })
      ),
    { dispatch: false }
  );
}
