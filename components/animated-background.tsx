"use client";

import { useEffect, useRef } from "react";

export function AnimatedBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const resizeCanvas = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Particle class
    class Particle {
      "x": number;
      "y": number;
      "size": number;
      "speedX": number;
      "speedY": number;
      "color": string;
      "opacity": number;
      "type": "smoke" | "dust" | "vehicle";

      constructor(type: "smoke" | "dust" | "vehicle") {
        const canvas = canvasRef.current;
        if (!canvas) return;

        this.type = type;

        if (type === "smoke") {
          this.x = Math.random() * canvas.width;
          this.y = canvas.height + 10;
          this.size = Math.random() * 5 + 2;
          this.speedX = Math.random() * 2 - 1;
          this.speedY = -Math.random() * 2 - 1;
          this.color = `hsl(${Math.random() * 20 + 200}, 10%, 50%)`;
          this.opacity = Math.random() * 0.5 + 0.1;
        } else if (type === "dust") {
          this.x = Math.random() * canvas.width;
          this.y = Math.random() * canvas.height;
          this.size = Math.random() * 3 + 1;
          this.speedX = Math.random() * 1 - 0.5;
          this.speedY = Math.random() * 1 - 0.5;
          this.color = `hsl(${Math.random() * 60 + 30}, 70%, 60%)`;
          this.opacity = Math.random() * 0.3 + 0.1;
        } else {
          this.x = -50;
          this.y = canvas.height - 100 + Math.random() * 60;
          this.size = Math.random() * 10 + 15;
          this.speedX = Math.random() * 3 + 2;
          this.speedY = 0;
          this.color = `hsl(${Math.random() * 360}, 70%, 50%)`;
          this.opacity = 0.8;
        }
      }

      update() {
        const canvas = canvasRef.current;
        if (!canvas) return;

        this.x += this.speedX;
        this.y += this.speedY;

        if (this.type === "smoke") {
          this.opacity -= 0.005;
          if (this.y < 0 || this.opacity <= 0) {
            this.x = Math.random() * canvas.width;
            this.y = canvas.height + 10;
            this.opacity = Math.random() * 0.5 + 0.1;
          }
        } else if (this.type === "dust") {
          if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
          }
        } else {
          if (this.x > canvas.width + 50) {
            this.x = -50;
            this.y = canvas.height - 100 + Math.random() * 60;
            this.color = `hsl(${Math.random() * 360}, 70%, 50%)`;
          }
        }
      }

      draw() {
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext("2d");
        if (!ctx) return;

        ctx.globalAlpha = this.opacity;

        if (this.type === "smoke" || this.type === "dust") {
          ctx.beginPath();
          ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
          ctx.fillStyle = this.color;
          ctx.fill();
        } else {
          ctx.fillStyle = this.color;
          ctx.fillRect(this.x, this.y, this.size * 2, this.size);

          ctx.fillStyle = "#a8d8ff";
          ctx.fillRect(this.x + this.size * 0.5, this.y + 2, this.size, this.size * 0.4);

          ctx.fillStyle = "#333";
          ctx.beginPath();
          ctx.arc(this.x + this.size * 0.5, this.y + this.size, this.size * 0.3, 0, Math.PI * 2);
          ctx.fill();
          ctx.beginPath();
          ctx.arc(this.x + this.size * 1.5, this.y + this.size, this.size * 0.3, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.globalAlpha = 1;
      }
    }

    const smokeParticles: Particle[] = Array.from({ length: 50 }, () => new Particle("smoke"));
    const dustParticles: Particle[] = Array.from({ length: 100 }, () => new Particle("dust"));
    const vehicleParticles: Particle[] = Array.from({ length: 5 }, () => new Particle("vehicle"));

    const animate = () => {
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext("2d");
      if (!canvas || !ctx) return;

      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      gradient.addColorStop(0, "#1a365d");
      gradient.addColorStop(0.5, "#7c3aed");
      gradient.addColorStop(1, "#ef4444");

      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = "#333";
      ctx.fillRect(0, canvas.height - 80, canvas.width, 80);

      ctx.strokeStyle = "#fff";
      ctx.setLineDash([20, 20]);
      ctx.beginPath();
      ctx.moveTo(0, canvas.height - 40);
      ctx.lineTo(canvas.width, canvas.height - 40);
      ctx.stroke();
      ctx.setLineDash([]);

      [...smokeParticles, ...dustParticles, ...vehicleParticles].forEach((particle) => {
        particle.update();
        particle.draw();
      });

      requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
    };
  }, []);

  return <canvas ref={canvasRef} className="fixed top-0 left-0 w-full h-full -z-10" />;
}
