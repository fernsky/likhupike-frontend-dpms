import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BackgroundParticlesComponent } from '@app/shared/components/background-particles/background-particles.component';
import { GovBrandingComponent } from '@app/shared/components/gov-branding/gov-branding.component';
import { SystemFeaturesComponent } from '@app/shared/components/system-features/system-features.component';
import { RouterOutlet } from '@angular/router';

// Import Carbon components
import { GridModule } from 'carbon-components-angular';

@Component({
  selector: 'app-base-auth',
  templateUrl: './base-auth.component.html',
  styleUrls: ['./base-auth.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    BackgroundParticlesComponent,
    GovBrandingComponent,
    SystemFeaturesComponent,
    RouterOutlet,
    GridModule,
  ],
})
export class BaseAuthComponent {}
