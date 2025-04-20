import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { TranslocoModule } from '@jsverse/transloco';

import { FormSectionComponent } from '@app/shared/components/form-section/form-section.component';
import { BaseButtonComponent } from '@app/shared/components/base-button/base-button.component';

@Component({
  selector: 'app-review-form',
  templateUrl: './review-form.component.html',
  styleUrls: ['./review-form.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatIconModule,
    TranslocoModule,
    FormSectionComponent,
    BaseButtonComponent,
  ],
})
export class ReviewFormComponent {
  @Input() parentForm!: FormGroup;

  @Output() formSubmit = new EventEmitter<void>();
  @Output() previousStepClicked = new EventEmitter<void>();
  @Output() cancelClicked = new EventEmitter<void>();

  onSubmit(): void {
    this.formSubmit.emit();
  }

  onPrevious(): void {
    this.previousStepClicked.emit();
  }

  onCancel(): void {
    this.cancelClicked.emit();
  }
}
