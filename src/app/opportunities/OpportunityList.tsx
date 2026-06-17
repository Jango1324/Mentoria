'use client'

import { useState, useOptimistic, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { saveOpportunity, unsaveOpportunity } from '@/lib/actions/opportunities'
import type { Opportunity } from '@/types'

interface Props {
  opportunities: Opportunity[]
  recommended: Opportunity[]
  savedIds: string[]
  hasInterests: boolean
}

function getDeadlineInfo(deadline: string | null) {
  if (!deadline) return null
  const now = new Date()
  const d = new Date(deadline)
  const diffDays = Math.ceil((d.getTime() - now.getTime()) / 86400000)

  if (diffDays < 0) return { label: 'Дедлайн истёк', cls: 'tag', muted: true }
  if (diffDays === 0) return { label: 'Сегодня', cls: 'tag tag-warn', muted: false }
  if (diffDays <= 30) return { label: `${diffDays} дн.`, cls: 'tag tag-warn', muted: false }
  return {
    label: d.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' }),
    cls: 'tag',
    muted: false,
  }
}

function OpportunityCard({
  opp,
  saved,
  onToggle,
  pending,
  index,
}: {
  opp: Opportunity
  saved: boolean
  onToggle: () => void
  pending: boolean
  index: number
}) {
  const dl = getDeadlineInfo(opp.deadline)
  const [bouncing, setBouncing] = useState(false)

  function handleToggle() {
    setBouncing(true)
    setTimeout(() => setBouncing(false), 400)
    onToggle()
  }

  return (
    <div
      className="card-flat card-enter"
      style={{ '--i': index, display: 'flex', flexDirection: 'column', gap: 12, height: '100%' } as React.CSSProperties}
    >
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
        <span className="tag">{opp.category}</span>
        {dl && (
          <span className={dl.cls} style={dl.muted ? { opacity: 0.5 } : {}}>
            {dl.label}
          </span>
        )}
      </div>

      <h3 style={{
        fontFamily: 'Instrument Serif, serif',
        fontSize: 20,
        color: 'var(--ink)',
        lineHeight: 1.2,
      }}>
        {opp.title}
      </h3>

      {opp.description && (
        <p className="body-sm" style={{
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
        }}>
          {opp.description}
        </p>
      )}

      {opp.tags.length > 0 && (
        <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
          {opp.tags.slice(0, 4).map((tag) => (
            <span key={tag} className="tag" style={{ fontSize: 10 }}>{tag}</span>
          ))}
        </div>
      )}

      <div style={{ display: 'flex', gap: 8, marginTop: 'auto', paddingTop: 8 }}>
        {opp.url && (
          <a
            href={opp.url}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-ghost"
            style={{ fontSize: 12, padding: '7px 14px' }}
          >
            Открыть →
          </a>
        )}
        <button
          onClick={handleToggle}
          disabled={pending}
          className={`${saved ? 'btn btn-dark' : 'btn btn-ghost'}${bouncing ? ' btn-bounce' : ''}`}
          style={{ fontSize: 12, padding: '7px 14px', marginLeft: 'auto', opacity: pending ? 0.6 : 1 }}
        >
          {saved ? '✓ Сохранено' : 'Сохранить'}
        </button>
      </div>
    </div>
  )
}

export default function OpportunityList({ opportunities, recommended, savedIds, hasInterests }: Props) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  const [optimisticSaved, updateOptimistic] = useOptimistic(
    new Set(savedIds),
    (current: Set<string>, { action, id }: { action: 'save' | 'unsave'; id: string }) => {
      const next = new Set(current)
      if (action === 'save') next.add(id)
      else next.delete(id)
      return next
    }
  )

  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('')

  const categories = [...new Set(opportunities.map((o) => o.category))].sort()

  const filtered = opportunities.filter((opp) => {
    const matchSearch =
      search === '' || opp.title.toLowerCase().includes(search.toLowerCase())
    const matchCat = category === '' || opp.category === category
    return matchSearch && matchCat
  })

  function toggleSave(opp: Opportunity) {
    const isSaved = optimisticSaved.has(opp.id)
    startTransition(async () => {
      updateOptimistic({ action: isSaved ? 'unsave' : 'save', id: opp.id })
      if (isSaved) {
        await unsaveOpportunity(opp.id)
      } else {
        await saveOpportunity(opp.id)
      }
      router.refresh()
    })
  }

  const showRecommended =
    hasInterests && recommended.length > 0 && search === '' && category === ''

  return (
    <div>
      {/* Filter bar */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 40, flexWrap: 'wrap' }}>
        <input
          type="text"
          placeholder="Поиск по названию..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="input"
          style={{ maxWidth: 300 }}
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="input"
          style={{ maxWidth: 200 }}
        >
          <option value="">Все категории</option>
          {categories.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
        {(search || category) && (
          <button
            onClick={() => { setSearch(''); setCategory('') }}
            className="btn btn-ghost"
            style={{ fontSize: 13 }}
          >
            Сбросить
          </button>
        )}
      </div>

      {/* Recommended section */}
      {showRecommended && (
        <section style={{ marginBottom: 56 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 16, marginBottom: 24, flexWrap: 'wrap' }}>
            <p className="eyebrow">Рекомендуется для вас</p>
            <hr className="rule" style={{ flex: 1, minWidth: 40 }} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
            {recommended.map((opp, i) => (
              <OpportunityCard
                key={opp.id}
                opp={opp}
                saved={optimisticSaved.has(opp.id)}
                onToggle={() => toggleSave(opp)}
                pending={isPending}
                index={i}
              />
            ))}
          </div>
        </section>
      )}

      {/* All opportunities */}
      <section>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 16, marginBottom: 24, flexWrap: 'wrap' }}>
          <p className="eyebrow">
            {search || category ? 'Результаты поиска' : 'Все возможности'}
          </p>
          <hr className="rule" style={{ flex: 1, minWidth: 40 }} />
          <span className="body-sm">{filtered.length}</span>
        </div>

        {filtered.length === 0 ? (
          <div style={{ padding: '64px 0', textAlign: 'center' }}>
            <p className="body-sm">Ничего не найдено. Попробуйте другой фильтр.</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
            {filtered.map((opp, i) => (
              <OpportunityCard
                key={opp.id}
                opp={opp}
                saved={optimisticSaved.has(opp.id)}
                onToggle={() => toggleSave(opp)}
                pending={isPending}
                index={i}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
