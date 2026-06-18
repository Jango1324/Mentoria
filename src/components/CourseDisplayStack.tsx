import Link from 'next/link'

const STACK_COURSES = [
  {
    category: 'Математика',
    emoji: '📐',
    title: 'Математика для олимпиад',
    desc: 'Теория чисел, комбинаторика, геометрия — задачи олимпийского уровня.',
    lessons: 4,
  },
  {
    category: 'Языки',
    emoji: '📚',
    title: 'Английский — IELTS/SAT',
    desc: 'Стратегии для высокого балла: грамматика, лексика, академическое эссе.',
    lessons: 4,
  },
  {
    category: 'Программирование',
    emoji: '🐍',
    title: 'Python для начинающих',
    desc: 'Алгоритмы, структуры данных и первые проекты на Python.',
    lessons: 4,
  },
]

export default function CourseDisplayStack() {
  return (
    <div className="dcs-outer">
      <div className="dcs-wrap">
        {STACK_COURSES.map((course, i) => (
          <Link key={course.title} href="/courses" className={`dcs-card dcs-card-${i}`}>

            {/* Header: sparkle ✦ + category badge + emoji */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              marginBottom: 16,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{
                  color: 'var(--accent)',
                  fontSize: 12,
                  lineHeight: 1,
                  opacity: 0.8,
                }}>
                  ✦
                </span>
                <span style={{
                  fontSize: 11,
                  fontWeight: 500,
                  letterSpacing: '0.09em',
                  textTransform: 'uppercase' as const,
                  color: 'rgba(150,170,255,0.82)',
                  background: 'rgba(79,106,245,0.14)',
                  padding: '3px 10px',
                  borderRadius: 100,
                  border: '1px solid rgba(79,106,245,0.22)',
                  fontFamily: 'Inter, sans-serif',
                }}>
                  {course.category}
                </span>
              </div>
              <span style={{ fontSize: 24, lineHeight: 1 }}>{course.emoji}</span>
            </div>

            {/* Title */}
            <h3 style={{
              fontFamily: 'Instrument Serif, serif',
              fontSize: 'clamp(17px, 1.8vw, 21px)',
              lineHeight: 1.2,
              letterSpacing: '-0.02em',
              color: '#EBEBEB',
              margin: '0 0 10px',
            }}>
              {course.title}
            </h3>

            {/* Description */}
            <p style={{
              fontSize: 13,
              color: 'rgba(235,235,235,0.44)',
              lineHeight: 1.62,
              fontFamily: 'Inter, sans-serif',
              margin: 0,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical' as const,
              overflow: 'hidden',
            }}>
              {course.desc}
            </p>

            {/* Spacer */}
            <div style={{ flex: 1 }} />

            {/* Footer divider */}
            <div style={{ height: 1, background: 'rgba(255,255,255,0.07)', margin: '16px 0 12px' }} />

            {/* Footer: lesson count + CTA */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{
                fontSize: 12,
                color: 'rgba(235,235,235,0.28)',
                fontFamily: 'Inter, sans-serif',
                letterSpacing: '0.02em',
              }}>
                {course.lessons} урока
              </span>
              <span style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 7,
                fontSize: 13,
                color: 'rgba(235,235,235,0.60)',
                fontFamily: 'Inter, sans-serif',
              }}>
                Начать курс
                <span style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 22,
                  height: 22,
                  borderRadius: '50%',
                  border: '1px solid rgba(235,235,235,0.18)',
                  fontSize: 11,
                  lineHeight: 1,
                  flexShrink: 0,
                }}>
                  →
                </span>
              </span>
            </div>

          </Link>
        ))}
      </div>
    </div>
  )
}
