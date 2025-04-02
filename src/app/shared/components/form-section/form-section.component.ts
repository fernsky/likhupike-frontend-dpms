import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { UIShellModule } from 'carbon-components-angular';

@Component({
  selector: 'app-form-section',
  templateUrl: './form-section.component.html',
  styleUrls: ['./form-section.component.scss'],
  standalone: true,
  imports: [CommonModule, MatIconModule, UIShellModule],
})
export class FormSectionComponent {
  @Input() icon: string = '';
  @Input() title: string = '';
  @Input() subtitle?: string;
}
