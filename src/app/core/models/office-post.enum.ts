/**
 * Enumeration of official government posts in the municipality system.
 * These positions are based on the Local Government Operation Act, 2074 (2017)
 * and standard municipality organizational structure.
 */
export enum OfficePost {
  /**
   * Chief Administrative Officer (प्रमुख प्रशासकीय अधिकृत)
   * Highest administrative position in the municipality
   */
  CHIEF_ADMINISTRATIVE_OFFICER = 'Chief Administrative Officer',

  /**
   * Administrative Officer (प्रशासकीय अधिकृत)
   * Handles administrative operations and coordination
   */
  ADMINISTRATIVE_OFFICER = 'Administrative Officer',

  /**
   * Account Officer (लेखा अधिकृत)
   * Manages financial operations and accounting
   */
  ACCOUNT_OFFICER = 'Account Officer',

  /**
   * Information Technology Officer (सूचना प्रविधि अधिकृत)
   * Manages IT infrastructure and digital systems
   */
  IT_OFFICER = 'IT Officer',

  /**
   * Ward Secretary (वडा सचिव)
   * Administrative head of a ward office
   */
  WARD_SECRETARY = 'Ward Secretary',

  /**
   * Technical Officer (प्राविधिक अधिकृत)
   * Handles technical aspects and engineering matters
   */
  TECHNICAL_OFFICER = 'Technical Officer',

  /**
   * Planning Officer (योजना अधिकृत)
   * Manages development planning and implementation
   */
  PLANNING_OFFICER = 'Planning Officer',

  /**
   * Revenue Officer (राजस्व अधिकृत)
   * Handles revenue collection and management
   */
  REVENUE_OFFICER = 'Revenue Officer',

  /**
   * Social Development Officer (सामाजिक विकास अधिकृत)
   * Manages social development programs
   */
  SOCIAL_DEVELOPMENT_OFFICER = 'Social Development Officer',

  /**
   * Administrative Assistant (प्रशासन सहायक)
   * Assists in administrative tasks
   */
  ADMINISTRATIVE_ASSISTANT = 'Administrative Assistant',

  /**
   * IT Assistant (सूचना प्रविधि सहायक)
   * Provides IT support and assistance
   */
  IT_ASSISTANT = 'IT Assistant',
}

/**
 * Interface defining the structure of office post metadata
 */
export interface OfficePostMetadata {
  /**
   * English title of the post
   */
  title: string;

  /**
   * Nepali title of the post
   */
  titleNp: string;

  /**
   * Indicates if the post is ward-level or municipality-level
   */
  isWardLevel: boolean;

  /**
   * Minimum required academic qualification
   */
  minQualification: string;

  /**
   * Position level in government service
   */
  level: string;
}

/**
 * Metadata for each office post
 * This can be used for additional validation and display purposes
 */
export const OFFICE_POST_METADATA: Record<OfficePost, OfficePostMetadata> = {
  [OfficePost.CHIEF_ADMINISTRATIVE_OFFICER]: {
    title: 'Chief Administrative Officer',
    titleNp: 'प्रमुख प्रशासकीय अधिकृत',
    isWardLevel: false,
    minQualification: 'Masters in Public Administration or related field',
    level: 'First Class Officer',
  },
  [OfficePost.ADMINISTRATIVE_OFFICER]: {
    title: 'Administrative Officer',
    titleNp: 'प्रशासकीय अधिकृत',
    isWardLevel: false,
    minQualification: 'Bachelors in Public Administration or related field',
    level: 'Second Class Officer',
  },
  [OfficePost.ACCOUNT_OFFICER]: {
    title: 'Account Officer',
    titleNp: 'लेखा अधिकृत',
    isWardLevel: false,
    minQualification: 'Bachelors in Commerce or Business Administration',
    level: 'Second Class Officer',
  },
  [OfficePost.IT_OFFICER]: {
    title: 'Information Technology Officer',
    titleNp: 'सूचना प्रविधि अधिकृत',
    isWardLevel: false,
    minQualification: 'Bachelors in Computer Science or Information Technology',
    level: 'Second Class Officer',
  },
  [OfficePost.WARD_SECRETARY]: {
    title: 'Ward Secretary',
    titleNp: 'वडा सचिव',
    isWardLevel: true,
    minQualification: 'Bachelors in Public Administration or related field',
    level: 'Third Class Officer',
  },
  [OfficePost.TECHNICAL_OFFICER]: {
    title: 'Technical Officer',
    titleNp: 'प्राविधिक अधिकृत',
    isWardLevel: false,
    minQualification: 'Bachelors in Engineering',
    level: 'Second Class Officer',
  },
  [OfficePost.PLANNING_OFFICER]: {
    title: 'Planning Officer',
    titleNp: 'योजना अधिकृत',
    isWardLevel: false,
    minQualification: 'Bachelors in Planning, Economics or related field',
    level: 'Second Class Officer',
  },
  [OfficePost.REVENUE_OFFICER]: {
    title: 'Revenue Officer',
    titleNp: 'राजस्व अधिकृत',
    isWardLevel: false,
    minQualification: 'Bachelors in Commerce or Economics',
    level: 'Second Class Officer',
  },
  [OfficePost.SOCIAL_DEVELOPMENT_OFFICER]: {
    title: 'Social Development Officer',
    titleNp: 'सामाजिक विकास अधिकृत',
    isWardLevel: false,
    minQualification: 'Bachelors in Social Sciences or related field',
    level: 'Second Class Officer',
  },
  [OfficePost.ADMINISTRATIVE_ASSISTANT]: {
    title: 'Administrative Assistant',
    titleNp: 'प्रशासन सहायक',
    isWardLevel: false,
    minQualification: 'Intermediate level education',
    level: 'Non-Gazetted First Class',
  },
  [OfficePost.IT_ASSISTANT]: {
    title: 'IT Assistant',
    titleNp: 'सूचना प्रविधि सहायक',
    isWardLevel: false,
    minQualification: 'Intermediate level in Computer Science',
    level: 'Non-Gazetted First Class',
  },
};

/**
 * Helper function to get post metadata
 * @param post OfficePost enum value
 * @returns OfficePostMetadata for the given post
 */
export function getOfficePostMetadata(post: OfficePost): OfficePostMetadata {
  return OFFICE_POST_METADATA[post];
}

/**
 * Helper function to check if a post is ward level
 * @param post OfficePost enum value
 * @returns boolean indicating if the post is ward level
 */
export function isWardLevelPost(post: OfficePost): boolean {
  return OFFICE_POST_METADATA[post].isWardLevel;
}
