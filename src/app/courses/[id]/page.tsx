import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import {
  getCourseWithLessons,
  getUserCourseProgress,
  calculateCourseProgress,
} from '@/lib/data/courses'
import AppNav from '@/components/AppNav'
import LessonList from './LessonList'

export default async function CourseDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { id } = await params

  const [course, progress] = await Promise.all([
    getCourseWithLessons(id),
    getUserCourseProgress(user.id, id),
  ])

  if (!course) notFound()

  const completedIds = new Set(
    progress.filter((p) => p.completed).map((p) => p.lesson_id)
  )
  const pct = calculateCourseProgress(course.lessons.length, completedIds.size)
  const nextLesson = course.lessons.find((l) => !completedIds.has(l.id))

  return (
    <div style={{ background: 'var(--paper)', minHeight: '100vh' }}>
      <AppNav activePath="/courses" />

      <main className="container" style={{ padding: '48px 24px' }}>
        {/* Back link */}
        <Link href="/courses" className="nav-link" style={{ display: 'inline-block', marginBottom: 36 }}>
          ← Все курсы
        </Link>

        {/* Course header */}
        <div style={{ marginBottom: 40 }}>
          <div style={{ display: 'flex', gap: 6, marginBottom: 16, flexWrap: 'wrap' }}>
            <span className="tag">{course.category}</span>
            <span className="tag">{course.lessons.length} уроков</span>
            {pct === 100 && <span className="tag tag-success">Завершён</span>}
          </div>
          <h1 className="display-sm" style={{ marginBottom: 12 }}>{course.title}</h1>
          {course.description && (
            <p className="body-sm" style={{ maxWidth: 600, lineHeight: 1.7 }}>
              {course.description}
            </p>
          )}
        </div>

        {/* Progress bar */}
        {course.lessons.length > 0 && (
          <div style={{ marginBottom: 40, maxWidth: 520 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <span className="body-sm">
                {completedIds.size} из {course.lessons.length} уроков завершено
              </span>
              <span className="body-sm">{pct}%</span>
            </div>
            <div className="progress">
              <div className="progress-fill accent" style={{ width: `${pct}%` }} />
            </div>
            {nextLesson && pct > 0 && pct < 100 && (
              <p className="body-sm" style={{ marginTop: 8 }}>
                Следующий урок: {nextLesson.title}
              </p>
            )}
            {pct === 0 && nextLesson && (
              <p className="body-sm" style={{ marginTop: 8 }}>
                Начните с первого урока ↓
              </p>
            )}
          </div>
        )}

        <hr className="rule" style={{ marginBottom: 32 }} />

        {/* Lessons */}
        {course.lessons.length === 0 ? (
          <p className="body-sm" style={{ padding: '32px 0' }}>Уроки ещё не добавлены.</p>
        ) : (
          <LessonList
            lessons={course.lessons}
            completedIds={[...completedIds]}
          />
        )}
      </main>
    </div>
  )
}
