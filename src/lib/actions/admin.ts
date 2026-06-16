'use server'

import { createClient } from '@/lib/supabase/server'
import type { Opportunity, Course, Lesson } from '@/types'

type OpportunityInput = Omit<Opportunity, 'id' | 'created_at'>
type OpportunityUpdate = Partial<Omit<Opportunity, 'id' | 'created_at'>>
type CourseInput = Omit<Course, 'id' | 'created_at'>
type CourseUpdate = Partial<Omit<Course, 'id' | 'created_at'>>
type LessonInput = Omit<Lesson, 'id' | 'created_at'>
type LessonUpdate = Partial<Omit<Lesson, 'id' | 'created_at'>>

async function checkAdmin() {
  const supabase = await createClient()

  const { data: { user }, error: userError } = await supabase.auth.getUser()
  if (userError || !user) throw new Error('Unauthorized')

  const { data, error: profileError } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  const profile = data as unknown as { role: string } | null

  if (profileError || !profile || profile.role !== 'admin') {
    throw new Error('Unauthorized')
  }

  return { user, supabase }
}

// ── Opportunities ──────────────────────────────────────────

export async function createOpportunity(input: OpportunityInput) {
  try {
    const { supabase } = await checkAdmin()
    const { error } = await supabase
      .from('opportunities')
      .insert(input as unknown as never)
    if (error) return { error: error.message }
    return { success: true }
  } catch (err) {
    return { error: (err as Error).message }
  }
}

export async function updateOpportunity(id: string, input: OpportunityUpdate) {
  try {
    const { supabase } = await checkAdmin()
    const { error } = await supabase
      .from('opportunities')
      .update(input as unknown as never)
      .eq('id', id)
    if (error) return { error: error.message }
    return { success: true }
  } catch (err) {
    return { error: (err as Error).message }
  }
}

export async function deleteOpportunity(id: string) {
  try {
    const { supabase } = await checkAdmin()
    const { error } = await supabase
      .from('opportunities')
      .delete()
      .eq('id', id)
    if (error) return { error: error.message }
    return { success: true }
  } catch (err) {
    return { error: (err as Error).message }
  }
}

// ── Courses ────────────────────────────────────────────────

export async function createCourse(input: CourseInput) {
  try {
    const { supabase } = await checkAdmin()
    const { error } = await supabase
      .from('courses')
      .insert(input as unknown as never)
    if (error) return { error: error.message }
    return { success: true }
  } catch (err) {
    return { error: (err as Error).message }
  }
}

export async function updateCourse(id: string, input: CourseUpdate) {
  try {
    const { supabase } = await checkAdmin()
    const { error } = await supabase
      .from('courses')
      .update(input as unknown as never)
      .eq('id', id)
    if (error) return { error: error.message }
    return { success: true }
  } catch (err) {
    return { error: (err as Error).message }
  }
}

export async function deleteCourse(id: string) {
  try {
    const { supabase } = await checkAdmin()
    const { error } = await supabase
      .from('courses')
      .delete()
      .eq('id', id)
    if (error) return { error: error.message }
    return { success: true }
  } catch (err) {
    return { error: (err as Error).message }
  }
}

// ── Lessons ────────────────────────────────────────────────

export async function createLesson(input: LessonInput) {
  try {
    const { supabase } = await checkAdmin()
    const { error } = await supabase
      .from('lessons')
      .insert(input as unknown as never)
    if (error) return { error: error.message }
    return { success: true }
  } catch (err) {
    return { error: (err as Error).message }
  }
}

export async function updateLesson(id: string, input: LessonUpdate) {
  try {
    const { supabase } = await checkAdmin()
    const { error } = await supabase
      .from('lessons')
      .update(input as unknown as never)
      .eq('id', id)
    if (error) return { error: error.message }
    return { success: true }
  } catch (err) {
    return { error: (err as Error).message }
  }
}

export async function deleteLesson(id: string) {
  try {
    const { supabase } = await checkAdmin()
    const { error } = await supabase
      .from('lessons')
      .delete()
      .eq('id', id)
    if (error) return { error: error.message }
    return { success: true }
  } catch (err) {
    return { error: (err as Error).message }
  }
}
