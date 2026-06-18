import Link from 'next/link'
import ThemeToggle from '@/components/ThemeToggle'
import DisplayCourseCards from '@/components/DisplayCourseCards'

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


export default function HomePage() {
  const allMarquee = [...marqueeItems, ...marqueeItems]

  return (
    <div style={{ background: 'var(--paper)', minHeight: '100vh' }}>

      {/* ── HERO STYLES ─────────────────────────────── */}
      <style>{`
        @keyframes hFadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes hSlideUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .h-fade  { opacity: 0; animation: hFadeIn  0.65s ease both; }
        .h-up    { opacity: 0; animation: hSlideUp 0.75s cubic-bezier(0.16,1,0.3,1) both; }
        .h-d1 { animation-delay: 150ms; }
        .h-d2 { animation-delay: 380ms; }
        .h-d3 { animation-delay: 600ms; }
        .h-d4 { animation-delay: 800ms; }

        .h-pill-link {
          font-size: 13px;
          color: rgba(235,235,235,0.52);
          text-decoration: none;
          padding: 6px 13px;
          border-radius: 100px;
          letter-spacing: 0.01em;
          white-space: nowrap;
          transition: color 0.14s, background 0.14s;
        }
        .h-pill-link:hover {
          color: rgba(235,235,235,0.95);
          background: rgba(255,255,255,0.08);
        }
        .h-cta-main {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          background: #EBEBEB;
          color: #07070E;
          padding: 10px 12px 10px 22px;
          border-radius: 100px;
          font-size: 14px;
          font-weight: 500;
          text-decoration: none;
          letter-spacing: 0.01em;
          transition: opacity 0.14s;
        }
        .h-cta-main:hover { opacity: 0.87; }
        .h-cta-arrow {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 30px;
          height: 30px;
          border-radius: 50%;
          background: #07070E;
          color: #EBEBEB;
          font-size: 14px;
          line-height: 1;
          flex-shrink: 0;
        }

        /* Mobile overrides */
        @media (max-width: 720px) {
          .h-nav-links   { display: none !important; }
          .h-mobile-word { display: block !important; }
          .h-bottom-bar  { flex-direction: column !important; align-items: flex-start !important; gap: 28px !important; }
          .h-desc-col    { max-width: 100% !important; }
        }
        .h-mobile-word { display: none; }
      `}</style>

      {/* ── HERO ─────────────────────────────────────── */}
      <section style={{ padding: 12, background: 'var(--paper)' }}>

        {/* Rounded container — clips iframe and all layers */}
        <div style={{
          position: 'relative',
          borderRadius: 18,
          minHeight: 'calc(100vh - 24px)',
          background: '#07070E',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
        }}>

          {/* ── Layer 0: GIF background ─────────────
              To switch to local asset, change src to: /hero/mentoria-hero.gif
          */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://media.giphy.com/media/tLD05H89Sokz90GAhy/giphy.gif"
            alt=""
            aria-hidden
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: 'center',
              pointerEvents: 'none',
              zIndex: 0,
            }}
          />

          {/* ── Layer 1: Gradient overlay ───────────
              Top: dark for nav legibility
              Middle: lighter to let GIF breathe
              Bottom: heavy dark for wordmark contrast  */}
          <div style={{
            position: 'absolute',
            inset: 0,
            zIndex: 1,
            background: [
              'linear-gradient(to bottom,',
              '  rgba(4,4,11,0.62) 0%,',
              '  rgba(4,4,11,0.08) 30%,',
              '  rgba(4,4,11,0.08) 58%,',
              '  rgba(4,4,11,0.80) 82%,',
              '  rgba(4,4,11,0.94) 100%)',
            ].join(''),
            pointerEvents: 'none',
          }} />

          {/* ── Layer 2: Content ─────────────────────
              Uses flex column so bottom bar naturally
              sits at the bottom with margin-top: auto   */}
          <div style={{
            position: 'relative',
            zIndex: 10,
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
          }}>

            {/* ── Centered pill nav ─────────────── */}
            <nav className="h-fade h-d1" style={{
              display: 'flex',
              justifyContent: 'center',
              padding: '18px 20px',
              flexShrink: 0,
            }}>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 2,
                background: 'rgba(7,7,14,0.58)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: 100,
                padding: '5px 6px',
              }}>

                {/* Desktop links */}
                <div className="h-nav-links" style={{ display: 'flex', alignItems: 'center', gap: 0 }}>
                  <Link href="/opportunities" className="h-pill-link">Возможности</Link>
                  <Link href="/courses"       className="h-pill-link">Курсы</Link>
                  <Link href="/learning-dna"  className="h-pill-link">DNA</Link>
                  <Link href="/vault"         className="h-pill-link">Vault</Link>
                  <Link href="/login"         className="h-pill-link">Войти</Link>
                </div>

                {/* Mobile: wordmark replaces links */}
                <span className="h-mobile-word" style={{
                  fontFamily: 'Instrument Serif, serif',
                  fontSize: 15,
                  color: 'rgba(235,235,235,0.8)',
                  padding: '4px 10px',
                  letterSpacing: '-0.01em',
                }}>
                  Mentoria
                </span>

                {/* Always visible: toggle + CTA */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginLeft: 4 }}>
                  <ThemeToggle />
                  <Link href="/register" style={{
                    background: '#EBEBEB',
                    color: '#07070E',
                    padding: '7px 16px',
                    borderRadius: 100,
                    fontSize: 13,
                    fontWeight: 500,
                    textDecoration: 'none',
                    letterSpacing: '0.01em',
                    whiteSpace: 'nowrap',
                  }}>
                    Начать
                  </Link>
                </div>
              </div>
            </nav>

            {/* Flex spacer pushes bottom bar down */}
            <div style={{ flex: 1 }} />

            {/* ── Bottom bar ─────────────────────── */}
            <div className="h-bottom-bar" style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-end',
              padding: 'clamp(28px, 4vw, 52px)',
              gap: 32,
            }}>

              {/* Bottom-left: huge wordmark */}
              <div className="h-up h-d2" style={{ flexShrink: 0 }}>
                <h1 style={{
                  fontFamily: 'Instrument Serif, serif',
                  fontSize: 'clamp(4.5rem, 11vw, 11.5rem)',
                  lineHeight: 0.88,
                  letterSpacing: '-0.04em',
                  color: '#EBEBEB',
                  margin: 0,
                  display: 'flex',
                  alignItems: 'flex-start',
                }}>
                  Mentoria
                  <span style={{
                    fontSize: '0.26em',
                    lineHeight: 1,
                    marginTop: '0.12em',
                    marginLeft: '0.15em',
                    color: 'rgba(235,235,235,0.45)',
                    fontStyle: 'normal',
                    letterSpacing: 0,
                  }}>
                    ✦
                  </span>
                </h1>
              </div>

              {/* Bottom-right: description + CTA */}
              <div className="h-up h-d3 h-desc-col" style={{
                maxWidth: 360,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                gap: 22,
              }}>
                <p style={{
                  fontSize: 'clamp(13px, 1.35vw, 15px)',
                  color: 'rgba(235,235,235,0.5)',
                  lineHeight: 1.7,
                  fontFamily: 'Inter, sans-serif',
                  fontWeight: 400,
                  margin: 0,
                }}>
                  Mentoria Hub — это академическое пространство для учеников 8–11 классов: олимпиады, гранты, курсы, исследования и личный план развития в одном месте.
                </p>
                <Link href="/register" className="h-cta-main h-up h-d4">
                  Начать путь
                  <span className="h-cta-arrow">→</span>
                </Link>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* ── MARQUEE ─────────────────────────────────── */}
      <section style={{ borderBottom: '1px solid var(--line)', padding: '14px 0', overflow: 'hidden', background: 'var(--ink)' }}>
        <div className="marquee-wrap">
          <div className="marquee-track" style={{ gap: 0 }}>
            {allMarquee.map((item, i) => (
              <span key={i} style={{ display: 'inline-flex', alignItems: 'center', color: 'var(--text-inverse)', fontSize: 12, fontWeight: 400, letterSpacing: '0.08em', padding: '0 28px', borderRight: '1px solid var(--bg-base)', whiteSpace: 'nowrap' }}>
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
      <section style={{ padding: '96px 0', borderBottom: '1px solid var(--line)' }}>
        <div className="container">

          {/* Section eyebrow row */}
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 24, marginBottom: 64, flexWrap: 'wrap' }}>
            <p className="eyebrow">Курсы</p>
            <hr className="rule" style={{ flex: 1, minWidth: 60 }} />
          </div>

          {/* 2-column: left text / right stacked cards */}
          <div className="dcs-section-grid">

            {/* ── Left: section copy ──────────────── */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <p style={{
                fontSize: 11,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: 'var(--ink-3)',
                fontFamily: 'Inter, sans-serif',
              }}>
                Обучение
              </p>
              <h2 style={{
                fontFamily: 'Instrument Serif, serif',
                fontSize: 'clamp(2rem, 4vw, 3.25rem)',
                lineHeight: 1.05,
                letterSpacing: '-0.025em',
                color: 'var(--ink)',
                margin: 0,
              }}>
                Асинхронные курсы<br />
                <span style={{ fontStyle: 'italic', color: 'var(--ink-3)' }}>в своём темпе</span>
              </h2>
              <p style={{
                fontSize: 15,
                color: 'var(--ink-2)',
                lineHeight: 1.65,
                maxWidth: 360,
                fontFamily: 'Inter, sans-serif',
              }}>
                Структурированные программы для олимпийской подготовки, языков и программирования. Уроки, тесты, прогресс — без привязки к расписанию.
              </p>
              <Link href="/courses" style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                fontSize: 13,
                fontWeight: 500,
                color: 'var(--ink)',
                textDecoration: 'none',
                borderBottom: '1px solid var(--line)',
                paddingBottom: 2,
                width: 'fit-content',
                marginTop: 4,
                transition: 'border-color 0.15s',
              }}>
                Все курсы →
              </Link>
            </div>

            {/* ── Right: display-cards stack ─────────── */}
            <DisplayCourseCards
              cards={[
                {
                  title: 'Математика для олимпиад',
                  category: 'Математика',
                  description: 'Теория чисел, комбинаторика, геометрия — задачи олимпийского уровня.',
                  meta: '4 урока',
                },
                {
                  title: 'Английский — IELTS/SAT',
                  category: 'Языки',
                  description: 'Стратегии для высокого балла: грамматика, лексика, академическое эссе.',
                  meta: '4 урока',
                },
                {
                  title: 'Python для начинающих',
                  category: 'Программирование',
                  description: 'Алгоритмы, структуры данных и первые проекты на Python.',
                  meta: '4 урока',
                },
              ]}
            />

          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────── */}
      <section style={{ padding: '100px 0', background: 'var(--text-primary)', color: 'var(--text-inverse)' }}>
        <div className="container-sm" style={{ textAlign: 'center' }}>
          <p style={{ fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-inverse)', opacity: 0.45, marginBottom: 24 }}>
            Присоединись к Mentoria
          </p>
          <h2 style={{ fontFamily: 'Instrument Serif, serif', fontSize: 'clamp(2.5rem, 6vw, 5rem)', lineHeight: 1, letterSpacing: '-0.02em', color: 'var(--text-inverse)', marginBottom: 32 }}>
            Начни своё<br />
            <span style={{ fontStyle: 'italic', color: 'var(--text-inverse)', opacity: 0.55 }}>академическое</span><br />
            путешествие
          </h2>
          <p style={{ fontSize: 16, color: 'var(--text-inverse)', opacity: 0.55, marginBottom: 40, lineHeight: 1.6 }}>
            Ученики 8–11 классов из Казахстана и других стран
          </p>
          <Link href="/register" className="btn" style={{ background: 'var(--bg-raised)', color: 'var(--text-primary)', fontSize: 14, padding: '13px 28px' }}>
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
