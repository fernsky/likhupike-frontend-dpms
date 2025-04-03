import {
  Component,
  OnInit,
  OnDestroy,
  ViewContainerRef,
  AfterViewInit,
} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthFacade } from './core/facades/auth.facade';
import { Subscription } from 'rxjs';
import { GlobalNotificationService } from './core/services/global-notification.service';
import { IconService } from './core/services/icon.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: true,
  providers: [IconService], // Add IconService to providers
})
export class AppComponent implements OnInit, AfterViewInit, OnDestroy {
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
  }

  ngAfterViewInit() {
    // Register view container ref after view is initialized
    setTimeout(() => {
      this.globalNotificationSvc.registerViewContainerRef(
        this.viewContainerRef
      );
    });
  }

  ngOnDestroy() {
    if (this.langSubscription) {
      this.langSubscription.unsubscribe();
      this.langSubscription = null;
    }
  }
}
