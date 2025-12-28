import type { SignUpWithPasswordCredentials } from "@supabase/supabase-js"
import { useMutation, useQueryClient } from "@tanstack/react-query"

import { mapSupabaseUserToAuthUser } from "@/lib/supabase/utils"
import { useSupabase } from "@/lib/supabase/hooks/use-supabase"
import { userQueryKey } from "@/lib/auth/queries"

const mutationKey = ["auth", "sign-up-with-password"]

export type UseSignUpWithPasswordProps = {
  onSuccess?: VoidFunction
  onError?: (error: Error) => void
}

export function useSignUpWithPassword({
  onSuccess,
  onError,
}: UseSignUpWithPasswordProps = {}) {
  const supabase = useSupabase()
  const queryClient = useQueryClient()

  const mutationFn = 
    async (credentials: SignUpWithPasswordCredentials) => {
      const { data, error } = await supabase.auth.signUp(credentials)

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
