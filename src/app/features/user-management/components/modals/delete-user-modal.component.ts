import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslocoModule, TranslocoService } from '@jsverse/transloco';
import {
  ModalService,
  ModalModule,
  ButtonModule,
} from 'carbon-components-angular';
import { BaseModal } from '@app/shared/components/modals/base-modal.component';
import { UserResponse } from '../../models/user.interface';

@Component({
  selector: 'app-delete-user-modal',
  template: `
    <cds-modal [size]="size" [open]="open" (overlaySelected)="closeModal()">
      <cds-modal-header (closeSelect)="closeModal()" [showCloseButton]="true">
        <h3 cdsModalHeaderHeading>
          {{ 'user.delete.confirmTitle' | transloco }}
        </h3>
      </cds-modal-header>
      <section cdsModalContent>
        <p cdsModalContentText>
          {{ 'user.delete.confirmMessage' | transloco: { name: user.email } }}
        </p>
      </section>
      <cds-modal-footer>
        <button cdsButton="secondary" (click)="closeModal()">
          {{ 'common.cancel' | transloco }}
        </button>
        <button
          cdsButton="danger--primary"
          modal-primary-focus
          (click)="confirmDelete()"
        >
          {{ 'common.delete' | transloco }}
        </button>
      </cds-modal-footer>
    </cds-modal>
  `,
  standalone: true,
  imports: [CommonModule, TranslocoModule, ModalModule, ButtonModule],
})
export class DeleteUserModalComponent extends BaseModal {
  constructor(
    @Inject('user') public user: UserResponse,
    @Inject('onDelete') public onDelete: () => void,
    @Inject('size') public size: 'sm' | 'md' | 'lg' | 'xs' = 'sm',
    protected modalService: ModalService,
    private transloco: TranslocoService
  ) {
    super();
  }

  confirmDelete() {
    this.onDelete();
    this.closeModal();
  }

  override closeModal() {
    super.closeModal();
    this.modalService.destroy();
  }
}
