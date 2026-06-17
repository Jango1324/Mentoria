'use client'

import { useOptimistic, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { markLessonComplete, markLessonIncomplete } from '@/lib/actions/progress'
import type { Lesson } from '@/types'

interface Props {
  lessons: Lesson[]
  completedIds: string[]
}

export default function LessonList({ lessons, completedIds }: Props) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  const [optimisticCompleted, updateOptimistic] = useOptimistic(
    new Set(completedIds),
    (current: Set<string>, { action, id }: { action: 'complete' | 'undo'; id: string }) => {
      const next = new Set(current)
      if (action === 'complete') next.add(id)
      else next.delete(id)
      return next
    }
  )

  function toggleLesson(lessonId: string) {
    const isCompleted = optimisticCompleted.has(lessonId)
    startTransition(async () => {
      updateOptimistic({ action: isCompleted ? 'undo' : 'complete', id: lessonId })
      if (isCompleted) {
        await markLessonIncomplete(lessonId)
      } else {
        await markLessonComplete(lessonId)
      }
      router.refresh()
    })
  }

  const completedCount = optimisticCompleted.size

  return (
    <div>
      <p className="eyebrow" style={{ marginBottom: 20 }}>
        Уроки · {completedCount} из {lessons.length}
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {lessons.map((lesson, i) => {
          const done = optimisticCompleted.has(lesson.id)
          return (
            <div
              key={lesson.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 16,
                padding: '16px 20px',
                border: '1px solid var(--line)',
                borderRadius: 4,
                background: done ? 'var(--paper-2)' : '#fff',
                transition: 'background 0.2s',
              }}
            >
              {/* Circle indicator */}
              <div style={{
                width: 28,
                height: 28,
                borderRadius: '50%',
                border: `1.5px solid ${done ? 'var(--success)' : 'var(--line)'}`,
                background: done ? 'var(--success)' : 'transparent',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                fontSize: 12,
                fontWeight: 500,
                color: done ? '#fff' : 'var(--ink-3)',
                transition: 'all 0.2s',
              }}>
                {done ? '✓' : i + 1}
              </div>

              {/* Lesson info */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{
                  fontSize: 15,
                  fontWeight: 500,
                  color: done ? 'var(--ink-3)' : 'var(--ink)',
                  textDecoration: done ? 'line-through' : 'none',
                  lineHeight: 1.3,
                }}>
                  {lesson.title}
                </p>
                {lesson.content_url && (
                  <a
                    href={lesson.content_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ fontSize: 12, color: 'var(--accent)', textDecoration: 'none' }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    Открыть материал →
                  </a>
                )}
              </div>

              {/* Toggle button */}
              <button
                onClick={() => toggleLesson(lesson.id)}
                disabled={isPending}
                className={done ? 'btn btn-ghost' : 'btn btn-dark'}
                style={{ fontSize: 12, padding: '6px 14px', flexShrink: 0, opacity: isPending ? 0.6 : 1 }}
              >
                {done ? 'Отменить' : 'Завершить'}
              </button>
            </div>
          )
        })}
      </div>
    </div>
  )
}
