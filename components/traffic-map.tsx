"use client"

import { useEffect, useRef, useState } from "react"

interface TrafficPoint {
  x: number
  y: number
  level: "low" | "medium" | "high" | "severe"
  name: string
}

export function TrafficMap() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [hoveredPoint, setHoveredPoint] = useState<TrafficPoint | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions
    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
    }

    resizeCanvas()
    window.addEventListener("resize", resizeCanvas)

    // Traffic data points
    const trafficPoints: TrafficPoint[] = [
      { x: 0.3, y: 0.2, level: "high", name: "North Delhi" },
      { x: 0.5, y: 0.3, level: "severe", name: "Central Delhi" },
      { x: 0.7, y: 0.25, level: "medium", name: "East Delhi" },
      { x: 0.2, y: 0.5, level: "medium", name: "West Delhi" },
      { x: 0.5, y: 0.5, level: "severe", name: "Connaught Place" },
      { x: 0.8, y: 0.4, level: "high", name: "Noida Border" },
      { x: 0.6, y: 0.6, level: "high", name: "South Delhi" },
      { x: 0.3, y: 0.7, level: "low", name: "South West Delhi" },
      { x: 0.7, y: 0.7, level: "medium", name: "Faridabad Border" },
    ]

    // Get color based on traffic level
    const getColor = (level: string) => {
      switch (level) {
        case "low":
          return "#84cc16"
        case "medium":
          return "#facc15"
        case "high":
          return "#f97316"
        case "severe":
          return "#ef4444"
        default:
          return "#84cc16"
      }
    }

    // Draw function
    const draw = () => {
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Draw Delhi map outline (simplified)
      ctx.beginPath()
      ctx.moveTo(canvas.width * 0.2, canvas.height * 0.2)
      ctx.lineTo(canvas.width * 0.8, canvas.height * 0.2)
      ctx.lineTo(canvas.width * 0.9, canvas.height * 0.5)
      ctx.lineTo(canvas.width * 0.7, canvas.height * 0.8)
      ctx.lineTo(canvas.width * 0.3, canvas.height * 0.8)
      ctx.lineTo(canvas.width * 0.1, canvas.height * 0.5)
      ctx.closePath()
      ctx.fillStyle = "rgba(255, 255, 255, 0.1)"
      ctx.fill()
      ctx.strokeStyle = "rgba(255, 255, 255, 0.3)"
      ctx.lineWidth = 2
      ctx.stroke()

      // Draw roads
      ctx.strokeStyle = "rgba(255, 255, 255, 0.5)"
      ctx.lineWidth = 3

      // Horizontal roads
      ctx.beginPath()
      ctx.moveTo(canvas.width * 0.1, canvas.height * 0.3)
      ctx.lineTo(canvas.width * 0.9, canvas.height * 0.3)
      ctx.stroke()

      ctx.beginPath()
      ctx.moveTo(canvas.width * 0.1, canvas.height * 0.5)
      ctx.lineTo(canvas.width * 0.9, canvas.height * 0.5)
      ctx.stroke()

      ctx.beginPath()
      ctx.moveTo(canvas.width * 0.2, canvas.height * 0.7)
      ctx.lineTo(canvas.width * 0.8, canvas.height * 0.7)
      ctx.stroke()

      // Vertical roads
      ctx.beginPath()
      ctx.moveTo(canvas.width * 0.3, canvas.height * 0.1)
      ctx.lineTo(canvas.width * 0.3, canvas.height * 0.9)
      ctx.stroke()

      ctx.beginPath()
      ctx.moveTo(canvas.width * 0.5, canvas.height * 0.1)
      ctx.lineTo(canvas.width * 0.5, canvas.height * 0.9)
      ctx.stroke()

      ctx.beginPath()
      ctx.moveTo(canvas.width * 0.7, canvas.height * 0.1)
      ctx.lineTo(canvas.width * 0.7, canvas.height * 0.9)
      ctx.stroke()

      // Draw traffic points
      trafficPoints.forEach((point) => {
        const x = point.x * canvas.width
        const y = point.y * canvas.height
        const color = getColor(point.level)

        // Draw traffic heat circle
        const gradient = ctx.createRadialGradient(x, y, 5, x, y, 40)
        gradient.addColorStop(0, `${color}`)
        gradient.addColorStop(1, "rgba(0, 0, 0, 0)")

        ctx.beginPath()
        ctx.fillStyle = gradient
        ctx.arc(x, y, 40, 0, Math.PI * 2)
        ctx.fill()

        // Draw point
        ctx.beginPath()
        ctx.arc(x, y, 8, 0, Math.PI * 2)
        ctx.fillStyle = color
        ctx.fill()
        ctx.strokeStyle = "white"
        ctx.lineWidth = 2
        ctx.stroke()

        // Draw name if hovered
        if (hoveredPoint === point) {
          ctx.font = "14px sans-serif"
          ctx.fillStyle = "white"
          ctx.textAlign = "center"
          ctx.fillText(point.name, x, y - 20)

          // Draw traffic level
          ctx.font = "12px sans-serif"
          ctx.fillText(`Traffic: ${point.level.charAt(0).toUpperCase() + point.level.slice(1)}`, x, y - 5)
        }
      })
    }

    // Handle mouse move
    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      const x = (e.clientX - rect.left) / canvas.width
      const y = (e.clientY - rect.top) / canvas.height

      // Check if mouse is over any point
      let hovered = null
      for (const point of trafficPoints) {
        const dx = x - point.x
        const dy = y - point.y
        const distance = Math.sqrt(dx * dx + dy * dy)

        if (distance < 0.03) {
          hovered = point
          break
        }
      }

      setHoveredPoint(hovered)
    }

    canvas.addEventListener("mousemove", handleMouseMove)

    // Animation loop
    const animate = () => {
      draw()
      requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener("resize", resizeCanvas)
      canvas.removeEventListener("mousemove", handleMouseMove)
    }
  }, [hoveredPoint])

  return (
    <div className="relative h-full w-full">
      <canvas ref={canvasRef} className="h-full w-full cursor-pointer" />
      <div className="absolute bottom-4 left-4 flex gap-4">
        <div className="flex items-center gap-1">
          <div className="h-3 w-3 rounded-full bg-green-500" />
          <span className="text-xs text-white">Low</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="h-3 w-3 rounded-full bg-yellow-400" />
          <span className="text-xs text-white">Medium</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="h-3 w-3 rounded-full bg-orange-500" />
          <span className="text-xs text-white">High</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="h-3 w-3 rounded-full bg-red-500" />
          <span className="text-xs text-white">Severe</span>
        </div>
      </div>
    </div>
  )
}

