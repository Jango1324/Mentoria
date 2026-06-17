'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { INTERESTS, GOALS } from '@/lib/data'

export default function OnboardingPage() {
  const [step, setStep] = useState(1)
  const [grade, setGrade] = useState('')
  const [interests, setInterests] = useState<string[]>([])
  const [goals, setGoals] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  function toggle(arr: string[], setArr: (a: string[]) => void, item: string) {
    setArr(arr.includes(item) ? arr.filter(x => x !== item) : [...arr, item])
  }

  async function finish() {
    setLoading(true)
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      await supabase.from('profiles').upsert({ id: user.id, grade: parseInt(grade), interests, goals })
    }
    router.push('/dashboard')
  }

  const totalSteps = 3
  const pct = ((step - 1) / totalSteps) * 100

  return (
    <div style={{ minHeight: '100vh', background: 'var(--paper)', display: 'flex', flexDirection: 'column' }}>
      {/* Progress bar at very top */}
      <div style={{ height: 2, background: 'var(--line)', position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100 }}>
        <div style={{ height: '100%', background: 'var(--ink)', width: `${pct}%`, transition: 'width 0.4s ease' }} />
      </div>

      <div style={{ borderBottom: '1px solid var(--line)', height: 56, display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: 2 }}>
        <span style={{ fontFamily: 'Instrument Serif, serif', fontSize: 18, color: 'var(--ink)' }}>Mentoria Hub</span>
      </div>

      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '48px 24px' }}>
        <div style={{ width: '100%', maxWidth: 520 }}>
          <p className="eyebrow" style={{ marginBottom: 8 }}>Шаг {step} из {totalSteps}</p>

          {/* Step 1 — Grade */}
          {step === 1 && (
            <div className="fade-in">
              <h1 className="display-md" style={{ marginBottom: 10 }}>В каком ты классе?</h1>
              <p className="body-sm" style={{ marginBottom: 36 }}>Мы подберём возможности по возрасту и уровню</p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 32 }}>
                {['8', '9', '10', '11'].map(g => (
                  <button key={g} onClick={() => setGrade(g)} style={{
                    padding: '20px 16px', border: `2px solid ${grade === g ? 'var(--ink)' : 'var(--line)'}`,
                    background: grade === g ? 'var(--ink)' : '#fff', color: grade === g ? '#fff' : 'var(--ink)',
                    borderRadius: 2, cursor: 'pointer', fontSize: 18, fontFamily: 'Instrument Serif, serif',
                    transition: 'all 0.15s'
                  }}>
                    {g} класс
                  </button>
                ))}
              </div>
              <button onClick={() => setStep(2)} disabled={!grade} className="btn btn-dark" style={{ opacity: grade ? 1 : 0.4, justifyContent: 'center', width: '100%' }}>
                Далее →
              </button>
            </div>
          )}

          {/* Step 2 — Interests */}
          {step === 2 && (
            <div className="fade-in">
              <h1 className="display-md" style={{ marginBottom: 10 }}>Что тебя интересует?</h1>
              <p className="body-sm" style={{ marginBottom: 32 }}>Выбери одно или несколько направлений</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 32 }}>
                {INTERESTS.map(i => (
                  <button key={i} onClick={() => toggle(interests, setInterests, i)} style={{
                    padding: '8px 16px', border: `1px solid ${interests.includes(i) ? 'var(--ink)' : 'var(--line)'}`,
                    background: interests.includes(i) ? 'var(--ink)' : '#fff',
                    color: interests.includes(i) ? '#fff' : 'var(--ink)',
                    borderRadius: 100, cursor: 'pointer', fontSize: 13, transition: 'all 0.15s'
                  }}>
                    {i}
                  </button>
                ))}
              </div>
              <div style={{ display: 'flex', gap: 12 }}>
                <button onClick={() => setStep(1)} className="btn btn-ghost">← Назад</button>
                <button onClick={() => setStep(3)} disabled={interests.length === 0} className="btn btn-dark"
                  style={{ flex: 1, justifyContent: 'center', opacity: interests.length ? 1 : 0.4 }}>
                  Далее →
                </button>
              </div>
            </div>
          )}

          {/* Step 3 — Goals */}
          {step === 3 && (
            <div className="fade-in">
              <h1 className="display-md" style={{ marginBottom: 10 }}>Какова твоя цель?</h1>
              <p className="body-sm" style={{ marginBottom: 32 }}>Можно выбрать несколько</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 32 }}>
                {GOALS.map(g => (
                  <button key={g} onClick={() => toggle(goals, setGoals, g)} style={{
                    padding: '14px 18px', border: `1px solid ${goals.includes(g) ? 'var(--ink)' : 'var(--line)'}`,
                    background: goals.includes(g) ? 'var(--ink)' : '#fff',
                    color: goals.includes(g) ? '#fff' : 'var(--ink)',
                    borderRadius: 2, cursor: 'pointer', fontSize: 14, textAlign: 'left',
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between', transition: 'all 0.15s'
                  }}>
                    <span>{g}</span>
                    {goals.includes(g) && <span style={{ fontSize: 11 }}>✓</span>}
                  </button>
                ))}
              </div>
              <div style={{ display: 'flex', gap: 12 }}>
                <button onClick={() => setStep(2)} className="btn btn-ghost">← Назад</button>
                <button onClick={finish} disabled={goals.length === 0 || loading} className="btn btn-dark"
                  style={{ flex: 1, justifyContent: 'center', opacity: goals.length && !loading ? 1 : 0.4 }}>
                  {loading ? 'Сохраняем...' : 'Начать обучение →'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
