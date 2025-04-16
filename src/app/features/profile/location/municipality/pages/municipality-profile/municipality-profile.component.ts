import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Observable, Subject } from 'rxjs';
import { take } from 'rxjs/operators';
import { TranslocoModule, TranslocoService, provideTranslocoScope } from '@jsverse/transloco';

// Material imports
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTabsModule } from '@angular/material/tabs';

// App imports
import { MunicipalityFacade } from '../../store/municipality.facade';
import { MunicipalityResponse, CreateMunicipalityDto } from '../../types';
import { CanComponentDeactivate } from '@app/core/guards/unsaved-changes.guard';
import { ConfirmDialogComponent } from '@app/shared/components/confirm-dialog/confirm-dialog.component';
import { PageTitleComponent } from '@app/shared/components/page-title/page-title.component';
import { MunicipalityBasicInfoComponent } from '../../components/municipality-basic-info/municipality-basic-info.component';
import { MunicipalityGeoInfoComponent } from '../../components/municipality-geo-info/municipality-geo-info.component';
import { FormSectionComponent } from '@app/shared/components/form-section/form-section.component';

@Component({
  selector: 'app-municipality-profile',
  templateUrl: './municipality-profile.component.html',
  styleUrls: ['./municipality-profile.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TranslocoModule,
    // Material modules
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatTabsModule,
    // App components
    PageTitleComponent,
    MunicipalityBasicInfoComponent,
    MunicipalityGeoInfoComponent,
    FormSectionComponent,
  ],
  providers: [
    provideTranslocoScope({
      scope: 'municipality-profile',
      alias: 'municipality',
    }),
  ],
})
export class MunicipalityProfileComponent implements OnInit, OnDestroy, CanComponentDeactivate {
  municipality$: Observable<MunicipalityResponse | null> = this.municipalityFacade.municipality$;
  hasMunicipality$: Observable<boolean> = this.municipalityFacade.hasMunicipality$;
  wardsCount$: Observable<number> = this.municipalityFacade.wardsCount$;
  loading$: Observable<boolean> = this.municipalityFacade.loading$;
  creating$: Observable<boolean> = this.municipalityFacade.creating$;
  isProcessing$: Observable<boolean> = this.municipalityFacade.isProcessing$;
  hasUnsavedChanges$: Observable<boolean> = this.municipalityFacade.hasUnsavedChanges$;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  errors$: Observable<any> = this.municipalityFacade.errors$;

  selectedTabIndex = 0;
  
  private destroy$ = new Subject<void>();

  constructor(
    private municipalityFacade: MunicipalityFacade,
    private dialog: MatDialog,
    private transloco: TranslocoService
  ) {}

  ngOnInit(): void {
    // Load municipality data
    this.municipalityFacade.loadMunicipality();
    
    // Removed the auto-popup dialog code that was here
  }

  canDeactivate(): Observable<boolean> | boolean {
    let hasChanges = false;
    
    // Check if there are unsaved changes
    this.hasUnsavedChanges$
      .pipe(take(1))
      .subscribe(changes => hasChanges = changes);
      
    if (!hasChanges) {
      return true;
    }

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: this.transloco.translate('common.dialogs.unsavedChanges.title'),
        message: this.transloco.translate('common.dialogs.unsavedChanges.message'),
        confirmButton: this.transloco.translate('common.dialogs.unsavedChanges.confirmButton'),
        cancelButton: this.transloco.translate('common.dialogs.unsavedChanges.cancelButton'),
      },
    });

    return dialogRef.afterClosed();
  }

  onTabChanged(tabIndex: number): void {
    this.selectedTabIndex = tabIndex;
    
    // Reset any form changes when changing tabs
    this.municipalityFacade.clearDirtyFields();
  }
  
  showCreateMunicipalityDialog(): void {
    // Create municipality directly with default values without asking
    const defaultMunicipality: CreateMunicipalityDto = {
      name: this.transloco.translate('municipality.defaults.name'),
      province: this.transloco.translate('municipality.defaults.province'),
      district: this.transloco.translate('municipality.defaults.district'),
      rightmostLatitude: 85.4,
      leftmostLatitude: 85.1,
      bottommostLongitude: 27.1,
      topmostLongitude: 27.4,
      lowestAltitude: 1000,
      highestAltitude: 2000,
      areaInSquareKilometers: 150
    };
    
    this.municipalityFacade.createMunicipality(defaultMunicipality);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
