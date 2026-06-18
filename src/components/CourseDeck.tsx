'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'

export interface CourseDeckItem {
  id: string
  title: string
  category: string
  description?: string | null
  totalLessons: number
  completedLessons: number
  pct: number
}

interface Props {
  courses: CourseDeckItem[]
}

// Position slots: index 0 = back, 1 = middle, 2 = front
// offset = (courseIndex - frontIndex + N) % N
// offset 0 → front (slot 2), offset 1 → middle (slot 1), offset 2 → back (slot 0)
const SLOTS = [
  { left: 90,  top: 90,  opacity: 0.28, zIndex: 1, transform: 'rotate(-8deg) skewY(-6deg)' }, // back
  { left: 165, top: 160, opacity: 0.55, zIndex: 2, transform: 'rotate(-6deg) skewY(-6deg)' }, // middle
  { left: 240, top: 230, opacity: 1,    zIndex: 3, transform: 'rotate(-4deg) skewY(-6deg)' }, // front
]
const HIDDEN = { left: 90, top: 90, opacity: 0, zIndex: 0, transform: 'rotate(-8deg) skewY(-6deg)' }

function slotForOffset(offset: number) {
  if (offset === 0) return SLOTS[2]
  if (offset === 1) return SLOTS[1]
  if (offset === 2) return SLOTS[0]
  return HIDDEN
}

export default function CourseDeck({ courses }: Props) {
  const [frontIndex, setFrontIndex] = useState(0)
  const [isMobile, setIsMobile] = useState(false)
  const router = useRouter()
  const wrapperRef = useRef<HTMLDivElement>(null)
  const lastWheel = useRef(0)
  const n = courses.length

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= 700)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  const advance = useCallback((dir: 1 | -1) => {
    setFrontIndex(i => (i + dir + n) % n)
  }, [n])

  useEffect(() => {
    const el = wrapperRef.current
    if (!el || isMobile) return
    const onWheel = (e: WheelEvent) => {
      e.preventDefault()
      const now = Date.now()
      if (now - lastWheel.current < 360) return
      lastWheel.current = now
      advance(e.deltaY > 0 ? 1 : -1)
    }
    el.addEventListener('wheel', onWheel, { passive: false })
    return () => el.removeEventListener('wheel', onWheel)
  }, [advance, isMobile])

  function handleCardClick(courseIndex: number, offset: number) {
    if (isMobile || offset === 0) {
      router.push(`/courses/${courses[courseIndex].id}`)
    } else {
      setFrontIndex(courseIndex)
    }
  }

  return (
    <>
      <style>{`
        .cdeck-outer {
          position: relative;
          width: min(850px, 100%);
          height: 520px;
          margin: 0 auto;
        }
        .cdeck-card {
          position: absolute;
          width: 460px;
          height: 175px;
          border-radius: 18px;
          padding: 20px 26px 16px;
          background: rgba(18,19,29,0.78);
          border: 2px solid rgba(255,255,255,0.12);
          backdrop-filter: blur(14px);
          -webkit-backdrop-filter: blur(14px);
          box-shadow: 0 30px 80px rgba(0,0,0,0.45);
          color: rgba(255,255,255,0.9);
          overflow: hidden;
          box-sizing: border-box;
          display: flex;
          flex-direction: column;
          cursor: pointer;
          transition:
            left      0.45s cubic-bezier(0.16,1,0.3,1),
            top       0.45s cubic-bezier(0.16,1,0.3,1),
            opacity   0.45s cubic-bezier(0.16,1,0.3,1),
            transform 0.45s cubic-bezier(0.16,1,0.3,1),
            box-shadow 0.45s ease;
        }
        .cdeck-card[data-front="true"]:hover {
          box-shadow:
            0 42px 100px rgba(0,0,0,0.55),
            0 0 0 1px rgba(79,106,245,0.30),
            inset 0 1px 0 rgba(255,255,255,0.10);
        }
        .cdeck-card[data-front="false"]:hover {
          opacity: 0.85 !important;
        }
        /* Navigation dots */
        .cdeck-dot {
          border: none;
          padding: 0;
          cursor: pointer;
          height: 6px;
          border-radius: 100px;
          transition: width 0.3s ease, background 0.3s ease;
        }
        /* Scroll hint */
        .cdeck-hint {
          text-align: center;
          margin-top: 8px;
          font-size: 11px;
          color: var(--ink-3);
          letter-spacing: 0.05em;
          font-family: Inter, sans-serif;
          opacity: 0.6;
        }
        /* Mobile: flat vertical list */
        @media (max-width: 700px) {
          .cdeck-outer {
            height: auto;
            display: flex;
            flex-direction: column;
            gap: 14px;
          }
          .cdeck-card {
            position: static !important;
            transform: none !important;
            opacity: 1 !important;
            width: 100%;
            height: auto;
          }
          .cdeck-card[data-front="false"]:hover { opacity: 1 !important; }
          .cdeck-hint { display: none; }
        }
      `}</style>

      {/* Deck */}
      <div ref={wrapperRef} className="cdeck-outer" style={{ userSelect: 'none' }}>
        {courses.map((course, i) => {
          const offset = (i - frontIndex + n) % n
          const slot   = slotForOffset(offset)
          const isFront = offset === 0
          const isHidden = offset > 2

          return (
            <div
              key={course.id}
              className="cdeck-card"
              data-front={String(isFront)}
              style={{
                left:         slot.left,
                top:          slot.top,
                opacity:      slot.opacity,
                zIndex:       slot.zIndex,
                transform:    slot.transform,
                pointerEvents: isHidden ? 'none' : 'auto',
              }}
              onClick={() => handleCardClick(i, offset)}
            >
              {/* Top row: sparkle icon + category */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10, flexShrink: 0 }}>
                <span style={{
                  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                  width: 26, height: 26, borderRadius: '50%',
                  background: 'rgba(79,106,245,0.18)',
                  border: '1px solid rgba(79,106,245,0.28)',
                  fontSize: 11, color: 'rgba(150,170,255,0.9)', flexShrink: 0,
                }}>
                  ✦
                </span>
                <span style={{
                  fontSize: 10.5, fontWeight: 600, letterSpacing: '0.1em',
                  textTransform: 'uppercase' as const,
                  color: 'rgba(150,170,255,0.85)', fontFamily: 'Inter, sans-serif',
                }}>
                  {course.category}
                </span>
                {course.pct === 100 && (
                  <span style={{
                    fontSize: 10, fontWeight: 500, letterSpacing: '0.07em',
                    textTransform: 'uppercase' as const,
                    color: 'rgba(80,210,130,0.85)', background: 'rgba(40,180,100,0.12)',
                    padding: '2px 8px', borderRadius: 100,
                    border: '1px solid rgba(40,180,100,0.22)',
                    fontFamily: 'Inter, sans-serif',
                  }}>
                    Завершён
                  </span>
                )}
                {course.pct > 0 && course.pct < 100 && (
                  <span style={{
                    fontSize: 10, fontWeight: 500, letterSpacing: '0.07em',
                    textTransform: 'uppercase' as const,
                    color: 'rgba(150,170,255,0.82)', background: 'rgba(79,106,245,0.14)',
                    padding: '2px 8px', borderRadius: 100,
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
                fontSize: 18, lineHeight: 1.25, letterSpacing: '-0.02em',
                color: 'rgba(235,235,235,0.95)', margin: '0 0 6px', flexShrink: 0,
              }}>
                {course.title}
              </h3>

              {/* Description */}
              {course.description && (
                <p style={{
                  fontSize: 12.5, color: 'rgba(235,235,235,0.42)', lineHeight: 1.5,
                  fontFamily: 'Inter, sans-serif', margin: 0, flexShrink: 0,
                  display: '-webkit-box',
                  WebkitLineClamp: 1,
                  WebkitBoxOrient: 'vertical' as const,
                  overflow: 'hidden',
                }}>
                  {course.description}
                </p>
              )}

              {/* Spacer */}
              <div style={{ flex: 1 }} />

              {/* Footer: progress or lesson count */}
              <div style={{
                paddingTop: 10, borderTop: '1px solid rgba(255,255,255,0.07)',
                flexShrink: 0,
              }}>
                {course.pct > 0 ? (
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                      <span style={{ fontSize: 11, color: 'rgba(235,235,235,0.30)', fontFamily: 'Inter, sans-serif' }}>
                        {course.completedLessons} / {course.totalLessons} уроков
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
                ) : (
                  <span style={{ fontSize: 11, color: 'rgba(235,235,235,0.28)', fontFamily: 'Inter, sans-serif', letterSpacing: '0.04em' }}>
                    {course.totalLessons} уроков
                  </span>
                )}
              </div>

              {/* Right-edge fade mask */}
              <div style={{
                position: 'absolute', right: -4, top: '-5%',
                height: '110%', width: 160,
                background: 'linear-gradient(to left, var(--bg-base), transparent)',
                pointerEvents: 'none', zIndex: 1,
              }} />
            </div>
          )
        })}
      </div>

      {/* Navigation dots + counter */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, marginTop: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          {courses.map((_, i) => (
            <button
              key={i}
              className="cdeck-dot"
              onClick={() => setFrontIndex(i)}
              aria-label={`Go to course ${i + 1}`}
              style={{
                width: i === frontIndex ? 20 : 6,
                background: i === frontIndex ? 'var(--accent)' : 'var(--ink-3)',
              }}
            />
          ))}
        </div>
        <span style={{
          fontSize: 11, color: 'var(--ink-3)', fontFamily: 'Inter, sans-serif',
          letterSpacing: '0.06em',
        }}>
          {frontIndex + 1} / {n}
        </span>
      </div>

      <p className="cdeck-hint">scroll or click to browse</p>
    </>
  )
}
