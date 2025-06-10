"use client"

import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Gift, Heart, Share2, Users } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { checkDatabaseSetup } from "./actions"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function HomePage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [dbStatus, setDbStatus] = useState<{
    success: boolean
    message: string
    error?: string
  } | null>(null)

  useEffect(() => {
    const checkDb = async () => {
      const result = await checkDatabaseSetup()
      setDbStatus(result)
    }
    checkDb()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
      </div>
    )
  }

  if (user) {
    router.push("/dashboard")
    return null
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="mobile-container py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Gift className="h-8 w-8 text-orange-500" />
            <h1 className="text-2xl font-bold text-gray-900">WishKart</h1>
          </div>
          <div className="space-x-2">
            <Button variant="ghost" asChild>
              <Link href="/auth/signin">Sign In</Link>
            </Button>
            <Button asChild>
              <Link href="/auth/signup">Sign Up</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Database Status Alert */}
      {dbStatus && !dbStatus.success && (
        <div className="mobile-container mb-4">
          <Alert variant="destructive">
            <AlertTitle>Database Setup Required</AlertTitle>
            <AlertDescription>
              {dbStatus.message}
              <br />
              <span className="text-xs opacity-70">{dbStatus.error}</span>
            </AlertDescription>
          </Alert>
        </div>
      )}

      {/* Hero Section */}
      <section className="mobile-container py-12 text-center">
        <div className="celebration-gradient rounded-3xl p-8 text-white mb-8">
          <h2 className="text-4xl font-bold mb-4">
            No more guesswork.
            <br />
            Just perfect gifts.
          </h2>
          <p className="text-xl opacity-90 mb-6">
            Create beautiful gift registries for your special moments and share them with loved ones.
          </p>
          <Button size="lg" variant="secondary" asChild>
            <Link href="/auth/signup">Create Your Registry</Link>
          </Button>
        </div>
      </section>

      {/* Features */}
      <section className="mobile-container py-12">
        <h3 className="text-2xl font-bold text-center mb-8 text-gray-900">Perfect for Every Celebration</h3>
        <div className="grid gap-6">
          <Card className="celebration-card">
            <CardHeader>
              <div className="w-12 h-12 wedding-gradient rounded-full flex items-center justify-center mb-2">
                <Heart className="h-6 w-6 text-white" />
              </div>
              <CardTitle>Weddings</CardTitle>
              <CardDescription>
                Create your dream wedding registry and share it with family and friends.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="celebration-card">
            <CardHeader>
              <div className="w-12 h-12 birthday-gradient rounded-full flex items-center justify-center mb-2">
                <Gift className="h-6 w-6 text-white" />
              </div>
              <CardTitle>Birthdays</CardTitle>
              <CardDescription>Make birthdays special with a curated list of desired gifts.</CardDescription>
            </CardHeader>
          </Card>

          <Card className="celebration-card">
            <CardHeader>
              <div className="w-12 h-12 baby-shower-gradient rounded-full flex items-center justify-center mb-2">
                <Users className="h-6 w-6 text-white" />
              </div>
              <CardTitle>Baby Showers</CardTitle>
              <CardDescription>Welcome the little one with thoughtful and needed gifts.</CardDescription>
            </CardHeader>
          </Card>

          <Card className="celebration-card">
            <CardHeader>
              <div className="w-12 h-12 housewarming-gradient rounded-full flex items-center justify-center mb-2">
                <Share2 className="h-6 w-6 text-white" />
              </div>
              <CardTitle>Housewarming</CardTitle>
              <CardDescription>Start your new home journey with gifts that matter.</CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* How it Works */}
      <section className="mobile-container py-12">
        <h3 className="text-2xl font-bold text-center mb-8 text-gray-900">How It Works</h3>
        <div className="space-y-6">
          <div className="flex items-start space-x-4">
            <div className="w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center font-bold text-sm">
              1
            </div>
            <div>
              <h4 className="font-semibold text-gray-900">Create Your Registry</h4>
              <p className="text-gray-600">Add event details, upload photos, and customize your registry URL.</p>
            </div>
          </div>
          <div className="flex items-start space-x-4">
            <div className="w-8 h-8 bg-pink-500 text-white rounded-full flex items-center justify-center font-bold text-sm">
              2
            </div>
            <div>
              <h4 className="font-semibold text-gray-900">Add Your Wishlist</h4>
              <p className="text-gray-600">Paste product URLs or manually add gifts with priorities.</p>
            </div>
          </div>
          <div className="flex items-start space-x-4">
            <div className="w-8 h-8 bg-purple-500 text-white rounded-full flex items-center justify-center font-bold text-sm">
              3
            </div>
            <div>
              <h4 className="font-semibold text-gray-900">Share & Celebrate</h4>
              <p className="text-gray-600">Share your registry link and let guests reserve gifts easily.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mobile-container py-8 text-center text-gray-600">
        <p>&copy; 2024 WishKart. Made with ❤️ for Indian celebrations.</p>
      </footer>
    </div>
  )
}
