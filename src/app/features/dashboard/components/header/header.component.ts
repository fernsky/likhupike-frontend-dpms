import {
  Component,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { provideTranslocoScope, TranslocoModule } from '@jsverse/transloco';
import { UIShellModule } from 'carbon-components-angular';
import { LanguageDropdownComponent } from '@app/shared/components/language-dropdown/language-dropdown.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    TranslocoModule,
    UIShellModule,
    LanguageDropdownComponent,
  ],
  providers: [
    provideTranslocoScope({
      scope: 'header',
      alias: 'header',
    }),
    provideTranslocoScope({
      scope: 'government-branding',
      alias: 'govBranding',
    }),
  ],
})
export class HeaderComponent {
  @Input() isExpanded = true;
  @Input() showMenu = false;
  @Output() menuToggle = new EventEmitter<void>();

  onMenuToggle(): void {
    // Add console log to debug
    console.log('Menu toggle clicked');
    this.menuToggle.emit();
  }
}
