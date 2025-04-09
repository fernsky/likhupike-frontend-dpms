import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { provideTranslocoScope, TranslocoModule } from '@jsverse/transloco';

@Component({
  selector: 'app-personal-info-form',
  templateUrl: './personal-info-form.component.html',
  styleUrls: ['./personal-info-form.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    TranslocoModule,
  ],
  providers: [
    provideTranslocoScope({
      scope: 'citizen-create',
      alias: 'citizen',
    }),
  ],
})
export class PersonalInfoFormComponent {
  @Input() parentForm!: FormGroup;

  get nameControl() {
    return this.parentForm.get('name');
  }
  get nameDevnagariControl() {
    return this.parentForm.get('nameDevnagari');
  }
  get emailControl() {
    return this.parentForm.get('email');
  }
  get phoneNumberControl() {
    return this.parentForm.get('phoneNumber');
  }
  get fatherNameControl() {
    return this.parentForm.get('fatherName');
  }
  get grandfatherNameControl() {
    return this.parentForm.get('grandfatherName');
  }
  get spouseNameControl() {
    return this.parentForm.get('spouseName');
  }
}
