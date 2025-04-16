import { Routes } from '@angular/router';
import { provideState } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { MUNICIPALITY_FEATURE_KEY, municipalityReducer } from './municipality/store/municipality.reducer';
import { MunicipalityEffects } from './municipality/store/municipality.effects';
import { provideTranslocoScope } from '@jsverse/transloco';

export const LOCATION_ROUTES: Routes = [
    
  {
    path: 'municipality',
     providers: [
          provideState(MUNICIPALITY_FEATURE_KEY, municipalityReducer),
          provideEffects(MunicipalityEffects),
          provideTranslocoScope({
            scope: 'municipality-profile',
            alias: 'municipality',
          })
        ],
    loadChildren: () =>
      import('./municipality/municipality-routing').then(
        (m) => m.MUNICIPALITY_ROUTES
      ),
    data: {
      breadcrumb: 'municipality.profile.breadcrumb'
    }
  },
  // Add more location-related routes here as needed
  // e.g., wards, settlements, etc.
  {
    path: '',
    redirectTo: 'municipality',
    pathMatch: 'full'
  }
];
