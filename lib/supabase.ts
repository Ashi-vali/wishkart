import { createClient } from "@supabase/supabase-js"
import type { Database } from "./database.types"

// Validate environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl) {
  throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL environment variable")
}

if (!supabaseAnonKey) {
  throw new Error("Missing NEXT_PUBLIC_SUPABASE_ANON_KEY environment variable")
}

// Global singleton instance - this ensures only one instance across the entire app
let globalSupabaseInstance: ReturnType<typeof createClient<Database>> | null = null

// Check if we're in the browser and if there's already an instance
if (typeof window !== "undefined") {
  // Store the instance on the window object to ensure true singleton behavior
  if (!(window as any).__supabase) {
    ;(window as any).__supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
        storageKey: "wishkart-auth-storage", // Use a unique storage key
      },
    })
  }
  globalSupabaseInstance = (window as any).__supabase
} else {
  // Server-side: create a new instance each time (this is fine for server)
  globalSupabaseInstance = createClient<Database>(supabaseUrl, supabaseAnonKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
      detectSessionInUrl: false,
    },
  })
}

// Export the singleton instance
export const supabase = globalSupabaseInstance!

// For explicit singleton access
export const getSupabase = () => {
  if (typeof window !== "undefined") {
    return (window as any).__supabase
  }
  return globalSupabaseInstance!
}

// Create a server-side client (for server components and API routes)
export const createServerClient = () => {
  const serverUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!serverUrl || !serviceKey) {
    throw new Error("Missing server-side Supabase environment variables")
  }

  return createClient<Database>(serverUrl, serviceKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  })
}
