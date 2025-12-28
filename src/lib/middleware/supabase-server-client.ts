import { createMiddleware } from "@tanstack/react-start"

import { createServerSupabaseClient } from "@/lib/supabase/server-client"

export const supabaseServerClientMiddleware = createMiddleware({
  type: "function",
}).server(async ({ next }) => {
  const supabase = createServerSupabaseClient()

  return next({
    context: {
      supabase,
    },
  })
})
