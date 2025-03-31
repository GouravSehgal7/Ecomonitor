

"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Menu, X, Droplet, Wind, Sun, Car, Bell, User, LogOut } from "lucide-react"
import { GlobalNotificationButton } from "@/components/global-notification-button"
import { usePathname } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"

export function NavigationBar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const pathname = usePathname()
  const [userdata, setUserdata] = useState(null)
  const { toast } = useToast()

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem('userData') || 'null')
    setUserdata(data)
    
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const handleDeleteAccount = async () => {
    try {
      if (!userdata?.email) {
        throw new Error("No user data found")
      }

      const response = await fetch('/api/unsubscribe-to-notification', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: userdata.email }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.message || 'Failed to delete account')
      }

      // Clear local storage
      localStorage.removeItem('userData')
      setUserdata(null)

      toast({
        title: "Success",
        description: "Your account has been deleted",
        variant: "default",
      })

    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete account",
        variant: "destructive",
      })
    }
  }

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const navLinks = [
    { href: "/", label: "Air Quality", icon: <Wind className="h-4 w-4" /> },
    { href: "/water-quality", label: "Water Quality", icon: <Droplet className="h-4 w-4" /> },
    { href: "/uv-index", label: "UV Index", icon: <Sun className="h-4 w-4" /> },
    { href: "/traffic-monitor", label: "Traffic", icon: <Car className="h-4 w-4" /> },
    { href: "/recommendations", label: "Health", icon: <User className="h-4 w-4" /> },
  ]

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "bg-black/70 backdrop-blur-lg" : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="text-white font-bold text-xl">
              EcoMonitor
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href}>
                <Button
                  variant="ghost"
                  className={`text-white hover:bg-white/10 ${pathname === link.href ? "bg-white/10" : ""}`}
                >
                  {link.icon}
                  <span className="ml-2">{link.label}</span>
                </Button>
              </Link>
            ))}
            
            {/* Delete Account Button (when user exists) */}
            {userdata ? (
              <Button
                variant="ghost"
                className="text-white hover:bg-white/10"
                onClick={handleDeleteAccount}
              >
                <LogOut className="h-4 w-4" />
                <span className="ml-2">disable notification</span>
              </Button>
            ) : (
              <Link href="/register">
                <Button
                  variant="ghost"
                  className="text-white hover:bg-white/10"
                >
                  <User className="h-4 w-4" />
                  <span className="ml-2">Get notification</span>
                </Button>
              </Link>
            )}
            
            {/* <GlobalNotificationButton /> */}
            <Link href="/notifications">
              <Button variant="ghost" className="text-white hover:bg-white/10">
                <Bell className="h-4 w-4" />
                <span className="ml-2">Notifications</span>
              </Button>
            </Link>
          </div>

          {/* Mobile Navigation Toggle */}
          <div className="md:hidden flex items-center">
            <Button variant="ghost" size="icon" className="text-white" onClick={toggleMenu}>
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-black/90 backdrop-blur-lg">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navLinks.map((link) => (
                <Link key={link.href} href={link.href}>
                  <Button
                    variant="ghost"
                    className={`w-full justify-start text-white hover:bg-white/10 ${
                      pathname === link.href ? "bg-white/10" : ""
                    }`}
                  >
                    {link.icon}
                    <span className="ml-2">{link.label}</span>
                  </Button>
                </Link>
              ))}
              
              {/* Mobile Delete Account Button */}
              {userdata ? (
                <Button
                  variant="ghost"
                  className="w-full justify-start text-white hover:bg-white/10"
                  onClick={handleDeleteAccount}
                >
                  <LogOut className="h-4 w-4" />
                  <span className="ml-2">disable notification</span>
                </Button>
              ) : (
                <Link href="/register">
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-white hover:bg-white/10"
                  >
                    <User className="h-4 w-4" />
                    <span className="ml-2">get notification</span>
                  </Button>
                </Link>
              )}
              
              <div className="flex items-center space-x-2 pt-2">
                {/* <GlobalNotificationButton /> */}
                <Link href="/notifications" className="flex-1">
                  <Button variant="ghost" className="w-full justify-start text-white hover:bg-white/10">
                    <Bell className="h-4 w-4" />
                    <span className="ml-2">Notifications</span>
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}