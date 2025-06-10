"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import type { User, AuthError } from "@supabase/supabase-js"
import { supabase } from "@/lib/supabase"
import { useToast } from "@/components/ui/use-toast"

interface AuthContextType {
  user: User | null
  loading: boolean
  signUp: (email: string, password: string, fullName: string) => Promise<{ error: AuthError | null; success: boolean }>
  signIn: (email: string, password: string) => Promise<{ error: AuthError | null; success: boolean }>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    // Get initial session
    const initializeAuth = async () => {
      try {
        console.log("Initializing auth...")
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession()

        if (error) {
          console.error("Error getting session:", error)
        } else {
          console.log("Session:", session?.user ? "User found" : "No user")
          setUser(session?.user ?? null)
        }
      } catch (error) {
        console.error("Error initializing auth:", error)
        toast({
          title: "Authentication Error",
          description: "Failed to initialize authentication. Please refresh the page.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    initializeAuth()

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state changed:", event, session?.user ? "User present" : "No user")
      setUser(session?.user ?? null)
      setLoading(false)

      if (event === "SIGNED_IN") {
        toast({
          title: "Welcome!",
          description: "You have successfully signed in.",
        })
      } else if (event === "SIGNED_OUT") {
        toast({
          title: "Signed out",
          description: "You have been signed out successfully.",
        })
      } else if (event === "SIGNED_UP") {
        toast({
          title: "Account created!",
          description: "Welcome to WishKart! You can now create your first registry.",
        })
      }
    })

    return () => subscription.unsubscribe()
  }, [toast])

  const signUp = async (email: string, password: string, fullName: string) => {
    try {
      console.log("Attempting signup for:", email)

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      })

      console.log("Signup response:", { data, error })

      if (error) {
        console.error("Signup error:", error)
        toast({
          title: "Sign up failed",
          description: error.message,
          variant: "destructive",
        })
        return { error, success: false }
      }

      if (data.user) {
        console.log("User created successfully:", data.user.id)

        // Check if email confirmation is required
        if (!data.session) {
          toast({
            title: "Check your email",
            description: "We've sent you a confirmation link. Please check your email to complete signup.",
          })
        } else {
          toast({
            title: "Account created!",
            description: "Welcome to WishKart!",
          })
        }
        return { error: null, success: true }
      }

      return { error: null, success: true }
    } catch (err) {
      console.error("Unexpected error during sign up:", err)
      toast({
        title: "Sign up failed",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      })
      return { error: err as AuthError, success: false }
    }
  }

  const signIn = async (email: string, password: string) => {
    try {
      console.log("Attempting signin for:", email)

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      console.log("Signin response:", { data, error })

      if (error) {
        console.error("Signin error:", error)
        toast({
          title: "Sign in failed",
          description: error.message,
          variant: "destructive",
        })
        return { error, success: false }
      }

      return { error: null, success: true }
    } catch (err) {
      console.error("Unexpected error during sign in:", err)
      toast({
        title: "Sign in failed",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      })
      return { error: err as AuthError, success: false }
    }
  }

  const signOut = async () => {
    try {
      console.log("Signing out...")
      await supabase.auth.signOut()
    } catch (error) {
      console.error("Error signing out:", error)
      toast({
        title: "Sign out failed",
        description: "Failed to sign out. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signUp,
        signIn,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
