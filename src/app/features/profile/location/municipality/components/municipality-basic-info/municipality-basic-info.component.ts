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

import { MunicipalityResponse, UpdateMunicipalityInfoDto } from '../../types';
import { MunicipalityFacade } from '../../store/municipality.facade';

@Component({
  selector: 'app-municipality-basic-info',
  templateUrl: './municipality-basic-info.component.html',
  styleUrls: ['./municipality-basic-info.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TranslocoModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule
  ]
})
export class MunicipalityBasicInfoComponent implements OnInit, OnChanges, OnDestroy {
  @Input() municipality: MunicipalityResponse | null = null;
  @Input() updating = false;
  
  basicInfoForm: FormGroup;
  private destroy$ = new Subject<void>();
  
  constructor(
    private fb: FormBuilder,
    private municipalityFacade: MunicipalityFacade
  ) {
    this.basicInfoForm = this.createForm();
  }

  ngOnInit(): void {
    // Listen for form changes to mark fields as dirty
    this.basicInfoForm.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        if (this.basicInfoForm.dirty) {
          const dirtyControls = Object.keys(this.basicInfoForm.controls)
            .filter(key => this.basicInfoForm.get(key)?.dirty);
            
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
      name: ['', [Validators.required, Validators.maxLength(100)]],
      province: ['', [Validators.required, Validators.maxLength(100)]],
      district: ['', [Validators.required, Validators.maxLength(100)]],
    });
  }
  
  private updateForm(municipality: MunicipalityResponse): void {
    this.basicInfoForm.patchValue({
      name: municipality.name,
      province: municipality.province,
      district: municipality.district,
    }, { emitEvent: false });
    
    this.basicInfoForm.markAsPristine();
    this.municipalityFacade.clearDirtyFields();
  }
  
  onSubmit(): void {
    if (this.basicInfoForm.valid && this.basicInfoForm.dirty) {
      const updateData: UpdateMunicipalityInfoDto = {
        name: this.basicInfoForm.get('name')?.value,
        province: this.basicInfoForm.get('province')?.value,
        district: this.basicInfoForm.get('district')?.value,
      };
      
      this.municipalityFacade.updateMunicipalityInfo(updateData);
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
