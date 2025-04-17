import {
  CooperativeType,
  CooperativeTypeTranslationResponse,
} from '../../types';
import { CooperativeValidationError } from './index';

/**
 * State for cooperative type translations management
 */
export interface CooperativeTypeTranslationState {
  // Entity data
  entities: { [id: string]: CooperativeTypeTranslationResponse };
  ids: string[];

  // Organized collections
  translationsByType: { [type in CooperativeType]?: string[] };
  translationsByLocale: { [locale: string]: string[] };
  typeTranslationMap: {
    [type in CooperativeType]?: { [locale: string]: string };
  };

  // Request status
  loading: boolean;
  creating: boolean;
  deleting: boolean;

  // Results
  createSuccess: boolean;
  deleteSuccess: boolean;
  errors: CooperativeValidationError | null;

  // Pagination
  paginatedTranslations: {
    [locale: string]: {
      ids: string[];
      totalItems: number;
      currentPage: number;
      pageSize: number;
    };
  };

  lastUpdated: Date | null;
}

/**
 * Default initial state for cooperative type translations
 */
export const initialTypeTranslationState: CooperativeTypeTranslationState = {
  entities: {},
  ids: [],

  translationsByType: {},
  translationsByLocale: {},
  typeTranslationMap: {},

  loading: false,
  creating: false,
  deleting: false,

  createSuccess: false,
  deleteSuccess: false,
  errors: null,

  paginatedTranslations: {},

  lastUpdated: null,
};
