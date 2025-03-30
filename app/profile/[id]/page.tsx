import { getUserById } from "@/lib/user-model"
import { UserProfileForm } from "@/components/user-profile-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AnimatedBackground } from "@/components/animated-background"
import { NavigationBar } from "@/components/navigation-bar"

export default async function UserProfilePage({ params }: { params: { id: string } }) {
  let user = null
  let error = null

  try {
    user = await getUserById(params.id)
  } catch (err) {
    error = "Failed to load user profile"
  }

  return (
    <div className="relative min-h-screen overflow-hidden">
      <AnimatedBackground />
      <NavigationBar />

      <div className="container relative mx-auto py-6 pt-20 space-y-6 z-10">
        <h1 className="text-3xl font-bold tracking-tight text-white">User Profile</h1>

        {error ? (
          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardHeader>
              <CardTitle className="text-white">Error</CardTitle>
              <CardDescription className="text-white/70">{error}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-white/70">We couldn't load your profile information. Please try again later.</p>
            </CardContent>
          </Card>
        ) : !user ? (
          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardHeader>
              <CardTitle className="text-white">User Not Found</CardTitle>
              <CardDescription className="text-white/70">The requested user profile could not be found</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-white/70">
                The user profile you're looking for doesn't exist or you may not have permission to view it.
              </p>
            </CardContent>
          </Card>
        ) : (
          <UserProfileForm user={user} />
        )}
      </div>
    </div>
  )
}

