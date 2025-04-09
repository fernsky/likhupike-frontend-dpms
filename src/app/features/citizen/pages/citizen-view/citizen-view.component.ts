import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import {
  provideTranslocoScope,
  TranslocoModule,
  TranslocoService,
} from '@jsverse/transloco';
import { Observable, Subject, takeUntil } from 'rxjs';
import { CitizenFacade } from '../../store/citizen.facade';
import { CitizenResponse, CitizenState } from '../../types';
import { ConfirmDialogComponent } from '@app/shared/components/confirm-dialog/confirm-dialog.component';

// Material imports
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatTabsModule } from '@angular/material/tabs';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CitizenAddressComponent } from './components/citizen-address/citizen-address.component';
import { CitizenDocumentsComponent } from './components/citizen-documents/citizen-documents.component';
import { CitizenInfoComponent } from './components/citizen-info/citizen-info.component';
import { CitizenStatusComponent } from './components/citizen-status/citizen-status.component';

@Component({
  selector: 'app-citizen-view',
  templateUrl: './citizen-view.component.html',
  styleUrls: ['./citizen-view.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    TranslocoModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    MatTabsModule,
    MatProgressSpinnerModule,
    CitizenStatusComponent,
    CitizenInfoComponent,
    CitizenDocumentsComponent,
    CitizenAddressComponent,
  ],
  providers: [
    provideTranslocoScope({
      scope: 'citizen-view',
      alias: 'citizen',
    }),
  ],
})
export class CitizenViewComponent implements OnInit, OnDestroy {
  citizen$: Observable<CitizenResponse | null> =
    this.citizenFacade.selectedCitizen$;
  loading$: Observable<boolean> = this.citizenFacade.loadingSelected$;
  processing$: Observable<boolean> = this.citizenFacade.isProcessingAny$;
  approving$: Observable<boolean> = this.citizenFacade.approving$;
  deleting$: Observable<boolean> = this.citizenFacade.deleting$;

  private citizenId: string | null = null;
  private destroy$ = new Subject<void>();

  constructor(
    private citizenFacade: CitizenFacade,
    private route: ActivatedRoute,
    private router: Router,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private transloco: TranslocoService
  ) {}

  ngOnInit(): void {
    // Get citizen ID from route params
    this.route.paramMap.pipe(takeUntil(this.destroy$)).subscribe((params) => {
      const id = params.get('id');
      if (id) {
        this.citizenId = id;
        this.citizenFacade.loadCitizen(id);
      } else {
        this.handleError('citizen.errors.idNotProvided');
        this.navigateToList();
      }
    });
  }

  onEdit(): void {
    if (this.citizenId) {
      this.router.navigate(['/dashboard/citizens/edit', this.citizenId]);
    }
  }

  onBack(): void {
    this.navigateToList();
  }

  onApproveCitizen(): void {
    // Confirm before approving
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: this.transloco.translate('citizen.dialogs.approve.title'),
        message: this.transloco.translate('citizen.dialogs.approve.message'),
        confirmButton: this.transloco.translate(
          'citizen.dialogs.approve.confirmButton'
        ),
        cancelButton: this.transloco.translate('common.actions.cancel'),
      },
    });

    dialogRef
      .afterClosed()
      .pipe(takeUntil(this.destroy$))
      .subscribe((result) => {
        if (result && this.citizenId) {
          this.citizenFacade.approveCitizen(this.citizenId);
        }
      });
  }

  onChangeState(state: CitizenState, note?: string): void {
    if (this.citizenId) {
      this.citizenFacade.updateCitizenState(this.citizenId, { state, note });
    }
  }

  onDeleteCitizen(): void {
    // Confirm before deleting
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: this.transloco.translate('citizen.dialogs.delete.title'),
        message: this.transloco.translate('citizen.dialogs.delete.message'),
        confirmButton: this.transloco.translate(
          'citizen.dialogs.delete.confirmButton'
        ),
        cancelButton: this.transloco.translate('common.actions.cancel'),
        color: 'warn',
      },
    });

    dialogRef
      .afterClosed()
      .pipe(takeUntil(this.destroy$))
      .subscribe((result) => {
        if (result && this.citizenId) {
          this.citizenFacade.deleteCitizen(this.citizenId);

          // Subscribe to delete success to navigate back to list
          this.citizenFacade.deleteSuccess$
            .pipe(takeUntil(this.destroy$))
            .subscribe((success) => {
              if (success) {
                this.navigateToList();
              }
            });
        }
      });
  }

  private navigateToList(): void {
    this.router.navigate(['/dashboard/citizens/list']);
  }

  private handleError(messageKey: string): void {
    this.snackBar.open(
      this.transloco.translate(messageKey),
      this.transloco.translate('common.actions.close'),
      { duration: 5000, panelClass: ['error-snackbar'] }
    );
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    // Clear selected citizen when leaving the view
    this.citizenFacade.clearSelectedCitizen();
  }
}
