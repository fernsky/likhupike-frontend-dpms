import { createSelector } from '@ngrx/store';
import { selectCooperativesFeature } from './cooperative.selectors';
import { CooperativeType } from '../../types';

// Type translation state selector
export const selectTypeTranslationState = createSelector(
  selectCooperativesFeature,
  (state) => state.typeTranslation
);

// Entity selectors
export const selectTypeTranslationEntities = createSelector(
  selectTypeTranslationState,
  (state) => state.entities
);

export const selectTypeTranslationIds = createSelector(
  selectTypeTranslationState,
  (state) => state.ids
);

export const selectAllTypeTranslations = createSelector(
  selectTypeTranslationEntities,
  selectTypeTranslationIds,
  (entities, ids) => ids.map((id) => entities[id])
);

// Organized collection selectors
export const selectTranslationsByType = createSelector(
  selectTypeTranslationState,
  (state) => state.translationsByType
);

export const selectTypeTranslations = (type: CooperativeType) =>
  createSelector(
    selectTypeTranslationEntities,
    selectTranslationsByType,
    (entities, byType) => {
      const ids = byType[type] || [];
      return ids.map((id) => entities[id]);
    }
  );

export const selectTranslationsByLocale = createSelector(
  selectTypeTranslationState,
  (state) => state.translationsByLocale
);

export const selectLocaleTranslations = (locale: string) =>
  createSelector(
    selectTypeTranslationEntities,
    selectTranslationsByLocale,
    (entities, byLocale) => {
      const ids = byLocale[locale] || [];
      return ids.map((id) => entities[id]);
    }
  );

export const selectTypeTranslationMap = createSelector(
  selectTypeTranslationState,
  (state) => state.typeTranslationMap
);

export const selectTranslationForTypeAndLocale = (
  type: CooperativeType,
  locale: string
) =>
  createSelector(selectTypeTranslationMap, (map) => {
    const typeMap = map[type] || {};
    return typeMap[locale];
  });

// UI state selectors
export const selectTypeTranslationsLoading = createSelector(
  selectTypeTranslationState,
  (state) => state.loading
);

export const selectTypeTranslationCreating = createSelector(
  selectTypeTranslationState,
  (state) => state.creating
);

export const selectTypeTranslationDeleting = createSelector(
  selectTypeTranslationState,
  (state) => state.deleting
);

export const selectTypeTranslationProcessing = createSelector(
  selectTypeTranslationState,
  (state) => state.loading || state.creating || state.deleting
);

// Result selectors
export const selectTypeTranslationCreateSuccess = createSelector(
  selectTypeTranslationState,
  (state) => state.createSuccess
);

export const selectTypeTranslationDeleteSuccess = createSelector(
  selectTypeTranslationState,
  (state) => state.deleteSuccess
);

export const selectTypeTranslationErrors = createSelector(
  selectTypeTranslationState,
  (state) => state.errors
);

// Pagination selectors
export const selectPaginatedTranslations = createSelector(
  selectTypeTranslationState,
  (state) => state.paginatedTranslations
);

export const selectLocalePagination = (locale: string) =>
  createSelector(
    selectPaginatedTranslations,
    (paginated) =>
      paginated[locale] || {
        ids: [],
        totalItems: 0,
        currentPage: 1,
        pageSize: 10,
      }
  );

export const selectTypeTranslationLastUpdated = createSelector(
  selectTypeTranslationState,
  (state) => state.lastUpdated
);
