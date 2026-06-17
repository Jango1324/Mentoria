'use client'

import type React from 'react'
import Link from 'next/link'
import type { LearningDNA, Opportunity, Course } from '@/types'
import { DNA_PROFILES, getDNARecommendedOpportunities, getDNARecommendedCourses } from '@/lib/data/dna'
import RadarChart from './RadarChart'

interface Props {
  dna: LearningDNA
  opportunities: Opportunity[]
  courses: Course[]
  onRetake?: () => void
}

export default function ResultView({ dna, opportunities, courses, onRetake }: Props) {
  const profile = DNA_PROFILES[dna.dna_type]
  const recommendedOpps = getDNARecommendedOpportunities(dna, opportunities).slice(0, 3)
  const recommendedCourses = getDNARecommendedCourses(dna, courses).slice(0, 3)

  return (
    <div className="fade-in">

      {/* Type header */}
      <div style={{ marginBottom: 40 }}>
        <div style={{
          display: 'inline-block',
          padding: '3px 10px',
          borderRadius: 2,
          background: profile.color + '18',
          border: `1px solid ${profile.color}44`,
          marginBottom: 16,
        }}>
          <span style={{
            fontSize: 10,
            fontWeight: 600,
            letterSpacing: '0.1em',
            color: profile.color,
            textTransform: 'uppercase',
            fontFamily: 'Inter, sans-serif',
          }}>
            Learning DNA
          </span>
        </div>
        <h1 className="display-sm" style={{ marginBottom: 14 }}>
          You are a {dna.dna_type}
        </h1>
        <p className="body-lg">
          {profile.description}
        </p>
      </div>

      {/* Radar chart */}
      <div
        className="card-flat"
        style={{ marginBottom: 20, padding: '28px 20px' }}
      >
        <p className="eyebrow" style={{ marginBottom: 24, textAlign: 'center' }}>Score breakdown</p>
        <RadarChart scores={dna.dna_score_breakdown} color={profile.color} />
      </div>

      {/* Strengths + Weaknesses */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 12,
          marginBottom: 32,
        }}
      >
        <div className="card-flat">
          <p className="eyebrow" style={{ marginBottom: 14 }}>Strengths</p>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10 }}>
            {profile.strengths.map((s) => (
              <li
                key={s}
                style={{ fontSize: 13, color: 'var(--ink-2)', lineHeight: 1.45 }}
              >
                {s}
              </li>
            ))}
          </ul>
        </div>
        <div className="card-flat">
          <p className="eyebrow" style={{ marginBottom: 14 }}>Watch for</p>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10 }}>
            {profile.weaknesses.map((w) => (
              <li
                key={w}
                style={{ fontSize: 13, color: 'var(--ink-2)', lineHeight: 1.45 }}
              >
                {w}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Recommended opportunities */}
      {recommendedOpps.length > 0 && (
        <section style={{ marginBottom: 28 }}>
          <p className="eyebrow" style={{ marginBottom: 14 }}>Opportunities for you</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {recommendedOpps.map((opp, i) => (
              <Link
                key={opp.id}
                href="/opportunities"
                style={{ textDecoration: 'none' }}
              >
                <div
                  className="card-flat card-enter"
                  style={{ '--i': i } as React.CSSProperties}
                >
                  <span className="tag" style={{ display: 'inline-block', marginBottom: 8 }}>
                    {opp.category}
                  </span>
                  <p style={{ fontSize: 14, fontWeight: 500, color: 'var(--ink)', lineHeight: 1.4 }}>
                    {opp.title}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Recommended courses */}
      {recommendedCourses.length > 0 && (
        <section style={{ marginBottom: 36 }}>
          <p className="eyebrow" style={{ marginBottom: 14 }}>Courses for you</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {recommendedCourses.map((course, i) => (
              <Link
                key={course.id}
                href={`/courses/${course.id}`}
                style={{ textDecoration: 'none' }}
              >
                <div
                  className="card-flat card-enter"
                  style={{ '--i': i + recommendedOpps.length } as React.CSSProperties}
                >
                  <span className="tag" style={{ display: 'inline-block', marginBottom: 8 }}>
                    {course.category}
                  </span>
                  <p style={{ fontSize: 14, fontWeight: 500, color: 'var(--ink)', lineHeight: 1.4 }}>
                    {course.title}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Retake */}
      {onRetake ? (
        <button
          onClick={onRetake}
          className="btn btn-ghost"
          style={{ fontSize: 13 }}
        >
          Retake quiz
        </button>
      ) : (
        <Link href="/learning-dna?retake=1" className="btn btn-ghost" style={{ fontSize: 13 }}>
          Retake quiz
        </Link>
      )}
    </div>
  )
}
