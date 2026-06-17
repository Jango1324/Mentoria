import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import Navbar from '@/components/Navbar'
import Link from 'next/link'
import { OPPORTUNITIES, COURSES } from '@/lib/data'

export default async function DashboardPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single()
  const { data: saved } = await supabase.from('saved_opportunities').select('opportunity_id').eq('user_id', user.id)
  const { data: progress } = await supabase.from('lesson_progress').select('lesson_id').eq('user_id', user.id).eq('completed', true)
  const { data: enrollments } = await supabase.from('course_enrollments').select('course_id').eq('user_id', user.id)

  const savedIds = (saved || []).map((s: any) => s.opportunity_id)
  const completedLessons = (progress || []).map((p: any) => p.lesson_id)
  const enrolledIds = (enrollments || []).map((e: any) => e.course_id)

  const savedOpps = OPPORTUNITIES.filter(o => savedIds.includes(o.id))
  const enrolledCourses = COURSES.filter(c => enrolledIds.includes(c.id))
  const userInterests = profile?.interests || []
  const recommended = OPPORTUNITIES.filter(o => o.tags.some((t: string) => userInterests.includes(t))).slice(0, 4)

  const upcomingDeadlines = savedOpps
    .filter(o => new Date(o.deadline) > new Date())
    .sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime())
    .slice(0, 4)

  function courseProgress(courseId: string) {
    const course = COURSES.find(c => c.id === courseId)
    if (!course) return 0
    const done = course.lessons.filter(l => completedLessons.includes(l.id)).length
    return Math.round((done / course.lessons.length) * 100)
  }

  const name = profile?.name || user.email?.split('@')[0] || 'Ученик'
  const isAdmin = profile?.role === 'admin'

  return (
    <div style={{ minHeight: '100vh', background: 'var(--paper)' }}>
      <Navbar isAdmin={isAdmin} />

      <div className="container" style={{ paddingTop: 48, paddingBottom: 64 }}>
        {/* Header */}
        <div style={{ paddingBottom: 32, marginBottom: 40, borderBottom: '1px solid var(--line)' }}>
          <p className="eyebrow" style={{ marginBottom: 8 }}>
            {profile?.grade ? `${profile.grade} класс` : 'Профиль'}{userInterests.length > 0 ? ` · ${userInterests.slice(0, 3).join(', ')}` : ''}
          </p>
          <h1 className="display-md">Привет, {name}</h1>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 1, border: '1px solid var(--line)', marginBottom: 48 }}>
          {[
            { value: savedIds.length, label: 'Сохранено' },
            { value: enrolledIds.length, label: 'Курсов' },
            { value: completedLessons.length, label: 'Уроков' },
            { value: upcomingDeadlines.length, label: 'Дедлайнов' },
          ].map(({ value, label }) => (
            <div key={label} style={{ padding: '20px 16px', borderRight: '1px solid var(--line)', textAlign: 'center' }}>
              <div style={{ fontFamily: 'Instrument Serif, serif', fontSize: 32, color: 'var(--ink)', lineHeight: 1 }}>{value}</div>
              <div className="eyebrow" style={{ marginTop: 6 }}>{label}</div>
            </div>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 40, alignItems: 'start' }}>
          {/* Left */}
          <div>
            {/* Courses */}
            <div style={{ marginBottom: 48 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
                <h2 style={{ fontFamily: 'Instrument Serif, serif', fontSize: 22 }}>Мои курсы</h2>
                <Link href="/courses" style={{ fontSize: 12, color: 'var(--ink3)', textDecoration: 'none', borderBottom: '1px solid var(--line)', paddingBottom: 1 }}>Все →</Link>
              </div>

              {enrolledCourses.length === 0 ? (
                <div style={{ border: '1px dashed var(--line)', borderRadius: 2, padding: '32px 24px', textAlign: 'center' }}>
                  <p className="body-sm" style={{ marginBottom: 12 }}>Ты ещё не записан ни на один курс</p>
                  <Link href="/courses" className="btn btn-ghost" style={{ fontSize: 13 }}>Выбрать курс</Link>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', border: '1px solid var(--line)', borderRadius: 2 }}>
                  {enrolledCourses.map((course, i) => {
                    const pct = courseProgress(course.id)
                    return (
                      <Link key={course.id} href={`/courses/${course.id}`} style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 16, padding: '16px 20px', borderBottom: i < enrolledCourses.length - 1 ? '1px solid var(--line)' : 'none', transition: 'background 0.15s' }}>
                        <span style={{ fontSize: 24 }}>{course.image}</span>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <p style={{ fontWeight: 500, fontSize: 14, color: 'var(--ink)', marginBottom: 6, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{course.title}</p>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                            <div className="progress" style={{ flex: 1 }}>
                              <div className="progress-fill accent" style={{ width: `${pct}%` }} />
                            </div>
                            <span style={{ fontSize: 11, color: 'var(--ink3)', whiteSpace: 'nowrap' }}>{pct}%</span>
                          </div>
                        </div>
                        <span style={{ fontSize: 13, color: 'var(--ink3)' }}>→</span>
                      </Link>
                    )
                  })}
                </div>
              )}
            </div>

            {/* Saved */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
                <h2 style={{ fontFamily: 'Instrument Serif, serif', fontSize: 22 }}>Сохранённые возможности</h2>
                <Link href="/opportunities" style={{ fontSize: 12, color: 'var(--ink3)', textDecoration: 'none', borderBottom: '1px solid var(--line)', paddingBottom: 1 }}>Каталог →</Link>
              </div>

              {savedOpps.length === 0 ? (
                <div style={{ border: '1px dashed var(--line)', borderRadius: 2, padding: '32px 24px', textAlign: 'center' }}>
                  <p className="body-sm" style={{ marginBottom: 12 }}>Нет сохранённых возможностей</p>
                  <Link href="/opportunities" className="btn btn-ghost" style={{ fontSize: 13 }}>Найти возможности</Link>
                </div>
              ) : (
                <div style={{ border: '1px solid var(--line)', borderRadius: 2 }}>
                  {savedOpps.slice(0, 5).map((opp, i) => (
                    <div key={opp.id} style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '14px 20px', borderBottom: i < savedOpps.length - 1 ? '1px solid var(--line)' : 'none' }}>
                      <span style={{ fontSize: 20 }}>{opp.image}</span>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ fontSize: 14, fontWeight: 500, color: 'var(--ink)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{opp.title}</p>
                        <p style={{ fontSize: 12, color: 'var(--ink3)' }}>{opp.category}</p>
                      </div>
                      <span className="tag">{new Date(opp.deadline).toLocaleDateString('ru', { day: 'numeric', month: 'short' })}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
            {/* Deadlines */}
            <div>
              <h2 style={{ fontFamily: 'Instrument Serif, serif', fontSize: 18, marginBottom: 16 }}>Ближайшие дедлайны</h2>
              {upcomingDeadlines.length === 0 ? (
                <p className="body-sm">Сохрани возможности, чтобы отслеживать дедлайны</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {upcomingDeadlines.map(opp => {
                    const days = Math.ceil((new Date(opp.deadline).getTime() - Date.now()) / 86400000)
                    return (
                      <div key={opp.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 0', borderBottom: '1px solid var(--line)' }}>
                        <div style={{ width: 40, height: 40, background: days <= 7 ? '#fdf0e8' : 'var(--paper-2)', border: '1px solid var(--line)', borderRadius: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          <span style={{ fontSize: 14, fontFamily: 'Instrument Serif, serif', color: days <= 7 ? 'var(--warn)' : 'var(--ink)', lineHeight: 1 }}>{days}</span>
                          <span style={{ fontSize: 9, color: 'var(--ink3)', letterSpacing: '0.05em' }}>дней</span>
                        </div>
                        <div style={{ minWidth: 0 }}>
                          <p style={{ fontSize: 13, fontWeight: 500, color: 'var(--ink)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{opp.title}</p>
                          <p style={{ fontSize: 11, color: 'var(--ink3)' }}>{new Date(opp.deadline).toLocaleDateString('ru')}</p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>

            {/* Recommendations */}
            <div>
              <h2 style={{ fontFamily: 'Instrument Serif, serif', fontSize: 18, marginBottom: 16 }}>Для тебя</h2>
              {recommended.length === 0 ? (
                <p className="body-sm">Заполни интересы в профиле</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {recommended.map(opp => (
                    <Link key={opp.id} href="/opportunities" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 10, padding: '10px 0', borderBottom: '1px solid var(--line)' }}>
                      <span style={{ fontSize: 18 }}>{opp.image}</span>
                      <div style={{ minWidth: 0 }}>
                        <p style={{ fontSize: 13, color: 'var(--ink)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{opp.title}</p>
                        <p style={{ fontSize: 11, color: 'var(--ink3)' }}>{opp.category}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
