'use server'

// Server Actions for the Student Vault — notes, tags, and knowledge graph links.
import { createClient } from '@/lib/supabase/server'
import type { Note, NoteLink, Tag } from '@/types'

// Shared auth helper — all vault actions require an authenticated user.
async function getAuthUser() {
  const supabase = await createClient()
  const { data: { user }, error } = await supabase.auth.getUser()
  if (error || !user) return { supabase: null, user: null }
  return { supabase, user }
}

// ── Notes ─────────────────────────────────────────────────────────────────────

export async function createNote(): Promise<{ data?: Note; error?: string }> {
  const { supabase, user } = await getAuthUser()
  if (!supabase || !user) return { error: 'Not authenticated' }

  const { data, error } = await (supabase as any)
    .from('notes')
    .insert({ user_id: user.id, title: '', content: '' })
    .select()
    .single()

  if (error || !data) return { error: error?.message ?? 'Failed to create note' }
  return { data: data as Note }
}

export async function updateNote(
  id: string,
  fields: { title?: string; content?: string }
): Promise<{ error?: string }> {
  const { supabase, user } = await getAuthUser()
  if (!supabase || !user) return { error: 'Not authenticated' }

  const { error } = await (supabase as any)
    .from('notes')
    .update(fields)
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) return { error: error.message }
  return {}
}

// pos_x / pos_y store the node's position on the knowledge graph canvas.
export async function updateNotePosition(
  id: string,
  pos_x: number,
  pos_y: number
): Promise<{ error?: string }> {
  const { supabase, user } = await getAuthUser()
  if (!supabase || !user) return { error: 'Not authenticated' }

  const { error } = await (supabase as any)
    .from('notes')
    .update({ pos_x, pos_y })
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) return { error: error.message }
  return {}
}

export async function deleteNote(id: string): Promise<{ error?: string }> {
  const { supabase, user } = await getAuthUser()
  if (!supabase || !user) return { error: 'Not authenticated' }

  const { error } = await (supabase as any)
    .from('notes')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) return { error: error.message }
  return {}
}

// ── Tags ──────────────────────────────────────────────────────────────────────

export async function upsertTag(name: string): Promise<{ data?: Tag; error?: string }> {
  const { supabase, user } = await getAuthUser()
  if (!supabase || !user) return { error: 'Not authenticated' }

  const normalised = name.trim().toLowerCase()
  if (!normalised) return { error: 'Tag name is empty' }

  const { data, error } = await (supabase as any)
    .from('tags')
    .upsert(
      { user_id: user.id, name: normalised },
      { onConflict: 'user_id,name' }
    )
    .select()
    .single()

  if (error || !data) return { error: error?.message ?? 'Failed to upsert tag' }
  return { data: data as Tag }
}

export async function addTagToNote(
  noteId: string,
  tagId: string
): Promise<{ error?: string }> {
  const { supabase } = await getAuthUser()
  if (!supabase) return { error: 'Not authenticated' }

  const { error } = await (supabase as any)
    .from('note_tags')
    .upsert({ note_id: noteId, tag_id: tagId })

  if (error) return { error: error.message }
  return {}
}

export async function removeTagFromNote(
  noteId: string,
  tagId: string
): Promise<{ error?: string }> {
  const { supabase } = await getAuthUser()
  if (!supabase) return { error: 'Not authenticated' }

  const { error } = await (supabase as any)
    .from('note_tags')
    .delete()
    .eq('note_id', noteId)
    .eq('tag_id', tagId)

  if (error) return { error: error.message }
  return {}
}

// ── Links ─────────────────────────────────────────────────────────────────────

export async function createLink(
  sourceNoteId: string,
  targetNoteId: string
): Promise<{ data?: NoteLink; error?: string }> {
  const { supabase, user } = await getAuthUser()
  if (!supabase || !user) return { error: 'Not authenticated' }

  const { data, error } = await (supabase as any)
    .from('note_links')
    .insert({
      user_id: user.id,
      source_note_id: sourceNoteId,
      target_note_id: targetNoteId,
    })
    .select()
    .single()

  if (error || !data) return { error: error?.message ?? 'Failed to create link' }
  return { data: data as NoteLink }
}

export async function deleteLink(linkId: string): Promise<{ error?: string }> {
  const { supabase, user } = await getAuthUser()
  if (!supabase || !user) return { error: 'Not authenticated' }

  const { error } = await (supabase as any)
    .from('note_links')
    .delete()
    .eq('id', linkId)
    .eq('user_id', user.id)

  if (error) return { error: error.message }
  return {}
}
