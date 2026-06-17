'use client'

import Link from 'next/link'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
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
      <div className="card-flat" style={{ width: '100%', maxWidth: 400, padding: '40px 36px', textAlign: 'center' }}>
        <p className="eyebrow" style={{ marginBottom: 12 }}>Ошибка</p>
        <h1 className="display-sm" style={{ marginBottom: 12 }}>Что-то пошло не так</h1>
        <p className="body-sm" style={{ marginBottom: 28, lineHeight: 1.7 }}>
          Произошла непредвиденная ошибка. Попробуйте обновить страницу.
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <button
            onClick={reset}
            className="btn btn-dark"
            style={{ width: '100%', justifyContent: 'center' }}
          >
            Попробовать снова
          </button>
          <Link
            href="/dashboard"
            className="btn btn-ghost"
            style={{ width: '100%', justifyContent: 'center' }}
          >
            На главную
          </Link>
        </div>
        {error.digest && (
          <p style={{ marginTop: 20, fontSize: 11, color: 'var(--ink-3)', fontFamily: 'monospace' }}>
            {error.digest}
          </p>
        )}
      </div>
    </div>
  )
}
