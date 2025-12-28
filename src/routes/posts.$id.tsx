import { createFileRoute, useNavigate, Link } from "@tanstack/react-router"
import { useMutation, useSuspenseQuery } from "@tanstack/react-query"
import { postsQueries, postsMutations } from "@/lib/posts"

export const Route = createFileRoute("/posts/$id")({
  component: PostDetailPage,
  loader: ({ context, params }) => {
    // Don't await! Let the Promise stream to the client.
    context.queryClient.ensureQueryData(postsQueries.detail(params.id)).catch(() => {})
  },
})

function PostDetailPage() {
  const { id } = Route.useParams()
  const navigate = useNavigate()
  const { data: post } = useSuspenseQuery(postsQueries.detail(id))
  const deletePost = useMutation(postsMutations.delete(id))

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this post?")) return

    await deletePost.mutateAsync()
    navigate({ to: "/posts" })
  }

  return (
    <article className="container mx-auto py-8 px-4 max-w-3xl">
      <Link
        to="/posts"
        className="inline-flex items-center text-cyan-400 hover:text-cyan-300 mb-6 transition-colors"
      >
        <svg
          className="w-4 h-4 mr-2"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 19l-7-7 7-7"
          />
        </svg>
        Back to Posts
      </Link>

      <header className="mb-8">
        <h1 className="text-4xl font-bold text-white mb-4">{post.title}</h1>
        <div className="flex items-center text-gray-400">
          <span>{post.author?.name ?? "Unknown author"}</span>
          <span className="mx-2">·</span>
          <time>{new Date(post.created_at).toLocaleDateString()}</time>
        </div>
      </header>

      <div className="prose prose-invert max-w-none">
        <p className="text-gray-300 whitespace-pre-wrap leading-relaxed">
          {post.content}
        </p>
      </div>

      <footer className="mt-8 pt-8 border-t border-slate-700">
        <button
          onClick={handleDelete}
          disabled={deletePost.isPending}
          className="px-4 py-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors disabled:opacity-50"
        >
          {deletePost.isPending ? "Deleting..." : "Delete Post"}
        </button>
      </footer>
    </article>
  )
}
