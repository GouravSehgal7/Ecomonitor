// "use client"

// import type React from "react"

// import { useState } from "react"
// import { useRouter } from "next/navigation"
// import { registerUser } from "@/app/actions/user-actions"
// import { Button } from "@/components/ui/button"
// import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
// import { Checkbox } from "@/components/ui/checkbox"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Separator } from "@/components/ui/separator"
// import { useToast } from "@/components/ui/use-toast"

// export function UserRegistrationForm() {
//   const [isSubmitting, setIsSubmitting] = useState(false)
//   const { toast } = useToast()
//   const router = useRouter()

//   async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
//     event.preventDefault()
//     setIsSubmitting(true)

//     try {
//       const formData = new FormData(event.currentTarget)
//       const result = await registerUser(formData)

//       if (result.success) {
//         toast({
//           title: "Registration successful",
//           description: result.message,
//           variant: "default",
//         })

//         // Redirect to dashboard (home page) after successful registration
//         router.push("/")
//       } else {
//         toast({
//           title: "Registration failed",
//           description: result.message,
//           variant: "destructive",
//         })
//       }
//     } catch (error) {
//       toast({
//         title: "Error",
//         description: "An unexpected error occurred. Please try again.",
//         variant: "destructive",
//       })
//     } finally {
//       setIsSubmitting(false)
//     }
//   }

//   return (
//     <Card className="w-full max-w-md bg-white/10 backdrop-blur-sm border-white/20">
//       <CardHeader>
//         <CardTitle className="text-white">User Registration</CardTitle>
//         <CardDescription className="text-white/70">
//           Create your account to receive personalized pollution alerts
//         </CardDescription>
//       </CardHeader>
//       <form onSubmit={handleSubmit}>
//         <CardContent className="space-y-4">
//           <div className="space-y-2">
//             <Label htmlFor="name" className="text-white">
//               Full Name
//             </Label>
//             <Input
//               id="name"
//               name="name"
//               placeholder="Enter your full name"
//               required
//               className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
//             />
//           </div>

//           <div className="space-y-2">
//             <Label htmlFor="phoneNumber" className="text-white">
//               Phone Number
//             </Label>
//             <Input
//               id="phoneNumber"
//               name="phoneNumber"
//               type="tel"
//               placeholder="+91 XXXXX XXXXX"
//               required
//               pattern="[0-9]{10}"
//               maxLength={10}
//               className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
//             />
//             <p className="text-xs text-white/70">Enter 10 digit mobile number without country code</p>
//           </div>

//           <div className="space-y-2">
//             <Label htmlFor="email" className="text-white">
//               Email Address
//             </Label>
//             <Input
//               id="email"
//               name="email"
//               type="email"
//               placeholder="your@email.com"
//               className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
//             />
//           </div>

//           <Separator className="bg-white/20" />

//           <div className="space-y-2">
//             <Label className="text-white">Health Profile</Label>

//             <div className="grid grid-cols-2 gap-2">
//               <div>
//                 <Label htmlFor="age" className="text-sm text-white/70">
//                   Age
//                 </Label>
//                 <Input
//                   id="age"
//                   name="age"
//                   type="number"
//                   placeholder="Age"
//                   className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
//                 />
//               </div>

//               <div>
//                 <Label htmlFor="conditions" className="text-sm text-white/70">
//                   Health Conditions
//                 </Label>
//                 <Input
//                   id="conditions"
//                   name="conditions"
//                   placeholder="Asthma, Diabetes, etc."
//                   className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
//                 />
//               </div>
//             </div>
//           </div>

//           <Separator className="bg-white/20" />

//           <div className="space-y-2">
//             <Label className="text-white">Notification Preferences</Label>

//             <div className="space-y-2">
//               <Label className="text-sm text-white/70">Alert Types</Label>
//               <div className="grid grid-cols-2 gap-2">
//                 <div className="flex items-center space-x-2">
//                   <Checkbox id="notifyAirQuality" name="notifyAirQuality" defaultChecked />
//                   <Label htmlFor="notifyAirQuality" className="text-sm text-white">
//                     Air Quality
//                   </Label>
//                 </div>

//                 <div className="flex items-center space-x-2">
//                   <Checkbox id="notifyWaterQuality" name="notifyWaterQuality" defaultChecked />
//                   <Label htmlFor="notifyWaterQuality" className="text-sm text-white">
//                     Water Quality
//                   </Label>
//                 </div>

//                 <div className="flex items-center space-x-2">
//                   <Checkbox id="notifyUVIndex" name="notifyUVIndex" />
//                   <Label htmlFor="notifyUVIndex" className="text-sm text-white">
//                     UV Index
//                   </Label>
//                 </div>

//                 <div className="flex items-center space-x-2">
//                   <Checkbox id="notifyTraffic" name="notifyTraffic" />
//                   <Label htmlFor="notifyTraffic" className="text-sm text-white">
//                     Traffic Alerts
//                   </Label>
//                 </div>
//               </div>
//             </div>

//             <div className="space-y-2">
//               <Label className="text-sm text-white/70">Notification Methods</Label>
//               <div className="grid grid-cols-3 gap-2">
//                 <div className="flex items-center space-x-2">
//                   <Checkbox id="notifySMS" name="notifySMS" defaultChecked />
//                   <Label htmlFor="notifySMS" className="text-sm text-white">
//                     SMS
//                   </Label>
//                 </div>

//                 <div className="flex items-center space-x-2">
//                   <Checkbox id="notifyEmail" name="notifyEmail" />
//                   <Label htmlFor="notifyEmail" className="text-sm text-white">
//                     Email
//                   </Label>
//                 </div>

//                 <div className="flex items-center space-x-2">
//                   <Checkbox id="notifyPush" name="notifyPush" defaultChecked />
//                   <Label htmlFor="notifyPush" className="text-sm text-white">
//                     Push
//                   </Label>
//                 </div>
//               </div>
//             </div>

//             <div className="space-y-2">
//               <Label htmlFor="areaOfInterest" className="text-sm text-white/70">
//                 Area of Interest
//               </Label>
//               <Input
//                 id="areaOfInterest"
//                 name="areaOfInterest"
//                 placeholder="Delhi, India"
//                 defaultValue="Delhi, India"
//                 className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
//               />
//             </div>
//           </div>
//         </CardContent>
//         <CardFooter>
//           <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white" disabled={isSubmitting}>
//             {isSubmitting ? "Registering..." : "Register"}
//           </Button>
//         </CardFooter>
//       </form>
//     </Card>
//   )
// }


"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { registerUser, loginUser } from "@/app/actions/user-actions"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/components/ui/use-toast"
import Link from "next/link";

export function AuthForm({ type }: { type: "signup" | "login" }) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsSubmitting(true)

    try {
      const formData = new FormData(event.currentTarget)
      const action = type === "signup" ? registerUser : loginUser
      const result = await action(formData)

      if (result.success) {
        toast({
          title: `${type === "signup" ? "Registration" : "Login"} successful`,
          description: result.message,
          variant: "default",
        })
        router.push("/")
      } else {
        toast({
          title: `${type === "signup" ? "Registration" : "Login"} failed`,
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
    <Card className="w-full max-w-md bg-white/10 backdrop-blur-sm border-white/20">
      <CardHeader>
        <CardTitle className="text-white">{type === "signup" ? "User Registration" : "User Login"}</CardTitle>
        <CardDescription className="text-white/70">
          {type === "signup"
            ? "Create your account to receive personalized pollution alerts"
            : "Login to your account"}
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          {type === "signup" && (
            <div className="space-y-2">
              <Label htmlFor="name" className="text-white">Full Name</Label>
              <Input
                id="name"
                name="name"
                placeholder="Enter your full name"
                required
                className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
              />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="email" className="text-white">Email Address</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="your@email.com"
              required
              className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-white">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="Enter your password"
              required
              className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
            />
          </div>

          {/* {type === "signup" && (
            <>
              <Separator className="bg-white/20" />
              <div className="space-y-2">
                <Label className="text-white">Notification Preferences</Label>
                <div className="space-y-2">
                  <Label className="text-sm text-white/70">Notification Methods</Label>
                  <div className="grid grid-cols-3 gap-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="notifySMS" name="notifySMS" defaultChecked />
                      <Label htmlFor="notifySMS" className="text-sm text-white">SMS</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="notifyEmail" name="notifyEmail" />
                      <Label htmlFor="notifyEmail" className="text-sm text-white">Email</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="notifyPush" name="notifyPush" defaultChecked />
                      <Label htmlFor="notifyPush" className="text-sm text-white">Push</Label>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )} */}
        </CardContent>
        <CardFooter>
            <div className=" flex flex-col items-center justify-center w-full">
          <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white" disabled={isSubmitting}>
            {isSubmitting ? (type === "signup" ? "Registering..." : "Logging in...") : type === "signup" ? "Register" : "Login"}
          </Button>
          <p>
  {type === "signup" ? (
    <>
      Already have an account? <Link href="/login">Login</Link>
    </>
  ) : (
    <>
      Don’t have an account? <Link href="/register">Register</Link>
    </>
  )}
</p>

          </div>
        </CardFooter>
      </form>
    </Card>
  )
}
