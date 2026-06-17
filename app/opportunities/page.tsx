'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { OPPORTUNITIES, CATEGORIES, TAGS, GRADES } from '@/lib/data'
import Navbar from '@/components/Navbar'
import Link from 'next/link'

const catColors: Record<string, string> = {
  'Олимпиада': '#e8eeff', 'Хакатон': '#f0e8ff', 'Стипендия': '#e8f5ee',
  'Летняя школа': '#fff8e8', 'Конкурс': '#fde8f0', 'Исследования': '#e8f0ff',
  'Волонтёрство': '#fff0e8', 'Стажировка': '#e8fff5',
}
const catTextColors: Record<string, string> = {
  'Олимпиада': '#1a4fff', 'Хакатон': '#7c3aed', 'Стипендия': '#1a7a4a',
  'Летняя школа': '#b45309', 'Конкурс': '#be185d', 'Исследования': '#1e40af',
  'Волонтёрство': '#c94a00', 'Стажировка': '#065f46',
}

export default function OpportunitiesPage() {
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('Все')
  const [tag, setTag] = useState('Все')
  const [grade, setGrade] = useState('Все')
  const [savedIds, setSavedIds] = useState<string[]>([])
  const [userId, setUserId] = useState<string | null>(null)
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      setUserId(user.id)
      const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
      setIsAdmin(profile?.role === 'admin')
      const { data: saved } = await supabase.from('saved_opportunities').select('opportunity_id').eq('user_id', user.id)
      setSavedIds((saved || []).map((s: any) => s.opportunity_id))
    }
    load()
  }, [])

  async function toggleSave(oppId: string) {
    if (!userId) return
    const supabase = createClient()
    if (savedIds.includes(oppId)) {
      await supabase.from('saved_opportunities').delete().eq('user_id', userId).eq('opportunity_id', oppId)
      setSavedIds(savedIds.filter(id => id !== oppId))
    } else {
      await supabase.from('saved_opportunities').insert({ user_id: userId, opportunity_id: oppId })
      setSavedIds([...savedIds, oppId])
    }
  }

  const filtered = OPPORTUNITIES.filter(o => {
    const matchSearch = o.title.toLowerCase().includes(search.toLowerCase()) || o.description.toLowerCase().includes(search.toLowerCase())
    const matchCat = category === 'Все' || o.category === category
    const matchTag = tag === 'Все' || o.tags.includes(tag)
    const matchGrade = grade === 'Все' || (o.grade_min <= parseInt(grade) && o.grade_max >= parseInt(grade))
    return matchSearch && matchCat && matchTag && matchGrade
  })

  return (
    <div style={{ minHeight: '100vh', background: 'var(--paper)' }}>
      <Navbar isAdmin={isAdmin} />

      {/* Header */}
      <div style={{ borderBottom: '1px solid var(--line)', padding: '40px 0 32px' }}>
        <div className="container">
          <p className="eyebrow" style={{ marginBottom: 10 }}>Каталог</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-end', justifyContent: 'space-between', gap: 16 }}>
            <h1 className="display-md">Возможности</h1>
            <p className="body-sm">{filtered.length} из {OPPORTUNITIES.length}</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div style={{ borderBottom: '1px solid var(--line)', background: 'var(--paper-2)', padding: '16px 0' }}>
        <div className="container" style={{ display: 'flex', flexWrap: 'wrap', gap: 10, alignItems: 'center' }}>
          {/* Search */}
          <div style={{ position: 'relative', flex: '1 1 200px', minWidth: 200 }}>
            <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--ink3)', fontSize: 13 }}>⌕</span>
            <input type="text" value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Поиск..." className="input" style={{ paddingLeft: 30, fontSize: 13 }} />
          </div>
          <select value={category} onChange={e => setCategory(e.target.value)} className="input" style={{ width: 'auto', fontSize: 13 }}>
            {CATEGORIES.map(c => <option key={c}>{c}</option>)}
          </select>
          <select value={tag} onChange={e => setTag(e.target.value)} className="input" style={{ width: 'auto', fontSize: 13 }}>
            {TAGS.map(t => <option key={t}>{t}</option>)}
          </select>
          <select value={grade} onChange={e => setGrade(e.target.value)} className="input" style={{ width: 'auto', fontSize: 13 }}>
            {GRADES.map(g => <option key={g}>{g === 'Все' ? 'Все классы' : `${g} класс`}</option>)}
          </select>
        </div>
      </div>

      {/* Grid */}
      <div className="container" style={{ paddingTop: 32, paddingBottom: 64 }}>
        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 24px', color: 'var(--ink3)' }}>
            <p style={{ fontSize: 48, marginBottom: 16 }}>○</p>
            <p style={{ fontFamily: 'Instrument Serif, serif', fontSize: 22, color: 'var(--ink)', marginBottom: 8 }}>Ничего не найдено</p>
            <p className="body-sm">Попробуй изменить фильтры</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 }}>
            {filtered.map(opp => {
              const isSaved = savedIds.includes(opp.id)
              const daysLeft = Math.ceil((new Date(opp.deadline).getTime() - Date.now()) / 86400000)
              const bg = catColors[opp.category] || '#f2f1ee'
              const tc = catTextColors[opp.category] || 'var(--ink2)'
              return (
                <div key={opp.id} className="card-flat" style={{ display: 'flex', flexDirection: 'column' }}>
                  {/* Top */}
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 16 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <span style={{ fontSize: 28 }}>{opp.image}</span>
                      <span style={{ background: bg, color: tc, fontSize: 11, fontWeight: 500, padding: '3px 10px', borderRadius: 100, letterSpacing: '0.04em' }}>
                        {opp.category}
                      </span>
                    </div>
                    <button onClick={() => toggleSave(opp.id)} style={{
                      background: isSaved ? 'var(--ink)' : 'transparent',
                      border: '1px solid var(--line)', borderRadius: 2,
                      width: 32, height: 32, cursor: 'pointer', fontSize: 14,
                      color: isSaved ? '#fff' : 'var(--ink3)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      transition: 'all 0.15s', flexShrink: 0,
                    }} title={isSaved ? 'Убрать' : 'Сохранить'}>
                      {isSaved ? '✕' : '♡'}
                    </button>
                  </div>

                  <h3 style={{ fontFamily: 'Instrument Serif, serif', fontSize: 20, color: 'var(--ink)', lineHeight: 1.2, marginBottom: 8 }}>{opp.title}</h3>
                  <p style={{ fontSize: 13, color: 'var(--ink3)', lineHeight: 1.6, marginBottom: 16, flex: 1 }}>
                    {opp.description.slice(0, 120)}...
                  </p>

                  {/* Tags */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: 16 }}>
                    {opp.tags.map((t: string) => <span key={t} className="tag" style={{ fontSize: 11 }}>{t}</span>)}
                  </div>

                  {/* Meta */}
                  <div style={{ borderTop: '1px solid var(--line)', paddingTop: 14, display: 'flex', flexDirection: 'column', gap: 8 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: 12, color: 'var(--ink3)' }}>{opp.format} · {opp.grade_min}–{opp.grade_max} класс</span>
                      <span style={{ fontSize: 12, fontWeight: 500, color: daysLeft <= 7 ? 'var(--warn)' : daysLeft <= 30 ? '#b45309' : 'var(--ink3)' }}>
                        {daysLeft > 0 ? `${daysLeft} дн.` : 'Истёк'}
                      </span>
                    </div>
                    <p style={{ fontSize: 11, color: 'var(--ink3)' }}><span style={{ fontWeight: 500, color: 'var(--ink2)' }}>Требования:</span> {opp.requirements}</p>
                    <a href={opp.apply_url} target="_blank" rel="noopener noreferrer"
                      className="btn btn-dark" style={{ marginTop: 4, justifyContent: 'center', fontSize: 13 }}>
                      Подать заявку →
                    </a>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
