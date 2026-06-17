export default function AdminLoading() {
  return (
    <div style={{ background: 'var(--paper)', minHeight: '100vh' }}>
      <div style={{ borderBottom: '1px solid var(--line)', height: 56 }} />
      <main className="container" style={{ padding: '48px 24px' }}>
        <div className="skeleton" style={{ height: 11, width: 88, marginBottom: 14 }} />
        <div className="skeleton" style={{ height: 36, width: 260, marginBottom: 48 }} />

        {/* Tab bar skeleton */}
        <div style={{ display: 'flex', borderBottom: '1px solid var(--line)', marginBottom: 36 }}>
          <div className="skeleton" style={{ height: 14, width: 100, margin: '12px 20px' }} />
          <div className="skeleton" style={{ height: 14, width: 80, margin: '12px 20px' }} />
        </div>

        {/* Header row */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <div className="skeleton" style={{ height: 11, width: 100 }} />
          <div className="skeleton" style={{ height: 34, width: 88, borderRadius: 2 }} />
        </div>

        {/* Item skeletons */}
        {[1, 2, 3].map((i) => (
          <div key={i} className="card-flat" style={{ padding: '20px 24px', marginBottom: 8 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', gap: 6, marginBottom: 10 }}>
                  <div className="skeleton" style={{ height: 22, width: 72, borderRadius: 100 }} />
                  <div className="skeleton" style={{ height: 22, width: 56, borderRadius: 100 }} />
                </div>
                <div className="skeleton" style={{ height: 15, width: '55%', marginBottom: 6 }} />
                <div className="skeleton" style={{ height: 13, width: '75%' }} />
              </div>
              <div style={{ display: 'flex', gap: 6 }}>
                <div className="skeleton" style={{ height: 30, width: 72, borderRadius: 2 }} />
                <div className="skeleton" style={{ height: 30, width: 60, borderRadius: 2 }} />
              </div>
            </div>
          </div>
        ))}
      </main>
    </div>
  )
}
