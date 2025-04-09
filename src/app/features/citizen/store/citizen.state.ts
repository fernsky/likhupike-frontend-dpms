import {
  CitizenResponse,
  CitizenSearchFilters,
  CitizenSummaryResponse,
  DocumentType,
} from '../types';

export interface PaginationState {
  currentPage: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  isFirst: boolean;
  isLast: boolean;
}

export interface CitizenValidationError {
  status: number;
  field?: string;
  message?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

export interface CitizenState {
  // List view state
  citizens: CitizenSummaryResponse[];
  loading: boolean;
  pagination: PaginationState;
  filter: CitizenSearchFilters;
  lastUpdated: Date | null;

  // Single citizen view state
  selectedCitizen: CitizenResponse | null;
  loadingSelected: boolean;
  selectedCitizenId: string | null;

  // CRUD operation states
  creating: boolean;
  updating: boolean;
  deleting: boolean;
  approving: boolean;
  uploadingDocument: Record<DocumentType, boolean>;
  processingStateChange: boolean;
  processingDocumentStateChange: boolean;

  // Success/error states
  errors: CitizenValidationError | null;
  createSuccess: boolean;
  updateSuccess: boolean;
  deleteSuccess: boolean;
  approveSuccess: boolean;
  uploadSuccess: Record<DocumentType, boolean>;
  stateChangeSuccess: boolean;
  documentStateChangeSuccess: boolean;

  // Tracking unsaved changes
  hasUnsavedChanges: boolean;
  dirtyFields: string[];
}

export const initialCitizenState: CitizenState = {
  // List view state
  citizens: [],
  loading: false,
  pagination: {
    currentPage: 1,
    pageSize: 10,
    totalElements: 0,
    totalPages: 0,
    isFirst: true,
    isLast: true,
  },
  filter: {
    page: 1,
    size: 10,
    sortBy: 'createdAt',
    sortDirection: 'DESC',
  },
  lastUpdated: null,

  // Single citizen view state
  selectedCitizen: null,
  loadingSelected: false,
  selectedCitizenId: null,

  // CRUD operation states
  creating: false,
  updating: false,
  deleting: false,
  approving: false,
  uploadingDocument: {
    [DocumentType.CITIZEN_PHOTO]: false,
    [DocumentType.CITIZENSHIP_FRONT]: false,
    [DocumentType.CITIZENSHIP_BACK]: false,
    [DocumentType.SUPPORTING_DOCUMENT]: false,
  },
  processingStateChange: false,
  processingDocumentStateChange: false,

  // Success/error states
  errors: null,
  createSuccess: false,
  updateSuccess: false,
  deleteSuccess: false,
  approveSuccess: false,
  uploadSuccess: {
    [DocumentType.CITIZEN_PHOTO]: false,
    [DocumentType.CITIZENSHIP_FRONT]: false,
    [DocumentType.CITIZENSHIP_BACK]: false,
    [DocumentType.SUPPORTING_DOCUMENT]: false,
  },
  stateChangeSuccess: false,
  documentStateChangeSuccess: false,

  // Tracking unsaved changes
  hasUnsavedChanges: false,
  dirtyFields: [],
};
