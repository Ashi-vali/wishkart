export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      registries: {
        Row: {
          id: string
          user_id: string
          title: string
          description: string | null
          event_type: "Wedding" | "Baby shower" | "Birthday" | "Housewarming"
          event_date: string | null
          custom_url: string | null
          is_public: boolean
          cover_image_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          description?: string | null
          event_type: "Wedding" | "Baby shower" | "Birthday" | "Housewarming"
          event_date?: string | null
          custom_url?: string | null
          is_public?: boolean
          cover_image_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          description?: string | null
          event_type?: "Wedding" | "Baby shower" | "Birthday" | "Housewarming"
          event_date?: string | null
          custom_url?: string | null
          is_public?: boolean
          cover_image_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      gifts: {
        Row: {
          id: string
          registry_id: string
          title: string
          description: string | null
          price: number | null
          product_url: string | null
          image_url: string | null
          priority: "High" | "Medium" | "Low"
          is_reserved: boolean
          reserved_by_name: string | null
          reserved_by_email: string | null
          reserved_at: string | null
          notes: string | null
          thank_you_sent: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          registry_id: string
          title: string
          description?: string | null
          price?: number | null
          product_url?: string | null
          image_url?: string | null
          priority?: "High" | "Medium" | "Low"
          is_reserved?: boolean
          reserved_by_name?: string | null
          reserved_by_email?: string | null
          reserved_at?: string | null
          notes?: string | null
          thank_you_sent?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          registry_id?: string
          title?: string
          description?: string | null
          price?: number | null
          product_url?: string | null
          image_url?: string | null
          priority?: "High" | "Medium" | "Low"
          is_reserved?: boolean
          reserved_by_name?: string | null
          reserved_by_email?: string | null
          reserved_at?: string | null
          notes?: string | null
          thank_you_sent?: boolean
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}
