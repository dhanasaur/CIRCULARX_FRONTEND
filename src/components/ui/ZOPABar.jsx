import { useEffect, useState } from 'react';

export default function ZOPABar({ floorPrice, ceilingPrice, marketRef, agreedPrice, proposedPrice, currency = 'USD' }) {
  const [reveal, setReveal] = useState(false);
  useEffect(() => { setTimeout(() => setReveal(true), 200); }, []);

  const min = Math.min(floorPrice, ceilingPrice, marketRef) * 0.9;
  const max = Math.max(floorPrice, ceilingPrice, marketRef) * 1.1;
  const range = max - min;
  const toPercent = (v) => ((v - min) / range) * 100;

  const zopaLeft = toPercent(floorPrice);
  const zopaRight = toPercent(ceilingPrice);
  const zopaWidth = zopaRight - zopaLeft;

  const fmt = (v) => `${currency} ${v.toLocaleString()}`;

  return (
    <div style={{ padding: '16px 0' }}>
      <div style={{ position: 'relative', height: 48, marginBottom: 32 }}>
        {/* Track */}
        <div style={{ position: 'absolute', top: 20, left: 0, right: 0, height: 8, background: 'rgba(255,255,255,0.06)', borderRadius: 4 }} />
        {/* ZOPA Zone */}
        <div style={{
          position: 'absolute', top: 16, height: 16, borderRadius: 8,
          left: `${zopaLeft}%`,
          width: reveal ? `${zopaWidth}%` : '0%',
          background: 'linear-gradient(90deg, rgba(184,245,60,0.25), rgba(184,245,60,0.15))',
          border: '1px solid rgba(184,245,60,0.3)',
          transition: 'width 1s cubic-bezier(0.16,1,0.3,1)',
        }} />
        {/* Floor Price Marker */}
        <Marker left={zopaLeft} label="Floor" value={fmt(floorPrice)} color="#B8F53C" position="top" />
        {/* Ceiling Price Marker */}
        <Marker left={zopaRight} label="Ceiling" value={fmt(ceilingPrice)} color="#38BDF8" position="top" />
        {/* Market Ref */}
        <Marker left={toPercent(marketRef)} label="Market Ref" value={fmt(marketRef)} color="#94A3B8" position="bottom" dashed />
        {/* Agreed/Proposed Price */}
        {(agreedPrice || proposedPrice) && (
          <Marker
            left={toPercent(agreedPrice || proposedPrice)}
            label={agreedPrice ? 'Agreed' : 'Proposed'}
            value={fmt(agreedPrice || proposedPrice)}
            color={agreedPrice ? '#B8F53C' : '#F59E0B'}
            position="bottom"
            highlight
          />
        )}
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'rgba(255,255,255,0.35)', fontFamily: 'var(--font-mono)' }}>
        <span>ZOPA Width: {fmt(ceilingPrice - floorPrice)}</span>
        <span>{agreedPrice ? `Agreed at ${((agreedPrice - floorPrice) / (ceilingPrice - floorPrice) * 100).toFixed(0)}% of ZOPA` : 'Negotiating...'}</span>
      </div>
    </div>
  );
}

function Marker({ left, label, value, color, position = 'top', dashed, highlight }) {
  return (
    <div style={{ position: 'absolute', left: `${left}%`, top: 0, bottom: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', transform: 'translateX(-50%)', zIndex: highlight ? 5 : 2 }}>
      <div style={{
        position: 'absolute',
        top: position === 'top' ? -28 : 'auto',
        bottom: position === 'bottom' ? -28 : 'auto',
        textAlign: 'center', whiteSpace: 'nowrap',
      }}>
        <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.45)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 1 }}>{label}</div>
        <div style={{ fontSize: 11, color, fontFamily: 'var(--font-mono)', fontWeight: 600 }}>{value}</div>
      </div>
      <div style={{
        position: 'absolute', top: 12, width: highlight ? 12 : 2, height: highlight ? 24 : 24,
        background: highlight ? color : dashed ? 'transparent' : color,
        borderLeft: dashed ? `2px dashed ${color}` : 'none',
        borderRadius: highlight ? 6 : 1,
        boxShadow: highlight ? `0 0 12px ${color}40` : 'none',
      }} />
    </div>
  );
}
