import {
  Component,
  Input,
  OnInit,
  ViewChild,
  OnChanges,
  SimpleChanges,
  AfterViewInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { TranslocoModule, provideTranslocoScope } from '@jsverse/transloco';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';

import { CooperativeResponse } from '../../types';
import { CooperativeActions } from '../../store/actions';
import { ConfirmDialogComponent } from '../../components/shared/confirm-dialog/confirm-dialog.component';
import { TypeBadgeComponent } from '../../components/shared/type-badge/type-badge.component';
import { StatusBadgeComponent } from '../../components/shared/status-badge/status-badge.component';

@Component({
  selector: 'app-cooperative-table-view',
  templateUrl: './cooperative-table-view.component.html',
  styleUrls: ['./cooperative-table-view.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatSortModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    MatDialogModule,
    TranslocoModule,
    TypeBadgeComponent,
    StatusBadgeComponent,
  ],
  providers: [
    provideTranslocoScope({
      scope: 'cooperatives',
      alias: 'cooperative',
    }),
  ],
})
export class CooperativeTableViewComponent
  implements OnInit, OnChanges, AfterViewInit
{
  @Input() cooperatives: CooperativeResponse[] | null = [];
  @Input() loading = false;

  @ViewChild(MatSort) sort!: MatSort;

  dataSource = new MatTableDataSource<CooperativeResponse>([]);
  displayedColumns: string[] = [
    'name',
    'type',
    'status',
    'establishedDate',
    'contactPhone',
    'actions',
  ];

  constructor(
    private store: Store,
    private router: Router,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    // Initialize the mat table
    if (this.cooperatives) {
      this.dataSource.data = this.cooperatives;
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['cooperatives'] && this.cooperatives) {
      this.dataSource.data = this.cooperatives;

      if (this.sort) {
        this.dataSource.sort = this.sort;
      }
    }
  }

  ngAfterViewInit() {
    if (this.sort) {
      this.dataSource.sort = this.sort;
    }
  }

  viewCooperative(cooperative: CooperativeResponse): void {
    this.router.navigate(['/cooperatives', cooperative.id]);
  }

  editCooperative(cooperative: CooperativeResponse, event: Event): void {
    event.stopPropagation();
    // Select the cooperative and navigate to edit page
    this.store.dispatch(
      CooperativeActions.selectCooperative({ id: cooperative.id })
    );
    this.router.navigate(['/cooperatives/edit', cooperative.id]);
  }

  deleteCooperative(cooperative: CooperativeResponse, event: Event): void {
    event.stopPropagation();

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Delete Cooperative',
        message: `Are you sure you want to delete ${this.getCooperativeName(cooperative)}?`,
        confirmButton: 'Delete',
        cancelButton: 'Cancel',
        isDestructive: true,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result === true) {
        this.store.dispatch(
          CooperativeActions.deleteCooperative({ id: cooperative.id })
        );
      }
    });
  }

  getCooperativeName(cooperative: CooperativeResponse): string {
    if (!cooperative.translations || cooperative.translations.length === 0) {
      return 'Unnamed Cooperative';
    }

    // First try to find translation in default locale
    const defaultTranslation = cooperative.translations.find(
      (t) => t.locale === cooperative.defaultLocale
    );

    if (defaultTranslation) {
      return defaultTranslation.name;
    }

    // Fall back to first available translation
    return cooperative.translations[0].name;
  }
}
