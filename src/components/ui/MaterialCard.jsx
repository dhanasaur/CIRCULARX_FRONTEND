import MQSRing from './MQSRing';
import StatusBadge from './StatusBadge';
import { differenceInDays } from 'date-fns';
import { MapPin, Clock } from 'lucide-react';

const statusColorMap = {
  ACTIVE: 'lime', BUYER_INTERESTED: 'info', PRICE_PROPOSED: 'amber', AGREED: 'lime',
  LOCKED: 'lime', ESCROW_LOCKED: 'lime', QAR_PENDING: 'amber', COMPLETED: 'lime',
  SETTLED: 'lime', DISPUTED: 'danger', BLOCKED: 'danger',
};

const routeColors = { Direct: '#B8F53C', Mediated: '#F59E0B', 'Reverse Auction': '#38BDF8', BLOCKED: '#EF4444' };

export default function MaterialCard({ listing, onAction, actionLabel = 'Express Interest', showAction = true }) {
  const daysToExpiry = listing.expiryDate ? differenceInDays(new Date(listing.expiryDate), new Date()) : null;
  const urgencyClass = daysToExpiry !== null && daysToExpiry <= 2 ? 'urgency-red' : daysToExpiry !== null && daysToExpiry <= 7 ? 'urgency-amber' : '';

  return (
    <div
      className={`glass-card ${urgencyClass}`}
      style={{ padding: 20, transition: 'box-shadow 0.3s ease, transform 0.2s ease', display: 'flex', flexDirection: 'column' }}
      onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 0 20px rgba(184,245,60,0.15)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
      onMouseLeave={e => { e.currentTarget.style.boxShadow = ''; e.currentTarget.style.transform = ''; }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 15, fontWeight: 600, color: '#fff', marginBottom: 4 }}>{listing.materialName}</div>
          <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', fontFamily: 'var(--font-mono)' }}>{listing.hsCode} · {listing.category}</div>
        </div>
        <MQSRing score={listing.mqsScore} size={48} strokeWidth={3} />
      </div>

      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 12 }}>
        <StatusBadge status={listing.status} color={statusColorMap[listing.status]} size="xs" />
        <span style={{ fontSize: 10, padding: '2px 8px', borderRadius: 'var(--radius-badge)', background: `${routeColors[listing.route] || '#64748B'}15`, color: routeColors[listing.route] || '#64748B', border: `1px solid ${routeColors[listing.route] || '#64748B'}30`, fontFamily: 'var(--font-mono)', fontWeight: 600 }}>
          {listing.route}
        </span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, fontSize: 12, marginBottom: 12, flex: 1 }}>
        <div><span style={{ color: 'rgba(255,255,255,0.35)' }}>Qty: </span><span style={{ color: '#fff', fontFamily: 'var(--font-mono)' }}>{listing.quantity} {listing.unit}</span></div>
        <div><span style={{ color: 'rgba(255,255,255,0.35)' }}>Floor: </span><span style={{ color: '#B8F53C', fontFamily: 'var(--font-mono)' }}>${listing.floorPrice}/{listing.unit}</span></div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: 'rgba(255,255,255,0.35)' }}>
          <MapPin size={12} /> {listing.location}
        </div>
        {daysToExpiry !== null && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, fontFamily: 'var(--font-mono)', color: daysToExpiry <= 2 ? '#EF4444' : daysToExpiry <= 7 ? '#F59E0B' : 'rgba(255,255,255,0.35)' }}>
            <Clock size={12} /> {daysToExpiry > 0 ? `${daysToExpiry}d` : 'Expired'}
          </div>
        )}
      </div>

      {showAction && listing.status !== 'BLOCKED' && (
        <button
          onClick={() => onAction?.(listing)}
          style={{
            marginTop: 12, width: '100%', padding: '10px 0', background: 'rgba(184,245,60,0.1)', color: '#B8F53C',
            border: '1px solid rgba(184,245,60,0.25)', borderRadius: 'var(--radius-btn)', fontSize: 13, fontWeight: 600,
            cursor: 'pointer', transition: 'all 0.2s ease', fontFamily: 'var(--font-body)',
          }}
          onMouseEnter={e => { e.target.style.background = 'rgba(184,245,60,0.2)'; }}
          onMouseLeave={e => { e.target.style.background = 'rgba(184,245,60,0.1)'; }}
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}
