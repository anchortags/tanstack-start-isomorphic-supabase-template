# TanStack Start Isomorphic Supabase Template

A full-stack starter template combining [TanStack Start](https://tanstack.com/start) with [Supabase](https://supabase.com/) for building modern, type-safe web applications with seamless server/client data access patterns.

For a detailed walkthrough of the patterns used in this template, check out the companion blog post: [Isomorphic Supabase Pattern in TanStack Start](https://www.anchortags.dev/posts/isomorphic-supabase-pattern-in-tanstack-start).

## Features

- **Isomorphic Supabase Client** - Single API that works on both server and client using `createIsomorphicFn`
- **Server Functions & Middleware** - Type-safe server functions with composable middleware for auth and Supabase access
- **TanStack Query Integration** - Data fetching with React Query for caching, refetching, and optimistic updates
- **Authentication Ready** - Sign in, sign up, and sign out flows with Supabase Auth
- **Type-Safe Database** - Auto-generated TypeScript types from your Supabase schema
- **File-Based Routing** - TanStack Router with automatic route generation
- **Tailwind CSS v4** - Modern styling with the latest Tailwind
- **Testing Setup** - Vitest configured and ready to use

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm
- [Supabase CLI](https://supabase.com/docs/guides/cli)
- Docker (for local Supabase)

### Installation

```bash
pnpm install
```

### Local Supabase Setup

Start the local Supabase instance:

```bash
pnpm supabase:start
```

This will spin up a local Supabase instance with Postgres, Auth, and other services.

### Environment Variables

Create a `.env` file in the root of your project:

```bash
VITE_SUPABASE_URL=http://127.0.0.1:54321
VITE_SUPABASE_ANON_KEY=<your-local-anon-key>
SUPABASE_SERVICE_ROLE_KEY=<your-local-service-role-key>
```

The keys are displayed when you run `pnpm supabase:start`.

### Development

```bash
pnpm dev
```

The app will be available at [http://localhost:3000](http://localhost:3000).

## Project Structure

```text
src/
├── components/          # Shared React components
├── lib/
│   ├── auth/           # Authentication queries and utilities
│   ├── middleware/     # Server function middleware (auth, supabase)
│   ├── posts/          # Example feature module
│   │   ├── components/ # Feature-specific components
│   │   ├── mutations.ts
│   │   ├── queries.ts
│   │   └── service.ts
│   └── supabase/       # Supabase client configuration
│       ├── client.ts        # Isomorphic client
│       ├── browser-client.ts
│       ├── server-client.ts
│       ├── admin-client.ts
│       └── hooks/           # React hooks for auth actions
├── routes/             # File-based routes
└── router.tsx          # Router configuration
```

## Key Patterns

### Isomorphic Supabase Client

The template provides a unified Supabase client that automatically uses the correct implementation based on the environment:

```tsx
import { createSupabaseClient } from "@/lib/supabase"

// Works in both server functions and client components
const supabase = createSupabaseClient()
const { data } = await supabase.from("posts").select()
```

### Server Function Middleware

Compose middleware for authentication and database access:

```tsx
import { createServerFn } from "@tanstack/react-start"
import { authMiddleware } from "@/lib/middleware/auth"

const getProtectedData = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    // context.user is available and typed
    // context.supabase is the server client
    return context.supabase.from("posts").select()
  })
```

### Feature-Based Organization

Each feature (e.g., posts) contains:

- **service.ts** - Database operations as a class
- **queries.ts** - Server functions for data fetching
- **mutations.ts** - Server functions for data mutations
- **components/** - Feature-specific React components

## Scripts

| Command                   | Description                             |
| ------------------------- | --------------------------------------- |
| `pnpm dev`                | Start development server on port 3000  |
| `pnpm build`              | Build for production                    |
| `pnpm preview`            | Preview production build                |
| `pnpm test`               | Run tests with Vitest                   |
| `pnpm supabase:start`     | Start local Supabase                    |
| `pnpm supabase:stop`      | Stop local Supabase                     |
| `pnpm supabase:db:reset`  | Reset database and run migrations       |
| `pnpm supabase:db:diff`   | Generate migration from schema changes  |
| `pnpm supabase:gen-types` | Regenerate TypeScript types from schema |

## Database Migrations

Migrations are located in `supabase/migrations/`. To create a new migration:

1. Make changes to your database using [Supabase Studio](http://127.0.0.1:54323)
2. Generate a migration: `pnpm supabase:db:diff -f <migration_name>`
3. Regenerate types: `pnpm supabase:gen-types`

## Authentication

The template includes authentication hooks in `src/lib/supabase/hooks/`:

- `useSignInWithPassword` - Email/password sign in
- `useSignUpWithPassword` - Email/password sign up
- `useSignOut` - Sign out
- `useRefreshSession` - Refresh the current session

Protected routes can use the `authMiddleware` to ensure users are authenticated.

## Learn More

- [TanStack Start Documentation](https://tanstack.com/start/latest)
- [TanStack Router Documentation](https://tanstack.com/router/latest)
- [TanStack Query Documentation](https://tanstack.com/query/latest)
- [Supabase Documentation](https://supabase.com/docs)
- [Supabase Auth with SSR](https://supabase.com/docs/guides/auth/server-side)
