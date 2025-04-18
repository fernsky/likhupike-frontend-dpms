import { createAction, props } from '@ngrx/store';

// Modal and Dialog State
export const openCreateDialog = createAction(
  '[Cooperative UI] Open Create Dialog'
);

export const closeCreateDialog = createAction(
  '[Cooperative UI] Close Create Dialog'
);

export const openEditDialog = createAction(
  '[Cooperative UI] Open Edit Dialog',
  props<{ id: string }>()
);

export const closeEditDialog = createAction(
  '[Cooperative UI] Close Edit Dialog'
);

export const openDeleteDialog = createAction(
  '[Cooperative UI] Open Delete Dialog',
  props<{ id: string; name: string }>()
);

export const closeDeleteDialog = createAction(
  '[Cooperative UI] Close Delete Dialog'
);

export const openMediaUploadDialog = createAction(
  '[Cooperative UI] Open Media Upload Dialog',
  props<{ cooperativeId: string }>()
);

export const closeMediaUploadDialog = createAction(
  '[Cooperative UI] Close Media Upload Dialog'
);

export const openMediaViewDialog = createAction(
  '[Cooperative UI] Open Media View Dialog',
  props<{ mediaId: string }>()
);

export const closeMediaViewDialog = createAction(
  '[Cooperative UI] Close Media View Dialog'
);

// Tab Navigation
export const setActiveTab = createAction(
  '[Cooperative UI] Set Active Tab',
  props<{ tabIndex: number }>()
);

// URL Sync
export const syncUrlToState = createAction(
  '[Cooperative UI] Sync Url To State'
);

export const updateQueryParams = createAction(
  '[Cooperative UI] Update Query Params',
  props<{
    [param: string]: string | number | boolean | null;
  }>()
);
