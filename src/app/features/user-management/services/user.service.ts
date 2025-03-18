import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpParams,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '@env/environment';
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
    return this.http
      .post<UserResponse>(this.apiUrl, request)
      .pipe(catchError(this.handleError));
  }

  getUsers(
    filter: UserFilter
  ): Observable<{ users: UserResponse[]; total: number }> {
    let params = new HttpParams()
      .set('pageSize', filter.pageSize.toString())
      .set('pageIndex', filter.pageIndex.toString());

    if (filter.search) {
      params = params.set('search', filter.search);
    }
    if (filter.wardNumber) {
      params = params.set('wardNumber', filter.wardNumber.toString());
    }
    if (filter.permissions?.length) {
      params = params.set('permissions', filter.permissions.join(','));
    }

    return this.http
      .get<{ users: UserResponse[]; total: number }>(this.apiUrl, { params })
      .pipe(catchError(this.handleError));
  }

  getUserById(id: string): Observable<UserResponse> {
    return this.http
      .get<UserResponse>(`${this.apiUrl}/${id}`)
      .pipe(catchError(this.handleError));
  }

  updateUser(id: string, request: UpdateUserRequest): Observable<UserResponse> {
    // Convert undefined values to null to match Kotlin nullable types
    const nullableRequest: UpdateUserRequest = {
      email: request.email ?? null,
      isWardLevelUser: request.isWardLevelUser ?? null,
      wardNumber: request.wardNumber ?? null,
    };

    return this.http
      .patch<UserResponse>(`${this.apiUrl}/${id}`, nullableRequest)
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

  private handleError(error: HttpErrorResponse) {
    console.error('An error occurred:', error);
    return throwError(() => error.error || 'Server error');
  }
}
