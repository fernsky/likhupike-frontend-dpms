import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { provideTranslocoScope, TranslocoModule } from '@jsverse/transloco';

interface Feature {
  translationKey: string;
  icon: string;
  colorClass: string;
}

@Component({
  selector: 'app-system-features',
  templateUrl: './system-features.component.html',
  styleUrls: ['./system-features.component.scss'],
  standalone: true,
  imports: [CommonModule, TranslocoModule],
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
      translationKey: 'municipalServices',
      icon: 'apartment',
      colorClass: 'feature-primary',
    },
    {
      translationKey: 'quickProcessing',
      icon: 'rocket_launch',
      colorClass: 'feature-success',
    },
    {
      translationKey: 'dataIntegration',
      icon: 'data_object',
      colorClass: 'feature-info',
    },
    {
      translationKey: 'citizenPortal',
      icon: 'person',
      colorClass: 'feature-warning',
    },
  ];
}
