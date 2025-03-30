"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Bell } from "lucide-react"
import { GlobalNotificationForm } from "@/components/global-notification-form"

export function GlobalNotificationButton() {
  const [showForm, setShowForm] = useState(false)

  return (
    <>
      <Button onClick={() => setShowForm(true)} className="bg-blue-600 hover:bg-blue-700 text-white">
        <Bell className="h-4 w-4 mr-2" />
        Get Notifications
      </Button>

      {showForm && <GlobalNotificationForm onClose={() => setShowForm(false)} />}
    </>
  )
}

