import { createServerClient } from "@supabase/ssr"
import { createServerOnlyFn } from "@tanstack/react-start"
import { getCookies, setCookie } from "@tanstack/react-start/server"
import type { Database } from "./database.types"

export const createServerSupabaseClient = createServerOnlyFn(() => {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
  const supabaseAnonKey = import.meta.env.VITE_SUPABASE_PUBLIC_KEY

  return createServerClient<Database>(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return Object.entries(getCookies()).map(([name, value]) => ({
          name,
          value,
        }))
      },
      setAll(cookies) {
        cookies.forEach((cookie) => {
          setCookie(cookie.name, cookie.value)
        })
      },
    },
  })
})
