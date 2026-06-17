'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Navbar from '@/components/Navbar'
import { OPPORTUNITIES, COURSES } from '@/lib/data'

export default function AdminPage() {
  const [tab, setTab] = useState<'overview' | 'opportunities' | 'courses' | 'users'>('overview')
  const [userCount, setUserCount] = useState(0)
  const [recentUsers, setRecentUsers] = useState<any[]>([])
  const [authorized, setAuthorized] = useState<boolean | null>(null)
  const [editOpp, setEditOpp] = useState<any | null>(null)
  const [localOpps, setLocalOpps] = useState([...OPPORTUNITIES])
  const [saving, setSaving] = useState(false)
  const router = useRouter()

  useEffect(() => {
    async function load() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }
      const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
      if (profile?.role !== 'admin') { router.push('/dashboard'); return }
      setAuthorized(true)
      const { data: users, count } = await supabase.from('profiles').select('*', { count: 'exact' }).order('created_at', { ascending: false }).limit(20)
      setUserCount(count || 0)
      setRecentUsers(users || [])
    }
    load()
  }, [])

  if (authorized === null) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--paper)' }}>
      <p className="body-sm">Проверка прав доступа...</p>
    </div>
  )

  const tabs = [
    { id: 'overview', label: 'Обзор' },
    { id: 'opportunities', label: 'Возможности' },
    { id: 'courses', label: 'Курсы' },
    { id: 'users', label: 'Пользователи' },
  ] as const

  function newOpp() {
    setEditOpp({ id: String(Date.now()), title: '', category: 'Олимпиада', format: 'Онлайн', deadline: '', grade_min: 8, grade_max: 11, description: '', requirements: '', apply_url: '', tags: [], image: '🏆' })
  }

  function saveOpp() {
    const exists = localOpps.find(o => o.id === editOpp.id)
    if (exists) setLocalOpps(localOpps.map(o => o.id === editOpp.id ? editOpp : o))
    else setLocalOpps([editOpp, ...localOpps])
    setEditOpp(null)
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--paper)' }}>
      <Navbar isAdmin />

      <div style={{ borderBottom: '1px solid var(--line)', padding: '32px 0 0' }}>
        <div className="container">
          <p className="eyebrow" style={{ marginBottom: 8 }}>Панель управления</p>
          <h1 className="display-md" style={{ marginBottom: 24 }}>Администратор</h1>

          {/* Tabs */}
          <div style={{ display: 'flex', gap: 0, borderBottom: '1px solid var(--line)' }}>
            {tabs.map(({ id, label }) => (
              <button key={id} onClick={() => setTab(id)} style={{
                padding: '10px 20px', background: 'none', border: 'none', cursor: 'pointer',
                fontSize: 13, fontWeight: tab === id ? 500 : 400,
                color: tab === id ? 'var(--ink)' : 'var(--ink3)',
                borderBottom: tab === id ? '2px solid var(--ink)' : '2px solid transparent',
                marginBottom: -1, transition: 'all 0.15s'
              }}>
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="container" style={{ paddingTop: 40, paddingBottom: 64 }}>

        {/* Overview */}
        {tab === 'overview' && (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 1, border: '1px solid var(--line)', marginBottom: 40 }}>
              {[
                { value: userCount, label: 'Пользователей' },
                { value: localOpps.length, label: 'Возможностей' },
                { value: COURSES.length, label: 'Курсов' },
                { value: COURSES.reduce((a, c) => a + c.lessons.length, 0), label: 'Уроков' },
              ].map(({ value, label }) => (
                <div key={label} style={{ padding: '24px 20px', borderRight: '1px solid var(--line)', textAlign: 'center' }}>
                  <div style={{ fontFamily: 'Instrument Serif, serif', fontSize: 36, color: 'var(--ink)', lineHeight: 1 }}>{value}</div>
                  <div className="eyebrow" style={{ marginTop: 8 }}>{label}</div>
                </div>
              ))}
            </div>

            <h2 style={{ fontFamily: 'Instrument Serif, serif', fontSize: 22, marginBottom: 20 }}>Последние пользователи</h2>
            <div style={{ border: '1px solid var(--line)', borderRadius: 2 }}>
              {recentUsers.slice(0, 6).map((u, i) => (
                <div key={u.id} style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '14px 20px', borderBottom: i < 5 ? '1px solid var(--line)' : 'none' }}>
                  <div style={{ width: 32, height: 32, background: 'var(--paper-2)', border: '1px solid var(--line)', borderRadius: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontFamily: 'Instrument Serif, serif', color: 'var(--ink)', flexShrink: 0 }}>
                    {(u.name || u.email || '?')[0].toUpperCase()}
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: 14, color: 'var(--ink)', fontWeight: 500 }}>{u.name || 'Без имени'}</p>
                    <p style={{ fontSize: 12, color: 'var(--ink3)' }}>{u.email}</p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span className="tag">{u.role || 'student'}</span>
                    {u.grade && <p style={{ fontSize: 11, color: 'var(--ink3)', marginTop: 4 }}>{u.grade} класс</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Opportunities */}
        {tab === 'opportunities' && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 }}>
              <h2 style={{ fontFamily: 'Instrument Serif, serif', fontSize: 22 }}>Возможности ({localOpps.length})</h2>
              <button onClick={newOpp} className="btn btn-dark" style={{ fontSize: 13 }}>+ Добавить</button>
            </div>

            {/* Edit form */}
            {editOpp && (
              <div style={{ border: '2px solid var(--ink)', borderRadius: 2, padding: 28, marginBottom: 24, background: 'var(--paper-2)' }}>
                <p className="eyebrow" style={{ marginBottom: 20 }}>{editOpp.title ? 'Редактировать' : 'Новая возможность'}</p>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                  {([
                    ['Название', 'title', 'text', ''],
                    ['Дедлайн', 'deadline', 'date', ''],
                    ['Ссылка', 'apply_url', 'url', 'https://'],
                    ['Иконка', 'image', 'text', '🏆'],
                  ] as const).map(([label, key, type, placeholder]) => (
                    <div key={key}>
                      <label style={{ display: 'block', fontSize: 11, fontWeight: 500, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--ink3)', marginBottom: 6 }}>{label}</label>
                      <input type={type} value={editOpp[key]} placeholder={placeholder}
                        onChange={e => setEditOpp({ ...editOpp, [key]: e.target.value })} className="input" style={{ fontSize: 13 }} />
                    </div>
                  ))}
                  <div>
                    <label style={{ display: 'block', fontSize: 11, fontWeight: 500, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--ink3)', marginBottom: 6 }}>Категория</label>
                    <select value={editOpp.category} onChange={e => setEditOpp({ ...editOpp, category: e.target.value })} className="input" style={{ fontSize: 13 }}>
                      {['Олимпиада','Хакатон','Стипендия','Летняя школа','Конкурс','Исследования','Волонтёрство','Стажировка'].map(c => <option key={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: 11, fontWeight: 500, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--ink3)', marginBottom: 6 }}>Формат</label>
                    <select value={editOpp.format} onChange={e => setEditOpp({ ...editOpp, format: e.target.value })} className="input" style={{ fontSize: 13 }}>
                      {['Онлайн','Очно','Гибрид'].map(f => <option key={f}>{f}</option>)}
                    </select>
                  </div>
                </div>
                <div style={{ marginTop: 14 }}>
                  <label style={{ display: 'block', fontSize: 11, fontWeight: 500, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--ink3)', marginBottom: 6 }}>Описание</label>
                  <textarea value={editOpp.description} onChange={e => setEditOpp({ ...editOpp, description: e.target.value })} rows={3}
                    className="input" style={{ resize: 'vertical', fontSize: 13 }} />
                </div>
                <div style={{ marginTop: 14 }}>
                  <label style={{ display: 'block', fontSize: 11, fontWeight: 500, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--ink3)', marginBottom: 6 }}>Требования</label>
                  <input type="text" value={editOpp.requirements} onChange={e => setEditOpp({ ...editOpp, requirements: e.target.value })} className="input" style={{ fontSize: 13 }} />
                </div>
                <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
                  <button onClick={saveOpp} className="btn btn-dark" style={{ fontSize: 13 }}>Сохранить</button>
                  <button onClick={() => setEditOpp(null)} className="btn btn-ghost" style={{ fontSize: 13 }}>Отмена</button>
                </div>
              </div>
            )}

            <div style={{ border: '1px solid var(--line)', borderRadius: 2 }}>
              {localOpps.map((opp, i) => (
                <div key={opp.id} style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '14px 20px', borderBottom: i < localOpps.length - 1 ? '1px solid var(--line)' : 'none' }}>
                  <span style={{ fontSize: 22 }}>{opp.image}</span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: 14, fontWeight: 500, color: 'var(--ink)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{opp.title}</p>
                    <p style={{ fontSize: 12, color: 'var(--ink3)' }}>{opp.category} · {opp.format} · {new Date(opp.deadline).toLocaleDateString('ru')}</p>
                  </div>
                  <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
                    <button onClick={() => setEditOpp({ ...opp })} className="btn btn-ghost" style={{ fontSize: 12, padding: '6px 14px' }}>Ред.</button>
                    <button onClick={() => setLocalOpps(localOpps.filter(o => o.id !== opp.id))} style={{ background: 'none', border: '1px solid var(--line)', borderRadius: 2, fontSize: 12, padding: '6px 14px', cursor: 'pointer', color: 'var(--warn)', transition: 'all 0.15s' }}>Удал.</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Courses */}
        {tab === 'courses' && (
          <div>
            <h2 style={{ fontFamily: 'Instrument Serif, serif', fontSize: 22, marginBottom: 28 }}>Курсы ({COURSES.length})</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {COURSES.map(course => (
                <div key={course.id} style={{ border: '1px solid var(--line)', borderRadius: 2, overflow: 'hidden' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '16px 20px', borderBottom: '1px solid var(--line)', background: 'var(--paper-2)' }}>
                    <span style={{ fontSize: 28 }}>{course.image}</span>
                    <div style={{ flex: 1 }}>
                      <p style={{ fontFamily: 'Instrument Serif, serif', fontSize: 18, color: 'var(--ink)' }}>{course.title}</p>
                      <p style={{ fontSize: 12, color: 'var(--ink3)' }}>{course.level} · {course.lessons.length} уроков</p>
                    </div>
                  </div>
                  <div style={{ padding: '12px 20px' }}>
                    {course.lessons.map((l, i) => (
                      <div key={l.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '6px 0', borderBottom: i < course.lessons.length - 1 ? '1px solid var(--line)' : 'none' }}>
                        <span style={{ fontSize: 11, color: 'var(--ink3)', width: 16 }}>{i + 1}</span>
                        <span style={{ fontSize: 13, color: 'var(--ink2)' }}>{l.title}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Users */}
        {tab === 'users' && (
          <div>
            <h2 style={{ fontFamily: 'Instrument Serif, serif', fontSize: 22, marginBottom: 28 }}>Пользователи ({userCount})</h2>
            <div style={{ border: '1px solid var(--line)', borderRadius: 2 }}>
              {recentUsers.map((u, i) => (
                <div key={u.id} style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '14px 20px', borderBottom: i < recentUsers.length - 1 ? '1px solid var(--line)' : 'none' }}>
                  <div style={{ width: 36, height: 36, background: 'var(--paper-2)', border: '1px solid var(--line)', borderRadius: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontFamily: 'Instrument Serif, serif', color: 'var(--ink)', flexShrink: 0 }}>
                    {(u.name || u.email || '?')[0].toUpperCase()}
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: 14, color: 'var(--ink)', fontWeight: 500 }}>{u.name || 'Без имени'}</p>
                    <p style={{ fontSize: 12, color: 'var(--ink3)' }}>{u.email}</p>
                  </div>
                  <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                    <span className={u.role === 'admin' ? 'tag tag-accent' : 'tag'}>{u.role || 'student'}</span>
                    {u.grade && <span className="tag">{u.grade} кл.</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
