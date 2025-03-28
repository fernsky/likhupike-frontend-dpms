import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { AuthUser } from '../store/auth/auth.types';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  private readonly TOKEN_KEY = 'auth_token';
  private readonly REFRESH_TOKEN_KEY = 'auth_refresh_token';
  private readonly USER_KEY = 'auth_user';
  private readonly TOKEN_EXPIRY_KEY = 'auth_token_expiry';
  private isBrowser: boolean;

  constructor(@Inject(PLATFORM_ID) private platformId: object) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  setToken(token: string): void {
    if (!this.isBrowser) return;
    try {
      localStorage.setItem(this.TOKEN_KEY, token);
      const expiry = new Date().getTime() + 24 * 60 * 60 * 1000;
      localStorage.setItem(this.TOKEN_EXPIRY_KEY, expiry.toString());
    } catch (e) {
      console.warn('LocalStorage not available:', e);
    }
  }

  getToken(): string | null {
    if (!this.isBrowser) return null;
    try {
      const token = localStorage.getItem(this.TOKEN_KEY);
      const expiry = localStorage.getItem(this.TOKEN_EXPIRY_KEY);

      if (!token || !expiry) {
        return null;
      }

      if (new Date().getTime() > parseInt(expiry, 10)) {
        this.clearAuth();
        return null;
      }

      return token;
    } catch (e) {
      console.warn('LocalStorage not available:', e);
      return null;
    }
  }

  setRefreshToken(refreshToken: string): void {
    if (!this.isBrowser) return;
    try {
      localStorage.setItem(this.REFRESH_TOKEN_KEY, refreshToken);
    } catch (e) {
      console.warn('LocalStorage not available:', e);
    }
  }

  getRefreshToken(): string | null {
    if (!this.isBrowser) return null;
    try {
      return localStorage.getItem(this.REFRESH_TOKEN_KEY);
    } catch (e) {
      console.warn('LocalStorage not available:', e);
      return null;
    }
  }

  setUser(user: AuthUser): void {
    if (!this.isBrowser) return;
    try {
      localStorage.setItem(this.USER_KEY, JSON.stringify(user));
    } catch (e) {
      console.warn('LocalStorage not available:', e);
    }
  }

  getUser(): AuthUser | null {
    if (!this.isBrowser) return null;
    try {
      const userStr = localStorage.getItem(this.USER_KEY);
      return userStr ? JSON.parse(userStr) : null;
    } catch (e) {
      console.warn('LocalStorage not available:', e);
      this.clearAuth();
      return null;
    }
  }

  clearAuth(): void {
    if (!this.isBrowser) return;
    try {
      localStorage.removeItem(this.TOKEN_KEY);
      localStorage.removeItem(this.TOKEN_EXPIRY_KEY);
      localStorage.removeItem(this.REFRESH_TOKEN_KEY);
      localStorage.removeItem(this.USER_KEY);
    } catch (e) {
      console.warn('LocalStorage not available:', e);
    }
  }

  hasStoredAuth(): boolean {
    if (!this.isBrowser) return false;
    try {
      const token = this.getToken(); // This will check expiry
      const refreshToken = this.getRefreshToken();
      const user = this.getUser();
      return !!token && !!refreshToken && !!user;
    } catch (e) {
      console.warn('LocalStorage not available:', e);
      return false;
    }
  }
}
