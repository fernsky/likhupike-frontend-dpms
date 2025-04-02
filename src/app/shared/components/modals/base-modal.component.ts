import { Component, Output, EventEmitter } from '@angular/core';
import { ModalService } from 'carbon-components-angular';

/**
 * Base component for all modal components
 * Follows Carbon Design System pattern for modals
 */
@Component({
  template: '',
})
export class BaseModal {
  open = true;
  @Output() closeEvent = new EventEmitter<void>();

  constructor(protected modalService?: ModalService) {}

  closeModal(): void {
    this.open = false;
    this.closeEvent.emit();

    // Optional: allowing modals to be used without injection
    if (this.modalService) {
      setTimeout(() => {
        this.modalService?.destroy();
      }, 300); // Small delay to allow animations to complete
    }
  }
}
