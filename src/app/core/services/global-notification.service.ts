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
    // Use the bottom-right positioned notification box
    this.notificationService.showNotification({
      ...obj,
      target: '.notification-box.bottom-right',
      showClose: true, // Allow users to close notifications
      lowContrast: false, // Make notifications more visible
    });
  }
}
