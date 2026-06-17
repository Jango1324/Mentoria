import type React from 'react'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { getSavedOpportunities, getRecommendedOpportunities } from '@/lib/data/opportunities'
import { getUserDNA } from '@/lib/actions/dna'
import { DNA_PROFILES } from '@/lib/data/dna'
import {
  getPublishedCourses,
  getCourseWithLessons,
  getUserCourseProgress,
  calculateCourseProgress,
} from '@/lib/data/courses'
import AppNav from '@/components/AppNav'
import ProgressRing from '@/components/ProgressRing'
import type { Profile } from '@/types'

function daysUntil(deadline: string) {
  return Math.ceil((new Date(deadline).getTime() - Date.now()) / 86400000)
}

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  const profile = data as Profile | null
  if (!profile) redirect('/onboarding')

  const interests = profile.interests ?? []

  const [savedOpportunities, courses, dna] = await Promise.all([
    getSavedOpportunities(user.id),
    getPublishedCourses(),
    getUserDNA(),
  ])

  // Course progress
  const coursesWithProgress = await Promise.all(
    courses.map(async (course) => {
      const [withLessons, progress] = await Promise.all([
        getCourseWithLessons(course.id),
        getUserCourseProgress(user.id, course.id),
      ])
      const totalLessons = withLessons?.lessons.length ?? 0
      const completedLessons = progress.filter((p) => p.completed).length
      const pct = calculateCourseProgress(totalLessons, completedLessons)
      return { ...course, totalLessons, completedLessons, pct }
    })
  )

  const enrolledCourses = coursesWithProgress.filter((c) => c.completedLessons > 0)

  // Upcoming deadlines from saved opportunities
  const upcomingDeadlines = savedOpportunities
    .filter((s) => {
      if (!s.opportunity.deadline) return false
      return new Date(s.opportunity.deadline) >= new Date()
    })
    .sort(
      (a, b) =>
        new Date(a.opportunity.deadline!).getTime() -
        new Date(b.opportunity.deadline!).getTime()
    )
    .slice(0, 5)

  // Recommendations based on interests
  const recommended =
    interests.length > 0 ? await getRecommendedOpportunities(interests) : []

  return (
    <div style={{ background: 'var(--paper)', minHeight: '100vh' }}>
      <AppNav activePath="/dashboard" />

      <main className="container" style={{ padding: '48px 24px', maxWidth: 860 }}>

        {/* Welcome */}
        <div style={{ marginBottom: 48 }}>
          <p className="eyebrow" style={{ marginBottom: 12 }}>Личный кабинет</p>
          <h1 className="display-sm">
            Привет, {profile.full_name?.split(' ')[0] ?? 'Студент'}
          </h1>
        </div>

        {/* Profile */}
        <section style={{ marginBottom: 48 }}>
          <p className="eyebrow" style={{ marginBottom: 16 }}>Профиль</p>
          <div className="card-flat">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 20, marginBottom: interests.length > 0 ? 20 : 0 }}>
              <div>
                <p className="body-sm">Класс</p>
                <p style={{ fontSize: 15, color: 'var(--ink)', fontWeight: 500, marginTop: 4 }}>
                  {profile.grade ?? '—'}
                </p>
              </div>
              <div>
                <p className="body-sm">Страна</p>
                <p style={{ fontSize: 15, color: 'var(--ink)', fontWeight: 500, marginTop: 4 }}>
                  {profile.country ?? '—'}
                </p>
              </div>
            </div>
            {interests.length > 0 && (
              <div>
                <p className="body-sm" style={{ marginBottom: 8 }}>Интересы</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {interests.map((interest: string) => (
                    <span key={interest} className="tag">{interest}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Learning DNA */}
        <section style={{ marginBottom: 48 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 16 }}>
            <p className="eyebrow">Learning DNA</p>
            {dna && (
              <Link href="/learning-dna?retake=1" className="nav-link">Пройти снова →</Link>
            )}
          </div>

          {dna ? (
            (() => {
              const profile = DNA_PROFILES[dna.dna_type]
              return (
                <Link href="/learning-dna" style={{ textDecoration: 'none' }}>
                  <div className="card-flat" style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
                    <div
                      style={{
                        width: 44,
                        height: 44,
                        borderRadius: 4,
                        background: profile.color + '18',
                        border: `1px solid ${profile.color}44`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      <span style={{ fontSize: 11, fontWeight: 700, color: profile.color, letterSpacing: '0.04em' }}>
                        {dna.dna_type.slice(0, 2).toUpperCase()}
                      </span>
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontSize: 15, fontWeight: 500, color: 'var(--ink)' }}>
                        {dna.dna_type}
                      </p>
                      <p className="body-sm" style={{ marginTop: 2 }}>
                        {profile.strengths[0]} · {profile.strengths[1]}
                      </p>
                    </div>
                  </div>
                </Link>
              )
            })()
          ) : (
            <div className="card-flat" style={{ textAlign: 'center', padding: '32px 24px' }}>
              <p className="body-sm" style={{ marginBottom: 16 }}>
                Узнайте свой стиль обучения за 3 минуты.
              </p>
              <Link href="/learning-dna" className="btn btn-dark" style={{ fontSize: 13 }}>
                Пройти тест
              </Link>
            </div>
          )}
        </section>

        {/* My Courses */}
        <section style={{ marginBottom: 48 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 16 }}>
            <p className="eyebrow">Мои курсы</p>
            <Link href="/courses" className="nav-link">Все курсы →</Link>
          </div>

          {enrolledCourses.length === 0 ? (
            <div className="card-flat" style={{ textAlign: 'center', padding: '32px 24px' }}>
              <p className="body-sm" style={{ marginBottom: 16 }}>
                Вы ещё не начали ни одного курса.
              </p>
              <Link href="/courses" className="btn btn-dark" style={{ fontSize: 13 }}>
                Начать обучение
              </Link>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {enrolledCourses.map((course, i) => (
                <Link key={course.id} href={`/courses/${course.id}`} style={{ textDecoration: 'none' }}>
                  <div
                    className="card-flat row-enter"
                    style={{ '--i': i, display: 'flex', alignItems: 'center', gap: 14 } as React.CSSProperties}
                  >
                    <ProgressRing pct={course.pct} size={44} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontSize: 15, color: 'var(--ink)', fontWeight: 500, lineHeight: 1.3 }}>
                        {course.title}
                      </p>
                      <p className="body-sm" style={{ marginTop: 2 }}>
                        {course.completedLessons} из {course.totalLessons} уроков
                      </p>
                    </div>
                    <span className="body-sm" style={{ flexShrink: 0 }}>{course.pct}%</span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>

        {/* Saved Opportunities */}
        <section style={{ marginBottom: 48 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 16 }}>
            <p className="eyebrow">Сохранённые</p>
            <Link href="/opportunities" className="nav-link">Все возможности →</Link>
          </div>

          {savedOpportunities.length === 0 ? (
            <div className="card-flat" style={{ textAlign: 'center', padding: '32px 24px' }}>
              <p className="body-sm" style={{ marginBottom: 16 }}>
                Нет сохранённых возможностей.
              </p>
              <Link href="/opportunities" className="btn btn-dark" style={{ fontSize: 13 }}>
                Найти возможности
              </Link>
            </div>
          ) : (
            <div className="card-flat" style={{ padding: 0 }}>
              {savedOpportunities.map((saved, i) => {
                const dl = saved.opportunity.deadline
                const days = dl ? daysUntil(dl) : null
                return (
                  <div
                    key={saved.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '14px 20px',
                      borderBottom: i < savedOpportunities.length - 1 ? '1px solid var(--line)' : 'none',
                      gap: 16,
                    }}
                  >
                    <div>
                      <p style={{ fontSize: 14, color: 'var(--ink)', fontWeight: 500 }}>
                        {saved.opportunity.title}
                      </p>
                      <p className="body-sm">{saved.opportunity.category}</p>
                    </div>
                    {dl && days !== null && (
                      <span
                        className={`tag${days <= 30 && days >= 0 ? ' tag-warn' : ''}`}
                        style={{ whiteSpace: 'nowrap', flexShrink: 0 }}
                      >
                        {days < 0 ? 'Истёк' : days === 0 ? 'Сегодня' : `${days} дн.`}
                      </span>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </section>

        {/* Upcoming Deadlines */}
        {upcomingDeadlines.length > 0 && (
          <section style={{ marginBottom: 48 }}>
            <p className="eyebrow" style={{ marginBottom: 16 }}>Ближайшие дедлайны</p>
            <div className="card-flat" style={{ padding: 0 }}>
              {upcomingDeadlines.map((saved, i) => {
                const days = daysUntil(saved.opportunity.deadline!)
                return (
                  <div
                    key={saved.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '14px 20px',
                      borderBottom: i < upcomingDeadlines.length - 1 ? '1px solid var(--line)' : 'none',
                      gap: 16,
                    }}
                  >
                    <p style={{ fontSize: 14, color: 'var(--ink)', fontWeight: 500 }}>
                      {saved.opportunity.title}
                    </p>
                    <span className={`tag${days <= 30 ? ' tag-warn' : ''}`} style={{ flexShrink: 0 }}>
                      {days === 0 ? 'Сегодня' : `через ${days} дн.`}
                    </span>
                  </div>
                )
              })}
            </div>
          </section>
        )}

        {/* Recommended opportunities */}
        {recommended.length > 0 && (
          <section>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 16 }}>
              <p className="eyebrow">Рекомендуется для вас</p>
              <Link href="/opportunities" className="nav-link">Смотреть все →</Link>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 12 }}>
              {recommended.slice(0, 3).map((opp, i) => (
                <Link key={opp.id} href="/opportunities" style={{ textDecoration: 'none' }}>
                  <div
                    className="card-flat card-enter"
                    style={{ '--i': i, height: '100%' } as React.CSSProperties}
                  >
                    <span className="tag" style={{ display: 'inline-block', marginBottom: 10 }}>
                      {opp.category}
                    </span>
                    <p style={{ fontSize: 15, color: 'var(--ink)', fontWeight: 500, lineHeight: 1.3 }}>
                      {opp.title}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

      </main>
    </div>
  )
}
