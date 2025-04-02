import {
  Component,
  OnInit,
  OnDestroy,
  PLATFORM_ID,
  Inject,
} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthFacade } from './core/facades/auth.facade';
import { Subscription } from 'rxjs';

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
    @Inject(PLATFORM_ID) private platformId: object
  ) {}

  ngOnInit() {
    // Initialize auth first
    this.authFacade.initializeAuth();

    // No need for additional language initialization
    // since the language service constructor handles it
  }

  ngOnDestroy() {
    if (this.langSubscription) {
      this.langSubscription.unsubscribe();
      this.langSubscription = null;
    }
  }
}
