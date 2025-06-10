"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { supabase } from "@/lib/supabase"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function TestSignupPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [fullName, setFullName] = useState("")
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [profileCheck, setProfileCheck] = useState<any>(null)

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setResult(null)
    setProfileCheck(null)

    try {
      console.log("Attempting signup with:", { email, fullName })

      // Try signup
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      })

      console.log("Signup result:", { data, error })

      setResult({
        success: !error,
        data,
        error,
        userCreated: !!data?.user,
        sessionCreated: !!data?.session,
        needsConfirmation: data?.user && !data?.session,
      })

      // If user was created, check if profile was created
      if (data?.user) {
        setTimeout(async () => {
          try {
            const { data: profileData, error: profileError } = await supabase
              .from("profiles")
              .select("*")
              .eq("id", data.user.id)
              .single()

            console.log("Profile check:", { profileData, profileError })

            setProfileCheck({
              userId: data.user.id,
              profileData,
              profileError,
              profileCreated: !!profileData,
            })
          } catch (err) {
            console.error("Error checking profile:", err)
            setProfileCheck({
              userId: data.user.id,
              error: String(err),
            })
          }
        }, 2000) // Wait 2 seconds for trigger to execute
      }
    } catch (err) {
      console.error("Unexpected error during signup:", err)
      setResult({
        success: false,
        error: String(err),
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto p-4 max-w-md">
      <Card>
        <CardHeader>
          <CardTitle>Test Signup</CardTitle>
          <CardDescription>Simple signup test with detailed feedback</CardDescription>
        </CardHeader>
        <form onSubmit={handleSignup}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="John Doe"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Signing up..." : "Test Signup"}
            </Button>
          </CardFooter>
        </form>
      </Card>

      {result && (
        <div className="mt-6 space-y-4">
          <Alert variant={result.success ? "default" : "destructive"}>
            <AlertDescription>
              {result.success ? "Signup request successful" : "Signup request failed"}
            </AlertDescription>
          </Alert>

          <Card>
            <CardHeader>
              <CardTitle>Signup Result</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>User Created:</span>
                  <span className={result.userCreated ? "text-green-600" : "text-red-600"}>
                    {result.userCreated ? "✓ Yes" : "✗ No"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Session Created:</span>
                  <span className={result.sessionCreated ? "text-green-600" : "text-orange-600"}>
                    {result.sessionCreated ? "✓ Yes" : "⚠ No (Email confirmation required)"}
                  </span>
                </div>
                {result.needsConfirmation && (
                  <Alert>
                    <AlertDescription>
                      <strong>Email confirmation is required.</strong> Go to Supabase Dashboard → Authentication →
                      Settings and disable "Enable email confirmations" for testing.
                    </AlertDescription>
                  </Alert>
                )}
              </div>

              <div>
                <h4 className="font-semibold mb-2">Raw Response:</h4>
                <pre className="text-xs bg-gray-100 p-2 rounded overflow-auto max-h-40">
                  {JSON.stringify(result, null, 2)}
                </pre>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {profileCheck && (
        <div className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Profile Check</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span>Profile Created:</span>
                <span className={profileCheck.profileCreated ? "text-green-600" : "text-red-600"}>
                  {profileCheck.profileCreated ? "✓ Yes" : "✗ No"}
                </span>
              </div>

              {!profileCheck.profileCreated && (
                <Alert variant="destructive">
                  <AlertDescription>
                    <strong>Trigger function not working!</strong> The database trigger that should create a profile row
                    when a user signs up is not working properly.
                  </AlertDescription>
                </Alert>
              )}

              <div>
                <h4 className="font-semibold mb-2">Raw Response:</h4>
                <pre className="text-xs bg-gray-100 p-2 rounded overflow-auto max-h-40">
                  {JSON.stringify(profileCheck, null, 2)}
                </pre>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
