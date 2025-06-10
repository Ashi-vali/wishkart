"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Gift, Plus } from "lucide-react"
import Link from "next/link"

export default function DashboardPage() {
  const { user, loading, signOut } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth/signin")
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="mobile-container py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Gift className="h-6 w-6 text-orange-500" />
              <h1 className="text-xl font-bold text-gray-900">WishKart</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">Hello, {user.user_metadata.full_name || user.email}</span>
              <Button variant="ghost" size="sm" onClick={signOut}>
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mobile-container py-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">My Registries</h2>
          <Button asChild>
            <Link href="/registries/new">
              <Plus className="h-4 w-4 mr-2" />
              New Registry
            </Link>
          </Button>
        </div>

        <div className="space-y-4">
          <Card className="celebration-card">
            <CardHeader>
              <CardTitle>Create Your First Registry</CardTitle>
              <CardDescription>Start by creating a registry for your special occasion</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild>
                <Link href="/registries/new">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Registry
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
