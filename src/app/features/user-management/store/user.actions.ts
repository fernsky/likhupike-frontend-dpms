import { createActionGroup, emptyProps, props } from '@ngrx/store';
import {
  CreateUserRequest,
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
    'Create User Failure': props<{ errors: UserValidationError }>(),

    // Load Users
    'Load Users': props<{ filter: UserFilter }>(),
    'Load Users Success': props<{ users: UserResponse[]; total: number }>(),
    'Load Users Failure': props<{ error: string }>(),

    // Load Single User
    'Load User': props<{ id: string }>(),
    'Load User Success': props<{ user: UserResponse }>(),
    'Load User Failure': props<{ error: string }>(),

    // Update User
    'Update User': props<{ id: string; request: Partial<CreateUserRequest> }>(),
    'Update User Success': props<{ user: UserResponse }>(),
    'Update User Failure': props<{ errors: UserValidationError }>(),

    // Delete User
    'Delete User': props<{ id: string }>(),
    'Delete User Success': props<{ id: string }>(),
    'Delete User Failure': props<{ error: string }>(),

    // Set Active Status
    'Set User Active Status': props<{ id: string; active: boolean }>(),
    'Set User Active Status Success': props<{ user: UserResponse }>(),
    'Set User Active Status Failure': props<{ error: string }>(),

    // Clear User Errors
    'Clear User Errors': emptyProps(),
  },
});
