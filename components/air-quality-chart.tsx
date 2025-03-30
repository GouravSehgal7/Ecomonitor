"use client"

import { useState } from "react"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { getHourlyAirQualityData, getDailyAirQualityData } from "@/lib/mock-data"
import { Bar, BarChart, CartesianGrid, Cell, XAxis, YAxis } from "recharts"

interface AirQualityChartProps {
  type?: "hourly" | "daily"
}

export function AirQualityChart({ type = "hourly" }: AirQualityChartProps) {
  const [tooltipData, setTooltipData] = useState<any>(null)

  const data = type === "hourly" ? getHourlyAirQualityData() : getDailyAirQualityData()

  // Define AQI severity colors
  const getColor = (value: number) => {
    if (value <= 50) return "#00FF00" // Bright green
    if (value <= 100) return "#FFFF00" // Bright yellow
    if (value <= 200) return "#FF9900" // Bright orange
    if (value <= 300) return "#FF0000" // Bright red
    return "#FF00FF" // Bright magenta for severe
  }

  // Get severity label
  const getSeverityLabel = (value: number) => {
    if (value <= 50) return "Good"
    if (value <= 100) return "Moderate"
    if (value <= 200) return "Poor"
    if (value <= 300) return "Very Poor"
    return "Severe"
  }

  return (
    <div className="w-full">
      <ChartContainer height={300} className="mt-4">
        <BarChart
          data={data}
          onMouseLeave={() => setTooltipData(null)}
          onMouseMove={(data) => {
            if (data && data.activePayload) {
              setTooltipData(data.activePayload[0].payload)
            }
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#ffffff30" />
          <XAxis
            dataKey={type === "hourly" ? "hour" : "day"}
            tickLine={false}
            axisLine={{ stroke: "#FFFF00" }}
            tick={{ fontSize: 12, fill: "#FFFF00" }}
          />
          <YAxis
            label={{ value: "AQI", position: "insideLeft", angle: -90, dy: 50, fill: "#00FFFF" }}
            domain={[0, 500]}
            tickCount={6}
            tick={{ fontSize: 12, fill: "#00FFFF" }}
            axisLine={{ stroke: "#00FFFF" }}
          />
          <Bar dataKey="aqi" name="AQI" fill="#00FFFF">
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={getColor(entry.aqi)} />
            ))}
          </Bar>
          <ChartTooltip
            content={
              <ChartTooltipContent
                className="bg-black/80 border-white/20"
                items={[
                  {
                    label: "AQI",
                    value: tooltipData?.aqi,
                    color: tooltipData ? getColor(tooltipData.aqi) : "#6366f1",
                  },
                  {
                    label: "Status",
                    value: tooltipData ? getSeverityLabel(tooltipData.aqi) : "",
                    color: "transparent",
                  },
                ]}
              />
            }
          />
        </BarChart>
      </ChartContainer>

      <div className="mt-4 flex justify-center gap-4">
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-green-500" />
          <span className="text-xs">Good</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-yellow-400" />
          <span className="text-xs">Moderate</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-orange-500" />
          <span className="text-xs">Poor</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-red-500" />
          <span className="text-xs">Very Poor</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-purple-600" />
          <span className="text-xs">Severe</span>
        </div>
      </div>
    </div>
  )
}

