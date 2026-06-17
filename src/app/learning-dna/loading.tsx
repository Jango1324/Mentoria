import AppNav from '@/components/AppNav'

export default function Loading() {
  return (
    <div style={{ background: 'var(--paper)', minHeight: '100vh' }}>
      <AppNav />
      <main className="container" style={{ padding: '48px 24px', maxWidth: 640 }}>
        <div className="skeleton" style={{ height: 11, width: 72, marginBottom: 18, borderRadius: 2 }} />
        <div className="skeleton" style={{ height: 40, width: '55%', marginBottom: 14, borderRadius: 2 }} />
        <div className="skeleton" style={{ height: 18, width: '85%', marginBottom: 48, borderRadius: 2 }} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className="skeleton"
              style={{ height: 58, borderRadius: 4 }}
            />
          ))}
        </div>
      </main>
    </div>
  )
}
