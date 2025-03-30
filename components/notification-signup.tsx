"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Bell, CheckCircle2 } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

interface NotificationSignupProps {
  onClose: () => void
}

export function NotificationSignup({ onClose }: NotificationSignupProps) {
  const [phoneNumber, setPhoneNumber] = useState("")
  const [isValidPhone, setIsValidPhone] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [notificationTypes, setNotificationTypes] = useState({
    waterQuality: true,
    airQuality: true,
    uvIndex: false,
    trafficAlerts: false,
  })

  // Validate phone number as user types
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^\d]/g, "")

    // Format phone number as user types (XXX) XXX-XXXX
    let formattedPhone = ""
    if (value.length <= 3) {
      formattedPhone = value
    } else if (value.length <= 6) {
      formattedPhone = `(${value.slice(0, 3)}) ${value.slice(3)}`
    } else {
      formattedPhone = `(${value.slice(0, 3)}) ${value.slice(3, 6)}-${value.slice(6, 10)}`
    }

    setPhoneNumber(formattedPhone)
    setIsValidPhone(value.length === 10)
  }

  const handleCheckboxChange = (type: keyof typeof notificationTypes) => {
    setNotificationTypes((prev) => ({
      ...prev,
      [type]: !prev[type],
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!isValidPhone) return

    setLoading(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // Request notification permission from browser
    if ("Notification" in window) {
      try {
        const permission = await Notification.requestPermission()
        console.log("Notification permission:", permission)
      } catch (error) {
        console.error("Error requesting notification permission:", error)
      }
    }

    setLoading(false)
    setSubmitted(true)
  }

  return (
    <Card className="w-full max-w-md bg-white/10 backdrop-blur-sm border-white/20 text-white animate-slideUp">
      {!submitted ? (
        <>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-blue-400" />
              Sign Up for Notifications
            </CardTitle>
            <CardDescription className="text-white/70">
              Get real-time alerts about water quality, air pollution, and UV index
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-white">
                  Phone Number
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="(123) 456-7890"
                  value={phoneNumber}
                  onChange={handlePhoneChange}
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                  required
                />
                {phoneNumber && !isValidPhone && (
                  <p className="text-xs text-red-400">Please enter a valid 10-digit phone number</p>
                )}
              </div>

              <div className="space-y-3">
                <Label className="text-white">Notification Types</Label>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="water-quality"
                    checked={notificationTypes.waterQuality}
                    onCheckedChange={() => handleCheckboxChange("waterQuality")}
                    className="border-white/50 data-[state=checked]:bg-blue-500"
                  />
                  <Label htmlFor="water-quality" className="text-sm">
                    Water Quality Alerts
                  </Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="air-quality"
                    checked={notificationTypes.airQuality}
                    onCheckedChange={() => handleCheckboxChange("airQuality")}
                    className="border-white/50 data-[state=checked]:bg-blue-500"
                  />
                  <Label htmlFor="air-quality" className="text-sm">
                    Air Quality Alerts
                  </Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="uv-index"
                    checked={notificationTypes.uvIndex}
                    onCheckedChange={() => handleCheckboxChange("uvIndex")}
                    className="border-white/50 data-[state=checked]:bg-blue-500"
                  />
                  <Label htmlFor="uv-index" className="text-sm">
                    UV Index Warnings
                  </Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="traffic-alerts"
                    checked={notificationTypes.trafficAlerts}
                    onCheckedChange={() => handleCheckboxChange("trafficAlerts")}
                    className="border-white/50 data-[state=checked]:bg-blue-500"
                  />
                  <Label htmlFor="traffic-alerts" className="text-sm">
                    Traffic & Pollution Alerts
                  </Label>
                </div>
              </div>

              <div className="rounded-md bg-blue-500/20 p-3 text-xs text-blue-100">
                <p>
                  By signing up, you agree to receive SMS notifications about environmental conditions. Message and data
                  rates may apply. You can unsubscribe at any time.
                </p>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button type="button" variant="ghost" onClick={onClose} className="text-white hover:bg-white/10">
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={!isValidPhone || loading}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                {loading ? "Processing..." : "Sign Up"}
              </Button>
            </CardFooter>
          </form>
        </>
      ) : (
        <>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-400">
              <CheckCircle2 className="h-5 w-5" />
              Successfully Enrolled!
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-white/90">
              Thank you for signing up! You will now receive notifications at {phoneNumber} for:
            </p>
            <ul className="space-y-2">
              {Object.entries(notificationTypes)
                .filter(([_, enabled]) => enabled)
                .map(([type]) => (
                  <li key={type} className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-green-400" />
                    {type === "waterQuality" && "Water Quality Alerts"}
                    {type === "airQuality" && "Air Quality Alerts"}
                    {type === "uvIndex" && "UV Index Warnings"}
                    {type === "trafficAlerts" && "Traffic & Pollution Alerts"}
                  </li>
                ))}
            </ul>
            <p className="text-white/70 text-sm">
              You can manage your notification preferences in your account settings.
            </p>
          </CardContent>
          <CardFooter>
            <Button onClick={onClose} className="w-full bg-blue-600 hover:bg-blue-700 text-white">
              Close
            </Button>
          </CardFooter>
        </>
      )}
    </Card>
  )
}

