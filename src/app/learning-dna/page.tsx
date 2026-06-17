import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import AppNav from '@/components/AppNav'
import { getUserDNA } from '@/lib/actions/dna'
import { getActiveOpportunities } from '@/lib/data/opportunities'
import { getPublishedCourses } from '@/lib/data/courses'
import QuizClient from './QuizClient'
import ResultView from './ResultView'

export default async function LearningDNAPage({
  searchParams,
}: {
  searchParams: Promise<{ retake?: string }>
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { retake } = await searchParams
  const forceRetake = retake === '1'

  const [dna, opportunities, courses] = await Promise.all([
    forceRetake ? Promise.resolve(null) : getUserDNA(),
    getActiveOpportunities(),
    getPublishedCourses(),
  ])

  return (
    <div style={{ background: 'var(--paper)', minHeight: '100vh' }}>
      <AppNav activePath="/learning-dna" />

      <main className="container" style={{ padding: '48px 24px', maxWidth: 640 }}>

        {dna ? (
          <ResultView
            dna={dna}
            opportunities={opportunities}
            courses={courses}
          />
        ) : (
          <>
            <p className="eyebrow" style={{ marginBottom: 14 }}>Learning DNA</p>
            <h1 className="display-sm" style={{ marginBottom: 10 }}>
              Discover your learning style
            </h1>
            <p className="body-sm" style={{ marginBottom: 44 }}>
              13 questions · under 3 minutes
            </p>
            <QuizClient opportunities={opportunities} courses={courses} />
          </>
        )}

      </main>
    </div>
  )
}
