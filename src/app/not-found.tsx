import Link from 'next/link'

export default function NotFound() {
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
        <p
          className="eyebrow"
          style={{ marginBottom: 16 }}
        >
          404
        </p>
        <h1 className="display-sm" style={{ marginBottom: 12 }}>Страница не найдена</h1>
        <p className="body-sm" style={{ marginBottom: 32, lineHeight: 1.7 }}>
          Такой страницы не существует или она была удалена.
        </p>
        <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/" className="btn btn-dark">
            На главную
          </Link>
          <Link href="/dashboard" className="btn btn-ghost">
            Личный кабинет
          </Link>
        </div>
      </div>
    </div>
  )
}
