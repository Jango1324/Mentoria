import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getAllOpportunities } from '@/lib/data/opportunities'
import { getAllCourses, getCourseWithLessonsAdmin } from '@/lib/data/courses'
import AppNav from '@/components/AppNav'
import AdminTabs from './AdminTabs'
import type { Profile, Course, Lesson } from '@/types'

export type CourseWithLessons = Course & { lessons: Lesson[] }

export default async function AdminPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // Layer 2: role check — layer 1 is middleware, layer 3 is checkAdmin() in every action
  const { data } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  const profile = data as Pick<Profile, 'role'> | null
  if (!profile || profile.role !== 'admin') redirect('/dashboard')

  const [opportunities, courses] = await Promise.all([
    getAllOpportunities(),
    getAllCourses(),
  ])

  const coursesWithLessons: CourseWithLessons[] = await Promise.all(
    courses.map(async (course) => {
      const withLessons = await getCourseWithLessonsAdmin(course.id)
      return { ...course, lessons: withLessons?.lessons ?? [] }
    })
  )

  return (
    <div style={{ background: 'var(--paper)', minHeight: '100vh' }}>
      <AppNav />
      <main className="container" style={{ padding: '48px 24px' }}>
        <div style={{ marginBottom: 40 }}>
          <p className="eyebrow" style={{ marginBottom: 12 }}>Администратор</p>
          <h1 className="display-sm">Панель управления</h1>
        </div>
        <AdminTabs opportunities={opportunities} courses={coursesWithLessons} />
      </main>
    </div>
  )
}
