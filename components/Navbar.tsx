'use client'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useState } from 'react'

const links = [
  { href: '/opportunities', label: 'Возможности' },
  { href: '/courses', label: 'Курсы' },
  { href: '/dashboard', label: 'Кабинет' },
]

export default function Navbar({ isAdmin }: { isAdmin?: boolean }) {
  const pathname = usePathname()
  const router = useRouter()
  const [menuOpen, setMenuOpen] = useState(false)

  async function logout() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  return (
    <nav style={{ borderBottom: '1px solid var(--line)', background: 'var(--paper)', position: 'sticky', top: 0, zIndex: 50 }}>
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 56 }}>
        
        {/* Logo */}
        <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontFamily: 'Instrument Serif, serif', fontSize: 18, color: 'var(--ink)', letterSpacing: '-0.01em' }}>
            Mentoria Hub
          </span>
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex" style={{ alignItems: 'center', gap: 28 }}>
          {links.map(({ href, label }) => (
            <Link key={href} href={href}
              className={`nav-link ${pathname.startsWith(href) ? 'active' : ''}`}>
              {label}
            </Link>
          ))}
          {isAdmin && (
            <Link href="/admin" className={`nav-link ${pathname.startsWith('/admin') ? 'active' : ''}`}
              style={{ color: 'var(--accent)' }}>
              Админ
            </Link>
          )}
        </div>

        {/* Right side */}
        <div className="hidden md:flex" style={{ alignItems: 'center', gap: 12 }}>
          <button onClick={logout} className="nav-link" style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
            Выйти
          </button>
        </div>

        {/* Mobile burger */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden"
          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 5, width: 20 }}>
            <span style={{ display: 'block', height: 1, background: menuOpen ? 'transparent' : 'var(--ink)', transition: '0.2s' }} />
            <span style={{ display: 'block', height: 1, background: 'var(--ink)', transform: menuOpen ? 'rotate(45deg) translateY(3px)' : 'none', transition: '0.2s' }} />
            <span style={{ display: 'block', height: 1, background: 'var(--ink)', transform: menuOpen ? 'rotate(-45deg) translateY(-3px)' : 'none', transition: '0.2s' }} />
          </div>
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div style={{ borderTop: '1px solid var(--line)', background: 'var(--paper)' }}>
          <div className="container" style={{ paddingTop: 16, paddingBottom: 16, display: 'flex', flexDirection: 'column', gap: 4 }}>
            {links.map(({ href, label }) => (
              <Link key={href} href={href} onClick={() => setMenuOpen(false)}
                style={{ padding: '10px 0', borderBottom: '1px solid var(--line)', textDecoration: 'none', color: 'var(--ink)', fontSize: 15 }}>
                {label}
              </Link>
            ))}
            {isAdmin && (
              <Link href="/admin" onClick={() => setMenuOpen(false)}
                style={{ padding: '10px 0', borderBottom: '1px solid var(--line)', textDecoration: 'none', color: 'var(--accent)', fontSize: 15 }}>
                Панель администратора
              </Link>
            )}
            <button onClick={logout}
              style={{ padding: '10px 0', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', color: 'var(--ink3)', fontSize: 15, marginTop: 4 }}>
              Выйти →
            </button>
          </div>
        </div>
      )}
    </nav>
  )
}
