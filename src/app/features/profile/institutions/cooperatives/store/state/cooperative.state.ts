import { CooperativeResponse } from '../../types';
import { CooperativeValidationError } from './index';

/**
 * State for cooperative entity management
 */
export interface CooperativeState {
  // Entity data
  entities: { [id: string]: CooperativeResponse };
  ids: string[];
  selectedCooperativeId: string | null;

  // Request status
  loading: boolean;
  creating: boolean;
  updating: boolean;
  deleting: boolean;
  changingStatus: boolean;

  // Results
  createSuccess: boolean;
  updateSuccess: boolean;
  deleteSuccess: boolean;
  changeStatusSuccess: boolean;
  errors: CooperativeValidationError | null;

  // Form state
  hasUnsavedChanges: boolean;
  dirtyFields: string[];

  // Pagination & filtering state
  totalItems: number;
  currentPage: number;
  pageSize: number;
  sortBy: string;
  sortDirection: 'ASC' | 'DESC';
  lastUpdated: Date | null;
}

/**
 * Default initial state for cooperative entity
 */
export const initialCooperativeState: CooperativeState = {
  entities: {},
  ids: [],
  selectedCooperativeId: null,

  loading: false,
  creating: false,
  updating: false,
  deleting: false,
  changingStatus: false,

  createSuccess: false,
  updateSuccess: false,
  deleteSuccess: false,
  changeStatusSuccess: false,
  errors: null,

  hasUnsavedChanges: false,
  dirtyFields: [],

  totalItems: 0,
  currentPage: 1,
  pageSize: 10,
  sortBy: 'createdAt',
  sortDirection: 'DESC',
  lastUpdated: null,
};
