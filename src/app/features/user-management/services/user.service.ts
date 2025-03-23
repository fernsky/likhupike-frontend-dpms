import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse,
  HttpParams,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '@env/environment';
import {
  ApiResponse,
  ApiErrorResponse,
  ApiPaginationMeta,
} from '../models/api.interface';
import {
  CreateUserRequest,
  UpdateUserRequest,
  UserFilter,
  UserResponse,
  ResetUserPasswordRequest,
  UserPermissionsRequest,
  UserWithDetailedPermissions,
} from '../models/user.interface';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiUrl = `${environment.apiUrl}/users`;

  constructor(private http: HttpClient) {}

  createUser(
    request: CreateUserRequest
  ): Observable<{ user: UserResponse; message: string }> {
    return this.http.post<ApiResponse<UserResponse>>(this.apiUrl, request).pipe(
      map((response) => {
        if (!response.success) {
          throw response.error;
        }
        return {
          user: response.data,
          message: response.message,
        };
      }),
      catchError(this.handleError)
    );
  }

  getUsers(filter: UserFilter): Observable<{
    users: UserResponse[];
    total: number;
    meta: ApiPaginationMeta;
  }> {
    const params = this.convertFilterToParams(filter);
    return this.http
      .get<ApiResponse<UserResponse[]>>(`${this.apiUrl}/search`, { params })
      .pipe(
        map((response) => {
          if (!response.success) {
            throw response.error;
          }
          // Use the API's pagination meta directly without modification
          return {
            users: response.data,
            total: response.meta?.totalElements || 0,
            meta: response.meta || {
              page: 1,
              size: 10,
              totalElements: 0,
              totalPages: 0,
              isFirst: true,
              isLast: true,
            },
          };
        }),
        catchError(this.handleError)
      );
  }

  getUserById(id: string): Observable<UserResponse> {
    return this.http
      .get<ApiResponse<UserResponse>>(`${this.apiUrl}/${id}`)
      .pipe(
        map((response) => {
          if (!response.success) {
            throw response.error;
          }
          return response.data;
        }),
        catchError(this.handleError)
      );
  }

  updateUser(
    id: string,
    request: UpdateUserRequest
  ): Observable<{ user: UserResponse; message: string }> {
    return this.http
      .put<ApiResponse<UserResponse>>(`${this.apiUrl}/${id}`, request)
      .pipe(
        map((response) => {
          if (!response.success) {
            throw response.error;
          }
          return {
            user: response.data,
            message: response.message, // Include API's message
          };
        }),
        catchError(this.handleError)
      );
  }

  deleteUser(id: string): Observable<{ message: string }> {
    return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/${id}`).pipe(
      map((response) => {
        if (!response.success) {
          throw response.error;
        }
        return {
          message: response.message,
        };
      }),
      catchError(this.handleError)
    );
  }

  approveUser(id: string): Observable<{ user: UserResponse; message: string }> {
    return this.http
      .post<ApiResponse<UserResponse>>(`${this.apiUrl}/${id}/approve`, {})
      .pipe(
        map((response) => {
          if (!response.success) {
            throw response.error;
          }
          return {
            user: response.data,
            message: response.message, // Include the success message
          };
        }),
        catchError(this.handleError)
      );
  }

  resetPassword(
    id: string,
    request: ResetUserPasswordRequest
  ): Observable<{ user: UserResponse; message: string }> {
    return this.http
      .post<
        ApiResponse<UserResponse>
      >(`${this.apiUrl}/${id}/reset-password`, request)
      .pipe(
        map((response) => {
          if (!response.success) {
            throw response.error;
          }
          return {
            user: response.data,
            message: response.message,
          };
        }),
        catchError(this.handleError)
      );
  }

  updatePermissions(
    id: string,
    request: UserPermissionsRequest
  ): Observable<{ user: UserResponse; message: string }> {
    return this.http
      .put<
        ApiResponse<UserWithDetailedPermissions>
      >(`${this.apiUrl}/${id}/permissions`, request)
      .pipe(
        map((response) => {
          if (!response.success) {
            throw response.error;
          }
          // Convert detailed permissions back to simple format for store
          const simplifiedUser: UserResponse = {
            ...response.data,
            permissions: response.data.permissions.map((p) => p.type),
          };
          return {
            user: simplifiedUser,
            message: response.message,
          };
        }),
        catchError(this.handleError)
      );
  }

  private convertFilterToParams(filter: UserFilter): HttpParams {
    let params = new HttpParams();

    // Set defaults for pagination and sorting
    params = params.set('page', (filter.page ?? 1).toString());
    params = params.set('size', (filter.size ?? 10).toString());
    params = params.set('sortBy', filter.sortBy ?? 'createdAt');
    params = params.set('sortDirection', filter.sortDirection ?? 'DESC');

    // Sort params - safer null checks
    if (filter.sortBy && filter.sortDirection) {
      params = params.set('sortBy', filter.sortBy);
      params = params.set('sortDirection', filter.sortDirection);
    }

    // Rest of the filter params with null checks
    if (filter.searchTerm?.trim()) {
      params = params.set('searchTerm', filter.searchTerm.trim());
    }

    if (filter.email?.trim()) {
      params = params.set('email', filter.email.trim());
    }

    if (filter.isApproved !== undefined && filter.isApproved !== null) {
      params = params.set('isApproved', filter.isApproved.toString());
    }

    if (
      filter.isWardLevelUser !== undefined &&
      filter.isWardLevelUser !== null
    ) {
      params = params.set('isWardLevelUser', filter.isWardLevelUser.toString());
    }

    if (filter.wardNumber !== undefined && filter.wardNumber !== null) {
      params = params.set('wardNumber', filter.wardNumber.toString());
    }

    if (filter.createdAfter) {
      params = params.set('createdAfter', filter.createdAfter);
    }

    if (filter.createdBefore) {
      params = params.set('createdBefore', filter.createdBefore);
    }

    if (Array.isArray(filter.permissions) && filter.permissions.length > 0) {
      params = params.set('permissions', filter.permissions.join(','));
    }

    if (Array.isArray(filter.columns) && filter.columns.length > 0) {
      params = params.set('columns', filter.columns.join(','));
    }

    return params;
  }

  private handleError(error: HttpErrorResponse | ApiErrorResponse) {
    console.error('API Error:', error);

    // If it's an HTTP error with a structured error response
    if (
      error instanceof HttpErrorResponse &&
      error.error &&
      !error.error.success
    ) {
      return throwError(() => error.error.error);
    }

    // If it's already an ApiErrorResponse
    if ('error' in error && !('status' in error)) {
      return throwError(() => error.error);
    }

    // Fallback for unexpected errors
    return throwError(() => ({
      code: 'UNKNOWN_ERROR',
      message: 'An unknown error occurred',
      details: null,
      status: error instanceof HttpErrorResponse ? error.status : 500,
    }));
  }
}
