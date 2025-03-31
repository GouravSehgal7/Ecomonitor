"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { AlertTriangle, Clock, MapPin, Info, ExternalLink, Calendar } from "lucide-react"
import { getAQIHealthRecommendations, getAQIProtectionMeasures, type AQIData } from "@/lib/aqi-service"
import { fetchAQIData } from "@/lib/api-services"

// Function to determine AQI category based on AQI value
const getAQICategory = (aqi: number) => {
  if (aqi <= 50) {
    return { category: "Good", color: "#00e400", textColor: "black" }
  } else if (aqi <= 100) {
    return { category: "Moderate", color: "#ffff00", textColor: "black" }
  } else if (aqi <= 150) {
    return { category: "Unhealthy for Sensitive Groups", color: "#ff7e00", textColor: "black" }
  } else if (aqi <= 200) {
    return { category: "Unhealthy", color: "#ff0000", textColor: "black" }
  } else if (aqi <= 300) {
    return { category: "Very Unhealthy", color: "#8f3f97", textColor: "white" }
  } else {
    return { category: "Hazardous", color: "#7e0023", textColor: "white" }
  }
}

export function DelhiAQIDashboard() {
  const [aqiData, setAqiData] = useState<AQIData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("current")

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)

        // Use a Promise with timeout to handle geolocation
        const getPosition = () => {
          return new Promise<{ latitude: number; longitude: number }>((resolve, reject) => {
            // Set a timeout in case geolocation hangs
            const timeoutId = setTimeout(() => {
              reject(new Error("Geolocation request timed out"))
            }, 5000)

            try {
              if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                  (position) => {
                    clearTimeout(timeoutId)
                    resolve({
                      latitude: position.coords.latitude,
                      longitude: position.coords.longitude,
                    })
                  },
                  (error) => {
                    clearTimeout(timeoutId)
                    reject(error)
                  },
                  { maximumAge: 60000, timeout: 5000, enableHighAccuracy: false },
                )
              } else {
                clearTimeout(timeoutId)
                reject(new Error("Geolocation not supported"))
              }
            } catch (error) {
              clearTimeout(timeoutId)
              reject(error)
            }
          })
        }

        // Try to get location, but fall back to default if it fails
        let latitude = 28.6139 // Default to Delhi
        let longitude = 77.209

        try {
          const position = await getPosition()
          latitude = position.latitude
          longitude = position.longitude
          console.log("Using user location:", latitude, longitude)
        } catch (error:any) {
          console.log("Using default location due to:", error.message)
          // Continue with default coordinates
        }

        // Fetch AQI data with either user coordinates or defaults
        const aqires = await fetchAQIData(longitude,latitude)
        console.log(aqires?.city.geo);

        // Transform API data to match our format
        const { category, color, textColor } = getAQICategory(aqires?.aqi)

        // // Make sure city name is a string
        const cityName = typeof aqires?.city.name === "string" ? aqires?.city.name : "Delhi, India" // Fallback if name is not a string

        const transformedData = {
          aqi: aqires?.aqi,
          category,
          color,
          textColor,
          primaryPollutant: aqires?.dominentpol,
          updatedAt: new Date(aqires?.time.s).toLocaleString(),
          location: cityName,
          pollutants: {
            pm25: {
              value: aqires?.iaqi.pm25.v,
              unit: "μg/m³",
              min: 0,
              max: aqires?.iaqi.pm25.v * 1.5,
            },
            pm10: {
              value: aqires?.iaqi.pm10.v,
              unit: "μg/m³",
              min: 0,
              max: aqires?.iaqi.pm10.v * 1.5,
            },
            o3: {
              value: aqires?.iaqi.o3.v,
              unit: "μg/m³",
              min: 0,
              max: 100,
            },
            no2: {
              value: aqires?.iaqi.no2.v,
              unit: "μg/m³",
              min: 0,
              max: 100,
            },
            so2: {
              value: aqires?.iaqi.so2.v,
              unit: "μg/m³",
              min: 0,
              max: 100,
            },
            co: {
              value: aqires?.iaqi.co.v,
              unit: "μg/m³",
              min: 0,
              max: 50,
            },
            temp: {
              value: aqires?.iaqi.t.v,
              unit: "°C",
              min: 0,
              max: 50,
            },
            humidity: {
              value: aqires?.iaqi.h.v,
              unit: "%",
              min: 0,
              max: 100,
            },
          },
          forecast: aqires?.forecast.daily.pm25.map((day: any) => ({
            day: new Date(day.day).toLocaleDateString("en-US", { weekday: "short" }).toUpperCase(),
            date: new Date(day.day).getDate().toString(),
            aqi: day.avg,
            category: getAQICategory(day.avg).category,
            color: getAQICategory(day.avg).color,
            maxTemp: 35 + Math.floor(Math.random() * 5),
            minTemp: 22 + Math.floor(Math.random() * 5),
          })),
          stations: [
            {
              name: cityName,
              aqi: aqires?.aqi,
              category,
              color,
              lat: aqires?.city.geo[0],
              lng: aqires?.city.geo[1],
            },
          ],
        }

        setAqiData(transformedData)
        setError(null)
      } catch (err) {
        console.error("Error fetching AQI data:", err)
        setError("Failed to load air quality data. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    fetchData()

    // Refresh data every 15 minutes
    const interval = setInterval(fetchData, 15 * 60 * 1000)

    return () => clearInterval(interval)
  }, [])

  // Get health recommendations and protection measures
  const healthRecommendations = aqiData ? getAQIHealthRecommendations(aqiData.aqi) : []
  const protectionMeasures = aqiData ? getAQIProtectionMeasures(aqiData.aqi) : []

  return (
    <Card className="bg-white/10 backdrop-blur-sm border-white/20">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2 text-white">
              <AlertTriangle className="h-5 w-5 text-yellow-400" />
              Delhi Air Quality Index
            </CardTitle>
            <CardDescription className="text-white/70">Real-time AQI data from aqicn.org</CardDescription>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="bg-white/10 border-white/20 text-white hover:bg-white/20"
            onClick={() => window.open("https://aqicn.org/city/delhi/", "_blank")}
          >
            <ExternalLink className="h-4 w-4 mr-2" />
            View Source
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : error ? (
          <div className="p-4 text-center text-white/70">
            <AlertTriangle className="h-8 w-8 text-red-400 mx-auto mb-2" />
            <p>{error}</p>
          </div>
        ) : aqiData ? (
          <div className="space-y-6">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-3 bg-white/10 text-white">
                <TabsTrigger value="current" className="data-[state=active]:bg-white/20">
                  Current AQI
                </TabsTrigger>
                <TabsTrigger value="forecast" className="data-[state=active]:bg-white/20">
                  Forecast
                </TabsTrigger>
                <TabsTrigger value="stations" className="data-[state=active]:bg-white/20">
                  Monitoring Stations
                </TabsTrigger>
              </TabsList>
            </Tabs>

            {activeTab === "current" && (
              <div className="space-y-6">
                <div className="flex flex-col md:flex-row gap-6 items-center">
                  <div className="w-40 h-40 relative flex items-center justify-center">
                    <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                      <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="10" />
                      <circle
                        cx="50"
                        cy="50"
                        r="45"
                        fill="none"
                        stroke={aqiData.color}
                        strokeWidth="10"
                        strokeDasharray={`${Math.min(283, (aqiData.aqi / 500) * 283)} ${283 - Math.min(283, (aqiData.aqi / 500) * 283)}`}
                        strokeLinecap="round"
                      />
                    </svg>
                    <div className="absolute flex flex-col items-center">
                      <span className="text-4xl font-bold text-white">{aqiData.aqi}</span>
                      <span className="text-sm text-white/70">AQI</span>
                    </div>
                  </div>

                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full" style={{ backgroundColor: aqiData.color }}></div>
                      <span className="text-xl font-bold text-white">{aqiData.category}</span>
                    </div>

                    <div className="text-white/70 text-sm space-y-1">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        <span>{aqiData.location}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        <span>Updated on {aqiData.updatedAt}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Info className="h-4 w-4" />
                        <span>Primary pollutant: {aqiData.primaryPollutant.toUpperCase()}</span>
                      </div>
                    </div>

                    <div className="p-3 rounded-md bg-red-500/20 mt-2">
                      <p className="text-sm text-white">
                        This AQI level is <span className="font-bold">hazardous</span> and may cause serious health
                        effects for the entire population.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {Object.entries(aqiData.pollutants)
                    .slice(0, 8)
                    .map(([key, data]) => (
                      <div key={key} className="p-3 rounded-md bg-white/10">
                        <div className="text-sm font-medium text-white mb-1">{key.toUpperCase()}</div>
                        <div className="flex items-end gap-1">
                          <span className="text-xl font-bold text-white">{Math.floor(Number(data.value))}</span>
                          <span className="text-sm text-white/70">{data.unit}</span>
                        </div>
                        <div className="mt-1 h-1 bg-white/20 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-blue-500 rounded-full"
                            style={{
                              width: `${Math.min(100, (data.value / data.max) * 100)}%`,
                              backgroundColor: key === aqiData.primaryPollutant ? aqiData.color : undefined,
                            }}
                          ></div>
                        </div>
                      </div>
                    ))}
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <h3 className="text-white font-medium">Health Recommendations</h3>
                    <div className="p-3 rounded-md bg-white/10 space-y-2">
                      {healthRecommendations.map((rec, index) => (
                        <div key={index} className="flex items-start gap-2">
                          <AlertTriangle className="h-4 w-4 text-red-400 mt-0.5" />
                          <p className="text-sm text-white/90">{rec}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-white font-medium">Protection Measures</h3>
                    <div className="p-3 rounded-md bg-white/10 space-y-2">
                      {protectionMeasures.map((measure, index) => (
                        <div key={index} className="flex items-start gap-2">
                          <Info className="h-4 w-4 text-blue-400 mt-0.5" />
                          <p className="text-sm text-white/90">{measure}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "forecast" && (
              <div className="space-y-4">
                <div className="flex overflow-x-auto pb-2 space-x-2">
                  {aqiData.forecast.map((day, index) => (
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
                        <span className="text-white font-bold">{day.aqi}</span>
                      </div>
                      <div className="text-xs text-white/90 mt-1">
                        {day.maxTemp}°C / {day.minTemp}°C
                      </div>
                    </div>
                  ))}
                </div>

                <div className="p-3 rounded-md bg-white/10">
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="h-4 w-4 text-white/70" />
                    <h3 className="text-white font-medium">Air Quality Forecast</h3>
                  </div>
                  <p className="text-sm text-white/70">
                    The forecast shows hazardous air quality conditions continuing for the next week. The highest AQI
                    levels are expected on Saturday with a value of {aqiData.forecast[6]?.aqi || "N/A"}.
                  </p>
                </div>
              </div>
            )}

            {activeTab === "stations" && (
              <div className="space-y-4">
                <div className="grid gap-2">
                  {aqiData.stations.map((station, index) => (
                    <div key={index} className="p-3 rounded-md bg-white/10 flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-10 h-10 rounded-full flex items-center justify-center"
                          style={{ backgroundColor: station.color }}
                        >
                          <span className="text-white font-bold text-sm">{station.aqi}</span>
                        </div>
                        <div>
                          <div className="text-white font-medium">{station.name}</div>
                          <div className="text-xs text-white/70">{station.category}</div>
                        </div>
                      </div>
                      <div className="text-xs text-white/70 flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        <span>
                          {station.lat.toFixed(2)}, {station.lng.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="text-xs text-white/60 text-center">
                  Data from multiple monitoring stations across Delhi NCR
                </div>
              </div>
            )}
          </div>
        ) : null}
      </CardContent>
    </Card>
  )
}

