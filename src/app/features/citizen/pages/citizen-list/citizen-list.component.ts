import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { CitizenFacade } from '../../store/citizen.facade';
import { CitizenSummaryResponse, CitizenSearchFilters } from '../../types';
import { CitizenUrlParamsService } from '../../services/citizen-url-params.service';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { provideTranslocoScope, TranslocoModule } from '@jsverse/transloco';
import { CommonModule } from '@angular/common';
import { CitizenTableComponent } from './components/citizen-table/citizen-table.component';
import { CitizenFilterComponent } from './components/citizen-filter/citizen-filter.component';

@Component({
  selector: 'app-citizen-list',
  templateUrl: './citizen-list.component.html',
  styleUrls: ['./citizen-list.component.scss'],
  imports: [
    MatIconModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    MatProgressSpinnerModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatChipsModule,
    MatMenuModule,
    MatDividerModule,
    MatExpansionModule,
    CommonModule,
    CitizenTableComponent,
    CitizenFilterComponent,
    TranslocoModule,
  ],
  providers: [
    provideTranslocoScope({
      scope: 'citizen-list',
      alias: 'citizen',
    }),
  ],
})
export class CitizenListComponent implements OnInit, OnDestroy {
  citizens$ = this.citizenFacade.citizens$;
  loading$ = this.citizenFacade.loading$;
  totalItems$ = this.citizenFacade.totalItems$;
  currentPage$ = this.citizenFacade.currentPage$;
  pageSize$ = this.citizenFacade.pageSize$;
  currentFilter$ = this.citizenFacade.currentFilter$;

  private destroy$ = new Subject<void>();

  constructor(
    private citizenFacade: CitizenFacade,
    private router: Router,
    private route: ActivatedRoute,
    private citizenUrlParamsService: CitizenUrlParamsService
  ) {}

  ngOnInit(): void {
    // Apply URL filters if present, otherwise load with default filters
    const urlParams = this.route.snapshot.queryParams;
    if (Object.keys(urlParams).length > 0) {
      this.citizenFacade.applyUrlFilters(urlParams);
    } else {
      this.citizenFacade.loadCitizens({
        page: 1,
        size: 10,
        sortBy: 'createdAt',
        sortDirection: 'DESC',
      });
    }
  }

  onFilterChange(filters: Partial<CitizenSearchFilters>): void {
    this.citizenFacade.filterChange(filters);
  }

  onPageChange(event: { pageIndex: number; pageSize: number }): void {
    this.citizenFacade.setPage(event.pageIndex, event.pageSize);
  }

  onCreateCitizen(): void {
    this.router.navigate(['/dashboard/citizens/create']);
  }

  onResetFilters(): void {
    this.citizenFacade.resetFilters();
  }

  onViewCitizen(citizen: CitizenSummaryResponse): void {
    if (citizen.id) {
      this.router.navigate(['/dashboard/citizens/view', citizen.id]);
    }
  }

  onEditCitizen(citizen: CitizenSummaryResponse): void {
    if (citizen.id) {
      this.router.navigate(['/dashboard/citizens/edit', citizen.id]);
    }
  }

  onRefresh(): void {
    this.citizenFacade.refreshCitizens();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
