import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { TranslocoModule } from '@jsverse/transloco';

import { FormSectionComponent } from '@app/shared/components/form-section/form-section.component';
import { BaseButtonComponent } from '@app/shared/components/base-button/base-button.component';

import { ContentStatus } from '../../../../types';

@Component({
  selector: 'app-translation-form',
  templateUrl: './translation-form.component.html',
  styleUrls: ['./translation-form.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    TranslocoModule,
    FormSectionComponent,
    BaseButtonComponent,
  ],
})
export class TranslationFormComponent {
  @Input() parentForm!: FormGroup;
  @Input() contentStatuses: ContentStatus[] = [];

  @Output() nextStepClicked = new EventEmitter<void>();
  @Output() previousStepClicked = new EventEmitter<void>();

  get translationGroup(): FormGroup {
    return this.parentForm.get('translation') as FormGroup;
  }

  get localeControl(): FormControl {
    return this.translationGroup.get('locale') as FormControl;
  }

  get nameControl(): FormControl {
    return this.translationGroup.get('name') as FormControl;
  }

  get descriptionControl(): FormControl {
    return this.translationGroup.get('description') as FormControl;
  }

  get locationControl(): FormControl {
    return this.translationGroup.get('location') as FormControl;
  }

  get servicesControl(): FormControl {
    return this.translationGroup.get('services') as FormControl;
  }

  get achievementsControl(): FormControl {
    return this.translationGroup.get('achievements') as FormControl;
  }

  get operatingHoursControl(): FormControl {
    return this.translationGroup.get('operatingHours') as FormControl;
  }

  get seoTitleControl(): FormControl {
    return this.translationGroup.get('seoTitle') as FormControl;
  }

  get seoDescriptionControl(): FormControl {
    return this.translationGroup.get('seoDescription') as FormControl;
  }

  get seoKeywordsControl(): FormControl {
    return this.translationGroup.get('seoKeywords') as FormControl;
  }

  get slugUrlControl(): FormControl {
    return this.translationGroup.get('slugUrl') as FormControl;
  }

  get statusControl(): FormControl {
    return this.translationGroup.get('status') as FormControl;
  }

  onNext(): void {
    this.nextStepClicked.emit();
  }

  onPrevious(): void {
    this.previousStepClicked.emit();
  }
}
