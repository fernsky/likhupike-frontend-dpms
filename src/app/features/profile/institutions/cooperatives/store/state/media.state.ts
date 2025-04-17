import { CooperativeMediaResponse, CooperativeMediaType } from '../../types';
import { CooperativeValidationError } from './index';

/**
 * State for cooperative media management
 */
export interface CooperativeMediaState {
  // Entity data
  entities: { [id: string]: CooperativeMediaResponse };
  ids: string[];
  selectedMediaId: string | null;

  // Relationships
  mediaByCooperative: { [cooperativeId: string]: string[] };

  // Filtered views for quick access
  mediaByType: {
    [cooperativeId: string]: { [type in CooperativeMediaType]?: string[] };
  };
  primaryMedia: {
    [cooperativeId: string]: { [type in CooperativeMediaType]?: string };
  };

  // Request status
  loading: boolean;
  uploading: boolean;
  updating: boolean;
  deleting: boolean;
  settingPrimary: boolean;
  updatingVisibility: boolean;

  // Results
  uploadSuccess: boolean;
  updateSuccess: boolean;
  deleteSuccess: boolean;
  setPrimarySuccess: boolean;
  updateVisibilitySuccess: boolean;
  uploadProgress: number;
  uploadedMediaId: string | null;
  errors: CooperativeValidationError | null;

  // Pagination for media list
  totalItems: number;
  currentPage: number;
  pageSize: number;

  lastUpdated: Date | null;
}

/**
 * Default initial state for cooperative media
 */
export const initialMediaState: CooperativeMediaState = {
  entities: {},
  ids: [],
  selectedMediaId: null,

  mediaByCooperative: {},
  mediaByType: {},
  primaryMedia: {},

  loading: false,
  uploading: false,
  updating: false,
  deleting: false,
  settingPrimary: false,
  updatingVisibility: false,

  uploadSuccess: false,
  updateSuccess: false,
  deleteSuccess: false,
  setPrimarySuccess: false,
  updateVisibilitySuccess: false,
  uploadProgress: 0,
  uploadedMediaId: null,
  errors: null,

  totalItems: 0,
  currentPage: 1,
  pageSize: 10,

  lastUpdated: null,
};
