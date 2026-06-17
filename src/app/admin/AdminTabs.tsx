'use client'

import { useState } from 'react'
import OpportunitiesManager from './OpportunitiesManager'
import CoursesManager from './CoursesManager'
import type { Opportunity, Course, Lesson } from '@/types'

type CourseWithLessons = Course & { lessons: Lesson[] }

interface Props {
  opportunities: Opportunity[]
  courses: CourseWithLessons[]
}

type Tab = 'opportunities' | 'courses'

export default function AdminTabs({ opportunities, courses }: Props) {
  const [tab, setTab] = useState<Tab>('opportunities')

  const tabs: { key: Tab; label: string; count: number }[] = [
    { key: 'opportunities', label: 'Возможности', count: opportunities.length },
    { key: 'courses', label: 'Курсы', count: courses.length },
  ]

  return (
    <div>
      {/* Tab bar */}
      <div style={{ display: 'flex', borderBottom: '1px solid var(--line)', marginBottom: 36 }}>
        {tabs.map(({ key, label, count }) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            style={{
              background: 'none',
              border: 'none',
              borderBottom: `2px solid ${tab === key ? 'var(--ink)' : 'transparent'}`,
              padding: '12px 20px',
              marginBottom: -1,
              fontSize: 13,
              fontWeight: 500,
              cursor: 'pointer',
              color: tab === key ? 'var(--ink)' : 'var(--ink-3)',
              transition: 'all 0.15s',
            }}
          >
            {label} · {count}
          </button>
        ))}
      </div>

      {tab === 'opportunities' && (
        <OpportunitiesManager opportunities={opportunities} />
      )}
      {tab === 'courses' && (
        <CoursesManager courses={courses} />
      )}
    </div>
  )
}
