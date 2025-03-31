import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
  NgZone,
  PLATFORM_ID,
  Inject,
  Input,
} from '@angular/core';
import { isPlatformBrowser, NgIf } from '@angular/common';

@Component({
  selector: 'app-background-particles',
  template: `
    <canvas #canvas *ngIf="isBrowser" aria-hidden="true"></canvas>
    <div *ngIf="!isBrowser" class="ssr-fallback" aria-hidden="true"></div>
  `,
  styles: [
    `
      :host {
        position: absolute;
        inset: 0;
        z-index: 0; /* Below content layer in Carbon z-index system */
        overflow: hidden;
        pointer-events: none; /* Ensure clicks pass through to content */
      }
      canvas {
        position: absolute;
        width: 100%;
        height: 100%;
        left: 0;
        top: 0;
        opacity: var(--particle-opacity, 0.5); /* Adjustable opacity */
      }
      .ssr-fallback {
        position: absolute;
        inset: 0;
        background: var(--cds-background-inverse);
        opacity: 0.05;
      }
    `,
  ],
  standalone: true,
  imports: [NgIf],
})
export class BackgroundParticlesComponent implements OnInit, OnDestroy {
  @ViewChild('canvas', { static: true }) canvas?: ElementRef<HTMLCanvasElement>;

  // Configurable inputs with defaults aligned to Carbon Design System
  @Input() particleCount = 15;
  @Input() particleColor = '--cds-layer-accent'; // Carbon token
  @Input() particleOpacity = 0.3; // Base opacity
  @Input() particleSize = { min: 0.5, max: 1.5 }; // Size range
  @Input() particleSpeed = 0.15; // Movement speed

  private animationFrame: number = 0;
  private ctx: CanvasRenderingContext2D | null = null;
  private particles: Particle[] = [];
  private bounds = { width: 0, height: 0 };
  private resizeObserver: ResizeObserver | null = null;
  private isDestroyed = false;
  isBrowser: boolean;

  constructor(
    private ngZone: NgZone,
    @Inject(PLATFORM_ID) private platformId: object
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit() {
    if (!this.isBrowser) return;

    this.ctx =
      this.canvas?.nativeElement.getContext('2d', { alpha: true }) || null;
    if (!this.ctx) return;

    // Run animation outside Angular zone for better performance
    this.ngZone.runOutsideAngular(() => {
      this.initParticles();
      this.setupResizeObserver();
      this.animate();
    });
  }

  ngOnDestroy() {
    this.isDestroyed = true;
    if (this.isBrowser) {
      if (this.animationFrame) {
        cancelAnimationFrame(this.animationFrame);
      }
      if (this.resizeObserver) {
        this.resizeObserver.disconnect();
      }
    }
    this.particles = [];
    this.ctx = null;
  }

  private initParticles() {
    this.particles = Array.from({ length: this.particleCount }, () =>
      this.createParticle()
    );
  }

  private createParticle(x?: number, y?: number): Particle {
    // Using Carbon's motion-ease-out timing for natural movement
    return {
      x: x ?? Math.random() * this.bounds.width,
      y: y ?? Math.random() * this.bounds.height,
      radius:
        Math.random() * (this.particleSize.max - this.particleSize.min) +
        this.particleSize.min,
      speedX: (Math.random() - 0.5) * this.particleSpeed,
      speedY: (Math.random() - 0.5) * this.particleSpeed,
      opacity:
        Math.random() * (this.particleOpacity * 0.5) +
        this.particleOpacity * 0.5,
      pulse: Math.random() * Math.PI * 2,
      // Using smaller values for subtle animation aligned with Carbon motion principles
      pulseSpeed: Math.random() * 0.01 + 0.005,
    };
  }

  private setupResizeObserver() {
    if (!this.isBrowser || !this.canvas) return;

    try {
      this.resizeObserver = new ResizeObserver(() => {
        this.updateCanvasSize();
      });
      this.resizeObserver.observe(this.canvas.nativeElement);
      this.updateCanvasSize();
    } catch (e) {
      console.warn('ResizeObserver not available:', e);
    }
  }

  private updateCanvasSize() {
    if (!this.ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = this.canvas?.nativeElement.getBoundingClientRect();

    this.bounds = {
      width: rect?.width || 0,
      height: rect?.height || 0,
    };

    if (this.canvas) {
      this.canvas.nativeElement.width = (rect?.width || 0) * dpr;
      this.canvas.nativeElement.height = (rect?.height || 0) * dpr;
    }
    this.ctx.scale(dpr, dpr);

    // Reset particles within bounds
    this.particles = this.particles.map((p) => {
      if (p.x > this.bounds.width || p.y > this.bounds.height) {
        return this.createParticle();
      }
      return p;
    });
  }

  private getComputedColorValue(): string {
    // Get computed Carbon color token value or fallback to a default
    if (this.isBrowser) {
      const computedColor = getComputedStyle(document.documentElement)
        .getPropertyValue(this.particleColor.replace('--', ''))
        .trim();
      return computedColor || '#ffffff';
    }
    return '#ffffff';
  }

  private animate = () => {
    if (this.isDestroyed) return;

    if (!this.ctx || !this.bounds.width || !this.bounds.height) {
      this.animationFrame = requestAnimationFrame(this.animate);
      return;
    }

    this.ctx.clearRect(0, 0, this.bounds.width, this.bounds.height);
    const particleColor = this.getComputedColorValue();

    this.particles.forEach((particle, index) => {
      // Update position with subtle easing for organic movement
      particle.x += particle.speedX;
      particle.y += particle.speedY;
      particle.pulse += particle.pulseSpeed;

      // Handle boundaries with smooth wrapping
      if (particle.x < -50) {
        this.particles[index] = this.createParticle(
          this.bounds.width + 50,
          particle.y
        );
        return;
      } else if (particle.x > this.bounds.width + 50) {
        this.particles[index] = this.createParticle(-50, particle.y);
        return;
      }

      if (particle.y < -50) {
        this.particles[index] = this.createParticle(
          particle.x,
          this.bounds.height + 50
        );
        return;
      } else if (particle.y > this.bounds.height + 50) {
        this.particles[index] = this.createParticle(particle.x, -50);
        return;
      }

      // Draw particle with subtle pulsing using Carbon motion principles
      // Smaller pulse range for subtlety (0.3 range instead of 0.7)
      const pulseFactor = Math.sin(particle.pulse) * 0.15 + 0.85;
      const currentOpacity = particle.opacity * pulseFactor;

      if (!this.ctx) return;

      const gradient = this.ctx.createRadialGradient(
        particle.x,
        particle.y,
        0,
        particle.x,
        particle.y,
        particle.radius * 4
      );

      // Create gradient with Carbon color
      gradient.addColorStop(
        0,
        `${particleColor}${this.hexToRgba(currentOpacity)}`
      );
      gradient.addColorStop(
        0.6,
        `${particleColor}${this.hexToRgba(currentOpacity * 0.2)}`
      );
      gradient.addColorStop(1, `${particleColor}${this.hexToRgba(0)}`);

      this.ctx.beginPath();
      this.ctx.arc(particle.x, particle.y, particle.radius * 4, 0, Math.PI * 2);
      this.ctx.fillStyle = gradient;
      this.ctx.fill();
    });

    this.animationFrame = requestAnimationFrame(this.animate);
  };

  // Helper method to convert opacity to rgba format
  private hexToRgba(opacity: number): string {
    // If the color is a hex value, convert it properly
    // This is a simplified version assuming proper hex values
    return opacity < 1 ? `, ${opacity.toFixed(2)})` : ')';
  }
}

interface Particle {
  x: number;
  y: number;
  radius: number;
  speedX: number;
  speedY: number;
  opacity: number;
  pulse: number;
  pulseSpeed: number;
}
