import type { DNAType } from '@/types'

const AXES: DNAType[] = ['Explorer', 'Builder', 'Competitor', 'Researcher', 'Strategist', 'Creator']
const CX = 150
const CY = 150
const RADIUS = 75
const LABEL_R = 106
const LEVELS = 4

function angleAt(i: number) {
  return (Math.PI * 2 * i) / AXES.length - Math.PI / 2
}

function polar(r: number, i: number) {
  const a = angleAt(i)
  return { x: CX + r * Math.cos(a), y: CY + r * Math.sin(a) }
}

function ringPoints(r: number) {
  return AXES.map((_, i) => {
    const p = polar(r, i)
    return `${p.x.toFixed(2)},${p.y.toFixed(2)}`
  }).join(' ')
}

interface Props {
  scores: Record<DNAType, number>
  color: string
}

export default function RadarChart({ scores, color }: Props) {
  const max = Math.max(...Object.values(scores), 1)

  const dataPoints = AXES.map((type, i) => {
    const r = (scores[type] / max) * RADIUS
    const p = polar(r, i)
    return `${p.x.toFixed(2)},${p.y.toFixed(2)}`
  }).join(' ')

  return (
    <svg
      viewBox="0 0 300 300"
      width="100%"
      style={{ maxWidth: 280, display: 'block', margin: '0 auto' }}
      aria-label="Learning DNA score breakdown"
      role="img"
    >
      {/* Concentric grid rings */}
      {Array.from({ length: LEVELS }, (_, i) => (
        <polygon
          key={i}
          points={ringPoints(((i + 1) / LEVELS) * RADIUS)}
          fill="none"
          stroke="var(--line)"
          strokeWidth={1}
        />
      ))}

      {/* Axis spokes */}
      {AXES.map((_, i) => {
        const outer = polar(RADIUS, i)
        return (
          <line
            key={i}
            x1={CX} y1={CY}
            x2={outer.x.toFixed(2)} y2={outer.y.toFixed(2)}
            stroke="var(--line)"
            strokeWidth={1}
          />
        )
      })}

      {/* Score polygon */}
      <polygon
        points={dataPoints}
        fill={color}
        fillOpacity={0.12}
        stroke={color}
        strokeWidth={2}
        strokeLinejoin="round"
      />

      {/* Score dots */}
      {AXES.map((type, i) => {
        const r = (scores[type] / max) * RADIUS
        const p = polar(r, i)
        return (
          <circle key={type} cx={p.x.toFixed(2)} cy={p.y.toFixed(2)} r={3.5} fill={color} />
        )
      })}

      {/* Axis labels */}
      {AXES.map((type, i) => {
        const p = polar(LABEL_R, i)
        const anchor = p.x < CX - 8 ? 'end' : p.x > CX + 8 ? 'start' : 'middle'
        const baseline = p.y < CY - 8 ? 'auto' : p.y > CY + 8 ? 'hanging' : 'middle'
        return (
          <text
            key={type}
            x={p.x.toFixed(2)}
            y={p.y.toFixed(2)}
            textAnchor={anchor}
            dominantBaseline={baseline}
            fontSize={9.5}
            fontFamily="Inter, sans-serif"
            fontWeight={500}
            fill="var(--ink-3)"
            letterSpacing="0.08em"
          >
            {type.toUpperCase()}
          </text>
        )
      })}
    </svg>
  )
}
