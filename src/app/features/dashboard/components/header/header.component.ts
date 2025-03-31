import { Component, EventEmitter, Output, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { provideTranslocoScope, TranslocoModule } from '@jsverse/transloco';
import {
  ButtonModule,
  IconModule,
  HeaderModule,
  UIShellModule,
} from 'carbon-components-angular';
import { LanguageDropdownComponent } from '@app/shared/components/language-dropdown/language-dropdown.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    RouterModule,
    TranslocoModule,
    ButtonModule,
    IconModule,
    HeaderModule,
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
  @Input() isExpanded = false;
  @Input() showMenu = false; // Add this input
  @Output() menuToggle = new EventEmitter<void>();

  onMenuToggle(): void {
    this.menuToggle.emit();
  }

  onUserMenuSelect(event: { item: string }): void {
    switch (event.item) {
      case 'profile':
        // Handle profile
        break;
      case 'settings':
        // Handle settings
        break;
      case 'logout':
        // Handle logout
        break;
    }
  }
}
