import { createReducer, on } from '@ngrx/store';
import { CooperativeSearchActions } from '../actions';
import { initialSearchState } from '../state';
import { CooperativeResponse } from '../../types';

/**
 * Reducer for cooperative search functionality
 */
export const searchReducer = createReducer(
  initialSearchState,

  // Search by name
  on(CooperativeSearchActions.searchByName, (state) => ({
    ...state,
    loading: true,
    errors: null,
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

  // Get by type
  on(CooperativeSearchActions.getByType, (state) => ({
    ...state,
    loading: true,
    errors: null,
  })),
  on(CooperativeSearchActions.getByTypeSuccess, (state, { type, response }) => {
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
      filters: {
        ...state.filters,
        type,
      },
      lastUpdated: new Date(),
    };
  }),
  on(CooperativeSearchActions.getByTypeFailure, (state, { error }) => ({
    ...state,
    loading: false,
    errors: error,
  })),

  // Get by status
  on(CooperativeSearchActions.getByStatus, (state) => ({
    ...state,
    loading: true,
    errors: null,
  })),
  on(
    CooperativeSearchActions.getByStatusSuccess,
    (state, { status, response }) => {
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
        filters: {
          ...state.filters,
          status,
        },
        lastUpdated: new Date(),
      };
    }
  ),
  on(CooperativeSearchActions.getByStatusFailure, (state, { error }) => ({
    ...state,
    loading: false,
    errors: error,
  })),

  // Get by ward
  on(CooperativeSearchActions.getByWard, (state) => ({
    ...state,
    loading: true,
    errors: null,
  })),
  on(CooperativeSearchActions.getByWardSuccess, (state, { ward, response }) => {
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
      filters: {
        ...state.filters,
        ward,
      },
      lastUpdated: new Date(),
    };
  }),
  on(CooperativeSearchActions.getByWardFailure, (state, { error }) => ({
    ...state,
    loading: false,
    errors: error,
  })),

  // Find cooperatives near location
  on(CooperativeSearchActions.findNear, (state) => ({
    ...state,
    loading: true,
    errors: null,
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
      if (!response.data) return state;

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
      if (!response.data) return state;

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
  on(CooperativeSearchActions.filterChange, (state, { filter }) => ({
    ...state,
    filters: {
      ...state.filters,
      ...filter,
    },
  })),

  // Reset filters
  on(CooperativeSearchActions.resetFilters, (state) => ({
    ...state,
    filters: {
      page: 0,
      size: 10,
    },
  })),

  // Clear errors
  on(CooperativeSearchActions.clearErrors, (state) => ({
    ...state,
    errors: null,
  }))
);
