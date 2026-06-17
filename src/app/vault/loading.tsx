import AppNav from '@/components/AppNav'

export default function Loading() {
  return (
    <div style={{ background: 'var(--paper)' }}>
      <AppNav />
      <div style={{
        display: 'grid',
        gridTemplateColumns: '260px 1fr',
        height: 'calc(100vh - 56px)',
        overflow: 'hidden',
      }}>
        <aside style={{
          borderRight: '1px solid var(--line)',
          padding: '14px',
          display: 'flex',
          flexDirection: 'column',
          gap: 10,
        }}>
          <div className="skeleton" style={{ height: 36, borderRadius: 2 }} />
          {[0, 1, 2, 3, 4].map(i => (
            <div key={i} className="skeleton" style={{ height: 50, borderRadius: 2 }} />
          ))}
        </aside>
        <main style={{ padding: '36px 40px', display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="skeleton" style={{ height: 44, width: '55%', borderRadius: 2 }} />
          <div className="skeleton" style={{ height: 18, width: '25%', borderRadius: 2 }} />
          <div className="skeleton" style={{ height: 1 }} />
          <div className="skeleton" style={{ height: 200, borderRadius: 2 }} />
        </main>
      </div>
    </div>
  )
}
