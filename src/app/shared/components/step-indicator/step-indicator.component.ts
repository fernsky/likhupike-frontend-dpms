import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslocoPipe } from '@jsverse/transloco';

export interface Step {
  label: string;
  description: string; // Added description
  completed: boolean;
  current: boolean;
  valid?: boolean;
  icon?: string; // Added icon support
}

@Component({
  selector: 'app-step-indicator',
  templateUrl: './step-indicator.component.html',
  styleUrls: ['./step-indicator.component.scss'],
  standalone: true,
  imports: [CommonModule, MatIconModule, MatTooltipModule, TranslocoPipe],
})
export class StepIndicatorComponent {
  @Input() steps: Step[] = [];
  @Input() currentStepIndex: number = 0;
  @Input() allowNavigation: boolean = true;
  @Output() stepChange = new EventEmitter<number>();

  navigateToStep(index: number): void {
    if (!this.allowNavigation) return;

    const canNavigate = this.isStepClickable(index);
    if (canNavigate) {
      this.stepChange.emit(index);
    }
  }

  isStepClickable(index: number): boolean {
    if (!this.allowNavigation) return false;

    // Can always go back to previous steps
    if (index < this.currentStepIndex) return true;

    // Can only go to next step if current step is valid
    if (index === this.currentStepIndex + 1) {
      return this.steps[this.currentStepIndex]?.valid ?? false;
    }

    // Cannot skip steps
    return false;
  }

  getStepAriaLabel(step: Step, index: number): string {
    const statusKey = step.completed
      ? 'completed'
      : step.current
      ? 'current'
      : 'pending';
    
    return `${step.label} - ${step.description}`;
  }
}
