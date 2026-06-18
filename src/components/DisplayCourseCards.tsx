import Link from 'next/link'

export type DisplayCourseCard = {
  title: string
  category: string
  description: string
  meta: string
  href?: string
}

type Props = {
  cards: DisplayCourseCard[]
}

export default function DisplayCourseCards({ cards }: Props) {
  const displayed = cards.slice(0, 3)

  return (
    <>
      <style>{`
        .dcc-outer {
          position: relative;
          width: min(720px, 100%);
          height: 430px;
          margin: 0 auto;
        }
        .dcc-card {
          position: absolute;
          width: 360px;
          height: 150px;
          border-radius: 18px;
          padding: 18px 22px 14px;
          background: rgba(18,19,29,0.78);
          border: 2px solid rgba(255,255,255,0.12);
          backdrop-filter: blur(14px);
          -webkit-backdrop-filter: blur(14px);
          box-shadow: 0 30px 80px rgba(0,0,0,0.45);
          color: rgba(255,255,255,0.9);
          overflow: hidden;
          box-sizing: border-box;
          text-decoration: none;
          display: flex;
          flex-direction: column;
          cursor: pointer;
          transition:
            left  0.45s cubic-bezier(0.16,1,0.3,1),
            top   0.45s cubic-bezier(0.16,1,0.3,1),
            opacity 0.45s cubic-bezier(0.16,1,0.3,1),
            box-shadow 0.45s ease;
        }
        /* Exact desktop positions as specified */
        .dcc-card-0 {
          left: 90px; top: 70px;
          transform: rotate(-8deg) skewY(-6deg);
          opacity: 0.28;
          z-index: 1;
        }
        .dcc-card-1 {
          left: 150px; top: 135px;
          transform: rotate(-6deg) skewY(-6deg);
          opacity: 0.55;
          z-index: 2;
        }
        .dcc-card-2 {
          left: 220px; top: 200px;
          transform: rotate(-4deg) skewY(-6deg);
          opacity: 1;
          z-index: 3;
        }
        /* Hover: left/top shift per spec */
        .dcc-outer:hover .dcc-card-0 { left: 65px;  top: 55px;  }
        .dcc-outer:hover .dcc-card-1 { left: 145px; top: 120px; }
        .dcc-outer:hover .dcc-card-2 {
          left: 235px; top: 190px;
          box-shadow:
            0 40px 100px rgba(0,0,0,0.55),
            0 0 0 1px rgba(79,106,245,0.30),
            inset 0 1px 0 rgba(255,255,255,0.10);
        }
        /* Mobile: disable overlap, flat vertical */
        @media (max-width: 700px) {
          .dcc-outer {
            height: auto;
            display: flex;
            flex-direction: column;
            gap: 14px;
            width: 100%;
          }
          .dcc-card {
            position: static !important;
            transform: none !important;
            opacity: 1 !important;
            width: 100%;
            height: auto;
          }
          .dcc-outer:hover .dcc-card-0,
          .dcc-outer:hover .dcc-card-1,
          .dcc-outer:hover .dcc-card-2 {
            left: auto !important;
            top: auto !important;
            opacity: 1 !important;
            box-shadow: 0 30px 80px rgba(0,0,0,0.45) !important;
          }
        }
      `}</style>

      <div className="dcc-outer">
        {displayed.map((card, i) => (
          <Link
            key={card.title}
            href={card.href ?? '/courses'}
            className={`dcc-card dcc-card-${i}`}
          >
            {/* Top row: circular sparkle icon + category */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: 8,
              marginBottom: 8, flexShrink: 0,
            }}>
              <span style={{
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                width: 26, height: 26, borderRadius: '50%',
                background: 'rgba(79,106,245,0.18)',
                border: '1px solid rgba(79,106,245,0.28)',
                fontSize: 11, color: 'rgba(150,170,255,0.9)', flexShrink: 0,
              }}>
                ✦
              </span>
              <span style={{
                fontSize: 10.5, fontWeight: 600, letterSpacing: '0.1em',
                textTransform: 'uppercase' as const,
                color: 'rgba(150,170,255,0.85)', fontFamily: 'Inter, sans-serif',
              }}>
                {card.category}
              </span>
            </div>

            {/* Title */}
            <h3 style={{
              fontFamily: 'Instrument Serif, serif',
              fontSize: 16, lineHeight: 1.25, letterSpacing: '-0.02em',
              color: 'rgba(235,235,235,0.95)', margin: '0 0 5px', flexShrink: 0,
            }}>
              {card.title}
            </h3>

            {/* Description — 1 line clamp to fit 150px card height */}
            <p style={{
              fontSize: 12, color: 'rgba(235,235,235,0.40)', lineHeight: 1.5,
              fontFamily: 'Inter, sans-serif', margin: 0, flexShrink: 0,
              display: '-webkit-box',
              WebkitLineClamp: 1,
              WebkitBoxOrient: 'vertical' as const,
              overflow: 'hidden',
            }}>
              {card.description}
            </p>

            {/* Flex spacer */}
            <div style={{ flex: 1 }} />

            {/* Bottom meta row */}
            <div style={{
              paddingTop: 8,
              borderTop: '1px solid rgba(255,255,255,0.06)',
              flexShrink: 0,
            }}>
              <span style={{
                fontSize: 11, color: 'rgba(235,235,235,0.28)',
                fontFamily: 'Inter, sans-serif', letterSpacing: '0.04em',
              }}>
                {card.meta}
              </span>
            </div>

            {/* Right-edge fade mask — exactly as specified */}
            <div style={{
              position: 'absolute',
              right: -4,
              top: '-5%',
              height: '110%',
              width: 160,
              background: 'linear-gradient(to left, var(--bg-base), transparent)',
              pointerEvents: 'none',
              zIndex: 1,
            }} />
          </Link>
        ))}
      </div>
    </>
  )
}
