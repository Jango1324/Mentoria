import { createClient } from '@/lib/supabase/server'
import type { Opportunity, SavedOpportunityWithDetails } from '@/types'

export async function getActiveOpportunities(): Promise<Opportunity[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('opportunities')
    .select('*')
    .eq('is_active', true)
    .order('deadline', { ascending: true, nullsFirst: false })

  if (error || !data) return []
  return data as Opportunity[]
}

export async function getRecommendedOpportunities(interests: string[]): Promise<Opportunity[]> {
  if (interests.length === 0) return []
  const all = await getActiveOpportunities()
  return all.filter((opp) => {
    const categoryMatch = interests.includes(opp.category)
    const tagMatch = opp.tags.some((tag) => interests.includes(tag))
    return categoryMatch || tagMatch
  })
}

export async function getSavedOpportunities(userId: string): Promise<SavedOpportunityWithDetails[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('saved_opportunities')
    .select('*, opportunity:opportunities(*)')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error || !data) return []
  return data as unknown as SavedOpportunityWithDetails[]
}
