import { createActionGroup, emptyProps, props } from '@ngrx/store';
import {
  CreateUserRequest,
  UpdateUserRequest,
  UserFilter,
  UserResponse,
  UserValidationError,
} from '../models/user.interface';

export const UserActions = createActionGroup({
  source: 'User Management',
  events: {
    // Create User
    'Create User': props<{ request: CreateUserRequest }>(),
    'Create User Success': props<{ user: UserResponse }>(),
    'Create User Failure': props<{ error: UserValidationError }>(),

    // Load Users
    'Load Users': props<{ filter: UserFilter }>(),
    'Load Users Success': props<{ users: UserResponse[]; total: number }>(),
    'Load Users Failure': props<{ error: UserValidationError }>(),

    // Load Single User
    'Load User': props<{ id: string }>(),
    'Load User Success': props<{ user: UserResponse }>(),
    'Load User Failure': props<{ error: UserValidationError }>(),

    // Update User
    'Update User': props<{ id: string; request: UpdateUserRequest }>(),
    'Update User Success': props<{ user: UserResponse }>(),
    'Update User Failure': props<{ error: UserValidationError }>(),

    // Delete User
    'Delete User': props<{ id: string }>(),
    'Delete User Success': props<{ id: string }>(),
    'Delete User Failure': props<{ error: UserValidationError }>(),

    // Set Active Status
    'Set Active Status': props<{ id: string; active: boolean }>(),
    'Set Active Status Success': props<{ user: UserResponse }>(),
    'Set Active Status Failure': props<{ error: UserValidationError }>(),

    // Clear Errors
    'Clear Errors': emptyProps(),
  },
});
