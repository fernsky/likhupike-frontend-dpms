import { CooperativeStatus, CooperativeType } from '../../types';
import { CooperativeValidationError } from './index';

/**
 * Interface for search filters - aligned with CooperativeSearchService capabilities
 * Each search method has its own parameters except for pagination
 */
export interface CooperativeFilter {
  // Individual search parameters - only one should be active at a time
  nameQuery?: string;
  type?: CooperativeType;
  status?: CooperativeStatus;
  ward?: number;

  // Geographic search params
  longitude?: number;
  latitude?: number;
  distanceInMeters?: number;

  // Pagination params - shared across all search methods
  page?: number;
  size?: number;
}

/**
 * Tracks which search method is currently active
 */
export enum SearchMethod {
  None = 'none',
  ByName = 'byName',
  ByType = 'byType',
  ByStatus = 'byStatus',
  ByWard = 'byWard',
  NearLocation = 'nearLocation'
}

/**
 * State for cooperative search functionality
 */
export interface CooperativeSearchState {
  // Search results
  results: string[];

  // Active search method
  activeSearchMethod: SearchMethod;

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
  
  activeSearchMethod: SearchMethod.None,

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
