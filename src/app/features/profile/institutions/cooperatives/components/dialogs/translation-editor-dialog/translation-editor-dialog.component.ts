import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { 
  CooperativeResponse, 
  CooperativeTranslationResponse, 
  ContentStatus, 
  CreateCooperativeTranslationDto, 
  UpdateCooperativeTranslationDto 
} from '../../../types';

interface TranslationDialogData {
  cooperative: CooperativeResponse;
  translation?: CooperativeTranslationResponse;
  isNew: boolean;
  availableLocales?: string[];
}

@Component({
  selector: 'app-translation-editor-dialog',
  templateUrl: './translation-editor-dialog.component.html',
  styleUrls: ['./translation-editor-dialog.component.scss']
})
export class TranslationEditorDialogComponent implements OnInit {
  translationForm!: FormGroup;
  isNew: boolean;
  dialogTitle: string;
  
  availableLocales: string[] = [];
  contentStatuses = Object.values(ContentStatus);
  
  activeTab = 0;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<TranslationEditorDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: TranslationDialogData
  ) {
    this.isNew = data.isNew;
    this.dialogTitle = this.isNew 
      ? 'cooperative.translations.addTranslation' 
      : 'cooperative.translations.editTranslation';
      
    if (this.isNew && data.availableLocales) {
      this.availableLocales = data.availableLocales;
    }
  }

  ngOnInit(): void {
    this.initForm();
  }
  
  private initForm(): void {
    this.translationForm = this.fb.group({
      // Basic information
      locale: ['', Validators.required],
      name: ['', [Validators.required, Validators.maxLength(100)]],
      description: [''],
      location: [''],
      services: [''],
      achievements: [''],
      operatingHours: [''],
      
      // SEO information
      seoTitle: ['', Validators.maxLength(60)],
      seoDescription: ['', Validators.maxLength(160)],
      seoKeywords: [''],
      slugUrl: [''],
      status: [ContentStatus.DRAFT],
      
      // Advanced SEO
      structuredData: [''],
      canonicalUrl: [''],
      hreflangTags: [''],
      breadcrumbStructure: [''],
      faqItems: [''],
      metaRobots: [''],
      socialShareImage: [''],
    });
    
    // If editing existing translation, set values
    if (!this.isNew && this.data.translation) {
      const translation = this.data.translation;
      this.translationForm.patchValue({
        locale: translation.locale,
        name: translation.name,
        description: translation.description || '',
        location: translation.location || '',
        services: translation.services || '',
        achievements: translation.achievements || '',
        operatingHours: translation.operatingHours || '',
        seoTitle: translation.seoTitle || '',
        seoDescription: translation.seoDescription || '',
        seoKeywords: translation.seoKeywords || '',
        slugUrl: translation.slugUrl || '',
        status: translation.status,
        structuredData: translation.structuredData || '',
        canonicalUrl: translation.canonicalUrl || '',
        hreflangTags: translation.hreflangTags || '',
        breadcrumbStructure: translation.breadcrumbStructure || '',
        faqItems: translation.faqItems || '',
        metaRobots: translation.metaRobots || '',
        socialShareImage: translation.socialShareImage || '',
      });
      
      // Disable locale field when editing - cannot change locale of existing translation
      this.translationForm.get('locale')?.disable();
    }
  }
  
  onSubmit(): void {
    if (this.translationForm.invalid) {
      return;
    }
    
    const formData = this.translationForm.getRawValue();
    
    if (this.isNew) {
      const newTranslation: CreateCooperativeTranslationDto = {
        locale: formData.locale,
        name: formData.name,
        description: formData.description || undefined,
        location: formData.location || undefined,
        services: formData.services || undefined,
        achievements: formData.achievements || undefined,
        operatingHours: formData.operatingHours || undefined,
        seoTitle: formData.seoTitle || undefined,
        seoDescription: formData.seoDescription || undefined,
        seoKeywords: formData.seoKeywords || undefined,
        slugUrl: formData.slugUrl || undefined,
        status: formData.status,
        structuredData: formData.structuredData || undefined,
        metaRobots: formData.metaRobots || undefined
      };
      
      this.dialogRef.close(newTranslation);
    } else {
      const updatedTranslation: UpdateCooperativeTranslationDto = {
        name: formData.name,
        description: formData.description || undefined,
        location: formData.location || undefined,
        services: formData.services || undefined,
        achievements: formData.achievements || undefined,
        operatingHours: formData.operatingHours || undefined,
        seoTitle: formData.seoTitle || undefined,
        seoDescription: formData.seoDescription || undefined,
        seoKeywords: formData.seoKeywords || undefined,
        slugUrl: formData.slugUrl || undefined,
        status: formData.status,
        structuredData: formData.structuredData || undefined,
        canonicalUrl: formData.canonicalUrl || undefined,
        hreflangTags: formData.hreflangTags || undefined,
        breadcrumbStructure: formData.breadcrumbStructure || undefined,
        faqItems: formData.faqItems || undefined,
        metaRobots: formData.metaRobots || undefined,
        socialShareImage: formData.socialShareImage || undefined
      };
      
      this.dialogRef.close(updatedTranslation);
    }
  }
  
  onCancel(): void {
    this.dialogRef.close();
  }
  
  getLocaleName(locale: string): string {
    switch (locale) {
      case 'en': return 'English';
      case 'ne': return 'Nepali';
      default: return locale;
    }
  }
  
  onTabChanged(tabIndex: number): void {
    this.activeTab = tabIndex;
  }
}
