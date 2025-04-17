import { combineReducers } from '@ngrx/store';

import { cooperativeReducer } from './cooperative.reducer';
import { translationReducer } from './translation.reducer';
import { mediaReducer } from './media.reducer';
import { typeTranslationReducer } from './type-translation.reducer';
import { searchReducer } from './search.reducer';

/**
 * Export the combined root reducer
 */
export const cooperativesFeatureReducer = combineReducers({
  cooperative: cooperativeReducer,
  translation: translationReducer,
  media: mediaReducer,
  typeTranslation: typeTranslationReducer,
  search: searchReducer,
});

/**
 * Feature key for this store slice
 */
export const COOPERATIVES_FEATURE_KEY = 'cooperatives';
