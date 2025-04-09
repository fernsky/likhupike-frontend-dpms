import { createReducer, on } from '@ngrx/store';
import { CitizenActions } from './citizen.actions';
import { initialCitizenState, CitizenState } from './citizen.state';
import { CitizenSearchFilters, DocumentType } from '../types';

export const CITIZEN_FEATURE_KEY = 'citizenManagement';

export const citizenReducer = createReducer(
  initialCitizenState,

  // Create citizen
  on(
    CitizenActions.createCitizen,
    (state): CitizenState => ({
      ...state,
      creating: true,
      createSuccess: false,
      errors: null,
    })
  ),
  on(
    CitizenActions.createCitizenSuccess,
    (state, { response }): CitizenState => ({
      ...state,
      creating: false,
      createSuccess: true,
      selectedCitizen: 'data' in response ? response.data : null,
      selectedCitizenId: 'data' in response ? response.data.id : null,
      errors: null,
      lastUpdated: new Date(),
    })
  ),
  on(
    CitizenActions.createCitizenFailure,
    (state, { error }): CitizenState => ({
      ...state,
      creating: false,
      createSuccess: false,
      errors: error,
    })
  ),
  on(
    CitizenActions.resetCreateStatus,
    (state): CitizenState => ({
      ...state,
      creating: false,
      createSuccess: false,
      errors: null,
    })
  ),

  // Load citizens list
  on(
    CitizenActions.loadCitizens,
    (state, { filter }): CitizenState => ({
      ...state,
      loading: true,
      filter: { ...state.filter, ...filter },
      errors: null,
    })
  ),
  on(
    CitizenActions.loadCitizensSuccess,
    (state, { response, meta }): CitizenState => ({
      ...state,
      loading: false,
      citizens: 'data' in response ? response.data : [],
      pagination: meta,
      errors: null,
      lastUpdated: new Date(),
    })
  ),
  on(
    CitizenActions.loadCitizensFailure,
    (state, { error }): CitizenState => ({
      ...state,
      loading: false,
      citizens: [],
      errors: error,
    })
  ),

  // Load single citizen
  on(
    CitizenActions.loadCitizen,
    (state, { id }): CitizenState => ({
      ...state,
      loadingSelected: true,
      selectedCitizenId: id,
      errors: null,
    })
  ),
  on(
    CitizenActions.loadCitizenSuccess,
    (state, { response }): CitizenState => ({
      ...state,
      loadingSelected: false,
      selectedCitizen: 'data' in response ? response.data : null,
      errors: null,
    })
  ),
  on(
    CitizenActions.loadCitizenFailure,
    (state, { error }): CitizenState => ({
      ...state,
      loadingSelected: false,
      errors: error,
    })
  ),
  on(
    CitizenActions.clearSelectedCitizen,
    (state): CitizenState => ({
      ...state,
      selectedCitizen: null,
      selectedCitizenId: null,
      hasUnsavedChanges: false,
      dirtyFields: [],
    })
  ),

  // Update citizen
  on(
    CitizenActions.updateCitizen,
    (state): CitizenState => ({
      ...state,
      updating: true,
      updateSuccess: false,
      errors: null,
    })
  ),
  on(
    CitizenActions.updateCitizenSuccess,
    (state, { response }): CitizenState => ({
      ...state,
      updating: false,
      updateSuccess: true,
      selectedCitizen: 'data' in response ? response.data : null,
      hasUnsavedChanges: false,
      dirtyFields: [],
      errors: null,
      lastUpdated: new Date(),
    })
  ),
  on(
    CitizenActions.updateCitizenFailure,
    (state, { error }): CitizenState => ({
      ...state,
      updating: false,
      updateSuccess: false,
      errors: error,
    })
  ),
  on(
    CitizenActions.resetUpdateStatus,
    (state): CitizenState => ({
      ...state,
      updating: false,
      updateSuccess: false,
      errors: null,
    })
  ),

  // Delete citizen
  on(
    CitizenActions.deleteCitizen,
    (state): CitizenState => ({
      ...state,
      deleting: true,
      deleteSuccess: false,
      errors: null,
    })
  ),
  on(
    CitizenActions.deleteCitizenSuccess,
    (state, { id }): CitizenState => ({
      ...state,
      deleting: false,
      deleteSuccess: true,
      citizens: state.citizens.filter((citizen) => citizen.id !== id),
      selectedCitizen:
        state.selectedCitizen?.id === id ? null : state.selectedCitizen,
      selectedCitizenId:
        state.selectedCitizenId === id ? null : state.selectedCitizenId,
      errors: null,
      lastUpdated: new Date(),
    })
  ),
  on(
    CitizenActions.deleteCitizenFailure,
    (state, { error }): CitizenState => ({
      ...state,
      deleting: false,
      deleteSuccess: false,
      errors: error,
    })
  ),
  on(
    CitizenActions.resetDeleteStatus,
    (state): CitizenState => ({
      ...state,
      deleting: false,
      deleteSuccess: false,
      errors: null,
    })
  ),

  // Approve citizen
  on(
    CitizenActions.approveCitizen,
    (state): CitizenState => ({
      ...state,
      approving: true,
      approveSuccess: false,
      errors: null,
    })
  ),
  on(
    CitizenActions.approveCitizenSuccess,
    (state, { response }): CitizenState => ({
      ...state,
      approving: false,
      approveSuccess: true,
      selectedCitizen: 'data' in response ? response.data : null,
      errors: null,
      lastUpdated: new Date(),
    })
  ),
  on(
    CitizenActions.approveCitizenFailure,
    (state, { error }): CitizenState => ({
      ...state,
      approving: false,
      approveSuccess: false,
      errors: error,
    })
  ),
  on(
    CitizenActions.resetApproveStatus,
    (state): CitizenState => ({
      ...state,
      approving: false,
      approveSuccess: false,
      errors: null,
    })
  ),

  // Upload documents
  on(
    CitizenActions.uploadDocument,
    (state, { documentType }): CitizenState => ({
      ...state,
      uploadingDocument: {
        ...state.uploadingDocument,
        [documentType]: true,
      },
      uploadSuccess: {
        ...state.uploadSuccess,
        [documentType]: false,
      },
      errors: null,
    })
  ),
  on(
    CitizenActions.uploadDocumentSuccess,
    (state, { response, documentType }): CitizenState => {
      // Make sure 'data' property exists in the response
      if (!('data' in response)) {
        return state;
      }

      // Create updated state based on current selected citizen
      const updatedSelectedCitizen = state.selectedCitizen
        ? {
            ...state.selectedCitizen,
            documents: {
              ...state.selectedCitizen.documents,
              // Update the specific document based on type
              ...(documentType === DocumentType.CITIZEN_PHOTO && {
                photo: {
                  url: response.data.url,
                  state: response.data.state,
                  uploadedAt: response.data.uploadedAt,
                  note: null,
                },
              }),
              ...(documentType === DocumentType.CITIZENSHIP_FRONT && {
                citizenshipFront: {
                  url: response.data.url,
                  state: response.data.state,
                  uploadedAt: response.data.uploadedAt,
                  note: null,
                },
              }),
              ...(documentType === DocumentType.CITIZENSHIP_BACK && {
                citizenshipBack: {
                  url: response.data.url,
                  state: response.data.state,
                  uploadedAt: response.data.uploadedAt,
                  note: null,
                },
              }),
            },
          }
        : null;

      return {
        ...state,
        uploadingDocument: {
          ...state.uploadingDocument,
          [documentType]: false,
        },
        uploadSuccess: {
          ...state.uploadSuccess,
          [documentType]: true,
        },
        selectedCitizen: updatedSelectedCitizen,
        errors: null,
        lastUpdated: new Date(),
      };
    }
  ),
  on(
    CitizenActions.uploadDocumentFailure,
    (state, { error, documentType }): CitizenState => ({
      ...state,
      uploadingDocument: {
        ...state.uploadingDocument,
        [documentType]: false,
      },
      uploadSuccess: {
        ...state.uploadSuccess,
        [documentType]: false,
      },
      errors: error,
    })
  ),
  on(
    CitizenActions.resetUploadStatus,
    (state, { documentType }): CitizenState => ({
      ...state,
      uploadingDocument: {
        ...state.uploadingDocument,
        [documentType]: false,
      },
      uploadSuccess: {
        ...state.uploadSuccess,
        [documentType]: false,
      },
      errors: null,
    })
  ),

  // Update citizen state
  on(
    CitizenActions.updateCitizenState,
    (state): CitizenState => ({
      ...state,
      processingStateChange: true,
      stateChangeSuccess: false,
      errors: null,
    })
  ),
  on(
    CitizenActions.updateCitizenStateSuccess,
    (state, { response }): CitizenState => ({
      ...state,
      processingStateChange: false,
      stateChangeSuccess: true,
      selectedCitizen: 'data' in response ? response.data : null,
      errors: null,
      lastUpdated: new Date(),
    })
  ),
  on(
    CitizenActions.updateCitizenStateFailure,
    (state, { error }): CitizenState => ({
      ...state,
      processingStateChange: false,
      stateChangeSuccess: false,
      errors: error,
    })
  ),
  on(
    CitizenActions.resetStateChangeStatus,
    (state): CitizenState => ({
      ...state,
      processingStateChange: false,
      stateChangeSuccess: false,
      errors: null,
    })
  ),

  // Update document state
  on(
    CitizenActions.updateDocumentState,
    (state): CitizenState => ({
      ...state,
      processingDocumentStateChange: true,
      documentStateChangeSuccess: false,
      errors: null,
    })
  ),
  on(
    CitizenActions.updateDocumentStateSuccess,
    (state, { response }): CitizenState => ({
      ...state,
      processingDocumentStateChange: false,
      documentStateChangeSuccess: true,
      selectedCitizen: 'data' in response ? response.data : null,
      errors: null,
      lastUpdated: new Date(),
    })
  ),
  on(
    CitizenActions.updateDocumentStateFailure,
    (state, { error }): CitizenState => ({
      ...state,
      processingDocumentStateChange: false,
      documentStateChangeSuccess: false,
      errors: error,
    })
  ),
  on(
    CitizenActions.resetDocumentStateChangeStatus,
    (state): CitizenState => ({
      ...state,
      processingDocumentStateChange: false,
      documentStateChangeSuccess: false,
      errors: null,
    })
  ),

  // Filtering and pagination
  on(
    CitizenActions.filterChange,
    (state, { filter }): CitizenState => ({
      ...state,
      filter: {
        ...state.filter,
        ...filter,
      },
    })
  ),
  on(
    CitizenActions.setPage,
    (state, { pageIndex, pageSize }): CitizenState => ({
      ...state,
      filter: {
        ...state.filter,
        page: pageIndex,
        size: pageSize,
      },
    })
  ),
  on(
    CitizenActions.resetFilters,
    (state): CitizenState => ({
      ...state,
      filter: {
        page: 1,
        size: 10,
        sortBy: 'createdAt',
        sortDirection: 'DESC',
      },
    })
  ),

  // Form state management
  on(
    CitizenActions.markFieldDirty,
    (state, { fieldName }): CitizenState => ({
      ...state,
      hasUnsavedChanges: true,
      dirtyFields: state.dirtyFields.includes(fieldName)
        ? state.dirtyFields
        : [...state.dirtyFields, fieldName],
    })
  ),
  on(
    CitizenActions.clearDirtyFields,
    (state): CitizenState => ({
      ...state,
      hasUnsavedChanges: false,
      dirtyFields: [],
    })
  ),
  on(
    CitizenActions.setUnsavedChanges,
    (state, { hasUnsavedChanges }): CitizenState => ({
      ...state,
      hasUnsavedChanges,
    })
  ),

  // Misc actions
  on(
    CitizenActions.setSelectedCitizenID,
    (state, { id }): CitizenState => ({
      ...state,
      selectedCitizenId: id,
    })
  ),
  on(
    CitizenActions.refreshCitizens,
    (state): CitizenState => ({
      ...state,
      loading: true,
    })
  ),

  // URL Filters
  on(CitizenActions.applyURLFilters, (state, { urlParams }): CitizenState => {
    // Create a filter object from URL parameters
    const newFilter: Partial<CitizenSearchFilters> = {};

    // Handle numeric values
    if (urlParams['page']) newFilter.page = parseInt(urlParams['page'], 10);
    if (urlParams['size']) newFilter.size = parseInt(urlParams['size'], 10);
    if (urlParams['permanentWardNumber']) {
      newFilter.permanentWardNumber = parseInt(
        urlParams['permanentWardNumber'],
        10
      );
    }

    // Handle boolean values
    if (urlParams['isApproved'] !== undefined) {
      newFilter.isApproved = urlParams['isApproved'] === 'true';
    }

    // Handle string values
    const stringFields = [
      'name',
      'nameDevnagari',
      'citizenshipNumber',
      'citizenshipIssuedOffice',
      'email',
      'phoneNumber',
      'state',
      'permanentProvinceCode',
      'permanentDistrictCode',
      'permanentMunicipalityCode',
      'citizenshipIssuedDateStart',
      'citizenshipIssuedDateEnd',
      'createdAfter',
      'createdBefore',
      'stateUpdatedAfter',
      'stateUpdatedBefore',
      'updatedByUserId',
      'sortBy',
    ];

    stringFields.forEach((field) => {
      if (urlParams[field]) {
        newFilter[field as keyof CitizenSearchFilters] = urlParams[
          field
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ] as any;
      }
    });

    // Handle sort direction
    if (urlParams['sortDirection']) {
      newFilter.sortDirection = urlParams['sortDirection'] as 'ASC' | 'DESC';
    }

    // Handle arrays
    if (urlParams['states']) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      newFilter.states = urlParams['states'].split(',') as any[];
    }

    if (urlParams['documentStates']) {
      newFilter.documentStates = urlParams['documentStates'].split(
        ','
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ) as any[];
    }

    if (urlParams['columns']) {
      newFilter.columns = urlParams['columns'].split(',');
    }

    return {
      ...state,
      filter: {
        ...state.filter,
        ...newFilter,
      },
    };
  })
);
