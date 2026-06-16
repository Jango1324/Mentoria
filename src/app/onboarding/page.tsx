'use client'

import { useState, useTransition } from 'react'
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

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    if (interests.length === 0) {
      setError('Please select at least one interest.')
      return
    }

    startTransition(async () => {
      const result = await saveOnboarding({
        full_name: fullName,
        grade,
        country,
        interests,
      })
      if (result?.error) setError(result.error)
    })
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12">
      <div className="w-full max-w-md bg-white rounded-lg shadow p-8">
        <h1 className="text-2xl font-semibold text-gray-900 mb-2">
          Tell us about yourself
        </h1>
        <p className="text-sm text-gray-500 mb-6">
          This helps us personalise your experience.
        </p>

        {error && (
          <p className="mb-4 text-sm text-red-600 bg-red-50 rounded p-3">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Full name */}
          <div>
            <label
              htmlFor="fullName"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Full name
            </label>
            <input
              id="fullName"
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Grade */}
          <div>
            <label
              htmlFor="grade"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Grade
            </label>
            <select
              id="grade"
              required
              value={grade}
              onChange={(e) => setGrade(Number(e.target.value))}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value={8}>Grade 8</option>
              <option value={9}>Grade 9</option>
              <option value={10}>Grade 10</option>
              <option value={11}>Grade 11</option>
            </select>
          </div>

          {/* Country */}
          <div>
            <label
              htmlFor="country"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Country
            </label>
            <input
              id="country"
              type="text"
              required
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Interests */}
          <div>
            <p className="block text-sm font-medium text-gray-700 mb-2">
              Interests
            </p>
            <div className="grid grid-cols-2 gap-2">
              {INTERESTS.map((interest) => (
                <label
                  key={interest}
                  className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={interests.includes(interest)}
                    onChange={() => toggleInterest(interest)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  {interest}
                </label>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="w-full bg-blue-600 text-white py-2 rounded text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
          >
            {isPending ? 'Saving...' : 'Continue'}
          </button>
        </form>
      </div>
    </div>
  )
}
