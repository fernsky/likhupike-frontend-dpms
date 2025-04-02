import { Component, OnInit, OnDestroy, ViewContainerRef } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthFacade } from './core/facades/auth.facade';
import { Subscription } from 'rxjs';
import { GlobalNotificationService } from './core/services/global-notification.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: true,
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'Digital Profile Information System';
  private langSubscription: Subscription | null = null;

  constructor(
    private authFacade: AuthFacade,
    private viewContainerRef: ViewContainerRef,
    public globalNotificationSvc: GlobalNotificationService
  ) {}

  ngOnInit() {
    // Initialize auth first
    this.authFacade.initializeAuth();

    // No need for additional language initialization
    // since the language service constructor handles it
    this.globalNotificationSvc.registerViewContainerRef(this.viewContainerRef);

    // Mocking an API call and based on result, showing notification!
    setTimeout(() => {
      this.globalNotificationSvc.showNotification({
        type: 'info',
        title: 'Notification',
        message: 'Sample info message',
        target: '.notification-box',
      });
    });
  }

  ngOnDestroy() {
    if (this.langSubscription) {
      this.langSubscription.unsubscribe();
      this.langSubscription = null;
    }
  }
}
