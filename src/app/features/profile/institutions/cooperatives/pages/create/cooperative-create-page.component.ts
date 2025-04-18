import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslocoService } from '@jsverse/transloco';

import { 
  ContentStatus, 
  CooperativeStatus, 
  CooperativeType, 
  CreateCooperativeDto 
} from '../../types';
import { CooperativeActions } from '../../store/actions';
import * as fromCooperatives from '../../store/selectors';

@Component({
  selector: 'app-cooperative-create-page',
  templateUrl: './cooperative-create-page.component.html',
  styleUrls: ['./cooperative-create-page.component.scss']
})
export class CooperativeCreatePageComponent implements OnInit, OnDestroy {
  createForm!: FormGroup;
  cooperativeTypes = Object.values(CooperativeType);
  cooperativeStatuses = Object.values(CooperativeStatus);
  contentStatuses = Object.values(ContentStatus);
  
  loading$: Observable<boolean>;
  createError$: Observable<any>;
  
  activeStep = 0;
  steps = [
    { title: 'basicInfo', completed: false },
    { title: 'translations', completed: false },
    { title: 'location', completed: false },
    { title: 'review', completed: false }
  ];
  
  availableLocales = ['en', 'ne']; // Available locales
  
  private destroy$ = new Subject<void>();
  
  constructor(
    private fb: FormBuilder,
    private store: Store,
    private router: Router,
    private snackBar: MatSnackBar,
    private transloco: TranslocoService
  ) {
    this.loading$ = this.store.select(fromCooperatives.selectCooperativeCreating);
    this.createError$ = this.store.select(fromCooperatives.selectCooperativeErrors);
  }

  ngOnInit(): void {
    this.initForm();
    
    // Watch for successful creation and navigate to edit
    this.store.select(fromCooperatives.selectCooperativeCreateSuccess)
      .pipe(takeUntil(this.destroy$))
      .subscribe(success => {
        if (success) {
          this.store.select(fromCooperatives.selectSelectedCooperative)
            .pipe(takeUntil(this.destroy$))
            .subscribe(cooperative => {
              if (cooperative) {
                this.snackBar.open(
                  this.transloco.translate('cooperative.messages.createSuccess'),
                  this.transloco.translate('common.actions.ok'),
                  { duration: 5000 }
                );
                this.router.navigate(['/cooperatives/edit', cooperative.id]);
              }
            });
        }
      });
    
    // Watch for errors
    this.createError$
      .pipe(takeUntil(this.destroy$))
      .subscribe(error => {
        if (error) {
          this.snackBar.open(
            this.transloco.translate('cooperative.messages.createError'),
            this.transloco.translate('common.actions.close'),
            { duration: 5000, panelClass: 'error-snackbar' }
          );
        }
      });
  }
  
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
  
  private initForm(): void {
    this.createForm = this.fb.group({
      // Basic information
      code: ['', [Validators.required, Validators.pattern('^[a-z0-9-]+$')]],
      defaultLocale: ['en', Validators.required],
      establishedDate: [null],
      ward: [null, Validators.required],
      type: ['', Validators.required],
      status: [CooperativeStatus.ACTIVE, Validators.required],
      registrationNumber: [''],
      contactEmail: ['', Validators.email],
      contactPhone: [''],
      websiteUrl: ['', Validators.pattern('https?://.+')],
      
      // GeoPoint
      point: this.fb.group({
        longitude: [null, [Validators.min(-180), Validators.max(180)]],
        latitude: [null, [Validators.min(-90), Validators.max(90)]]
      }),
      
      // Translation
      translation: this.fb.group({
        locale: ['en', Validators.required],
        name: ['', [Validators.required, Validators.maxLength(100)]],
        description: [''],
        location: [''],
        services: [''],
        achievements: [''],
        operatingHours: [''],
        seoTitle: ['', Validators.maxLength(60)],
        seoDescription: ['', Validators.maxLength(160)],
        seoKeywords: [''],
        slugUrl: [''],
        status: [ContentStatus.DRAFT],
        structuredData: [''],
        metaRobots: ['']
      })
    });
    
    // When defaultLocale changes, update translation locale
    this.createForm.get('defaultLocale')?.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(locale => {
        this.createForm.get('translation.locale')?.setValue(locale);
      });
  }
  
  nextStep(): void {
    switch (this.activeStep) {
      case 0: // Basic info
        if (this.validateBasicInfo()) {
          this.steps[0].completed = true;
          this.activeStep = 1;
        }
        break;
      case 1: // Translation
        if (this.validateTranslation()) {
          this.steps[1].completed = true;
          this.activeStep = 2;
        }
        break;
      case 2: // Location
        if (this.validateLocation()) {
          this.steps[2].completed = true;
          this.activeStep = 3;
        }
        break;
      default:
        break;
    }
  }
  
  previousStep(): void {
    if (this.activeStep > 0) {
      this.activeStep--;
    }
  }
  
  goToStep(stepIndex: number): void {
    // Only allow going to completed steps or the next uncompleted one
    if (
      this.steps[stepIndex].completed || 
      stepIndex === this.activeStep ||
      (stepIndex < this.steps.length && this.steps[stepIndex - 1]?.completed)
    ) {
      this.activeStep = stepIndex;
    }
  }
  
  private validateBasicInfo(): boolean {
    const basicControls = [
      'code',
      'defaultLocale',
      'ward',
      'type',
      'status',
    ];
    
    let valid = true;
    
    basicControls.forEach(controlName => {
      const control = this.createForm.get(controlName);
      if (control) {
        control.markAsTouched();
        if (control.invalid) {
          valid = false;
        }
      }
    });
    
    return valid;
  }
  
  private validateTranslation(): boolean {
    const translationControls = [
      'translation.locale',
      'translation.name'
    ];
    
    let valid = true;
    
    translationControls.forEach(controlName => {
      const control = this.createForm.get(controlName);
      if (control) {
        control.markAsTouched();
        if (control.invalid) {
          valid = false;
        }
      }
    });
    
    return valid;
  }
  
  private validateLocation(): boolean {
    const control = this.createForm.get('ward');
    if (control) {
      control.markAsTouched();
      return control.valid;
    }
    return false;
  }
  
  onSubmit(): void {
    if (this.createForm.invalid) {
      // Mark all controls as touched to show validation errors
      this.markAllAsTouched(this.createForm);
      return;
    }
    
    const formData = this.createForm.value;
    
    // Format established date if present
    let establishedDate = formData.establishedDate;
    if (establishedDate instanceof Date) {
      establishedDate = establishedDate.toISOString().split('T')[0];
    }
    
    // Only include point if both coordinates are provided
    const point = formData.point?.longitude && formData.point?.latitude
      ? formData.point
      : undefined;

    // Prepare the cooperative DTO
    const cooperativeDto: CreateCooperativeDto = {
      code: formData.code,
      defaultLocale: formData.defaultLocale,
      establishedDate: establishedDate || undefined,
      ward: formData.ward,
      type: formData.type,
      status: formData.status,
      registrationNumber: formData.registrationNumber || undefined,
      point: point,
      contactEmail: formData.contactEmail || undefined,
      contactPhone: formData.contactPhone || undefined,
      websiteUrl: formData.websiteUrl || undefined,
      translation: {
        locale: formData.translation.locale,
        name: formData.translation.name,
        description: formData.translation.description || undefined,
        location: formData.translation.location || undefined,
        services: formData.translation.services || undefined,
        achievements: formData.translation.achievements || undefined,
        operatingHours: formData.translation.operatingHours || undefined,
        seoTitle: formData.translation.seoTitle || undefined,
        seoDescription: formData.translation.seoDescription || undefined,
        seoKeywords: formData.translation.seoKeywords || undefined,
        slugUrl: formData.translation.slugUrl || undefined,
        status: formData.translation.status,
        structuredData: formData.translation.structuredData || undefined,
        metaRobots: formData.translation.metaRobots || undefined
      }
    };
    
    // Create the cooperative
    this.store.dispatch(CooperativeActions.createCooperative({
      cooperative: cooperativeDto
    }));
  }
  
  cancelCreation(): void {
    this.router.navigate(['/cooperatives']);
  }
  
  // Helper to mark all form controls as touched
  private markAllAsTouched(formGroup: FormGroup): void {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      
      if (control instanceof FormGroup) {
        this.markAllAsTouched(control);
      }
    });
  }
  
  getStepLabel(stepTitle: string): string {
    return `cooperative.createSteps.${stepTitle}`;
  }
  
  useCurrentLocation(): void {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          this.createForm.get('point')?.patchValue({
            longitude: position.coords.longitude,
            latitude: position.coords.latitude
          });
        },
        (error) => {
          console.error('Error getting location:', error);
          this.snackBar.open(
            this.transloco.translate('cooperative.messages.locationError'),
            this.transloco.translate('common.actions.close'),
            { duration: 3000 }
          );
        }
      );
    } else {
      this.snackBar.open(
        this.transloco.translate('cooperative.messages.geolocationNotSupported'),
        this.transloco.translate('common.actions.close'),
        { duration: 3000 }
      );
    }
  }
}
