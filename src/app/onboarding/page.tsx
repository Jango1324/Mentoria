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

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)

    if (!fullName.trim()) {
      setError('Please enter your full name.')
      return
    }

    if (!country.trim()) {
      setError('Please enter your country.')
      return
    }

    if (interests.length === 0) {
      setError('Please select at least one interest.')
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
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow">
        <h1 className="mb-2 text-2xl font-semibold text-gray-900">
          Tell us about yourself
        </h1>
        <p className="mb-6 text-sm text-gray-500">
          This helps us personalize your experience.
        </p>

        {error && (
          <p className="mb-4 rounded bg-red-50 p-3 text-sm text-red-600">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label
              htmlFor="fullName"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              Full name
            </label>
            <input
              id="fullName"
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Zhangir Meirbek"
              className="w-full rounded border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label
              htmlFor="grade"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              Grade
            </label>
            <select
              id="grade"
              required
              value={grade}
              onChange={(e) => setGrade(Number(e.target.value))}
              className="w-full rounded border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value={8}>Grade 8</option>
              <option value={9}>Grade 9</option>
              <option value={10}>Grade 10</option>
              <option value={11}>Grade 11</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="country"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              Country
            </label>
            <input
              id="country"
              type="text"
              required
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              placeholder="Kazakhstan"
              className="w-full rounded border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <p className="mb-2 block text-sm font-medium text-gray-700">
              Interests
            </p>
            <div className="grid grid-cols-2 gap-2">
              {INTERESTS.map((interest) => (
                <label
                  key={interest}
                  className="flex cursor-pointer items-center gap-2 text-sm text-gray-700"
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
            className="w-full rounded bg-blue-600 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {isPending ? 'Saving...' : 'Continue'}
          </button>
        </form>
      </div>
    </div>
  )
}