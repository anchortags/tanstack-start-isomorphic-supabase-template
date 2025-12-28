import type { SupabaseClient } from "@/lib/supabase"

export interface CreatePostInput {
  title: string
  content: string
}

export interface UpdatePostInput {
  title?: string
  content?: string
}

export class PostsService {
  constructor(private supabase: SupabaseClient) {}

  async list() {
    const { data, error } = await this.supabase
      .from("posts")
      .select(
        `
        id,
        title,
        content,
        created_at,
        author:users (
          id,
          name,
          avatar_url
        )
      `
      )
      .order("created_at", { ascending: false })

    if (error) throw error
    return data
  }

  async getById(id: string) {
    const { data, error } = await this.supabase
      .from("posts")
      .select(
        `
        id,
        title,
        content,
        created_at,
        updated_at,
        author:users (
          id,
          name,
          avatar_url
        )
      `
      )
      .eq("id", id)
      .single()

    if (error) throw error
    return data
  }

  async create(input: CreatePostInput) {
    const {
      data: { user },
    } = await this.supabase.auth.getUser()

    if (!user) throw new Error("Not authenticated")

    const { data, error } = await this.supabase
      .from("posts")
      .insert({
        title: input.title,
        content: input.content,
        author_id: user.id,
      })
      .select()
      .single()

    if (error) throw error
    return data
  }

  async update(id: string, input: UpdatePostInput) {
    const { data, error } = await this.supabase
      .from("posts")
      .update(input)
      .eq("id", id)
      .select()
      .single()

    if (error) throw error
    return data
  }

  async delete(id: string) {
    const { error } = await this.supabase.from("posts").delete().eq("id", id)

    if (error) throw error
  }
}
