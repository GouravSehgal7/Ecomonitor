"use client"

import type React from "react"

import { useState } from "react"
import type { User } from "@/lib/user-model"
import { updateUserProfile } from "@/app/actions/user-actions"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/components/ui/use-toast"

interface UserProfileFormProps {
  user: User
}

export function UserProfileForm({ user }: UserProfileFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsSubmitting(true)

    try {
      const formData = new FormData(event.currentTarget)
      const result = await updateUserProfile(user._id!.toString(), formData)

      if (result.success) {
        toast({
          title: "Profile updated",
          description: result.message,
          variant: "default",
        })
      } else {
        toast({
          title: "Update failed",
          description: result.message,
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card className="w-full bg-white/10 backdrop-blur-sm border-white/20">
      <CardHeader>
        <CardTitle className="text-white">Edit Profile</CardTitle>
        <CardDescription className="text-white/70">
          Update your personal information and notification preferences
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-white">
                Full Name
              </Label>
              <Input
                id="name"
                name="name"
                defaultValue={user.name}
                required
                className="bg-white/10 border-white/20 text-white"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phoneNumber" className="text-white">
                Phone Number
              </Label>
              <Input
                id="phoneNumber"
                name="phoneNumber"
                type="tel"
                defaultValue={user.phoneNumber}
                disabled
                className="bg-white/10 border-white/20 text-white opacity-70"
              />
              <p className="text-xs text-white/50">Phone number cannot be changed</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-white">
                Email Address
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                defaultValue={user.email || ""}
                className="bg-white/10 border-white/20 text-white"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="areaOfInterest" className="text-white">
                Area of Interest
              </Label>
              <Input
                id="areaOfInterest"
                name="areaOfInterest"
                defaultValue={user.preferences.areaOfInterest || "Delhi, India"}
                className="bg-white/10 border-white/20 text-white"
              />
            </div>
          </div>

          <Separator className="bg-white/20" />

          <div className="space-y-2">
            <Label className="text-white">Health Profile</Label>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="age" className="text-sm text-white/70">
                  Age
                </Label>
                <Input
                  id="age"
                  name="age"
                  type="number"
                  defaultValue={user.healthProfile.age?.toString() || ""}
                  className="bg-white/10 border-white/20 text-white"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="conditions" className="text-sm text-white/70">
                  Health Conditions
                </Label>
                <Input
                  id="conditions"
                  name="conditions"
                  defaultValue={user.healthProfile.conditions?.join(", ") || ""}
                  className="bg-white/10 border-white/20 text-white"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="medications" className="text-sm text-white/70">
                  Medications
                </Label>
                <Input
                  id="medications"
                  name="medications"
                  defaultValue={user.healthProfile.medications?.join(", ") || ""}
                  className="bg-white/10 border-white/20 text-white"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="allergies" className="text-sm text-white/70">
                  Allergies
                </Label>
                <Input
                  id="allergies"
                  name="allergies"
                  defaultValue={user.healthProfile.allergies?.join(", ") || ""}
                  className="bg-white/10 border-white/20 text-white"
                />
              </div>
            </div>
          </div>

          <Separator className="bg-white/20" />

          <div className="space-y-4">
            <Label className="text-white">Notification Preferences</Label>

            <div className="space-y-2">
              <Label className="text-sm text-white/70">Alert Types</Label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="notifyAirQuality"
                    name="notifyAirQuality"
                    defaultChecked={user.preferences.notificationTypes.includes("airQuality")}
                  />
                  <Label htmlFor="notifyAirQuality" className="text-sm text-white">
                    Air Quality
                  </Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="notifyWaterQuality"
                    name="notifyWaterQuality"
                    defaultChecked={user.preferences.notificationTypes.includes("waterQuality")}
                  />
                  <Label htmlFor="notifyWaterQuality" className="text-sm text-white">
                    Water Quality
                  </Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="notifyUVIndex"
                    name="notifyUVIndex"
                    defaultChecked={user.preferences.notificationTypes.includes("uvIndex")}
                  />
                  <Label htmlFor="notifyUVIndex" className="text-sm text-white">
                    UV Index
                  </Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="notifyTraffic"
                    name="notifyTraffic"
                    defaultChecked={user.preferences.notificationTypes.includes("trafficAlerts")}
                  />
                  <Label htmlFor="notifyTraffic" className="text-sm text-white">
                    Traffic Alerts
                  </Label>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-sm text-white/70">Notification Methods</Label>
              <div className="grid grid-cols-3 gap-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="notifySMS"
                    name="notifySMS"
                    defaultChecked={user.preferences.notificationMethods.includes("sms")}
                  />
                  <Label htmlFor="notifySMS" className="text-sm text-white">
                    SMS
                  </Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="notifyEmail"
                    name="notifyEmail"
                    defaultChecked={user.preferences.notificationMethods.includes("email")}
                  />
                  <Label htmlFor="notifyEmail" className="text-sm text-white">
                    Email
                  </Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="notifyPush"
                    name="notifyPush"
                    defaultChecked={user.preferences.notificationMethods.includes("push")}
                  />
                  <Label htmlFor="notifyPush" className="text-sm text-white">
                    Push
                  </Label>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button
            type="button"
            variant="outline"
            className="bg-white/10 border-white/20 text-white hover:bg-white/20"
            onClick
            className="bg-white/10 border-white/20 text-white hover:bg-white/20"
            onClick={() => window.history.back()}
          >
            Cancel
          </Button>
          <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : "Save Changes"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}

