import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { signOut } from '@/app/login/actions'
import type { Profile } from '@/types'
import { getSavedOpportunities } from '@/lib/data/opportunities'

export default async function DashboardPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

const { data } = await supabase
  .from('profiles')
  .select('*')
  .eq('id', user.id)
  .single()

const profile = data as Profile | null
  if (!profile) {
    redirect('/onboarding')
  }

  const savedOpportunities = await getSavedOpportunities(user.id)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <h1 className="text-lg font-semibold text-gray-900">Mentoria Hub</h1>
        <form action={signOut}>
          <button
            type="submit"
            className="text-sm text-gray-500 hover:text-gray-900"
          >
            Sign out
          </button>
        </form>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-10 space-y-8">
        {/* Welcome */}
        <section>
          <h2 className="text-2xl font-semibold text-gray-900">
            Welcome, {profile.full_name ?? 'Student'}
          </h2>
        </section>

        {/* Profile card */}
        <section className="bg-white rounded-lg shadow p-6 space-y-4">
          <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">
            Your Profile
          </h3>
          <div className="grid grid-cols-2 gap-4 text-sm text-gray-700">
            <div>
              <span className="font-medium">Grade: </span>
              {profile.grade ?? '—'}
            </div>
            <div>
              <span className="font-medium">Country: </span>
              {profile.country ?? '—'}
            </div>
          </div>
          {profile.interests && profile.interests.length > 0 && (
            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">Interests</p>
              <div className="flex flex-wrap gap-2">
                {profile.interests.map((interest: string) => (
                  <span
                    key={interest}
                    className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-full"
                  >
                    {interest}
                  </span>
                ))}
              </div>
            </div>
          )}
        </section>

        {/* Saved Opportunities */}
        <section className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-3">
            Saved Opportunities
          </h3>
          {savedOpportunities.length === 0 ? (
            <p className="text-sm text-gray-400">No saved opportunities yet.</p>
          ) : (
            <ul className="space-y-3">
              {savedOpportunities.map((saved) => (
                <li key={saved.id} className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-800">
                      {saved.opportunity.title}
                    </p>
                    <p className="text-xs text-gray-500">{saved.opportunity.category}</p>
                  </div>
                  {saved.opportunity.deadline && (
                    <span className="text-xs text-gray-400 whitespace-nowrap">
                      Due {saved.opportunity.deadline}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* Courses */}
        <section className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-3">
            My Courses
          </h3>
          <p className="text-sm text-gray-400">Coming soon.</p>
        </section>

        {/* Upcoming Deadlines */}
        <section className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-3">
            Upcoming Deadlines
          </h3>
          <p className="text-sm text-gray-400">Coming soon.</p>
        </section>
      </main>
    </div>
  )
}
