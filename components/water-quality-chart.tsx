"use client"

import { Button } from "@/components/ui/button"

import { useState, useEffect } from "react"
import { Tabs, TabsContent } from "@/components/ui/tabs"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { getWaterQualityHistoryData } from "@/lib/mock-data"
import { Bar, BarChart, CartesianGrid, Cell, XAxis, YAxis, Line, LineChart } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface WaterQualityChartProps {
  expanded?: boolean
}

export function WaterQualityChart({ expanded = false }: WaterQualityChartProps) {
  const [tooltipData, setTooltipData] = useState<any>(null)
  const [showHistorical, setShowHistorical] = useState(false)
  const [selectedParameter, setSelectedParameter] = useState<string | null>(null)
  const [historicalData, setHistoricalData] = useState<any[]>([])

  // Get historical data for each parameter
  const phData = getWaterQualityHistoryData("ph")
  const tdsData = getWaterQualityHistoryData("tds")
  const hardnessData = getWaterQualityHistoryData("hardness")
  const chlorineData = getWaterQualityHistoryData("chlorine")

  // Generate 30-day historical data when a parameter is selected
  useEffect(() => {
    if (selectedParameter) {
      // Generate 30 days of data with a trend
      const days = Array.from({ length: 30 }, (_, i) => {
        const date = new Date()
        date.setDate(date.getDate() - 29 + i)
        return date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
      })

      // Create realistic trends based on parameter
      let data: any[] = []

      if (selectedParameter === "ph") {
        // pH tends to be stable with slight variations
        data = days.map((day, i) => ({
          day,
          value: 7.2 + Math.sin(i / 5) * 0.5 + (Math.random() * 0.4 - 0.2),
          safe: true,
        }))
      } else if (selectedParameter === "tds") {
        // TDS might show seasonal variations with occasional spikes
        const baseValue = 350
        data = days.map((day, i) => {
          const seasonal = 50 * Math.sin((i / 30) * Math.PI)
          const spike = i % 7 === 0 ? Math.random() * 100 : 0
          const value = baseValue + seasonal + spike + (Math.random() * 40 - 20)
          return {
            day,
            value: Math.round(value),
            safe: value <= 500,
          }
        })
      } else if (selectedParameter === "hardness") {
        // Hardness might gradually increase over time
        data = days.map((day, i) => {
          const trend = i * 1.5
          const value = 180 + trend + (Math.random() * 30 - 15)
          return {
            day,
            value: Math.round(value),
            safe: value <= 300,
          }
        })
      } else if (selectedParameter === "chlorine") {
        // Chlorine might fluctuate with treatment cycles
        data = days.map((day, i) => {
          const cycle = Math.sin(i / 3) * 1.2
          const value = 2 + cycle + (Math.random() * 0.6 - 0.3)
          return {
            day,
            value: Math.round(value * 10) / 10,
            safe: value <= 4,
          }
        })
      }

      setHistoricalData(data)
    }
  }, [selectedParameter])

  // Parameter configurations
  const parameters = {
    ph: {
      name: "pH",
      color: "#00FFFF", // Bright cyan
      safeMin: 6.5,
      safeMax: 8.5,
      unit: "",
      description: "pH measures how acidic or basic water is. Municipal water should be between 6.5-8.5.",
    },
    tds: {
      name: "TDS",
      color: "#FFFF00", // Bright yellow (was magenta)
      safeMax: 500,
      unit: "mg/L",
      description: "Total Dissolved Solids indicate minerals, salts, and metals dissolved in water.",
    },
    hardness: {
      name: "Hardness",
      color: "#FFFF00", // Bright yellow
      safeMax: 300,
      unit: "mg/L",
      description: "Water hardness is caused by calcium and magnesium minerals. Hard water can cause scale buildup.",
    },
    chlorine: {
      name: "Chlorine",
      color: "#00FF00", // Bright green
      safeMax: 4,
      unit: "mg/L",
      description: "Chlorine is added to water as a disinfectant to kill harmful bacteria and viruses.",
    },
  }

  // Handle parameter click to show historical data
  const handleParameterClick = (param: string) => {
    setSelectedParameter(param)
    setShowHistorical(true)
  }

  // Render chart for each parameter
  const renderChart = (data: any[], param: keyof typeof parameters) => {
    const config = parameters[param]

    return (
      <div className="space-y-4">
        {expanded && (
          <div className="p-3 bg-blue-500/20 rounded-md border border-white/20">
            <p className="text-sm text-white/80">{config.description}</p>
          </div>
        )}

        <div className="cursor-pointer hover:opacity-90 transition-opacity" onClick={() => handleParameterClick(param)}>
          <ChartContainer height={expanded ? 350 : 250} className="mt-4">
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
                dataKey="time"
                tickLine={false}
                axisLine={{ stroke: "#FFFF00" }}
                tick={{ fontSize: 12, fill: "#FFFF00" }}
              />
              <YAxis
                label={{
                  value: config.name,
                  position: "insideLeft",
                  angle: -90,
                  dy: 50,
                  fill: "#00FFFF",
                }}
                tickCount={5}
                tick={{ fontSize: 12, fill: "#00FFFF" }}
                axisLine={{ stroke: "#00FFFF" }}
              />
              <Bar dataKey="value" name={config.name} fill={config.color}>
                {data.map((entry, index) => {
                  let color
                  if ("safeMin" in config && "safeMax" in config) {
                    color = entry.value >= config.safeMin && entry.value <= config.safeMax ? "#10b981" : "#ef4444"
                  } else {
                    color = entry.value <= config.safeMax ? "#10b981" : "#ef4444"
                  }
                  return <Cell key={`cell-${index}`} fill={color} />
                })}
              </Bar>
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    className="bg-black/80 border-white/20"
                    items={[
                      {
                        label: config.name,
                        value: tooltipData?.value + " " + config.unit,
                        color: config.color,
                      },
                      {
                        label: "Time",
                        value: tooltipData?.time,
                        color: "transparent",
                      },
                      {
                        label: "Status",
                        value: getSafetyStatus(tooltipData?.value, param),
                        color: getSafetyColor(tooltipData?.value, param),
                      },
                    ]}
                  />
                }
              />
            </BarChart>
          </ChartContainer>
        </div>

        {expanded && (
          <div className="grid grid-cols-3 gap-2 mt-2">
            <div className="p-2 bg-green-500/20 rounded-md border border-green-500/20 text-center">
              <div className="text-xs text-white/70">Safe Range</div>
              <div className="text-sm font-medium text-white">
                {param === "ph" ? "6.5-8.5" : `< ${parameters[param].safeMax} ${parameters[param].unit}`}
              </div>
            </div>
            <div className="p-2 bg-amber-500/20 rounded-md border border-amber-500/20 text-center">
              <div className="text-xs text-white/70">Average</div>
              <div className="text-sm font-medium text-white">
                {getAverage(data)} {parameters[param].unit}
              </div>
            </div>
            <div className="p-2 bg-blue-500/20 rounded-md border border-blue-500/20 text-center">
              <div className="text-xs text-white/70">Trend</div>
              <div className="text-sm font-medium text-white">{getTrend(data)}</div>
            </div>
          </div>
        )}
      </div>
    )
  }

  // Helper function to get safety status
  const getSafetyStatus = (value: number, param: keyof typeof parameters) => {
    if (!value) return ""

    const config = parameters[param]

    if (param === "ph") {
      if (value < config.safeMin) return "Too Acidic"
      if (value > config.safeMax) return "Too Basic"
      return "Safe"
    } else {
      if (value > config.safeMax) return "Exceeds Limit"
      if (value > config.safeMax * 0.8) return "Near Limit"
      return "Safe"
    }
  }

  // Helper function to get safety color
  const getSafetyColor = (value: number, param: keyof typeof parameters) => {
    if (!value) return "transparent"

    const config = parameters[param]

    if (param === "ph") {
      if (value < config.safeMin || value > config.safeMax) return "#ef4444"
      if (value < config.safeMin + 0.5 || value > config.safeMax - 0.5) return "#f97316"
      return "#10b981"
    } else {
      if (value > config.safeMax) return "#ef4444"
      if (value > config.safeMax * 0.8) return "#f97316"
      return "#10b981"
    }
  }

  // Helper function to get average
  const getAverage = (data: any[]) => {
    const sum = data.reduce((acc, item) => acc + item.value, 0)
    const avg = sum / data.length
    return avg.toFixed(1)
  }

  // Helper function to get trend
  const getTrend = (data: any[]) => {
    const firstHalf = data.slice(0, data.length / 2)
    const secondHalf = data.slice(data.length / 2)

    const firstAvg = firstHalf.reduce((acc, item) => acc + item.value, 0) / firstHalf.length
    const secondAvg = secondHalf.reduce((acc, item) => acc + item.value, 0) / secondHalf.length

    const diff = secondAvg - firstAvg

    if (Math.abs(diff) < 0.1) return "Stable"
    return diff > 0 ? "Increasing" : "Decreasing"
  }

  return (
    <>
      {showHistorical && selectedParameter ? (
        <Card className="bg-white/10 backdrop-blur-sm border-white/20 mb-4">
          <CardHeader>
            <CardTitle className="text-white">
              {parameters[selectedParameter as keyof typeof parameters].name} - 30 Day History
            </CardTitle>
            <CardDescription className="text-white/70">Historical trend data for the past 30 days</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer height={350}>
              <LineChart
                data={historicalData}
                onMouseLeave={() => setTooltipData(null)}
                onMouseMove={(data) => {
                  if (data && data.activePayload) {
                    setTooltipData(data.activePayload[0].payload)
                  }
                }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff30" />
                <XAxis dataKey="day" tick={{ fontSize: 12, fill: "#FFFF00" }} axisLine={{ stroke: "#FFFF00" }} />
                <YAxis tick={{ fontSize: 12, fill: "#00FFFF" }} axisLine={{ stroke: "#00FFFF" }} />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke={parameters[selectedParameter as keyof typeof parameters].color}
                  strokeWidth={2}
                  dot={{ fill: "#fff", r: 3 }}
                  activeDot={{ r: 5, fill: "#fff" }}
                />
                <ChartTooltip
                  content={
                    <ChartTooltipContent
                      className="bg-black/80 border-white/20"
                      items={[
                        {
                          label: parameters[selectedParameter as keyof typeof parameters].name,
                          value:
                            tooltipData?.value + " " + parameters[selectedParameter as keyof typeof parameters].unit,
                          color: parameters[selectedParameter as keyof typeof parameters].color,
                        },
                        {
                          label: "Date",
                          value: tooltipData?.day,
                          color: "transparent",
                        },
                        {
                          label: "Status",
                          value: tooltipData?.safe ? "Safe" : "Exceeds Limit",
                          color: tooltipData?.safe ? "#10b981" : "#ef4444",
                        },
                      ]}
                    />
                  }
                />
              </LineChart>
            </ChartContainer>

            <div className="flex justify-end mt-4">
              <Button
                variant="outline"
                className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                onClick={() => setShowHistorical(false)}
              >
                Back to Parameters
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Tabs>
          <TabsContent value="ph">
            {renderChart(phData, "ph")}
            <div className="mt-2 text-xs text-white/70 text-center">Safe range: 6.5-8.5 pH</div>
          </TabsContent>

          <TabsContent value="tds">
            {renderChart(tdsData, "tds")}
            <div className="mt-2 text-xs text-white/70 text-center">Safe limit: &lt;500 mg/L</div>
          </TabsContent>

          <TabsContent value="hardness">
            {renderChart(hardnessData, "hardness")}
            <div className="mt-2 text-xs text-white/70 text-center">Safe limit: &lt;300 mg/L CaCO₃</div>
          </TabsContent>

          <TabsContent value="chlorine">
            {renderChart(chlorineData, "chlorine")}
            <div className="mt-2 text-xs text-white/70 text-center">Safe limit: &lt;4 mg/L</div>
          </TabsContent>
        </Tabs>
      )}
    </>
  )
}

