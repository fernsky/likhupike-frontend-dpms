import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';

@Component({
  selector: 'app-background-particles',
  template: `<canvas #canvas></canvas>`,
  styles: [
    `
      :host {
        position: absolute;
        inset: 0;
        z-index: 0;
        overflow: hidden;
      }
      canvas {
        position: absolute;
        width: 100%;
        height: 100%;
        left: 0;
        top: 0;
      }
    `,
  ],
  standalone: true,
})
export class BackgroundParticlesComponent implements OnInit, OnDestroy {
  @ViewChild('canvas', { static: true }) canvas!: ElementRef<HTMLCanvasElement>;
  private animationFrame: number = 0;
  private ctx: CanvasRenderingContext2D | null = null;
  private particles: Particle[] = [];
  private bounds = { width: 0, height: 0 };
  private resizeObserver: ResizeObserver | null = null;

  ngOnInit() {
    this.ctx = this.canvas.nativeElement.getContext('2d', { alpha: true });
    if (!this.ctx) return;

    this.initParticles();
    this.setupResizeObserver();
    this.animate();
  }

  ngOnDestroy() {
    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame);
    }
    this.resizeObserver?.disconnect();
  }

  private initParticles() {
    const particleCount = 15;
    this.particles = Array.from({ length: particleCount }, () =>
      this.createParticle()
    );
  }

  private createParticle(x?: number, y?: number): Particle {
    return {
      x: x ?? Math.random() * this.bounds.width,
      y: y ?? Math.random() * this.bounds.height,
      radius: Math.random() * 1.5 + 0.5,
      speedX: (Math.random() - 0.5) * 0.15,
      speedY: (Math.random() - 0.5) * 0.15,
      opacity: Math.random() * 0.35 + 0.15,
      pulse: Math.random() * Math.PI * 2,
      pulseSpeed: Math.random() * 0.015 + 0.005,
    };
  }

  private setupResizeObserver() {
    this.resizeObserver = new ResizeObserver(() => {
      this.updateCanvasSize();
    });
    this.resizeObserver.observe(this.canvas.nativeElement);
    this.updateCanvasSize();
  }

  private updateCanvasSize() {
    if (!this.ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = this.canvas.nativeElement.getBoundingClientRect();

    this.bounds = {
      width: rect.width,
      height: rect.height,
    };

    this.canvas.nativeElement.width = rect.width * dpr;
    this.canvas.nativeElement.height = rect.height * dpr;
    this.ctx.scale(dpr, dpr);

    // Reset particles within bounds
    this.particles = this.particles.map((p) => {
      if (p.x > this.bounds.width || p.y > this.bounds.height) {
        return this.createParticle();
      }
      return p;
    });
  }

  private animate = () => {
    if (!this.ctx || !this.bounds.width || !this.bounds.height) return;

    this.ctx.clearRect(0, 0, this.bounds.width, this.bounds.height);

    this.particles.forEach((particle) => {
      // Update position
      particle.x += particle.speedX;
      particle.y += particle.speedY;
      particle.pulse += particle.pulseSpeed;

      // Handle boundaries with smooth wrapping
      if (particle.x < -50) {
        particle = this.createParticle(this.bounds.width + 50, particle.y);
      } else if (particle.x > this.bounds.width + 50) {
        particle = this.createParticle(-50, particle.y);
      }

      if (particle.y < -50) {
        particle = this.createParticle(particle.x, this.bounds.height + 50);
      } else if (particle.y > this.bounds.height + 50) {
        particle = this.createParticle(particle.x, -50);
      }

      // Draw particle with smooth pulsing
      const pulseFactor = Math.sin(particle.pulse) * 0.3 + 0.7;
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

      gradient.addColorStop(0, `rgba(255, 255, 255, ${currentOpacity})`);
      gradient.addColorStop(
        0.6,
        `rgba(255, 255, 255, ${currentOpacity * 0.2})`
      );
      gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

      this.ctx.beginPath();
      this.ctx.arc(particle.x, particle.y, particle.radius * 4, 0, Math.PI * 2);
      this.ctx.fillStyle = gradient;
      this.ctx.fill();
    });

    this.animationFrame = requestAnimationFrame(this.animate);
  };
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
