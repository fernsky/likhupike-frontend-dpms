/**
 * Cooperative Types - TypeScript interfaces for the cooperative domain
 * Based on backend DTOs and API models
 */

/**
 * Enumeration of cooperative types
 */
export enum CooperativeType {
  AGRICULTURE = 'AGRICULTURE',
  ANIMAL_HUSBANDRY = 'ANIMAL_HUSBANDRY',
  DAIRY = 'DAIRY',
  SAVINGS_AND_CREDIT = 'SAVINGS_AND_CREDIT',
  MULTIPURPOSE = 'MULTIPURPOSE',
  CONSUMER = 'CONSUMER',
  COFFEE = 'COFFEE',
  TEA = 'TEA',
  HANDICRAFT = 'HANDICRAFT',
  FRUITS_AND_VEGETABLES = 'FRUITS_AND_VEGETABLES',
  BEE_KEEPING = 'BEE_KEEPING',
  HEALTH = 'HEALTH',
  ELECTRICITY = 'ELECTRICITY',
  COMMUNICATION = 'COMMUNICATION',
  TOURISM = 'TOURISM',
  ENVIRONMENT_CONSERVATION = 'ENVIRONMENT_CONSERVATION',
  HERBS_PROCESSING = 'HERBS_PROCESSING',
  SUGARCANE = 'SUGARCANE',
  JUNAR_PROCESSING = 'JUNAR_PROCESSING',
  SMALL_FARMERS = 'SMALL_FARMERS',
  WOMEN = 'WOMEN',
  TRANSPORTATION = 'TRANSPORTATION',
  ENERGY = 'ENERGY',
  OTHER = 'OTHER',
}

/**
 * Enumeration of cooperative statuses
 */
export enum CooperativeStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  PENDING_APPROVAL = 'PENDING_APPROVAL',
  DISSOLVED = 'DISSOLVED',
  UNDER_REVIEW = 'UNDER_REVIEW',
  MERGED = 'MERGED',
}

/**
 * Enumeration of content statuses
 */
export enum ContentStatus {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED',
  ARCHIVED = 'ARCHIVED',
  PENDING_REVIEW = 'PENDING_REVIEW',
}

/**
 * Enumeration of media types
 */
export enum CooperativeMediaType {
  LOGO = 'LOGO',
  HERO_IMAGE = 'HERO_IMAGE',
  GALLERY_IMAGE = 'GALLERY_IMAGE',
  PRODUCT_PHOTO = 'PRODUCT_PHOTO',
  TEAM_PHOTO = 'TEAM_PHOTO',
  DOCUMENT = 'DOCUMENT',
  VIDEO = 'VIDEO',
  BROCHURE = 'BROCHURE',
  ANNUAL_REPORT = 'ANNUAL_REPORT',
  CERTIFICATE = 'CERTIFICATE',
}

/**
 * Enumeration of media visibility statuses
 */
export enum MediaVisibilityStatus {
  PUBLIC = 'PUBLIC',
  AUTHENTICATED = 'AUTHENTICATED',
  RESTRICTED = 'RESTRICTED',
  PRIVATE = 'PRIVATE',
}

/**
 * Time type enumeration
 */
export enum TimeType {
  LESS_THAN_30_MIN = 'LESS_THAN_30_MIN',
  BETWEEN_30_MIN_1_HOUR = 'BETWEEN_30_MIN_1_HOUR',
  BETWEEN_1_2_HOURS = 'BETWEEN_1_2_HOURS',
  MORE_THAN_2_HOURS = 'MORE_THAN_2_HOURS',
}

/**
 * Geographic point coordinates
 */
export interface GeoPointDto {
  /** Longitude coordinate */
  longitude: number;
  /** Latitude coordinate */
  latitude: number;
}

// REQUEST DTOs

/**
 * DTO for creating a new cooperative
 */
export interface CreateCooperativeDto {
  /** Unique code/slug for the cooperative (URL-friendly) */
  code: string;
  /** Default locale for this cooperative's content */
  defaultLocale: string;
  /** Date when the cooperative was established */
  establishedDate?: string;
  /** Ward where the cooperative is located */
  ward: number;
  /** Type of cooperative */
  type: CooperativeType;
  /** Status of the cooperative */
  status?: CooperativeStatus;
  /** Official registration number of the cooperative */
  registrationNumber?: string;
  /** Geographic point location (longitude, latitude) */
  point?: GeoPointDto;
  /** Primary contact email for the cooperative */
  contactEmail?: string;
  /** Primary contact phone number */
  contactPhone?: string;
  /** Website URL of the cooperative */
  websiteUrl?: string;
  /** Initial translation for the cooperative */
  translation: CreateCooperativeTranslationDto;
}

/**
 * DTO for updating an existing cooperative
 */
export interface UpdateCooperativeDto {
  /** Unique code/slug for the cooperative (URL-friendly) */
  code?: string;
  /** Default locale for this cooperative's content */
  defaultLocale?: string;
  /** Date when the cooperative was established */
  establishedDate?: string;
  /** Ward where the cooperative is located */
  ward?: number;
  /** Type of cooperative */
  type?: CooperativeType;
  /** Status of the cooperative */
  status?: CooperativeStatus;
  /** Official registration number of the cooperative */
  registrationNumber?: string;
  /** Geographic point location (longitude, latitude) */
  point?: GeoPointDto;
  /** Primary contact email for the cooperative */
  contactEmail?: string;
  /** Primary contact phone number */
  contactPhone?: string;
  /** Website URL of the cooperative */
  websiteUrl?: string;
}

/**
 * DTO for creating a new cooperative translation
 */
export interface CreateCooperativeTranslationDto {
  /** Locale for this translation */
  locale: string;
  /** Localized name of the cooperative */
  name: string;
  /** Localized detailed description of the cooperative */
  description?: string;
  /** Localized location description */
  location?: string;
  /** Localized description of services offered */
  services?: string;
  /** Localized description of key achievements */
  achievements?: string;
  /** Localized operating hours information */
  operatingHours?: string;
  /** SEO-optimized title in this language */
  seoTitle?: string;
  /** SEO meta description in this language */
  seoDescription?: string;
  /** SEO keywords in this language */
  seoKeywords?: string;
  /** URL-friendly slug in this language */
  slugUrl?: string;
  /** Content status */
  status?: ContentStatus;
  /** JSON-LD structured data for this language version */
  structuredData?: string;
  /** Instructions for search engine crawlers */
  metaRobots?: string;
}

/**
 * DTO for updating an existing cooperative translation
 */
export interface UpdateCooperativeTranslationDto {
  /** Localized name of the cooperative */
  name?: string;
  /** Localized detailed description of the cooperative */
  description?: string;
  /** Localized location description */
  location?: string;
  /** Localized description of services offered */
  services?: string;
  /** Localized description of key achievements */
  achievements?: string;
  /** Localized operating hours information */
  operatingHours?: string;
  /** SEO-optimized title in this language */
  seoTitle?: string;
  /** SEO meta description in this language */
  seoDescription?: string;
  /** SEO keywords in this language */
  seoKeywords?: string;
  /** URL-friendly slug in this language */
  slugUrl?: string;
  /** Content status */
  status?: ContentStatus;
  /** JSON-LD structured data for this language version */
  structuredData?: string;
  /** Canonical URL for this language version */
  canonicalUrl?: string;
  /** Array of hreflang references to other language versions */
  hreflangTags?: string;
  /** JSON representation of breadcrumb structure for this page */
  breadcrumbStructure?: string;
  /** Structured FAQ items for this cooperative */
  faqItems?: string;
  /** Instructions for search engine crawlers */
  metaRobots?: string;
  /** Specific image optimized for social sharing */
  socialShareImage?: string;
}

/**
 * DTO for creating new cooperative media metadata
 */
export interface CreateCooperativeMediaDto {
  /** Locale for this media item (null if not language-specific) */
  locale?: string;
  /** Type of media */
  type: CooperativeMediaType;
  /** Title/caption of the media */
  title: string;
  /** Detailed description of the media content */
  description?: string;
  /** Alternative text for accessibility and SEO */
  altText?: string;
  /** Searchable tags associated with this media */
  tags?: string;
  /** License information for the media */
  license?: string;
  /** Attribution information if required */
  attribution?: string;
  /** Display order for multiple media items */
  sortOrder?: number;
  /** Whether this is the primary media item of its type */
  isPrimary?: boolean;
  /** Whether this media should be featured prominently */
  isFeatured?: boolean;
  /** Visibility status for the media */
  visibilityStatus?: MediaVisibilityStatus;
}

/**
 * DTO for updating existing cooperative media metadata
 */
export interface UpdateCooperativeMediaDto {
  /** Locale for this media item (null if not language-specific) */
  locale?: string;
  /** Type of media */
  type?: CooperativeMediaType;
  /** Title/caption of the media */
  title?: string;
  /** Detailed description of the media content */
  description?: string;
  /** Alternative text for accessibility and SEO */
  altText?: string;
  /** Searchable tags associated with this media */
  tags?: string;
  /** License information for the media */
  license?: string;
  /** Attribution information if required */
  attribution?: string;
  /** Display order for multiple media items */
  sortOrder?: number;
  /** Whether this is the primary media item of its type */
  isPrimary?: boolean;
  /** Whether this media should be featured prominently */
  isFeatured?: boolean;
  /** Visibility status for the media */
  visibilityStatus?: MediaVisibilityStatus;
}

/**
 * DTO for creating or updating a cooperative type translation
 */
export interface CooperativeTypeTranslationDto {
  /** Type of cooperative */
  cooperativeType: CooperativeType;
  /** Locale for this translation */
  locale: string;
  /** Localized name of the cooperative type */
  name: string;
  /** Localized description of this cooperative type */
  description?: string;
}

// RESPONSE DTOs

/**
 * Response DTO for geographic point coordinates
 */
export interface GeoPointResponse {
  /** Longitude coordinate */
  longitude: number;
  /** Latitude coordinate */
  latitude: number;
}

/**
 * Response DTO for cooperative translation
 */
export interface CooperativeTranslationResponse {
  /** Unique identifier for the translation */
  id: string;
  /** Locale for this translation */
  locale: string;
  /** Localized name of the cooperative */
  name: string;
  /** Localized detailed description of the cooperative */
  description?: string;
  /** Localized location description */
  location?: string;
  /** Localized description of services offered */
  services?: string;
  /** Localized description of key achievements */
  achievements?: string;
  /** Localized operating hours information */
  operatingHours?: string;
  /** SEO-optimized title in this language */
  seoTitle?: string;
  /** SEO meta description in this language */
  seoDescription?: string;
  /** SEO keywords in this language */
  seoKeywords?: string;
  /** URL-friendly slug in this language */
  slugUrl?: string;
  /** Content status */
  status: ContentStatus;
  /** JSON-LD structured data specific to this language version */
  structuredData?: string;
  /** Canonical URL for this language version */
  canonicalUrl?: string;
  /** Array of hreflang references to other language versions */
  hreflangTags?: string;
  /** JSON representation of breadcrumb structure for this page */
  breadcrumbStructure?: string;
  /** Structured FAQ items for this cooperative */
  faqItems?: string;
  /** Instructions for search engine crawlers */
  metaRobots?: string;
  /** Specific image optimized for social sharing */
  socialShareImage?: string;
  /** When this content was last reviewed for accuracy */
  contentLastReviewed?: string;
  /** Version tracking for content changes */
  version: number;
}

/**
 * Response DTO for cooperative media
 */
export interface CooperativeMediaResponse {
  /** Unique identifier for the media */
  id: string;
  /** Locale for this media item (null if not language-specific) */
  locale?: string;
  /** Type of media */
  type: CooperativeMediaType;
  /** Title/caption of the media */
  title: string;
  /** Detailed description of the media content */
  description?: string;
  /** Alternative text for accessibility and SEO */
  altText?: string;
  /** Path to the stored file in the system */
  filePath: string;
  /** Public URL to access the media */
  fileUrl?: string;
  /** URL to thumbnail version (for images/videos) */
  thumbnailUrl?: string;
  /** MIME type of the media file */
  mimeType?: string;
  /** Size of the file in bytes */
  fileSize?: number;
  /** Dimensions for image/video files */
  dimensions?: string;
  /** Duration for audio/video files in seconds */
  duration?: number;
  /** Additional metadata in JSON format */
  metadata?: string;
  /** Searchable tags associated with this media */
  tags?: string;
  /** License information for the media */
  license?: string;
  /** Attribution information if required */
  attribution?: string;
  /** Display order for multiple media items */
  sortOrder: number;
  /** Whether this is the primary media item of its type */
  isPrimary: boolean;
  /** Whether this media should be featured prominently */
  isFeatured: boolean;
  /** Visibility status for the media */
  visibilityStatus: MediaVisibilityStatus;
  /** When this media was uploaded */
  uploadedAt: string;
  /** When this media was last accessed/viewed */
  lastAccessed?: string;
  /** Number of times this media has been viewed */
  viewCount: number;
}

/**
 * Response DTO for media upload operation
 */
export interface MediaUploadResponse {
  /** ID of the created media entry */
  id: string;
  /** Storage key for the uploaded file */
  storageKey: string;
  /** Original filename of the uploaded file */
  originalFilename: string;
  /** Content type of the file */
  contentType?: string;
  /** Size of the file in bytes */
  size: number;
  /** Public URL to access the media */
  url?: string;
  /** URL to thumbnail version (for images/videos) */
  thumbnailUrl?: string;
}

/**
 * Response DTO for cooperative type translation
 */
export interface CooperativeTypeTranslationResponse {
  /** Unique identifier for the translation */
  id: string;
  /** Type of cooperative */
  cooperativeType: CooperativeType;
  /** Locale for this translation */
  locale: string;
  /** Localized name of the cooperative type */
  name: string;
  /** Localized description of this cooperative type */
  description?: string;
}

/**
 * Response DTO for a cooperative
 */
export interface CooperativeResponse {
  /** Unique identifier for the cooperative */
  id: string;
  /** Unique code/slug for the cooperative */
  code: string;
  /** Default locale for this cooperative's content */
  defaultLocale: string;
  /** Date when the cooperative was established */
  establishedDate?: string;
  /** Ward where the cooperative is located */
  ward?: number;
  /** Type of cooperative */
  type: CooperativeType;
  /** Status of the cooperative */
  status: CooperativeStatus;
  /** Official registration number of the cooperative */
  registrationNumber?: string;
  /** Geographic point location (longitude, latitude) */
  point?: GeoPointResponse;
  /** Primary contact email for the cooperative */
  contactEmail?: string;
  /** Primary contact phone number */
  contactPhone?: string;
  /** Website URL of the cooperative */
  websiteUrl?: string;
  /** When this record was created */
  createdAt: string;
  /** When this record was last updated */
  updatedAt: string;
  /** Translations for this cooperative */
  translations: CooperativeTranslationResponse[];
  /** Primary media items for this cooperative (one per type) */
  primaryMedia: { [key: string]: CooperativeMediaResponse };
}

/**
 * API response format
 */
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface PageResponse<T> {
  content: T[];
  pageable: {
    pageNumber: number;
    pageSize: number;
    sort: {
      sorted: boolean;
      unsorted: boolean;
      empty: boolean;
    };
    offset: number;
    unpaged: boolean;
    paged: boolean;
  };
  totalElements: number;
  totalPages: number;
  last: boolean;
  numberOfElements: number;
  first: boolean;
  size: number;
  number: number;
  sort: {
    sorted: boolean;
    unsorted: boolean;
    empty: boolean;
  };
  empty: boolean;
}
