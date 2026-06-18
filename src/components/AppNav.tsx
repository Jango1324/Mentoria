import Link from 'next/link'
import { signOut } from '@/app/login/actions'
import ThemeToggle from './ThemeToggle'
import { createClient } from '@/lib/supabase/server'

interface Props {
  activePath?: string
}

export default async function AppNav({ activePath }: Props) {
  let isAdmin = false
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      const { data } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()
      isAdmin = (data as { role?: string } | null)?.role === 'admin'
    }
  } catch {
    // silently fail — no admin link shown
  }

  return (
    <nav style={{
      borderBottom: '1px solid var(--line)',
      position: 'sticky',
      top: 0,
      background: 'var(--paper)',
      zIndex: 50,
    }}>
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 56 }}>
        <Link
          href="/"
          style={{ fontFamily: 'Instrument Serif, serif', fontSize: 18, letterSpacing: '-0.01em', color: 'var(--ink)', textDecoration: 'none' }}
        >
          Mentoria Hub
        </Link>

        <div style={{ display: 'flex', alignItems: 'center', gap: 28 }}>
          <Link
            href="/opportunities"
            className={`nav-link${activePath === '/opportunities' ? ' active' : ''}`}
          >
            Возможности
          </Link>
          <Link
            href="/courses"
            className={`nav-link${activePath === '/courses' ? ' active' : ''}`}
          >
            Курсы
          </Link>
          <Link
            href="/learning-dna"
            className={`nav-link${activePath === '/learning-dna' ? ' active' : ''}`}
          >
            DNA
          </Link>
          <Link
            href="/vault"
            className={`nav-link${activePath === '/vault' ? ' active' : ''}`}
          >
            Vault
          </Link>
          <Link
            href="/dashboard"
            className={`nav-link${activePath === '/dashboard' ? ' active' : ''}`}
          >
            Кабинет
          </Link>

          {isAdmin && (
            <Link
              href="/admin"
              className={`nav-link${activePath === '/admin' ? ' active' : ''}`}
            >
              Admin
            </Link>
          )}

          <ThemeToggle />

          <form action={signOut} style={{ display: 'inline' }}>
            <button
              type="submit"
              className="btn btn-ghost"
              style={{ fontSize: 13, padding: '7px 16px' }}
            >
              Выйти
            </button>
          </form>
        </div>
      </div>
    </nav>
  )
}
