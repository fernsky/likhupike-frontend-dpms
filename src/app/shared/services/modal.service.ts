import { Injectable, Type, ComponentRef } from '@angular/core';
import {
  ModalService as CarbonModalService,
  ModalButtonType,
} from 'carbon-components-angular';
import { ConfirmModal } from '@app/shared/components/modals/confirm-modal.component';
import { AlertModal } from '@app/shared/components/modals/alert-modal.component';

export interface ModalButton {
  text: string;
  type: ModalButtonType;
  click?: () => void;
}

export interface ModalOptions {
  title?: string;
  content?: string;
  label?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  buttons: ModalButton[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data?: any;
}

@Injectable({
  providedIn: 'root',
})
export class AppModalService {
  constructor(private modalService: CarbonModalService) {}

  /**
   * Opens a modal with a custom component - enterprise pattern
   * This is the preferred approach for complex modals
   */
  openComponentModal<T>(
    component: Type<T>,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    inputs: Record<string, any> = {}
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ): ComponentRef<any> {
    // This is the correct way to use the Carbon modal service
    return this.modalService.create({
      component,
      inputs,
    });
  }

  /**
   * Simple confirmation modal - for basic confirmation dialogs
   * Uses the ConfirmModal component under the hood
   */
  confirm(options: {
    title?: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    size?: 'xs' | 'sm' | 'md' | 'lg';
    danger?: boolean;
  }): Promise<boolean> {
    return new Promise<boolean>((resolve) => {
      // Create a modal with the ConfirmModal component
      this.modalService.create({
        component: ConfirmModal, // Use the component
        inputs: {
          // Pass all options as inputs
          title: options.title || '',
          message: options.message,
          confirmText: options.confirmText || 'OK',
          cancelText: options.cancelText || 'Cancel',
          size: options.size || 'sm',
          danger: options.danger || false,
          // Event handlers for the component
          confirm: () => {
            resolve(true);
            // No need to call destroy here, the component will handle it
          },
          cancel: () => {
            resolve(false);
            // No need to call destroy here, the component will handle it
          },
        },
      });
    });
  }

  /**
   * Simple alert modal - for informational messages
   * Uses the AlertModal component under the hood
   */
  alert(options: {
    title?: string;
    message: string;
    buttonText?: string;
    size?: 'xs' | 'sm' | 'md' | 'lg';
  }): Promise<void> {
    return new Promise<void>((resolve) => {
      // Create a modal with the AlertModal component
      this.modalService.create({
        component: AlertModal, // Use the component
        inputs: {
          // Pass all options as inputs
          title: options.title || '',
          message: options.message,
          buttonText: options.buttonText || 'OK',
          size: options.size || 'sm',
          // Event handler for the component
          ok: () => {
            resolve();
            // No need to call destroy here, the component will handle it
          },
        },
      });
    });
  }
}
