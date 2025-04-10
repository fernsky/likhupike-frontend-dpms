import { Routes } from '@angular/router';
import { authGuard } from '@app/core/guards/auth.guard';
import { PermissionGuard } from '@app/core/guards/permission.guard';
import { citizenReducer, CITIZEN_FEATURE_KEY } from './store/citizen.reducer';
import { provideState } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { CitizenEffects } from './store/citizen.effects';
import { provideTranslocoScope } from '@jsverse/transloco';
import { unsavedChangesGuard } from '@app/core/guards/unsaved-changes.guard';

export const CITIZEN_MANAGEMENT_ROUTES: Routes = [
  {
    path: '',
    providers: [
      provideState(CITIZEN_FEATURE_KEY, citizenReducer),
      provideEffects(CitizenEffects),
    ],
    children: [
      {
        path: 'list',
        loadChildren: () =>
          import('./pages/citizen-list/citizen-list.module').then(
            (m) => m.CitizenListModule
          ),
        canActivate: [authGuard, PermissionGuard],
        data: {
          permissions: ['VIEW_CITIZEN'],
        },
        providers: [
          provideTranslocoScope({
            scope: 'citizen-list',
            alias: 'citizen',
          }),
        ],
      },
      {
        path: 'create',
        loadChildren: () =>
          import('./pages/citizen-create/citizen-create.module').then(
            (m) => m.CitizenCreateModule
          ),
        canActivate: [authGuard, PermissionGuard],
        canDeactivate: [unsavedChangesGuard],
        data: {
          permissions: ['CREATE_CITIZEN'],
        },
        providers: [
          provideTranslocoScope({
            scope: 'citizen-create',
            alias: 'citizen',
          }),
        ],
      },
      {
        path: 'edit/:id',
        loadChildren: () =>
          import('./pages/citizen-edit/citizen-edit.module').then(
            (m) => m.CitizenEditModule
          ),
        canActivate: [authGuard, PermissionGuard],
        canDeactivate: [unsavedChangesGuard],
        data: {
          permissions: ['EDIT_CITIZEN'],
        },
        providers: [
          provideTranslocoScope({
            scope: 'citizen-edit',
            alias: 'citizen',
          }),
        ],
      },
      {
        path: 'view/:id',
        loadChildren: () =>
          import('./pages/citizen-view/citizen-view.module').then(
            (m) => m.CitizenViewModule
          ),
        canActivate: [authGuard, PermissionGuard],
        data: {
          permissions: ['VIEW_CITIZEN'],
        },
        providers: [
          provideTranslocoScope({
            scope: 'citizen-view',
            alias: 'citizen',
          }),
        ],
      },
    ],
  },
];
