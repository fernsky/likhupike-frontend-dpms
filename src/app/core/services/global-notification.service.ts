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
   * Ideally the point of a global notification would be to render notification in a specific area/target
   * So probably a good idea to override the target
   *
   * You can exeucte any logic you need here, another approach would be to simply extend the `NotificationService`.
   * To do this, you would need to override the injected services (Injector, NgZone, ViewContainerRef), by extending
   * Notification service, you wouldn't need to create `wrapper` functions such as this. Downside of this approach is that
   * you would have to specifiy the target
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  showNotification(obj: any) {
    this.notificationService.showNotification({
      ...obj,
      target: '.notification-box',
    });
  }
}
