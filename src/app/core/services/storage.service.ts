import { Injectable } from '@angular/core';
import { AuthUser } from '../store/auth/auth.types';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  private readonly TOKEN_KEY = 'auth_token';
  private readonly REFRESH_TOKEN_KEY = 'auth_refresh_token';
  private readonly USER_KEY = 'auth_user';
  private readonly TOKEN_EXPIRY_KEY = 'auth_token_expiry';

  setToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
    // Set token expiry to 24 hours from now
    const expiry = new Date().getTime() + 24 * 60 * 60 * 1000;
    localStorage.setItem(this.TOKEN_EXPIRY_KEY, expiry.toString());
  }

  getToken(): string | null {
    const token = localStorage.getItem(this.TOKEN_KEY);
    const expiry = localStorage.getItem(this.TOKEN_EXPIRY_KEY);

    if (!token || !expiry) {
      return null;
    }

    // Check if token has expired
    if (new Date().getTime() > parseInt(expiry, 10)) {
      this.clearAuth();
      return null;
    }

    return token;
  }

  setRefreshToken(refreshToken: string): void {
    localStorage.setItem(this.REFRESH_TOKEN_KEY, refreshToken);
  }

  getRefreshToken(): string | null {
    return localStorage.getItem(this.REFRESH_TOKEN_KEY);
  }

  setUser(user: AuthUser): void {
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
  }

  getUser(): AuthUser | null {
    const userStr = localStorage.getItem(this.USER_KEY);
    try {
      return userStr ? JSON.parse(userStr) : null;
    } catch {
      this.clearAuth();
      return null;
    }
  }

  removeToken(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.TOKEN_EXPIRY_KEY);
  }

  removeRefreshToken(): void {
    localStorage.removeItem(this.REFRESH_TOKEN_KEY);
  }

  removeUser(): void {
    localStorage.removeItem(this.USER_KEY);
  }

  clearAuth(): void {
    this.removeToken();
    this.removeRefreshToken();
    this.removeUser();
  }

  hasStoredAuth(): boolean {
    const token = this.getToken(); // This will check expiry
    const refreshToken = this.getRefreshToken();
    const user = this.getUser();
    return !!token && !!refreshToken && !!user;
  }
}
