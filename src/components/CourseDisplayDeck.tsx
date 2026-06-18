import Link from 'next/link'
import type React from 'react'

interface CourseItem {
  id: string
  title: string
  category: string
  description?: string | null
  totalLessons: number
  completedLessons: number
  pct: number
}

interface Props {
  courses: CourseItem[]
}

const ROTATIONS = [-1.1, 0.7, -0.8, 1.2, -0.5, 0.9, -1.3, 0.6]

export default function CourseDisplayDeck({ courses }: Props) {
  return (
    <>
      <style>{`
        .cdd-wrap {
          max-width: 660px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
        }
        .cdd-item {
          position: relative;
          margin-top: -18px;
          will-change: transform;
          transition: transform 0.35s cubic-bezier(0.16,1,0.3,1);
          transform: rotate(var(--cdd-rot, 0deg));
        }
        .cdd-item:first-child { margin-top: 0; }
        .cdd-item:hover {
          z-index: 20 !important;
          transform: translateY(-14px) rotate(0deg) !important;
        }
        .cdd-link {
          display: flex;
          flex-direction: column;
          background: rgba(18,19,29,0.82);
          border: 1px solid rgba(255,255,255,0.13);
          backdrop-filter: blur(14px);
          -webkit-backdrop-filter: blur(14px);
          box-shadow:
            0 18px 60px rgba(0,0,0,0.42),
            0 0 0 1px rgba(79,106,245,0.12),
            inset 0 1px 0 rgba(255,255,255,0.06);
          border-radius: 18px;
          padding: 24px 28px 20px;
          text-decoration: none;
          color: inherit;
          min-height: 160px;
          cursor: pointer;
          transition: box-shadow 0.35s ease;
        }
        .cdd-item:hover .cdd-link {
          box-shadow:
            0 36px 84px rgba(0,0,0,0.54),
            0 0 0 1px rgba(79,106,245,0.30),
            inset 0 1px 0 rgba(255,255,255,0.10);
        }
        @media (max-width: 640px) {
          .cdd-item {
            margin-top: 14px;
            transform: none !important;
          }
          .cdd-item:first-child { margin-top: 0; }
          .cdd-item:hover { transform: translateY(-4px) !important; }
        }
      `}</style>

      <div className="cdd-wrap">
        {courses.map((course, i) => {
          const rot = ROTATIONS[i % ROTATIONS.length]
          return (
            <div
              key={course.id}
              className="cdd-item"
              style={{
                '--cdd-rot': `${rot}deg`,
                zIndex: courses.length - i,
              } as React.CSSProperties}
            >
              <Link href={`/courses/${course.id}`} className="cdd-link">

                {/* Category + status badges */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
                  <span style={{ color: 'var(--accent)', fontSize: 12, opacity: 0.8, flexShrink: 0 }}>✦</span>
                  <span style={{
                    fontSize: 11, fontWeight: 500, letterSpacing: '0.09em',
                    textTransform: 'uppercase' as const,
                    color: 'rgba(150,170,255,0.82)',
                    background: 'rgba(79,106,245,0.14)',
                    padding: '3px 10px', borderRadius: 100,
                    border: '1px solid rgba(79,106,245,0.22)',
                    fontFamily: 'Inter, sans-serif',
                  }}>
                    {course.category}
                  </span>
                  {course.pct === 100 && (
                    <span style={{
                      fontSize: 11, fontWeight: 500, letterSpacing: '0.07em',
                      textTransform: 'uppercase' as const,
                      color: 'rgba(80,210,130,0.85)',
                      background: 'rgba(40,180,100,0.12)',
                      padding: '3px 10px', borderRadius: 100,
                      border: '1px solid rgba(40,180,100,0.22)',
                      fontFamily: 'Inter, sans-serif',
                    }}>
                      Завершён
                    </span>
                  )}
                  {course.pct > 0 && course.pct < 100 && (
                    <span style={{
                      fontSize: 11, fontWeight: 500, letterSpacing: '0.07em',
                      textTransform: 'uppercase' as const,
                      color: 'rgba(150,170,255,0.82)',
                      background: 'rgba(79,106,245,0.14)',
                      padding: '3px 10px', borderRadius: 100,
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
                  fontSize: 20, lineHeight: 1.22, letterSpacing: '-0.02em',
                  color: 'rgba(235,235,235,0.95)', margin: '0 0 10px',
                }}>
                  {course.title}
                </h3>

                {/* Description */}
                {course.description && (
                  <p style={{
                    fontSize: 13, color: 'rgba(235,235,235,0.42)', lineHeight: 1.62,
                    fontFamily: 'Inter, sans-serif', margin: 0,
                    display: '-webkit-box', WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical' as const, overflow: 'hidden',
                  }}>
                    {course.description}
                  </p>
                )}

                {/* Spacer */}
                <div style={{ flex: 1 }} />

                {/* Progress bar */}
                {course.pct > 0 && (
                  <div style={{ marginTop: 16 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                      <span style={{ fontSize: 11, color: 'rgba(235,235,235,0.30)', fontFamily: 'Inter, sans-serif' }}>
                        {course.completedLessons} из {course.totalLessons} уроков
                      </span>
                      <span style={{ fontSize: 11, color: 'rgba(235,235,235,0.30)', fontFamily: 'Inter, sans-serif' }}>
                        {course.pct}%
                      </span>
                    </div>
                    <div style={{ height: 2, background: 'rgba(255,255,255,0.08)', borderRadius: 2 }}>
                      <div style={{
                        height: '100%', width: `${course.pct}%`,
                        background: 'var(--accent)', borderRadius: 2, opacity: 0.8,
                      }} />
                    </div>
                  </div>
                )}

                {/* Footer divider + meta */}
                <div style={{
                  height: 1, background: 'rgba(255,255,255,0.07)',
                  margin: `${course.pct > 0 ? 12 : 16}px 0 12px`,
                }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: 12, color: 'rgba(235,235,235,0.28)', fontFamily: 'Inter, sans-serif' }}>
                    {course.pct > 0
                      ? `${course.completedLessons} / ${course.totalLessons} уроков`
                      : `${course.totalLessons} уроков`}
                  </span>
                  <span style={{
                    display: 'inline-flex', alignItems: 'center', gap: 7,
                    fontSize: 13, color: 'rgba(235,235,235,0.60)', fontFamily: 'Inter, sans-serif',
                  }}>
                    Начать курс
                    <span style={{
                      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                      width: 22, height: 22, borderRadius: '50%',
                      border: '1px solid rgba(235,235,235,0.18)', fontSize: 11, flexShrink: 0,
                    }}>→</span>
                  </span>
                </div>

              </Link>
            </div>
          )
        })}
      </div>
    </>
  )
}
