import { Routes } from '@angular/router';
import { PermissionGuard } from '@app/core/guards/permission.guard';
import { PermissionType } from '@app/core/models/permission.enum';

export const USER_MANAGEMENT_ROUTES: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        redirectTo: 'list',
        pathMatch: 'full',
      },
      {
        path: 'list',
        loadChildren: () =>
          import('./pages/user-list/user-list.module').then(
            (m) => m.UserListModule
          ),
        canActivate: [PermissionGuard],
        data: {
          permissions: [PermissionType.VIEW_USER],
          breadcrumb: {
            label: 'Users',
            translationKey: 'user.list.title',
            icon: 'people',
          },
        },
      },
      {
        path: 'create',
        loadChildren: () =>
          import('./pages/user-create/user-create.module').then(
            (m) => m.UserCreateModule
          ),
        canActivate: [PermissionGuard],
        data: {
          permissions: [PermissionType.CREATE_USER],
          breadcrumb: {
            label: 'Create User',
            translationKey: 'user.create.title',
            icon: 'person_add',
          },
        },
      },
      {
        path: 'edit/:id',
        loadChildren: () =>
          import('./pages/user-edit/user-edit.module').then(
            (m) => m.UserEditModule
          ),
        canActivate: [PermissionGuard],
        data: {
          permissions: [PermissionType.EDIT_USER],
          breadcrumb: {
            label: 'Edit User',
            translationKey: 'user.edit.title',
            icon: 'edit',
          },
        },
      },
    ],
  },
];
