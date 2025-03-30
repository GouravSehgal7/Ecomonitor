"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { ArrowLeft, Bell, BellOff, AlertTriangle, Droplets, Car } from "lucide-react"
import Link from "next/link"
import { AnimatedBackground } from "@/components/animated-background"


export default function NotificationsPage() {
  const [notificationSettings, setNotificationSettings] = useState({
    airQuality: true,
    waterQuality: true,
    traffic: true,
    healthAlerts: true,
    dailyReports: false,
    soundEnabled: true,
    threshold: 150,
  })

  const handleToggle = (setting: string) => {
    setNotificationSettings((prev) => ({
      ...prev,
      [setting]: !prev[setting as keyof typeof prev],
    }))
  }

  const handleThresholdChange = (value: number[]) => {
    setNotificationSettings((prev) => ({
      ...prev,
      threshold: value[0],
    }))
  }


  return (
    <div className="relative min-h-screen overflow-hidden">
      <AnimatedBackground />


      <div className="container relative mx-auto py-6 space-y-6 z-10">
        <div className="flex items-center gap-2">
          <Link href="/">
            <Button variant="ghost" size="icon" className="bg-white/10 text-white hover:bg-white/20">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-3xl font-bold tracking-tight text-white">Notification Settings</h1>
        </div>


        <Card className="bg-white/10 backdrop-blur-sm border-white/20">
          <CardHeader>
            <CardTitle className="text-white">Alert Preferences</CardTitle>
            <CardDescription className="text-white/70">Choose which notifications you want to receive</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-amber-400" />
                  <span className="text-white">Air Quality Alerts</span>
                </div>
                <Switch
                  checked={notificationSettings.airQuality}
                  onCheckedChange={() => handleToggle("airQuality")}
                  className="data-[state=checked]:bg-blue-500"
                />
              </div>


              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Droplets className="h-4 w-4 text-blue-400" />
                  <span className="text-white">Water Quality Alerts</span>
                </div>
                <Switch
                  checked={notificationSettings.waterQuality}
                  onCheckedChange={() => handleToggle("waterQuality")}
                  className="data-[state=checked]:bg-blue-500"
                />
              </div>


              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Car className="h-4 w-4 text-green-400" />
                  <span className="text-white">Traffic Congestion Alerts</span>
                </div>
                <Switch
                  checked={notificationSettings.traffic}
                  onCheckedChange={() => handleToggle("traffic")}
                  className="data-[state=checked]:bg-blue-500"
                />
              </div>


              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <svg
                    className="h-4 w-4 text-red-400"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                      fill="currentColor"
                    />
                  </svg>
                  <span className="text-white">Health Recommendations</span>
                </div>
                <Switch
                  checked={notificationSettings.healthAlerts}
                  onCheckedChange={() => handleToggle("healthAlerts")}
                  className="data-[state=checked]:bg-blue-500"
                />
              </div>


              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Bell className="h-4 w-4 text-purple-400" />
                  <span className="text-white">Daily Summary Reports</span>
                </div>
                <Switch
                  checked={notificationSettings.dailyReports}
                  onCheckedChange={() => handleToggle("dailyReports")}
                  className="data-[state=checked]:bg-blue-500"
                />
              </div>
            </div>


            <div className="pt-4 border-t border-white/10">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  {notificationSettings.soundEnabled ? (
                    <Bell className="h-4 w-4 text-white" />
                  ) : (
                    <BellOff className="h-4 w-4 text-white" />
                  )}
                  <span className="text-white">Sound Alerts</span>
                </div>
                <Switch
                  checked={notificationSettings.soundEnabled}
                  onCheckedChange={() => handleToggle("soundEnabled")}
                  className="data-[state=checked]:bg-blue-500"
                />
              </div>


              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-white">AQI Alert Threshold</span>
                  <span className="text-sm font-medium text-white">{notificationSettings.threshold}</span>
                </div>
                <Slider
                  value={[notificationSettings.threshold]}
                  min={50}
                  max={300}
                  step={10}
                  onValueChange={handleThresholdChange}
                  className="[&_[role=slider]]:bg-blue-500"
                />
                <div className="flex justify-between text-xs text-white/70">
                  <span>Good (50)</span>
                  <span>Moderate (100)</span>
                  <span>Unhealthy (150)</span>
                  <span>Severe (300)</span>
                </div>
              </div>
            </div>


            <div className="rounded-md bg-blue-500/20 p-3">
              <div className="flex items-center gap-2 text-blue-100">
                <Bell className="h-4 w-4" />
                <span className="text-sm font-medium">Notification Preview</span>
              </div>
              <div className="mt-2 p-2 bg-black/30 rounded border border-white/10">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-amber-400" />
                  <span className="text-sm text-white">
                    AQI has reached {notificationSettings.threshold} in your area
                  </span>
                </div>
                <p className="mt-1 text-xs text-white/70">Consider wearing a mask and limiting outdoor activities.</p>
              </div>
              <p className="mt-2 text-xs text-blue-100/80">
                This is how your notifications will appear on your device.
              </p>
            </div>


            <Button className="w-full bg-blue-500 hover:bg-blue-600 text-white">Save Preferences</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

