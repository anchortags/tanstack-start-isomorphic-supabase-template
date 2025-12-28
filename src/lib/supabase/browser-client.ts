import { createBrowserClient } from "@supabase/ssr"
import type { Database } from "./database.types"

export function createBrowserSupabaseClient() {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
  const supabaseAnonKey = import.meta.env.VITE_SUPABASE_PUBLIC_KEY

  return createBrowserClient<Database>(supabaseUrl, supabaseAnonKey)
}
