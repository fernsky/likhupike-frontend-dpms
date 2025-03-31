import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslocoPipe } from '@jsverse/transloco';
import { provideTranslocoScope, TranslocoModule } from '@jsverse/transloco';
import { TilesModule, GridModule } from 'carbon-components-angular';
import { MatIconModule } from '@angular/material/icon';

interface Feature {
  icon: string;
  translationKey: string;
}

@Component({
  selector: 'app-system-features',
  templateUrl: './system-features.component.html',
  styleUrls: ['./system-features.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    TranslocoPipe,
    TranslocoModule,
    TilesModule,
    GridModule,
  ],
  providers: [
    provideTranslocoScope({
      scope: 'system-features',
      alias: 'systemFeatures',
    }),
  ],
})
export class SystemFeaturesComponent {
  features: Feature[] = [
    {
      icon: 'account_balance',
      translationKey: 'municipalServices',
    },
    {
      icon: 'speed',
      translationKey: 'quickProcessing',
    },
    {
      icon: 'analytics',
      translationKey: 'dataIntegration',
    },
    {
      icon: 'public',
      translationKey: 'citizenPortal',
    },
  ];
}
