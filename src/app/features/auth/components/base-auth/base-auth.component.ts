import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BackgroundParticlesComponent } from '@app/shared/components/background-particles/background-particles.component';
import { GovBrandingComponent } from '@app/shared/components/gov-branding/gov-branding.component';
import { SystemFeaturesComponent } from '@app/shared/components/system-features/system-features.component';
import { MatCardModule } from '@angular/material/card';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-base-auth',
  template: `
    <div class="auth-container">
      <div class="background-decorations">
        <div class="curved-line"></div>
      </div>
      <app-background-particles></app-background-particles>

      <div class="auth-header">
        <app-gov-branding></app-gov-branding>
      </div>

      <div class="auth-content">
        <app-system-features></app-system-features>
        <mat-card>
          <router-outlet></router-outlet>
        </mat-card>
      </div>
    </div>
  `,
  styleUrls: ['./base-auth.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    BackgroundParticlesComponent,
    GovBrandingComponent,
    SystemFeaturesComponent,
    MatCardModule,
    RouterOutlet,
  ],
})
export class BaseAuthComponent {}
