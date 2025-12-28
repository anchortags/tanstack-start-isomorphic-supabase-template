import { createIsomorphicFn } from "@tanstack/react-start"
import { createBrowserSupabaseClient } from "./browser-client"
import { createServerSupabaseClient } from "./server-client"

export const createSupabaseClient = createIsomorphicFn()
  .server(() => createServerSupabaseClient())
  .client(() => createBrowserSupabaseClient())

export type SupabaseClient = ReturnType<typeof createSupabaseClient>
