import {
  Directive,
  ElementRef,
  HostListener,
  Input,
  Renderer2,
} from '@angular/core';

@Directive({
  selector: '[appHighlightOnHover]',
})
export class HighlightOnHoverDirective {
  @Input() highlightClass = 'highlight';
  @Input() hoverScale = '1.02';

  private readonly defaultTransition = 'all 0.3s ease';
  private readonly defaultTransform = 'scale(1)';

  constructor(
    private el: ElementRef,
    private renderer: Renderer2,
  ) {
    this.setInitialStyles();
  }

  private setInitialStyles(): void {
    this.renderer.setStyle(
      this.el.nativeElement,
      'transition',
      this.defaultTransition,
    );
    this.renderer.setStyle(
      this.el.nativeElement,
      'transform',
      this.defaultTransform,
    );
    this.renderer.setStyle(this.el.nativeElement, 'will-change', 'transform');
  }

  @HostListener('mouseenter')
  onMouseEnter(): void {
    this.renderer.addClass(this.el.nativeElement, this.highlightClass);
    this.renderer.setStyle(
      this.el.nativeElement,
      'transform',
      `scale(${this.hoverScale})`,
    );
  }

  @HostListener('mouseleave')
  onMouseLeave(): void {
    this.renderer.removeClass(this.el.nativeElement, this.highlightClass);
    this.renderer.setStyle(
      this.el.nativeElement,
      'transform',
      this.defaultTransform,
    );
  }

  @HostListener('focusin')
  onFocusIn(): void {
    this.onMouseEnter();
  }

  @HostListener('focusout')
  onFocusOut(): void {
    this.onMouseLeave();
  }
}
