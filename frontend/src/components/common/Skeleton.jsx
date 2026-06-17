export default function Skeleton({ type = 'card', count = 1 }) {
  const cards = Array.from({ length: count });
  if (type === 'card') return cards.map((_, i) => (
    <div key={i} style={{ background: 'white', borderRadius: 16, overflow: 'hidden', border: '1px solid #e2e8f0' }}>
      <div className="skeleton" style={{ height: 220 }} />
      <div style={{ padding: 20 }}>
        <div className="skeleton" style={{ height: 20, width: '70%', marginBottom: 10 }} />
        <div className="skeleton" style={{ height: 14, width: '50%', marginBottom: 8 }} />
        <div className="skeleton" style={{ height: 14, width: '90%' }} />
      </div>
    </div>
  ));
  if (type === 'text') return (
    <div style={{ padding: '0 20px' }}>
      <div className="skeleton" style={{ height: 28, width: '60%', marginBottom: 12 }} />
      <div className="skeleton" style={{ height: 16, width: '80%', marginBottom: 8 }} />
      <div className="skeleton" style={{ height: 16, width: '50%' }} />
    </div>
  );
  if (type === 'image') return <div className="skeleton" style={{ height: 300, borderRadius: 16 }} />;
  return <div className="skeleton" style={{ height: 40, width: '100%', borderRadius: 8 }} />;
}
