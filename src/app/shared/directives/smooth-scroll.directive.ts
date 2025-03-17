import { Directive, ElementRef } from '@angular/core';

@Directive({
  selector: '[smoothScroll]',
  standalone: true,
})
export class SmoothScrollDirective {
  constructor(private el: ElementRef) {
    this.el.nativeElement.style.scrollBehavior = 'smooth';
  }
}
