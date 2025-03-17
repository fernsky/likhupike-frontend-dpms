import {
  Directive,
  ElementRef,
  HostListener,
  Input,
  OnInit,
} from '@angular/core';
import { animate, AnimationBuilder, style } from '@angular/animations';

@Directive({
  selector: '[appScrollToTop]',
  standalone: true,
})
export class ScrollToTopDirective implements OnInit {
  @Input() scrollBehavior: 'smooth' | 'auto' = 'smooth';
  @Input() showAfterHeight = 400; // Show button after scrolling this many pixels
  @Input() animationDuration = 300; // Duration in milliseconds

  private targetElement: HTMLElement | Window;

  constructor(
    private el: ElementRef,
    private animationBuilder: AnimationBuilder,
  ) {
    this.targetElement = window;
  }

  ngOnInit() {
    // Hide button initially
    this.el.nativeElement.style.display = 'none';
    this.el.nativeElement.setAttribute('aria-label', 'Scroll to top');
    this.el.nativeElement.setAttribute('role', 'button');
    this.el.nativeElement.setAttribute('tabindex', '0');

    // Listen to scroll events
    window.addEventListener('scroll', this.checkScroll.bind(this));
  }

  @HostListener('click')
  @HostListener('keydown.enter')
  @HostListener('keydown.space', ['$event'])
  onClick(event?: KeyboardEvent) {
    if (event) {
      event.preventDefault();
    }
    this.scrollToTop();
  }

  private checkScroll() {
    const scrollPosition =
      window.pageYOffset ||
      document.documentElement.scrollTop ||
      document.body.scrollTop ||
      0;

    // Toggle button visibility based on scroll position
    if (scrollPosition > this.showAfterHeight) {
      this.el.nativeElement.style.display = 'block';
      // Create fade-in animation
      const fadeIn = this.animationBuilder.build([
        style({ opacity: 0 }),
        animate(200, style({ opacity: 1 })),
      ]);
      const player = fadeIn.create(this.el.nativeElement);
      player.play();
    } else {
      this.el.nativeElement.style.display = 'none';
    }
  }

  private scrollToTop() {
    if (this.scrollBehavior === 'smooth') {
      // Animated scroll
      const scrollOptions: ScrollToOptions = {
        top: 0,
        behavior: 'smooth',
      };
      window.scrollTo(scrollOptions);
    } else {
      // Instant scroll
      window.scrollTo(0, 0);
    }

    // Announce for screen readers
    this.announceForScreenReader('Scrolling to top of page');
  }

  private announceForScreenReader(message: string) {
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', 'polite');
    announcement.setAttribute('class', 'sr-only');
    announcement.textContent = message;
    document.body.appendChild(announcement);

    // Remove after announcement
    setTimeout(() => {
      document.body.removeChild(announcement);
    }, 1000);
  }

  ngOnDestroy() {
    window.removeEventListener('scroll', this.checkScroll.bind(this));
  }
}
