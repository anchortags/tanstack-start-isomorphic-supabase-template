import { useMutation, useQueryClient } from "@tanstack/react-query"

import { mapSupabaseUserToAuthUser } from "@/lib/supabase/utils"
import { useSupabase } from "@/lib/supabase/hooks/use-supabase"
import { userQueryKey } from "@/lib/auth/queries"

const mutationKey = ["auth", "refresh-session"]

type RefreshSessionParams = {
  refresh_token: string
}

export type UseRefreshSessionProps = {
  onSuccess?: VoidFunction
  onError?: (error: Error) => void
}

export function useRefreshSession({
  onSuccess,
  onError,
}: UseRefreshSessionProps = {}) {
  const supabase = useSupabase()
  const queryClient = useQueryClient()

  const mutationFn = 
    async (params?: RefreshSessionParams) => {
      const { data, error } = await supabase.auth.refreshSession(params)

      if (error) {
        throw error
      }

      await queryClient.setQueryData(
        userQueryKey,
        data.user && mapSupabaseUserToAuthUser(data.user),
      )

      return data
    }

  return useMutation({
    mutationKey,
    mutationFn,
    onSuccess,
    onError,
  })
}
