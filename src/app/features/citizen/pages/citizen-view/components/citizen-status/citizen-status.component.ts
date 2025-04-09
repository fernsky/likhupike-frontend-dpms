import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import {
  provideTranslocoScope,
  TranslocoModule,
  TranslocoService,
} from '@jsverse/transloco';
import { CitizenResponse, CitizenState } from '../../../../types';
import { ChangeStateDialogComponent } from '../../dialogs/change-state-dialog/change-state-dialog.component';
import { CitizenStatusChipComponent } from '../../../../components/citizen-status-chip/citizen-status-chip.component';

@Component({
  selector: 'app-citizen-status',
  templateUrl: './citizen-status.component.html',
  styleUrls: ['./citizen-status.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    TranslocoModule,
    CitizenStatusChipComponent,
  ],
  providers: [
    provideTranslocoScope({
      scope: 'citizen-view',
      alias: 'citizen',
    }),
  ],
})
export class CitizenStatusComponent {
  @Input() citizen!: CitizenResponse;
  @Output() changeState = new EventEmitter<{
    state: CitizenState;
    note?: string;
  }>();

  constructor(
    private dialog: MatDialog,
    private transloco: TranslocoService
  ) {}

  formatDate(date: string | null | undefined): string {
    if (!date) return '-';
    return new Date(date).toLocaleDateString();
  }

  onOpenChangeStateDialog(): void {
    const dialogRef = this.dialog.open(ChangeStateDialogComponent, {
      width: '500px',
      data: {
        currentState: this.citizen.state,
        currentNote: this.citizen.stateNote,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result && result.state) {
        this.changeState.emit({
          state: result.state,
          note: result.note,
        });
      }
    });
  }
}
