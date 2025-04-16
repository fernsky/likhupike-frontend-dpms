import { MunicipalityResponse } from '../types';

export interface MunicipalityValidationError {
  status: number;
  field?: string;
  message?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

export interface MunicipalityState {
  // Municipality data
  municipality: MunicipalityResponse | null;
  
  // Loading states
  loading: boolean;
  creating: boolean;
  updating: boolean;
  updatingGeo: boolean;
  
  // Success/error states
  errors: MunicipalityValidationError | null;
  createSuccess: boolean;
  updateSuccess: boolean;
  updateGeoSuccess: boolean;
  
  // Form state tracking
  hasUnsavedChanges: boolean;
  dirtyFields: string[];
  
  // Last updated timestamp
  lastUpdated: Date | null;
}

export const initialMunicipalityState: MunicipalityState = {
  municipality: null,
  loading: false,
  creating: false,
  updating: false,
  updatingGeo: false,
  errors: null,
  createSuccess: false,
  updateSuccess: false,
  updateGeoSuccess: false,
  hasUnsavedChanges: false,
  dirtyFields: [],
  lastUpdated: null
};
