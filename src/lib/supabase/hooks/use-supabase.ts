import { useState } from "react"

import { createSupabaseClient } from "@/lib/supabase/client"

export function useSupabase() {
  const [supabase] = useState(() => createSupabaseClient())

  return supabase
}
