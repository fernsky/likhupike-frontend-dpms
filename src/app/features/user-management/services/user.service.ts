import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '@env/environment';
import {
  CreateUserRequest,
  UserFilter,
  UserResponse,
} from '../models/user.interface';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiUrl = `${environment.apiUrl}/users`;

  constructor(private http: HttpClient) {}

  createUser(
    request: CreateUserRequest,
    municipalityId?: string
  ): Observable<UserResponse> {
    // Handle file upload with other form data
    const formData = new FormData();

    // Add all non-file fields
    Object.keys(request).forEach((key) => {
      if (key !== 'profilePicture') {
        if (typeof request[key as keyof CreateUserRequest] === 'object') {
          formData.append(
            key,
            JSON.stringify(request[key as keyof CreateUserRequest])
          );
        } else {
          formData.append(key, String(request[key as keyof CreateUserRequest]));
        }
      }
    });

    // Add profile picture if exists
    if (request.profilePicture) {
      formData.append('profilePicture', request.profilePicture);
    }

    // Add municipality context if available
    const headers = new HttpHeaders();
    if (municipalityId) {
      headers.set('X-Municipality-ID', municipalityId);
    }

    return this.http
      .post<UserResponse>(`${this.apiUrl}`, formData, { headers })
      .pipe(catchError(this.handleError));
  }

  getUsers(
    filter: UserFilter,
    municipalityId?: string
  ): Observable<{ users: UserResponse[]; total: number }> {
    let params = new HttpParams()
      .set('pageSize', filter.pageSize.toString())
      .set('pageIndex', filter.pageIndex.toString());

    if (filter.search) params = params.set('search', filter.search);
    if (filter.wardNumber)
      params = params.set('wardNumber', filter.wardNumber.toString());
    if (filter.roles?.length)
      params = params.set('roles', filter.roles.join(','));
    if (filter.officePost) params = params.set('officePost', filter.officePost);
    if (filter.active !== undefined)
      params = params.set('active', filter.active.toString());

    const headers = new HttpHeaders();
    if (municipalityId) {
      headers.set('X-Municipality-ID', municipalityId);
    }

    return this.http
      .get<{
        users: UserResponse[];
        total: number;
      }>(`${this.apiUrl}`, { params, headers })
      .pipe(catchError(this.handleError));
  }

  updateUser(
    id: string,
    request: Partial<CreateUserRequest>,
    municipalityId?: string
  ): Observable<UserResponse> {
    // Similar to create, handle file upload with other form data
    const formData = new FormData();

    Object.keys(request).forEach((key) => {
      if (key !== 'profilePicture') {
        if (typeof request[key as keyof CreateUserRequest] === 'object') {
          formData.append(
            key,
            JSON.stringify(request[key as keyof CreateUserRequest])
          );
        } else {
          formData.append(key, String(request[key as keyof CreateUserRequest]));
        }
      }
    });

    if (request.profilePicture) {
      formData.append('profilePicture', request.profilePicture);
    }

    const headers = new HttpHeaders();
    if (municipalityId) {
      headers.set('X-Municipality-ID', municipalityId);
    }

    return this.http
      .patch<UserResponse>(`${this.apiUrl}/${id}`, formData, { headers })
      .pipe(catchError(this.handleError));
  }

  deleteUser(id: string, municipalityId?: string): Observable<void> {
    const headers = new HttpHeaders();
    if (municipalityId) {
      headers.set('X-Municipality-ID', municipalityId);
    }

    return this.http
      .delete<void>(`${this.apiUrl}/${id}`, { headers })
      .pipe(catchError(this.handleError));
  }

  setUserActiveStatus(
    id: string,
    active: boolean,
    municipalityId?: string
  ): Observable<UserResponse> {
    const headers = new HttpHeaders();
    if (municipalityId) {
      headers.set('X-Municipality-ID', municipalityId);
    }

    return this.http
      .patch<UserResponse>(
        `${this.apiUrl}/${id}/status`,
        { active },
        { headers }
      )
      .pipe(catchError(this.handleError));
  }

  getUserById(id: string, municipalityId?: string): Observable<UserResponse> {
    const headers = new HttpHeaders();
    if (municipalityId) {
      headers.set('X-Municipality-ID', municipalityId);
    }

    return this.http
      .get<UserResponse>(`${this.apiUrl}/${id}`, { headers })
      .pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse) {
    console.error('An error occurred:', error);

    // Transform error format if needed
    let transformedError = error.error;

    // If it's a validation error, ensure it matches our UserValidationError interface
    if (error.status === 400 && error.error?.errors) {
      transformedError = {
        errors: error.error.errors,
      };
    }

    return throwError(() => transformedError);
  }
}
