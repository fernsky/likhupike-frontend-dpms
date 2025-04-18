import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, Subject, combineLatest } from 'rxjs';
import { filter, map, takeUntil } from 'rxjs/operators';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import {
  TranslocoModule,
  TranslocoService,
  provideTranslocoScope,
} from '@jsverse/transloco';

import { CooperativeResponse } from '../../types';
import {
  CooperativeActions,
  CooperativeTranslationActions,
  CooperativeMediaActions,
} from '../../store/actions';
import * as fromCooperatives from '../../store/selectors';
import { ConfirmDialogComponent } from '../../components/shared/confirm-dialog/confirm-dialog.component';
import { TypeBadgeComponent } from '../../components/shared/type-badge/type-badge.component';
import { StatusBadgeComponent } from '../../components/shared/status-badge/status-badge.component';
import { CooperativeBasicFormComponent } from '../../components/forms/cooperative-basic-form/cooperative-basic-form.component';
import { CooperativeTranslationsComponent } from '../../components/translations/cooperative-translations.component';
import { CooperativeMediaComponent } from '../../components/media/cooperative-media.component';
import { CooperativeLocationComponent } from '../../components/location/cooperative-location.component';

@Component({
  selector: 'app-cooperative-edit-page',
  templateUrl: './cooperative-edit-page.component.html',
  styleUrls: ['./cooperative-edit-page.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatTabsModule,
    MatTooltipModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    TranslocoModule,
    TypeBadgeComponent,
    StatusBadgeComponent,
    CooperativeBasicFormComponent,
    CooperativeTranslationsComponent,
    CooperativeMediaComponent,
    CooperativeLocationComponent,
  ],
  providers: [
    provideTranslocoScope({
      scope: 'cooperatives',
      alias: 'cooperative',
    }),
  ],
})
export class CooperativeEditPageComponent implements OnInit, OnDestroy {
  cooperative$: Observable<CooperativeResponse | null>;
  loading$: Observable<boolean>;
  hasUnsavedChanges$: Observable<boolean>;

  activeTabIndex = 0;
  cooperativeId!: string;

  private destroy$ = new Subject<void>();

  constructor(
    private store: Store,
    private route: ActivatedRoute,
    protected router: Router,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private transloco: TranslocoService
  ) {
    this.cooperative$ = this.store.select(
      fromCooperatives.selectSelectedCooperative
    );
    this.loading$ = combineLatest([
      this.store.select(fromCooperatives.selectCooperativesLoading),
      this.store.select(fromCooperatives.selectTranslationsLoading),
      this.store.select(fromCooperatives.selectMediaLoading),
    ]).pipe(
      map(
        ([cooperativeLoading, translationLoading, mediaLoading]) =>
          cooperativeLoading || translationLoading || mediaLoading
      )
    );
    this.hasUnsavedChanges$ = combineLatest([
      this.store.select(fromCooperatives.selectCooperativeHasUnsavedChanges),
      this.store.select(fromCooperatives.selectTranslationHasUnsavedChanges),
    ]).pipe(
      map(
        ([cooperativeChanges, translationChanges]) =>
          cooperativeChanges || translationChanges
      )
    );
  }

  ngOnInit(): void {
    // Get cooperative ID from route
    this.route.paramMap
      .pipe(
        map((params) => params.get('id')),
        filter((id) => !!id),
        takeUntil(this.destroy$)
      )
      .subscribe((id) => {
        if (id) {
          this.cooperativeId = id;

          // Fetch the cooperative
          this.store.dispatch(CooperativeActions.loadCooperative({ id }));
          this.store.dispatch(
            CooperativeTranslationActions.loadTranslations({
              cooperativeId: id,
            })
          );
          this.store.dispatch(
            CooperativeMediaActions.loadMedia({
              cooperativeId: id,
              page: 0,
              size: 10,
            })
          );

          // Select the cooperative in the store
          this.store.dispatch(CooperativeActions.selectCooperative({ id }));
        }
      });

    // Get active tab from query params
    this.route.queryParamMap
      .pipe(takeUntil(this.destroy$))
      .subscribe((params) => {
        const tab = params.get('tab');
        if (tab) {
          this.activeTabIndex = parseInt(tab, 10) || 0;
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onTabChanged(tabIndex: number): void {
    this.activeTabIndex = tabIndex;

    // Update URL to preserve tab state
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { tab: tabIndex },
      queryParamsHandling: 'merge',
    });
  }

  onSaveChanges(): void {
    this.cooperative$
      .pipe(
        filter((cooperative) => !!cooperative),
        takeUntil(this.destroy$)
      )
      .subscribe((cooperative) => {
        if (!cooperative) return;

        // Here you would save any pending changes based on active tab
        switch (this.activeTabIndex) {
          case 0: // Basic info tab
            // Example: Dispatch an update action with form values
            // this.store.dispatch(CooperativeActions.updateCooperative({
            //   id: cooperative.id,
            //   cooperative: this.basicInfoForm.value
            // }));
            break;

          case 1: // Translations tab
            // Handle translation save
            break;

          case 2: // Media tab
            // Handle media changes
            break;

          default:
            console.warn('Unknown tab index:', this.activeTabIndex);
        }
      });
  }

  onDeleteCooperative(): void {
    this.cooperative$
      .pipe(
        filter((cooperative) => !!cooperative),
        takeUntil(this.destroy$)
      )
      .subscribe((cooperative) => {
        if (!cooperative) return;

        const dialogRef = this.dialog.open(ConfirmDialogComponent, {
          data: {
            title: this.transloco.translate('cooperative.dialogs.deleteTitle'),
            message: this.transloco.translate(
              'cooperative.dialogs.deleteMessage',
              {
                name: this.getCooperativeName(cooperative),
              }
            ),
            confirmButton: this.transloco.translate('common.actions.delete'),
            cancelButton: this.transloco.translate('common.actions.cancel'),
          },
        });

        dialogRef.afterClosed().subscribe((result) => {
          if (result === true) {
            this.store.dispatch(
              CooperativeActions.deleteCooperative({
                id: cooperative.id,
              })
            );

            // Navigation will be handled by effect after successful deletion
          }
        });
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
