'use client'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AirQualityChart } from "@/components/air-quality-chart"
import { AirQualityMap } from "@/components/air-quality-map"
import { PollutionIndex } from "@/components/pollution-index"
import { Button } from "@/components/ui/button"
import { ArrowRight, Bell, Info } from "lucide-react"
import Link from "next/link"
import { PollutionSources } from "@/components/pollution-sources"
import { AnimatedBackground } from "@/components/animated-background"
import { DelhiAQIDashboard } from "@/components/delhi-aqi-dashboard"
import { PictorialAQIRepresentation } from "@/components/pictorial-aqi-representation"
import { PictorialWaterRepresentation } from "@/components/pictorial-water-representation"
import { NavigationBar } from "@/components/navigation-bar"
import { useEffect } from "react"
import { Gettokendata, onMessageListener } from "../lib/firebase"


export default function HomePage() {

  function requestPermission() {
    console.log("Requesting permission...");
    Notification.requestPermission().then((permission) => {
      if (permission === "granted") {
        console.log("Notification permission granted.");
        const token = Gettokendata();
        
      } else {
        console.log("Notification permission denied.");
      }
    });
  }

  useEffect(() => {
   requestPermission() 


    // onMessageListener().then((payload) => {
    //   alert(`New Notification: ${payload.notification.title}`);
    // }).catch((err) => console.log("Notification error: ", err));
  }, []);


  return (
    <div className="relative min-h-screen overflow-hidden">
      <AnimatedBackground />
      <NavigationBar />


      <div className="container relative mx-auto py-6 pt-20 space-y-8 z-10">
        <header className="space-y-2">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold tracking-tight text-white">Air Quality Monitor</h1>
            <div className="flex items-center gap-2">
              <Link href="/notifications">
                <Button
                  variant="outline"
                  size="icon"
                  className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/20"
                >
                  <Bell className="h-4 w-4 text-white" />
                </Button>
              </Link>
            </div>
          </div>
          <p className="text-white/80">Real-time air quality predictions and insights for Delhi regions</p>
        </header>

        <DelhiAQIDashboard />

        <div className="grid gap-6 md:grid-cols-2">
          {/* <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-white">Current AQI</CardTitle>
              <CardDescription className="text-white/70">Delhi average air quality index</CardDescription>
            </CardHeader>
            <CardContent>
              <PollutionIndex value={11} />
              <p className="mt-2 text-sm text-white/70">Updated: {new Date().toLocaleTimeString()}</p>
            </CardContent>
          </Card> */}

          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-white">Health Impact</CardTitle>
              <CardDescription className="text-white/70">Current air quality health effects</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md bg-amber-500/20 p-3 text-amber-100">
                <div className="flex items-center gap-2">
                  <Info className="h-4 w-4" />
                  <p className="text-sm font-medium">Very Poor Air Quality</p>
                </div>
                <p className="mt-2 text-xs">
                  May cause respiratory illness on prolonged exposure. People with existing conditions should avoid
                  outdoor activities.
                </p>
              </div>
              <div className="mt-4">
                <Link href="/recommendations">
                  <Button className="w-full bg-white/20 text-white hover:bg-white/30">
                    Get Personalized Recommendations
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-white/10 backdrop-blur-sm border-white/20">
          <CardHeader>
            <CardTitle className="text-white">Pollution Sources</CardTitle>
            <CardDescription className="text-white/70">
              Contribution of different sources to current AQI
            </CardDescription>
          </CardHeader>
          <CardContent>
            <PollutionSources />
          </CardContent>
        </Card>

        <Tabs defaultValue="hourly" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-white/10 text-white">
            <TabsTrigger value="hourly" className="data-[state=active]:bg-white/20">
              Hourly Forecast
            </TabsTrigger>
            <TabsTrigger value="daily" className="data-[state=active]:bg-white/20">
              Daily Forecast
            </TabsTrigger>
            <TabsTrigger value="map" className="data-[state=active]:bg-white/20">
              Pollution Map
            </TabsTrigger>
          </TabsList>
          <TabsContent value="hourly" className="mt-4">
            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardHeader>
                <CardTitle className="text-white">Hourly Air Quality Prediction</CardTitle>
                <CardDescription className="text-white/70">
                  Based on ML model trained on historical pollution data
                </CardDescription>
              </CardHeader>
              <CardContent>
                <AirQualityChart />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="daily" className="mt-4">
            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardHeader>
                <CardTitle className="text-white">10-Day Air Quality Forecast</CardTitle>
                <CardDescription className="text-white/70">Predicted AQI levels for the next 10 days</CardDescription>
              </CardHeader>
              <CardContent>
                <AirQualityChart type="daily" />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="map" className="mt-4">
            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardHeader>
                <CardTitle className="text-white">Delhi Pollution Hotspots</CardTitle>
                <CardDescription className="text-white/70">
                  Real-time pollution levels across different regions
                </CardDescription>
              </CardHeader>
              <CardContent className="h-[400px]">
                <AirQualityMap />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <Tabs defaultValue="aqi" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-white/10 text-white">
            <TabsTrigger value="aqi" className="data-[state=active]:bg-white/20">
              AQI Visual Guide
            </TabsTrigger>
            <TabsTrigger value="water" className="data-[state=active]:bg-white/20">
              Water Quality Guide
            </TabsTrigger>
          </TabsList>
          <TabsContent value="aqi" className="mt-4">
            <PictorialAQIRepresentation />
          </TabsContent>
          <TabsContent value="water" className="mt-4">
            <PictorialWaterRepresentation />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

