import {
  Component,
  Input,
  AfterContentInit,
  ContentChild,
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
  @Input() description = '';
  @Input() descriptionTranslationKey?: string;
  @Input() icon?: string;

  hasContent = false;

  @ContentChild('*') content!: unknown;

  ngAfterContentInit() {
    this.hasContent = !!this.content;
  }
}
