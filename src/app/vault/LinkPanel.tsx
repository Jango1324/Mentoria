'use client'

import { useState } from 'react'
import type { NoteWithTags, NoteLink } from '@/types'

interface Props {
  selectedNote: NoteWithTags
  allNotes: NoteWithTags[]
  links: NoteLink[]
  onAddLink: (targetId: string) => void
  onRemoveLink: (linkId: string) => void
  isPending: boolean
}

export default function LinkPanel({ selectedNote, allNotes, links, onAddLink, onRemoveLink, isPending }: Props) {
  const [targetId, setTargetId] = useState('')

  const noteLinks = links.filter(
    l => l.source_note_id === selectedNote.id || l.target_note_id === selectedNote.id
  )

  const linkedIds = new Set(noteLinks.map(l =>
    l.source_note_id === selectedNote.id ? l.target_note_id : l.source_note_id
  ))

  const available = allNotes.filter(n => n.id !== selectedNote.id && !linkedIds.has(n.id))

  function handleAdd() {
    if (!targetId) return
    onAddLink(targetId)
    setTargetId('')
  }

  return (
    <div style={{
      padding: '14px 40px',
      borderTop: '1px solid var(--line)',
      flexShrink: 0,
    }}>
      <p style={{
        fontSize: 10,
        fontWeight: 600,
        letterSpacing: '0.1em',
        color: 'var(--ink-3)',
        marginBottom: 10,
        fontFamily: 'Inter, sans-serif',
      }}>
        LINKED NOTES
      </p>

      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 6 }}>
        {noteLinks.length === 0 && (
          <span style={{ fontSize: 12, color: 'var(--ink-3)', fontFamily: 'Inter, sans-serif' }}>
            None.
          </span>
        )}

        {noteLinks.map(link => {
          const linkedId = link.source_note_id === selectedNote.id
            ? link.target_note_id
            : link.source_note_id
          const linked = allNotes.find(n => n.id === linkedId)
          if (!linked) return null
          return (
            <span
              key={link.id}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                padding: '3px 10px',
                borderRadius: 100,
                border: '1px solid var(--line)',
                background: 'var(--paper-2)',
                fontSize: 12,
                color: 'var(--ink-2)',
                fontFamily: 'Inter, sans-serif',
              }}
            >
              {linked.title || 'Untitled'}
              <button
                onClick={() => onRemoveLink(link.id)}
                disabled={isPending}
                aria-label="Remove link"
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: 'var(--ink-3)',
                  fontSize: 14,
                  lineHeight: 1,
                  padding: 0,
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                ×
              </button>
            </span>
          )
        })}

        {available.length > 0 && (
          <div style={{ display: 'flex', gap: 6, marginLeft: noteLinks.length > 0 ? 6 : 0 }}>
            <select
              value={targetId}
              onChange={e => setTargetId(e.target.value)}
              className="input"
              style={{ fontSize: 12, padding: '3px 8px', height: 28 }}
            >
              <option value="">+ Link note…</option>
              {available.map(n => (
                <option key={n.id} value={n.id}>{n.title || 'Untitled'}</option>
              ))}
            </select>
            <button
              onClick={handleAdd}
              disabled={!targetId || isPending}
              className="btn btn-dark"
              style={{ fontSize: 12, padding: '0 12px', height: 28 }}
            >
              Link
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
