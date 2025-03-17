import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface LoadingState {
  loading: boolean;
  error: string | null;
  timestamp: number;
}

@Injectable({
  providedIn: 'root',
})
export class LoadingStateService {
  private states = new Map<string, BehaviorSubject<LoadingState>>();

  private getStateSubject(key: string): BehaviorSubject<LoadingState> {
    if (!this.states.has(key)) {
      this.states.set(
        key,
        new BehaviorSubject<LoadingState>({
          loading: false,
          error: null,
          timestamp: Date.now(),
        })
      );
    }
    return this.states.get(key)!;
  }

  startLoading(key: string): void {
    this.getStateSubject(key).next({
      loading: true,
      error: null,
      timestamp: Date.now(),
    });
  }

  stopLoading(key: string, error?: string): void {
    this.getStateSubject(key).next({
      loading: false,
      error: error || null,
      timestamp: Date.now(),
    });
  }

  getLoadingState(key: string): Observable<LoadingState> {
    return this.getStateSubject(key).asObservable();
  }

  isLoading(key: string): Observable<boolean> {
    return new Observable<boolean>((subscriber) => {
      this.getLoadingState(key).subscribe((state) => {
        subscriber.next(state.loading);
      });
    });
  }

  clearState(key: string): void {
    this.states.delete(key);
  }

  clearAll(): void {
    this.states.clear();
  }
}
