import { mutationOptions, type QueryKey } from "@tanstack/react-query"
import { createSupabaseClient } from "@/lib/supabase"
import { PostsService, type CreatePostInput, type UpdatePostInput } from "./service"
import { postsQueryKeys } from "./queries"

// Helper for dynamic invalidation based on mutation result
type CreateInvalidationFn<T> = (data: T) => QueryKey
function createInvalidationFn<T>(fn: CreateInvalidationFn<T>) {
  return fn as (data: unknown, variables: unknown, context: unknown) => QueryKey
}

// Type for the post returned by create/update
type Post = Awaited<ReturnType<PostsService["create"]>>

// Mutation options factory with automatic invalidation via meta
export const postsMutations = {
  create: () =>
    mutationOptions({
      mutationFn: (input: CreatePostInput) => {
        const supabase = createSupabaseClient()
        return new PostsService(supabase).create(input)
      },
      meta: {
        invalidates: [postsQueryKeys.all()],
      },
    }),

  update: () =>
    mutationOptions({
      mutationFn: ({ id, input }: { id: string; input: UpdatePostInput }) => {
        const supabase = createSupabaseClient()
        return new PostsService(supabase).update(id, input)
      },
      meta: {
        invalidates: [
          postsQueryKeys.all(),
          // Invalidate the specific post using the mutation result
          createInvalidationFn<Post>((post) => postsQueryKeys.detail(post.id)),
        ],
      },
    }),

  delete: (id: string) =>
    mutationOptions({
      mutationFn: () => {
        const supabase = createSupabaseClient()
        return new PostsService(supabase).delete(id)
      },
      meta: {
        invalidates: [postsQueryKeys.all(), postsQueryKeys.detail(id)],
      },
    }),
}
