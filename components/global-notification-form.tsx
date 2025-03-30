"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Bell, CheckCircle2, X } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "@/components/ui/use-toast"
import { ToastAction } from "@/components/ui/toast"
import { registerUser } from "@/app/actions/user-actions"

interface GlobalNotificationFormProps {
  onClose: () => void
}

export function GlobalNotificationForm({ onClose }: GlobalNotificationFormProps) {
  const [phoneNumber, setPhoneNumber] = useState("")
  const [isValidPhone, setIsValidPhone] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState("")
  const [isValidEmail, setIsValidEmail] = useState(false)
  const [notificationPreferences, setNotificationPreferences] = useState({
    sms: true,
    email: false,
    push: true,
  })
  const [notificationTypes, setNotificationTypes] = useState({
    airQuality: true,
    waterQuality: true,
    uvIndex: true,
    trafficAlerts: false,
    healthAdvisories: true,
    dailySummary: false,
  })
  const [areaOfInterest, setAreaOfInterest] = useState("Delhi")
  const router = useRouter()

  // Validate phone number as user types
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^\d]/g, "")

    // Format phone number as user types in Indian format
    let formattedPhone = ""
    if (value.length <= 5) {
      formattedPhone = value
    } else if (value.length <= 10) {
      formattedPhone = `${value.slice(0, 5)} ${value.slice(5)}`
    } else {
      // If more than 10 digits, truncate and format
      formattedPhone = `${value.slice(0, 5)} ${value.slice(5, 10)}`
    }

    setPhoneNumber(formattedPhone)
    setIsValidPhone(value.length === 10)
  }

  // Validate email as user types
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setEmail(value)

    // Simple email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    setIsValidEmail(emailRegex.test(value))
  }

  const handleCheckboxChange = (type: keyof typeof notificationTypes) => {
    setNotificationTypes((prev) => ({
      ...prev,
      [type]: !prev[type],
    }))
  }

  const handlePreferenceChange = (type: keyof typeof notificationPreferences) => {
    setNotificationPreferences((prev) => ({
      ...prev,
      [type]: !prev[type],
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validate that at least one contact method is valid
    if (
      (!isValidPhone && !isValidEmail) ||
      (notificationPreferences.sms && !isValidPhone) ||
      (notificationPreferences.email && !isValidEmail)
    ) {
      toast({
        title: "Invalid contact information",
        description: "Please provide a valid phone number or email based on your notification preferences.",
        variant: "destructive",
      })
      return
    }

    // Validate that at least one notification type is selected
    if (!Object.values(notificationTypes).some((value) => value)) {
      toast({
        title: "No notification types selected",
        description: "Please select at least one type of notification to receive.",
        variant: "destructive",
      })
      return
    }

    setLoading(true)

    try {
      // Create FormData object to pass to the server action
      const formData = new FormData()
      formData.append("name", "User") // Default name, can be updated later
      formData.append("phoneNumber", phoneNumber.replace(/\s/g, "")) // Remove spaces
      if (email) formData.append("email", email)

      // Add notification types
      if (notificationTypes.airQuality) formData.append("notifyAirQuality", "on")
      if (notificationTypes.waterQuality) formData.append("notifyWaterQuality", "on")
      if (notificationTypes.uvIndex) formData.append("notifyUVIndex", "on")
      if (notificationTypes.trafficAlerts) formData.append("notifyTraffic", "on")
      if (notificationTypes.healthAdvisories) formData.append("notifyHealthAdvisories", "on")
      if (notificationTypes.dailySummary) formData.append("notifyDailySummary", "on")

      // Add notification methods
      if (notificationPreferences.sms) formData.append("notifySMS", "on")
      if (notificationPreferences.email) formData.append("notifyEmail", "on")
      if (notificationPreferences.push) formData.append("notifyPush", "on")

      // Add area of interest
      formData.append("areaOfInterest", areaOfInterest)

      // Register user in MongoDB
      const result = await registerUser(formData)

      if (result.success) {
        // Request notification permission from browser
        if ("Notification" in window) {
          try {
            const permission = await Notification.requestPermission()
            console.log("Notification permission:", permission)
          } catch (error) {
            console.error("Error requesting notification permission:", error)
          }
        }

        setSubmitted(true)

        // Show success toast
        toast({
          title: "Successfully enrolled!",
          description: "Your information has been saved to our database.",
          action: <ToastAction altText="View Settings">View Settings</ToastAction>,
        })

        // Redirect to home page after 3 seconds
        setTimeout(() => {
          onClose()
          router.push("/")
        }, 3000)
      } else {
        toast({
          title: "Registration failed",
          description: result.message,
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error registering user:", error)
      toast({
        title: "Registration error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md bg-white/10 backdrop-blur-sm border-white/20 text-white animate-slideUp relative">
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-2 top-2 text-white hover:bg-white/10"
          onClick={onClose}
        >
          <X className="h-4 w-4" />
        </Button>

        {!submitted ? (
          <>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5 text-blue-400" />
                Pollution Monitoring Notifications
              </CardTitle>
              <CardDescription className="text-white/70">
                Get real-time alerts about air quality, water pollution, and UV index
              </CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-white">
                    Phone Number
                  </Label>
                  <div className="flex">
                    <div className="bg-white/10 border border-white/20 rounded-l-md px-3 py-2 text-white">+91</div>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="XXXXX XXXXX"
                      value={phoneNumber}
                      onChange={handlePhoneChange}
                      className="bg-white/10 border-white/20 text-white placeholder:text-white/50 rounded-l-none"
                      maxLength={11} // 5 digits + space + 5 digits
                    />
                  </div>
                  {phoneNumber && !isValidPhone && (
                    <p className="text-xs text-red-400">Please enter a valid 10-digit mobile number</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-white">
                    Email Address
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={handleEmailChange}
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                  />
                  {email && !isValidEmail && <p className="text-xs text-red-400">Please enter a valid email address</p>}
                </div>

                {/* <div className="space-y-2">
                  <Label className="text-white">Notification Method</Label>
                  <div className="flex flex-wrap gap-4">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="sms"
                        checked={notificationPreferences.sms}
                        onCheckedChange={() => handlePreferenceChange("sms")}
                        className="border-white/50 data-[state=checked]:bg-blue-500"
                      />
                      <Label htmlFor="sms" className="text-sm">
                        SMS
                      </Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="email-pref"
                        checked={notificationPreferences.email}
                        onCheckedChange={() => handlePreferenceChange("email")}
                        className="border-white/50 data-[state=checked]:bg-blue-500"
                      />
                      <Label htmlFor="email-pref" className="text-sm">
                        Email
                      </Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="push"
                        checked={notificationPreferences.push}
                        onCheckedChange={() => handlePreferenceChange("push")}
                        className="border-white/50 data-[state=checked]:bg-blue-500"
                      />
                      <Label htmlFor="push" className="text-sm">
                        Push Notifications
                      </Label>
                    </div>
                  </div>
                </div> */}

                {/* <div className="space-y-3">
                  <Label className="text-white">Notification Types</Label>

                  <div className="grid grid-cols-2 gap-2">
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
                        Traffic & Pollution
                      </Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="health-advisories"
                        checked={notificationTypes.healthAdvisories}
                        onCheckedChange={() => handleCheckboxChange("healthAdvisories")}
                        className="border-white/50 data-[state=checked]:bg-blue-500"
                      />
                      <Label htmlFor="health-advisories" className="text-sm">
                        Health Advisories
                      </Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="daily-summary"
                        checked={notificationTypes.dailySummary}
                        onCheckedChange={() => handleCheckboxChange("dailySummary")}
                        className="border-white/50 data-[state=checked]:bg-blue-500"
                      />
                      <Label htmlFor="daily-summary" className="text-sm">
                        Daily Summary
                      </Label>
                    </div>
                  </div>
                </div> */}

                <div className="space-y-2">
                  <Label htmlFor="area" className="text-white">
                    Area of Interest
                  </Label>
                  <Input
                    id="area"
                    value={areaOfInterest}
                    onChange={(e) => setAreaOfInterest(e.target.value)}
                    className="bg-white/10 border-white/20 text-white"
                    placeholder="Enter your location"
                  />
                </div>

                <div className="rounded-md bg-blue-500/20 p-3 text-xs text-blue-100">
                  <p>
                    By signing up, you agree to receive notifications about environmental conditions. Message and data
                    rates may apply. You can unsubscribe at any time.
                  </p>
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                  {loading ? "Processing..." : "Sign Up for Notifications"}
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
              <p className="text-white/90">Thank you for signing up! You will now receive notifications for:</p>
              <div className="grid grid-cols-2 gap-2">
                {Object.entries(notificationTypes)
                  .filter(([_, enabled]) => enabled)
                  .map(([type]) => (
                    <div key={type} className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-green-400" />
                      <span className="text-white">
                        {type === "airQuality" && "Air Quality Alerts"}
                        {type === "waterQuality" && "Water Quality Alerts"}
                        {type === "uvIndex" && "UV Index Warnings"}
                        {type === "trafficAlerts" && "Traffic & Pollution"}
                        {type === "healthAdvisories" && "Health Advisories"}
                        {type === "dailySummary" && "Daily Summary"}
                      </span>
                    </div>
                  ))}
              </div>

              <div className="space-y-2 mt-4">
                <p className="text-white/90">Contact methods:</p>
                <div className="space-y-1">
                  {notificationPreferences.sms && isValidPhone && (
                    <p className="text-sm text-white flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-400" />
                      SMS to +91 {phoneNumber}
                    </p>
                  )}
                  {notificationPreferences.email && isValidEmail && (
                    <p className="text-sm text-white flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-400" />
                      Email to {email}
                    </p>
                  )}
                  {notificationPreferences.push && (
                    <p className="text-sm text-white flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-400" />
                      Push notifications on this device
                    </p>
                  )}
                </div>
              </div>

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
    </div>
  )
}

