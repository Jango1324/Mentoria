import Link from 'next/link'
import { signOut } from '@/app/login/actions'

interface Props {
  activePath?: string
}

export default function AppNav({ activePath }: Props) {
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
          href="/dashboard"
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
            href="/dashboard"
            className={`nav-link${activePath === '/dashboard' ? ' active' : ''}`}
          >
            Кабинет
          </Link>
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
