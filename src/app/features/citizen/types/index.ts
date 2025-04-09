export interface AddressDto {
  provinceCode: string;
  districtCode: string;
  municipalityCode: string;
  wardNumber: number;
  streetAddress?: string | null;
}

export interface CreateCitizenDto {
  name: string;
  nameDevnagari?: string | null;
  citizenshipNumber?: string | null;
  citizenshipIssuedDate?: string | null; // ISO date format
  citizenshipIssuedOffice?: string | null;
  email?: string | null;
  password?: string | null;
  phoneNumber?: string | null;
  permanentAddress?: AddressDto | null;
  temporaryAddress?: AddressDto | null;
  fatherName?: string | null;
  grandfatherName?: string | null;
  spouseName?: string | null;
  isApproved?: boolean;
  approvedBy?: string | null;
}

export enum DocumentType {
  CITIZEN_PHOTO = 'CITIZEN_PHOTO',
  CITIZENSHIP_FRONT = 'CITIZENSHIP_FRONT',
  CITIZENSHIP_BACK = 'CITIZENSHIP_BACK',
  SUPPORTING_DOCUMENT = 'SUPPORTING_DOCUMENT',
}

export enum DocumentState {
  NOT_UPLOADED = 'NOT_UPLOADED',
  AWAITING_REVIEW = 'AWAITING_REVIEW',
  REJECTED_BLURRY = 'REJECTED_BLURRY',
  REJECTED_UNSUITABLE = 'REJECTED_UNSUITABLE',
  REJECTED_MISMATCH = 'REJECTED_MISMATCH',
  REJECTED_INCONSISTENT = 'REJECTED_INCONSISTENT',
  APPROVED = 'APPROVED',
}

export enum CitizenState {
  PENDING_REGISTRATION = 'PENDING_REGISTRATION',
  UNDER_REVIEW = 'UNDER_REVIEW',
  ACTION_REQUIRED = 'ACTION_REQUIRED',
  REJECTED = 'REJECTED',
  APPROVED = 'APPROVED',
}

export interface DocumentDetailsResponse {
  url?: string | null;
  state?: DocumentState | null;
  note?: string | null;
  uploadedAt?: string | null; // ISO timestamp
}

export interface CitizenDocumentsResponse {
  photo?: DocumentDetailsResponse | null;
  citizenshipFront?: DocumentDetailsResponse | null;
  citizenshipBack?: DocumentDetailsResponse | null;
}

export interface AddressResponse {
  provinceCode: string;
  provinceName: string;
  provinceNameNepali?: string | null;
  districtCode: string;
  districtName: string;
  districtNameNepali?: string | null;
  municipalityCode: string;
  municipalityName: string;
  municipalityNameNepali?: string | null;
  municipalityType: string;
  wardNumber: number;
  streetAddress?: string | null;
}

export interface CitizenResponse {
  id: string; // UUID as string
  name: string;
  nameDevnagari?: string | null;
  citizenshipNumber?: string | null;
  citizenshipIssuedDate?: string | null; // ISO date format
  citizenshipIssuedOffice?: string | null;
  email?: string | null;
  phoneNumber?: string | null;
  permanentAddress?: AddressResponse | null;
  temporaryAddress?: AddressResponse | null;
  fatherName?: string | null;
  grandfatherName?: string | null;
  spouseName?: string | null;
  state: CitizenState;
  stateNote?: string | null;
  stateUpdatedAt?: string | null; // ISO timestamp
  stateUpdatedBy?: string | null; // UUID as string
  isApproved: boolean;
  approvedAt?: string | null; // ISO timestamp
  documents: CitizenDocumentsResponse;
  createdAt: string; // ISO timestamp
  updatedAt?: string | null; // ISO timestamp
}

export interface CitizenSummaryResponse {
  id?: string | null; // UUID as string
  name?: string | null;
  nameDevnagari?: string | null;
  citizenshipNumber?: string | null;
  citizenshipIssuedDate?: string | null; // ISO date format
  citizenshipIssuedOffice?: string | null;
  email?: string | null;
  phoneNumber?: string | null;
  state?: CitizenState | null;
  stateNote?: string | null;
  stateUpdatedAt?: string | null; // ISO timestamp
  stateUpdatedBy?: string | null; // UUID as string
  isApproved?: boolean | null;
  approvedBy?: string | null; // UUID as string
  approvedAt?: string | null; // ISO timestamp
  isDeleted?: boolean | null;
  deletedBy?: string | null; // UUID as string
  deletedAt?: string | null; // ISO timestamp
  permanentAddress?: AddressResponse | null;
  temporaryAddress?: AddressResponse | null;
  fatherName?: string | null;
  grandfatherName?: string | null;
  spouseName?: string | null;
  photoKey?: string | null;
  photoState?: DocumentState | null;
  photoStateNote?: string | null;
  citizenshipFrontKey?: string | null;
  citizenshipFrontState?: DocumentState | null;
  citizenshipFrontStateNote?: string | null;
  citizenshipBackKey?: string | null;
  citizenshipBackState?: DocumentState | null;
  citizenshipBackStateNote?: string | null;
  createdAt?: string | null; // ISO timestamp
  updatedAt?: string | null; // ISO timestamp
}

export interface UpdateCitizenDto {
  name?: string | null;
  nameDevnagari?: string | null;
  citizenshipNumber?: string | null;
  citizenshipIssuedDate?: string | null; // ISO date format
  citizenshipIssuedOffice?: string | null;
  email?: string | null;
  phoneNumber?: string | null;
  permanentAddress?: AddressDto | null;
  temporaryAddress?: AddressDto | null;
  fatherName?: string | null;
  grandfatherName?: string | null;
  spouseName?: string | null;
}

export interface CitizenStateUpdateDto {
  state: CitizenState;
  note?: string | null;
}

export interface DocumentStateUpdateDto {
  state: DocumentState;
  note?: string | null;
}

export interface CitizenSearchFilters {
  name?: string | null;
  nameDevnagari?: string | null;
  citizenshipNumber?: string | null;
  citizenshipIssuedOffice?: string | null;
  citizenshipIssuedDateStart?: string | null; // ISO date format
  citizenshipIssuedDateEnd?: string | null; // ISO date format
  email?: string | null;
  phoneNumber?: string | null;
  state?: CitizenState | null;
  states?: CitizenState[] | null;
  isApproved?: boolean | null;
  photoState?: DocumentState | null;
  citizenshipFrontState?: DocumentState | null;
  citizenshipBackState?: DocumentState | null;
  documentStates?: DocumentState[] | null;
  notesSearch?: string | null;
  addressTerm?: string | null;
  permanentProvinceCode?: string | null;
  permanentDistrictCode?: string | null;
  permanentMunicipalityCode?: string | null;
  permanentWardNumber?: number | null;
  createdAfter?: string | null; // ISO date format
  createdBefore?: string | null; // ISO date format
  stateUpdatedAfter?: string | null; // ISO date format
  stateUpdatedBefore?: string | null; // ISO date format
  updatedByUserId?: string | null;
  columns?: string[] | null;
  page?: number;
  size?: number;
  sortBy?: string;
  sortDirection?: 'ASC' | 'DESC';
}

export const ALLOWED_CITIZEN_COLUMNS = [
  'id',
  'name',
  'nameDevnagari',
  'citizenshipNumber',
  'citizenshipIssuedDate',
  'citizenshipIssuedOffice',
  'email',
  'phoneNumber',
  'state',
  'stateNote',
  'stateUpdatedAt',
  'stateUpdatedBy',
  'photoState',
  'photoStateNote',
  'citizenshipFrontState',
  'citizenshipFrontStateNote',
  'citizenshipBackState',
  'citizenshipBackStateNote',
  'isApproved',
  'approvedBy',
  'approvedAt',
  'isDeleted',
  'deletedBy',
  'deletedAt',
  'permanentAddress',
  'temporaryAddress',
  'createdAt',
  'updatedAt',
] as const;

export interface Province {
  code: string;
  name: string;
  nameNepali: string;
  area: number | null;
  population: number | null;
  headquarter: string | null;
  headquarterNepali: string | null;
  districtCount: number;
  totalPopulation: number;
  totalArea: number;
}

export interface District {
  code: string;
  name: string;
  nameNepali: string;
  area: number | null;
  population: number | null;
  headquarter: string | null;
  headquarterNepali: string | null;
  province: {
    code: string;
    name: string;
    nameNepali: string;
  };
  municipalityCount: number;
  totalPopulation: number;
  totalArea: number;
}

export interface Municipality {
  code: string;
  name: string;
  nameNepali: string;
  type: string;
  area: number | null;
  population: number | null;
  latitude: number | null;
  longitude: number | null;
  totalWards: number;
  district: {
    code: string;
    name: string;
    nameNepali: string;
    municipalityCount: number;
  };
}

export interface Ward {
  wardNumber: number;
  population: number | null;
}

export interface LocationApiResponse<T> {
  success: boolean;
  data: T[];
}
