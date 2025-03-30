"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Sun, Shield, Clock, AlertTriangle } from "lucide-react"

interface UVIndexData {
  current: number
  forecast: { time: string; value: number }[]
  lastUpdated: string
  location: string
}

export function UVIndexMonitor() {
  const [uvData, setUvData] = useState<UVIndexData>({
    current: 0,
    forecast: [],
    lastUpdated: "",
    location: "Delhi, India",
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate fetching real-time UV data
    const fetchUVData = () => {
      setLoading(true)

      // Simulate API delay
      setTimeout(() => {
        // Generate realistic UV index based on time of day
        const now = new Date()
        const hour = now.getHours()

        // UV is highest around noon, lower in morning/evening
        let baseUV = 0
        if (hour >= 6 && hour < 9) {
          baseUV = 2 + Math.random() * 2 // Morning: 2-4
        } else if (hour >= 9 && hour < 12) {
          baseUV = 5 + Math.random() * 3 // Late morning: 5-8
        } else if (hour >= 12 && hour < 15) {
          baseUV = 7 + Math.random() * 4 // Noon/early afternoon: 7-11
        } else if (hour >= 15 && hour < 18) {
          baseUV = 4 + Math.random() * 3 // Late afternoon: 4-7
        } else if (hour >= 18 && hour < 20) {
          baseUV = 1 + Math.random() * 2 // Evening: 1-3
        } else {
          baseUV = Math.random() * 1 // Night: 0-1
        }

        const currentUV = Math.min(11, Math.round(baseUV * 10) / 10)

        // Generate forecast for next 6 hours
        const forecast = []
        for (let i = 1; i <= 6; i++) {
          const forecastHour = (hour + i) % 24
          let forecastUV = 0

          if (forecastHour >= 6 && forecastHour < 9) {
            forecastUV = 2 + Math.random() * 2
          } else if (forecastHour >= 9 && forecastHour < 12) {
            forecastUV = 5 + Math.random() * 3
          } else if (forecastHour >= 12 && forecastHour < 15) {
            forecastUV = 7 + Math.random() * 4
          } else if (forecastHour >= 15 && forecastHour < 18) {
            forecastUV = 4 + Math.random() * 3
          } else if (forecastHour >= 18 && forecastHour < 20) {
            forecastUV = 1 + Math.random() * 2
          } else {
            forecastUV = Math.random() * 1
          }

          forecast.push({
            time: `${forecastHour}:00`,
            value: Math.min(11, Math.round(forecastUV * 10) / 10),
          })
        }

        setUvData({
          current: currentUV,
          forecast,
          lastUpdated: now.toLocaleTimeString(),
          location: "Delhi, India",
        })

        setLoading(false)
      }, 1500)
    }

    fetchUVData()

    // Refresh data every 15 minutes
    const interval = setInterval(fetchUVData, 15 * 60 * 1000)

    return () => clearInterval(interval)
  }, [])

  // Get UV index category and color
  const getUVCategory = (uv: number) => {
    if (uv < 3) return { category: "Low", color: "bg-green-500", textColor: "text-green-500" }
    if (uv < 6) return { category: "Moderate", color: "bg-yellow-500", textColor: "text-yellow-500" }
    if (uv < 8) return { category: "High", color: "bg-orange-500", textColor: "text-orange-500" }
    if (uv < 11) return { category: "Very High", color: "bg-red-500", textColor: "text-red-500" }
    return { category: "Extreme", color: "bg-purple-600", textColor: "text-purple-600" }
  }

  // Get protection recommendations
  const getProtectionRecommendations = (uv: number) => {
    if (uv < 3) {
      return "Minimal protection required. Wear sunglasses on bright days."
    } else if (uv < 6) {
      return "Take precautions: wear sunscreen, hat, and sunglasses. Seek shade during midday hours."
    } else if (uv < 8) {
      return "Protection required: minimize sun exposure between 10am-4pm, use SPF 30+ sunscreen, wear protective clothing."
    } else if (uv < 11) {
      return "Extra protection needed: avoid being outside during midday hours, use SPF 50+ sunscreen, seek shade."
    } else {
      return "Maximum protection essential: avoid all unnecessary exposure, use SPF 50+ sunscreen, wear protective clothing."
    }
  }

  const { category, color, textColor } = getUVCategory(uvData.current)

  return (
    <Card className="bg-white/10 backdrop-blur-sm border-white/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-white">
          <Sun className="h-5 w-5 text-yellow-400" />
          UV Index Monitor
        </CardTitle>
        <CardDescription className="text-white/70">
          Real-time ultraviolet radiation levels for {uvData.location}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <div className="text-sm text-white/70">Current UV Index</div>
                <div className="flex items-end gap-2">
                  <div className="text-4xl font-bold text-white">{uvData.current}</div>
                  <div className={`text-lg font-medium mb-1 ${textColor}`}>{category}</div>
                </div>
              </div>
              <div className="w-24 h-24 relative flex items-center justify-center">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="10" />
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    fill="none"
                    stroke={color.replace("bg-", "rgb-").replace("500", "400")}
                    strokeWidth="10"
                    strokeDasharray={`${(uvData.current / 11) * 283} ${283 - (uvData.current / 11) * 283}`}
                    strokeLinecap="round"
                  />
                </svg>
                <Sun className="absolute h-10 w-10 text-yellow-400" />
              </div>
            </div>

            <div className="p-3 rounded-md bg-white/10">
              <div className="flex items-center gap-2 mb-1">
                <Shield className="h-4 w-4 text-blue-400" />
                <div className="text-sm font-medium text-white">Protection Recommendations</div>
              </div>
              <p className="text-xs text-white/80">{getProtectionRecommendations(uvData.current)}</p>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-2">
                <Clock className="h-4 w-4 text-white/70" />
                <div className="text-sm text-white/70">Forecast</div>
              </div>

              <div className="grid grid-cols-6 gap-2 mt-1">
                {uvData.forecast.map((item, index) => {
                  const { color, category } = getUVCategory(item.value)
                  return (
                    <div key={index} className="flex flex-col items-center">
                      <div className="text-xs text-white/70">{item.time}</div>
                      <div className={`w-full h-1 my-1 rounded-full ${color}`}></div>
                      <div className="text-sm font-medium text-white">{item.value}</div>
                      <div className="text-xs text-white/70">{category}</div>
                    </div>
                  )
                })}
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-white/60 mt-2">
              <div className="flex items-center gap-1">
                <AlertTriangle className="h-3 w-3" />
                <span>Updated: {uvData.lastUpdated}</span>
              </div>
              <div>Source: Simulated UV Index Data</div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

