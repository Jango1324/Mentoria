'use server'

import { createClient } from '@/lib/supabase/server'

export async function markLessonComplete(lessonId: string) {
  const supabase = await createClient()

  const { data: { user }, error: userError } = await supabase.auth.getUser()
  if (userError || !user) return { error: 'Not authenticated.' }

  const { error } = await supabase
    .from('lesson_progress')
    .upsert(
  [
    {
      user_id: user.id,
      lesson_id: lessonId,
      completed: true,
      completed_at: new Date().toISOString(),
    },
  ] as unknown as never[],
  { onConflict: 'user_id,lesson_id' }
)

  if (error) return { error: error.message }
  return { success: true }
}

export async function markLessonIncomplete(lessonId: string) {
  const supabase = await createClient()

  const { data: { user }, error: userError } = await supabase.auth.getUser()
  if (userError || !user) return { error: 'Not authenticated.' }

  const { error } = await supabase
    .from('lesson_progress')
    .update({ completed: false, completed_at: null } as never)
    .eq('user_id', user.id)
    .eq('lesson_id', lessonId)

  if (error) return { error: error.message }
  return { success: true }
}
