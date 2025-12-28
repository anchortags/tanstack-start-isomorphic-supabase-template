import { createServerOnlyFn } from "@tanstack/react-start"
import { createClient } from "@supabase/supabase-js"
import type { Database } from "./database.types"

export const createAdminSupabaseClient = createServerOnlyFn(() => {
  const supabaseUrl = process.env.SUPABASE_URL!
  const supabaseServiceRoleKey = process.env.SUPABASE_SECRET_KEY!

  return createClient<Database>(supabaseUrl, supabaseServiceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })
})
