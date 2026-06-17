export default function CoursesLoading() {
  return (
    <div style={{ background: 'var(--paper)', minHeight: '100vh' }}>
      <div style={{ borderBottom: '1px solid var(--line)', height: 56 }} />
      <main className="container" style={{ padding: '48px 24px' }}>
        <div className="skeleton" style={{ height: 11, width: 64, marginBottom: 14 }} />
        <div className="skeleton" style={{ height: 36, width: 140, marginBottom: 8 }} />
        <div className="skeleton" style={{ height: 14, width: 200, marginBottom: 40 }} />

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 20 }}>
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="card-flat" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ display: 'flex', gap: 6 }}>
                <div className="skeleton" style={{ height: 22, width: 72, borderRadius: 100 }} />
              </div>
              <div className="skeleton" style={{ height: 22, width: '75%' }} />
              <div className="skeleton" style={{ height: 14, width: '100%', marginBottom: 2 }} />
              <div className="skeleton" style={{ height: 14, width: '50%' }} />
              <div style={{ marginTop: 'auto', paddingTop: 8 }}>
                <div className="skeleton" style={{ height: 11, width: '50%', marginBottom: 6 }} />
                <div className="skeleton" style={{ height: 3, width: '100%' }} />
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}
