import { createReducer, on } from '@ngrx/store';
import { CooperativeTypeTranslationActions } from '../actions';
import { initialTypeTranslationState } from '../state';
import {
  CooperativeType,
  CooperativeTypeTranslationResponse,
} from '../../types';

/**
 * Reducer for cooperative type translation management
 */
export const typeTranslationReducer = createReducer(
  initialTypeTranslationState,

  // Create or update type translation
  on(
    CooperativeTypeTranslationActions.createOrUpdateTypeTranslation,
    (state) => ({
      ...state,
      creating: true,
      createSuccess: false,
      errors: null,
    })
  ),
  on(
    CooperativeTypeTranslationActions.createOrUpdateSuccess,
    (state, { response }) => {
      if (!response.data) return state;

      const translation = response.data;
      const newEntities = { ...state.entities, [translation.id]: translation };
      const newIds = state.ids.includes(translation.id)
        ? state.ids
        : [...state.ids, translation.id];

      // Update the by-type index
      const translationsByType = { ...state.translationsByType };
      if (!translationsByType[translation.cooperativeType as CooperativeType]) {
        translationsByType[translation.cooperativeType as CooperativeType] = [];
      }
      if (
        !translationsByType[
          translation.cooperativeType as CooperativeType
        ]!.includes(translation.id)
      ) {
        translationsByType[translation.cooperativeType as CooperativeType] = [
          ...translationsByType[
            translation.cooperativeType as CooperativeType
          ]!,
          translation.id,
        ];
      }

      // Update the by-locale index
      const translationsByLocale = { ...state.translationsByLocale };
      if (!translationsByLocale[translation.locale]) {
        translationsByLocale[translation.locale] = [];
      }
      if (!translationsByLocale[translation.locale].includes(translation.id)) {
        translationsByLocale[translation.locale] = [
          ...translationsByLocale[translation.locale],
          translation.id,
        ];
      }

      // Update the type-locale map
      const typeTranslationMap = { ...state.typeTranslationMap };
      if (!typeTranslationMap[translation.cooperativeType as CooperativeType]) {
        typeTranslationMap[translation.cooperativeType as CooperativeType] = {};
      }
      typeTranslationMap[translation.cooperativeType as CooperativeType]![
        translation.locale
      ] = translation.id;

      return {
        ...state,
        creating: false,
        createSuccess: true,
        entities: newEntities,
        ids: newIds,
        translationsByType,
        translationsByLocale,
        typeTranslationMap,
        lastUpdated: new Date(),
      };
    }
  ),
  on(
    CooperativeTypeTranslationActions.createOrUpdateFailure,
    (state, { error }) => ({
      ...state,
      creating: false,
      createSuccess: false,
      errors: error,
    })
  ),

  // Get type translation by ID
  on(CooperativeTypeTranslationActions.getTypeTranslation, (state) => ({
    ...state,
    loading: true,
    errors: null,
  })),
  on(
    CooperativeTypeTranslationActions.getTypeTranslationSuccess,
    (state, { response }) => {
      if (!response.data) return state;

      const translation = response.data;
      const newEntities = { ...state.entities, [translation.id]: translation };
      const newIds = state.ids.includes(translation.id)
        ? state.ids
        : [...state.ids, translation.id];

      return {
        ...state,
        loading: false,
        entities: newEntities,
        ids: newIds,
        lastUpdated: new Date(),
      };
    }
  ),
  on(
    CooperativeTypeTranslationActions.getTypeTranslationFailure,
    (state, { error }) => ({
      ...state,
      loading: false,
      errors: error,
    })
  ),

  // Get type translation by type and locale
  on(
    CooperativeTypeTranslationActions.getTypeTranslationByTypeAndLocale,
    (state) => ({
      ...state,
      loading: true,
      errors: null,
    })
  ),
  on(
    CooperativeTypeTranslationActions.getByTypeAndLocaleSuccess,
    (state, { response }) => {
      if (!response.data) return state;

      const translation = response.data;
      const newEntities = { ...state.entities, [translation.id]: translation };
      const newIds = state.ids.includes(translation.id)
        ? state.ids
        : [...state.ids, translation.id];

      // Update the type-locale map
      const typeTranslationMap = { ...state.typeTranslationMap };
      if (!typeTranslationMap[translation.cooperativeType as CooperativeType]) {
        typeTranslationMap[translation.cooperativeType as CooperativeType] = {};
      }
      typeTranslationMap[translation.cooperativeType as CooperativeType]![
        translation.locale
      ] = translation.id;

      return {
        ...state,
        loading: false,
        entities: newEntities,
        ids: newIds,
        typeTranslationMap,
        lastUpdated: new Date(),
      };
    }
  ),
  on(
    CooperativeTypeTranslationActions.getByTypeAndLocaleFailure,
    (state, { error }) => ({
      ...state,
      loading: false,
      errors: error,
    })
  ),

  // Get all translations for type
  on(CooperativeTypeTranslationActions.getAllForType, (state) => ({
    ...state,
    loading: true,
    errors: null,
  })),
  on(
    CooperativeTypeTranslationActions.getAllForTypeSuccess,
    (state, { type, response }) => {
      if (!response.data) return state;

      const translations = response.data;
      const newEntities = { ...state.entities };
      const newIds = [...state.ids];

      // Collect translation IDs for this type
      const typeTranslationIds: string[] = [];

      // Update entities and mappings
      translations.forEach(
        (translation: CooperativeTypeTranslationResponse) => {
          if (!newIds.includes(translation.id)) {
            newIds.push(translation.id);
          }
          newEntities[translation.id] = translation;
          typeTranslationIds.push(translation.id);

          // Update by-locale index
          const translationsByLocale = { ...state.translationsByLocale };
          if (!translationsByLocale[translation.locale]) {
            translationsByLocale[translation.locale] = [];
          }
          if (
            !translationsByLocale[translation.locale].includes(translation.id)
          ) {
            translationsByLocale[translation.locale] = [
              ...translationsByLocale[translation.locale],
              translation.id,
            ];
          }

          // Update type-locale map
          const typeTranslationMap = { ...state.typeTranslationMap };
          if (!typeTranslationMap[type as CooperativeType]) {
            typeTranslationMap[type as CooperativeType] = {};
          }
          typeTranslationMap[type as CooperativeType]![translation.locale] =
            translation.id;

          state = {
            ...state,
            translationsByLocale,
            typeTranslationMap,
          };
        }
      );

      // Update the by-type index
      const translationsByType = {
        ...state.translationsByType,
        [type]: typeTranslationIds,
      };

      return {
        ...state,
        loading: false,
        entities: newEntities,
        ids: newIds,
        translationsByType,
        lastUpdated: new Date(),
      };
    }
  ),
  on(
    CooperativeTypeTranslationActions.getAllForTypeFailure,
    (state, { error }) => ({
      ...state,
      loading: false,
      errors: error,
    })
  ),

  // Get translations by locale
  on(CooperativeTypeTranslationActions.getByLocale, (state) => ({
    ...state,
    loading: true,
    errors: null,
  })),
  on(
    CooperativeTypeTranslationActions.getByLocaleSuccess,
    (state, { locale, response }) => {
      if (!response.data) return state;

      const { content, totalElements, number: page, size } = response.data;
      const newEntities = { ...state.entities };
      const newIds = [...state.ids];

      // Collect translation IDs for this locale
      const localeTranslationIds: string[] = [];

      // Update entities and mappings
      content.forEach((translation: CooperativeTypeTranslationResponse) => {
        if (!newIds.includes(translation.id)) {
          newIds.push(translation.id);
        }
        newEntities[translation.id] = translation;
        localeTranslationIds.push(translation.id);

        // Update by-type index
        const translationsByType = { ...state.translationsByType };
        if (
          !translationsByType[translation.cooperativeType as CooperativeType]
        ) {
          translationsByType[translation.cooperativeType as CooperativeType] =
            [];
        }
        if (
          !translationsByType[
            translation.cooperativeType as CooperativeType
          ]!.includes(translation.id)
        ) {
          translationsByType[translation.cooperativeType as CooperativeType] = [
            ...translationsByType[
              translation.cooperativeType as CooperativeType
            ]!,
            translation.id,
          ];
        }

        // Update type-locale map
        const typeTranslationMap = { ...state.typeTranslationMap };
        if (
          !typeTranslationMap[translation.cooperativeType as CooperativeType]
        ) {
          typeTranslationMap[translation.cooperativeType as CooperativeType] =
            {};
        }
        typeTranslationMap[translation.cooperativeType as CooperativeType]![
          locale
        ] = translation.id;

        state = {
          ...state,
          translationsByType,
          typeTranslationMap,
        };
      });

      // Update the by-locale index
      const translationsByLocale = {
        ...state.translationsByLocale,
        [locale]: localeTranslationIds,
      };

      // Update pagination state for this locale
      const paginatedTranslations = {
        ...state.paginatedTranslations,
        [locale]: {
          ids: localeTranslationIds,
          totalItems: totalElements,
          currentPage: page,
          pageSize: size,
        },
      };

      return {
        ...state,
        loading: false,
        entities: newEntities,
        ids: newIds,
        translationsByLocale,
        paginatedTranslations,
        lastUpdated: new Date(),
      };
    }
  ),
  on(
    CooperativeTypeTranslationActions.getByLocaleFailure,
    (state, { error }) => ({
      ...state,
      loading: false,
      errors: error,
    })
  ),

  // Delete type translation
  on(CooperativeTypeTranslationActions.deleteTypeTranslation, (state) => ({
    ...state,
    deleting: true,
    deleteSuccess: false,
    errors: null,
  })),
  on(
    CooperativeTypeTranslationActions.deleteTypeTranslationSuccess,
    (state, { cooperativeType, locale }: { cooperativeType: CooperativeType; locale: string }) => {
      // First we need to find the ID of the translation to delete
      const translationId = state.typeTranslationMap[cooperativeType]?.[locale];

      if (!translationId) {
        return {
          ...state,
          deleting: false,
          deleteSuccess: true,
        };
      }

      // Remove from entities and IDs
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { [translationId]: removed, ...newEntities } = state.entities;
      const newIds = state.ids.filter((id) => id !== translationId);

      // Remove from by-type index
      const translationsByType = { ...state.translationsByType };
      if (translationsByType[cooperativeType]) {
        translationsByType[cooperativeType] = translationsByType[cooperativeType]!.filter(
          (id) => id !== translationId
        );
      }

      // Remove from by-locale index
      const translationsByLocale = { ...state.translationsByLocale };
      if (translationsByLocale[locale]) {
        translationsByLocale[locale] = translationsByLocale[locale].filter(
          (id) => id !== translationId
        );
      }

      // Remove from type-locale map
      const typeTranslationMap = { ...state.typeTranslationMap };
      if (typeTranslationMap[cooperativeType] && typeTranslationMap[cooperativeType]![locale]) {
        delete typeTranslationMap[cooperativeType]![locale];
      }

      return {
        ...state,
        deleting: false,
        deleteSuccess: true,
        entities: newEntities,
        ids: newIds,
        translationsByType,
        translationsByLocale,
        typeTranslationMap,
        lastUpdated: new Date(),
      };
    }
  ),
  on(
    CooperativeTypeTranslationActions.deleteTypeTranslationFailure,
    (state, { error }) => ({
      ...state,
      deleting: false,
      deleteSuccess: false,
      errors: error,
    })
  ),

  // Get all types for locale
  on(CooperativeTypeTranslationActions.getAllTypesForLocale, (state) => ({
    ...state,
    loading: true,
    errors: null,
  })),
  on(
    CooperativeTypeTranslationActions.getAllTypesForLocaleSuccess,
    (state, { locale, response }) => {
      if (!response.data) return state;

      const typeTranslationMap = { ...state.typeTranslationMap };
      const newEntities = { ...state.entities };
      const newIds = [...state.ids];

      // Process each type translation
      Object.entries(response.data).forEach(([typeKey, translation]) => {
        const type = typeKey as CooperativeType;

        // Add to entities
        const extractedTranslation =
          translation as CooperativeTypeTranslationResponse;
        if (!newIds.includes(extractedTranslation.id)) {
          newIds.push(extractedTranslation.id);
        }
        newEntities[extractedTranslation.id] = extractedTranslation;

        // Update type-locale map
        if (!typeTranslationMap[type]) {
          typeTranslationMap[type] = {};
        }
        typeTranslationMap[type]![locale] = extractedTranslation.id;
      });

      return {
        ...state,
        loading: false,
        entities: newEntities,
        ids: newIds,
        typeTranslationMap,
        lastUpdated: new Date(),
      };
    }
  ),
  on(
    CooperativeTypeTranslationActions.getAllTypesForLocaleFailure,
    (state, { error }) => ({
      ...state,
      loading: false,
      errors: error,
    })
  ),

  // Clear errors
  on(CooperativeTypeTranslationActions.clearErrors, (state) => ({
    ...state,
    errors: null,
  }))
);
