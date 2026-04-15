import React from 'react';

export default function DGrid({ items, cols = 5 }) {
  // Use auto-fit so the last item expands to fill rather than leaving an empty ghost cell
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(auto-fit, minmax(140px, 1fr))`,
        gap: '1px',
        background: '#0d1b2e',
        marginTop: '2.5rem',
      }}
    >
      {items.map((item, i) => (
        <div
          key={i}
          style={{
            background: '#080e1a',
            padding: '1.5rem',
          }}
        >
          <div style={{ fontSize: '1.8rem', fontWeight: 400, color: '#64b5f6', marginBottom: '0.4rem' }}>
            {item.value}
          </div>
          <div style={{ fontSize: '0.72rem', color: '#6a85b0', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            {item.label}
          </div>
        </div>
      ))}
    </div>
  );
}