import { createFileRoute, useRouter } from "@tanstack/react-router"
import { useEffect } from "react"
import { useSignOut } from "@/lib/supabase/hooks/use-sign-out"

export const Route = createFileRoute("/signout")({
  component: SignOutPage,
  preload: false,
})

function SignOutPage() {
  const router = useRouter()

  const signOutMutation = useSignOut({
    onSuccess: () => {
      router.invalidate()
      router.navigate({ to: "/" })
    },
    onError: () => {
      router.navigate({ to: "/" })
    },
  })

  useEffect(() => {
    signOutMutation.mutate({ scope: "local" })
  }, [])

  return (
    <div className="min-h-[calc(100vh-72px)] flex items-center justify-center px-4">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-500 mx-auto mb-4"></div>
        <p className="text-gray-400">Signing out...</p>
      </div>
    </div>
  )
}
