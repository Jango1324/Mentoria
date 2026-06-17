'use client'
import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { COURSES } from '@/lib/data'
import Navbar from '@/components/Navbar'
import Link from 'next/link'

export default function CoursePage() {
  const params = useParams()
  const courseId = params.id as string
  const course = COURSES.find(c => c.id === courseId)

  const [completed, setCompleted] = useState<string[]>([])
  const [userId, setUserId] = useState<string | null>(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [activeLesson, setActiveLesson] = useState<string | null>(null)
  const [quizAnswer, setQuizAnswer] = useState<number | null>(null)

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      setUserId(user.id)
      const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
      setIsAdmin(profile?.role === 'admin')
      const { data: prog } = await supabase.from('lesson_progress').select('lesson_id').eq('user_id', user.id).eq('completed', true)
      setCompleted((prog || []).map((p: any) => p.lesson_id))
    }
    load()
  }, [])

  if (!course) return <div style={{ padding: 48, textAlign: 'center', color: 'var(--ink3)' }}>Курс не найден</div>

  const totalPct = Math.round((completed.filter(id => course.lessons.some(l => l.id === id)).length / course.lessons.length) * 100)
  const currentLesson = activeLesson ? course.lessons.find(l => l.id === activeLesson) : null

  async function markComplete(lessonId: string) {
    if (!userId || completed.includes(lessonId)) return
    const supabase = createClient()
    await supabase.from('lesson_progress').upsert({ user_id: userId, lesson_id: lessonId, completed: true })
    setCompleted([...completed, lessonId])
    setQuizAnswer(null)
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--paper)' }}>
      <Navbar isAdmin={isAdmin} />

      {/* Course header */}
      <div style={{ borderBottom: '1px solid var(--line)', padding: '24px 0' }}>
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <Link href="/courses" style={{ fontSize: 13, color: 'var(--ink3)', textDecoration: 'none' }}>← Курсы</Link>
            <span style={{ color: 'var(--line)' }}>|</span>
            <span style={{ fontFamily: 'Instrument Serif, serif', fontSize: 18, color: 'var(--ink)' }}>{course.title}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div className="progress" style={{ width: 120 }}>
              <div className="progress-fill accent" style={{ width: `${totalPct}%` }} />
            </div>
            <span style={{ fontSize: 12, color: 'var(--ink3)', whiteSpace: 'nowrap' }}>{totalPct}% выполнено</span>
          </div>
        </div>
      </div>

      <div className="container" style={{ paddingTop: 32, paddingBottom: 64 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: 32, alignItems: 'start' }}>

          {/* Sidebar */}
          <div style={{ position: 'sticky', top: 80, border: '1px solid var(--line)', borderRadius: 2, overflow: 'hidden' }}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--line)', background: 'var(--paper-2)' }}>
              <p className="eyebrow" style={{ marginBottom: 4 }}>Содержание</p>
              <p style={{ fontSize: 12, color: 'var(--ink3)' }}>{completed.filter(id => course.lessons.some(l => l.id === id)).length} / {course.lessons.length} уроков</p>
            </div>
            {course.lessons.map((lesson, i) => {
              const done = completed.includes(lesson.id)
              const isActive = activeLesson === lesson.id
              return (
                <button key={lesson.id}
                  onClick={() => { setActiveLesson(lesson.id); setQuizAnswer(null) }}
                  style={{
                    width: '100%', display: 'flex', alignItems: 'center', gap: 12,
                    padding: '14px 20px', background: isActive ? 'var(--ink)' : 'transparent',
                    border: 'none', borderBottom: '1px solid var(--line)',
                    cursor: 'pointer', textAlign: 'left', transition: 'background 0.15s'
                  }}>
                  <div style={{
                    width: 22, height: 22, borderRadius: 100, flexShrink: 0,
                    background: done ? 'var(--accent)' : isActive ? '#fff' : 'var(--paper-2)',
                    border: `1px solid ${done ? 'var(--accent)' : isActive ? 'rgba(255,255,255,0.3)' : 'var(--line)'}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 9, color: done || isActive ? '#fff' : 'var(--ink3)',
                    fontWeight: 600
                  }}>
                    {done ? '✓' : i + 1}
                  </div>
                  <span style={{ fontSize: 13, lineHeight: 1.3, color: isActive ? '#fff' : done ? 'var(--ink2)' : 'var(--ink)', fontWeight: isActive ? 500 : 400 }}>
                    {lesson.title}
                  </span>
                </button>
              )
            })}
            {totalPct === 100 && (
              <div style={{ padding: '16px 20px', background: '#e8f5ee', textAlign: 'center' }}>
                <p style={{ fontSize: 13, color: '#1a7a4a', fontWeight: 500 }}>🎉 Курс завершён!</p>
              </div>
            )}
          </div>

          {/* Main content */}
          {!currentLesson ? (
            <div style={{ border: '1px solid var(--line)', borderRadius: 2, padding: '64px 32px', textAlign: 'center' }}>
              <p style={{ fontFamily: 'Instrument Serif, serif', fontSize: 28, color: 'var(--ink)', marginBottom: 12 }}>Выбери урок</p>
              <p className="body-sm">Нажми на урок в списке слева, чтобы начать</p>
            </div>
          ) : (
            <div>
              {/* Lesson title */}
              <h2 style={{ fontFamily: 'Instrument Serif, serif', fontSize: 32, color: 'var(--ink)', marginBottom: 24, lineHeight: 1.1 }}>
                {currentLesson.title}
              </h2>

              {/* Video placeholder */}
              <div style={{ background: 'var(--ink)', borderRadius: 2, aspectRatio: '16/9', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 32 }}>
                <div style={{ textAlign: 'center', color: '#fff' }}>
                  <div style={{ width: 56, height: 56, border: '1px solid rgba(255,255,255,0.3)', borderRadius: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px', cursor: 'pointer' }}>
                    <span style={{ marginLeft: 3, fontSize: 18 }}>▷</span>
                  </div>
                  <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Видео-урок</p>
                </div>
              </div>

              {/* Content */}
              <div style={{ marginBottom: 32, borderBottom: '1px solid var(--line)', paddingBottom: 32 }}>
                {currentLesson.content.split('\n\n').map((para, i) => {
                  if (para.startsWith('```')) {
                    const code = para.replace(/```\w*\n?/, '').replace(/```$/, '').trim()
                    return (
                      <pre key={i} style={{ background: 'var(--ink)', color: '#a8d8a8', borderRadius: 2, padding: '20px 24px', overflowX: 'auto', fontSize: 13, lineHeight: 1.6, margin: '16px 0', fontFamily: 'monospace' }}>
                        <code>{code}</code>
                      </pre>
                    )
                  }
                  return (
                    <p key={i} style={{ fontSize: 15, color: 'var(--ink2)', lineHeight: 1.8, marginBottom: 16 }}
                      dangerouslySetInnerHTML={{
                        __html: para
                          .replace(/\*\*(.*?)\*\*/g, '<strong style="color:var(--ink);font-weight:500">$1</strong>')
                          .replace(/\n/g, '<br/>')
                      }}
                    />
                  )
                })}
              </div>

              {/* Quiz */}
              {currentLesson.quiz && (
                <div style={{ marginBottom: 32, borderBottom: '1px solid var(--line)', paddingBottom: 32 }}>
                  <p className="eyebrow" style={{ marginBottom: 16 }}>Мини-тест</p>
                  <p style={{ fontSize: 16, fontWeight: 500, color: 'var(--ink)', marginBottom: 20 }}>
                    {currentLesson.quiz.question}
                  </p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16 }}>
                    {currentLesson.quiz.options.map((opt: string, i: number) => {
                      let bg = '#fff', border = 'var(--line)', color = 'var(--ink)'
                      if (quizAnswer !== null) {
                        if (i === currentLesson.quiz.answer) { bg = '#e8f5ee'; border = '#1a7a4a'; color = '#1a7a4a' }
                        else if (i === quizAnswer) { bg = '#fdf0e8'; border = 'var(--warn)'; color = 'var(--warn)' }
                      }
                      return (
                        <button key={i}
                          onClick={() => { if (quizAnswer === null) setQuizAnswer(i) }}
                          disabled={quizAnswer !== null}
                          style={{
                            padding: '14px 18px', background: bg,
                            border: `1px solid ${border}`, borderRadius: 2,
                            textAlign: 'left', cursor: quizAnswer !== null ? 'default' : 'pointer',
                            fontSize: 14, color, transition: 'all 0.15s', display: 'flex', gap: 10, alignItems: 'center'
                          }}>
                          <span style={{ color: 'var(--ink3)', fontSize: 12, minWidth: 16 }}>{String.fromCharCode(65 + i)}.</span>
                          {opt}
                        </button>
                      )
                    })}
                  </div>

                  {quizAnswer !== null && (
                    <div style={{
                      padding: '14px 18px', borderRadius: 2, fontSize: 14,
                      background: quizAnswer === currentLesson.quiz.answer ? '#e8f5ee' : '#fdf0e8',
                      color: quizAnswer === currentLesson.quiz.answer ? '#1a7a4a' : 'var(--warn)',
                      border: `1px solid ${quizAnswer === currentLesson.quiz.answer ? '#a3d8b8' : '#f5c4a0'}`
                    }}>
                      {quizAnswer === currentLesson.quiz.answer
                        ? '✓ Верно! Отличная работа.'
                        : `✕ Неверно. Правильный ответ: ${currentLesson.quiz.options[currentLesson.quiz.answer]}`}
                    </div>
                  )}
                </div>
              )}

              {/* Complete button */}
              {completed.includes(currentLesson.id) ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 14, color: '#1a7a4a' }}>
                  <span style={{ width: 24, height: 24, background: '#1a7a4a', borderRadius: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 11 }}>✓</span>
                  Урок завершён
                </div>
              ) : (
                <button
                  onClick={() => markComplete(currentLesson.id)}
                  disabled={currentLesson.quiz ? quizAnswer === null : false}
                  className="btn btn-dark"
                  style={{ opacity: (currentLesson.quiz && quizAnswer === null) ? 0.4 : 1 }}>
                  {currentLesson.quiz && quizAnswer === null ? 'Ответь на вопрос для завершения' : 'Отметить урок пройденным →'}
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
