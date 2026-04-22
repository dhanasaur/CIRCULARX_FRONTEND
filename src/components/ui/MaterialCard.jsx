import { useState } from 'react';
import MQSRing from './MQSRing';
import StatusBadge from './StatusBadge';
import { differenceInDays } from 'date-fns';
import { MapPin, Clock, ArrowRight } from 'lucide-react';

const statusColorMap = {
  ACTIVE: 'lime', BUYER_INTERESTED: 'info', PRICE_PROPOSED: 'amber', AGREED: 'lime',
  LOCKED: 'lime', ESCROW_LOCKED: 'lime', QAR_PENDING: 'amber', COMPLETED: 'lime',
  SETTLED: 'lime', DISPUTED: 'danger', BLOCKED: 'danger',
};

const routeColors = { Direct: '#B8F53C', Mediated: '#F59E0B', 'Reverse Auction': '#38BDF8', BLOCKED: '#EF4444' };

export default function MaterialCard({ listing, onAction, actionLabel = 'Express Interest', showAction = true }) {
  const [showInterest, setShowInterest] = useState(true);
  const daysToExpiry = listing.expiryDate ? differenceInDays(new Date(listing.expiryDate), new Date()) : null;
  const isUrgent = daysToExpiry !== null && daysToExpiry <= 2;
  const isWarning = daysToExpiry !== null && daysToExpiry <= 7 && daysToExpiry > 2;

  return (
    <div
      style={{
        padding: 20, borderRadius: 14, display: 'flex', flexDirection: 'column',
        background: isUrgent
          ? 'linear-gradient(135deg, rgba(239,68,68,0.04), rgba(0,0,0,0) 60%), linear-gradient(135deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.01) 100%)'
          : 'linear-gradient(135deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.01) 100%)',
        border: `1px solid ${isUrgent ? 'rgba(239,68,68,0.15)' : 'rgba(255,255,255,0.08)'}`,
        backdropFilter: 'blur(16px)',
        boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.06), 0 4px 24px rgba(0,0,0,0.2)',
        transition: 'all 0.3s cubic-bezier(0.4,0,0.2,1)',
        position: 'relative', overflow: 'hidden',
      }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(184,245,60,0.25)'; e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 0 32px rgba(184,245,60,0.08), inset 0 1px 0 rgba(255,255,255,0.06), 0 8px 32px rgba(0,0,0,0.3)'; }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = isUrgent ? 'rgba(239,68,68,0.15)' : 'rgba(255,255,255,0.08)'; e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = 'inset 0 1px 0 rgba(255,255,255,0.06), 0 4px 24px rgba(0,0,0,0.2)'; }}
    >
      {/* Top: Name + MQS */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: '#fff', marginBottom: 4, fontFamily: 'var(--font-display)' }}>{listing.materialName}</div>
          <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.35)', fontFamily: 'var(--font-mono)', letterSpacing: '0.04em' }}>{listing.hsCode} · {listing.category}</div>
        </div>
        <MQSRing score={listing.mqsScore} size={48} strokeWidth={3} />
      </div>

      {/* Badges Row */}
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 14 }}>
        <StatusBadge status={listing.status} color={statusColorMap[listing.status]} size="xs" />
        <span style={{
          fontSize: 10, padding: '2px 8px', borderRadius: 6, fontWeight: 700, letterSpacing: '.04em',
          background: `${routeColors[listing.route] || '#64748B'}12`,
          color: routeColors[listing.route] || '#64748B',
          border: `1px solid ${routeColors[listing.route] || '#64748B'}25`,
          fontFamily: 'var(--font-mono)',
        }}>
          {listing.route}
        </span>
      </div>

      {/* Data Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6, fontSize: 12, marginBottom: 14, flex: 1 }}>
        <div>
          <span className="dash-micro-label" style={{ marginBottom: 2, display: 'block' }}>Quantity</span>
          <span style={{ color: '#fff', fontFamily: 'var(--font-mono)', fontWeight: 700 }}>{listing.quantity} {listing.unit}</span>
        </div>
        <div>
          <span className="dash-micro-label" style={{ marginBottom: 2, display: 'block' }}>Floor Price</span>
          <span style={{ color: '#B8F53C', fontFamily: 'var(--font-mono)', fontWeight: 700, textShadow: '0 0 12px rgba(184,245,60,0.2)' }}>${listing.floorPrice}/{listing.unit}</span>
        </div>
      </div>

      {/* Footer: Location + Expiry */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: 'rgba(255,255,255,0.35)' }}>
          <MapPin size={11} style={{ color: 'rgba(255,255,255,0.25)' }} /> {listing.location}
        </div>
        {daysToExpiry !== null && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: 4, fontSize: 11,
            fontFamily: 'var(--font-mono)', fontWeight: 700,
            color: isUrgent ? '#EF4444' : isWarning ? '#F59E0B' : 'rgba(255,255,255,0.35)',
          }}>
            <Clock size={11} /> {daysToExpiry > 0 ? `${daysToExpiry}d` : 'Expired'}
          </div>
        )}
      </div>

      {/* CTA */}
      {showAction && listing.status !== 'BLOCKED' && (
        <div style={{ display: 'flex', gap: 8, marginTop: 14 }}>
          <button
            onClick={() => onAction?.(listing)}
            style={{
              flex: 1, padding: '10px 0',
              background: 'rgba(184,245,60,0.08)', color: '#B8F53C',
              border: '1px solid rgba(184,245,60,0.2)', borderRadius: 8,
              fontSize: 12, fontWeight: 700, cursor: 'pointer',
              transition: 'all 0.25s cubic-bezier(0.4,0,0.2,1)',
              fontFamily: 'var(--font-mono)', letterSpacing: '0.04em', textTransform: 'uppercase',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
            }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(184,245,60,0.15)'; e.currentTarget.style.borderColor = 'rgba(184,245,60,0.35)'; e.currentTarget.style.boxShadow = '0 0 16px rgba(184,245,60,0.1)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(184,245,60,0.08)'; e.currentTarget.style.borderColor = 'rgba(184,245,60,0.2)'; e.currentTarget.style.boxShadow = ''; }}
          >
            {actionLabel} <ArrowRight size={12} />
          </button>

          {showInterest && (
            <button
              onClick={() => setShowInterest(false)}
              style={{
                flex: 1, padding: '10px 0',
                background: 'rgba(56,189,248,0.08)', color: '#38BDF8',
                border: '1px solid rgba(56,189,248,0.2)', borderRadius: 8,
                fontSize: 12, fontWeight: 700, cursor: 'pointer',
                transition: 'all 0.25s cubic-bezier(0.4,0,0.2,1)',
                fontFamily: 'var(--font-mono)', letterSpacing: '0.04em', textTransform: 'uppercase',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
              }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(56,189,248,0.15)'; e.currentTarget.style.borderColor = 'rgba(56,189,248,0.35)'; e.currentTarget.style.boxShadow = '0 0 16px rgba(56,189,248,0.1)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(56,189,248,0.08)'; e.currentTarget.style.borderColor = 'rgba(56,189,248,0.2)'; e.currentTarget.style.boxShadow = ''; }}
            >
              Show Interest
            </button>
          )}
        </div>
      )}
    </div>
  );
}
