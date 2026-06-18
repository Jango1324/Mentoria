'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import { signIn, signInWithGoogle, signUp } from './actions'

export default function LoginPage() {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  function reset() {
    setError(null)
    setMessage(null)
  }

  function switchMode(next: 'signin' | 'signup') {
    reset()
    setMode(next)
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    reset()

    if (mode === 'signup' && password !== confirmPassword) {
      setError('Пароли не совпадают.')
      return
    }

    startTransition(async () => {
      const result =
        mode === 'signup'
          ? await signUp(email, password)
          : await signIn(email, password)

      if (result && 'error' in result && result.error) {
        setError(result.error)
      }

      if (result && 'message' in result && result.message) {
        setMessage(result.message)
      }
    })
  }

  function handleGoogle() {
    reset()
    startTransition(async () => {
      const result = await signInWithGoogle()
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
      <div className="card-flat" style={{ width: '100%', maxWidth: 400, padding: '40px 36px' }}>

        {/* Header */}
        <p className="eyebrow" style={{ marginBottom: 10 }}>
          {mode === 'signin' ? 'Вход' : 'Регистрация'}
        </p>
        <h1 className="display-sm" style={{ marginBottom: 28 }}>
          {mode === 'signin' ? 'Войти' : 'Создать аккаунт'}
        </h1>

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

        {/* Success */}
        {message && (
          <div style={{
            background: 'var(--positive-bg)',
            border: '1px solid var(--positive-border)',
            color: 'var(--success)',
            borderRadius: 4,
            padding: '10px 14px',
            fontSize: 13,
            marginBottom: 20,
          }}>
            {message}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <label
              htmlFor="email"
              style={{ display: 'block', fontSize: 13, fontWeight: 500, color: 'var(--ink-2)', marginBottom: 6 }}
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="student@example.com"
              className="input"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              style={{ display: 'block', fontSize: 13, fontWeight: 500, color: 'var(--ink-2)', marginBottom: 6 }}
            >
              Пароль
            </label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="input"
            />
          </div>

          {mode === 'signup' && (
            <div>
              <label
                htmlFor="confirmPassword"
                style={{ display: 'block', fontSize: 13, fontWeight: 500, color: 'var(--ink-2)', marginBottom: 6 }}
              >
                Подтвердить пароль
              </label>
              <input
                id="confirmPassword"
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="input"
              />
            </div>
          )}

          <button
            type="submit"
            disabled={isPending}
            className="btn btn-dark"
            style={{ width: '100%', justifyContent: 'center', marginTop: 4, opacity: isPending ? 0.6 : 1 }}
          >
            {isPending
              ? 'Загрузка...'
              : mode === 'signin'
                ? 'Войти'
                : 'Создать аккаунт'}
          </button>
        </form>

        {/* Divider */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '20px 0' }}>
          <hr className="rule" style={{ flex: 1 }} />
          <span style={{ fontSize: 11, color: 'var(--ink-3)', letterSpacing: '0.08em' }}>ИЛИ</span>
          <hr className="rule" style={{ flex: 1 }} />
        </div>

        {/* Google */}
        <button
          type="button"
          onClick={handleGoogle}
          disabled={isPending}
          className="btn btn-ghost"
          style={{ width: '100%', justifyContent: 'center', opacity: isPending ? 0.6 : 1 }}
        >
          Продолжить с Google
        </button>

        {/* Mode toggle */}
        <p style={{ marginTop: 24, textAlign: 'center', fontSize: 13, color: 'var(--ink-3)' }}>
          {mode === 'signin' ? (
            <>
              Нет аккаунта?{' '}
              <button
                type="button"
                onClick={() => switchMode('signup')}
                style={{
                  background: 'none',
                  border: 'none',
                  padding: 0,
                  cursor: 'pointer',
                  fontSize: 13,
                  color: 'var(--accent)',
                }}
              >
                Зарегистрироваться
              </button>
            </>
          ) : (
            <>
              Уже есть аккаунт?{' '}
              <button
                type="button"
                onClick={() => switchMode('signin')}
                style={{
                  background: 'none',
                  border: 'none',
                  padding: 0,
                  cursor: 'pointer',
                  fontSize: 13,
                  color: 'var(--accent)',
                }}
              >
                Войти
              </button>
            </>
          )}
        </p>
      </div>
    </div>
  )
}
