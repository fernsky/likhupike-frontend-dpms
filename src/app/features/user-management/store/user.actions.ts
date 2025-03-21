import { createActionGroup, emptyProps, props } from '@ngrx/store';
import {
  CreateUserRequest,
  UpdateUserRequest,
  UserFilter,
  UserResponse,
} from '../models/user.interface';
import { ApiPaginationMeta } from '../models/api.interface';

export const UserActions = createActionGroup({
  source: 'User Management',
  events: {
    // Create User
    'Create User': props<{ request: CreateUserRequest }>(),
    'Create User Success': props<{ user: UserResponse }>(),
    'Create User Failure': props<{
      error: {
        code: string;
        message: string;
        details: unknown | null;
        status: number;
      };
    }>(),

    // Load Users
    'Load Users': props<{ filter: UserFilter }>(),
    'Load Users Success': props<{
      users: UserResponse[];
      total: number;
      meta: ApiPaginationMeta; // Added meta property
    }>(),
    'Load Users Failure': props<{
      error: {
        code: string;
        message: string;
        details: unknown | null;
        status: number;
      };
    }>(),

    // Load Single User
    'Load User': props<{ id: string }>(),
    'Load User Success': props<{ user: UserResponse }>(),
    'Load User Failure': props<{
      error: {
        code: string;
        message: string;
        details: unknown | null;
        status: number;
      };
    }>(),

    // Update User
    'Update User': props<{ id: string; request: UpdateUserRequest }>(),
    'Update User Success': props<{ user: UserResponse }>(),
    'Update User Failure': props<{
      error: {
        code: string;
        message: string;
        details: unknown | null;
        status: number;
      };
    }>(),

    // Delete User
    'Delete User': props<{ id: string }>(),
    'Delete User Success': props<{ id: string }>(),
    'Delete User Failure': props<{
      error: {
        code: string;
        message: string;
        details: unknown | null;
        status: number;
      };
    }>(),

    // Set Active Status
    'Set Active Status': props<{ id: string; active: boolean }>(),
    'Set Active Status Success': props<{ user: UserResponse }>(),
    'Set Active Status Failure': props<{
      error: {
        code: string;
        message: string;
        details: unknown | null;
        status: number;
      };
    }>(),

    // Approve User
    'Approve User': props<{ id: string }>(),
    'Approve User Success': props<{ user: UserResponse }>(),
    'Approve User Failure': props<{
      error: {
        code: string;
        message: string;
        details: unknown | null;
        status: number;
      };
    }>(),

    // Clear Errors
    'Clear Errors': emptyProps(),
  },
});
