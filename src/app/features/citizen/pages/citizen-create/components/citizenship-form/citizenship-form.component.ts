import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { provideTranslocoScope, TranslocoModule } from '@jsverse/transloco';

@Component({
  selector: 'app-citizenship-form',
  templateUrl: './citizenship-form.component.html',
  styleUrls: ['./citizenship-form.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatIconModule,
    TranslocoModule,
  ],
  providers: [
    provideTranslocoScope({
      scope: 'citizen-create',
      alias: 'citizen',
    }),
  ],
})
export class CitizenshipFormComponent {
  @Input() parentForm!: FormGroup;

  get citizenshipNumberControl() {
    return this.parentForm.get('citizenshipNumber');
  }
  get citizenshipIssuedDateControl() {
    return this.parentForm.get('citizenshipIssuedDate');
  }
  get citizenshipIssuedOfficeControl() {
    return this.parentForm.get('citizenshipIssuedOffice');
  }

  // Restrict future dates in the datepicker
  maxDate = new Date();
}
