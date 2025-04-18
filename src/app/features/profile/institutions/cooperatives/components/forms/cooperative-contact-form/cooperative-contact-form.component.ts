import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Subject } from 'rxjs';
import { distinctUntilChanged, takeUntil } from 'rxjs/operators';

import { CooperativeResponse } from '../../../types';
import { CooperativeActions } from '../../../store/actions';

@Component({
  selector: 'app-cooperative-contact-form',
  templateUrl: './cooperative-contact-form.component.html',
  styleUrls: ['./cooperative-contact-form.component.scss']
})
export class CooperativeContactFormComponent implements OnInit, OnChanges, OnDestroy {
  @Input() cooperative!: CooperativeResponse;
  @Output() formChanged = new EventEmitter<boolean>();
  
  contactForm!: FormGroup;
  private destroy$ = new Subject<void>();
  
  constructor(
    private fb: FormBuilder,
    private store: Store
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.trackFormChanges();
  }
  
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['cooperative'] && this.cooperative && this.contactForm) {
      this.updateFormValues();
    }
  }
  
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
  
  private initForm(): void {
    this.contactForm = this.fb.group({
      contactEmail: ['', [Validators.email]],
      contactPhone: [''],
      websiteUrl: ['', [Validators.pattern('https?://.+')]],
      socialLinks: this.fb.group({
        facebook: ['', [Validators.pattern('https?://.+')]],
        twitter: ['', [Validators.pattern('https?://.+')]],
        instagram: ['', [Validators.pattern('https?://.+')]],
        linkedin: ['', [Validators.pattern('https?://.+')]]
      })
    });
    
    if (this.cooperative) {
      this.updateFormValues();
    }
  }
  
  private updateFormValues(): void {
    const metadata = this.cooperative.metadata ? JSON.parse(this.cooperative.metadata) : {};
    const socialLinks = metadata.socialLinks || {};

    this.contactForm.patchValue({
      contactEmail: this.cooperative.contactEmail || '',
      contactPhone: this.cooperative.contactPhone || '',
      websiteUrl: this.cooperative.websiteUrl || '',
      socialLinks: {
        facebook: socialLinks.facebook || '',
        twitter: socialLinks.twitter || '',
        instagram: socialLinks.instagram || '',
        linkedin: socialLinks.linkedin || ''
      }
    }, { emitEvent: false });
  }
  
  private trackFormChanges(): void {
    this.contactForm.valueChanges
      .pipe(
        distinctUntilChanged(),
        takeUntil(this.destroy$)
      )
      .subscribe(() => {
        this.formChanged.emit(true);
        this.store.dispatch(CooperativeActions.setUnsavedChanges({ hasUnsavedChanges: true }));
      });
  }
  
  onSubmit(): void {
    if (this.contactForm.invalid) {
      return;
    }
    
    const contactData = this.contactForm.value;
    
    // Get existing metadata to preserve other fields
    let metadata = this.cooperative.metadata ? JSON.parse(this.cooperative.metadata) : {};
    metadata = {
      ...metadata,
      socialLinks: contactData.socialLinks
    };
    
    this.store.dispatch(CooperativeActions.updateCooperative({
      id: this.cooperative.id,
      cooperative: {
        contactEmail: contactData.contactEmail,
        contactPhone: contactData.contactPhone,
        websiteUrl: contactData.websiteUrl,
        metadata: JSON.stringify(metadata)
      }
    }));
  }
}
