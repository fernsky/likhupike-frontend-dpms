import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse,
  HttpParams,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '@env/environment';
import { ApiResponse, ApiErrorResponse } from '../models/api.interface';
import {
  CreateUserRequest,
  UpdateUserRequest,
  UserFilter,
  UserResponse,
} from '../models/user.interface';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiUrl = `${environment.apiUrl}/users`;

  constructor(private http: HttpClient) {}

  createUser(request: CreateUserRequest): Observable<UserResponse> {
    return this.http.post<ApiResponse<UserResponse>>(this.apiUrl, request).pipe(
      map((response) => {
        if (!response.success) {
          throw response.error;
        }
        return response.data;
      }),
      catchError(this.handleError)
    );
  }

  getUsers(
    filter: UserFilter
  ): Observable<{ users: UserResponse[]; total: number }> {
    const params = this.convertFilterToParams(filter);
    return this.http
      .get<ApiResponse<UserResponse[]>>(`${this.apiUrl}/search`, { params })
      .pipe(
        map((response) => {
          if (!response.success) {
            throw response.error;
          }
          return {
            users: response.data,
            total: response.meta?.totalElements || 0,
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

  updateUser(id: string, request: UpdateUserRequest): Observable<UserResponse> {
    return this.http
      .patch<UserResponse>(`${this.apiUrl}/${id}`, request)
      .pipe(catchError(this.handleError));
  }

  deleteUser(id: string): Observable<void> {
    return this.http
      .delete<void>(`${this.apiUrl}/${id}`)
      .pipe(catchError(this.handleError));
  }

  setUserActiveStatus(id: string, active: boolean): Observable<UserResponse> {
    return this.http
      .patch<UserResponse>(`${this.apiUrl}/${id}/status`, { active })
      .pipe(catchError(this.handleError));
  }

  private convertFilterToParams(filter: UserFilter): HttpParams {
    let params = new HttpParams();

    if (filter.email) params = params.set('email', filter.email);
    if (filter.searchTerm) params = params.set('searchTerm', filter.searchTerm);
    if (filter.isApproved !== undefined)
      params = params.set('isApproved', filter.isApproved.toString());
    if (filter.isWardLevelUser !== undefined)
      params = params.set('isWardLevelUser', filter.isWardLevelUser.toString());
    if (filter.wardNumberFrom)
      params = params.set('wardNumberFrom', filter.wardNumberFrom.toString());
    if (filter.wardNumberTo)
      params = params.set('wardNumberTo', filter.wardNumberTo.toString());
    if (filter.createdAfter)
      params = params.set('createdAfter', filter.createdAfter);
    if (filter.createdBefore)
      params = params.set('createdBefore', filter.createdBefore);
    if (filter.permissions?.length)
      params = params.set('permissions', filter.permissions.join(','));
    if (filter.columns?.length)
      params = params.set('columns', filter.columns.join(','));

    // Pagination and sorting (with defaults)
    params = params.set('page', (filter.page || 0).toString());
    params = params.set('size', (filter.size || 10).toString());
    params = params.set('sortBy', filter.sortBy || 'createdAt');
    params = params.set('sortDirection', filter.sortDirection || 'DESC');

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
