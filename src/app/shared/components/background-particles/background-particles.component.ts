import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-background-particles',
  template: `<canvas #canvas></canvas>`,
  styles: [
    `
      :host {
        position: absolute;
        inset: 0;
        z-index: 0;
      }
      canvas {
        width: 100%;
        height: 100%;
      }
    `,
  ],
  standalone: true,
})
export class BackgroundParticlesComponent implements OnInit {
  @ViewChild('canvas', { static: true }) canvas!: ElementRef<HTMLCanvasElement>;

  ngOnInit() {
    const ctx = this.canvas.nativeElement.getContext('2d');
    if (!ctx) return;

    const particles: Particle[] = [];
    const particleCount = 10; // More particles for better effect

    // Set canvas size with DPI awareness
    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = this.canvas.nativeElement.getBoundingClientRect();
      this.canvas.nativeElement.width = rect.width * dpr;
      this.canvas.nativeElement.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
    };
    window.addEventListener('resize', resize);
    resize();

    // Create particles with varied sizes
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        radius: Math.random() * 2 + 1, // Varied sizes
        speedX: (Math.random() - 0.5) * 0.15, // Slower horizontal movement
        speedY: (Math.random() - 0.5) * 0.15 + 0.1, // Slight downward drift
        opacity: Math.random() * 0.5 + 0.2,
        pulse: 0, // For pulsing effect
        pulseSpeed: Math.random() * 0.02 + 0.01, // Individual pulse speeds
      });
    }

    const animate = () => {
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

      particles.forEach((particle) => {
        // Update position
        particle.x += particle.speedX;
        particle.y += particle.speedY;

        // Pulse effect
        particle.pulse += particle.pulseSpeed;
        const pulseFactor = Math.sin(particle.pulse) * 0.3 + 0.7;

        // Wrap around screen with padding
        if (particle.x < -50) particle.x = window.innerWidth + 50;
        if (particle.x > window.innerWidth + 50) particle.x = -50;
        if (particle.y < -50) particle.y = window.innerHeight + 50;
        if (particle.y > window.innerHeight + 50) particle.y = -50;

        // Draw glowing particle
        const gradient = ctx.createRadialGradient(
          particle.x,
          particle.y,
          0,
          particle.x,
          particle.y,
          particle.radius * 3
        );

        const currentOpacity = particle.opacity * pulseFactor;
        gradient.addColorStop(0, `rgba(255, 255, 255, ${currentOpacity})`);
        gradient.addColorStop(
          0.5,
          `rgba(255, 255, 255, ${currentOpacity * 0.3})`
        );
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.radius * 3, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();
      });

      requestAnimationFrame(animate);
    };

    animate();
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
