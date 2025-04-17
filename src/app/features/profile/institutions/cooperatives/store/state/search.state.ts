import { CooperativeStatus, CooperativeType } from '../../types';
import { CooperativeValidationError } from './index';

/**
 * Interface for search filters - aligned with CooperativeSearchService capabilities
 */
export interface CooperativeFilter {
  // Basic search params
  nameQuery?: string;
  type?: CooperativeType;
  status?: CooperativeStatus;
  ward?: number;

  // Geographic search params
  longitude?: number;
  latitude?: number;
  distanceInMeters?: number;

  // Pagination params
  page?: number;
  size?: number;
}

/**
 * State for cooperative search functionality
 */
export interface CooperativeSearchState {
  // Search results
  results: string[];

  // Search statistics
  statisticsByType: { [type in CooperativeType]?: number };
  statisticsByWard: { [ward: number]: number };

  // Filtering & Pagination
  filters: CooperativeFilter;
  totalResults: number;

  // Status
  loading: boolean;
  errors: CooperativeValidationError | null;
  lastUpdated: Date | null;
}

/**
 * Default initial state for cooperative search
 */
export const initialSearchState: CooperativeSearchState = {
  results: [],

  statisticsByType: {},
  statisticsByWard: {},

  filters: {
    page: 0,
    size: 10,
  },
  totalResults: 0,

  loading: false,
  errors: null,
  lastUpdated: null,
};
