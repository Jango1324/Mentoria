export default function OpportunitiesLoading() {
  return (
    <div style={{ background: 'var(--paper)', minHeight: '100vh' }}>
      <div style={{ borderBottom: '1px solid var(--line)', height: 56 }} />
      <main className="container" style={{ padding: '48px 24px' }}>
        <div className="skeleton" style={{ height: 11, width: 80, marginBottom: 14 }} />
        <div className="skeleton" style={{ height: 36, width: 260, marginBottom: 40 }} />

        {/* Filter bar skeleton */}
        <div style={{ display: 'flex', gap: 12, marginBottom: 48 }}>
          <div className="skeleton" style={{ height: 40, width: 220, borderRadius: 2 }} />
          <div className="skeleton" style={{ height: 40, width: 160, borderRadius: 2 }} />
        </div>

        <div className="skeleton" style={{ height: 11, width: 100, marginBottom: 24 }} />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="card-flat" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ display: 'flex', gap: 6 }}>
                <div className="skeleton" style={{ height: 22, width: 64, borderRadius: 100 }} />
                <div className="skeleton" style={{ height: 22, width: 48, borderRadius: 100 }} />
              </div>
              <div className="skeleton" style={{ height: 22, width: '80%' }} />
              <div className="skeleton" style={{ height: 14, width: '100%', marginBottom: 2 }} />
              <div className="skeleton" style={{ height: 14, width: '65%' }} />
              <div style={{ marginTop: 'auto', paddingTop: 8 }}>
                <div className="skeleton" style={{ height: 32, width: 88, borderRadius: 2, marginLeft: 'auto' }} />
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}
