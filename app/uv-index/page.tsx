"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Sun, Shield, Clock, AlertTriangle, Calendar, Eye, Heart, Key } from "lucide-react"
import { getUVProtectionRecommendations, getUVHealthRisks } from "@/lib/uv-service"
import { Bar, BarChart, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts"
import { UVAnimation } from "@/components/uv-animation"
import { NavigationBar } from "@/components/navigation-bar"
import { fetchUVData } from "@/lib/api-services"

// Add this function before the component
function getSPFRecommendation(uvIndex: number): { spf: string; reapplyTime: string; notes: string } {
  if (uvIndex <= 2) {
    return {
      spf: "SPF 15",
      reapplyTime: "Every 2 hours if swimming or sweating",
      notes: "Minimal protection needed for most people",
    }
  } else if (uvIndex <= 5) {
    return {
      spf: "SPF 30",
      reapplyTime: "Every 2 hours",
      notes: "Apply 15 minutes before going outside",
    }
  } else if (uvIndex <= 7) {
    return {
      spf: "SPF 30-50",
      reapplyTime: "Every 2 hours",
      notes: "Apply liberally and reapply after swimming or sweating",
    }
  } else if (uvIndex <= 10) {
    return {
      spf: "SPF 50+",
      reapplyTime: "Every 1-2 hours",
      notes: "Seek shade during midday hours (10am-4pm)",
    }
  } else {
    return {
      spf: "SPF 50+",
      reapplyTime: "Every hour",
      notes: "Avoid sun exposure between 10am-4pm if possible",
    }
  }
}

function getUVCategory(uvIndex: number): { color: string; textColor: string; description: string } {
  if (uvIndex <= 2) {
    return {
      color: "#10b981",
      textColor: "#d1fae5",
      description: "Low risk from the sun's UV rays for the average person.",
    }
  } else if (uvIndex <= 5) {
    return {
      color: "#f59e0b",
      textColor: "#fef3c7",
      description: "Moderate risk from the sun's UV rays for the average person.",
    }
  } else if (uvIndex <= 7) {
    return {
      color: "#f97316",
      textColor: "#fed7aa",
      description: "High risk from the sun's UV rays for the average person.",
    }
  } else if (uvIndex <= 10) {
    return {
      color: "#ef4444",
      textColor: "#fee2e2",
      description: "Very high risk from the sun's UV rays for the average person.",
    }
  } else {
    return {
      color: "#7c3aed",
      textColor: "#ede9fe",
      description: "Extreme risk from the sun's UV rays for the average person.",
    }
  }
}

export default function UVIndexPage() {
  const [uvData, setUvData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("current")
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)

        // Default coordinates for Delhi
        let latitude = 28.6139
        let longitude = 77.209

        // Try to get user location, but don't wait for it if it fails
        try {
          if (navigator.geolocation) {
            // Create a promise that will resolve with the position or reject after a timeout
            const getPositionPromise = new Promise<GeolocationPosition>((resolve, reject) => {
              const timeoutId = setTimeout(() => {
                reject(new Error("Geolocation request timed out"))
              }, 3000)

              navigator.geolocation.getCurrentPosition(
                (position) => {
                  clearTimeout(timeoutId)
                  resolve(position)
                },
                (error) => {
                  clearTimeout(timeoutId)
                  reject(error)
                },
                { maximumAge: 60000, timeout: 3000, enableHighAccuracy: false },
              )
            })

            // Try to get position, but don't let it block the rest of the function
            const position = await getPositionPromise
            latitude = position.coords.latitude
            longitude = position.coords.longitude
            // console.log("Using user location:", latitude, longitude)
          }
        } catch (error) {
          console.log("Using default location due to:", error instanceof Error ? error.message : "Unknown error")
          // Continue with default coordinates
        }

        // Fetch data with either user coordinates or defaults
        const apiData = await fetchUVData(latitude, longitude)
// console.log("apiData",apiData);

        // Transform API data to match our format
        const transformedData = {
          current: {
            index: apiData.current.uv_index,
            category: apiData.current.uv_category,
            color: getUVCategory(apiData.current.uv_index).color,
            textColor: getUVCategory(apiData.current.uv_index).textColor,
            description: getUVCategory(apiData.current.uv_index).description,
            timestamp: new Date(apiData.current.timestamp).toLocaleTimeString(),
          },
          forecast: apiData.forecast.map((day: any) => ({
            day: new Date(day.date).toLocaleDateString("en-US", { weekday: "short" }).toUpperCase(),
            date: new Date(day.date).getDate().toString(),
            maxIndex: day.max_uv,
            category: day.category,
            color: getUVCategory(day.max_uv).color,
            protectionRequired: day.max_uv > 2,
          })),
          location:
            typeof apiData.location === "string"
              ? apiData.location
              : typeof apiData.location.name === "string"
                ? apiData.location.name
                : "Delhi, India",
          sunTimes: {
            sunrise: apiData.sun_info.sunrise,
            sunset: apiData.sun_info.sunset,
          },
          protectionTimes: {
            start: "08:30",
            end: "16:30",
            required: apiData.protection_required,
          },
          getUVProtectionRecommendation:apiData.getUVProtectionRecommendations,
        }
        // console.log(transformedData);
        
        setUvData(transformedData)

        
        setError(null)
      } catch (error) {
        console.error("Error fetching UV data:", error)
        setError("Failed to load UV data. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    fetchData()

    // Refresh data every 15 minutes
    const interval = setInterval(fetchData, 15 * 60 * 1000)

    return () => clearInterval(interval)
  }, [])

  // Get protection recommendations
  const protectionRecommendations = uvData ? getUVProtectionRecommendations(uvData.current.index) : []
// console.log("uvData//////////",uvData);

  // Get health risks
  const healthRisks = uvData ? getUVHealthRisks(uvData.current.index) : { skin: "", eye: "", immune: "" }

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-b from-amber-900 via-orange-700 to-yellow-500">
      <UVAnimation />
      <NavigationBar />

      <div className="container relative mx-auto py-6 pt-20 space-y-6 z-10">
        <h1 className="text-3xl font-bold tracking-tight text-white">UV Index Monitor</h1>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-white/10 text-white">
            <TabsTrigger value="current" className="data-[state=active]:bg-white/20">
              <Sun className="h-4 w-4 mr-2" />
              Current UV
            </TabsTrigger>
            <TabsTrigger value="forecast" className="data-[state=active]:bg-white/20">
              <Calendar className="h-4 w-4 mr-2" />
              Forecast
            </TabsTrigger>
            <TabsTrigger value="health" className="data-[state=active]:bg-white/20">
              <Heart className="h-4 w-4 mr-2" />
              Health Impact
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {loading ? (
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-500"></div>
          </div>
        ) : uvData ? (
          <>
            {activeTab === "current" && (
              <div className="space-y-6">
                <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                  <CardHeader>
                    <CardTitle className="text-white">Current UV Index</CardTitle>
                    <CardDescription className="text-white/70">
                      Real-time UV radiation levels for {uvData.location}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-6 md:grid-cols-2">
                      <div className="flex flex-col items-center justify-center">
                        <div className="w-40 h-40 relative flex items-center justify-center">
                          <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                            <circle
                              cx="50"
                              cy="50"
                              r="45"
                              fill="none"
                              stroke="rgba(255,255,255,0.2)"
                              strokeWidth="10"
                            />
                            <circle
                              cx="50"
                              cy="50"
                              r="45"
                              fill="none"
                              stroke={uvData.current.color}
                              strokeWidth="10"
                              strokeDasharray={`${(uvData.current.index / 12) * 283} ${283 - (uvData.current.index / 12) * 283}`}
                              strokeLinecap="round"
                            />
                          </svg>
                          <div className="absolute flex flex-col items-center">
                            <span className="text-5xl font-bold text-white">{uvData.current.index}</span>
                            <span className="text-sm text-white/70">UV Index</span>
                          </div>
                        </div>
                        <div className="mt-4 text-center">
                          <div className="flex items-center justify-center gap-2">
                            <div
                              className="w-4 h-4 rounded-full"
                              style={{ backgroundColor: uvData.current.color }}
                            ></div>
                            <span className="text-xl font-bold text-white">{uvData.current.category}</span>
                          </div>
                          <p className="text-white/80 mt-1">{uvData.current.description}</p>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div className="p-3 rounded-md bg-white/10">
                          <div className="flex items-center gap-2 mb-2">
                            <Clock className="h-4 w-4 text-yellow-300" />
                            <h3 className="text-white font-medium">Sun Times</h3>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="flex flex-col items-center">
                              <div className="text-yellow-300 text-sm">Sunrise</div>
                              <div className="text-white text-lg font-bold">{uvData.sunTimes.sunrise}</div>
                            </div>
                            <div className="flex flex-col items-center">
                              <div className="text-yellow-300 text-sm">Sunset</div>
                              <div className="text-white text-lg font-bold">{uvData.sunTimes.sunset}</div>
                            </div>
                          </div>
                        </div>

                        <div className="p-3 rounded-md bg-white/10">
                          <div className="flex items-center gap-2 mb-2">
                            <Shield className="h-4 w-4 text-yellow-300" />
                            <h3 className="text-white font-medium">Protection Required</h3>
                          </div>
                          {uvData.protectionTimes.required ? (
                            <div className="bg-red-500/20 p-2 rounded-md">
                              <p className="text-white text-sm">
                                Sun protection recommended from {uvData.protectionTimes.start} to{" "}
                                {uvData.protectionTimes.end}
                              </p>
                            </div>
                          ) : (
                            <div className="bg-green-500/20 p-2 rounded-md">
                              <p className="text-white text-sm">Minimal protection needed at current UV levels</p>
                            </div>
                          )}
                        </div>

                        <div className="p-3 rounded-md bg-white/10">
                          <div className="flex items-center gap-2 mb-2">
                            <AlertTriangle className="h-4 w-4 text-yellow-300" />
                            <h3 className="text-white font-medium">Current Status</h3>
                          </div>
                          <p className="text-white text-sm">
                            Updated at {uvData.current.timestamp} • Data source: The Weather Network
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="mt-6">
                      <h3 className="text-white font-medium mb-3">UV Index Today</h3>
                      <ResponsiveContainer width="100%" height={250}>
                        <BarChart
                          data={[
                            { time: "6AM", uv: 1, fill: "#10b981" },
                            { time: "8AM", uv: 3, fill: "#f59e0b" },
                            { time: "10AM", uv: 6, fill: "#f97316" },
                            { time: "12PM", uv: 9, fill: "#ef4444" },
                            { time: "2PM", uv: 8, fill: "#ef4444" },
                            { time: "4PM", uv: 5, fill: "#f97316" },
                            { time: "6PM", uv: 2, fill: "#10b981" },
                            { time: "8PM", uv: 0, fill: "#10b981" },
                          ]}
                          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" stroke="#ffffff30" />
                          <XAxis dataKey="time" tick={{ fill: "#FFFF00" }} axisLine={{ stroke: "#FFFF00" }} />
                          <YAxis tick={{ fill: "#00FFFF" }} axisLine={{ stroke: "#00FFFF" }} domain={[0, 12]} />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: "rgba(0, 0, 0, 0.8)",
                              border: "none",
                              borderRadius: "4px",
                              color: "#fff",
                            }}
                          />
                          <Bar dataKey="uv" name="UV Index" fill="#8884d8" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                  <CardHeader>
                    <CardTitle className="text-white">Protection Recommendations</CardTitle>
                    <CardDescription className="text-white/70">
                      Based on current UV index of {uvData.current.index} ({uvData.current.category})
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-3 md:grid-cols-2">
                      {/* {protectionRecommendations.map((rec, index) => (
                        <div key={index} className="p-3 rounded-md bg-white/10 flex items-start gap-3">
                          <Shield className="h-5 w-5 text-yellow-300 flex-shrink-0 mt-0.5" />
                          <p className="text-white">{rec}</p>
                        </div>
                      ))} */}
{uvData.getUVProtectionRecommendation &&
  Object.entries(uvData.getUVProtectionRecommendation).map(([key, val]) => (
    <div key={key} className="p-3 rounded-md bg-white/10 flex items-start gap-3">
      <span>{key}</span>
      <Shield className="h-5 w-5 text-yellow-300 flex-shrink-0 mt-0.5" />
      <p className="text-white">{val}</p>
    </div>
  ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                  <CardHeader>
                    <CardTitle className="text-white">Sunscreen Recommendations</CardTitle>
                    <CardDescription className="text-white/70">
                      Based on current UV index of {uvData.current.index} ({uvData.current.category})
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="p-4 rounded-lg bg-orange-500/20 border border-orange-400/50">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 rounded-full bg-orange-500/30">
                          <Sun className="h-6 w-6 text-orange-300" />
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-white">
                            {getSPFRecommendation(uvData.current.index).spf}
                          </h3>
                          <p className="text-sm text-white/80">Recommended Sunscreen Protection</p>
                        </div>
                      </div>

                      <div className="space-y-2 mt-4">
                        <div className="flex items-start gap-2">
                          <div className="h-5 w-5 rounded-full bg-yellow-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <span className="text-xs font-bold">1</span>
                          </div>
                          <p className="text-sm text-white">
                            Apply {getSPFRecommendation(uvData.current.index).spf} sunscreen to all exposed skin
                          </p>
                        </div>

                        <div className="flex items-start gap-2">
                          <div className="h-5 w-5 rounded-full bg-yellow-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <span className="text-xs font-bold">2</span>
                          </div>
                          <p className="text-sm text-white">
                            Reapply {getSPFRecommendation(uvData.current.index).reapplyTime}
                          </p>
                        </div>

                        <div className="flex items-start gap-2">
                          <div className="h-5 w-5 rounded-full bg-yellow-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <span className="text-xs font-bold">3</span>
                          </div>
                          <p className="text-sm text-white">{getSPFRecommendation(uvData.current.index).notes}</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {activeTab === "forecast" && (
              <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                <CardHeader>
                  <CardTitle className="text-white">7-Day UV Forecast</CardTitle>
                  <CardDescription className="text-white/70">
                    Predicted UV index levels for the next week
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex overflow-x-auto pb-2 space-x-2">
                    {uvData.forecast.map((day: any, index: number) => (
                      <div
                        key={index}
                        className="flex-shrink-0 w-24 p-3 rounded-md bg-white/10 flex flex-col items-center"
                      >
                        <div className="text-white font-medium">{day.day}</div>
                        <div className="text-xs text-white/70">{day.date}</div>
                        <div
                          className="w-12 h-12 rounded-full my-2 flex items-center justify-center"
                          style={{ backgroundColor: day.color }}
                        >
                          <span className="text-white font-bold">{day.maxIndex}</span>
                        </div>
                        <div className="text-xs text-white/90 mt-1">{day.category}</div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6">
                    <h3 className="text-white font-medium mb-3">Weekly UV Index Forecast</h3>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart
                        data={uvData.forecast.map((day: any) => ({
                          day: day.day,
                          uv: day.maxIndex,
                          fill: day.color,
                        }))}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="#ffffff30" />
                        <XAxis dataKey="day" tick={{ fill: "#FFFF00" }} axisLine={{ stroke: "#FFFF00" }} />
                        <YAxis tick={{ fill: "#00FFFF" }} axisLine={{ stroke: "#00FFFF" }} domain={[0, 12]} />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "rgba(0, 0, 0, 0.8)",
                            border: "none",
                            borderRadius: "4px",
                            color: "#fff",
                          }}
                        />
                        <Bar dataKey="uv" name="Max UV Index" fill="#8884d8">
                          {uvData.forecast.map((entry: any, index: number) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="p-3 rounded-md bg-amber-500/20">
                    <div className="flex items-center gap-2 mb-1">
                      <AlertTriangle className="h-4 w-4 text-amber-300" />
                      <p className="text-white font-medium">Forecast Highlights</p>
                    </div>
                    <p className="text-white/90 text-sm">
                      The highest UV index of {Math.max(...uvData.forecast.map((d: any) => d.maxIndex))} is expected on{" "}
                      {uvData.forecast.find(
                        (d: any) => d.maxIndex === Math.max(...uvData.forecast.map((d: any) => d.maxIndex)),
                      )?.day || "upcoming days"}
                      . Sun protection will be essential on all days with UV index above 3.
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            {activeTab === "health" && (
              <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                <CardHeader>
                  <CardTitle className="text-white">UV Health Impact</CardTitle>
                  <CardDescription className="text-white/70">
                    Understanding how UV radiation affects your health
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="p-4 rounded-md bg-white/10">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="p-2 rounded-full bg-red-500/20">
                          <AlertTriangle className="h-5 w-5 text-red-400" />
                        </div>
                        <h3 className="text-white font-medium">Skin Damage</h3>
                      </div>
                      <p className="text-white/80 text-sm">{healthRisks.skin}</p>
                    </div>

                    <div className="p-4 rounded-md bg-white/10">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="p-2 rounded-full bg-blue-500/20">
                          <Eye className="h-5 w-5 text-blue-400" />
                        </div>
                        <h3 className="text-white font-medium">Eye Damage</h3>
                      </div>
                      <p className="text-white/80 text-sm">{healthRisks.eye}</p>
                    </div>

                    <div className="p-4 rounded-md bg-white/10">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="p-2 rounded-full bg-purple-500/20">
                          <Heart className="h-5 w-5 text-purple-400" />
                        </div>
                        <h3 className="text-white font-medium">Immune System</h3>
                      </div>
                      <p className="text-white/80 text-sm">{healthRisks.immune}</p>
                    </div>
                  </div>

                  <div className="p-4 rounded-md bg-white/10">
                    <h3 className="text-white font-medium mb-3">UV Index Scale</h3>
                    <div className="relative h-12 rounded-lg overflow-hidden flex">
                      <div className="flex-1 bg-green-500 flex items-center justify-center">
                        <span className="text-white text-xs font-medium">Low (0-2)</span>
                      </div>
                      <div className="flex-1 bg-amber-500 flex items-center justify-center">
                        <span className="text-white text-xs font-medium">Moderate (3-5)</span>
                      </div>
                      <div className="flex-1 bg-orange-500 flex items-center justify-center">
                        <span className="text-white text-xs font-medium">High (6-7)</span>
                      </div>
                      <div className="flex-1 bg-red-500 flex items-center justify-center">
                        <span className="text-white text-xs font-medium">Very High (8-10)</span>
                      </div>
                      <div className="flex-1 bg-purple-900 flex items-center justify-center">
                        <span className="text-white text-xs font-medium">Extreme (11+)</span>
                      </div>
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="p-4 rounded-md bg-white/10">
                      <h3 className="text-white font-medium mb-3">Long-Term Effects</h3>
                      <ul className="space-y-2">
                        <li className="flex items-start gap-2 text-white/80 text-sm">
                          <AlertTriangle className="h-4 w-4 text-red-400 mt-0.5 flex-shrink-0" />
                          <span>Premature skin aging (wrinkles, leathery skin)</span>
                        </li>
                        <li className="flex items-start gap-2 text-white/80 text-sm">
                          <AlertTriangle className="h-4 w-4 text-red-400 mt-0.5 flex-shrink-0" />
                          <span>Increased risk of skin cancer (melanoma and non-melanoma)</span>
                        </li>
                        <li className="flex items-start gap-2 text-white/80 text-sm">
                          <AlertTriangle className="h-4 w-4 text-red-400 mt-0.5 flex-shrink-0" />
                          <span>Eye conditions like cataracts and macular degeneration</span>
                        </li>
                        <li className="flex items-start gap-2 text-white/80 text-sm">
                          <AlertTriangle className="h-4 w-4 text-red-400 mt-0.5 flex-shrink-0" />
                          <span>Weakened immune system</span>
                        </li>
                      </ul>
                    </div>

                    <div className="p-4 rounded-md bg-white/10">
                      <h3 className="text-white font-medium mb-3">Vulnerable Groups</h3>
                      <ul className="space-y-2">
                        <li className="flex items-start gap-2 text-white/80 text-sm">
                          <AlertTriangle className="h-4 w-4 text-amber-400 mt-0.5 flex-shrink-0" />
                          <span>Children (more sensitive skin, more time outdoors)</span>
                        </li>
                        <li className="flex items-start gap-2 text-white/80 text-sm">
                          <AlertTriangle className="h-4 w-4 text-amber-400 mt-0.5 flex-shrink-0" />
                          <span>People with fair skin, light eyes, or blonde/red hair</span>
                        </li>
                        <li className="flex items-start gap-2 text-white/80 text-sm">
                          <AlertTriangle className="h-4 w-4 text-amber-400 mt-0.5 flex-shrink-0" />
                          <span>Outdoor workers and athletes</span>
                        </li>
                        <li className="flex items-start gap-2 text-white/80 text-sm">
                          <AlertTriangle className="h-4 w-4 text-amber-400 mt-0.5 flex-shrink-0" />
                          <span>People with certain medical conditions or on photosensitizing medications</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </>
        ) : (
          <div className="p-4 text-center text-white/70">
            <AlertTriangle className="h-8 w-8 text-red-400 mx-auto mb-2" />
            <p>Failed to load UV data. Please try again later.</p>
          </div>
        )}
      </div>
    </div>
  )
}

