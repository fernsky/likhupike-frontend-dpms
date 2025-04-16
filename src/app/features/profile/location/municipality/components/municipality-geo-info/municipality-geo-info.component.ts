import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { TranslocoModule } from '@jsverse/transloco';

// Material imports
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { MunicipalityResponse, UpdateMunicipalityGeoLocationDto } from '../../types';
import { MunicipalityFacade } from '../../store/municipality.facade';
import { BaseButtonComponent } from '@app/shared/components/base-button/base-button.component';

@Component({
  selector: 'app-municipality-geo-info',
  templateUrl: './municipality-geo-info.component.html',
  styleUrls: ['./municipality-geo-info.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TranslocoModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    BaseButtonComponent
  ]
})
export class MunicipalityGeoInfoComponent implements OnInit, OnChanges, OnDestroy {
  @Input() municipality: MunicipalityResponse | null = null;
  @Input() updating = false;
  
  geoInfoForm: FormGroup;
  private destroy$ = new Subject<void>();
  
  constructor(
    private fb: FormBuilder,
    private municipalityFacade: MunicipalityFacade
  ) {
    this.geoInfoForm = this.createForm();
  }

  ngOnInit(): void {
    // Listen for form changes to mark fields as dirty
    this.geoInfoForm.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        if (this.geoInfoForm.dirty) {
          const dirtyControls = Object.keys(this.geoInfoForm.controls)
            .filter(key => this.geoInfoForm.get(key)?.dirty);
            
          dirtyControls.forEach(control => {
            this.municipalityFacade.markFieldDirty(control);
          });
          
          this.municipalityFacade.setUnsavedChanges(true);
        }
      });
  }
  
  ngOnChanges(changes: SimpleChanges): void {
    // Update form when municipality data changes
    if (changes['municipality'] && this.municipality) {
      this.updateForm(this.municipality);
    }
  }
  
  private createForm(): FormGroup {
    return this.fb.group({
      rightmostLatitude: [0, [Validators.required, Validators.min(-90), Validators.max(90)]],
      leftmostLatitude: [0, [Validators.required, Validators.min(-90), Validators.max(90)]],
      bottommostLongitude: [0, [Validators.required, Validators.min(-180), Validators.max(180)]],
      topmostLongitude: [0, [Validators.required, Validators.min(-180), Validators.max(180)]],
      lowestAltitude: [null, [Validators.min(0)]],
      highestAltitude: [null, [Validators.min(0)]],
      areaInSquareKilometers: [0, [Validators.required, Validators.min(0.1)]],
    });
  }
  
  private updateForm(municipality: MunicipalityResponse): void {
    this.geoInfoForm.patchValue({
      rightmostLatitude: municipality.rightmostLatitude,
      leftmostLatitude: municipality.leftmostLatitude,
      bottommostLongitude: municipality.bottommostLongitude,
      topmostLongitude: municipality.topmostLongitude,
      lowestAltitude: municipality.lowestAltitude,
      highestAltitude: municipality.highestAltitude,
      areaInSquareKilometers: municipality.areaInSquareKilometers,
    }, { emitEvent: false });
    
    this.geoInfoForm.markAsPristine();
    this.municipalityFacade.clearDirtyFields();
  }
  
  onSubmit(): void {
    if (this.geoInfoForm.valid && this.geoInfoForm.dirty) {
      const updateData: UpdateMunicipalityGeoLocationDto = {
        rightmostLatitude: this.geoInfoForm.get('rightmostLatitude')?.value,
        leftmostLatitude: this.geoInfoForm.get('leftmostLatitude')?.value,
        bottommostLongitude: this.geoInfoForm.get('bottommostLongitude')?.value,
        topmostLongitude: this.geoInfoForm.get('topmostLongitude')?.value,
        lowestAltitude: this.geoInfoForm.get('lowestAltitude')?.value,
        highestAltitude: this.geoInfoForm.get('highestAltitude')?.value,
        areaInSquareKilometers: this.geoInfoForm.get('areaInSquareKilometers')?.value,
      };
      
      this.municipalityFacade.updateMunicipalityGeoLocation(updateData);
    }
  }
  
  onReset(): void {
    if (this.municipality) {
      this.updateForm(this.municipality);
    }
  }
  
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
