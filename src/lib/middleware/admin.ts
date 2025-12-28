import { createMiddleware } from "@tanstack/react-start"
import { authMiddleware } from "@/lib/middleware/auth"

export const adminMiddleware = createMiddleware({ type: "function"})
.middleware([authMiddleware]).server(async ({ next, context }) => {
  const user = context.user

  if (user.app_metadata?.role !== "admin") {
    throw new Response('Forbidden: Admin access required', { status: 403 })
  }

  return next()
})
