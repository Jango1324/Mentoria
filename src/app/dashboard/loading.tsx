export default function DashboardLoading() {
  return (
    <div style={{ background: 'var(--paper)', minHeight: '100vh' }}>
      <div style={{ borderBottom: '1px solid var(--line)', height: 56 }} />
      <main className="container" style={{ padding: '48px 24px', maxWidth: 860 }}>
        <div className="skeleton" style={{ height: 11, width: 80, marginBottom: 14 }} />
        <div className="skeleton" style={{ height: 36, width: 220, marginBottom: 56 }} />

        <div className="skeleton" style={{ height: 11, width: 72, marginBottom: 16 }} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 48 }}>
          {[1, 2].map((i) => (
            <div key={i} className="card-flat" style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <div className="skeleton" style={{ width: 44, height: 44, borderRadius: '50%', flexShrink: 0 }} />
              <div style={{ flex: 1 }}>
                <div className="skeleton" style={{ height: 14, width: '55%', marginBottom: 8 }} />
                <div className="skeleton" style={{ height: 11, width: '30%' }} />
              </div>
            </div>
          ))}
        </div>

        <div className="skeleton" style={{ height: 11, width: 80, marginBottom: 16 }} />
        <div className="card-flat" style={{ padding: 0 }}>
          {[1, 2, 3].map((i) => (
            <div key={i} style={{ padding: '14px 20px', borderBottom: '1px solid var(--line)' }}>
              <div className="skeleton" style={{ height: 14, width: '60%', marginBottom: 6 }} />
              <div className="skeleton" style={{ height: 11, width: '25%' }} />
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}
