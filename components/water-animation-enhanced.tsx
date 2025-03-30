"use client"

import { useEffect, useRef } from "react"

export function WaterAnimationEnhanced() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions
    const resizeCanvas = () => {
      if (!canvas) return
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    resizeCanvas()
    window.addEventListener("resize", resizeCanvas)

    class Bubble {
      "y": number
      "x": number
      "radius": number
     "speed": number
      "opacity": number
      "color": string

      constructor() {
        if (!canvas) return
        this.x = Math.random() * canvas.width
        this.y = canvas.height + Math.random() * 100
        this.radius = Math.random() * 8 + 2
        this.speed = Math.random() * 2 + 0.5
        this.opacity = Math.random() * 0.5 + 0.1
        this.color = `rgba(255, 255, 255, ${this.opacity})`
      }

      update() {
        this.y -= this.speed
        this.x += Math.sin(this.y * 0.01) * 0.5

        if (canvas && this.y < -this.radius * 2) {
          this.y = canvas.height + Math.random() * 100
          this.x = Math.random() * canvas.width
        }
      }

      draw() {
        if (!ctx) return
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2)
        ctx.fillStyle = this.color
        ctx.fill()
      }
    }

    // Create bubbles
    const bubbles: Bubble[] = []
    for (let i = 0; i < 100; i++) {
      bubbles.push(new Bubble())
    }

    // Animation loop
    const animate = () => {
      if (!ctx || !canvas) return

      ctx.clearRect(0, 0, canvas.width, canvas.height)

      bubbles.forEach((bubble) => {
        bubble.update()
        bubble.draw()
      })

      requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener("resize", resizeCanvas)
    }
  }, [])

  return <canvas ref={canvasRef} className="fixed top-0 left-0 w-full h-full -z-10" />
}
