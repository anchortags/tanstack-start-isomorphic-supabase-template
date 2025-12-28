import { createFileRoute, Link } from "@tanstack/react-router"
import { useSuspenseQuery } from "@tanstack/react-query"
import { postsQueries } from "@/lib/posts"
import { CreatePostForm } from "@/lib/posts/components/create-post-form"

export const Route = createFileRoute("/posts")({
  component: PostsPage,
  loader: ({ context }) => {
    // Don't await! Let the Promise stream to the client.
    // Must .catch() to prevent unhandled rejection errors on the server.
    context.queryClient.ensureQueryData(postsQueries.all()).catch(() => {})
  },
})

function PostsPage() {
  const { data: posts } = useSuspenseQuery(postsQueries.all())

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-white">Posts</h1>
        <CreatePostForm />
      </div>

      {posts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-400 text-lg">No posts yet. Create your first post!</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {posts.map((post) => (
            <article
              key={post.id}
              className="p-6 bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl hover:border-cyan-500/50 transition-all duration-300"
            >
              <Link
                to="/posts/$id"
                params={{ id: post.id }}
                className="text-xl font-semibold text-white hover:text-cyan-400 transition-colors"
              >
                {post.title}
              </Link>
              <p className="text-gray-400 mt-2 line-clamp-2">{post.content}</p>
              <div className="flex items-center mt-4 text-sm text-gray-500">
                <span>{post.author?.name ?? "Unknown author"}</span>
                <span className="mx-2">·</span>
                <time>{new Date(post.created_at).toLocaleDateString()}</time>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  )
}
