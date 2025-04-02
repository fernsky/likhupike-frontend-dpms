import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { provideTranslocoScope, TranslocoModule } from '@jsverse/transloco';

interface Feature {
  icon: string;
  color: string;
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
    { icon: 'apartment', color: '#0f62fe' },
    { icon: 'rocket_launch', color: '#6929c4' },
    { icon: 'data_object', color: '#1192e8' },
    { icon: 'person', color: '#005d5d' },
  ];
}
