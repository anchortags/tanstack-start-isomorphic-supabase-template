import type {
  JwtPayload,
  User as SupabaseUser,
  UserAppMetadata,
  UserMetadata,
} from "@supabase/supabase-js"

export type AuthUser = {
  id: string
  aal: string
  email?: string
  phone?: string
  is_anonymous: boolean
  app_metadata: UserAppMetadata
  user_metadata: UserMetadata
}

export const mapSupabaseUserToAuthUser = (user: SupabaseUser): AuthUser => {

  return {
    id: user.id,
    aal: user.app_metadata.aal,
    email: user.email,
    phone: user.phone,
    is_anonymous: user.role === "anon",
    app_metadata: user.app_metadata,
    user_metadata: user.user_metadata,
  }
}

export const mapSupabaseClaimsToAuthUser = (claims: JwtPayload): AuthUser => {
  return {
    id: claims.sub,
    aal: claims.aal,
    email: claims.email,
    phone: claims.phone,
    is_anonymous: claims.is_anonymous ?? true,
    app_metadata: claims.app_metadata ?? {},
    user_metadata: claims.user_metadata ?? {},
  }
}
