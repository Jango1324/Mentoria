import Link from 'next/link'
import type React from 'react'

interface Props {
  href: string
  category: string
  title: string
  description?: string | null
  lessonCount: number
  completedLessons?: number
  pct?: number
  index?: number
}

export default function CourseGlassCard({
  href,
  category,
  title,
  description,
  lessonCount,
  completedLessons = 0,
  pct = 0,
  index = 0,
}: Props) {
  return (
    <Link
      href={href}
      className="cgc-card card-enter"
      style={{ '--i': index } as React.CSSProperties}
    >
      {/* Header: sparkle + category badge */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
        <span style={{
          color: 'var(--accent)',
          fontSize: 13,
          lineHeight: 1,
          opacity: 0.85,
          flexShrink: 0,
        }}>
          ✦
        </span>
        <span style={{
          fontSize: 11,
          fontWeight: 500,
          letterSpacing: '0.09em',
          textTransform: 'uppercase',
          color: 'rgba(150,170,255,0.82)',
          background: 'rgba(79,106,245,0.14)',
          padding: '3px 10px',
          borderRadius: 100,
          border: '1px solid rgba(79,106,245,0.22)',
          fontFamily: 'Inter, sans-serif',
          whiteSpace: 'nowrap',
        }}>
          {category}
        </span>
        {pct === 100 && (
          <span style={{
            fontSize: 11,
            fontWeight: 500,
            letterSpacing: '0.07em',
            textTransform: 'uppercase',
            color: 'rgba(80,210,130,0.85)',
            background: 'rgba(40,180,100,0.12)',
            padding: '3px 10px',
            borderRadius: 100,
            border: '1px solid rgba(40,180,100,0.22)',
            fontFamily: 'Inter, sans-serif',
          }}>
            Завершён
          </span>
        )}
        {pct > 0 && pct < 100 && (
          <span style={{
            fontSize: 11,
            fontWeight: 500,
            letterSpacing: '0.07em',
            textTransform: 'uppercase',
            color: 'rgba(150,170,255,0.82)',
            background: 'rgba(79,106,245,0.14)',
            padding: '3px 10px',
            borderRadius: 100,
            border: '1px solid rgba(79,106,245,0.22)',
            fontFamily: 'Inter, sans-serif',
          }}>
            В процессе
          </span>
        )}
      </div>

      {/* Title */}
      <h3 style={{
        fontFamily: 'Instrument Serif, serif',
        fontSize: 22,
        lineHeight: 1.2,
        letterSpacing: '-0.02em',
        color: '#EBEBEB',
        margin: '0 0 10px',
      }}>
        {title}
      </h3>

      {/* Description */}
      {description && (
        <p style={{
          fontSize: 13,
          color: 'rgba(235,235,235,0.45)',
          lineHeight: 1.65,
          fontFamily: 'Inter, sans-serif',
          margin: 0,
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
        }}>
          {description}
        </p>
      )}

      {/* Spacer pushes footer to bottom */}
      <div style={{ flex: 1 }} />

      {/* Progress bar (when started) */}
      {pct > 0 && (
        <div style={{ marginBottom: 14, marginTop: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 7 }}>
            <span style={{ fontSize: 12, color: 'rgba(235,235,235,0.32)', fontFamily: 'Inter, sans-serif' }}>
              {completedLessons} из {lessonCount} уроков
            </span>
            <span style={{ fontSize: 12, color: 'rgba(235,235,235,0.32)', fontFamily: 'Inter, sans-serif' }}>
              {pct}%
            </span>
          </div>
          <div style={{ height: 2, background: 'rgba(255,255,255,0.08)', borderRadius: 2 }}>
            <div style={{
              height: '100%',
              width: `${pct}%`,
              background: 'var(--accent)',
              borderRadius: 2,
              opacity: 0.8,
            }} />
          </div>
        </div>
      )}

      {/* Footer divider */}
      <div style={{ height: 1, background: 'rgba(255,255,255,0.07)', margin: `${pct > 0 ? 0 : 16}px 0 12px` }} />

      {/* Footer: lesson count + CTA */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{
          fontSize: 12,
          color: 'rgba(235,235,235,0.28)',
          fontFamily: 'Inter, sans-serif',
          letterSpacing: '0.02em',
        }}>
          {pct > 0 ? `${completedLessons} / ${lessonCount}` : `${lessonCount} уроков`}
        </span>
        <span style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 7,
          fontSize: 13,
          color: 'rgba(235,235,235,0.62)',
          fontFamily: 'Inter, sans-serif',
        }}>
          Начать курс
          <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 22,
            height: 22,
            borderRadius: '50%',
            border: '1px solid rgba(235,235,235,0.18)',
            fontSize: 11,
            lineHeight: 1,
            flexShrink: 0,
          }}>
            →
          </span>
        </span>
      </div>
    </Link>
  )
}
