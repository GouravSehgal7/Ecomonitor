"use client"

import { useState, useEffect } from "react"
import { AlertTriangle, X, Info, Phone } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface AlertData {
  type: "air" | "water" | "uv" | "traffic"
  parameter: string
  value: number
  limit: number
  unit: string
}

export function AlertNotification() {
  const [alerts, setAlerts] = useState<AlertData[]>([])
  const [showAlert, setShowAlert] = useState(false)
  const [currentAlert, setCurrentAlert] = useState<AlertData | null>(null)
  const [showCallDialog, setShowCallDialog] = useState(false)
  const { toast } = useToast()

  // Simulate checking for alerts
  useEffect(() => {
    // This would normally be replaced with real-time data monitoring
    const checkForAlerts = () => {
      // Simulate random alerts for demonstration
      const randomAlert = Math.random() > 0.7

      if (randomAlert) {
        const alertTypes: AlertData[] = [
          {
            type: "air",
            parameter: "PM2.5",
            value: 180,
            limit: 60,
            unit: "μg/m³",
          },
          {
            type: "water",
            parameter: "TDS",
            value: 550,
            limit: 500,
            unit: "mg/L",
          },
          {
            type: "uv",
            parameter: "UV Index",
            value: 11,
            limit: 8,
            unit: "",
          },
          {
            type: "traffic",
            parameter: "Congestion",
            value: 85,
            limit: 70,
            unit: "%",
          },
        ]

        const newAlert = alertTypes[Math.floor(Math.random() * alertTypes.length)]

        // Check if this alert is already in the queue
        if (!alerts.some((alert) => alert.parameter === newAlert.parameter)) {
          setAlerts((prev) => [...prev, newAlert])
        }
      }
    }

    // Check for alerts every 30 seconds
    const interval = setInterval(checkForAlerts, 30000)

    // Initial check
    checkForAlerts()

    return () => clearInterval(interval)
  }, [alerts])

  // Show alerts one by one
  useEffect(() => {
    if (alerts.length > 0 && !showAlert) {
      setCurrentAlert(alerts[0])
      setShowAlert(true)

      // Remove this alert from the queue
      setAlerts((prev) => prev.slice(1))

      // Play alert sound
      try {
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
        const oscillator = audioContext.createOscillator()
        const gainNode = audioContext.createGain()

        oscillator.connect(gainNode)
        gainNode.connect(audioContext.destination)

        oscillator.type = "sine"
        oscillator.frequency.value = 800
        gainNode.gain.value = 0.3

        oscillator.start()

        // Beep pattern
        setTimeout(() => {
          oscillator.frequency.value = 600
        }, 200)

        setTimeout(() => {
          oscillator.frequency.value = 800
        }, 400)

        setTimeout(() => {
          oscillator.stop()
        }, 600)
      } catch (e) {
        console.error("Error playing beep:", e)
      }

      // Also show toast notification
      toast({
        title: `${getAlertTitle(currentAlert?.type || "air")} Alert`,
        description: `${currentAlert?.parameter}: ${currentAlert?.value}${currentAlert?.unit} exceeds safe limit of ${currentAlert?.limit}${currentAlert?.unit}`,
        variant: "destructive",
      })

      // Auto-dismiss after 3 seconds
      setTimeout(() => {
        setShowAlert(false)
        setCurrentAlert(null)
      }, 3000)
    }
  }, [alerts, showAlert, currentAlert, toast])

  const dismissAlert = () => {
    setShowAlert(false)
    setCurrentAlert(null)
  }

  const handleReportIssue = () => {
    setShowCallDialog(true)
  }

  const handleMakeCall = () => {
    try {
      window.location.href = "tel:155305"
      toast({
        title: "Calling Pollution Control Board",
        description: "Connecting to 155305...",
      })
    } catch (error) {
      console.error("Error making call:", error)
      toast({
        title: "Call Failed",
        description: "Unable to initiate call. Please dial 155305 manually.",
        variant: "destructive",
      })
    }
    setShowCallDialog(false)
  }

  const getAlertTitle = (type: string): string => {
    switch (type) {
      case "air":
        return "Air Quality"
      case "water":
        return "Water Quality"
      case "uv":
        return "UV Index"
      case "traffic":
        return "Traffic"
      default:
        return "Environmental"
    }
  }

  const getAlertColor = (type: string): string => {
    switch (type) {
      case "air":
        return "bg-red-500/20 border-red-500/50"
      case "water":
        return "bg-blue-500/20 border-blue-500/50"
      case "uv":
        return "bg-orange-500/20 border-orange-500/50"
      case "traffic":
        return "bg-amber-500/20 border-amber-500/50"
      default:
        return "bg-purple-500/20 border-purple-500/50"
    }
  }

  const getAlertIcon = (type: string) => {
    switch (type) {
      case "air":
        return <AlertTriangle className="h-6 w-6 text-red-400" />
      case "water":
        return <AlertTriangle className="h-6 w-6 text-blue-400" />
      case "uv":
        return <AlertTriangle className="h-6 w-6 text-orange-400" />
      case "traffic":
        return <AlertTriangle className="h-6 w-6 text-amber-400" />
      default:
        return <AlertTriangle className="h-6 w-6 text-purple-400" />
    }
  }

  if (!showAlert || !currentAlert) return null

  return (
    <>
      <div className="fixed top-20 right-0 left-0 mx-auto w-full max-w-md z-50 px-4">
        <div
          className={`backdrop-blur-md border rounded-lg p-4 shadow-lg animate-slideDown ${getAlertColor(currentAlert.type)}`}
        >
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-full bg-black/20">{getAlertIcon(currentAlert.type)}</div>
              <div>
                <h3 className="text-white font-medium">{getAlertTitle(currentAlert.type)} Alert</h3>
                <p className="text-white/80 text-sm mt-1">
                  {currentAlert.parameter}:{" "}
                  <span className="font-bold">
                    {currentAlert.value}
                    {currentAlert.unit}
                  </span>{" "}
                  exceeds safe limit of {currentAlert.limit}
                  {currentAlert.unit}
                </p>
                <p className="text-white/70 text-xs mt-2">
                  <Info className="h-3 w-3 inline mr-1" />
                  Take appropriate precautions based on the alert type.
                </p>
              </div>
            </div>
            <button onClick={dismissAlert} className="text-white/70 hover:text-white">
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="flex gap-2 mt-4">
            <Button
              onClick={dismissAlert}
              variant="outline"
              className="flex-1 bg-white/10 border-white/20 text-white hover:bg-white/20"
            >
              Dismiss
            </Button>
            <Button onClick={handleReportIssue} className="flex-1 bg-red-600 hover:bg-red-700">
              Report Issue
            </Button>
          </div>
        </div>
      </div>

      <AlertDialog open={showCallDialog} onOpenChange={setShowCallDialog}>
        <AlertDialogContent className="bg-black/80 border-blue-500/50 backdrop-blur-md">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">Call Pollution Control Board</AlertDialogTitle>
            <AlertDialogDescription className="text-white/80">
              Would you like to call the Pollution Control Board at 155305 to report this issue?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-white/10 text-white border-white/20 hover:bg-white/20">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleMakeCall} className="bg-blue-600 hover:bg-blue-700">
              <Phone className="h-4 w-4 mr-2" />
              Call 155305
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

