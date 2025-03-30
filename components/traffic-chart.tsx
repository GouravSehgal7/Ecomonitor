"use client"

import { useState } from "react"
import { ChartContainer, ChartTooltip, ChartTooltipContent, XAxis, YAxis, Legend } from "@/components/ui/chart"
import { Bar, BarChart, CartesianGrid } from "recharts"

// Mock data for traffic volume and pollution correlation
const trafficData = Array.from({ length: 24 }, (_, i) => {
  const hour = i % 12 === 0 ? 12 : i % 12
  const ampm = i < 12 ? "AM" : "PM"
  const timeLabel = `${hour}${ampm}`

  // Create realistic traffic patterns
  let trafficVolume
  let pollutionLevel

  if (i >= 7 && i <= 10) {
    // Morning rush hour
    trafficVolume = 70 + Math.floor(Math.random() * 25)
    pollutionLevel = 120 + Math.floor(Math.random() * 60)
  } else if (i >= 16 && i <= 19) {
    // Evening rush hour
    trafficVolume = 75 + Math.floor(Math.random() * 20)
    pollutionLevel = 130 + Math.floor(Math.random() * 70)
  } else if (i >= 11 && i <= 15) {
    // Midday
    trafficVolume = 40 + Math.floor(Math.random() * 30)
    pollutionLevel = 80 + Math.floor(Math.random() * 40)
  } else {
    // Night/early morning
    trafficVolume = 10 + Math.floor(Math.random() * 20)
    pollutionLevel = 40 + Math.floor(Math.random() * 30)
  }

  return {
    time: timeLabel,
    traffic: trafficVolume,
    pollution: pollutionLevel,
  }
})

export function TrafficChart() {
  const [tooltipData, setTooltipData] = useState<any>(null)

  return (
    <div className="w-full h-full">
      <ChartContainer height={350} className="mt-4">
        <BarChart
          data={trafficData}
          onMouseLeave={() => setTooltipData(null)}
          onMouseMove={(data) => {
            if (data && data.activePayload) {
              setTooltipData(data.activePayload[0].payload)
            }
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#ffffff30" />
          <XAxis
            dataKey="time"
            tickLine={false}
            axisLine={{ stroke: "#FFFF00" }}
            tick={{ fontSize: 12, fill: "#FFFF00" }}
          />
          <YAxis
            yAxisId="left"
            orientation="left"
            label={{
              value: "Traffic Volume (%)",
              position: "insideLeft",
              angle: -90,
              dy: 50,
              fill: "#00FFFF",
            }}
            domain={[0, 100]}
            tickCount={6}
            tick={{ fontSize: 12, fill: "#00FFFF" }}
            axisLine={{ stroke: "#00FFFF" }}
          />
          <YAxis
            yAxisId="right"
            orientation="right"
            label={{
              value: "Pollution (AQI)",
              position: "insideRight",
              angle: 90,
              dy: -50,
              fill: "#FFFF00",
            }}
            domain={[0, 300]}
            tickCount={6}
            tick={{ fontSize: 12, fill: "#FFFF00" }}
            axisLine={{ stroke: "#FFFF00" }}
          />
          <Bar
            yAxisId="left"
            dataKey="traffic"
            fill="#00FFFF" // Bright cyan
            name="Traffic Volume"
          />
          <Bar
            yAxisId="right"
            dataKey="pollution"
            fill="#FFFF00" // Bright yellow (was magenta)
            name="Pollution Level"
          />
          <ChartTooltip
            content={
              <ChartTooltipContent
                className="bg-black/80 border-white/20"
                items={[
                  {
                    label: "Time",
                    value: tooltipData?.time,
                    color: "transparent",
                  },
                  {
                    label: "Traffic Volume",
                    value: tooltipData?.traffic + "%",
                    color: "#3b82f6",
                  },
                  {
                    label: "Pollution Level",
                    value: "AQI " + tooltipData?.pollution,
                    color: "#ef4444",
                  },
                ]}
              />
            }
          />
          <Legend verticalAlign="top" height={36} formatter={(value) => <span className="text-white">{value}</span>} />
        </BarChart>
      </ChartContainer>

      <div className="mt-4 p-3 bg-white/10 rounded-md">
        <h3 className="text-sm font-medium text-white mb-1">Key Insights</h3>
        <ul className="text-xs text-white/80 space-y-1 list-disc pl-4">
          <li>Strong correlation between traffic volume and pollution levels</li>
          <li>Morning rush hour (7-10 AM) shows 30% increase in AQI</li>
          <li>Evening rush hour (4-7 PM) shows 35% increase in AQI</li>
          <li>Pollution levels remain elevated for 2-3 hours after traffic peaks</li>
        </ul>
      </div>
    </div>
  )
}

