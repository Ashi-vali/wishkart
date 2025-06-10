"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"

export default function SimpleSignupPage() {
  const { signUp } = useAuth()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    console.log("Simple signup form submitted:", {
      ...formData,
      password: "[HIDDEN]",
    })

    // Basic validation
    if (!formData.fullName || !formData.email || !formData.password) {
      console.log("Missing required fields")
      return
    }

    if (formData.password.length < 6) {
      console.log("Password too short")
      return
    }

    setIsLoading(true)
    try {
      console.log("Calling signUp function...")
      const { error, success } = await signUp(formData.email, formData.password, formData.fullName)

      console.log("SignUp result:", { error, success })

      if (success && !error) {
        console.log("Signup successful!")
        router.push("/dashboard")
      }
    } catch (err) {
      console.error("Unexpected error in form submission:", err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto p-4 max-w-md">
      <Card className="celebration-card">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl text-center">Simple Signup</CardTitle>
          <CardDescription className="text-center">No complex validation - just basic signup</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                name="fullName"
                placeholder="John Doe"
                value={formData.fullName}
                onChange={handleChange}
                disabled={isLoading}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
                disabled={isLoading}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password (min 6 chars)</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                disabled={isLoading}
                required
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Creating account..." : "Sign Up"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
