import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { TranslocoModule, provideTranslocoScope } from '@jsverse/transloco';

import { PageTitleComponent } from '@app/shared/components/page-title/page-title.component';
import { BaseButtonComponent } from '@app/shared/components/base-button/base-button.component';
import { LocationFormComponent } from '../components/forms/create/location-form/location-form.component';

@Component({
  selector: 'app-location-form-test',
  template: `
    <div class="test-container">
      <app-page-title
        icon="place"
        titleTranslationKey="Location Form Test"
        descriptionTranslationKey="Testing the location form component in isolation"
      >
      </app-page-title>

      <mat-card>
        <mat-card-content>
          <form [formGroup]="testForm">
            <app-location-form
              [parentForm]="testForm"
              (nextStepClicked)="onNext()"
              (previousStepClicked)="onPrevious()"
              (getCurrentLocation)="onGetCurrentLocation()"
            ></app-location-form>
          </form>
        </mat-card-content>
      </mat-card>

      <div class="form-values">
        <h3>Current Form Values:</h3>
        <pre>{{ formValues | json }}</pre>
      </div>
    </div>
  `,
  styles: [
    `
      .test-container {
        max-width: 1200px;
        margin: 0 auto;
        padding: 2rem;
      }

      mat-card {
        margin-bottom: 2rem;
      }

      .form-values {
        background: #f5f5f5;
        border-radius: 8px;
        padding: 1rem;
      }

      pre {
        white-space: pre-wrap;
        overflow-wrap: break-word;
        background: #ffffff;
        padding: 1rem;
        border-radius: 4px;
        border: 1px solid #e0e0e0;
      }
    `,
  ],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    TranslocoModule,
    PageTitleComponent,
    BaseButtonComponent,
    LocationFormComponent,
  ],
  providers: [
    provideTranslocoScope({
      scope: 'cooperatives',
      alias: 'cooperative',
    }),
  ],
})
export class LocationFormTestComponent implements OnInit {
  testForm!: FormGroup;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  formValues: any = {};

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.initForm();

    // Subscribe to form value changes to display current values
    this.testForm.valueChanges.subscribe((values) => {
      this.formValues = values;
    });

    // Initialize the form values display
    this.formValues = this.testForm.value;
  }

  private initForm() {
    this.testForm = this.fb.group({
      point: this.fb.group({
        longitude: [null, [Validators.min(-180), Validators.max(180)]],
        latitude: [null, [Validators.min(-90), Validators.max(90)]],
      }),
    });
  }

  onNext() {
    console.log('Next clicked, form values:', this.testForm.value);
    alert('Next clicked! Check console for form values.');
  }

  onPrevious() {
    console.log('Previous clicked');
    alert('Previous clicked!');
  }

  onGetCurrentLocation() {
    console.log('Get current location triggered');
  }
}
