"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { MapPin, X } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

export function LocationAccess() {
  const [showPrompt, setShowPrompt] = useState(false)
  const [locationGranted, setLocationGranted] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    // Check if location permission was previously granted
    const checkLocationPermission = async () => {
      try {
        // First check if geolocation is available
        if (!navigator.geolocation) {
          console.log("Geolocation not supported")
          return
        }

        // Try permissions API first (more reliable)
        if (navigator.permissions) {
          try {
            const result = await navigator.permissions.query({ name: "geolocation" as PermissionName })

            if (result.state === "granted") {
              setLocationGranted(true)
            } else if (result.state === "prompt") {
              // Show prompt after a short delay
              setTimeout(() => setShowPrompt(true), 2000)
            } else if (result.state === "denied") {
              // Permission already denied, don't show prompt
              console.log("Geolocation permission already denied")
            }
          } catch (error) {
            console.log("Error checking permissions:", error)
            // Don't show prompt if there's a permissions policy error
            if (error instanceof Error && error.message.includes("permissions policy")) {
              console.log("Geolocation disabled by permissions policy, not showing prompt")
              return
            }
            // Fallback to showing the prompt for other errors
            setTimeout(() => setShowPrompt(true), 2000)
          }
        } else {
          // Permissions API not available, try a test call to geolocation
          try {
            // Set a timeout in case geolocation hangs
            const timeoutPromise = new Promise((_, reject) => {
              setTimeout(() => reject(new Error("Geolocation request timed out")), 3000)
            })

            const positionPromise = new Promise((resolve) => {
              navigator.geolocation.getCurrentPosition(
                () => resolve(true),
                (error) => {
                  // Don't show prompt if there's a permissions policy error
                  if (error.message && error.message.includes("permissions policy")) {
                    console.log("Geolocation disabled by permissions policy, not showing prompt")
                    resolve(false)
                    return
                  }
                  resolve(false)
                },
                { timeout: 2000, maximumAge: 0 },
              )
            })

            // Race the promises
            const hasAccess = await Promise.race([positionPromise, timeoutPromise])

            if (hasAccess === true) {
              setLocationGranted(true)
            } else {
              // Show prompt after a short delay
              setTimeout(() => setShowPrompt(true), 2000)
            }
          } catch (error) {
            console.log("Error testing geolocation:", error)
            // Don't show prompt if there's a permissions policy error
            if (error instanceof Error && error.message.includes("permissions policy")) {
              console.log("Geolocation disabled by permissions policy, not showing prompt")
              return
            }
            // Fallback to showing the prompt for other errors
            setTimeout(() => setShowPrompt(true), 2000)
          }
        }
      } catch (error) {
        console.error("Unexpected error checking location permission:", error)
      }
    }

    checkLocationPermission()
  }, [])

  const requestLocation = () => {
    if (!navigator.geolocation) {
      toast({
        title: "Geolocation Not Supported",
        description: "Your browser doesn't support geolocation.",
        variant: "destructive",
      })
      setShowPrompt(false)
      return
    }

    // Set a timeout in case geolocation hangs
    const timeoutId = setTimeout(() => {
      toast({
        title: "Location Request Timed Out",
        description: "We'll use default location data. You can try again later.",
        variant: "destructive",
      })
      setShowPrompt(false)
    }, 10000)

    try {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // Success
          clearTimeout(timeoutId)
          setLocationGranted(true)
          setShowPrompt(false)

          toast({
            title: "Location Access Granted",
            description: "We'll provide more accurate environmental data for your area.",
          })

          // Store location data or send to server
          const latitude = position.coords.latitude
          const longitude = position.coords.longitude
          console.log("Location:", latitude, longitude)

          // Here you would typically send this to your backend or use it to fetch local data
        },
        (error) => {
          // Error
          clearTimeout(timeoutId)
          console.error("Error getting location:", error)
          setShowPrompt(false)

          let errorMessage = "We'll use default location data. You can change this in settings."

          // Provide more specific error messages
          if (error.code === 1) {
            errorMessage = "Location access was denied. We'll use default data instead."
          } else if (error.code === 2) {
            errorMessage = "Your location is unavailable. We'll use default data instead."
          } else if (error.code === 3) {
            errorMessage = "Location request timed out. We'll use default data instead."
          } else if (error.message && error.message.includes("permissions policy")) {
            errorMessage =
              "Location access is disabled by your browser or environment settings. We'll use default data instead."
          }

          toast({
            title: "Location Access Issue",
            description: errorMessage,
            variant: "destructive",
          })
        },
        {
          enableHighAccuracy: false,
          timeout: 8000,
          maximumAge: 60000,
        },
      )
    } catch (error) {
      clearTimeout(timeoutId)
      console.error("Unexpected error requesting location:", error)

      toast({
        title: "Location Access Error",
        description: "An unexpected error occurred. We'll use default location data.",
        variant: "destructive",
      })

      setShowPrompt(false)
    }
  }

  const dismissPrompt = () => {
    setShowPrompt(false)

    toast({
      title: "Location Access Skipped",
      description: "We'll use default location data. You can enable location access later in settings.",
    })
  }

  return (
    <>
      {showPrompt && (
        <div className="fixed bottom-4 left-0 right-0 mx-auto w-full max-w-md z-50 px-4">
          <div className="bg-black/80 backdrop-blur-md border border-white/20 rounded-lg p-4 shadow-lg animate-slideUp">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3">
                <div className="bg-blue-500/30 p-2 rounded-full">
                  <MapPin className="h-6 w-6 text-blue-400" />
                </div>
                <div>
                  <h3 className="text-white font-medium">Allow Location Access</h3>
                  <p className="text-white/70 text-sm mt-1">
                    To provide accurate pollution data for your area, we need access to your location.
                  </p>
                </div>
              </div>
              <button onClick={dismissPrompt} className="text-white/70 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex gap-2 mt-4">
              <Button
                onClick={dismissPrompt}
                variant="outline"
                className="flex-1 bg-white/10 border-white/20 text-white hover:bg-white/20"
              >
                Not Now
              </Button>
              <Button onClick={requestLocation} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white">
                Allow Access
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

