import { CooperativeTranslationResponse } from '../../types';
import { CooperativeValidationError } from './index';

/**
 * State for cooperative translations management
 */
export interface CooperativeTranslationState {
  // Entity data
  entities: { [id: string]: CooperativeTranslationResponse };
  ids: string[];
  selectedTranslationId: string | null;

  // Relationships
  translationsByCooperative: { [cooperativeId: string]: string[] };

  // Request status
  loading: boolean;
  creating: boolean;
  updating: boolean;
  deleting: boolean;
  updatingStatus: boolean;

  // Results
  createSuccess: boolean;
  updateSuccess: boolean;
  deleteSuccess: boolean;
  updateStatusSuccess: boolean;
  errors: CooperativeValidationError | null;

  // Form state
  hasUnsavedChanges: boolean;
  dirtyFields: string[];
  lastUpdated: Date | null;
}

/**
 * Default initial state for cooperative translations
 */
export const initialTranslationState: CooperativeTranslationState = {
  entities: {},
  ids: [],
  selectedTranslationId: null,

  translationsByCooperative: {},

  loading: false,
  creating: false,
  updating: false,
  deleting: false,
  updatingStatus: false,

  createSuccess: false,
  updateSuccess: false,
  deleteSuccess: false,
  updateStatusSuccess: false,
  errors: null,

  hasUnsavedChanges: false,
  dirtyFields: [],
  lastUpdated: null,
};
