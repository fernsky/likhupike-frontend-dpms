import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterModule } from '@angular/router';
import { provideTranslocoScope, TranslocoModule } from '@jsverse/transloco';
import { MatDivider } from '@angular/material/divider';
import { HeaderLanguageToggleComponent } from '@shared/components/header-language-toggle/header-language-toggle.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatTooltipModule,
    RouterModule,
    TranslocoModule,
    MatDivider,
    HeaderLanguageToggleComponent,
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
  @Output() menuToggle = new EventEmitter<void>();

  onMenuToggle(): void {
    this.menuToggle.emit();
  }
}
