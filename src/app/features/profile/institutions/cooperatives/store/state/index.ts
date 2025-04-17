import { CooperativeState } from './cooperative.state';
import { CooperativeTranslationState } from './translation.state';
import { CooperativeMediaState } from './media.state';
import { CooperativeTypeTranslationState } from './type-translation.state';
import { CooperativeSearchState } from './search.state';

/**
 * Combined state for all cooperative-related features
 */
export interface CooperativesFeatureState {
  cooperative: CooperativeState;
  translation: CooperativeTranslationState;
  media: CooperativeMediaState;
  typeTranslation: CooperativeTypeTranslationState;
  search: CooperativeSearchState;
}

/**
 * Error object structure for API validation errors
 */
export interface CooperativeValidationError {
  status: number;
  field?: string;
  message?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

export * from './cooperative.state';
export * from './translation.state';
export * from './media.state';
export * from './type-translation.state';
export * from './search.state';
