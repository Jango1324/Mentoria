'use server'

import { createClient } from '@/lib/supabase/server'

export async function saveOpportunity(opportunityId: string) {
  const supabase = await createClient()

  const { data: { user }, error: userError } = await supabase.auth.getUser()
  if (userError || !user) return { error: 'Not authenticated.' }

  const payload = {
    user_id: user.id,
    opportunity_id: opportunityId,
  }

  const { error } = await supabase
    .from('saved_opportunities')
    .insert(payload as never)

  if (error) return { error: error.message }
  return { success: true }
}

export async function unsaveOpportunity(opportunityId: string) {
  const supabase = await createClient()

  const { data: { user }, error: userError } = await supabase.auth.getUser()
  if (userError || !user) return { error: 'Not authenticated.' }

  const { error } = await supabase
    .from('saved_opportunities')
    .delete()
    .eq('user_id', user.id)
    .eq('opportunity_id', opportunityId)

  if (error) return { error: error.message }
  return { success: true }
}
