'use client'

import { useState, useTransition, useRef, useMemo, useCallback } from 'react'
import type { NoteWithTags, NoteLink, Tag } from '@/types'
import {
  createNote,
  updateNote,
  updateNotePosition,
  deleteNote,
  upsertTag,
  addTagToNote,
  removeTagFromNote,
  createLink,
  deleteLink,
} from '@/lib/actions/vault'
import GraphView from './GraphView'
import LinkPanel from './LinkPanel'

interface Props {
  initialNotes: NoteWithTags[]
  initialLinks: NoteLink[]
}

function formatDate(iso: string): string {
  const diff = Math.floor((Date.now() - new Date(iso).getTime()) / 86400000)
  if (diff === 0) return 'Today'
  if (diff === 1) return 'Yesterday'
  if (diff < 7) return `${diff}d ago`
  return new Date(iso).toLocaleDateString('en', { month: 'short', day: 'numeric' })
}

export default function VaultClient({ initialNotes, initialLinks }: Props) {
  const [notes, setNotes] = useState<NoteWithTags[]>(initialNotes)
  const [links, setLinks] = useState<NoteLink[]>(initialLinks)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [view, setView] = useState<'editor' | 'graph'>('editor')
  const [query, setQuery] = useState('')
  const [activeTag, setActiveTag] = useState<string | null>(null)
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle')
  const [tagInput, setTagInput] = useState('')
  const [draftTitle, setDraftTitle] = useState('')
  const [draftContent, setDraftContent] = useState('')
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const [isPending, startTransition] = useTransition()

  const selectedNote = notes.find(n => n.id === selectedId) ?? null

  const allTags = useMemo(() => {
    const seen = new Set<string>()
    const result: Tag[] = []
    for (const note of notes) {
      for (const tag of note.tags) {
        if (!seen.has(tag.id)) { seen.add(tag.id); result.push(tag) }
      }
    }
    return result.sort((a, b) => a.name.localeCompare(b.name))
  }, [notes])

  const filteredNotes = useMemo(() =>
    notes
      .filter(n =>
        !query ||
        n.title.toLowerCase().includes(query.toLowerCase()) ||
        n.content.toLowerCase().includes(query.toLowerCase())
      )
      .filter(n => !activeTag || n.tags.some(t => t.name === activeTag))
  , [notes, query, activeTag])

  // ── Save ────────────────────────────────────────────────────────────────────

  function scheduleSave(id: string, title: string, content: string) {
    setSaveStatus('saving')
    if (saveTimer.current) clearTimeout(saveTimer.current)
    saveTimer.current = setTimeout(async () => {
      await updateNote(id, { title, content })
      setSaveStatus('saved')
      setTimeout(() => setSaveStatus('idle'), 1200)
    }, 900)
  }

  // ── Selection ───────────────────────────────────────────────────────────────

  function handleSelectNote(id: string) {
    const note = notes.find(n => n.id === id)
    setSelectedId(id)
    setDraftTitle(note?.title ?? '')
    setDraftContent(note?.content ?? '')
    setTagInput('')
    setSaveStatus('idle')
  }

  // ── Title / content ─────────────────────────────────────────────────────────

  function handleTitleChange(value: string) {
    if (!selectedId) return
    setDraftTitle(value)
    setNotes(prev => prev.map(n => n.id === selectedId ? { ...n, title: value } : n))
    scheduleSave(selectedId, value, draftContent)
  }

  function handleContentChange(value: string) {
    if (!selectedId) return
    setDraftContent(value)
    setNotes(prev => prev.map(n => n.id === selectedId ? { ...n, content: value } : n))
    scheduleSave(selectedId, draftTitle, value)
  }

  // ── Create / delete ─────────────────────────────────────────────────────────

  function handleCreate() {
    startTransition(async () => {
      const { data, error } = await createNote()
      if (error || !data) return
      const newNote: NoteWithTags = { ...data, tags: [] }
      setNotes(prev => [newNote, ...prev])
      setSelectedId(newNote.id)
      setDraftTitle('')
      setDraftContent('')
      setTagInput('')
      setSaveStatus('idle')
      setView('editor')
    })
  }

  function handleDelete() {
    if (!selectedId) return
    if (!window.confirm('Delete this note? This cannot be undone.')) return
    const id = selectedId
    startTransition(async () => {
      await deleteNote(id)
      setNotes(prev => prev.filter(n => n.id !== id))
      setLinks(prev => prev.filter(l => l.source_note_id !== id && l.target_note_id !== id))
      setSelectedId(prev => (prev === id ? null : prev))
    })
  }

  // ── Tags ────────────────────────────────────────────────────────────────────

  function handleAddTag(e: { key: string; preventDefault(): void }) {
    if (e.key !== 'Enter' || !tagInput.trim() || !selectedId) return
    e.preventDefault()
    const name = tagInput.trim().toLowerCase()
    const noteId = selectedId
    if (selectedNote?.tags.some(t => t.name === name)) {
      setTagInput('')
      return
    }
    setTagInput('')
    startTransition(async () => {
      const { data: tag, error } = await upsertTag(name)
      if (error || !tag) return
      await addTagToNote(noteId, tag.id)
      setNotes(prev => prev.map(n =>
        n.id === noteId ? { ...n, tags: [...n.tags, tag] } : n
      ))
    })
  }

  function handleRemoveTag(tagId: string) {
    if (!selectedId) return
    const noteId = selectedId
    startTransition(async () => {
      await removeTagFromNote(noteId, tagId)
      setNotes(prev => prev.map(n =>
        n.id === noteId ? { ...n, tags: n.tags.filter(t => t.id !== tagId) } : n
      ))
    })
  }

  // ── Links ───────────────────────────────────────────────────────────────────

  function handleAddLink(targetId: string) {
    if (!selectedId) return
    const sourceId = selectedId
    startTransition(async () => {
      const { data: link, error } = await createLink(sourceId, targetId)
      if (error || !link) return
      setLinks(prev => [...prev, link])
    })
  }

  function handleRemoveLink(linkId: string) {
    startTransition(async () => {
      await deleteLink(linkId)
      setLinks(prev => prev.filter(l => l.id !== linkId))
    })
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleSavePositions = useCallback((newPositions: Array<{ id: string; x: number; y: number }>) => {
    startTransition(async () => {
      await Promise.all(newPositions.map(p => updateNotePosition(p.id, p.x, p.y)))
      setNotes(prev => prev.map(n => {
        const p = newPositions.find(pos => pos.id === n.id)
        return p ? { ...n, pos_x: p.x, pos_y: p.y } : n
      }))
    })
  }, [])

  // ── Render ──────────────────────────────────────────────────────────────────

  const tabBtn = (v: 'editor' | 'graph') => ({
    padding: '5px 14px',
    fontSize: 10,
    fontWeight: 600,
    letterSpacing: '0.1em',
    background: view === v ? 'var(--ink)' : 'transparent',
    color: view === v ? '#fff' : 'var(--ink-3)',
    border: 'none',
    cursor: 'pointer' as const,
    fontFamily: 'Inter, sans-serif',
    transition: 'background 0.12s',
  })

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: '260px 1fr',
      height: 'calc(100vh - 56px)',
      overflow: 'hidden',
      background: 'var(--paper)',
    }}>

      {/* ── Sidebar ─────────────────────────────────────────────────────────── */}
      <aside style={{
        borderRight: '1px solid var(--line)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}>

        <div style={{ padding: '12px 14px', borderBottom: '1px solid var(--line)' }}>
          <input
            type="search"
            placeholder="Search…"
            value={query}
            onChange={e => setQuery(e.target.value)}
            className="input"
            style={{ fontSize: 13, padding: '7px 12px' }}
          />
        </div>

        {allTags.length > 0 && (
          <div style={{
            padding: '10px 14px',
            borderBottom: '1px solid var(--line)',
            display: 'flex',
            flexWrap: 'wrap',
            gap: 5,
          }}>
            {allTags.map(tag => {
              const active = activeTag === tag.name
              return (
                <button
                  key={tag.id}
                  onClick={() => setActiveTag(active ? null : tag.name)}
                  style={{
                    fontSize: 11,
                    fontWeight: 500,
                    letterSpacing: '0.02em',
                    padding: '3px 10px',
                    borderRadius: 100,
                    border: `1px solid ${active ? 'var(--ink)' : 'var(--line)'}`,
                    background: active ? 'var(--ink)' : '#fff',
                    color: active ? '#fff' : 'var(--ink-2)',
                    cursor: 'pointer',
                    transition: 'all 0.12s',
                    fontFamily: 'Inter, sans-serif',
                  }}
                >
                  {tag.name}
                </button>
              )
            })}
          </div>
        )}

        <div style={{ flex: 1, overflowY: 'auto' }}>
          {filteredNotes.length === 0 ? (
            <p style={{ padding: '28px 16px', fontSize: 13, color: 'var(--ink-3)', textAlign: 'center' }}>
              {query || activeTag ? 'No matches' : 'No notes yet'}
            </p>
          ) : (
            filteredNotes.map(note => (
              <button
                key={note.id}
                onClick={() => { handleSelectNote(note.id); setView('editor') }}
                style={{
                  width: '100%',
                  textAlign: 'left',
                  padding: '11px 14px',
                  background: selectedId === note.id ? 'var(--paper-2)' : 'transparent',
                  border: 'none',
                  borderBottom: '1px solid var(--line)',
                  cursor: 'pointer',
                  transition: 'background 0.1s',
                }}
              >
                <p style={{
                  fontSize: 13,
                  fontWeight: 500,
                  color: note.title ? 'var(--ink)' : 'var(--ink-3)',
                  lineHeight: 1.3,
                  marginBottom: 3,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}>
                  {note.title || 'Untitled'}
                </p>
                <p style={{ fontSize: 11, color: 'var(--ink-3)' }}>
                  {formatDate(note.updated_at)}
                </p>
              </button>
            ))
          )}
        </div>

        <div style={{ padding: '12px 14px', borderTop: '1px solid var(--line)' }}>
          <button
            onClick={handleCreate}
            disabled={isPending}
            className="btn btn-dark"
            style={{ width: '100%', justifyContent: 'center', fontSize: 13, opacity: isPending ? 0.6 : 1 }}
          >
            + New Note
          </button>
        </div>
      </aside>

      {/* ── Main ────────────────────────────────────────────────────────────── */}
      <main style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

        {/* Toolbar */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '0 40px',
          height: 48,
          borderBottom: '1px solid var(--line)',
          flexShrink: 0,
        }}>
          <div style={{
            display: 'inline-flex',
            border: '1px solid var(--line)',
            borderRadius: 3,
            overflow: 'hidden',
          }}>
            <button onClick={() => setView('editor')} style={tabBtn('editor')}>EDITOR</button>
            <button onClick={() => setView('graph')} style={tabBtn('graph')}>GRAPH</button>
          </div>

          {view === 'editor' && selectedNote && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
              <span style={{
                fontSize: 10,
                fontWeight: 600,
                letterSpacing: '0.1em',
                color: saveStatus === 'saved' ? 'var(--success)' : 'var(--ink-3)',
                opacity: saveStatus === 'idle' ? 0 : 1,
                transition: 'opacity 0.2s',
              }}>
                {saveStatus === 'saving' ? 'SAVING…' : 'SAVED'}
              </span>
              <button
                onClick={handleDelete}
                disabled={isPending}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: isPending ? 'default' : 'pointer',
                  fontSize: 10,
                  fontWeight: 600,
                  letterSpacing: '0.1em',
                  color: 'var(--ink-3)',
                  padding: '4px 0',
                  fontFamily: 'Inter, sans-serif',
                  opacity: isPending ? 0.4 : 1,
                }}
              >
                DELETE
              </button>
            </div>
          )}
        </div>

        {/* Content */}
        {view === 'graph' ? (
          <div style={{ flex: 1, overflow: 'hidden' }}>
            <GraphView
              notes={notes}
              links={links}
              selectedId={selectedId}
              onSelectNote={(id) => { handleSelectNote(id); setView('editor') }}
              onSavePositions={handleSavePositions}
            />
          </div>
        ) : selectedNote ? (
          <>
            <div style={{
              flex: 1,
              overflowY: 'auto',
              padding: '36px 40px 24px',
              display: 'flex',
              flexDirection: 'column',
            }}>
              <input
                type="text"
                value={draftTitle}
                onChange={e => handleTitleChange(e.target.value)}
                placeholder="Untitled"
                style={{
                  fontFamily: 'Instrument Serif, serif',
                  fontSize: 'clamp(1.5rem, 3vw, 2rem)',
                  lineHeight: 1.15,
                  letterSpacing: '-0.01em',
                  color: 'var(--ink)',
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                  width: '100%',
                  padding: 0,
                  marginBottom: 16,
                }}
              />

              <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: 6,
                alignItems: 'center',
                marginBottom: 24,
                minHeight: 24,
              }}>
                {selectedNote.tags.map(tag => (
                  <span
                    key={tag.id}
                    className="tag"
                    style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}
                  >
                    {tag.name}
                    <button
                      onClick={() => handleRemoveTag(tag.id)}
                      disabled={isPending}
                      aria-label={`Remove ${tag.name}`}
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
                ))}
                <input
                  type="text"
                  value={tagInput}
                  onChange={e => setTagInput(e.target.value)}
                  onKeyDown={handleAddTag}
                  placeholder={selectedNote.tags.length === 0 ? 'Add tag…' : '+'}
                  style={{
                    border: 'none',
                    outline: 'none',
                    background: 'transparent',
                    fontSize: 12,
                    color: 'var(--ink-2)',
                    fontFamily: 'Inter, sans-serif',
                    width: tagInput ? `${tagInput.length + 4}ch` : '60px',
                    minWidth: 36,
                  }}
                />
              </div>

              <hr className="rule" style={{ marginBottom: 24 }} />

              <textarea
                value={draftContent}
                onChange={e => handleContentChange(e.target.value)}
                placeholder="Start writing…"
                style={{
                  fontFamily: 'Inter, sans-serif',
                  fontSize: 15,
                  lineHeight: 1.75,
                  color: 'var(--ink-2)',
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                  resize: 'none',
                  width: '100%',
                  minHeight: '40vh',
                  padding: 0,
                }}
              />
            </div>

            <LinkPanel
              selectedNote={selectedNote}
              allNotes={notes}
              links={links}
              onAddLink={handleAddLink}
              onRemoveLink={handleRemoveLink}
              isPending={isPending}
            />
          </>
        ) : (
          <div style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 10,
          }}>
            <p style={{ fontSize: 32, lineHeight: 1, color: 'var(--line)' }}>◎</p>
            <p style={{ fontSize: 13, color: 'var(--ink-3)' }}>
              Select a note or create a new one
            </p>
          </div>
        )}

      </main>
    </div>
  )
}
