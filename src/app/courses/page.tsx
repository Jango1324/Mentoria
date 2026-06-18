import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import CourseDeck from '@/components/CourseDeck'
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
          <CourseDeck courses={coursesWithProgress} />
        )}
      </main>
    </div>
  )
}
