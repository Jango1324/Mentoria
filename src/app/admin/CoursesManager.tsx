'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import {
  createCourse,
  updateCourse,
  deleteCourse,
  createLesson,
  updateLesson,
  deleteLesson,
} from '@/lib/actions/admin'
import type { Course, Lesson } from '@/types'

type CourseWithLessons = Course & { lessons: Lesson[] }

type CourseForm = {
  title: string
  description: string
  category: string
  is_published: boolean
}

type LessonForm = {
  title: string
  content_url: string
  order_index: string
}

const blankCourse: CourseForm = {
  title: '',
  description: '',
  category: '',
  is_published: false,
}

const blankLesson: LessonForm = {
  title: '',
  content_url: '',
  order_index: '1',
}

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: 12,
  fontWeight: 500,
  color: 'var(--ink-3)',
  letterSpacing: '0.02em',
  marginBottom: 4,
}

function CourseFormFields({
  form,
  onChange,
}: {
  form: CourseForm
  onChange: (f: CourseForm) => void
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
            placeholder="Название курса"
          />
        </div>
        <div>
          <label style={labelStyle}>Категория *</label>
          <input
            className="input"
            required
            value={form.category}
            onChange={(e) => onChange({ ...form, category: e.target.value })}
            placeholder="Programming, Research…"
          />
        </div>
      </div>

      <div>
        <label style={labelStyle}>Описание</label>
        <textarea
          value={form.description}
          onChange={(e) => onChange({ ...form, description: e.target.value })}
          placeholder="Краткое описание курса"
          className="input"
          style={{ resize: 'vertical', minHeight: 64 }}
        />
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <label style={{ ...labelStyle, marginBottom: 0 }}>Статус</label>
        <button
          type="button"
          onClick={() => onChange({ ...form, is_published: !form.is_published })}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            fontSize: 12,
            fontWeight: 500,
            padding: '4px 12px',
            borderRadius: 100,
            border: `1px solid ${form.is_published ? '#a3d8b8' : 'var(--line)'}`,
            background: form.is_published ? '#e6f5ed' : '#fff',
            color: form.is_published ? 'var(--success)' : 'var(--ink-3)',
            cursor: 'pointer',
            transition: 'all 0.15s',
          }}
        >
          {form.is_published ? 'Опубликован' : 'Черновик'}
        </button>
      </div>
    </div>
  )
}

function LessonFormFields({
  form,
  onChange,
}: {
  form: LessonForm
  onChange: (f: LessonForm) => void
}) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '2fr 2fr 1fr', gap: 10 }}>
      <div>
        <label style={labelStyle}>Название урока *</label>
        <input
          className="input"
          required
          value={form.title}
          onChange={(e) => onChange({ ...form, title: e.target.value })}
          placeholder="Название урока"
        />
      </div>
      <div>
        <label style={labelStyle}>Ссылка на материал</label>
        <input
          className="input"
          type="url"
          value={form.content_url}
          onChange={(e) => onChange({ ...form, content_url: e.target.value })}
          placeholder="https://..."
        />
      </div>
      <div>
        <label style={labelStyle}>Порядок</label>
        <input
          className="input"
          type="number"
          min="1"
          value={form.order_index}
          onChange={(e) => onChange({ ...form, order_index: e.target.value })}
        />
      </div>
    </div>
  )
}

export default function CoursesManager({
  courses,
}: {
  courses: CourseWithLessons[]
}) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  // Course state
  const [showCreateCourse, setShowCreateCourse] = useState(false)
  const [createCourseForm, setCreateCourseForm] = useState<CourseForm>(blankCourse)
  const [editingCourseId, setEditingCourseId] = useState<string | null>(null)
  const [editCourseForm, setEditCourseForm] = useState<CourseForm>(blankCourse)
  const [confirmDeleteCourseId, setConfirmDeleteCourseId] = useState<string | null>(null)

  // Lesson state
  const [expandedCourseId, setExpandedCourseId] = useState<string | null>(null)
  const [showCreateLessonFor, setShowCreateLessonFor] = useState<string | null>(null)
  const [createLessonForm, setCreateLessonForm] = useState<LessonForm>(blankLesson)
  const [editingLessonId, setEditingLessonId] = useState<string | null>(null)
  const [editLessonForm, setEditLessonForm] = useState<LessonForm>(blankLesson)
  const [confirmDeleteLessonId, setConfirmDeleteLessonId] = useState<string | null>(null)

  // ── Course actions ────────────────────────────────────────

  function handleCreateCourse(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    startTransition(async () => {
      const result = await createCourse({
        title: createCourseForm.title.trim(),
        description: createCourseForm.description.trim() || null,
        category: createCourseForm.category.trim(),
        thumbnail_url: null,
        is_published: createCourseForm.is_published,
      })
      if (result?.error) { setError(result.error); return }
      setCreateCourseForm(blankCourse)
      setShowCreateCourse(false)
      router.refresh()
    })
  }

  function handleUpdateCourse(e: React.FormEvent) {
    e.preventDefault()
    if (!editingCourseId) return
    setError(null)
    startTransition(async () => {
      const result = await updateCourse(editingCourseId, {
        title: editCourseForm.title.trim(),
        description: editCourseForm.description.trim() || null,
        category: editCourseForm.category.trim(),
        is_published: editCourseForm.is_published,
      })
      if (result?.error) { setError(result.error); return }
      setEditingCourseId(null)
      router.refresh()
    })
  }

  function handleDeleteCourse(id: string) {
    setError(null)
    startTransition(async () => {
      const result = await deleteCourse(id)
      if (result?.error) { setError(result.error); return }
      setConfirmDeleteCourseId(null)
      if (expandedCourseId === id) setExpandedCourseId(null)
      router.refresh()
    })
  }

  // ── Lesson actions ────────────────────────────────────────

  function handleCreateLesson(e: React.FormEvent, courseId: string) {
    e.preventDefault()
    setError(null)
    startTransition(async () => {
      const result = await createLesson({
        course_id: courseId,
        title: createLessonForm.title.trim(),
        content_url: createLessonForm.content_url.trim() || null,
        order_index: parseInt(createLessonForm.order_index) || 1,
      })
      if (result?.error) { setError(result.error); return }
      setCreateLessonForm(blankLesson)
      setShowCreateLessonFor(null)
      router.refresh()
    })
  }

  function handleUpdateLesson(e: React.FormEvent) {
    e.preventDefault()
    if (!editingLessonId) return
    setError(null)
    startTransition(async () => {
      const result = await updateLesson(editingLessonId, {
        title: editLessonForm.title.trim(),
        content_url: editLessonForm.content_url.trim() || null,
        order_index: parseInt(editLessonForm.order_index) || 1,
      })
      if (result?.error) { setError(result.error); return }
      setEditingLessonId(null)
      router.refresh()
    })
  }

  function handleDeleteLesson(id: string) {
    setError(null)
    startTransition(async () => {
      const result = await deleteLesson(id)
      if (result?.error) { setError(result.error); return }
      setConfirmDeleteLessonId(null)
      router.refresh()
    })
  }

  // ── Render ────────────────────────────────────────────────

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <p className="eyebrow">Курсы · {courses.length}</p>
        {!showCreateCourse && (
          <button
            className="btn btn-dark"
            style={{ fontSize: 13 }}
            onClick={() => {
              setShowCreateCourse(true)
              setEditingCourseId(null)
              setCreateCourseForm(blankCourse)
            }}
          >
            + Добавить курс
          </button>
        )}
      </div>

      {/* Error */}
      {error && (
        <div style={{
          background: '#fdf0e8',
          border: '1px solid #f5c4a0',
          color: 'var(--warn)',
          borderRadius: 4,
          padding: '10px 14px',
          fontSize: 13,
          marginBottom: 20,
        }}>
          {error}
        </div>
      )}

      {/* Create course form */}
      {showCreateCourse && (
        <div
          className="card-flat"
          style={{ marginBottom: 16, background: 'var(--paper-2)', padding: '24px' }}
        >
          <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink)', marginBottom: 16 }}>
            Новый курс
          </p>
          <form onSubmit={handleCreateCourse}>
            <CourseFormFields form={createCourseForm} onChange={setCreateCourseForm} />
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
                onClick={() => setShowCreateCourse(false)}
              >
                Отмена
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Course list */}
      {courses.length === 0 && !showCreateCourse ? (
        <p className="body-sm" style={{ padding: '40px 0', textAlign: 'center' }}>
          Нет опубликованных курсов. Добавьте первый.
        </p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {courses.map((course) => (
            <div key={course.id} className="card-flat" style={{ padding: '20px 24px' }}>

              {/* Edit course mode */}
              {editingCourseId === course.id ? (
                <form onSubmit={handleUpdateCourse}>
                  <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink)', marginBottom: 16 }}>
                    Редактировать курс
                  </p>
                  <CourseFormFields form={editCourseForm} onChange={setEditCourseForm} />
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
                      onClick={() => setEditingCourseId(null)}
                    >
                      Отмена
                    </button>
                  </div>
                </form>
              ) : (
                <>
                  {/* Course view row */}
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16 }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', gap: 6, marginBottom: 8, flexWrap: 'wrap' }}>
                        <span className="tag">{course.category}</span>
                        <span className={`tag${course.is_published ? ' tag-success' : ''}`}>
                          {course.is_published ? 'Опубликован' : 'Черновик'}
                        </span>
                      </div>
                      <p style={{ fontSize: 15, fontWeight: 500, color: 'var(--ink)' }}>
                        {course.title}
                      </p>
                    </div>

                    {/* Course actions */}
                    <div style={{ display: 'flex', gap: 6, flexShrink: 0, alignItems: 'center' }}>
                      <button
                        className="btn btn-ghost"
                        style={{
                          fontSize: 12,
                          padding: '6px 12px',
                          ...(expandedCourseId === course.id
                            ? { background: 'var(--paper-2)', borderColor: 'var(--ink)' }
                            : {}),
                        }}
                        onClick={() => {
                          setExpandedCourseId(
                            expandedCourseId === course.id ? null : course.id
                          )
                          setShowCreateLessonFor(null)
                          setEditingLessonId(null)
                          setConfirmDeleteLessonId(null)
                        }}
                      >
                        Уроки ({course.lessons.length})
                      </button>

                      <button
                        className="btn btn-ghost"
                        style={{ fontSize: 12, padding: '6px 12px' }}
                        onClick={() => {
                          setEditingCourseId(course.id)
                          setEditCourseForm({
                            title: course.title,
                            description: course.description ?? '',
                            category: course.category,
                            is_published: course.is_published,
                          })
                          setExpandedCourseId(null)
                          setConfirmDeleteCourseId(null)
                        }}
                      >
                        Изменить
                      </button>

                      {confirmDeleteCourseId === course.id ? (
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
                            onClick={() => handleDeleteCourse(course.id)}
                          >
                            {isPending ? '...' : 'Подтвердить'}
                          </button>
                          <button
                            className="btn btn-ghost"
                            style={{ fontSize: 12, padding: '6px 12px' }}
                            onClick={() => setConfirmDeleteCourseId(null)}
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
                            setConfirmDeleteCourseId(course.id)
                            setEditingCourseId(null)
                            setExpandedCourseId(null)
                          }}
                        >
                          Удалить
                        </button>
                      )}
                    </div>
                  </div>

                  {/* ── Lessons panel ────────────────────── */}
                  {expandedCourseId === course.id && (
                    <div style={{
                      marginTop: 20,
                      paddingTop: 20,
                      borderTop: '1px solid var(--line)',
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                        <p className="eyebrow">Уроки</p>
                        {showCreateLessonFor !== course.id && (
                          <button
                            className="btn btn-ghost"
                            style={{ fontSize: 12, padding: '6px 12px' }}
                            onClick={() => {
                              setShowCreateLessonFor(course.id)
                              setCreateLessonForm({
                                ...blankLesson,
                                order_index: String(course.lessons.length + 1),
                              })
                              setEditingLessonId(null)
                            }}
                          >
                            + Добавить урок
                          </button>
                        )}
                      </div>

                      {/* Create lesson form */}
                      {showCreateLessonFor === course.id && (
                        <form
                          onSubmit={(e) => handleCreateLesson(e, course.id)}
                          style={{
                            background: 'var(--paper-2)',
                            borderRadius: 4,
                            padding: '16px',
                            marginBottom: 10,
                          }}
                        >
                          <LessonFormFields
                            form={createLessonForm}
                            onChange={setCreateLessonForm}
                          />
                          <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
                            <button
                              type="submit"
                              disabled={isPending}
                              className="btn btn-dark"
                              style={{ fontSize: 12, padding: '7px 14px', opacity: isPending ? 0.6 : 1 }}
                            >
                              {isPending ? '...' : 'Создать урок'}
                            </button>
                            <button
                              type="button"
                              className="btn btn-ghost"
                              style={{ fontSize: 12, padding: '7px 14px' }}
                              onClick={() => setShowCreateLessonFor(null)}
                            >
                              Отмена
                            </button>
                          </div>
                        </form>
                      )}

                      {/* Lesson list */}
                      {course.lessons.length === 0 ? (
                        <p className="body-sm" style={{ padding: '16px 0', textAlign: 'center' }}>
                          Уроков нет. Добавьте первый.
                        </p>
                      ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                          {course.lessons.map((lesson, idx) => (
                            <div
                              key={lesson.id}
                              style={{
                                border: '1px solid var(--line)',
                                borderRadius: 4,
                                padding: '12px 16px',
                                background: '#fff',
                              }}
                            >
                              {/* Edit lesson mode */}
                              {editingLessonId === lesson.id ? (
                                <form onSubmit={handleUpdateLesson}>
                                  <LessonFormFields
                                    form={editLessonForm}
                                    onChange={setEditLessonForm}
                                  />
                                  <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
                                    <button
                                      type="submit"
                                      disabled={isPending}
                                      className="btn btn-dark"
                                      style={{ fontSize: 12, padding: '7px 14px', opacity: isPending ? 0.6 : 1 }}
                                    >
                                      {isPending ? '...' : 'Сохранить'}
                                    </button>
                                    <button
                                      type="button"
                                      className="btn btn-ghost"
                                      style={{ fontSize: 12, padding: '7px 14px' }}
                                      onClick={() => setEditingLessonId(null)}
                                    >
                                      Отмена
                                    </button>
                                  </div>
                                </form>
                              ) : (
                                /* Lesson view row */
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
                                  <div style={{ flex: 1, minWidth: 0 }}>
                                    <span
                                      className="body-sm"
                                      style={{ marginRight: 8, flexShrink: 0 }}
                                    >
                                      {idx + 1}.
                                    </span>
                                    <span style={{ fontSize: 14, color: 'var(--ink)', fontWeight: 500 }}>
                                      {lesson.title}
                                    </span>
                                    {lesson.content_url && (
                                      <span
                                        className="body-sm"
                                        style={{
                                          marginLeft: 8,
                                          overflow: 'hidden',
                                          textOverflow: 'ellipsis',
                                          whiteSpace: 'nowrap',
                                          maxWidth: 280,
                                          display: 'inline-block',
                                          verticalAlign: 'bottom',
                                        }}
                                      >
                                        {lesson.content_url}
                                      </span>
                                    )}
                                  </div>

                                  <div style={{ display: 'flex', gap: 4, flexShrink: 0 }}>
                                    <button
                                      className="btn btn-ghost"
                                      style={{ fontSize: 11, padding: '4px 10px' }}
                                      onClick={() => {
                                        setEditingLessonId(lesson.id)
                                        setEditLessonForm({
                                          title: lesson.title,
                                          content_url: lesson.content_url ?? '',
                                          order_index: String(lesson.order_index),
                                        })
                                        setConfirmDeleteLessonId(null)
                                      }}
                                    >
                                      Изменить
                                    </button>

                                    {confirmDeleteLessonId === lesson.id ? (
                                      <>
                                        <button
                                          className="btn"
                                          disabled={isPending}
                                          style={{
                                            fontSize: 11,
                                            padding: '4px 10px',
                                            background: 'var(--warn)',
                                            color: '#fff',
                                            borderRadius: 2,
                                            border: 'none',
                                            cursor: 'pointer',
                                            opacity: isPending ? 0.6 : 1,
                                          }}
                                          onClick={() => handleDeleteLesson(lesson.id)}
                                        >
                                          {isPending ? '...' : 'Подтвердить'}
                                        </button>
                                        <button
                                          className="btn btn-ghost"
                                          style={{ fontSize: 11, padding: '4px 10px' }}
                                          onClick={() => setConfirmDeleteLessonId(null)}
                                        >
                                          Отмена
                                        </button>
                                      </>
                                    ) : (
                                      <button
                                        className="btn btn-ghost"
                                        style={{
                                          fontSize: 11,
                                          padding: '4px 10px',
                                          color: 'var(--warn)',
                                          borderColor: 'var(--warn)',
                                        }}
                                        onClick={() => {
                                          setConfirmDeleteLessonId(lesson.id)
                                          setEditingLessonId(null)
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
                  )}
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
