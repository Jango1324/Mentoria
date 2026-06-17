export default function CourseDetailLoading() {
  return (
    <div style={{ background: 'var(--paper)', minHeight: '100vh' }}>
      <div style={{ borderBottom: '1px solid var(--line)', height: 56 }} />
      <main className="container" style={{ padding: '48px 24px' }}>
        <div className="skeleton" style={{ height: 14, width: 80, marginBottom: 36, borderRadius: 2 }} />

        {/* Course header */}
        <div style={{ marginBottom: 40 }}>
          <div style={{ display: 'flex', gap: 6, marginBottom: 16 }}>
            <div className="skeleton" style={{ height: 22, width: 72, borderRadius: 100 }} />
            <div className="skeleton" style={{ height: 22, width: 56, borderRadius: 100 }} />
          </div>
          <div className="skeleton" style={{ height: 40, width: '55%', marginBottom: 12 }} />
          <div className="skeleton" style={{ height: 14, width: '80%', marginBottom: 4 }} />
          <div className="skeleton" style={{ height: 14, width: '60%' }} />
        </div>

        {/* Progress bar */}
        <div style={{ marginBottom: 40, maxWidth: 520 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
            <div className="skeleton" style={{ height: 14, width: 140 }} />
            <div className="skeleton" style={{ height: 14, width: 32 }} />
          </div>
          <div className="skeleton" style={{ height: 3, width: '100%' }} />
        </div>

        <hr style={{ border: 'none', borderTop: '1px solid var(--line)', marginBottom: 32 }} />

        <div className="skeleton" style={{ height: 11, width: 80, marginBottom: 20 }} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 16,
                padding: '16px 20px',
                border: '1px solid var(--line)',
                borderRadius: 4,
              }}
            >
              <div className="skeleton" style={{ width: 28, height: 28, borderRadius: '50%', flexShrink: 0 }} />
              <div className="skeleton" style={{ height: 14, flex: 1, maxWidth: 280 }} />
              <div className="skeleton" style={{ height: 30, width: 80, borderRadius: 2, flexShrink: 0 }} />
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}
