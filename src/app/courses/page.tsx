import type React from 'react'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import {
  getPublishedCourses,
  getCourseWithLessons,
  getUserCourseProgress,
  calculateCourseProgress,
} from '@/lib/data/courses'
import AppNav from '@/components/AppNav'

export default async function CoursesPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const courses = await getPublishedCourses()

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

  return (
    <div style={{ background: 'var(--paper)', minHeight: '100vh' }}>
      <AppNav activePath="/courses" />

      <main className="container" style={{ padding: '48px 24px' }}>
        <div style={{ marginBottom: 40 }}>
          <p className="eyebrow" style={{ marginBottom: 12 }}>Обучение</p>
          <h1 className="display-sm" style={{ marginBottom: 8 }}>Курсы</h1>
          <p className="body-sm">Асинхронные курсы в своём темпе</p>
        </div>

        {coursesWithProgress.length === 0 ? (
          <div style={{ padding: '64px 0', textAlign: 'center' }}>
            <p className="body-sm">Нет доступных курсов.</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 20 }}>
            {coursesWithProgress.map((course, i) => (
              <Link key={course.id} href={`/courses/${course.id}`} style={{ textDecoration: 'none' }}>
                <div
                  className="card-flat card-enter"
                  style={{
                    '--i': i,
                    cursor: 'pointer',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 12,
                  } as React.CSSProperties}
                >
                  {/* Badges */}
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                    <span className="tag">{course.category}</span>
                    {course.pct === 100 && (
                      <span className="tag tag-success">Завершён</span>
                    )}
                    {course.pct > 0 && course.pct < 100 && (
                      <span className="tag tag-accent">В процессе</span>
                    )}
                  </div>

                  {/* Title */}
                  <h3 style={{
                    fontFamily: 'Instrument Serif, serif',
                    fontSize: 20,
                    color: 'var(--ink)',
                    lineHeight: 1.2,
                  }}>
                    {course.title}
                  </h3>

                  {/* Description */}
                  {course.description && (
                    <p className="body-sm" style={{
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                    }}>
                      {course.description}
                    </p>
                  )}

                  {/* Progress */}
                  <div style={{ marginTop: 'auto', paddingTop: 8 }}>
                    {course.pct > 0 ? (
                      <>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                          <span className="body-sm">
                            {course.completedLessons} из {course.totalLessons} уроков
                          </span>
                          <span className="body-sm">{course.pct}%</span>
                        </div>
                        <div className="progress">
                          <div
                            className="progress-fill accent progress-fill-mount"
                            style={{ '--pct': `${course.pct}%`, '--i': i } as React.CSSProperties}
                          />
                        </div>
                      </>
                    ) : (
                      <p className="body-sm">{course.totalLessons} уроков</p>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
