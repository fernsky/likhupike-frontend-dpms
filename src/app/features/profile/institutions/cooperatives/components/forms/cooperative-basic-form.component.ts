import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

import { CooperativeResponse, CooperativeStatus, CooperativeType, UpdateCooperativeDto } from '../../types';
import { CooperativeActions } from '../../store/actions';

@Component({
  selector: 'app-cooperative-basic-form',
  templateUrl: './cooperative-basic-form.component.html',
  styleUrls: ['./cooperative-basic-form.component.scss']
})
export class CooperativeBasicFormComponent implements OnInit, OnChanges {
  @Input() cooperative!: CooperativeResponse;
  
  cooperativeForm!: FormGroup;
  cooperativeTypes = Object.values(CooperativeType);
  cooperativeStatuses = Object.values(CooperativeStatus);
  submitting = false;
  
  private destroy$ = new Subject<void>();
  
  constructor(
    private fb: FormBuilder,
    private store: Store
  ) { }

  ngOnInit(): void {
    this.initForm();
  }
  
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['cooperative'] && this.cooperative && this.cooperativeForm) {
      this.updateFormValues();
    }
  }
  
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
  
  private initForm(): void {
    this.cooperativeForm = this.fb.group({
      code: ['', [Validators.required, Validators.pattern('^[a-z0-9-]+$')]],
      defaultLocale: ['en', Validators.required],
      establishedDate: [null],
      ward: [null, Validators.required],
      type: ['', Validators.required],
      status: ['ACTIVE', Validators.required],
      registrationNumber: [''],
      contactEmail: ['', Validators.email],
      contactPhone: [''],
      websiteUrl: ['', Validators.pattern('https?://.+')]
    });
    
    if (this.cooperative) {
      this.updateFormValues();
    }
    
    // Track form changes to mark dirty fields
    Object.keys(this.cooperativeForm.controls).forEach(key => {
      this.cooperativeForm.get(key)?.valueChanges
        .pipe(
          distinctUntilChanged(),
          takeUntil(this.destroy$)
        )
        .subscribe(() => {
          this.store.dispatch(CooperativeActions.markFieldDirty({ fieldName: key }));
          this.store.dispatch(CooperativeActions.setUnsavedChanges({ hasUnsavedChanges: true }));
        });
    });
  }
  
  private updateFormValues(): void {
    this.cooperativeForm.patchValue({
      code: this.cooperative.code,
      defaultLocale: this.cooperative.defaultLocale,
      establishedDate: this.cooperative.establishedDate ? new Date(this.cooperative.establishedDate) : null,
      ward: this.cooperative.ward,
      type: this.cooperative.type,
      status: this.cooperative.status,
      registrationNumber: this.cooperative.registrationNumber,
      contactEmail: this.cooperative.contactEmail,
      contactPhone: this.cooperative.contactPhone,
      websiteUrl: this.cooperative.websiteUrl
    }, { emitEvent: false });
  }
  
  onSubmit(): void {
    if (this.cooperativeForm.invalid) {
      this.markFormGroupTouched(this.cooperativeForm);
      return;
    }
    
    this.submitting = true;
    
    const updateData: UpdateCooperativeDto = {
      ...this.cooperativeForm.value
    };
    
    // If date is a Date object, convert to ISO string
    if (updateData.establishedDate instanceof Date) {
      updateData.establishedDate = updateData.establishedDate.toISOString().split('T')[0];
    }
    
    this.store.dispatch(CooperativeActions.updateCooperative({
      id: this.cooperative.id,
      cooperative: updateData
    }));
  }
  
  // Helper method to mark all controls as touched for validation display
  private markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }
}
