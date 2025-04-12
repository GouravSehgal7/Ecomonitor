"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { Gettokendata } from "@/lib/firebase"

interface FormData {
  name: string
  email: string
  age: number
  token: string
  time: string 
}

interface ApiResponse {
  success: boolean
  message: string
  user?: {
    _id: string
    name: string
    email: string
    age: string // Matches your API response
    token: string
    time:string
    __v?: number
}
}

export function AuthForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    age: 0,
    token: "",
    time: "" 
  })
  const { toast } = useToast()
  const router = useRouter()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: name === "age" ? parseInt(value) : value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Get FCM token
      const fcmToken = await Gettokendata()
      
      if (!fcmToken) {
        toast({
          title: "Notification warning",
          description: "Notifications may not work without token",
          variant: "default",
        })
      }

      // Prepare final data with token
      const submissionData = {
        ...formData,
        token: fcmToken || ""
      }

      // Send to API
      const response = await fetch('/api/subscribe-to-notification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submissionData),
      })

      const result: ApiResponse = await response.json()

      if (!response.ok) {
        throw new Error(result.message || 'Submission failed')
      }

      // Store user data in localStorage
      if (result.user) {
        localStorage.setItem('userData', JSON.stringify(result.user))
      }

      toast({
        title: "Success",
        description: result.message || "Registration completed successfully!",
        variant: "default",
      })

      // Redirect to home page
      router.push("/")

    } catch (error) {
      console.error("Submission error:", error)
      
      // Clear form on error
      setFormData({
        name: "",
        email: "",
        age: 0,
        token: "",
        time:""
      })

      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to submit form. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Validate form inputs
  const isFormValid = formData.name.trim() !== "" && 
                     formData.email.includes('@') && 
                     formData.age > 0

  return (
    <Card className="w-full max-w-md bg-white/10 backdrop-blur-sm border-white/20">
      <CardHeader>
        <CardTitle className="text-white">Get notification</CardTitle>
        <CardDescription className="text-white/70">
          Get real time personalized notification
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-white">Full Name</Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your full name"
              required
              className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
              disabled={isSubmitting}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-white">Email Address</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="your@email.com"
              required
              className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
              disabled={isSubmitting}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="age" className="text-white">Age</Label>
            <Input
              id="age"
              name="age"
              type="number"
              value={formData.age}
              onChange={handleChange}
              placeholder="Enter your age"
              required
              min="1"
              className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
              disabled={isSubmitting}
            />
          </div>
          <div className="space-y-2">
  <Label htmlFor="time" className="text-white">Preferred Notification Time</Label>
  <Input
    id="time"
    name="time"
    type="time"
    value={formData.time}
    onChange={handleChange}
    required
    className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
    disabled={isSubmitting}
  />
</div>
          
        </CardContent>
        <CardFooter>
          <div className="flex flex-col items-center justify-center w-full">
            <Button 
              type="submit" 
              className="w-full bg-blue-600 hover:bg-blue-700 text-white" 
              disabled={isSubmitting || !isFormValid}
            >
              {isSubmitting ? "Proceeding..." : "Done"}
            </Button>
          </div>
        </CardFooter>
      </form>
    </Card>
  )
}

