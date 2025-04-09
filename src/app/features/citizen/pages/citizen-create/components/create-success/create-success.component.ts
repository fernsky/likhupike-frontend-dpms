import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { provideTranslocoScope, TranslocoModule } from '@jsverse/transloco';

@Component({
  selector: 'app-create-success',
  templateUrl: './create-success.component.html',
  styleUrls: ['./create-success.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
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
export class CreateSuccessComponent {
  constructor(public dialogRef: MatDialogRef<CreateSuccessComponent>) {}

  onReturnToList(): void {
    this.dialogRef.close('list');
  }

  onCreateAnother(): void {
    this.dialogRef.close('new');
  }
}
