import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import {
  ApiResponse,
  LoginRequest,
  RegisterRequest,
  LoginSuccessData,
  RegistrationSuccessData,
  RequestPasswordResetRequest,
  ResetPasswordRequest,
} from '../models/auth.interface';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private isBrowser: boolean;

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) platformId: object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  login(credentials: LoginRequest): Observable<ApiResponse<LoginSuccessData>> {
    return this.http
      .post<
        ApiResponse<LoginSuccessData>
      >(`${environment.apiUrl}${environment.auth.loginEndpoint}`, credentials)
      .pipe(catchError(this.handleError));
  }

  register(
    userData: RegisterRequest
  ): Observable<ApiResponse<RegistrationSuccessData>> {
    return this.http
      .post<
        ApiResponse<RegistrationSuccessData>
      >(`${environment.apiUrl}${environment.auth.registerEndpoint}`, userData)
      .pipe(catchError(this.handleError));
  }

  refreshToken(
    refreshToken: string
  ): Observable<ApiResponse<LoginSuccessData>> {
    return this.http
      .post<
        ApiResponse<LoginSuccessData>
      >(`${environment.apiUrl}${environment.auth.refreshTokenEndpoint}`, { refreshToken })
      .pipe(catchError(this.handleError));
  }

  requestPasswordReset(
    email: RequestPasswordResetRequest
  ): Observable<ApiResponse<void>> {
    return this.http
      .post<
        ApiResponse<void>
      >(`${environment.apiUrl}/auth/password-reset/request`, email)
      .pipe(catchError(this.handleError));
  }

  resetPassword(
    resetData: ResetPasswordRequest
  ): Observable<ApiResponse<void>> {
    return this.http
      .post<
        ApiResponse<void>
      >(`${environment.apiUrl}/auth/password-reset/reset`, resetData)
      .pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An error occurred';

    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = error.error.message;
    } else if (error.error?.error?.message) {
      // Server-side error with specific message
      errorMessage = error.error.error.message;
    } else if (error.error?.message) {
      // Server-side error with direct message
      errorMessage = error.error.message;
    } else if (error.message) {
      // Generic error with message
      errorMessage = error.message;
    }

    return throwError(() => ({
      success: false,
      error: {
        code: error.error?.error?.code || 'ERROR',
        message: errorMessage,
        details: error.error?.error?.details || {},
        status: error.status || 500,
      },
    }));
  }
}
