import { createServerFn } from "@tanstack/react-start"
import { z } from "zod"
import { createAdminSupabaseClient } from "@/lib/supabase"
import { adminMiddleware } from "../middleware/admin"

const DeletePostSchema = z.object({
  postId: z.guid(),
})

export const adminDeletePost = createServerFn({ method: "POST" })
  .middleware([adminMiddleware])
  .inputValidator(DeletePostSchema)
  .handler(async ({ data }) => {
    const supabase = createAdminSupabaseClient()

    const { error } = await supabase.from("posts").delete().eq("id", data.postId)

    if (error) throw error
    return { success: true }
  })

const FeaturePostSchema = z.object({
  postId: z.guid(),
  featured: z.boolean(),
})

export const adminFeaturePost = createServerFn({ method: "POST" })
  .middleware([adminMiddleware])
  .inputValidator(FeaturePostSchema)
  .handler(async ({ data }) => {
    const supabase = createAdminSupabaseClient()

    const { error } = await supabase
      .from("posts")
      .update({ featured: data.featured })
      .eq("id", data.postId)

    if (error) throw error
    return { success: true }
  })
