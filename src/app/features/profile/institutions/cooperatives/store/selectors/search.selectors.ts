import { createSelector } from '@ngrx/store';
import { selectCooperativesFeature } from './cooperative.selectors';
import { CooperativeType } from '../../types';
import { SearchMethod } from '../state';

// Search state selector
export const selectSearchState = createSelector(
  selectCooperativesFeature,
  (state) => state.search
);

// Results selectors
export const selectSearchResults = createSelector(
  selectSearchState,
  (state) => state.results
);

export const selectSearchTotalResults = createSelector(
  selectSearchState,
  (state) => state.totalResults
);

// Active search method
export const selectActiveSearchMethod = createSelector(
  selectSearchState,
  (state) => state.activeSearchMethod
);

// Search filters selectors
export const selectSearchFilters = createSelector(
  selectSearchState,
  (state) => state.filters
);

export const selectSearchTerm = createSelector(
  selectSearchFilters,
  (filters) => filters.nameQuery
);

export const selectSearchType = createSelector(
  selectSearchFilters,
  (filters) => filters.type
);

export const selectSearchStatus = createSelector(
  selectSearchFilters,
  (filters) => filters.status
);

export const selectSearchWard = createSelector(
  selectSearchFilters,
  (filters) => filters.ward
);

// Geographic search selectors
export const selectSearchLongitude = createSelector(
  selectSearchFilters,
  (filters) => filters.longitude
);

export const selectSearchLatitude = createSelector(
  selectSearchFilters,
  (filters) => filters.latitude
);

export const selectSearchDistanceInMeters = createSelector(
  selectSearchFilters,
  (filters) => filters.distanceInMeters
);

// Pagination selectors
export const selectSearchPage = createSelector(
  selectSearchFilters,
  (filters) => filters.page || 0
);

export const selectSearchPageSize = createSelector(
  selectSearchFilters,
  (filters) => filters.size || 10
);

// Statistics selectors
export const selectStatisticsByType = createSelector(
  selectSearchState,
  (state) => state.statisticsByType
);

export const selectStatisticsForType = (type: CooperativeType) =>
  createSelector(selectStatisticsByType, (stats) => stats[type] || 0);

export const selectStatisticsByWard = createSelector(
  selectSearchState,
  (state) => state.statisticsByWard
);

export const selectStatisticsForWard = (ward: number) =>
  createSelector(selectStatisticsByWard, (stats) => stats[ward] || 0);

// UI state selectors
export const selectSearchLoading = createSelector(
  selectSearchState,
  (state) => state.loading
);

export const selectSearchErrors = createSelector(
  selectSearchState,
  (state) => state.errors
);

export const selectSearchLastUpdated = createSelector(
  selectSearchState,
  (state) => state.lastUpdated
);

// Convenience selector - determines if any search is active
export const selectIsSearchActive = createSelector(
  selectActiveSearchMethod,
  (method) => method !== SearchMethod.None
);
