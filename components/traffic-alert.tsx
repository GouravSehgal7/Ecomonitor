"use client"

import { useEffect } from "react"
import { AlertTriangle, X } from "lucide-react"

interface TrafficAlertProps {
  onClose: () => void
}

export function TrafficAlert({ onClose }: TrafficAlertProps) {
  // Play beep sound when alert appears
  useEffect(() => {
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
  }, [])

  return (
    <div className="relative overflow-hidden rounded-lg bg-red-500/20 backdrop-blur-sm border border-red-500/30 p-4 animate-pulse">
      <div className="flex items-start gap-4">
        <div className="bg-red-500 rounded-full p-2">
          <AlertTriangle className="h-6 w-6 text-white" />
        </div>

        <div className="flex-1">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-white">Traffic Alert</h3>
            <button onClick={onClose} className="rounded-full bg-white/10 p-1 hover:bg-white/20">
              <X className="h-4 w-4 text-white" />
            </button>
          </div>

          <p className="mt-1 text-white/80">
            Severe congestion detected on NH-48 near Dhaula Kuan. AQI levels have increased by 75 points in the last
            hour.
          </p>

          <div className="mt-3 flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-red-500 animate-ping" />
            <span className="text-sm text-white">Estimated delay: 45+ minutes</span>
          </div>
        </div>
      </div>
    </div>
  )
}

