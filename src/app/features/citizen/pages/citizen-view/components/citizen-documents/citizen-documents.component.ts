import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { provideTranslocoScope, TranslocoModule } from '@jsverse/transloco';
import { CitizenDocumentsResponse } from '../../../../types';
import { DocumentStatusChipComponent } from '../../../../components/document-status-chip/document-status-chip.component';

@Component({
  selector: 'app-citizen-documents',
  templateUrl: './citizen-documents.component.html',
  styleUrls: ['./citizen-documents.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    TranslocoModule,
    DocumentStatusChipComponent,
  ],
  providers: [
    provideTranslocoScope({
      scope: 'citizen-view',
      alias: 'citizen',
    }),
  ],
})
export class CitizenDocumentsComponent {
  @Input() documents!: CitizenDocumentsResponse;

  formatDate(date: string | null | undefined): string {
    if (!date) return '-';
    return new Date(date).toLocaleDateString();
  }

  openDocument(url: string | null | undefined): void {
    if (url) {
      window.open(url, '_blank');
    }
  }

  hasAnyDocument(): boolean {
    return !!(
      this.documents?.photo?.url ||
      this.documents?.citizenshipFront?.url ||
      this.documents?.citizenshipBack?.url
    );
  }
}
