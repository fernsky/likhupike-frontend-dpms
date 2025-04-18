import { createReducer, on } from '@ngrx/store';
import * as CooperativeSearchActions from '../actions/search.actions';
import { initialSearchState, SearchMethod } from '../state';
import { CooperativeResponse } from '../../types';

/**
 * Reducer for cooperative search functionality
 */
export const searchReducer = createReducer(
  initialSearchState,

  // Search by name - Sets activeSearchMethod to ByName
  on(CooperativeSearchActions.searchByName, (state, { nameQuery, page, size }) => ({
    ...state,
    loading: true,
    errors: null,
    filters: {
      ...state.filters,
      nameQuery,
      page,
      size,
      // Clear other search parameters
      type: undefined,
      status: undefined,
      ward: undefined,
      longitude: undefined,
      latitude: undefined,
      distanceInMeters: undefined
    },
    activeSearchMethod: SearchMethod.ByName
  })),
  on(CooperativeSearchActions.searchByNameSuccess, (state, { response }) => {
    if (!response.data) return state;

    const { content, totalElements } = response.data;

    // Extract IDs from search results
    const results = content.map(
      (cooperative: CooperativeResponse) => cooperative.id
    );

    return {
      ...state,
      loading: false,
      results,
      totalResults: totalElements,
      lastUpdated: new Date(),
    };
  }),
  on(CooperativeSearchActions.searchByNameFailure, (state, { error }) => ({
    ...state,
    loading: false,
    errors: error,
  })),

  // Get by type - Sets activeSearchMethod to ByType
  on(CooperativeSearchActions.getByType, (state, { cooperativeType, page, size }) => ({
    ...state,
    loading: true,
    errors: null,
    filters: {
      ...state.filters,
      type: cooperativeType,
      page,
      size,
      // Clear other search parameters
      nameQuery: undefined,
      status: undefined,
      ward: undefined,
      longitude: undefined,
      latitude: undefined,
      distanceInMeters: undefined
    },
    activeSearchMethod: SearchMethod.ByType
  })),
  on(CooperativeSearchActions.getByTypeSuccess, (state, {  response }) => {
    if (!response.data) return state;

    const { content, totalElements } = response.data;

    // Extract IDs from search results
    const results = content.map(
      (cooperative: CooperativeResponse) => cooperative.id
    );

    return {
      ...state,
      loading: false,
      results,
      totalResults: totalElements,
      lastUpdated: new Date(),
    };
  }),
  on(CooperativeSearchActions.getByTypeFailure, (state, { error }) => ({
    ...state,
    loading: false,
    errors: error,
  })),

  // Get by status - Sets activeSearchMethod to ByStatus
  on(CooperativeSearchActions.getByStatus, (state, { status, page, size }) => ({
    ...state,
    loading: true,
    errors: null,
    filters: {
      ...state.filters,
      status,
      page,
      size,
      // Clear other search parameters
      nameQuery: undefined,
      type: undefined,
      ward: undefined,
      longitude: undefined,
      latitude: undefined,
      distanceInMeters: undefined
    },
    activeSearchMethod: SearchMethod.ByStatus
  })),
  on(
    CooperativeSearchActions.getByStatusSuccess,
    (state, { response }) => {
      if (!response.data) return state;

      const { content, totalElements } = response.data;

      // Extract IDs from search results
      const results = content.map(
        (cooperative: CooperativeResponse) => cooperative.id
      );

      return {
        ...state,
        loading: false,
        results,
        totalResults: totalElements,
        lastUpdated: new Date(),
      };
    }
  ),
  on(CooperativeSearchActions.getByStatusFailure, (state, { error }) => ({
    ...state,
    loading: false,
    errors: error,
  })),

  // Get by ward - Sets activeSearchMethod to ByWard
  on(CooperativeSearchActions.getByWard, (state, { ward, page, size }) => ({
    ...state,
    loading: true,
    errors: null,
    filters: {
      ...state.filters,
      ward,
      page,
      size,
      // Clear other search parameters
      nameQuery: undefined,
      type: undefined,
      status: undefined,
      longitude: undefined,
      latitude: undefined,
      distanceInMeters: undefined
    },
    activeSearchMethod: SearchMethod.ByWard
  })),
  on(CooperativeSearchActions.getByWardSuccess, (state, {  response }) => {
    if (!response.data) return state;

    const { content, totalElements } = response.data;

    // Extract IDs from search results
    const results = content.map(
      (cooperative: CooperativeResponse) => cooperative.id
    );

    return {
      ...state,
      loading: false,
      results,
      totalResults: totalElements,
      lastUpdated: new Date(),
    };
  }),

  on(CooperativeSearchActions.getByWardFailure, (state, { error }) => ({
    ...state,
    loading: false,
    errors: error,
  })),

  // Find cooperatives near location - Sets activeSearchMethod to NearLocation
  on(CooperativeSearchActions.findNear, (state, { longitude, latitude, distanceInMeters, page, size }) => ({
    ...state,
    loading: true,
    errors: null,
    filters: {
      ...state.filters,
      longitude,
      latitude,
      distanceInMeters,
      page,
      size,
      // Clear other search parameters
      nameQuery: undefined,
      type: undefined,
      status: undefined,
      ward: undefined
    },
    activeSearchMethod: SearchMethod.NearLocation
  })),
  on(CooperativeSearchActions.findNearSuccess, (state, { response }) => {
    if (!response.data) return state;

    const { content, totalElements } = response.data;

    // Extract IDs from search results
    const results = content.map(
      (cooperative: CooperativeResponse) => cooperative.id
    );

    return {
      ...state,
      loading: false,
      results,
      totalResults: totalElements,
      lastUpdated: new Date(),
    };
  }),
  on(CooperativeSearchActions.findNearFailure, (state, { error }) => ({
    ...state,
    loading: false,
    errors: error,
  })),

  // Get statistics by type
  on(CooperativeSearchActions.getStatisticsByType, (state) => ({
    ...state,
    loading: true,
    errors: null,
  })),
  on(
    CooperativeSearchActions.getStatisticsByTypeSuccess,
    (state, { response }) => {
      if (!('data' in response)) return state;

      return {
        ...state,
        loading: false,
        statisticsByType: response.data,
        lastUpdated: new Date(),
      };
    }
  ),
  on(
    CooperativeSearchActions.getStatisticsByTypeFailure,
    (state, { error }) => ({
      ...state,
      loading: false,
      errors: error,
    })
  ),

  // Get statistics by ward
  on(CooperativeSearchActions.getStatisticsByWard, (state) => ({
    ...state,
    loading: true,
    errors: null,
  })),
  on(
    CooperativeSearchActions.getStatisticsByWardSuccess,
    (state, { response }) => {
      if (!('data' in response) || !response.data) return state;

      return {
        ...state,
        loading: false,
        statisticsByWard: response.data,
        lastUpdated: new Date(),
      };
    }
  ),
  on(
    CooperativeSearchActions.getStatisticsByWardFailure,
    (state, { error }) => ({
      ...state,
      loading: false,
      errors: error,
    })
  ),

  // Filter change
  on(CooperativeSearchActions.filterChange, (state, { filter, searchMethod }) => ({
    ...state,
    filters: {
      ...state.filters,
      ...filter,
    },
    activeSearchMethod: searchMethod,
  })),

  // Set search method
  on(CooperativeSearchActions.setSearchMethod, (state, { searchMethod }) => ({
    ...state,
    activeSearchMethod: searchMethod,
  })),

  // Pagination
  on(CooperativeSearchActions.setSearchPage, (state, { page }) => ({
    ...state,
    filters: {
      ...state.filters,
      page,
    },
  })),
  
  on(CooperativeSearchActions.setSearchPageSize, (state, { size }) => ({
    ...state,
    filters: {
      ...state.filters,
      size,
    },
  })),

  // Reset filters
  on(CooperativeSearchActions.resetFilters, (state) => ({
    ...state,
    filters: {
      page: 0,
      size: 10,
    },
    activeSearchMethod: SearchMethod.None,
  })),

  // Clear errors
  on(CooperativeSearchActions.clearErrors, (state) => ({
    ...state,
    errors: null,
  }))
);
