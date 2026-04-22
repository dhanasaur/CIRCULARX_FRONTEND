import { useState } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, Clock, Eye, MessageSquare, ArrowUpRight, CheckCircle, X, FileWarning } from 'lucide-react';
import { disputes } from '../../mock/inspections';

const fadeUp = { hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0 } };
const stagger = { visible: { transition: { staggerChildren: 0.06 } } };

const resolvedHistory = [
  { id: 'DSP-H01', txn: 'TXN-012', material: 'PVC Pipe Scrap', resolution: 'FAVOR_BUYER', amount: '$2,100', date: '2025-02-18', days: 6 },
  { id: 'DSP-H02', txn: 'TXN-008', material: 'Kraft Paper Pulp', resolution: 'PARTIAL', amount: '$890 of $1,400', date: '2025-02-10', days: 9 },
  { id: 'DSP-H03', txn: 'TXN-015', material: 'Steel Turnings', resolution: 'FAVOR_SELLER', amount: '$3,200', date: '2025-01-28', days: 4 },
];

export default function QCDisputes() {
  const [selected, setSelected] = useState(null);
  const [resolveForm, setResolveForm] = useState({ decision: '', amount: '', notes: '' });
  const [toast, setToast] = useState('');

  const handleResolve = () => {
    setToast(`Dispute ${selected.id} resolved: ${resolveForm.decision}`);
    setSelected(null);
    setResolveForm({ decision: '', amount: '', notes: '' });
    setTimeout(() => setToast(''), 3000);
  };

  return (
    <motion.div initial="hidden" animate="visible" variants={stagger}>
      {toast && <div style={{ position: 'fixed', top: 24, right: 24, zIndex: 200, padding: '12px 20px', borderRadius: 10, background: '#B8F53C', color: '#0D2B1E', fontSize: 13, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 8, boxShadow: '0 8px 30px rgba(184,245,60,0.3)' }}><CheckCircle size={14} /> {toast}</div>}

      <motion.div variants={fadeUp} style={{ marginBottom: 24 }}>
        <h1 className="dash-h1" style={{ marginBottom: 6 }}>Dispute Cases</h1>
        <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)' }}>{disputes.length} active · {resolvedHistory.length} resolved this quarter</p>
      </motion.div>

      {/* Active Disputes */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 32 }}>
        {disputes.map(d => (
          <motion.div key={d.id} variants={fadeUp} style={{
            padding: 24, borderRadius: 14,
            background: d.status === 'MEDIATION' ? 'rgba(239,68,68,0.03)' : 'rgba(245,158,11,0.03)',
            border: `1px solid ${d.status === 'MEDIATION' ? 'rgba(239,68,68,0.12)' : 'rgba(245,158,11,0.12)'}`,
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12, flexWrap: 'wrap', gap: 12 }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                  <span style={{ fontSize: 13, fontFamily: 'var(--font-mono)', color: '#FB7185', fontWeight: 600 }}>{d.id}</span>
                  <span style={{ fontSize: 10, padding: '2px 8px', borderRadius: 4, background: d.tier >= 2 ? 'rgba(239,68,68,0.1)' : 'rgba(245,158,11,0.1)', color: d.tier >= 2 ? '#FB7185' : '#F59E0B', fontFamily: 'var(--font-mono)', fontWeight: 600 }}>TIER {d.tier}</span>
                  <span style={{ fontSize: 10, padding: '2px 8px', borderRadius: 4, background: 'rgba(255,255,255,0.04)', color: 'rgba(255,255,255,0.5)', fontFamily: 'var(--font-mono)' }}>{d.status}</span>
                </div>
                <div style={{ fontSize: 16, fontWeight: 600, color: '#fff', marginBottom: 4 }}>{d.materialName}</div>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)' }}>{d.transactionId} · {d.sellerName} → {d.buyerName}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 18, fontFamily: 'var(--font-mono)', fontWeight: 700, color: '#F59E0B' }}>${d.escrowAmount.toLocaleString()}</div>
                <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)' }}>Escrow Held</div>
              </div>
            </div>
            <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', marginBottom: 16, lineHeight: 1.5 }}>{d.description}</p>
            {d.tier2 && <div style={{ padding: 12, borderRadius: 8, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)', marginBottom: 14, fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>
              <span style={{ fontWeight: 600, color: 'rgba(255,255,255,0.6)' }}>Mediator:</span> {d.tier2.mediatorName} · Deadline: {new Date(d.tier2.deadline).toLocaleDateString()}
            </div>}
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <button onClick={() => setSelected(d)} style={{ padding: '8px 16px', borderRadius: 6, background: 'rgba(255,255,255,0.04)', color: '#fff', border: '1px solid rgba(255,255,255,0.08)', cursor: 'pointer', fontSize: 12, fontWeight: 600, fontFamily: 'var(--font-body)', display: 'flex', alignItems: 'center', gap: 6 }}><Eye size={12} /> View Evidence</button>
              <button onClick={() => setSelected(d)} style={{ padding: '8px 16px', borderRadius: 6, background: '#B8F53C', color: '#0D2B1E', border: 'none', cursor: 'pointer', fontSize: 12, fontWeight: 700, fontFamily: 'var(--font-body)', display: 'flex', alignItems: 'center', gap: 6 }}><CheckCircle size={12} /> Resolve</button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Resolved History */}
      <motion.div variants={fadeUp} style={{ padding: 24, borderRadius: 14, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
        <h3 style={{ fontSize: 14, fontWeight: 600, color: 'rgba(255,255,255,0.7)', marginBottom: 16 }}>Resolved History</h3>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead><tr>{['ID', 'Material', 'Resolution', 'Amount', 'Duration', 'Date'].map(h => (
              <th key={h} style={{ textAlign: 'left', padding: '8px 12px', fontSize: 10, fontWeight: 600, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>{h}</th>
            ))}</tr></thead>
            <tbody>{resolvedHistory.map(r => (
              <tr key={r.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.015)'}
                onMouseLeave={e => e.currentTarget.style.background = ''}>
                <td style={{ padding: '10px 12px', fontSize: 12, fontFamily: 'var(--font-mono)', color: 'rgba(255,255,255,0.5)' }}>{r.id}</td>
                <td style={{ padding: '10px 12px', fontSize: 13, color: '#fff' }}>{r.material}</td>
                <td style={{ padding: '10px 12px' }}><span style={{ fontSize: 10, padding: '2px 8px', borderRadius: 4, fontFamily: 'var(--font-mono)', fontWeight: 600, background: r.resolution === 'FAVOR_BUYER' ? 'rgba(56,189,248,0.1)' : r.resolution === 'FAVOR_SELLER' ? 'rgba(184,245,60,0.1)' : 'rgba(245,158,11,0.1)', color: r.resolution === 'FAVOR_BUYER' ? '#38BDF8' : r.resolution === 'FAVOR_SELLER' ? '#B8F53C' : '#F59E0B' }}>{r.resolution.replace(/_/g, ' ')}</span></td>
                <td style={{ padding: '10px 12px', fontSize: 12, fontFamily: 'var(--font-mono)', color: 'rgba(255,255,255,0.6)' }}>{r.amount}</td>
                <td style={{ padding: '10px 12px', fontSize: 12, fontFamily: 'var(--font-mono)', color: 'rgba(255,255,255,0.4)' }}>{r.days}d</td>
                <td style={{ padding: '10px 12px', fontSize: 12, fontFamily: 'var(--font-mono)', color: 'rgba(255,255,255,0.3)' }}>{r.date}</td>
              </tr>
            ))}</tbody>
          </table>
        </div>
      </motion.div>

      {/* Resolution Modal */}
      {selected && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, background: 'rgba(6,15,9,0.85)', backdropFilter: 'blur(8px)' }} onClick={() => setSelected(null)}>
          <div style={{ maxWidth: 560, width: '100%', maxHeight: '85vh', overflow: 'auto', padding: 32, borderRadius: 16, background: 'rgba(6,15,9,0.96)', border: '1px solid rgba(255,255,255,0.08)' }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 24 }}>
              <div><h2 style={{ fontFamily: 'var(--font-display)', fontSize: 20, color: '#fff', marginBottom: 4 }}>Resolve {selected.id}</h2><span style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>{selected.materialName}</span></div>
              <button onClick={() => setSelected(null)} style={{ background: 'rgba(255,255,255,0.06)', border: 'none', borderRadius: 6, padding: 6, cursor: 'pointer', color: 'rgba(255,255,255,0.5)' }}><X size={18} /></button>
            </div>
            <div style={{ marginBottom: 20 }}>
              <label style={{ fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.4)', display: 'block', marginBottom: 8, textTransform: 'uppercase' }}>Resolution Decision</label>
              <div style={{ display: 'flex', gap: 8 }}>{[['FAVOR_BUYER', 'Favor Buyer'], ['FAVOR_SELLER', 'Favor Seller'], ['PARTIAL', 'Partial Settlement']].map(([v, l]) => (
                <button key={v} onClick={() => setResolveForm(f => ({...f, decision: v}))} style={{ flex: 1, padding: '10px', borderRadius: 8, background: resolveForm.decision === v ? 'rgba(184,245,60,0.1)' : 'rgba(255,255,255,0.03)', color: resolveForm.decision === v ? '#B8F53C' : 'rgba(255,255,255,0.4)', border: `1px solid ${resolveForm.decision === v ? 'rgba(184,245,60,0.2)' : 'rgba(255,255,255,0.06)'}`, cursor: 'pointer', fontSize: 12, fontWeight: 600, fontFamily: 'var(--font-body)' }}>{l}</button>
              ))}</div>
            </div>
            {resolveForm.decision === 'PARTIAL' && <div style={{ marginBottom: 20 }}>
              <label style={{ fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.4)', display: 'block', marginBottom: 6, textTransform: 'uppercase' }}>Settlement Amount ($)</label>
              <input value={resolveForm.amount} onChange={e => setResolveForm(f => ({...f, amount: e.target.value}))} style={{ width: '100%', padding: '10px 14px', borderRadius: 8, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: '#fff', fontSize: 13, fontFamily: 'var(--font-mono)', outline: 'none', boxSizing: 'border-box' }} placeholder={`Max: $${selected.escrowAmount}`} />
            </div>}
            <div style={{ marginBottom: 20 }}>
              <label style={{ fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.4)', display: 'block', marginBottom: 6, textTransform: 'uppercase' }}>Resolution Notes</label>
              <textarea value={resolveForm.notes} onChange={e => setResolveForm(f => ({...f, notes: e.target.value}))} style={{ width: '100%', padding: '10px 14px', borderRadius: 8, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: '#fff', fontSize: 13, fontFamily: 'var(--font-body)', outline: 'none', boxSizing: 'border-box', height: 80, resize: 'none' }} />
            </div>
            <button onClick={handleResolve} disabled={!resolveForm.decision} style={{ width: '100%', padding: '12px', borderRadius: 8, background: resolveForm.decision ? '#B8F53C' : 'rgba(255,255,255,0.06)', color: resolveForm.decision ? '#0D2B1E' : 'rgba(255,255,255,0.2)', border: 'none', cursor: resolveForm.decision ? 'pointer' : 'default', fontSize: 14, fontWeight: 700, fontFamily: 'var(--font-body)' }}>Submit Resolution</button>
          </div>
        </div>
      )}
    </motion.div>
  );
}
