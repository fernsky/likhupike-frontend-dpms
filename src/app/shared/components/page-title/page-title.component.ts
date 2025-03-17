import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslocoModule } from '@jsverse/transloco';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-page-title',
  templateUrl: './page-title.component.html',
  styleUrls: ['./page-title.component.scss'],
  standalone: true,
  imports: [CommonModule, TranslocoModule, MatIconModule],
})
export class PageTitleComponent {
  @Input() title = '';
  @Input() titleTranslationKey?: string;
  @Input() description = '';
  @Input() descriptionTranslationKey?: string;
  @Input() icon?: string;
}
