import {
  MutationCache,
  matchQuery,
  QueryClient,
  type QueryKey,
} from "@tanstack/react-query"
import { createRouter } from "@tanstack/react-router"
import { setupRouterSsrQueryIntegration } from "@tanstack/react-router-ssr-query"

import { routeTree } from "./routeTree.gen"

declare module "@tanstack/react-query" {
  interface Register {
    mutationMeta: {
      invalidates?: Array<
        | QueryKey
        | ((data: unknown, variables: unknown, context: unknown) => QueryKey)
      >
    }
  }
}

function getRouterContext() {
  const queryClient = new QueryClient({
    mutationCache: new MutationCache({
      onSuccess: (data, variables, context, mutation) => {
        queryClient.invalidateQueries({
          predicate: (query) =>
            // invalidate all matching tags at once
            // or everything if no meta is provided
            mutation.meta?.invalidates?.some((queryKey) => {
              if (typeof queryKey === "function") {
                return matchQuery(
                  { queryKey: queryKey(data, variables, context) },
                  query,
                )
              }

              return matchQuery({ queryKey }, query)
            }) ?? true,
        })
      },
    }),
  })

  return {
    queryClient,
    user: null,
  }
}

export const getRouter = () => {
  const context = getRouterContext()

  const router = createRouter({
    routeTree,
    context,
    defaultPreload: "intent",
    defaultPreloadStaleTime: 0,
    defaultStructuralSharing: true,
    defaultViewTransition: true,
    scrollRestoration: true,
  })

  setupRouterSsrQueryIntegration({
    handleRedirects: true,
    queryClient: context.queryClient,
    router,
    wrapQueryClient: true,
  })

  return router
}
