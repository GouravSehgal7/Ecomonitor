"use client";

import { useEffect, useRef } from "react";

export function WaterAnimation() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas dimensions
    const resizeCanvas = () => {
      const canvas = canvasRef.current; // Re-fetch inside function to avoid null reference
      if (!canvas) return;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Bubble class
    class Bubble {
      "x": number;
      "y": number;
      "radius": number;
      "speed": number;
      "opacity": number;
      "color": string;

      constructor() {
        const canvas = canvasRef.current;
        if (!canvas) return;

        this.x = Math.random() * canvas.width;
        this.y = canvas.height + Math.random() * 100;
        this.radius = Math.random() * 8 + 2;
        this.speed = Math.random() * 2 + 0.5;
        this.opacity = Math.random() * 0.5 + 0.1;
        this.color = `rgba(255, 255, 255, ${this.opacity})`;
      }

      update() {
        const canvas = canvasRef.current;
        if (!canvas) return;

        this.y -= this.speed;
        this.x += Math.sin(this.y * 0.01) * 0.5;

        if (this.y < -this.radius * 2) {
          this.y = canvas.height + Math.random() * 100;
          this.x = Math.random() * canvas.width;
        }
      }

      draw(ctx: CanvasRenderingContext2D) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();

        ctx.beginPath();
        ctx.arc(this.x - this.radius * 0.3, this.y - this.radius * 0.3, this.radius * 0.2, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
        ctx.fill();
      }
    }

    // Wave class
    class Wave {
      points: { x: number; y: number }[];
      height: number;
      segment: number;
      wavelength: number;
      amplitude: number;
      speed: number;
      color: string;
      offset: number;

      constructor(height: number, wavelength: number, amplitude: number, speed: number, color: string) {
        this.height = height;
        this.wavelength = wavelength;
        this.amplitude = amplitude;
        this.speed = speed;
        this.color = color;
        this.offset = 0;

        this.segment = 10;
        this.points = [];

        const canvas = canvasRef.current;
        if (!canvas) return;

        for (let x = 0; x <= canvas.width + this.segment; x += this.segment) {
          this.points.push({ x, y: 0 });
        }
      }

      update() {
        this.offset += this.speed;

        for (let i = 0; i < this.points.length; i++) {
          const point = this.points[i];
          point.y = Math.sin((point.x + this.offset) / this.wavelength) * this.amplitude + this.height;
        }
      }

      draw(ctx: CanvasRenderingContext2D) {
        ctx.beginPath();
        ctx.moveTo(0, window.innerHeight); // Use window.innerHeight instead of canvas.height to avoid null errors

        for (const point of this.points) {
          ctx.lineTo(point.x, point.y);
        }

        ctx.lineTo(window.innerWidth, window.innerHeight);
        ctx.closePath();

        const gradient = ctx.createLinearGradient(0, 0, 0, window.innerHeight);
        gradient.addColorStop(0, this.color);
        gradient.addColorStop(1, "rgba(0, 0, 0, 0)");

        ctx.fillStyle = gradient;
        ctx.fill();
      }
    }

    // Create bubbles
    const bubbles: Bubble[] = Array.from({ length: 100 }, () => new Bubble());

    // Create waves
    const waves: Wave[] = [
      new Wave(window.innerHeight * 0.85, 200, 20, 0.5, "rgba(0, 120, 255, 0.2)"),
      new Wave(window.innerHeight * 0.8, 150, 15, 0.7, "rgba(0, 150, 255, 0.2)"),
      new Wave(window.innerHeight * 0.75, 100, 10, 1, "rgba(0, 180, 255, 0.2)"),
    ];

    let animationFrameId: number;

    const animate = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Background gradient
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      gradient.addColorStop(0, "rgba(0, 50, 100, 0.3)");
      gradient.addColorStop(0.5, "rgba(0, 100, 150, 0.3)");
      gradient.addColorStop(1, "rgba(0, 150, 200, 0.3)");

      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Update and draw elements
      waves.forEach((wave) => {
        wave.update();
        wave.draw(ctx);
      });

      bubbles.forEach((bubble) => {
        bubble.update();
        bubble.draw(ctx);
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return <canvas ref={canvasRef} className="fixed top-0 left-0 w-full h-full -z-10" />;
}
