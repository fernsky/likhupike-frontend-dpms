import { Injectable, Injector, NgZone, ViewContainerRef } from '@angular/core';
import { NotificationService } from 'carbon-components-angular';

/**
 * Providing service in root so the service is available across entire application
 */
@Injectable({
  providedIn: 'root',
})
export class GlobalNotificationService {
  private viewContainerRef!: ViewContainerRef;
  private notificationService!: NotificationService;

  constructor(
    private injector: Injector,
    private ngZone: NgZone
  ) {}

  /**
   * Manually provide a container ref
   * ---
   * View Container refs can only be injected into components,
   * so we would manually need to inject them into global service
   * to instantiate NotificationService
   *
   * THIS IS A REQUIRED STEP!
   */
  registerViewContainerRef(ref: ViewContainerRef) {
    this.viewContainerRef = ref;
    this.notificationService = new NotificationService(
      this.injector,
      this.viewContainerRef,
      this.ngZone
    );
  }

  /**
   * Shows a notification in the bottom-right corner of the screen
   * @param obj Notification configuration object
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  showNotification(obj: any) {
    if (!this.notificationService) {
      console.error(
        'Notification service not initialized. Call registerViewContainerRef first.'
      );
      return;
    }

    // Use the bottom-right positioned notification box
    const notification = this.notificationService.showNotification({
      ...obj,
      target: '.notification-box.bottom-right',
      showClose: true, // Allow users to close notifications
      lowContrast: false, // Make notifications more visible
      closeLabel: obj.closeLabel || 'Close notification',
    });

    // Ensure the notification component is properly attached to change detection
    this.ngZone.run(() => {});

    return notification;
  }

  /**
   * Helper method for success notifications
   */
  showSuccess(title: string, message: string, duration = 5000) {
    return this.showNotification({
      type: 'success',
      title,
      message,
      duration,
    });
  }

  /**
   * Helper method for info notifications
   */
  showInfo(title: string, message: string, duration = 5000) {
    return this.showNotification({
      type: 'info',
      title,
      message,
      duration,
    });
  }

  /**
   * Helper method for warning notifications
   */
  showWarning(title: string, message: string, duration = 5000) {
    return this.showNotification({
      type: 'warning',
      title,
      message,
      duration,
    });
  }

  /**
   * Helper method for error notifications
   */
  showError(title: string, message: string, duration = 8000) {
    return this.showNotification({
      type: 'error',
      title,
      message,
      duration,
    });
  }
}
