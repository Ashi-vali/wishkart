"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { z } from "zod"

const signUpSchema = z
  .object({
    fullName: z.string().min(2, "Full name must be at least 2 characters"),
    email: z.string().email("Please enter a valid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })

export default function SignUpPage() {
  const { signUp } = useAuth()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateField = (name: string, value: string, allValues = formData) => {
    try {
      if (name === "confirmPassword") {
        if (value !== allValues.password) {
          setErrors((prev) => ({ ...prev, [name]: "Passwords do not match" }))
          return false
        } else {
          setErrors((prev) => ({ ...prev, [name]: "" }))
          return true
        }
      }

      // Validate individual field
      const fieldSchema = signUpSchema.shape[name as keyof typeof signUpSchema.shape]
      if (fieldSchema) {
        fieldSchema.parse(value)
        setErrors((prev) => ({ ...prev, [name]: "" }))
        return true
      }
      return true
    } catch (error) {
      if (error instanceof z.ZodError) {
        setErrors((prev) => ({ ...prev, [name]: error.errors[0].message }))
      }
      return false
    }
  }

  const validateAllFields = (data: typeof formData) => {
    try {
      signUpSchema.parse(data)
      return { isValid: true, errors: {} }
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors: Record<string, string> = {}
        error.errors.forEach((err) => {
          if (err.path[0]) {
            fieldErrors[err.path[0] as string] = err.message
          }
        })
        return { isValid: false, errors: fieldErrors }
      }
      return { isValid: false, errors: { general: "Validation failed" } }
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    const newFormData = { ...formData, [name]: value }
    setFormData(newFormData)

    validateField(name, value, newFormData)

    // Revalidate confirmPassword when password changes
    if (name === "password" && formData.confirmPassword) {
      validateField("confirmPassword", formData.confirmPassword, newFormData)
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    console.log("Form submitted with data:", {
      ...formData,
      password: "[HIDDEN]",
      confirmPassword: "[HIDDEN]",
      fullNameLength: formData.fullName.length,
      emailValid: formData.email.includes("@"),
      passwordLength: formData.password.length,
      passwordsMatch: formData.password === formData.confirmPassword,
    })

    // Validate all fields at once
    const validation = validateAllFields(formData)

    console.log("Validation result:", validation)

    if (!validation.isValid) {
      console.log("Form validation failed with errors:", validation.errors)
      setErrors(validation.errors)
      return
    }

    // Clear any previous errors
    setErrors({})

    setIsLoading(true)
    try {
      console.log("Calling signUp function...")
      const { error, success } = await signUp(formData.email, formData.password, formData.fullName)

      console.log("SignUp result:", { error, success })

      if (success && !error) {
        console.log("Signup successful, redirecting to dashboard...")
        // Small delay to allow the auth state to update
        setTimeout(() => {
          router.push("/dashboard")
        }, 1000)
      }
    } catch (err) {
      console.error("Unexpected error in form submission:", err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="celebration-card">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl text-center">Create an Account</CardTitle>
        <CardDescription className="text-center">Enter your details to create your WishKart account</CardDescription>
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
              className={errors.fullName ? "border-red-500" : ""}
            />
            {errors.fullName && <p className="text-sm text-red-500">{errors.fullName}</p>}
            <p className="text-xs text-gray-500">Current length: {formData.fullName.length} (minimum 2)</p>
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
              className={errors.email ? "border-red-500" : ""}
            />
            {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
            <p className="text-xs text-gray-500">Valid email: {formData.email.includes("@") ? "✓" : "✗"}</p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              disabled={isLoading}
              required
              className={errors.password ? "border-red-500" : ""}
            />
            {errors.password && <p className="text-sm text-red-500">{errors.password}</p>}
            <p className="text-xs text-gray-500">Current length: {formData.password.length} (minimum 6)</p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              placeholder="••••••••"
              value={formData.confirmPassword}
              onChange={handleChange}
              disabled={isLoading}
              required
              className={errors.confirmPassword ? "border-red-500" : ""}
            />
            {errors.confirmPassword && <p className="text-sm text-red-500">{errors.confirmPassword}</p>}
            <p className="text-xs text-gray-500">
              Passwords match:{" "}
              {formData.password && formData.confirmPassword
                ? formData.password === formData.confirmPassword
                  ? "✓"
                  : "✗"
                : "-"}
            </p>
          </div>

          {/* Debug info */}
          <div className="text-xs text-gray-500 bg-gray-50 p-2 rounded">
            <strong>Debug Info:</strong>
            <br />
            Full Name: {formData.fullName.length >= 2 ? "✓" : "✗"} ({formData.fullName.length}/2)
            <br />
            Email: {formData.email.includes("@") && formData.email.length > 0 ? "✓" : "✗"}
            <br />
            Password: {formData.password.length >= 6 ? "✓" : "✗"} ({formData.password.length}/6)
            <br />
            Confirm: {formData.password === formData.confirmPassword && formData.confirmPassword.length > 0 ? "✓" : "✗"}
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Creating account..." : "Sign Up"}
          </Button>
          <div className="text-center text-sm">
            Already have an account?{" "}
            <Link href="/auth/signin" className="text-orange-500 hover:underline">
              Sign in
            </Link>
          </div>
        </CardFooter>
      </form>
    </Card>
  )
}
