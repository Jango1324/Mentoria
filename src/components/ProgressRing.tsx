'use client'

import { useEffect, useState } from 'react'

interface Props {
  pct: number
  size?: number
}

export default function ProgressRing({ pct, size = 44 }: Props) {
  const [displayed, setDisplayed] = useState(0)

  useEffect(() => {
    const t = setTimeout(() => setDisplayed(pct), 80)
    return () => clearTimeout(t)
  }, [pct])

  const sw = 3
  const r = (size - sw * 2) / 2
  const circumference = 2 * Math.PI * r
  const offset = circumference * (1 - displayed / 100)
  const stroke = pct === 100 ? 'var(--success)' : 'var(--accent)'

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      style={{ flexShrink: 0, transform: 'rotate(-90deg)' }}
      aria-label={`${pct}%`}
    >
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--line)" strokeWidth={sw} />
      <circle
        cx={size / 2} cy={size / 2} r={r}
        fill="none"
        stroke={stroke}
        strokeWidth={sw}
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        style={{ transition: 'stroke-dashoffset 0.8s cubic-bezier(0.16,1,0.3,1), stroke 0.4s' }}
      />
    </svg>
  )
}
