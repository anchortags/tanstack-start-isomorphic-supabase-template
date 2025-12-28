import { queryOptions } from "@tanstack/react-query"

import { createSupabaseClient } from "@/lib/supabase/client"
import { mapSupabaseClaimsToAuthUser } from "@/lib/supabase/utils"


export const userQueryKey = ["user"]

export const getCurrentUserQueryOptions = () =>
  queryOptions({
    queryKey: userQueryKey,
    queryFn: async () => {
      const supabase = createSupabaseClient()
      const { data, error } = await supabase.auth.getClaims()

      // We intentionally do not want to throw an error if the user is not found
      if (error || !data) {
        return null
      }

      return mapSupabaseClaimsToAuthUser(data.claims)
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
  })