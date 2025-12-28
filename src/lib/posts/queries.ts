import { queryOptions } from "@tanstack/react-query"
import { createSupabaseClient } from "@/lib/supabase"
import { PostsService } from "./service"

// Query key factory for consistent, type-safe keys
export const postsQueryKeys = {
  all: () => ["posts"] as const,
  detail: (id: string) => ["posts", id] as const,
}

// Query options factory
export const postsQueries = {
  all: () =>
    queryOptions({
      queryKey: postsQueryKeys.all(),
      queryFn: () => {
        const supabase = createSupabaseClient()
        return new PostsService(supabase).list()
      },
    }),

  detail: (id: string) =>
    queryOptions({
      queryKey: postsQueryKeys.detail(id),
      queryFn: () => {
        const supabase = createSupabaseClient()
        return new PostsService(supabase).getById(id)
      },
    }),
}
