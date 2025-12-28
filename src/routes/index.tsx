import { createFileRoute, Link } from "@tanstack/react-router"
import { Database, Server, Zap, Shield } from "lucide-react"

export const Route = createFileRoute("/")({ component: App })

function App() {
  const features = [
    {
      icon: <Database className="w-12 h-12 text-cyan-400" />,
      title: "Isomorphic Supabase Client",
      description:
        "Single client factory that works on both server and client. Uses createIsomorphicFn for seamless environment detection.",
    },
    {
      icon: <Server className="w-12 h-12 text-cyan-400" />,
      title: "Service Layer Pattern",
      description:
        "Business logic abstracted into services with dependency injection. Write once, run anywhere, test easily.",
    },
    {
      icon: <Zap className="w-12 h-12 text-cyan-400" />,
      title: "TanStack Query Integration",
      description:
        "Automatic cache invalidation via MutationCache. Query and mutation options factories for type-safe data fetching.",
    },
    {
      icon: <Shield className="w-12 h-12 text-cyan-400" />,
      title: "Server-Only Protection",
      description:
        "Admin client wrapped in createServerOnlyFn to prevent secret key leakage. Middleware for protected operations.",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
      <section className="relative py-20 px-6 text-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 via-blue-500/10 to-purple-500/10"></div>
        <div className="relative max-w-5xl mx-auto">
          <div className="flex items-center justify-center gap-6 mb-6">
            <h1 className="text-5xl md:text-6xl font-black text-white [letter-spacing:-0.05em]">
              <span className="text-gray-300">Isomorphic</span>{" "}
              <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                Supabase
              </span>
            </h1>
          </div>
          <p className="text-xl md:text-2xl text-gray-300 mb-4 font-light">
            A clean architecture pattern for TanStack Start
          </p>
          <p className="text-lg text-gray-400 max-w-3xl mx-auto mb-8">
            This template demonstrates the isomorphic Supabase pattern: a single
            client that works seamlessly on both server and client, combined
            with a service layer and TanStack Query for state management.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/posts"
              className="px-8 py-3 bg-cyan-500 hover:bg-cyan-600 text-white font-semibold rounded-lg transition-colors shadow-lg shadow-cyan-500/50"
            >
              View Posts Demo
            </Link>
            <a
              href="https://tanstack.com/start"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-3 border border-slate-600 hover:border-slate-500 text-gray-300 font-semibold rounded-lg transition-colors"
            >
              TanStack Start Docs
            </a>
          </div>
        </div>
      </section>

      <section className="py-16 px-6 max-w-6xl mx-auto">
        <h2 className="text-2xl font-bold text-white text-center mb-12">
          Key Features
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6 hover:border-cyan-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/10"
            >
              <div className="mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold text-white mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-400 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="py-16 px-6 max-w-4xl mx-auto">
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-8">
          <h2 className="text-2xl font-bold text-white mb-6">
            Project Structure
          </h2>
          <pre className="text-sm text-gray-300 overflow-x-auto">
            {`src/
├── components/
│   └── app-header.tsx            # Shared app header
├── lib/
│   ├── auth/
│   │   └── queries.ts            # Auth query options
│   ├── middleware/
│   │   ├── admin.ts              # Admin auth middleware
│   │   ├── auth.ts               # Auth middleware
│   │   └── supabase-server-client.ts
│   ├── posts/
│   │   ├── admin-functions.ts    # Admin server functions
│   │   ├── components/
│   │   │   └── create-post-form.tsx
│   │   ├── mutations.ts          # Mutation options
│   │   ├── queries.ts            # Query options
│   │   └── service.ts            # Business logic
│   └── supabase/
│       ├── admin-client.ts       # Server-only admin client
│       ├── browser-client.ts     # Browser client factory
│       ├── client.ts             # Isomorphic client factory
│       ├── database.types.ts     # Generated types
│       └── server-client.ts      # Server client factory
└── routes/
    ├── __root.tsx                # Root layout
    ├── index.tsx                 # Home page
    ├── posts.tsx                 # Posts list with loader
    └── posts.$id.tsx             # Post detail with loader`}
          </pre>
        </div>
      </section>
    </div>
  )
}
