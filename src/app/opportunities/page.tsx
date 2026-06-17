import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import {
  getActiveOpportunities,
  getRecommendedOpportunities,
  getSavedOpportunities,
} from '@/lib/data/opportunities'
import AppNav from '@/components/AppNav'
import OpportunityList from './OpportunityList'
import type { Profile } from '@/types'

export default async function OpportunitiesPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data } = await supabase
    .from('profiles')
    .select('interests')
    .eq('id', user.id)
    .single()

  const interests = (data as Pick<Profile, 'interests'> | null)?.interests ?? []

  const [opportunities, saved, recommended] = await Promise.all([
    getActiveOpportunities(),
    getSavedOpportunities(user.id),
    getRecommendedOpportunities(interests),
  ])

  const savedIds = saved.map((s) => s.opportunity_id)

  return (
    <div style={{ background: 'var(--paper)', minHeight: '100vh' }}>
      <AppNav activePath="/opportunities" />

      <main className="container" style={{ padding: '48px 24px' }}>
        <div style={{ marginBottom: 40 }}>
          <p className="eyebrow" style={{ marginBottom: 12 }}>Каталог</p>
          <h1 className="display-sm" style={{ marginBottom: 8 }}>Возможности</h1>
          <p className="body-sm">Олимпиады, хакатоны, стипендии и летние школы</p>
        </div>

        <OpportunityList
          opportunities={opportunities}
          recommended={recommended}
          savedIds={savedIds}
          hasInterests={interests.length > 0}
        />
      </main>
    </div>
  )
}
