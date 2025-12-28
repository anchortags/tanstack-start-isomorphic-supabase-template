import { createMiddleware } from "@tanstack/react-start"

import { supabaseServerClientMiddleware } from "@/lib/middleware/supabase-server-client"
import { mapSupabaseClaimsToAuthUser } from "@/lib/supabase/utils"

export const authMiddleware = createMiddleware({ type: "function" })
  .middleware([supabaseServerClientMiddleware])
  .server(async ({ next, context }) => {
    if (!context.supabase) {
      throw new Response('Internal server error', { status: 500 })
    }

    const { data, error } = await context.supabase.auth.getClaims()

    if (error) {
      throw new Response('Internal server error', { status: 500 })
    }

    if (!data?.claims) {
      throw new Response('Unauthorized', { status: 401 })
    }

    return next({
      context: {
        user: mapSupabaseClaimsToAuthUser(data?.claims),
      },
    })
  })
