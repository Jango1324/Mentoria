'use client'

import { useMemo, useEffect, useRef } from 'react'
import type { NoteWithTags, NoteLink } from '@/types'

const W = 800
const H = 540
const NODE_R = 22
const PAD = 70
const ITER = 100

function sharedTagEdges(
  notes: NoteWithTags[],
  explicitPairs: Set<string>
): Array<{ s: string; t: string }> {
  const result: Array<{ s: string; t: string }> = []
  for (let i = 0; i < notes.length; i++) {
    for (let j = i + 1; j < notes.length; j++) {
      const pair = [notes[i].id, notes[j].id].sort().join('|')
      if (explicitPairs.has(pair)) continue
      const tagsA = new Set(notes[i].tags.map(t => t.id))
      if (notes[j].tags.some(t => tagsA.has(t.id))) {
        result.push({ s: notes[i].id, t: notes[j].id })
      }
    }
  }
  return result
}

function computeLayout(
  notes: NoteWithTags[],
  links: NoteLink[]
): Array<{ id: string; x: number; y: number }> {
  const n = notes.length
  if (n === 0) return []

  const k = Math.max(70, Math.sqrt((W * H) / n))
  const cx = W / 2
  const cy = H / 2
  const freeNodes = notes.filter(nd => nd.pos_x === null)

  const pos = notes.map(nd => {
    if (nd.pos_x !== null && nd.pos_y !== null) {
      return { id: nd.id, x: nd.pos_x, y: nd.pos_y, fixed: true }
    }
    const fi = freeNodes.findIndex(fn => fn.id === nd.id)
    const angle = (2 * Math.PI * fi) / Math.max(freeNodes.length, 1) - Math.PI / 2
    const r = Math.min(cx - PAD, cy - PAD) * 0.65
    return { id: nd.id, x: cx + r * Math.cos(angle), y: cy + r * Math.sin(angle), fixed: false }
  })

  const edges = links.map(l => ({ s: l.source_note_id, t: l.target_note_id }))
  const explicitPairs = new Set(edges.map(e => [e.s, e.t].sort().join('|')))
  const tagEdges = sharedTagEdges(notes, explicitPairs)

  for (let iter = 0; iter < ITER; iter++) {
    const step = 0.1 * (1 - iter / ITER) + 0.01
    const forceX = new Array(n).fill(0)
    const forceY = new Array(n).fill(0)

    for (let i = 0; i < n; i++) {
      for (let j = i + 1; j < n; j++) {
        const dx = pos[i].x - pos[j].x || 0.01
        const dy = pos[i].y - pos[j].y || 0.01
        const dist = Math.sqrt(dx * dx + dy * dy) || 0.01
        const f = (k * k) / dist
        const ux = dx / dist; const uy = dy / dist
        forceX[i] += ux * f; forceY[i] += uy * f
        forceX[j] -= ux * f; forceY[j] -= uy * f
      }
    }

    for (const e of edges) {
      const si = pos.findIndex(p => p.id === e.s)
      const ti = pos.findIndex(p => p.id === e.t)
      if (si === -1 || ti === -1) continue
      const dx = pos[ti].x - pos[si].x
      const dy = pos[ti].y - pos[si].y
      const dist = Math.sqrt(dx * dx + dy * dy) || 0.01
      const f = (dist * dist) / k
      const ux = dx / dist; const uy = dy / dist
      forceX[si] += ux * f; forceY[si] += uy * f
      forceX[ti] -= ux * f; forceY[ti] -= uy * f
    }

    // Weaker attraction for shared-tag pairs (pulls them loosely together)
    for (const e of tagEdges) {
      const si = pos.findIndex(p => p.id === e.s)
      const ti = pos.findIndex(p => p.id === e.t)
      if (si === -1 || ti === -1) continue
      const dx = pos[ti].x - pos[si].x
      const dy = pos[ti].y - pos[si].y
      const dist = Math.sqrt(dx * dx + dy * dy) || 0.01
      const f = (dist * dist) / k * 0.35
      const ux = dx / dist; const uy = dy / dist
      forceX[si] += ux * f; forceY[si] += uy * f
      forceX[ti] -= ux * f; forceY[ti] -= uy * f
    }

    for (let i = 0; i < n; i++) {
      if (pos[i].fixed) continue
      pos[i].x = Math.max(PAD, Math.min(W - PAD, pos[i].x + forceX[i] * step))
      pos[i].y = Math.max(PAD, Math.min(H - PAD, pos[i].y + forceY[i] * step))
    }
  }

  return pos.map(p => ({ id: p.id, x: p.x, y: p.y }))
}

function trunc(s: string, n: number) {
  return s.length > n ? s.slice(0, n - 1) + '…' : s
}

interface Props {
  notes: NoteWithTags[]
  links: NoteLink[]
  selectedId: string | null
  onSelectNote: (id: string) => void
  onSavePositions: (positions: Array<{ id: string; x: number; y: number }>) => void
}

export default function GraphView({ notes, links, selectedId, onSelectNote, onSavePositions }: Props) {
  const layoutKey = `${notes.length}-${links.length}`

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const positions = useMemo(() => computeLayout(notes, links), [layoutKey])

  const savedRef = useRef(false)

  useEffect(() => {
    if (savedRef.current) return
    const toSave = positions.filter(p => {
      const note = notes.find(n => n.id === p.id)
      return note?.pos_x === null
    })
    if (toSave.length > 0) {
      savedRef.current = true
      onSavePositions(toSave)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (notes.length === 0) {
    return (
      <div style={{
        flex: 1, height: '100%',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: 'var(--paper-2)',
      }}>
        <p style={{ fontSize: 13, color: 'var(--ink-3)' }}>No notes yet. Create one to see the graph.</p>
      </div>
    )
  }

  // Compute tag edges for rendering (recomputed on each render to reflect live tag state)
  const explicitPairSet = new Set(links.map(l => [l.source_note_id, l.target_note_id].sort().join('|')))
  const tagEdgesRender = sharedTagEdges(notes, explicitPairSet)

  const posMap = new Map(positions.map(p => [p.id, p]))

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      width="100%"
      height="100%"
      style={{ display: 'block' }}
    >
      <rect width={W} height={H} fill="var(--paper-2)" />

      {/* Dashed edges — shared tags (rendered first, under explicit links) */}
      <g>
        {tagEdgesRender.map(({ s, t }) => {
          const sp = posMap.get(s)
          const tp = posMap.get(t)
          if (!sp || !tp) return null
          return (
            <line
              key={`tag-${s}-${t}`}
              x1={sp.x} y1={sp.y} x2={tp.x} y2={tp.y}
              stroke="var(--ink-3)"
              strokeWidth={1}
              strokeDasharray="4 4"
              opacity={0.4}
            />
          )
        })}
      </g>

      {/* Solid edges — explicit note_links */}
      <g>
        {links.map(link => {
          const s = posMap.get(link.source_note_id)
          const t = posMap.get(link.target_note_id)
          if (!s || !t) return null
          return (
            <line
              key={link.id}
              x1={s.x} y1={s.y} x2={t.x} y2={t.y}
              stroke="var(--ink-3)"
              strokeWidth={1.5}
            />
          )
        })}
      </g>

      {/* Nodes */}
      <g>
        {notes.map((note, noteIdx) => {
          const p = posMap.get(note.id)
          if (!p) return null
          const sel = selectedId === note.id
          const floatDur = 4.5 + (noteIdx % 3) * 0.9
          const floatDelay = (noteIdx * 0.65) % 3.5
          return (
            <g
              key={note.id}
              onClick={() => onSelectNote(note.id)}
              style={{
                cursor: 'pointer',
                animation: `nodeFloat ${floatDur}s ease-in-out infinite`,
                animationDelay: `${floatDelay}s`,
              }}
            >
              {/* Soft halo for selected node */}
              {sel && (
                <circle
                  cx={p.x} cy={p.y} r={NODE_R + 11}
                  fill="none"
                  stroke="rgba(139,92,246,0.42)"
                  strokeWidth={2}
                  style={{ animation: 'nodeHalo 2.8s ease-in-out infinite' }}
                />
              )}
              <circle
                cx={p.x} cy={p.y} r={NODE_R}
                fill={sel ? 'rgba(139,92,246,0.82)' : 'rgba(79,70,229,0.14)'}
                stroke={sel ? 'rgba(167,139,250,1)' : 'rgba(139,92,246,0.62)'}
                strokeWidth={sel ? 2 : 1.5}
              />
              <text
                x={p.x}
                y={p.y + NODE_R + 11}
                textAnchor="middle"
                dominantBaseline="hanging"
                fontSize={9}
                fontFamily="Inter, sans-serif"
                fontWeight={sel ? 600 : 500}
                fill={sel ? 'rgba(167,139,250,0.95)' : 'rgba(139,92,246,0.72)'}
                letterSpacing="0.02em"
              >
                {trunc(note.title || 'Untitled', 18)}
              </text>
            </g>
          )
        })}
      </g>

      {/* Legend */}
      <g transform={`translate(20, ${H - 58})`}>
        <rect x={0} y={0} width={162} height={50} fill="var(--paper)" stroke="var(--line)" strokeWidth={0.8} rx={3} />
        <line x1={12} y1={17} x2={44} y2={17} stroke="var(--ink-3)" strokeWidth={1.5} />
        <text x={52} y={17} dominantBaseline="middle" fontSize={9} fontFamily="Inter, sans-serif" fill="var(--ink-3)" fontWeight={500}>
          Manual link
        </text>
        <line x1={12} y1={35} x2={44} y2={35} stroke="var(--ink-3)" strokeWidth={1} strokeDasharray="4 4" opacity={0.55} />
        <text x={52} y={35} dominantBaseline="middle" fontSize={9} fontFamily="Inter, sans-serif" fill="var(--ink-3)" fontWeight={500}>
          Shared tag
        </text>
      </g>
    </svg>
  )
}
