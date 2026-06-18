'use client'

import { useEffect, useState } from 'react'
import { type Theme, getStoredTheme, applyTheme } from '@/lib/theme'

export default function ThemeToggle() {
  // Server-side default matches the inline script default ('system' = no attribute).
  // isDark is corrected from localStorage on mount — no hydration mismatch.
  const [isDark, setIsDark] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [isFocused, setIsFocused] = useState(false)

  useEffect(() => {
    const stored = getStoredTheme()
    setIsDark(stored === 'dark')
    setMounted(true)
  }, [])

  function toggle() {
    const next: Theme = isDark ? 'light' : 'dark'
    setIsDark(!isDark)
    applyTheme(next)
  }

  return (
    <button
      role="switch"
      aria-checked={isDark}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      onClick={toggle}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
      style={{
        // Pill shell
        position: 'relative',
        display: 'inline-flex',
        alignItems: 'center',
        flexShrink: 0,
        width: 56,
        height: 28,
        borderRadius: 100,
        border: `1.5px solid ${isDark ? 'transparent' : 'var(--border-base)'}`,
        background: isDark ? 'var(--accent)' : 'var(--bg-sunken)',
        cursor: 'pointer',
        padding: 0,

        // Focus ring
        outline: isFocused ? '2px solid var(--accent)' : 'none',
        outlineOffset: 3,

        // Mount fade-in — hides the 'false' initial render before useEffect fires
        opacity: mounted ? 1 : 0,
        transition: [
          'opacity 150ms ease',
          'background 240ms ease',
          'border-color 240ms ease',
          'outline-color 120ms ease',
        ].join(', '),
      }}
    >
      {/* ── ☀ Sun — left zone ───────────────────────────────── */}
      <span
        aria-hidden
        style={{
          position: 'absolute',
          left: 8,
          fontSize: 12,
          lineHeight: 1,
          // var(--text-primary) = #111 in light mode, #EBEBEB in dark mode.
          // Both contrast correctly with their respective knob/track backgrounds.
          color: 'var(--text-primary)',
          opacity: isDark ? 0.45 : 0.9,
          transition: 'opacity 240ms ease',
          pointerEvents: 'none',
          userSelect: 'none',
          // Sits above the knob so the icon is always readable
          zIndex: 2,
        }}
      >
        ☀
      </span>

      {/* ── ☾ Moon — right zone ─────────────────────────────── */}
      <span
        aria-hidden
        style={{
          position: 'absolute',
          right: 8,
          fontSize: 11,
          lineHeight: 1,
          color: 'var(--text-primary)',
          opacity: isDark ? 0.9 : 0.45,
          transition: 'opacity 240ms ease',
          pointerEvents: 'none',
          userSelect: 'none',
          zIndex: 2,
        }}
      >
        ☾
      </span>

      {/* ── Sliding knob ────────────────────────────────────── */}
      <span
        aria-hidden
        style={{
          position: 'absolute',
          top: 3,
          left: 3,
          width: 20,
          height: 20,
          borderRadius: '50%',
          // Light: bg-raised = #FFF (pops off cream track)
          // Dark:  text-inverse = #111 (pops off accent/indigo track)
          background: isDark ? 'var(--text-inverse)' : 'var(--bg-raised)',
          boxShadow: '0 1px 4px rgba(0,0,0,0.14)',
          // translateX(27px): knob ends at inner left:30px, right edge 50px, inner width 53px → 3px gap = symmetric
          transform: isDark ? 'translateX(27px)' : 'translateX(0)',
          transition: 'transform 260ms cubic-bezier(0.16, 1, 0.3, 1), background 240ms ease',
          pointerEvents: 'none',
          zIndex: 1,
        }}
      />
    </button>
  )
}
