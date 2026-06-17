import Link from 'next/link'

export default function CourseNotFound() {
  return (
    <div style={{
      background: 'var(--paper)',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
    }}>
      <div style={{ textAlign: 'center', maxWidth: 400 }}>
        <p className="eyebrow" style={{ marginBottom: 16 }}>404</p>
        <h1 className="display-sm" style={{ marginBottom: 12 }}>Курс не найден</h1>
        <p className="body-sm" style={{ marginBottom: 32, lineHeight: 1.7 }}>
          Этот курс не существует или был снят с публикации.
        </p>
        <Link href="/courses" className="btn btn-dark">
          ← Все курсы
        </Link>
      </div>
    </div>
  )
}
