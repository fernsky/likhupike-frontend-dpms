import { Component, Output, EventEmitter, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatRippleModule } from '@angular/material/core';
import {
  trigger,
  state,
  style,
  transition,
  animate,
} from '@angular/animations';

@Component({
  selector: 'app-menu-toggle',
  template: `
    <button
      class="menu-toggle-button"
      [class.is-active]="isOpen"
      (click)="onToggle()"
      aria-label="Toggle navigation menu"
      [@rippleAnimation]="rippleState"
      matRipple
      [matRippleColor]="'rgba(255, 255, 255, 0.2)'"
      [matRippleCentered]="true"
    >
      <div class="menu-icon-wrapper">
        <span class="menu-icon-line top"></span>
        <span class="menu-icon-line middle"></span>
        <span class="menu-icon-line bottom"></span>
      </div>
      <div class="pulse-ring" [class.animate]="isOpen"></div>
    </button>
  `,
  styles: [
    `
      :host {
        position: fixed;
        top: 16px;
        left: 16px;
        z-index: 1000;
      }

      .menu-toggle-button {
        position: relative;
        width: 48px;
        height: 48px;
        padding: 12px;
        border: none;
        border-radius: 24px;
        background: linear-gradient(135deg, #1a2942 0%, #233b72 100%);
        cursor: pointer;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        box-shadow:
          0 2px 8px rgba(0, 0, 0, 0.15),
          0 4px 15px rgba(0, 0, 0, 0.1);
        overflow: visible;
        display: flex;
        justify-content: center;
        align-items: center;

        &:hover {
          transform: translateY(-2px);
          box-shadow:
            0 4px 12px rgba(0, 0, 0, 0.2),
            0 8px 20px rgba(0, 0, 0, 0.15);

          .menu-icon-line {
            &.top {
              transform: translateY(-1px);
            }
            &.bottom {
              transform: translateY(1px);
            }
          }
        }

        &:active {
          transform: translateY(0);
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
        }

        &.is-active {
          background: linear-gradient(135deg, #233b72 0%, #2a4894 100%);

          .menu-icon-line {
            &.top {
              transform: translateY(6px) rotate(45deg);
            }
            &.middle {
              opacity: 0;
              transform: scale(0);
            }
            &.bottom {
              transform: translateY(-6px) rotate(-45deg);
            }
          }
        }
      }

      .menu-icon-wrapper {
        position: relative;
        width: 20px;
        height: 16px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-items: center;
      }

      .menu-icon-line {
        width: 100%;
        height: 2px;
        background: white;
        border-radius: 4px;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        transform-origin: center;

        &.top {
          transform: translateY(0);
        }
        &.middle {
          opacity: 1;
          transform: scale(1);
        }
        &.bottom {
          transform: translateY(0);
        }
      }

      .pulse-ring {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        border-radius: 12px;
        border: 2px solid rgba(255, 255, 255, 0.5);
        opacity: 0;
        transform: scale(1.2);
        pointer-events: none;

        &.animate {
          animation: pulse 1.5s cubic-bezier(0.4, 0, 0.2, 1) infinite;
        }
      }

      @keyframes pulse {
        0% {
          transform: scale(1);
          opacity: 0.5;
        }
        50% {
          transform: scale(1.1);
          opacity: 0.25;
        }
        100% {
          transform: scale(1.2);
          opacity: 0;
        }
      }

      @media (prefers-reduced-motion: reduce) {
        .menu-toggle-button,
        .menu-icon-line,
        .pulse-ring {
          transition: none !important;
          animation: none !important;
        }
      }

      @media (max-width: 599px) {
        :host {
          top: 12px;
          left: 12px;
        }

        .menu-toggle-button {
          width: 42px;
          height: 42px;
          padding: 10px;
        }
      }
    `,
  ],
  animations: [
    trigger('rippleAnimation', [
      state('active', style({ transform: 'scale(1.1)', opacity: 0 })),
      transition('* => active', [
        style({ transform: 'scale(0.95)', opacity: 1 }),
        animate('400ms cubic-bezier(0.4, 0, 0.2, 1)'),
      ]),
    ]),
  ],
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule, MatRippleModule],
})
export class MenuToggleComponent {
  @Input() isOpen = false;
  @Output() toggleMenu = new EventEmitter<void>();
  rippleState: string | null = null;

  onToggle(): void {
    this.toggleMenu.emit();
    this.rippleState = 'active';
    setTimeout(() => (this.rippleState = null), 400);
  }
}
