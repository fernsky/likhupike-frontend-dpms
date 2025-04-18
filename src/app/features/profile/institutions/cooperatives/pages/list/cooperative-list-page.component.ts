import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { TranslocoModule, provideTranslocoScope } from '@jsverse/transloco';

import {
  CooperativeResponse,
  CooperativeType,
  CooperativeStatus,
} from '../../types';
import {
  CooperativeActions,
  CooperativeSearchActions,
  CooperativeUIActions,
} from '../../store/actions';
import * as fromCooperatives from '../../store/selectors';
import { SearchMethod } from '../../store/state';

import { CooperativeTableViewComponent } from '../../components/views/cooperative-table-view.component';
import { CooperativeGridViewComponent } from '../../components/views/cooperative-grid-view/cooperative-grid-view.component';
import { CooperativeMapViewComponent } from '../../components/views/cooperative-map-view/cooperative-map-view.component';
import { CooperativeSearchComponent } from '../../components/search/cooperative-search.component';
import { CooperativeTypeFilterComponent } from '../../components/filters/cooperative-type-filter/cooperative-type-filter.component';

@Component({
  selector: 'app-cooperative-list-page',
  templateUrl: './cooperative-list-page.component.html',
  styleUrls: ['./cooperative-list-page.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatButtonToggleModule,
    MatProgressSpinnerModule,
    MatPaginatorModule,
    TranslocoModule,
    CooperativeTableViewComponent,
    CooperativeGridViewComponent,
    CooperativeMapViewComponent,
    CooperativeSearchComponent,
    CooperativeTypeFilterComponent,
  ],
  providers: [
    provideTranslocoScope({
      scope: 'cooperatives',
      alias: 'cooperative',
    }),
  ],
})
export class CooperativeListPageComponent implements OnInit, OnDestroy {
  cooperatives$: Observable<CooperativeResponse[]>;
  loading$: Observable<boolean>;
  totalItems$: Observable<number>;
  currentPage$: Observable<number>;
  pageSize$: Observable<number>;
  searchTerm$: Observable<string | undefined>;
  activeSearchMethod$: Observable<SearchMethod>;

  displayModes = ['grid', 'table', 'map'];
  currentDisplayMode = 'table';

  private destroy$ = new Subject<void>();

  constructor(private store: Store) {
    this.cooperatives$ = this.store.select(
      fromCooperatives.selectAllCooperatives
    );
    this.loading$ = this.store.select(
      fromCooperatives.selectCooperativesLoading
    );
    this.totalItems$ = this.store.select(
      fromCooperatives.selectSearchTotalResults
    );
    this.currentPage$ = this.store.select(fromCooperatives.selectSearchPage);
    this.pageSize$ = this.store.select(fromCooperatives.selectSearchPageSize);
    this.searchTerm$ = this.store.select(fromCooperatives.selectSearchTerm);
    this.activeSearchMethod$ = this.store.select(
      fromCooperatives.selectActiveSearchMethod
    );
  }

  ngOnInit(): void {
    // Fetch initial data or restore from URL query params
    this.store.dispatch(CooperativeUIActions.syncUrlToState());

    // Load statistics for filters
    this.store.dispatch(CooperativeSearchActions.getStatisticsByType());
    this.store.dispatch(CooperativeSearchActions.getStatisticsByWard());

    // Watch active search method to load appropriate data
    this.activeSearchMethod$
      .pipe(takeUntil(this.destroy$))
      .subscribe((method) => {
        if (method === SearchMethod.None) {
          this.loadDefaultCooperatives();
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadDefaultCooperatives(): void {
    this.store.dispatch(
      CooperativeActions.loadCooperatives({
        page: 0,
        size: 10,
      })
    );
  }

  onSearch(searchTerm: string): void {
    if (searchTerm.trim()) {
      this.store.dispatch(
        CooperativeSearchActions.searchByName({
          nameQuery: searchTerm,
          page: 0,
          size: 10,
        })
      );
    } else {
      this.resetSearch();
    }
  }

  onFilterByType(type: CooperativeType): void {
    this.store.dispatch(
      CooperativeSearchActions.getByType({
        cooperativeType: type,
        page: 0,
        size: 10,
      })
    );
  }

  onFilterByStatus(status: CooperativeStatus): void {
    this.store.dispatch(
      CooperativeSearchActions.getByStatus({
        status,
        page: 0,
        size: 10,
      })
    );
  }

  onPageChange(event: PageEvent): void {
    this.store.dispatch(
      CooperativeSearchActions.setSearchPage({
        page: event.pageIndex,
      })
    );
  }

  onCreateCooperative(): void {
    this.store.dispatch(CooperativeUIActions.openCreateDialog());
  }

  resetSearch(): void {
    this.store.dispatch(CooperativeSearchActions.resetFilters());
    this.loadDefaultCooperatives();
  }

  changeDisplayMode(mode: string): void {
    this.currentDisplayMode = mode;

    // For map view, ensure we have geographic data
    if (mode === 'map') {
      // Optionally dispatch action to load geo-specific data
    }
  }
}
