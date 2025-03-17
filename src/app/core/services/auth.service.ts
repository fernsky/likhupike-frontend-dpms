import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import {
  LoginRequest,
  RegisterRequest,
  AuthResponse,
  RequestPasswordResetRequest,
  ResetPasswordRequest,
} from '../models/auth.interface';
import { User } from '../models/user.interface';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  private tokenSubject = new BehaviorSubject<string | null>(null);
  private isBrowser: boolean;

  currentUser$ = this.currentUserSubject.asObservable();
  token$ = this.tokenSubject.asObservable();

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
    this.initializeFromStorage();
  }

  private initializeFromStorage(): void {
    if (!this.isBrowser) return;

    const storedUser = localStorage.getItem('currentUser');
    const storedToken = localStorage.getItem('token');

    if (storedUser && storedToken) {
      this.currentUserSubject.next(JSON.parse(storedUser));
      this.tokenSubject.next(storedToken);
    }
  }

  login(credentials: LoginRequest): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(
        `${environment.apiUrl}${environment.auth.loginEndpoint}`,
        credentials
      )
      .pipe(
        tap((response) => this.handleAuthResponse(response)),
        catchError(this.handleError)
      );
  }

  register(userData: RegisterRequest): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(
        `${environment.apiUrl}${environment.auth.registerEndpoint}`,
        userData
      )
      .pipe(
        tap((response) => this.handleAuthResponse(response)),
        catchError((error) => {
          // Enhanced error handling for registration validation
          if (error.status === 400) {
            return throwError(
              () => new Error(error.error?.message || 'Validation failed')
            );
          }
          return this.handleError(error);
        })
      );
  }

  logout(): void {
    if (this.isBrowser) {
      localStorage.removeItem('currentUser');
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
    }
    this.currentUserSubject.next(null);
    this.tokenSubject.next(null);
  }

  refreshToken(refreshToken: string): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(
        `${environment.apiUrl}${environment.auth.refreshTokenEndpoint}`,
        { refreshToken }
      )
      .pipe(
        tap((response) => this.handleAuthResponse(response)),
        catchError(this.handleError)
      );
  }

  requestPasswordReset(email: RequestPasswordResetRequest): Observable<void> {
    return this.http
      .post<void>(
        `${environment.apiUrl}${environment.auth.passwordResetRequestEndpoint}`,
        email
      )
      .pipe(catchError(this.handleError));
  }

  resetPassword(resetData: ResetPasswordRequest): Observable<void> {
    return this.http
      .post<void>(
        `${environment.apiUrl}${environment.auth.passwordResetEndpoint}`,
        resetData
      )
      .pipe(catchError(this.handleError));
  }

  private handleAuthResponse(response: AuthResponse): void {
    if (!this.isBrowser) return;

    // if (response.token) {
    //   localStorage.setItem('token', response.token);
    //   if (response.refreshToken) {
    //     localStorage.setItem('refreshToken', response.refreshToken);
    //   }
    //   this.tokenSubject.next(response.token);
    // }
  }

  private handleError(error: any) {
    let errorMessage = 'An error occurred';
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = error.error.message;
    } else {
      // Server-side error
      errorMessage = error.error?.message || error.message || errorMessage;
    }
    return throwError(() => new Error(errorMessage));
  }

  get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  get tokenValue(): string | null {
    return this.tokenSubject.value;
  }

  isAuthenticated(): boolean {
    return !!this.tokenValue;
  }

  private getStorageItem(key: string): string | null {
    return this.isBrowser ? localStorage.getItem(key) : null;
  }

  private setStorageItem(key: string, value: string): void {
    if (this.isBrowser) {
      localStorage.setItem(key, value);
    }
  }

  private removeStorageItem(key: string): void {
    if (this.isBrowser) {
      localStorage.removeItem(key);
    }
  }
}
