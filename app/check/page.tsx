"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function CheckPage() {
  const [supabaseUrl, setSupabaseUrl] = useState<string | null>(null)
  const [deployedUrl, setDeployedUrl] = useState<string | null>(null)

  useEffect(() => {
    // Get Supabase URL from environment variable
    setSupabaseUrl(process.env.NEXT_PUBLIC_SUPABASE_URL || null)

    // Get current URL
    setDeployedUrl(window.location.origin)
  }, [])

  return (
    <div className="container mx-auto p-4 space-y-4 max-w-4xl">
      <h1 className="text-2xl font-bold">WishKart URL Check</h1>

      <Card>
        <CardHeader>
          <CardTitle>URL Configuration</CardTitle>
          <CardDescription>Check your Supabase and app URLs</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold">Your app is deployed at:</h3>
            <p className="font-mono text-sm">{deployedUrl || "Loading..."}</p>
          </div>

          <div>
            <h3 className="font-semibold">Your Supabase URL is:</h3>
            <p className="font-mono text-sm">{supabaseUrl || "Not set"}</p>
          </div>

          <Alert>
            <AlertDescription>
              <strong>Important:</strong> In your Supabase Dashboard → Authentication → Settings, make sure:
              <ul className="list-disc pl-5 mt-2">
                <li>
                  Site URL is set to: <span className="font-mono">{deployedUrl || "your-app-url"}</span>
                </li>
                <li>
                  Redirect URLs include: <span className="font-mono">{deployedUrl || "your-app-url"}</span>/*
                </li>
                <li>"Enable email confirmations" is turned OFF for testing</li>
              </ul>
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </div>
  )
}
