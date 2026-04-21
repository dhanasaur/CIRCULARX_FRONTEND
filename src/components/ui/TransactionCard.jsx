import MQSRing from './MQSRing';
import StatusBadge from './StatusBadge';
import { differenceInDays } from 'date-fns';

const statusColorMap = {
  ACTIVE: 'lime', BUYER_INTERESTED: 'info', PRICE_PROPOSED: 'amber', AGREED: 'lime',
  LOCKED: 'lime', ESCROW_LOCKED: 'lime', QAR_PENDING: 'amber', COMPLETED: 'lime',
  SETTLED: 'lime', DISPUTED: 'danger', BLOCKED: 'danger',
};

export default function TransactionCard({ transaction, onClick }) {
  const daysToExpiry = transaction.expiryDate ? differenceInDays(new Date(transaction.expiryDate), new Date()) : null;
  const urgencyClass = daysToExpiry !== null && daysToExpiry <= 2 ? 'urgency-red' : daysToExpiry !== null && daysToExpiry <= 7 ? 'urgency-amber' : '';

  return (
    <div
      onClick={onClick}
      className={`glass-card ${urgencyClass}`}
      style={{
        padding: 16, cursor: 'pointer',
        transition: 'box-shadow 0.3s ease, transform 0.2s ease',
      }}
      onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 0 20px rgba(184,245,60,0.15)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
      onMouseLeave={e => { e.currentTarget.style.boxShadow = ''; e.currentTarget.style.transform = ''; }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: '#fff', marginBottom: 4, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {transaction.materialName}
          </div>
          <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', fontFamily: 'var(--font-mono)' }}>
            {transaction.id}
          </div>
        </div>
        <MQSRing score={transaction.mqsScore} size={40} strokeWidth={3} />
      </div>

      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 12 }}>
        <StatusBadge status={transaction.status} color={statusColorMap[transaction.status]} size="xs" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, fontSize: 12 }}>
        <div>
          <span style={{ color: 'rgba(255,255,255,0.35)' }}>Price: </span>
          <span style={{ color: '#fff', fontFamily: 'var(--font-mono)' }}>
            {transaction.agreedPrice ? `$${transaction.agreedPrice}` : 'Negotiating'}
          </span>
        </div>
        <div>
          <span style={{ color: 'rgba(255,255,255,0.35)' }}>Qty: </span>
          <span style={{ color: '#fff', fontFamily: 'var(--font-mono)' }}>
            {transaction.quantity} {transaction.unit}
          </span>
        </div>
      </div>

      {daysToExpiry !== null && (
        <div style={{ marginTop: 8, fontSize: 11, fontFamily: 'var(--font-mono)', color: daysToExpiry <= 2 ? '#EF4444' : daysToExpiry <= 7 ? '#F59E0B' : 'rgba(255,255,255,0.35)' }}>
          {daysToExpiry > 0 ? `${daysToExpiry}d to expiry` : 'Expired'}
        </div>
      )}
    </div>
  );
}
