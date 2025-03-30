"use client"

import { useEffect, useRef, useState } from "react"
import { getRegionalAirQualityData } from "@/lib/mock-data"

export function AirQualityMap() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [hoveredRegion, setHoveredRegion] = useState<string | null>(null)

  // Mock data for Delhi regions
  const regions = getRegionalAirQualityData()

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions
    canvas.width = canvas.offsetWidth
    canvas.height = canvas.offsetHeight

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
    ctx.strokeStyle = "#64748b"
    ctx.lineWidth = 2
    ctx.stroke()

    // Draw pollution hotspots
    regions.forEach((region) => {
      // Get color based on AQI
      const getColor = (aqi: number) => {
        if (aqi <= 50) return "#10b981" // green-500
        if (aqi <= 100) return "#facc15" // yellow-400
        if (aqi <= 200) return "#f97316" // orange-500
        if (aqi <= 300) return "#ef4444" // red-500
        return "#9333ea" // purple-600
      }

      const color = getColor(region.aqi)

      // Draw circle for each region
      ctx.beginPath()
      ctx.arc(
        canvas.width * region.position.x,
        canvas.height * region.position.y,
        region.aqi / 20, // Size based on AQI
        0,
        Math.PI * 2,
      )
      ctx.fillStyle = color + "80" // Add transparency
      ctx.fill()
      ctx.strokeStyle = color
      ctx.lineWidth = 2
      ctx.stroke()

      // Add region name
      ctx.font = "12px sans-serif"
      ctx.fillStyle = "#1e293b"
      ctx.textAlign = "center"
      ctx.fillText(
        region.name,
        canvas.width * region.position.x,
        canvas.height * region.position.y - region.aqi / 20 - 5,
      )
    })

    // Handle mouse move for interactivity
    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      const x = (e.clientX - rect.left) / canvas.width
      const y = (e.clientY - rect.top) / canvas.height

      // Check if mouse is over any region
      let hovered = null
      for (const region of regions) {
        const dx = x - region.position.x
        const dy = y - region.position.y
        const distance = Math.sqrt(dx * dx + dy * dy)

        if (distance < region.aqi / (20 * canvas.width)) {
          hovered = region.name
          break
        }
      }

      setHoveredRegion(hovered)
    }

    canvas.addEventListener("mousemove", handleMouseMove)

    return () => {
      canvas.removeEventListener("mousemove", handleMouseMove)
    }
  }, [regions])

  return (
    <div className="relative h-full w-full">
      <canvas ref={canvasRef} className="h-full w-full cursor-pointer" />
      {hoveredRegion && (
        <div className="absolute bottom-4 left-4 rounded-md bg-background p-3 shadow-md border">
          <p className="font-medium">{hoveredRegion}</p>
          <p className="text-sm text-muted-foreground">AQI: {regions.find((r) => r.name === hoveredRegion)?.aqi}</p>
        </div>
      )}
    </div>
  )
}

