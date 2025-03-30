import { AuthForm } from "@/components/user-registration-form"
import { AnimatedBackground } from "@/components/animated-background"
import { NavigationBar } from "@/components/navigation-bar"

export default function RegisterPage() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      <AnimatedBackground />
      <NavigationBar />

      <div className="container relative mx-auto py-6 pt-20 flex justify-center z-10">
        <AuthForm type = "login" />
      </div>
    </div>
  )
}

