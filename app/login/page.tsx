'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true); setError('')
    const supabase = createClient()
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) { setError('Неверный email или пароль'); setLoading(false) }
    else { router.push('/dashboard'); router.refresh() }
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--paper)', display: 'flex', flexDirection: 'column' }}>
      {/* Top bar */}
      <div style={{ borderBottom: '1px solid var(--line)', height: 56, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Link href="/" style={{ textDecoration: 'none', fontFamily: 'Instrument Serif, serif', fontSize: 18, color: 'var(--ink)' }}>
          Mentoria Hub
        </Link>
      </div>

      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '48px 24px' }}>
        <div style={{ width: '100%', maxWidth: 380 }}>
          <h1 className="display-md" style={{ marginBottom: 8 }}>Войти</h1>
          <p className="body-sm" style={{ marginBottom: 36 }}>
            Нет аккаунта?{' '}
            <Link href="/register" style={{ color: 'var(--accent)', textDecoration: 'none', borderBottom: '1px solid var(--accent)' }}>
              Зарегистрироваться
            </Link>
          </p>

          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 500, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--ink3)', marginBottom: 6 }}>
                Email
              </label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} required
                className="input" placeholder="you@email.com" />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 500, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--ink3)', marginBottom: 6 }}>
                Пароль
              </label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} required
                className="input" placeholder="••••••••" />
            </div>

            {error && (
              <div style={{ background: '#fdf0e8', border: '1px solid #f5c4a0', borderRadius: 2, padding: '10px 14px', fontSize: 13, color: 'var(--warn)' }}>
                {error}
              </div>
            )}

            <button type="submit" disabled={loading} className="btn btn-dark" style={{ marginTop: 8, justifyContent: 'center', opacity: loading ? 0.6 : 1 }}>
              {loading ? 'Входим...' : 'Войти →'}
            </button>
          </form>

          <div style={{ marginTop: 32, padding: 16, background: 'var(--paper-2)', border: '1px solid var(--line)', borderRadius: 2 }}>
            <p className="eyebrow" style={{ marginBottom: 8 }}>Тестовые аккаунты</p>
            <p className="body-sm">Студент: student@test.com / password123</p>
            <p className="body-sm">Админ: admin@test.com / password123</p>
          </div>
        </div>
      </div>
    </div>
  )
}
