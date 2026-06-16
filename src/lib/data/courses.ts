import { createClient } from '@/lib/supabase/server'
import type { Course, Lesson, LessonProgress } from '@/types'

type CourseWithLessons = Course & { lessons: Lesson[] }

export async function getPublishedCourses(): Promise<Course[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('courses')
    .select('*')
    .eq('is_published', true)
    .order('created_at', { ascending: false })

  if (error || !data) return []
  return data as Course[]
}

export async function getCourseWithLessons(courseId: string): Promise<CourseWithLessons | null> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('courses')
    .select('*, lessons(*)')
    .eq('id', courseId)
    .eq('is_published', true)
    .order('order_index', { referencedTable: 'lessons', ascending: true })
    .single()

  if (error || !data) return null
  return data as unknown as CourseWithLessons
}

export async function getUserCourseProgress(
  userId: string,
  courseId: string
): Promise<LessonProgress[]> {
  const supabase = await createClient()

  const { data: lessons, error: lessonsError } = await supabase
    .from('lessons')
    .select('id')
    .eq('course_id', courseId)

  if (lessonsError || !lessons || lessons.length === 0) return []

  const typedLessons = lessons as unknown as { id: string }[]
  const lessonIds = typedLessons.map((lesson) => lesson.id)

  const { data, error } = await supabase
    .from('lesson_progress')
    .select('*')
    .eq('user_id', userId)
    .in('lesson_id', lessonIds)

  if (error || !data) return []
  return data as unknown as LessonProgress[]
}

export function calculateCourseProgress(
  totalLessons: number,
  completedLessons: number
): number {
  if (totalLessons === 0) return 0
  return Math.round((completedLessons / totalLessons) * 100)
}
