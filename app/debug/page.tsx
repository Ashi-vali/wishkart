"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { supabase } from "@/lib/supabase"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function DebugPage() {
  const [envCheck, setEnvCheck] = useState<Record<string, boolean>>({})
  const [dbStatus, setDbStatus] = useState<any>(null)
  const [authTest, setAuthTest] = useState<any>(null)
  const [signupTest, setSignupTest] = useState<any>(null)
  const [profileCheck, setProfileCheck] = useState<any>(null)

  useEffect(() => {
    // Check environment variables
    setEnvCheck({
      NEXT_PUBLIC_SUPABASE_URL: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      NEXT_PUBLIC_SUPABASE_ANON_KEY: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    })

    // Check database
    checkDatabase()
  }, [])

  const checkDatabase = async () => {
    try {
      const { data, error } = await supabase.from("profiles").select("id").limit(1)

      setDbStatus({
        success: !error,
        message: error ? "Error accessing profiles table" : "Database tables accessible",
        error: error ? error.message : null,
        data,
      })
    } catch (err) {
      setDbStatus({
        success: false,
        message: "Error checking database",
        error: String(err),
      })
    }
  }

  const testAuth = async () => {
    try {
      const { data, error } = await supabase.auth.getSession()
      setAuthTest({ data, error, timestamp: new Date().toISOString() })
    } catch (err) {
      setAuthTest({ error: err, timestamp: new Date().toISOString() })
    }
  }

  const testSignup = async () => {
    try {
      const testEmail = `test-${Date.now()}@example.com`
      console.log("Testing signup with email:", testEmail)

      const { data, error } = await supabase.auth.signUp({
        email: testEmail,
        password: "test123456",
        options: {
          data: {
            full_name: "Test User",
          },
        },
      })

      console.log("Signup result:", { data, error })
      setSignupTest({
        email: testEmail,
        data,
        error,
        timestamp: new Date().toISOString(),
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

            setProfileCheck({
              userId: data.user.id,
              profileData,
              profileError,
              timestamp: new Date().toISOString(),
            })
          } catch (err) {
            setProfileCheck({
              userId: data.user.id,
              error: err,
              timestamp: new Date().toISOString(),
            })
          }
        }, 2000) // Wait 2 seconds for trigger to execute
      }
    } catch (err) {
      console.error("Test signup error:", err)
      setSignupTest({ error: err, timestamp: new Date().toISOString() })
    }
  }

  const checkProfiles = async () => {
    try {
      const { data, error, count } = await supabase.from("profiles").select("*", { count: "exact" }).limit(5)

      setProfileCheck({
        profiles: data,
        error,
        count,
        timestamp: new Date().toISOString(),
      })
    } catch (err) {
      setProfileCheck({ error: err, timestamp: new Date().toISOString() })
    }
  }

  return (
    <div className="container mx-auto p-4 space-y-4 max-w-4xl">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">WishKart Debug Dashboard</h1>
        <Button variant="outline" onClick={() => window.location.reload()}>
          Refresh All
        </Button>
      </div>

      <Alert>
        <AlertDescription>
          <strong>Instructions:</strong> If signup isn't working, check Supabase Dashboard → Authentication → Settings →
          Disable "Enable email confirmations"
        </AlertDescription>
      </Alert>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Environment Variables</CardTitle>
            <CardDescription>Check if required environment variables are set</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {Object.entries(envCheck).map(([key, value]) => (
                <div key={key} className="flex justify-between">
                  <span className="font-mono text-sm">{key}:</span>
                  <span className={value ? "text-green-600" : "text-red-600"}>{value ? "✓ Set" : "✗ Missing"}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Database Status</CardTitle>
            <CardDescription>Check if database tables are set up correctly</CardDescription>
          </CardHeader>
          <CardContent>
            {dbStatus ? (
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Status:</span>
                  <span className={dbStatus.success ? "text-green-600" : "text-red-600"}>
                    {dbStatus.success ? "✓ Ready" : "✗ Error"}
                  </span>
                </div>
                <div>
                  <span>Message:</span>
                  <p className="text-sm text-gray-600">{dbStatus.message}</p>
                </div>
                {dbStatus.error && (
                  <div>
                    <span>Error:</span>
                    <p className="text-sm text-red-600 font-mono">{dbStatus.error}</p>
                  </div>
                )}
              </div>
            ) : (
              <p>Loading...</p>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Authentication Test</CardTitle>
          <CardDescription>Test Supabase authentication connection</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2 flex-wrap">
            <Button onClick={testAuth}>Test Auth Connection</Button>
            <Button onClick={testSignup} variant="outline">
              Test Signup
            </Button>
            <Button onClick={checkProfiles} variant="outline">
              Check Profiles Table
            </Button>
          </div>

          {authTest && (
            <div className="mt-4">
              <h4 className="font-semibold mb-2">Auth Connection Test:</h4>
              <pre className="text-xs bg-gray-100 p-2 rounded overflow-auto max-h-32">
                {JSON.stringify(authTest, null, 2)}
              </pre>
            </div>
          )}

          {signupTest && (
            <div className="mt-4">
              <h4 className="font-semibold mb-2">Signup Test Result:</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Email:</span>
                  <span className="font-mono">{signupTest.email}</span>
                </div>
                <div className="flex justify-between">
                  <span>User Created:</span>
                  <span className={signupTest.userCreated ? "text-green-600" : "text-red-600"}>
                    {signupTest.userCreated ? "✓ Yes" : "✗ No"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Session Created:</span>
                  <span className={signupTest.sessionCreated ? "text-green-600" : "text-orange-600"}>
                    {signupTest.sessionCreated ? "✓ Yes" : "⚠ No (Email confirmation required)"}
                  </span>
                </div>
                {signupTest.needsConfirmation && (
                  <Alert>
                    <AlertDescription>
                      <strong>Email confirmation is required.</strong> Go to Supabase Dashboard → Authentication →
                      Settings and disable "Enable email confirmations" for testing.
                    </AlertDescription>
                  </Alert>
                )}
              </div>
              <pre className="text-xs bg-gray-100 p-2 rounded overflow-auto max-h-32 mt-2">
                {JSON.stringify(signupTest, null, 2)}
              </pre>
            </div>
          )}

          {profileCheck && (
            <div className="mt-4">
              <h4 className="font-semibold mb-2">Profile Check Result:</h4>
              <pre className="text-xs bg-gray-100 p-2 rounded overflow-auto max-h-32">
                {JSON.stringify(profileCheck, null, 2)}
              </pre>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Troubleshooting Steps</CardTitle>
          <CardDescription>Common issues and solutions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 text-sm">
            <div>
              <h5 className="font-semibold">1. Email Confirmation Issue</h5>
              <p>If signup creates user but no session: Disable email confirmation in Supabase Auth settings</p>
            </div>
            <div>
              <h5 className="font-semibold">2. Profile Not Created</h5>
              <p>If user exists but no profile row: Check if the trigger function is working</p>
            </div>
            <div>
              <h5 className="font-semibold">3. Database Tables Missing</h5>
              <p>If database status shows error: Run the SQL scripts in Supabase SQL Editor</p>
            </div>
            <div>
              <h5 className="font-semibold">4. Environment Variables</h5>
              <p>If env vars missing: Check your .env.local file and restart the dev server</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
