import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  MatDialogModule,
  MAT_DIALOG_DATA,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

export interface UnsavedChangesDialogData {
  title?: string;
  message?: string;
  discardButton?: string;
  saveButton?: string;
  cancelButton?: string;
  showSaveOption?: boolean;
}

@Component({
  selector: 'app-unsaved-changes-dialog',
  templateUrl: './unsaved-changes-dialog.component.html',
  styleUrls: ['./unsaved-changes-dialog.component.scss'],
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule, MatIconModule],
})
export class UnsavedChangesDialogComponent {
  dialogData: UnsavedChangesDialogData;

  constructor(
    public dialogRef: MatDialogRef<UnsavedChangesDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: UnsavedChangesDialogData
  ) {
    // Set defaults
    this.dialogData = {
      title: data.title || 'Unsaved Changes',
      message:
        data.message || 'You have unsaved changes. What would you like to do?',
      discardButton: data.discardButton || 'Discard Changes',
      saveButton: data.saveButton || 'Save Changes',
      cancelButton: data.cancelButton || 'Continue Editing',
      showSaveOption:
        data.showSaveOption !== undefined ? data.showSaveOption : true,
    };
  }

  onDiscard(): void {
    this.dialogRef.close('discard');
  }

  onSave(): void {
    this.dialogRef.close('save');
  }

  onCancel(): void {
    this.dialogRef.close('cancel');
  }
}
