import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslocoModule, TranslocoService } from '@jsverse/transloco';
import {
  ModalService,
  ModalModule,
  ButtonModule,
} from 'carbon-components-angular';
import { BaseModalComponent } from '@app/shared/components/modals/base-modal.component';
import { UserResponse } from '../../models/user.interface';

@Component({
  selector: 'app-approve-user-modal',
  template: `
    <cds-modal [size]="size" [open]="open" (overlaySelected)="closeModal()">
      <cds-modal-header (closeSelect)="closeModal()" [showCloseButton]="true">
        <h3 cdsModalHeaderHeading>
          {{ 'user.approve.confirmTitle' | transloco }}
        </h3>
      </cds-modal-header>
      <section cdsModalContent>
        <p cdsModalContentText>
          {{ 'user.approve.confirmMessage' | transloco: { email: user.email } }}
        </p>
      </section>
      <cds-modal-footer>
        <button cdsButton="secondary" (click)="closeModal()">
          {{ 'common.action.cancel' | transloco }}
        </button>
        <button
          cdsButton="primary"
          modal-primary-focus
          (click)="confirmApprove()"
        >
          {{ 'common.action.confirm' | transloco }}
        </button>
      </cds-modal-footer>
    </cds-modal>
  `,
  standalone: true,
  imports: [CommonModule, TranslocoModule, ModalModule, ButtonModule],
})
export class ApproveUserModalComponent extends BaseModalComponent {
  constructor(
    @Inject('user') public user: UserResponse,
    @Inject('onApprove') public onApprove: () => void,
    @Inject('size') public size: 'sm' | 'md' | 'lg' | 'xs' = 'sm',
    protected override modalService: ModalService,
    private transloco: TranslocoService
  ) {
    super();
  }

  confirmApprove() {
    this.onApprove();
    this.closeModal();
  }

  override closeModal() {
    super.closeModal();
    this.modalService.destroy();
  }
}
