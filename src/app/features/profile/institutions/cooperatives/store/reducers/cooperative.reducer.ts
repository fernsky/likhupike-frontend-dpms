import { createReducer, on } from '@ngrx/store';
import { CooperativeActions } from '../actions';
import { initialCooperativeState } from '../state';
import { CooperativeResponse } from '../../types';

/**
 * Reducer for cooperative entity management
 */
export const cooperativeReducer = createReducer(
  initialCooperativeState,

  // Loading cooperatives
  on(CooperativeActions.loadCooperatives, (state) => ({
    ...state,
    loading: true,
    errors: null,
  })),
  on(CooperativeActions.loadCooperativesSuccess, (state, { response }) => {
    if (!response.data) return state;

    const { content, totalElements } = response.data;

    // Create or update entities and collect ids
    const newEntities = { ...state.entities };
    const newIds = [...state.ids];

    content.forEach((cooperative: CooperativeResponse) => {
      if (!newIds.includes(cooperative.id)) {
        newIds.push(cooperative.id);
      }
      newEntities[cooperative.id] = cooperative;
    });

    return {
      ...state,
      loading: false,
      entities: newEntities,
      ids: newIds,
      totalItems: totalElements,
      lastUpdated: new Date(),
    };
  }),
  on(CooperativeActions.loadCooperativesFailure, (state, { error }) => ({
    ...state,
    loading: false,
    errors: error,
  })),

  // Loading single cooperative
  on(CooperativeActions.loadCooperative, (state) => ({
    ...state,
    loading: true,
    errors: null,
  })),
  on(CooperativeActions.loadCooperativeByCode, (state) => ({
    ...state,
    loading: true,
    errors: null,
  })),
  on(CooperativeActions.loadCooperativeSuccess, (state, { response }) => {
    if (!response.data) return state;

    const cooperative = response.data;
    const newEntities = { ...state.entities, [cooperative.id]: cooperative };
    const newIds = state.ids.includes(cooperative.id)
      ? state.ids
      : [...state.ids, cooperative.id];

    return {
      ...state,
      loading: false,
      entities: newEntities,
      ids: newIds,
      selectedCooperativeId: cooperative.id,
      lastUpdated: new Date(),
    };
  }),
  on(CooperativeActions.loadCooperativeFailure, (state, { error }) => ({
    ...state,
    loading: false,
    errors: error,
  })),

  // Creating a cooperative
  on(CooperativeActions.createCooperative, (state) => ({
    ...state,
    creating: true,
    createSuccess: false,
    errors: null,
  })),
  on(CooperativeActions.createCooperativeSuccess, (state, { response }) => {
    if (!response.data) return state;

    const cooperative = response.data;
    const newEntities = { ...state.entities, [cooperative.id]: cooperative };
    const newIds = [...state.ids, cooperative.id];

    return {
      ...state,
      creating: false,
      createSuccess: true,
      entities: newEntities,
      ids: newIds,
      selectedCooperativeId: cooperative.id,
      lastUpdated: new Date(),
    };
  }),
  on(CooperativeActions.createCooperativeFailure, (state, { error }) => ({
    ...state,
    creating: false,
    createSuccess: false,
    errors: error,
  })),
  on(CooperativeActions.resetCreateStatus, (state) => ({
    ...state,
    creating: false,
    createSuccess: false,
    errors: null,
  })),

  // Updating a cooperative
  on(CooperativeActions.updateCooperative, (state) => ({
    ...state,
    updating: true,
    updateSuccess: false,
    errors: null,
  })),
  on(CooperativeActions.updateCooperativeSuccess, (state, { response }) => {
    if (!response.data) return state;

    const cooperative = response.data;
    const newEntities = { ...state.entities, [cooperative.id]: cooperative };

    return {
      ...state,
      updating: false,
      updateSuccess: true,
      entities: newEntities,
      hasUnsavedChanges: false,
      dirtyFields: [],
      lastUpdated: new Date(),
    };
  }),
  on(CooperativeActions.updateCooperativeFailure, (state, { error }) => ({
    ...state,
    updating: false,
    updateSuccess: false,
    errors: error,
  })),
  on(CooperativeActions.resetUpdateStatus, (state) => ({
    ...state,
    updating: false,
    updateSuccess: false,
    errors: null,
  })),

  // Deleting a cooperative
  on(CooperativeActions.deleteCooperative, (state) => ({
    ...state,
    deleting: true,
    deleteSuccess: false,
    errors: null,
  })),
  on(CooperativeActions.deleteCooperativeSuccess, (state, { id }) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { [id]: removed, ...newEntities } = state.entities;
    const newIds = state.ids.filter((existingId) => existingId !== id);

    return {
      ...state,
      deleting: false,
      deleteSuccess: true,
      entities: newEntities,
      ids: newIds,
      selectedCooperativeId: null,
      lastUpdated: new Date(),
    };
  }),
  on(CooperativeActions.deleteCooperativeFailure, (state, { error }) => ({
    ...state,
    deleting: false,
    deleteSuccess: false,
    errors: error,
  })),
  on(CooperativeActions.resetDeleteStatus, (state) => ({
    ...state,
    deleting: false,
    deleteSuccess: false,
    errors: null,
  })),

  // Changing cooperative status
  on(CooperativeActions.changeCooperativeStatus, (state) => ({
    ...state,
    changingStatus: true,
    changeStatusSuccess: false,
    errors: null,
  })),
  on(CooperativeActions.changeStatusSuccess, (state, { response }) => {
    if (!response.data) return state;

    const cooperative = response.data;
    const newEntities = { ...state.entities, [cooperative.id]: cooperative };

    return {
      ...state,
      changingStatus: false,
      changeStatusSuccess: true,
      entities: newEntities,
      lastUpdated: new Date(),
    };
  }),
  on(CooperativeActions.changeStatusFailure, (state, { error }) => ({
    ...state,
    changingStatus: false,
    changeStatusSuccess: false,
    errors: error,
  })),
  on(CooperativeActions.resetStatusChange, (state) => ({
    ...state,
    changingStatus: false,
    changeStatusSuccess: false,
    errors: null,
  })),

  // Form state management
  on(CooperativeActions.markFieldDirty, (state, { fieldName }) => ({
    ...state,
    hasUnsavedChanges: true,
    dirtyFields: state.dirtyFields.includes(fieldName)
      ? state.dirtyFields
      : [...state.dirtyFields, fieldName],
  })),
  on(CooperativeActions.clearDirtyFields, (state) => ({
    ...state,
    hasUnsavedChanges: false,
    dirtyFields: [],
  })),
  on(CooperativeActions.setUnsavedChanges, (state, { hasUnsavedChanges }) => ({
    ...state,
    hasUnsavedChanges,
  })),

  // Set selected cooperative
  on(CooperativeActions.selectCooperative, (state, { id }) => ({
    ...state,
    selectedCooperativeId: id,
  })),

  // Pagination and sorting
  on(CooperativeActions.setPage, (state, { page }) => ({
    ...state,
    currentPage: page,
  })),
  on(CooperativeActions.setPageSize, (state, { size }) => ({
    ...state,
    pageSize: size,
  })),
  on(CooperativeActions.setSort, (state, { sortBy, sortDirection }) => ({
    ...state,
    sortBy,
    sortDirection,
  })),

  // Clear errors
  on(CooperativeActions.clearErrors, (state) => ({
    ...state,
    errors: null,
  }))
);
