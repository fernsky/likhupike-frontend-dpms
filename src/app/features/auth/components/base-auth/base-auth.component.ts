import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GovBrandingComponent } from '@app/shared/components/gov-branding/gov-branding.component';
import { SystemFeaturesComponent } from '@app/shared/components/system-features/system-features.component';
import { RouterOutlet } from '@angular/router';
import { GridModule } from 'carbon-components-angular';
import { provideTranslocoScope, TranslocoModule } from '@jsverse/transloco';

@Component({
  selector: 'app-base-auth',
  templateUrl: './base-auth.component.html',
  styleUrls: ['./base-auth.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    GovBrandingComponent,
    SystemFeaturesComponent,
    RouterOutlet,
    GridModule,
    TranslocoModule,
  ],
  providers: [
    provideTranslocoScope({
      scope: 'auth',
      alias: 'auth',
    }),
  ],
})
export class BaseAuthComponent {}
