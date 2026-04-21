import { motion } from 'framer-motion';
import MQSRing from '../../components/ui/MQSRing';
import StatusBadge from '../../components/ui/StatusBadge';
import { listings } from '../../mock/listings';
import { Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { differenceInDays } from 'date-fns';

const fadeUp = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.4 } } };
const stColors = { ACTIVE: 'lime', BUYER_INTERESTED: 'info', PRICE_PROPOSED: 'amber', AGREED: 'lime', LOCKED: 'lime', ESCROW_LOCKED: 'lime', QAR_PENDING: 'amber', COMPLETED: 'lime', SETTLED: 'lime', BLOCKED: 'danger' };

export default function SellerListings() {
  const sellerListings = listings.filter(l => l.sellerId === 'USR-S-001');
  return (
    <motion.div initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.08 } } }}>
      <motion.div variants={fadeUp} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 700, color: '#fff', marginBottom: 4 }}>My Listings</h1>
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)' }}>{sellerListings.length} materials listed</p>
        </div>
        <Link to="/seller/submit" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '10px 20px', borderRadius: 'var(--radius-btn)', background: '#B8F53C', color: 'var(--color-brand-dark)', fontSize: 13, fontWeight: 700, textDecoration: 'none', fontFamily: 'var(--font-body)' }}>
          <Plus size={16} /> Submit Material
        </Link>
      </motion.div>

      <motion.div variants={fadeUp} className="glass-card" style={{ overflow: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, minWidth: 900 }} className="data-table">
          <thead>
            <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
              {['Material', 'MQS', 'Qty', 'Route', 'Status', 'Floor Price', 'Expiry', 'Listed'].map(h => (
                <th key={h} style={{ padding: '12px 14px', textAlign: 'left', color: 'rgba(255,255,255,0.4)', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', whiteSpace: 'nowrap' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sellerListings.map(l => {
              const daysLeft = l.expiryDate ? differenceInDays(new Date(l.expiryDate), new Date()) : null;
              return (
                <tr key={l.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)', cursor: 'pointer' }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(184,245,60,0.03)'}
                  onMouseLeave={e => e.currentTarget.style.background = ''}>
                  <td style={{ padding: '14px' }}>
                    <div style={{ fontWeight: 600, color: '#fff', marginBottom: 2 }}>{l.materialName}</div>
                    <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', fontFamily: 'var(--font-mono)' }}>{l.id} · {l.hsCode}</div>
                  </td>
                  <td style={{ padding: '14px' }}><MQSRing score={l.mqsScore} size={36} strokeWidth={3} /></td>
                  <td style={{ padding: '14px', fontFamily: 'var(--font-mono)', color: '#fff' }}>{l.quantity} {l.unit}</td>
                  <td style={{ padding: '14px' }}><span style={{ fontSize: 11, color: l.route === 'Direct' ? '#B8F53C' : '#F59E0B', fontFamily: 'var(--font-mono)', fontWeight: 600 }}>{l.route}</span></td>
                  <td style={{ padding: '14px' }}><StatusBadge status={l.status} color={stColors[l.status]} size="xs" /></td>
                  <td style={{ padding: '14px', fontFamily: 'var(--font-mono)', color: '#B8F53C' }}>${l.floorPrice}/{l.unit}</td>
                  <td style={{ padding: '14px', fontFamily: 'var(--font-mono)', fontSize: 12, color: daysLeft !== null && daysLeft <= 2 ? '#EF4444' : daysLeft !== null && daysLeft <= 7 ? '#F59E0B' : 'rgba(255,255,255,0.5)' }}>{daysLeft !== null ? `${daysLeft}d` : '—'}</td>
                  <td style={{ padding: '14px', fontFamily: 'var(--font-mono)', fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>{new Date(l.listedDate).toLocaleDateString()}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </motion.div>
    </motion.div>
  );
}
