import { Component, Input, ContentChild, TemplateRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslocoModule } from '@jsverse/transloco';

@Component({
  selector: 'app-page-title',
  templateUrl: './page-title.component.html',
  styleUrls: ['./page-title.component.scss'],
  standalone: true,
  imports: [CommonModule, TranslocoModule],
})
export class PageTitleComponent {
  @Input() title = '';
  @Input() titleTranslationKey?: string;
  @Input() titleParams?: Record<string, string | number>;
  @Input() description = '';
  @Input() descriptionTranslationKey?: string;
  @Input() descriptionParams?: Record<string, string | number>;

  @ContentChild('actions') actionsTemplate?: TemplateRef<unknown>;
}
