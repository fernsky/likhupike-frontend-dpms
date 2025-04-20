import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { TranslocoModule } from '@jsverse/transloco';

import { FormSectionComponent } from '@app/shared/components/form-section/form-section.component';
import { BaseButtonComponent } from '@app/shared/components/base-button/base-button.component';

@Component({
  selector: 'app-location-form',
  templateUrl: './location-form.component.html',
  styleUrls: ['./location-form.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    TranslocoModule,
    FormSectionComponent,
    BaseButtonComponent,
  ],
})
export class LocationFormComponent {
  @Input() parentForm!: FormGroup;

  @Output() nextStepClicked = new EventEmitter<void>();
  @Output() previousStepClicked = new EventEmitter<void>();
  @Output() getCurrentLocation = new EventEmitter<void>();

  get pointGroup(): FormGroup {
    return this.parentForm.get('point') as FormGroup;
  }

  get latitudeControl(): FormControl {
    return this.pointGroup.get('latitude') as FormControl;
  }

  get longitudeControl(): FormControl {
    return this.pointGroup.get('longitude') as FormControl;
  }

  onNext(): void {
    this.nextStepClicked.emit();
  }

  onPrevious(): void {
    this.previousStepClicked.emit();
  }

  onUseCurrentLocation(): void {
    this.getCurrentLocation.emit();
  }
}
