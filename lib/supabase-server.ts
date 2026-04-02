import { createClient } from '@supabase/supabase-js'

// Server-side client — uses service role key for API routes
// NEVER expose this to the browser
export function createServerClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder-service-key'
  return createClient(url, serviceKey, {
    auth: { persistSession: false },
  })
}
