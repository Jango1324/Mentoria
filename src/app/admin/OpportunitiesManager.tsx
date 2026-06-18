'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import {
  createOpportunity,
  updateOpportunity,
  deleteOpportunity,
} from '@/lib/actions/admin'
import type { Opportunity } from '@/types'

type OppForm = {
  title: string
  description: string
  category: string
  tags: string
  deadline: string
  url: string
  is_active: boolean
}

const blank: OppForm = {
  title: '',
  description: '',
  category: '',
  tags: '',
  deadline: '',
  url: '',
  is_active: true,
}

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: 12,
  fontWeight: 500,
  color: 'var(--ink-3)',
  letterSpacing: '0.02em',
  marginBottom: 4,
}

function toInput(f: OppForm) {
  return {
    title: f.title.trim(),
    description: f.description.trim() || null,
    category: f.category.trim(),
    tags: f.tags.split(',').map((t) => t.trim()).filter(Boolean),
    deadline: f.deadline || null,
    url: f.url.trim() || null,
    is_active: f.is_active,
  }
}

function toForm(opp: Opportunity): OppForm {
  return {
    title: opp.title,
    description: opp.description ?? '',
    category: opp.category,
    tags: opp.tags.join(', '),
    deadline: opp.deadline ?? '',
    url: opp.url ?? '',
    is_active: opp.is_active,
  }
}

function OppFormFields({
  form,
  onChange,
}: {
  form: OppForm
  onChange: (f: OppForm) => void
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <div>
          <label style={labelStyle}>Название *</label>
          <input
            className="input"
            required
            value={form.title}
            onChange={(e) => onChange({ ...form, title: e.target.value })}
            placeholder="Название возможности"
          />
        </div>
        <div>
          <label style={labelStyle}>Категория *</label>
          <input
            className="input"
            required
            value={form.category}
            onChange={(e) => onChange({ ...form, category: e.target.value })}
            placeholder="Research, STEM, Olympiad…"
          />
        </div>
      </div>

      <div>
        <label style={labelStyle}>Описание</label>
        <textarea
          value={form.description}
          onChange={(e) => onChange({ ...form, description: e.target.value })}
          placeholder="Краткое описание"
          className="input"
          style={{ resize: 'vertical', minHeight: 72 }}
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
        <div>
          <label style={labelStyle}>Теги (через запятую)</label>
          <input
            className="input"
            value={form.tags}
            onChange={(e) => onChange({ ...form, tags: e.target.value })}
            placeholder="STEM, MIT, Research"
          />
        </div>
        <div>
          <label style={labelStyle}>Дедлайн</label>
          <input
            className="input"
            type="date"
            value={form.deadline}
            onChange={(e) => onChange({ ...form, deadline: e.target.value })}
          />
        </div>
        <div>
          <label style={labelStyle}>Ссылка</label>
          <input
            className="input"
            type="url"
            value={form.url}
            onChange={(e) => onChange({ ...form, url: e.target.value })}
            placeholder="https://..."
          />
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <label style={{ ...labelStyle, marginBottom: 0 }}>Активна</label>
        <button
          type="button"
          onClick={() => onChange({ ...form, is_active: !form.is_active })}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            fontSize: 12,
            fontWeight: 500,
            padding: '4px 12px',
            borderRadius: 100,
            border: `1px solid ${form.is_active ? 'var(--positive-border)' : 'var(--line)'}`,
            background: form.is_active ? 'var(--positive-bg)' : 'var(--bg-raised)',
            color: form.is_active ? 'var(--success)' : 'var(--ink-3)',
            cursor: 'pointer',
            transition: 'all 0.15s',
          }}
        >
          {form.is_active ? 'Да' : 'Нет'}
        </button>
      </div>
    </div>
  )
}

export default function OpportunitiesManager({
  opportunities,
}: {
  opportunities: Opportunity[]
}) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  const [showCreate, setShowCreate] = useState(false)
  const [createForm, setCreateForm] = useState<OppForm>(blank)

  const [editingId, setEditingId] = useState<string | null>(null)
  const [editForm, setEditForm] = useState<OppForm>(blank)

  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null)

  function startEdit(opp: Opportunity) {
    setEditingId(opp.id)
    setEditForm(toForm(opp))
    setConfirmDeleteId(null)
    setShowCreate(false)
  }

  function handleCreate(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    startTransition(async () => {
      const result = await createOpportunity(toInput(createForm))
      if (result?.error) { setError(result.error); return }
      setCreateForm(blank)
      setShowCreate(false)
      router.refresh()
    })
  }

  function handleUpdate(e: React.FormEvent) {
    e.preventDefault()
    if (!editingId) return
    setError(null)
    startTransition(async () => {
      const result = await updateOpportunity(editingId, toInput(editForm))
      if (result?.error) { setError(result.error); return }
      setEditingId(null)
      router.refresh()
    })
  }

  function handleDelete(id: string) {
    setError(null)
    startTransition(async () => {
      const result = await deleteOpportunity(id)
      if (result?.error) { setError(result.error); return }
      setConfirmDeleteId(null)
      router.refresh()
    })
  }

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <p className="eyebrow">Возможности · {opportunities.length}</p>
        {!showCreate && (
          <button
            className="btn btn-dark"
            style={{ fontSize: 13 }}
            onClick={() => {
              setShowCreate(true)
              setEditingId(null)
              setCreateForm(blank)
            }}
          >
            + Добавить
          </button>
        )}
      </div>

      {/* Error */}
      {error && (
        <div style={{
          background: 'var(--warning-bg)',
          border: '1px solid var(--warning-border)',
          color: 'var(--warn)',
          borderRadius: 4,
          padding: '10px 14px',
          fontSize: 13,
          marginBottom: 20,
        }}>
          {error}
        </div>
      )}

      {/* Create form */}
      {showCreate && (
        <div
          className="card-flat"
          style={{ marginBottom: 16, background: 'var(--paper-2)', padding: '24px' }}
        >
          <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink)', marginBottom: 16 }}>
            Новая возможность
          </p>
          <form onSubmit={handleCreate}>
            <OppFormFields form={createForm} onChange={setCreateForm} />
            <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
              <button
                type="submit"
                disabled={isPending}
                className="btn btn-dark"
                style={{ fontSize: 13, opacity: isPending ? 0.6 : 1 }}
              >
                {isPending ? 'Создание...' : 'Создать'}
              </button>
              <button
                type="button"
                className="btn btn-ghost"
                style={{ fontSize: 13 }}
                onClick={() => setShowCreate(false)}
              >
                Отмена
              </button>
            </div>
          </form>
        </div>
      )}

      {/* List */}
      {opportunities.length === 0 && !showCreate ? (
        <p className="body-sm" style={{ padding: '40px 0', textAlign: 'center' }}>
          Нет активных возможностей. Добавьте первую.
        </p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {opportunities.map((opp) => (
            <div key={opp.id} className="card-flat" style={{ padding: '20px 24px' }}>

              {/* Edit mode */}
              {editingId === opp.id ? (
                <form onSubmit={handleUpdate}>
                  <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink)', marginBottom: 16 }}>
                    Редактировать
                  </p>
                  <OppFormFields form={editForm} onChange={setEditForm} />
                  <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
                    <button
                      type="submit"
                      disabled={isPending}
                      className="btn btn-dark"
                      style={{ fontSize: 13, opacity: isPending ? 0.6 : 1 }}
                    >
                      {isPending ? 'Сохранение...' : 'Сохранить'}
                    </button>
                    <button
                      type="button"
                      className="btn btn-ghost"
                      style={{ fontSize: 13 }}
                      onClick={() => setEditingId(null)}
                    >
                      Отмена
                    </button>
                  </div>
                </form>
              ) : (
                /* View mode */
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16 }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', gap: 6, marginBottom: 8, flexWrap: 'wrap' }}>
                      <span className="tag">{opp.category}</span>
                      {opp.deadline && (
                        <span className="tag">{opp.deadline}</span>
                      )}
                      <span className={`tag${opp.is_active ? ' tag-success' : ''}`}>
                        {opp.is_active ? 'Активна' : 'Неактивна'}
                      </span>
                    </div>
                    <p style={{ fontSize: 15, fontWeight: 500, color: 'var(--ink)', marginBottom: 4 }}>
                      {opp.title}
                    </p>
                    {opp.description && (
                      <p
                        className="body-sm"
                        style={{
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                          maxWidth: 520,
                        }}
                      >
                        {opp.description}
                      </p>
                    )}
                  </div>

                  {/* Actions */}
                  <div style={{ display: 'flex', gap: 6, flexShrink: 0, alignItems: 'center' }}>
                    <button
                      className="btn btn-ghost"
                      style={{ fontSize: 12, padding: '6px 12px' }}
                      onClick={() => startEdit(opp)}
                    >
                      Изменить
                    </button>

                    {confirmDeleteId === opp.id ? (
                      <>
                        <button
                          className="btn"
                          disabled={isPending}
                          style={{
                            fontSize: 12,
                            padding: '6px 12px',
                            background: 'var(--warn)',
                            color: '#fff',
                            borderRadius: 2,
                            border: 'none',
                            cursor: 'pointer',
                            opacity: isPending ? 0.6 : 1,
                          }}
                          onClick={() => handleDelete(opp.id)}
                        >
                          {isPending ? '...' : 'Подтвердить'}
                        </button>
                        <button
                          className="btn btn-ghost"
                          style={{ fontSize: 12, padding: '6px 12px' }}
                          onClick={() => setConfirmDeleteId(null)}
                        >
                          Отмена
                        </button>
                      </>
                    ) : (
                      <button
                        className="btn btn-ghost"
                        style={{
                          fontSize: 12,
                          padding: '6px 12px',
                          color: 'var(--warn)',
                          borderColor: 'var(--warn)',
                        }}
                        onClick={() => {
                          setConfirmDeleteId(opp.id)
                          setEditingId(null)
                        }}
                      >
                        Удалить
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
