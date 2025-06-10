"use server"

import { createServerClient } from "@/lib/supabase"

export async function checkDatabaseSetup() {
  try {
    const supabase = createServerClient()

    // Check if profiles table exists by trying to select from it
    const { data: profilesData, error: profilesError } = await supabase.from("profiles").select("id").limit(1)

    if (profilesError) {
      if (
        profilesError.message.includes("does not exist") ||
        profilesError.message.includes("relation") ||
        profilesError.code === "42P01"
      ) {
        return {
          success: false,
          message: "Database tables not set up. Please run the SQL scripts first.",
          error: profilesError.message,
        }
      }
      return {
        success: false,
        message: "Error checking profiles table",
        error: profilesError.message,
      }
    }

    // Check if registries table exists
    const { error: registriesError } = await supabase.from("registries").select("id").limit(1)

    if (registriesError) {
      return {
        success: false,
        message: "Registries table not found. Please run all SQL scripts.",
        error: registriesError.message,
      }
    }

    // Check if gifts table exists
    const { error: giftsError } = await supabase.from("gifts").select("id").limit(1)

    if (giftsError) {
      return {
        success: false,
        message: "Gifts table not found. Please run all SQL scripts.",
        error: giftsError.message,
      }
    }

    return {
      success: true,
      message: "Database is properly set up",
    }
  } catch (error) {
    return {
      success: false,
      message: "Failed to check database setup",
      error: String(error),
    }
  }
}
