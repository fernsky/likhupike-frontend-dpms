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
  selector: 'app-alert-modal',
  template: `
    <cds-modal [size]="size" [open]="open" (overlaySelected)="closeModal()">
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
        <button cdsButton="primary" modal-primary-focus (click)="onOk()">
          {{ buttonText }}
        </button>
      </cds-modal-footer>
    </cds-modal>
  `,
  standalone: true,
  imports: [CommonModule, TranslocoModule, ModalModule, ButtonModule],
})
export class AlertModalComponent extends BaseModalComponent {
  @Output() ok = new EventEmitter<void>();

  constructor(
    @Inject('title') public title: string,
    @Inject('message') public message: string,
    @Inject('buttonText') public buttonText: string = 'OK',
    @Inject('size') public size: 'xs' | 'sm' | 'md' | 'lg' = 'sm',
    @Inject('showCloseButton') public showCloseButton: boolean = true,
    protected override modalService: ModalService
  ) {
    super(modalService);
  }

  onOk(): void {
    this.ok.emit();
    this.closeModal();
  }
}
