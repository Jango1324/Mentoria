import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import AppNav from '@/components/AppNav'
import { getUserDNA } from '@/lib/actions/dna'
import { DNA_PROFILES } from '@/lib/data/dna'
import type { LearningDNA } from '@/types'

export default async function LearningDNAPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const dna = await getUserDNA() as LearningDNA | null
  const profile = dna ? DNA_PROFILES[dna.dna_type] : null

  return (
    <div style={{ background: 'var(--paper)', minHeight: '100vh' }}>
      <AppNav activePath="/learning-dna" />

      <main
        className="container"
        style={{ padding: '64px 24px', maxWidth: 640 }}
      >
        <p className="eyebrow" style={{ marginBottom: 14 }}>Learning DNA</p>

        {dna && profile ? (
          <>
            <h1 className="display-sm" style={{ marginBottom: 8 }}>
              You are a {dna.dna_type}
            </h1>
            <p className="body-lg" style={{ marginBottom: 32 }}>
              {profile.description}
            </p>

            <div className="card-flat" style={{ marginBottom: 16 }}>
              <p className="eyebrow" style={{ marginBottom: 12 }}>Strengths</p>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 6 }}>
                {profile.strengths.map((s) => (
                  <li key={s} style={{ fontSize: 14, color: 'var(--ink-2)' }}>
                    {s}
                  </li>
                ))}
              </ul>
            </div>

            <div className="card-flat" style={{ marginBottom: 32 }}>
              <p className="eyebrow" style={{ marginBottom: 12 }}>Watch out for</p>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 6 }}>
                {profile.weaknesses.map((w) => (
                  <li key={w} style={{ fontSize: 14, color: 'var(--ink-2)' }}>
                    {w}
                  </li>
                ))}
              </ul>
            </div>

            <a href="/learning-dna" className="btn btn-ghost" style={{ fontSize: 13 }}>
              Retake quiz
            </a>
          </>
        ) : (
          <>
            <h1 className="display-sm" style={{ marginBottom: 12 }}>
              Discover your learning style
            </h1>
            <p className="body-lg" style={{ marginBottom: 32 }}>
              13 questions. Under 3 minutes. A personalised map of how you learn best.
            </p>
            <p className="body-sm">
              Quiz interface coming in Stage 4B.
            </p>
          </>
        )}
      </main>
    </div>
  )
}
