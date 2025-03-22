import {
  Component,
  Input,
  AfterContentInit,
  ContentChild,
  TemplateRef,
} from '@angular/core';
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
export class PageTitleComponent implements AfterContentInit {
  @Input() title = '';
  @Input() titleTranslationKey?: string;
  @Input() titleParams?: Record<string, string | number>; // Add titleParams input
  @Input() description = '';
  @Input() descriptionTranslationKey?: string;
  @Input() descriptionParams?: Record<string, string | number>; // Add descriptionParams input
  @Input() icon?: string;

  hasContent = false;

  @ContentChild('*') content!: unknown;
  @ContentChild('actions') actionsTemplate?: TemplateRef<unknown>;

  ngAfterContentInit() {
    this.hasContent = !!this.content;
  }
}
