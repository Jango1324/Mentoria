'use client'

import { useState, useTransition } from 'react'
import { QUIZ_QUESTIONS, calculateDNAType } from '@/lib/data/dna'
import { saveDNAResult } from '@/lib/actions/dna'
import type { LearningDNA, Opportunity, Course } from '@/types'
import ResultView from './ResultView'

interface Props {
  opportunities: Opportunity[]
  courses: Course[]
}

export default function QuizClient({ opportunities, courses }: Props) {
  const [questionIndex, setQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<number, number>>({})
  const [selected, setSelected] = useState<number | null>(null)
  const [result, setResult] = useState<LearningDNA | null>(null)
  const [isPending, startTransition] = useTransition()

  const total = QUIZ_QUESTIONS.length
  const question = QUIZ_QUESTIONS[questionIndex]
  const progress = (questionIndex / total) * 100

  function handleSelect(i: number) {
    if (!isPending) setSelected(i)
  }

  function handleNext() {
    if (selected === null || isPending) return

    const newAnswers = { ...answers, [question.id]: selected }
    setAnswers(newAnswers)

    if (questionIndex === total - 1) {
      startTransition(async () => {
        const { dnaType, breakdown } = calculateDNAType(newAnswers)
        await saveDNAResult(dnaType, breakdown)
        setResult({
          id: '',
          user_id: '',
          dna_type: dnaType,
          dna_score_breakdown: breakdown,
          completed_at: new Date().toISOString(),
          created_at: new Date().toISOString(),
        })
      })
    } else {
      const nextQuestion = QUIZ_QUESTIONS[questionIndex + 1]
      setQuestionIndex(questionIndex + 1)
      setSelected(newAnswers[nextQuestion.id] ?? null)
    }
  }

  function handleBack() {
    if (questionIndex === 0) return
    const prevQuestion = QUIZ_QUESTIONS[questionIndex - 1]
    setQuestionIndex(questionIndex - 1)
    setSelected(answers[prevQuestion.id] ?? null)
  }

  function handleRetake() {
    setResult(null)
    setQuestionIndex(0)
    setAnswers({})
    setSelected(null)
  }

  if (result) {
    return (
      <ResultView
        dna={result}
        opportunities={opportunities}
        courses={courses}
        onRetake={handleRetake}
      />
    )
  }

  return (
    <div style={{ maxWidth: 560 }}>

      {/* Progress bar */}
      <div className="progress" style={{ marginBottom: 44, borderRadius: 0 }}>
        <div
          className="progress-fill accent"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Question */}
      <div key={questionIndex} className="fade-up">

        <p className="eyebrow" style={{ marginBottom: 18 }}>
          {questionIndex + 1} of {total}
        </p>

        <h2
          style={{
            fontFamily: 'Instrument Serif, serif',
            fontSize: 'clamp(1.3rem, 3vw, 1.75rem)',
            lineHeight: 1.25,
            letterSpacing: '-0.01em',
            color: 'var(--ink)',
            marginBottom: 28,
          }}
        >
          {question.text}
        </h2>

        {/* Options */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 32 }}>
          {question.options.map((option, i) => {
            const isSelected = selected === i
            return (
              <button
                key={i}
                onClick={() => handleSelect(i)}
                disabled={isPending}
                style={{
                  textAlign: 'left',
                  padding: '15px 18px',
                  background: isSelected ? 'var(--ink)' : '#fff',
                  color: isSelected ? '#fff' : 'var(--ink)',
                  border: `1px solid ${isSelected ? 'var(--ink)' : 'var(--line)'}`,
                  borderRadius: 4,
                  fontSize: 14,
                  lineHeight: 1.5,
                  cursor: isPending ? 'default' : 'pointer',
                  transition: 'background 0.12s, color 0.12s, border-color 0.12s',
                  fontFamily: 'Inter, sans-serif',
                  fontWeight: 400,
                }}
              >
                {option.text}
              </button>
            )
          })}
        </div>

        {/* Navigation */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {questionIndex > 0 ? (
            <button
              onClick={handleBack}
              disabled={isPending}
              className="btn btn-ghost"
              style={{ fontSize: 13 }}
            >
              Back
            </button>
          ) : (
            <span />
          )}

          <button
            onClick={handleNext}
            disabled={selected === null || isPending}
            className="btn btn-dark"
            style={{
              fontSize: 13,
              opacity: selected === null || isPending ? 0.4 : 1,
              cursor: selected === null || isPending ? 'default' : 'pointer',
              transition: 'opacity 0.15s',
            }}
          >
            {isPending
              ? 'Calculating...'
              : questionIndex === total - 1
              ? 'See my DNA'
              : 'Next'}
          </button>
        </div>
      </div>
    </div>
  )
}
