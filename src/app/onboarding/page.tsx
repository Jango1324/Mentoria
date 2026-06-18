'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import { saveOnboarding } from './actions'

const INTERESTS = [
  'STEM',
  'Business',
  'Programming',
  'Research',
  'Olympiad',
  'Scholarship',
  'SAT',
  'IELTS',
  'University',
]

export default function OnboardingPage() {
  const [fullName, setFullName] = useState('')
  const [grade, setGrade] = useState<number>(8)
  const [country, setCountry] = useState('')
  const [interests, setInterests] = useState<string[]>([])
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  function toggleInterest(interest: string) {
    setInterests((prev) =>
      prev.includes(interest)
        ? prev.filter((i) => i !== interest)
        : [...prev, interest]
    )
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)

    if (!fullName.trim()) {
      setError('Введите полное имя.')
      return
    }

    if (!country.trim()) {
      setError('Введите страну.')
      return
    }

    if (interests.length === 0) {
      setError('Выберите хотя бы один интерес.')
      return
    }

    startTransition(async () => {
      const result = await saveOnboarding({
        full_name: fullName.trim(),
        grade,
        country: country.trim(),
        interests,
      })

      if (result?.error) setError(result.error)
    })
  }

  return (
    <div style={{
      background: 'var(--paper)',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
    }}>

      {/* Logo */}
      <Link
        href="/"
        style={{
          fontFamily: 'Instrument Serif, serif',
          fontSize: 20,
          letterSpacing: '-0.01em',
          color: 'var(--ink)',
          textDecoration: 'none',
          marginBottom: 36,
        }}
      >
        Mentoria Hub
      </Link>

      {/* Card */}
      <div className="card-flat" style={{ width: '100%', maxWidth: 480, padding: '40px 36px' }}>

        {/* Header */}
        <p className="eyebrow" style={{ marginBottom: 10 }}>Шаг 1 из 1</p>
        <h1 className="display-sm" style={{ marginBottom: 6 }}>Расскажите о себе</h1>
        <p className="body-sm" style={{ marginBottom: 28 }}>
          Это поможет нам персонализировать вашу платформу.
        </p>

        {/* Error */}
        {error && (
          <div style={{
            background: 'var(--warning-bg)',
            border: '1px solid var(--warning-border)',
            color: 'var(--warn)',
            borderRadius: 4,
            padding: '10px 14px',
            fontSize: 13,
            marginBottom: 20,
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

          {/* Full name */}
          <div>
            <label
              htmlFor="fullName"
              style={{ display: 'block', fontSize: 13, fontWeight: 500, color: 'var(--ink-2)', marginBottom: 6 }}
            >
              Полное имя
            </label>
            <input
              id="fullName"
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Иван Иванов"
              className="input"
            />
          </div>

          {/* Grade */}
          <div>
            <label
              htmlFor="grade"
              style={{ display: 'block', fontSize: 13, fontWeight: 500, color: 'var(--ink-2)', marginBottom: 6 }}
            >
              Класс
            </label>
            <select
              id="grade"
              required
              value={grade}
              onChange={(e) => setGrade(Number(e.target.value))}
              className="input"
            >
              <option value={8}>8 класс</option>
              <option value={9}>9 класс</option>
              <option value={10}>10 класс</option>
              <option value={11}>11 класс</option>
            </select>
          </div>

          {/* Country */}
          <div>
            <label
              htmlFor="country"
              style={{ display: 'block', fontSize: 13, fontWeight: 500, color: 'var(--ink-2)', marginBottom: 6 }}
            >
              Страна
            </label>
            <input
              id="country"
              type="text"
              required
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              placeholder="Казахстан"
              className="input"
            />
          </div>

          {/* Interests — pill toggles */}
          <div>
            <p style={{ fontSize: 13, fontWeight: 500, color: 'var(--ink-2)', marginBottom: 10 }}>
              Интересы
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {INTERESTS.map((interest) => {
                const selected = interests.includes(interest)
                return (
                  <button
                    key={interest}
                    type="button"
                    onClick={() => toggleInterest(interest)}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      fontSize: 12,
                      fontWeight: 500,
                      letterSpacing: '0.02em',
                      padding: '6px 14px',
                      borderRadius: 100,
                      border: `1px solid ${selected ? 'var(--text-primary)' : 'var(--line)'}`,
                      background: selected ? 'var(--text-primary)' : 'var(--bg-raised)',
                      color: selected ? 'var(--text-inverse)' : 'var(--ink-2)',
                      cursor: 'pointer',
                      transition: 'all 0.15s',
                    }}
                  >
                    {interest}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isPending}
            className="btn btn-dark"
            style={{ width: '100%', justifyContent: 'center', marginTop: 4, opacity: isPending ? 0.6 : 1 }}
          >
            {isPending ? 'Сохранение...' : 'Продолжить'}
          </button>
        </form>
      </div>
    </div>
  )
}
