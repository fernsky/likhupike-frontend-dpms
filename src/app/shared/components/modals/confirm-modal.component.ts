import { Component, Inject, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslocoModule } from '@jsverse/transloco';
import {
  ModalService,
  ModalModule,
  ButtonModule,
} from 'carbon-components-angular';
import { BaseModalComponent } from './base-modal.component';

@Component({
  selector: 'app-confirm-modal',
  template: `
    <cds-modal
      [size]="size"
      [open]="open"
      (overlaySelected)="closeModal()"
      [theme]="danger ? 'danger' : 'default'"
    >
      <cds-modal-header
        (closeSelect)="closeModal()"
        [showCloseButton]="showCloseButton"
      >
        <h3 cdsModalHeaderHeading>{{ title }}</h3>
      </cds-modal-header>
      <section cdsModalContent>
        <p cdsModalContentText>{{ message }}</p>
      </section>
      <cds-modal-footer>
        <button cdsButton="secondary" (click)="onCancel()">
          {{ cancelText }}
        </button>
        <button
          [cdsButton]="danger ? 'danger--primary' : 'primary'"
          modal-primary-focus
          (click)="onConfirm()"
        >
          {{ confirmText }}
        </button>
      </cds-modal-footer>
    </cds-modal>
  `,
  standalone: true,
  imports: [CommonModule, TranslocoModule, ModalModule, ButtonModule],
})
export class ConfirmModalComponent extends BaseModalComponent {
  @Output() confirm = new EventEmitter<void>();
  @Output() cancelAction = new EventEmitter<void>();

  constructor(
    @Inject('title') public title: string,
    @Inject('message') public message: string,
    @Inject('confirmText') public confirmText: string = 'Confirm',
    @Inject('cancelText') public cancelText: string = 'Cancel',
    @Inject('size') public size: 'xs' | 'sm' | 'md' | 'lg' = 'sm',
    @Inject('danger') public danger: boolean = false,
    @Inject('showCloseButton') public showCloseButton: boolean = true,
    protected override modalService: ModalService
  ) {
    super(modalService);
  }

  onConfirm(): void {
    this.confirm.emit();
    this.closeModal();
  }

  onCancel(): void {
    this.cancelAction.emit();
    this.closeModal();
  }
}
