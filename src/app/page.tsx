import Link from 'next/link'

const stats = [
  { num: '50+', label: 'возможностей' },
  { num: '10+', label: 'курсов' },
  { num: '500+', label: 'учеников' },
  { num: '15+', label: 'стран' },
]

const marqueeItems = [
  'Олимпиады', 'Хакатоны', 'Стипендии', 'Летние школы',
  'Исследования', 'Стажировки', 'Волонтёрство', 'Конкурсы',
  'SAT / IELTS', 'Поступление', 'STEM', 'Бизнес',
]

const features = [
  {
    num: '01',
    title: 'Каталог возможностей',
    desc: 'Олимпиады, хакатоны, стипендии и летние школы — с умными фильтрами по классу, направлению и дедлайну.',
    link: '/opportunities',
  },
  {
    num: '02',
    title: 'Асинхронные курсы',
    desc: 'Математика, английский, физика, программирование. Уроки, тесты, прогресс — без привязки к расписанию.',
    link: '/courses',
  },
  {
    num: '03',
    title: 'Личный кабинет',
    desc: 'Сохранённые возможности, дедлайны, прогресс по курсам — всё в одном месте.',
    link: '/dashboard',
  },
]

const courses = [
  { emoji: '📐', title: 'Математика для олимпиад', level: 'Продвинутый', lessons: 4 },
  { emoji: '📚', title: 'Английский — IELTS/SAT', level: 'Средний', lessons: 4 },
  { emoji: '🐍', title: 'Программирование Python', level: 'Начальный', lessons: 4 },
]

export default function HomePage() {
  const allMarquee = [...marqueeItems, ...marqueeItems]

  return (
    <div style={{ background: 'var(--paper)', minHeight: '100vh' }}>

      {/* ── NAV ─────────────────────────────────────── */}
      <nav style={{ borderBottom: '1px solid var(--line)', position: 'sticky', top: 0, background: 'var(--paper)', zIndex: 50 }}>
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 56 }}>
          <span style={{ fontFamily: 'Instrument Serif, serif', fontSize: 18, letterSpacing: '-0.01em', color: 'var(--ink)' }}>
            Mentoria Hub
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 28 }}>
            <Link href="/opportunities" className="nav-link hidden md:block">Возможности</Link>
            <Link href="/courses" className="nav-link hidden md:block">Курсы</Link>
            <Link href="/login" className="nav-link hidden md:block">Войти</Link>
            <Link href="/register" className="btn btn-dark" style={{ fontSize: 13 }}>Начать →</Link>
          </div>
        </div>
      </nav>

      {/* ── HERO ─────────────────────────────────────── */}
      <section style={{ padding: '80px 0 64px', borderBottom: '1px solid var(--line)' }}>
        <div className="container">
          <div className="fade-up">
            <p className="eyebrow" style={{ marginBottom: 20 }}>Образовательная платформа Mentoria</p>
            <h1 className="display" style={{ maxWidth: 760, marginBottom: 32 }}>
              Все<br />
              <span style={{ fontStyle: 'italic' }}>образовательные</span><br />
              возможности —<br />в одном месте
            </h1>
          </div>

          <div className="fade-up-2" style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 16, marginBottom: 56 }}>
            <p className="body-lg" style={{ maxWidth: 420 }}>
              Находи олимпиады, хакатоны и стипендии. Учись через структурированные курсы в своём темпе.
            </p>
          </div>

          <div className="fade-up-3" style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginBottom: 64 }}>
            <Link href="/register" className="btn btn-dark">Начать бесплатно</Link>
            <Link href="/opportunities" className="btn btn-ghost">Смотреть возможности</Link>
          </div>

          {/* Stats row */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 1, borderTop: '1px solid var(--line)', borderLeft: '1px solid var(--line)' }}>
            {stats.map(({ num, label }) => (
              <div key={label} style={{ padding: '24px 20px', borderRight: '1px solid var(--line)', borderBottom: '1px solid var(--line)' }}>
                <div style={{ fontFamily: 'Instrument Serif, serif', fontSize: 36, color: 'var(--ink)', lineHeight: 1 }}>{num}</div>
                <div className="eyebrow" style={{ marginTop: 6 }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── MARQUEE ─────────────────────────────────── */}
      <section style={{ borderBottom: '1px solid var(--line)', padding: '14px 0', overflow: 'hidden', background: 'var(--ink)' }}>
        <div className="marquee-wrap">
          <div className="marquee-track" style={{ gap: 0 }}>
            {allMarquee.map((item, i) => (
              <span key={i} style={{ display: 'inline-flex', alignItems: 'center', color: '#fff', fontSize: 12, fontWeight: 400, letterSpacing: '0.08em', padding: '0 28px', borderRight: '1px solid rgba(255,255,255,0.15)', whiteSpace: 'nowrap' }}>
                {item}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ─────────────────────────────────── */}
      <section style={{ padding: '80px 0', borderBottom: '1px solid var(--line)' }}>
        <div className="container">
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 24, marginBottom: 48, flexWrap: 'wrap' }}>
            <p className="eyebrow">Что внутри</p>
            <hr className="rule" style={{ flex: 1, minWidth: 60 }} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 1, border: '1px solid var(--line)' }}>
            {features.map(({ num, title, desc, link }) => (
              <div key={num} style={{ padding: '36px 32px', borderRight: '1px solid var(--line)', position: 'relative' }}>
                <div style={{ fontFamily: 'Instrument Serif, serif', fontSize: 13, color: 'var(--ink-3)', marginBottom: 24 }}>{num}</div>
                <h3 className="display-sm" style={{ marginBottom: 12 }}>{title}</h3>
                <p className="body-sm" style={{ marginBottom: 28, lineHeight: 1.7 }}>{desc}</p>
                <Link href={link} style={{ textDecoration: 'none', fontSize: 13, color: 'var(--ink)', borderBottom: '1px solid var(--ink)', paddingBottom: 1, display: 'inline-block' }}>
                  Перейти →
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ─────────────────────────────── */}
      <section style={{ padding: '80px 0', borderBottom: '1px solid var(--line)', background: 'var(--paper-2)' }}>
        <div className="container">
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 24, marginBottom: 48, flexWrap: 'wrap' }}>
            <p className="eyebrow">Как это работает</p>
            <hr className="rule" style={{ flex: 1, minWidth: 60 }} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 32 }}>
            {[
              { step: 'A', title: 'Создай профиль', desc: 'Укажи класс, интересы и цели за 2 минуты' },
              { step: 'B', title: 'Получи рекомендации', desc: 'Платформа подберёт возможности и курсы под тебя' },
              { step: 'C', title: 'Сохраняй', desc: 'Добавляй в избранное, следи за дедлайнами' },
              { step: 'D', title: 'Учись', desc: 'Проходи уроки, выполняй тесты, отслеживай прогресс' },
            ].map(({ step, title, desc }) => (
              <div key={step}>
                <div style={{ fontFamily: 'Instrument Serif, serif', fontSize: 48, color: 'var(--line)', lineHeight: 1, marginBottom: 16 }}>{step}</div>
                <h4 style={{ fontWeight: 500, fontSize: 16, marginBottom: 6, color: 'var(--ink)' }}>{title}</h4>
                <p className="body-sm">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── COURSES PREVIEW ──────────────────────────── */}
      <section style={{ padding: '80px 0', borderBottom: '1px solid var(--line)' }}>
        <div className="container">
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 24, marginBottom: 48, flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 24, flex: 1 }}>
              <p className="eyebrow">Курсы</p>
              <hr className="rule" style={{ flex: 1 }} />
            </div>
            <Link href="/courses" style={{ fontSize: 13, color: 'var(--ink-3)', textDecoration: 'none', borderBottom: '1px solid var(--line)', paddingBottom: 1, whiteSpace: 'nowrap' }}>
              Все курсы →
            </Link>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 20 }}>
            {courses.map(({ emoji, title, level, lessons }) => (
              <Link key={title} href="/courses" style={{ textDecoration: 'none' }}>
                <div className="card-flat" style={{ cursor: 'pointer' }}>
                  <div style={{ fontSize: 36, marginBottom: 20 }}>{emoji}</div>
                  <div style={{ display: 'flex', gap: 6, marginBottom: 12 }}>
                    <span className="tag">{level}</span>
                    <span className="tag">{lessons} урока</span>
                  </div>
                  <h3 style={{ fontFamily: 'Instrument Serif, serif', fontSize: 20, color: 'var(--ink)', lineHeight: 1.2, marginBottom: 12 }}>{title}</h3>
                  <p style={{ fontSize: 13, color: 'var(--ink-3)' }}>Записаться →</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────── */}
      <section style={{ padding: '100px 0', background: 'var(--ink)', color: '#fff' }}>
        <div className="container-sm" style={{ textAlign: 'center' }}>
          <p style={{ fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', marginBottom: 24 }}>
            Присоединись к Mentoria
          </p>
          <h2 style={{ fontFamily: 'Instrument Serif, serif', fontSize: 'clamp(2.5rem, 6vw, 5rem)', lineHeight: 1, letterSpacing: '-0.02em', color: '#fff', marginBottom: 32 }}>
            Начни своё<br />
            <span style={{ fontStyle: 'italic', color: 'rgba(255,255,255,0.6)' }}>академическое</span><br />
            путешествие
          </h2>
          <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.5)', marginBottom: 40, lineHeight: 1.6 }}>
            Ученики 8–11 классов из Казахстана и других стран
          </p>
          <Link href="/register" className="btn" style={{ background: '#fff', color: 'var(--ink)', fontSize: 14, padding: '13px 28px' }}>
            Создать аккаунт бесплатно
          </Link>
        </div>
      </section>

      {/* ── FOOTER ───────────────────────────────────── */}
      <footer style={{ borderTop: '1px solid var(--line)', padding: '28px 0' }}>
        <div className="container" style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
          <span style={{ fontFamily: 'Instrument Serif, serif', fontSize: 16, color: 'var(--ink)' }}>Mentoria Hub</span>
          <div style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
            <Link href="/opportunities" className="nav-link">Возможности</Link>
            <Link href="/courses" className="nav-link">Курсы</Link>
            <Link href="/login" className="nav-link">Войти</Link>
          </div>
          <p className="body-sm">mentoriaorganization@gmail.com</p>
        </div>
      </footer>
    </div>
  )
}
