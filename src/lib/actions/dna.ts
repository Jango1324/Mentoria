'use server'

import { createClient } from '@/lib/supabase/server'
import type { DNAType, LearningDNA } from '@/types'

export async function saveDNAResult(
  dnaType: DNAType,
  scoreBreakdown: Record<DNAType, number>
): Promise<{ error?: string; success?: boolean }> {
  const supabase = await createClient()

  const { data: { user }, error: userError } = await supabase.auth.getUser()
  if (userError || !user) return { error: 'Not authenticated' }

  const { error } = await (supabase as any)
    .from('learning_dna')
    .upsert(
      {
        user_id: user.id,
        dna_type: dnaType,
        dna_score_breakdown: scoreBreakdown,
        completed_at: new Date().toISOString(),
      },
      { onConflict: 'user_id' }
    )

  if (error) return { error: error.message }
  return { success: true }
}

export async function getUserDNA(): Promise<LearningDNA | null> {
  const supabase = await createClient()

  const { data: { user }, error: userError } = await supabase.auth.getUser()
  if (userError || !user) return null

  const { data, error } = await (supabase as any)
    .from('learning_dna')
    .select('*')
    .eq('user_id', user.id)
    .maybeSingle()

  if (error || !data) return null
  return data as LearningDNA
}
