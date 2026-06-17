import { createClient } from '@/lib/supabase/server'
import type { NoteLink, NoteWithTags, Tag } from '@/types'

export async function getNotes(userId: string): Promise<NoteWithTags[]> {
  const supabase = await createClient()

  const { data, error } = await (supabase as any)
    .from('notes')
    .select('*, note_tags(note_id, tag_id, created_at, tags(*))')
    .eq('user_id', userId)
    .order('updated_at', { ascending: false })

  if (error || !data) return []

  return data.map((note: any): NoteWithTags => {
    const { note_tags: rawNoteTags, ...noteFields } = note
    const tags: Tag[] = (rawNoteTags ?? [])
      .map((nt: any) => nt.tags)
      .filter(Boolean)
    return { ...noteFields, tags }
  })
}

export async function getNoteLinks(userId: string): Promise<NoteLink[]> {
  const supabase = await createClient()

  const { data, error } = await (supabase as any)
    .from('note_links')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error || !data) return []
  return data as NoteLink[]
}
