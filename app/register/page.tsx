'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function RegisterPage() {
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true); setError('')
    const supabase = createClient()
    const { data, error: signUpError } = await supabase.auth.signUp({
      email: form.email, password: form.password,
      options: { data: { name: form.name } }
    })
    if (signUpError) { setError(signUpError.message); setLoading(false); return }
    if (data.user) {
      await supabase.from('profiles').upsert({ id: data.user.id, email: form.email, name: form.name, role: 'student' })
      router.push('/onboarding')
    }
  }

  const field = (label: string, key: keyof typeof form, type: string, placeholder: string) => (
    <div>
      <label style={{ display: 'block', fontSize: 12, fontWeight: 500, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--ink3)', marginBottom: 6 }}>
        {label}
      </label>
      <input type={type} value={form[key]} onChange={e => setForm({...form, [key]: e.target.value})} required
        className="input" placeholder={placeholder} minLength={key === 'password' ? 6 : undefined} />
    </div>
  )

  return (
    <div style={{ minHeight: '100vh', background: 'var(--paper)', display: 'flex', flexDirection: 'column' }}>
      <div style={{ borderBottom: '1px solid var(--line)', height: 56, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Link href="/" style={{ textDecoration: 'none', fontFamily: 'Instrument Serif, serif', fontSize: 18, color: 'var(--ink)' }}>
          Mentoria Hub
        </Link>
      </div>

      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '48px 24px' }}>
        <div style={{ width: '100%', maxWidth: 380 }}>
          <h1 className="display-md" style={{ marginBottom: 8 }}>Создать аккаунт</h1>
          <p className="body-sm" style={{ marginBottom: 36 }}>
            Уже есть аккаунт?{' '}
            <Link href="/login" style={{ color: 'var(--accent)', textDecoration: 'none', borderBottom: '1px solid var(--accent)' }}>
              Войти
            </Link>
          </p>

          <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {field('Имя', 'name', 'text', 'Айгерим Сейткали')}
            {field('Email', 'email', 'email', 'you@email.com')}
            {field('Пароль', 'password', 'password', 'Минимум 6 символов')}

            {error && (
              <div style={{ background: '#fdf0e8', border: '1px solid #f5c4a0', borderRadius: 2, padding: '10px 14px', fontSize: 13, color: 'var(--warn)' }}>
                {error}
              </div>
            )}

            <button type="submit" disabled={loading} className="btn btn-dark" style={{ marginTop: 8, justifyContent: 'center', opacity: loading ? 0.6 : 1 }}>
              {loading ? 'Регистрация...' : 'Создать аккаунт →'}
            </button>
          </form>

          <p style={{ fontSize: 11, color: 'var(--ink3)', marginTop: 20, lineHeight: 1.5 }}>
            Регистрируясь, вы соглашаетесь с правилами использования платформы.
          </p>
        </div>
      </div>
    </div>
  )
}
