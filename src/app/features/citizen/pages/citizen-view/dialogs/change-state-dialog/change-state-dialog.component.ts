import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { provideTranslocoScope, TranslocoModule } from '@jsverse/transloco';
import { CitizenState } from '../../../../types';

interface DialogData {
  currentState: CitizenState;
  currentNote?: string | null;
}

@Component({
  selector: 'app-change-state-dialog',
  templateUrl: './change-state-dialog.component.html',
  styleUrls: ['./change-state-dialog.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatButtonModule,
    TranslocoModule,
  ],
  providers: [
    provideTranslocoScope({
      scope: 'citizen-view',
      alias: 'citizen',
    }),
  ],
})
export class ChangeStateDialogComponent {
  stateForm: FormGroup;
  citizenStates = Object.values(CitizenState);

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<ChangeStateDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {
    this.stateForm = this.fb.group({
      state: [data.currentState, Validators.required],
      note: [data.currentNote],
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    if (this.stateForm.valid) {
      this.dialogRef.close(this.stateForm.value);
    }
  }
}
