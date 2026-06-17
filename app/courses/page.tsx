'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { COURSES } from '@/lib/data'
import Navbar from '@/components/Navbar'
import Link from 'next/link'

export default function CoursesPage() {
  const [enrolledIds, setEnrolledIds] = useState<string[]>([])
  const [completedLessons, setCompletedLessons] = useState<string[]>([])
  const [userId, setUserId] = useState<string | null>(null)
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      setUserId(user.id)
      const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
      setIsAdmin(profile?.role === 'admin')
      const { data: en } = await supabase.from('course_enrollments').select('course_id').eq('user_id', user.id)
      setEnrolledIds((en || []).map((e: any) => e.course_id))
      const { data: prog } = await supabase.from('lesson_progress').select('lesson_id').eq('user_id', user.id).eq('completed', true)
      setCompletedLessons((prog || []).map((p: any) => p.lesson_id))
    }
    load()
  }, [])

  async function enroll(courseId: string) {
    if (!userId) return
    const supabase = createClient()
    await supabase.from('course_enrollments').upsert({ user_id: userId, course_id: courseId })
    setEnrolledIds([...enrolledIds, courseId])
  }

  function getProgress(course: typeof COURSES[0]) {
    const done = course.lessons.filter(l => completedLessons.includes(l.id)).length
    return { done, total: course.lessons.length, pct: Math.round((done / course.lessons.length) * 100) }
  }

  const levelBg: Record<string, string> = {
    'Начальный': '#e8f5ee', 'Средний': '#fff8e8', 'Продвинутый': '#fde8f0'
  }
  const levelTc: Record<string, string> = {
    'Начальный': '#1a7a4a', 'Средний': '#b45309', 'Продвинутый': '#be185d'
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--paper)' }}>
      <Navbar isAdmin={isAdmin} />

      <div style={{ borderBottom: '1px solid var(--line)', padding: '40px 0 32px' }}>
        <div className="container">
          <p className="eyebrow" style={{ marginBottom: 10 }}>Обучение</p>
          <h1 className="display-md">Курсы Mentoria</h1>
          <p className="body-lg" style={{ marginTop: 12, maxWidth: 480 }}>
            Учись в своём темпе — уроки, задания и тесты без привязки к расписанию.
          </p>
        </div>
      </div>

      <div className="container" style={{ paddingTop: 40, paddingBottom: 64 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 }}>
          {COURSES.map(course => {
            const isEnrolled = enrolledIds.includes(course.id)
            const { done, total, pct } = getProgress(course)

            return (
              <div key={course.id} className="card-flat" style={{ display: 'flex', flexDirection: 'column' }}>
                <div style={{ fontSize: 40, marginBottom: 20 }}>{course.image}</div>

                <div style={{ display: 'flex', gap: 6, marginBottom: 14 }}>
                  <span style={{ background: levelBg[course.level], color: levelTc[course.level], fontSize: 11, fontWeight: 500, padding: '3px 10px', borderRadius: 100 }}>
                    {course.level}
                  </span>
                  <span className="tag">{total} урока</span>
                </div>

                <h2 style={{ fontFamily: 'Instrument Serif, serif', fontSize: 22, color: 'var(--ink)', lineHeight: 1.15, marginBottom: 10 }}>
                  {course.title}
                </h2>
                <p style={{ fontSize: 13, color: 'var(--ink3)', lineHeight: 1.6, marginBottom: 20, flex: 1 }}>{course.description}</p>

                {/* Lesson list preview */}
                <div style={{ borderTop: '1px solid var(--line)', paddingTop: 14, marginBottom: 16 }}>
                  {course.lessons.slice(0, 3).map((l, i) => (
                    <div key={l.id} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '5px 0', fontSize: 12, color: 'var(--ink3)' }}>
                      <span style={{ width: 18, height: 18, background: completedLessons.includes(l.id) ? 'var(--ink)' : 'var(--paper-2)', border: '1px solid var(--line)', borderRadius: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, color: completedLessons.includes(l.id) ? '#fff' : 'var(--ink3)', flexShrink: 0 }}>
                        {completedLessons.includes(l.id) ? '✓' : i + 1}
                      </span>
                      <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{l.title}</span>
                    </div>
                  ))}
                  {course.lessons.length > 3 && (
                    <p style={{ fontSize: 11, color: 'var(--ink3)', paddingTop: 4 }}>+ ещё {course.lessons.length - 3} урока</p>
                  )}
                </div>

                {isEnrolled && pct > 0 && (
                  <div style={{ marginBottom: 14 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--ink3)', marginBottom: 4 }}>
                      <span>Прогресс: {done}/{total}</span>
                      <span>{pct}%</span>
                    </div>
                    <div className="progress">
                      <div className="progress-fill accent" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                )}

                {isEnrolled ? (
                  <Link href={`/courses/${course.id}`} className="btn btn-dark" style={{ justifyContent: 'center', fontSize: 13 }}>
                    {pct > 0 ? 'Продолжить →' : 'Начать курс →'}
                  </Link>
                ) : (
                  <button onClick={() => enroll(course.id)} className="btn btn-ghost" style={{ justifyContent: 'center', fontSize: 13 }}>
                    Записаться
                  </button>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
