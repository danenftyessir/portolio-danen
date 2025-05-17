"use client";

import React, { useCallback, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

interface ParticlesBackgroundProps {
  className?: string;
  quantity?: number;
  color?: string;
  speed?: number;
}

const ParticlesBackground = ({
  className,
  quantity = 50,
  color = "#6366f1",
  speed = 1,
}: ParticlesBackgroundProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const drawParticles = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // set canvas full width/height (bukan lebih besar dari viewport)
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    // particle configuration
    const particlesArray: Particle[] = [];
    for (let i = 0; i < quantity; i++) {
      const size = Math.random() * 3 + 1; // ukuran lebih kecil
      const x = Math.random() * canvas.width;
      const y = Math.random() * canvas.height;
      const directionX = Math.random() * 0.8 - 0.4; // pergerakan lebih lambat
      const directionY = Math.random() * 0.8 - 0.4;
      const opacity = Math.random() * 0.3 + 0.1; // opacity lebih rendah

      particlesArray.push(
        new Particle(
          x,
          y,
          directionX * speed,
          directionY * speed,
          size,
          color,
          opacity,
          canvas
        )
      );
    }

    // animation loop
    function animate() {
      requestAnimationFrame(animate);
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update();
        particlesArray[i].draw(ctx);
      }

      // connect particles when close
      connectParticles(particlesArray, ctx, canvas);
    }

    animate();
  }, [quantity, color, speed]);

  // handle window resize dengan throttling
  useEffect(() => {
    let resizeTimer: NodeJS.Timeout;

    const handleResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        drawParticles();
      }, 100);
    };

    drawParticles();
    window.addEventListener("resize", handleResize);

    return () => {
      clearTimeout(resizeTimer);
      window.removeEventListener("resize", handleResize);
    };
  }, [drawParticles]);

  return (
    <canvas
      ref={canvasRef}
      className={cn("absolute inset-0 z-0 h-full w-full", className)}
      style={{ pointerEvents: "none" }} // jangan menangkap mouse events
    />
  );
};

// particle class
class Particle {
  x: number;
  y: number;
  directionX: number;
  directionY: number;
  size: number;
  color: string;
  opacity: number;
  canvas: HTMLCanvasElement;

  constructor(
    x: number,
    y: number,
    directionX: number,
    directionY: number,
    size: number,
    color: string,
    opacity: number,
    canvas: HTMLCanvasElement
  ) {
    this.x = x;
    this.y = y;
    this.directionX = directionX;
    this.directionY = directionY;
    this.size = size;
    this.color = color;
    this.opacity = opacity;
    this.canvas = canvas;
  }

  // draw particle
  draw(ctx: CanvasRenderingContext2D) {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.globalAlpha = this.opacity;
    ctx.fill();
    ctx.globalAlpha = 1;
  }

  // update particle
  update() {
    // bounce off edges
    if (this.x > this.canvas.width || this.x < 0) {
      this.directionX = -this.directionX;
    }
    if (this.y > this.canvas.height || this.y < 0) {
      this.directionY = -this.directionY;
    }

    this.x += this.directionX;
    this.y += this.directionY;
  }
}

// connect particles with lines - dengan opacity lebih rendah
function connectParticles(
  particles: Particle[],
  ctx: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement
) {
  const maxDistance = 80; // jarak koneksi lebih pendek

  for (let a = 0; a < particles.length; a++) {
    for (let b = a; b < particles.length; b++) {
      const dx = particles[a].x - particles[b].x;
      const dy = particles[a].y - particles[b].y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < maxDistance) {
        // draw line with opacity based on distance
        const opacity = 1 - distance / maxDistance;
        ctx.beginPath();
        ctx.strokeStyle = `rgba(99, 102, 241, ${opacity * 0.2})`; // opacity lebih rendah
        ctx.lineWidth = 0.5; // garis lebih tipis
        ctx.moveTo(particles[a].x, particles[a].y);
        ctx.lineTo(particles[b].x, particles[b].y);
        ctx.stroke();
      }
    }
  }
}

export { ParticlesBackground };