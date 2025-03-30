"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Car, Truck, AlertTriangle, BarChart3, MapPin } from "lucide-react"
import { AnimatedBackground } from "@/components/animated-background"
import { TrafficMap } from "@/components/traffic-map"
import { TrafficChart } from "@/components/traffic-chart"
import { TrafficAlert } from "@/components/traffic-alert"
import { NavigationBar } from "@/components/navigation-bar"

export default function TrafficMonitorPage() {
  const [showAlert, setShowAlert] = useState(false)
  const [trafficLevel, setTrafficLevel] = useState(75)

  // Simulate traffic level changes
  useEffect(() => {
    const interval = setInterval(() => {
      const newLevel = Math.floor(Math.random() * 30) + 60 // 60-90 range
      setTrafficLevel(newLevel)

      // Randomly trigger alerts
      if (Math.random() > 0.7 && !showAlert) {
        setShowAlert(true)

        // Auto-dismiss after 5 seconds
        setTimeout(() => {
          setShowAlert(false)
        }, 5000)
      }
    }, 10000)

    return () => clearInterval(interval)
  }, [showAlert])

  return (
    <div className="relative min-h-screen overflow-hidden">
      <AnimatedBackground />
      <NavigationBar />

      <div className="container relative mx-auto py-6 pt-20 space-y-6 z-10">
        <h1 className="text-3xl font-bold tracking-tight text-white">Traffic Monitoring</h1>

        {showAlert && <TrafficAlert onClose={() => setShowAlert(false)} />}

        <div className="grid gap-6 md:grid-cols-3">
          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardHeader>
              <CardTitle className="text-white">Current Traffic Level</CardTitle>
              <CardDescription className="text-white/70">Real-time traffic congestion index</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center">
                <div className="relative w-32 h-32 flex items-center justify-center">
                  <svg className="w-full h-full" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="10" />
                    <circle
                      cx="50"
                      cy="50"
                      r="45"
                      fill="none"
                      stroke={trafficLevel > 80 ? "#ef4444" : trafficLevel > 70 ? "#f97316" : "#84cc16"}
                      strokeWidth="10"
                      strokeDasharray={`${trafficLevel * 2.83} ${283 - trafficLevel * 2.83}`}
                      strokeDashoffset="0"
                      transform="rotate(-90 50 50)"
                    />
                  </svg>
                  <div className="absolute flex flex-col items-center">
                    <span className="text-3xl font-bold text-white">{trafficLevel}%</span>
                    <span className="text-xs text-white/70">Congestion</span>
                  </div>
                </div>

                <div className="mt-4 flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    <Car className="h-4 w-4 text-white" />
                    <span className="text-sm text-white">High Volume</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <AlertTriangle className="h-4 w-4 text-amber-400" />
                    <span className="text-sm text-white">3 Incidents</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardHeader>
              <CardTitle className="text-white">Vehicle Distribution</CardTitle>
              <CardDescription className="text-white/70">Types of vehicles on the road</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-sm text-white">
                    <div className="flex items-center gap-2">
                      <Car className="h-4 w-4" />
                      <span>Cars</span>
                    </div>
                    <span>65%</span>
                  </div>
                  <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 rounded-full" style={{ width: "65%" }}></div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center text-sm text-white">
                    <div className="flex items-center gap-2">
                      <Truck className="h-4 w-4" />
                      <span>Trucks & Buses</span>
                    </div>
                    <span>20%</span>
                  </div>
                  <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                    <div className="h-full bg-amber-500 rounded-full" style={{ width: "20%" }}></div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center text-sm text-white">
                    <div className="flex items-center gap-2">
                      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 11L14.5 7L17 11H7L9.5 7L12 11Z" fill="currentColor" />
                        <circle cx="12" cy="14" r="3" fill="currentColor" />
                        <path
                          d="M7 18C7 16.3431 8.34315 15 10 15H14C15.6569 15 17 16.3431 17 18V18H7V18Z"
                          fill="currentColor"
                        />
                      </svg>
                      <span>Two-wheelers</span>
                    </div>
                    <span>15%</span>
                  </div>
                  <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                    <div className="h-full bg-green-500 rounded-full" style={{ width: "15%" }}></div>
                  </div>
                </div>
              </div>

              <div className="mt-4 text-xs text-white/70">
                High proportion of cars contributes significantly to traffic congestion and emissions.
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardHeader>
              <CardTitle className="text-white">Pollution Impact</CardTitle>
              <CardDescription className="text-white/70">Traffic contribution to AQI</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-white">Current Traffic AQI Contribution</span>
                  <span className="text-lg font-bold text-white">+145</span>
                </div>

                <div className="p-3 bg-amber-500/20 rounded-md">
                  <div className="flex items-center gap-2 text-amber-100">
                    <AlertTriangle className="h-4 w-4" />
                    <span className="text-sm font-medium">High Impact Zone</span>
                  </div>
                  <p className="mt-1 text-xs text-amber-100/80">
                    Traffic is currently contributing 45% to the total AQI in this area.
                  </p>
                </div>

                <div className="space-y-2">
                  <span className="text-sm text-white">Emission Hotspots</span>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs text-white/80">
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3 text-red-400" />
                        <span>ITO Crossing</span>
                      </div>
                      <span>AQI +180</span>
                    </div>
                    <div className="flex items-center justify-between text-xs text-white/80">
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3 text-red-400" />
                        <span>Anand Vihar</span>
                      </div>
                      <span>AQI +165</span>
                    </div>
                    <div className="flex items-center justify-between text-xs text-white/80">
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3 text-amber-400" />
                        <span>Connaught Place</span>
                      </div>
                      <span>AQI +120</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="map" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-white/10 text-white">
            <TabsTrigger value="map" className="data-[state=active]:bg-white/20">
              <MapPin className="h-4 w-4 mr-2" />
              Traffic Map
            </TabsTrigger>
            <TabsTrigger value="trends" className="data-[state=active]:bg-white/20">
              <BarChart3 className="h-4 w-4 mr-2" />
              Traffic Trends
            </TabsTrigger>
          </TabsList>

          <TabsContent value="map" className="mt-4">
            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardHeader>
                <CardTitle className="text-white">Real-time Traffic Map</CardTitle>
                <CardDescription className="text-white/70">Live congestion levels across Delhi</CardDescription>
              </CardHeader>
              <CardContent className="h-[400px]">
                <TrafficMap />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="trends" className="mt-4">
            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardHeader>
                <CardTitle className="text-white">Traffic Trends</CardTitle>
                <CardDescription className="text-white/70">
                  24-hour traffic volume and pollution correlation
                </CardDescription>
              </CardHeader>
              <CardContent className="h-[400px]">
                <TrafficChart />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

