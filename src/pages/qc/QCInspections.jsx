import { useState } from 'react';
import { motion } from 'framer-motion';
import StatusBadge from '../../components/ui/StatusBadge';
import MQSRing from '../../components/ui/MQSRing';
import { inspections } from '../../mock/inspections';
import { MapPin, Calendar, Clock, Search, Filter, CheckCircle, X } from 'lucide-react';

const fadeUp = { hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0 } };
const stagger = { visible: { transition: { staggerChildren: 0.06 } } };

const statusColors = { PENDING: 'amber', SCHEDULED: 'info', APPROVED: 'lime', DISCREPANCY: 'danger' };
const priorityColors = { LOW: 'slate', MEDIUM: 'info', HIGH: 'amber', CRITICAL: 'danger' };

export default function QCInspections() {
  const [filter, setFilter] = useState('ALL');
  const [search, setSearch] = useState('');
  const [selectedIns, setSelectedIns] = useState(null);

  const filtered = inspections
    .filter(i => filter === 'ALL' || i.status === filter)
    .filter(i => !search || i.materialName.toLowerCase().includes(search.toLowerCase()) || i.transactionId.toLowerCase().includes(search.toLowerCase()));

  return (
    <motion.div initial="hidden" animate="visible" variants={stagger}>
      <motion.div variants={fadeUp} transition={{ duration: 0.4 }} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 26, fontWeight: 800, color: '#fff', marginBottom: 6, letterSpacing: '-0.02em' }}>Inspection Queue</h1>
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)' }}>{filtered.length} inspections · {inspections.filter(i => i.status === 'PENDING').length} pending action</p>
        </div>
      </motion.div>

      {/* Filters */}
      <motion.div variants={fadeUp} transition={{ duration: 0.4 }} style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ position: 'relative', flex: '1 1 200px', maxWidth: 300 }}>
          <Search size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.3)' }} />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by material or TXN ID..."
            style={{ width: '100%', padding: '8px 12px 8px 34px', borderRadius: 8, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: '#fff', fontSize: 13, outline: 'none', boxSizing: 'border-box', fontFamily: 'var(--font-body)' }} />
        </div>
        {['ALL', 'PENDING', 'SCHEDULED', 'APPROVED', 'DISCREPANCY'].map(s => (
          <button key={s} onClick={() => setFilter(s)} style={{
            padding: '6px 14px', borderRadius: 6, fontSize: 11, fontWeight: 600, cursor: 'pointer',
            background: filter === s ? 'rgba(184,245,60,0.1)' : 'rgba(255,255,255,0.03)',
            color: filter === s ? '#B8F53C' : 'rgba(255,255,255,0.4)',
            border: `1px solid ${filter === s ? 'rgba(184,245,60,0.2)' : 'rgba(255,255,255,0.06)'}`,
            fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.03em',
          }}>
            {s === 'ALL' ? 'All' : s}
          </button>
        ))}
      </motion.div>

      {/* Inspection Cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {filtered.map((ins, idx) => (
          <motion.div key={ins.id} variants={fadeUp} transition={{ duration: 0.35 }}
            onClick={() => setSelectedIns(ins)}
            style={{
              padding: 20, borderRadius: 14,
              background: ins.priority === 'CRITICAL' ? 'rgba(239,68,68,0.03)' : 'rgba(255,255,255,0.02)',
              border: `1px solid ${ins.priority === 'CRITICAL' ? 'rgba(239,68,68,0.12)' : 'rgba(255,255,255,0.06)'}`,
              cursor: 'pointer', transition: 'all 0.2s',
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(184,245,60,0.15)'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = ins.priority === 'CRITICAL' ? 'rgba(239,68,68,0.12)' : 'rgba(255,255,255,0.06)'; e.currentTarget.style.transform = ''; }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16, flexWrap: 'wrap' }}>
              <div style={{ flex: 1, minWidth: 200 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                  <span style={{ fontSize: 15, fontWeight: 600, color: '#fff' }}>{ins.materialName}</span>
                  <StatusBadge status={ins.priority} color={priorityColors[ins.priority]} size="xs" />
                </div>
                <div style={{ display: 'flex', gap: 16, fontSize: 11, color: 'rgba(255,255,255,0.35)', flexWrap: 'wrap' }}>
                  <span style={{ fontFamily: 'var(--font-mono)' }}>{ins.transactionId}</span>
                  <span>{ins.sellerName}</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 3 }}><MapPin size={10} /> {ins.location}</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 3 }}><Calendar size={10} /> Due: {new Date(ins.dueDate).toLocaleDateString()}</span>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <MQSRing score={ins.mqsScore} size={40} strokeWidth={3} />
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4, alignItems: 'flex-end' }}>
                  <StatusBadge status={ins.status} color={statusColors[ins.status]} size="xs" />
                  <StatusBadge status={`ESC: ${ins.escrowStatus}`} color={ins.escrowStatus === 'RELEASED' ? 'lime' : ins.escrowStatus === 'HELD' ? 'danger' : 'amber'} size="xs" />
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div style={{ textAlign: 'center', padding: 64, color: 'rgba(255,255,255,0.3)' }}>
          <p style={{ fontSize: 16 }}>No inspections match your filter.</p>
        </div>
      )}

      {/* Detail Modal */}
      {selectedIns && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }} onClick={() => setSelectedIns(null)}>
          <div style={{ maxWidth: 600, width: '100%', maxHeight: '80vh', overflow: 'auto', padding: 32, borderRadius: 16, background: 'rgba(6,15,9,0.96)', border: '1px solid rgba(255,255,255,0.08)' }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
              <div>
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 20, color: '#fff', marginBottom: 4 }}>{selectedIns.materialName}</h2>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>{selectedIns.transactionId}</span>
              </div>
              <button onClick={() => setSelectedIns(null)} style={{ background: 'rgba(255,255,255,0.06)', border: 'none', borderRadius: 6, padding: 6, cursor: 'pointer', color: 'rgba(255,255,255,0.5)' }}><X size={18} /></button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16, marginBottom: 24 }}>
              <div><span style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase' }}>Status</span><div style={{ marginTop: 4 }}><StatusBadge status={selectedIns.status} color={statusColors[selectedIns.status]} /></div></div>
              <div><span style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase' }}>Priority</span><div style={{ marginTop: 4 }}><StatusBadge status={selectedIns.priority} color={priorityColors[selectedIns.priority]} /></div></div>
              <div><span style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase' }}>MQS</span><div style={{ marginTop: 6 }}><MQSRing score={selectedIns.mqsScore} size={42} strokeWidth={3} /></div></div>
              <div><span style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase' }}>Seller</span><div style={{ fontSize: 14, color: '#fff', marginTop: 4 }}>{selectedIns.sellerName}</div></div>
              <div><span style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase' }}>Location</span><div style={{ fontSize: 14, color: '#fff', marginTop: 4 }}>{selectedIns.location}</div></div>
              <div><span style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase' }}>Due Date</span><div style={{ fontSize: 14, color: '#fff', marginTop: 4, fontFamily: 'var(--font-mono)' }}>{new Date(selectedIns.dueDate).toLocaleDateString()}</div></div>
            </div>

            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <button style={{ padding: '10px 20px', borderRadius: 8, background: '#B8F53C', color: 'var(--color-brand-dark)', border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 700, fontFamily: 'var(--font-body)', display: 'flex', alignItems: 'center', gap: 6 }}>
                <CheckCircle size={14} /> Submit QAR
              </button>
              <button style={{ padding: '10px 20px', borderRadius: 8, background: 'rgba(239,68,68,0.08)', color: '#FB7185', border: '1px solid rgba(239,68,68,0.2)', cursor: 'pointer', fontSize: 13, fontWeight: 600, fontFamily: 'var(--font-body)' }}>
                Flag Discrepancy
              </button>
              <span className="api-tooltip" style={{ alignSelf: 'center' }}>POST /tpqc/{selectedIns.transactionId}/report</span>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}
