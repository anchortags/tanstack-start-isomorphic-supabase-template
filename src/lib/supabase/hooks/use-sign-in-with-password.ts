import type {
  Session,
  SignInWithPasswordCredentials,
  User,
  WeakPassword,
} from "@supabase/supabase-js"
import { useMutation, useQueryClient } from "@tanstack/react-query"

import { mapSupabaseUserToAuthUser } from "@/lib/supabase/utils"
import { useSupabase } from "@/lib/supabase/hooks/use-supabase"
import { userQueryKey } from "@/lib/auth/queries"

const mutationKey = ["auth", "sign-in-with-password"]

export type SignInSuccessData = {
  user: User
  session: Session
  weakPassword?: WeakPassword
}

export type UseSignInWithPasswordProps = {
  onSuccess?: VoidFunction
  onError?: (error: Error) => void
}

export function useSignInWithPassword({
  onSuccess,
  onError,
}: UseSignInWithPasswordProps = {}) {
  const supabase = useSupabase()
  const queryClient = useQueryClient()

  const mutationFn = 
    async (
      credentials: SignInWithPasswordCredentials,
    ): Promise<SignInSuccessData> => {
      const { data, error } =
        await supabase.auth.signInWithPassword(credentials)

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
