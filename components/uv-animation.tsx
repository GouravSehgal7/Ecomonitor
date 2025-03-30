"use client"

import { useEffect, useRef } from "react"

export function UVAnimation() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions
    const resizeCanvas = () => {
      const canvas = canvasRef.current
      if (!canvas) return
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    resizeCanvas()
    window.addEventListener("resize", resizeCanvas)

    // Sun ray class
    class SunRay {
      x: number
      y: number
      length: number
      angle: number
      width: number
      speed: number
      color: string
      opacity: number

      constructor() {
        this.x = Math.random() * window.innerWidth
        this.y = -100 // Start above the canvas
        this.length = Math.random() * 300 + 200
        this.angle = (Math.random() * Math.PI) / 4 - Math.PI / 8 // Slight angle variation
        this.width = Math.random() * 5 + 2
        this.speed = Math.random() * 2 + 1
        this.color = this.getRandomColor()
        this.opacity = Math.random() * 0.3 + 0.1
      }

      getRandomColor() {
        const colors = [
          "rgba(255, 255, 0, ", // Yellow
          "rgba(255, 165, 0, ", // Orange
          "rgba(255, 69, 0, ", // Red-Orange
          "rgba(255, 215, 0, ", // Gold
        ]
        return colors[Math.floor(Math.random() * colors.length)]
      }

      update() {
        this.y += this.speed

        // Reset if off screen
        if (this.y > window.innerHeight + 100) {
          this.y = -100
          this.x = Math.random() * window.innerWidth
          this.color = this.getRandomColor()
          this.opacity = Math.random() * 0.3 + 0.1
        }
      }

      draw(ctx: CanvasRenderingContext2D) {
        ctx.save()
        ctx.translate(this.x, this.y)
        ctx.rotate(this.angle)

        // Create gradient for ray
        const gradient = ctx.createLinearGradient(0, 0, 0, this.length)
        gradient.addColorStop(0, this.color + this.opacity + ")")
        gradient.addColorStop(1, this.color + "0)")

        ctx.fillStyle = gradient
        ctx.fillRect(-this.width / 2, 0, this.width, this.length)

        ctx.restore()
      }
    }

    // UV particle class
    class UVParticle {
      x: number
      y: number
      size: number
      speed: number
      color: string

      constructor() {
        this.x = Math.random() * window.innerWidth
        this.y = Math.random() * window.innerHeight
        this.size = Math.random() * 3 + 1
        this.speed = Math.random() * 1 + 0.5
        this.color = this.getRandomColor()
      }

      getRandomColor() {
        const colors = [
          "#FFFF00", // Yellow
          "#FFA500", // Orange
          "#FF4500", // Red-Orange
          "#FFD700", // Gold
          "#FFFFFF", // White
        ]
        return colors[Math.floor(Math.random() * colors.length)]
      }

      update() {
        this.y += this.speed

        // Reset if off screen
        if (this.y > window.innerHeight) {
          this.y = 0
          this.x = Math.random() * window.innerWidth
        }
      }

      draw(ctx: CanvasRenderingContext2D) {
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
        ctx.fillStyle = this.color
        ctx.fill()
      }
    }

    // Create sun rays
    const rays: SunRay[] = Array.from({ length: 20 }, () => new SunRay())

    // Create UV particles
    const particles: UVParticle[] = Array.from({ length: 100 }, () => new UVParticle())

    let animationFrameId: number

    // Animation loop
    const animate = () => {
      const canvas = canvasRef.current
      if (!canvas) return
      const ctx = canvas.getContext("2d")
      if (!ctx) return

      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Create gradient background
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height)
      gradient.addColorStop(0, "rgba(255, 165, 0, 0.3)") // Orange
      gradient.addColorStop(0.5, "rgba(255, 69, 0, 0.2)") // Red-Orange
      gradient.addColorStop(1, "rgba(0, 0, 0, 0)")

      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Update and draw rays
      rays.forEach((ray) => {
        ray.update()
        ray.draw(ctx)
      })

      // Update and draw particles
      particles.forEach((particle) => {
        particle.update()
        particle.draw(ctx)
      })

      // Draw sun
      const sunGradient = ctx.createRadialGradient(canvas.width / 2, -100, 0, canvas.width / 2, -100, 200)
      sunGradient.addColorStop(0, "rgba(255, 255, 0, 0.8)")
      sunGradient.addColorStop(0.5, "rgba(255, 165, 0, 0.6)")
      sunGradient.addColorStop(1, "rgba(255, 69, 0, 0)")

      ctx.beginPath()
      ctx.arc(canvas.width / 2, -100, 200, 0, Math.PI * 2)
      ctx.fillStyle = sunGradient
      ctx.fill()

      animationFrameId = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener("resize", resizeCanvas)
      cancelAnimationFrame(animationFrameId)
    }
  }, [])

  return <canvas ref={canvasRef} className="fixed top-0 left-0 w-full h-full -z-10" />
}
