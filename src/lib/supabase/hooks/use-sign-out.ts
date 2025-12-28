import type { SignOut } from "@supabase/supabase-js"
import { useMutation, useQueryClient } from "@tanstack/react-query"

import { useSupabase } from "@/lib/supabase/hooks/use-supabase"
import { userQueryKey } from "@/lib/auth/queries"

const mutationKey = ["auth", "sign-out"]

export type UseSignOutProps = {
  onSuccess?: VoidFunction
  onError?: (error: Error) => void
}

export function useSignOut({ onSuccess, onError }: UseSignOutProps = {}) {
  const supabase = useSupabase()
  const queryClient = useQueryClient()

  // NOTE: This works slightly different from the default Supabase sign-out that automatically logs you out
  // globally of all devices. We default to only logging you out of the current device.
  const mutationFn = 
    async (options: SignOut = { scope: "local" }) => {
      const { error } = await supabase.auth.signOut(options)

      await queryClient.setQueryData(userQueryKey, null)
      queryClient.removeQueries()

      if (error) {
        throw error
      }

      return null
    }

  return useMutation({
    mutationKey,
    mutationFn,
    onSuccess,
    onError,
  })
}
