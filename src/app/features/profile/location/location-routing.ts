import { Routes } from '@angular/router';
import { provideState } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { MUNICIPALITY_FEATURE_KEY, municipalityReducer } from './municipality/store/municipality.reducer';
import { MunicipalityEffects } from './municipality/store/municipality.effects';
import { provideTranslocoScope } from '@jsverse/transloco';
import { MunicipalityProfileComponent } from './municipality/pages/municipality-profile/municipality-profile.component';
import { authGuard } from '@app/core/guards/auth.guard';
import { PermissionGuard } from '@app/core/guards/permission.guard';
import { unsavedChangesGuard } from '@app/core/guards/unsaved-changes.guard';

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
    component: MunicipalityProfileComponent,
    canActivate: [authGuard, PermissionGuard],
    canDeactivate: [unsavedChangesGuard],
    data: {
      permissions: ['MANAGE_PROFILE'],
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
