import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import StatusBadge from '../../components/ui/StatusBadge';
import MQSRing from '../../components/ui/MQSRing';
import { inspections } from '../../mock/inspections';
import { MapPin, Calendar, Clock, Search, CheckCircle, X, AlertTriangle, FileText, ChevronRight, Shield } from 'lucide-react';

const fadeUp = { hidden: { opacity: 0, y: 18 }, visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } } };
const stagger = { visible: { transition: { staggerChildren: 0.06 } } };

const statusColors = { PENDING: 'amber', SCHEDULED: 'info', APPROVED: 'lime', DISCREPANCY: 'danger' };
const priorityColors = { LOW: 'slate', MEDIUM: 'info', HIGH: 'amber', CRITICAL: 'danger' };
const priorityAccents = { LOW: 'rgba(100,116,139,0.5)', MEDIUM: 'rgba(56,189,248,0.5)', HIGH: 'rgba(245,158,11,0.6)', CRITICAL: 'rgba(239,68,68,0.7)' };

export default function QCInspections() {
  const [filter, setFilter] = useState('ALL');
  const [search, setSearch] = useState('');
  const [selectedIns, setSelectedIns] = useState(null);
  const [qarForm, setQarForm] = useState({ purityVerified: '', moistureVerified: '', contaminationVerified: '', visualGrade: 'A', notes: '' });

  const filtered = inspections
    .filter(i => filter === 'ALL' || i.status === filter)
    .filter(i => !search || i.materialName.toLowerCase().includes(search.toLowerCase()) || i.transactionId.toLowerCase().includes(search.toLowerCase()));

  const statusCounts = {
    ALL: inspections.length,
    PENDING: inspections.filter(i => i.status === 'PENDING').length,
    SCHEDULED: inspections.filter(i => i.status === 'SCHEDULED').length,
    APPROVED: inspections.filter(i => i.status === 'APPROVED').length,
    DISCREPANCY: inspections.filter(i => i.status === 'DISCREPANCY').length,
  };

  return (
    <motion.div initial="hidden" animate="visible" variants={stagger}>
      <motion.div variants={fadeUp} transition={{ duration: 0.4 }} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 className="dash-h1" style={{ marginBottom: 6 }}>Inspection Queue</h1>
          <p className="dash-subtitle">{filtered.length} inspections · {statusCounts.PENDING} pending action</p>
        </div>
      </motion.div>

      {/* Filters */}
      <motion.div variants={fadeUp} transition={{ duration: 0.4 }} style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ position: 'relative', flex: '1 1 200px', maxWidth: 300 }}>
          <Search size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.3)' }} />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by material or TXN ID..."
            className="dash-input" style={{ paddingLeft: 34 }} />
        </div>
        {['ALL', 'PENDING', 'SCHEDULED', 'APPROVED', 'DISCREPANCY'].map(s => (
          <button key={s} onClick={() => setFilter(s)} style={{
            padding: '6px 14px', borderRadius: 6, fontSize: 11, fontWeight: 700, cursor: 'pointer',
            background: filter === s ? 'rgba(184,245,60,0.1)' : 'rgba(255,255,255,0.03)',
            color: filter === s ? '#B8F53C' : 'rgba(255,255,255,0.4)',
            border: `1px solid ${filter === s ? 'rgba(184,245,60,0.2)' : 'rgba(255,255,255,0.06)'}`,
            fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.03em',
            display: 'flex', alignItems: 'center', gap: 5,
          }}>
            {s === 'ALL' ? 'All' : s}
            <span style={{
              fontSize: 9, padding: '1px 5px', borderRadius: 4, fontWeight: 800,
              background: filter === s ? 'rgba(184,245,60,0.15)' : 'rgba(255,255,255,0.05)',
              color: filter === s ? '#B8F53C' : 'rgba(255,255,255,0.3)',
            }}>{statusCounts[s]}</span>
          </button>
        ))}
      </motion.div>

      {/* Inspection Cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {filtered.map((ins) => (
          <motion.div key={ins.id} variants={fadeUp} transition={{ duration: 0.35 }}
            onClick={() => setSelectedIns(ins)}
            style={{
              padding: '18px 20px', borderRadius: 12, cursor: 'pointer',
              background: ins.priority === 'CRITICAL'
                ? 'linear-gradient(135deg, rgba(239,68,68,0.04), rgba(0,0,0,0) 60%), linear-gradient(135deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.01) 100%)'
                : 'linear-gradient(135deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.01) 100%)',
              border: `1px solid ${ins.priority === 'CRITICAL' ? 'rgba(239,68,68,0.15)' : 'rgba(255,255,255,0.06)'}`,
              transition: 'all 0.25s cubic-bezier(0.4,0,0.2,1)',
              position: 'relative', overflow: 'hidden',
              backdropFilter: 'blur(16px)',
              boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.04)',
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(184,245,60,0.2)'; e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.04)'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = ins.priority === 'CRITICAL' ? 'rgba(239,68,68,0.15)' : 'rgba(255,255,255,0.06)'; e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = 'inset 0 1px 0 rgba(255,255,255,0.04)'; }}
          >
            {/* Priority accent bar */}
            <div style={{
              position: 'absolute', left: 0, top: 8, bottom: 8, width: 3,
              borderRadius: '0 3px 3px 0',
              background: priorityAccents[ins.priority] || 'rgba(255,255,255,0.1)',
              boxShadow: `0 0 8px ${priorityAccents[ins.priority] || 'transparent'}`,
            }} />

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16, flexWrap: 'wrap' }}>
              <div style={{ flex: 1, minWidth: 200, paddingLeft: 8 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                  <span style={{ fontSize: 14, fontWeight: 700, color: '#fff', fontFamily: 'var(--font-display)' }}>{ins.materialName}</span>
                  <StatusBadge status={ins.priority} color={priorityColors[ins.priority]} size="xs" />
                </div>
                <div style={{ display: 'flex', gap: 12, fontSize: 11, color: 'rgba(255,255,255,0.35)', flexWrap: 'wrap', alignItems: 'center' }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 600, color: 'rgba(255,255,255,0.45)' }}>{ins.transactionId}</span>
                  <span className="qcc-insp-meta-pill"><span>{ins.sellerName}</span></span>
                  <span className="qcc-insp-meta-pill"><MapPin size={10} /> {ins.location}</span>
                  <span className="qcc-insp-meta-pill"><Calendar size={10} /> Due: {new Date(ins.dueDate).toLocaleDateString()}</span>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexShrink: 0 }}>
                <MQSRing score={ins.mqsScore} size={40} strokeWidth={3} />
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4, alignItems: 'flex-end' }}>
                  <StatusBadge status={ins.status} color={statusColors[ins.status]} size="xs" />
                  <StatusBadge status={`ESC: ${ins.escrowStatus}`} color={ins.escrowStatus === 'RELEASED' ? 'lime' : ins.escrowStatus === 'HELD' ? 'danger' : 'amber'} size="xs" />
                </div>
                <ChevronRight size={16} style={{ color: 'rgba(255,255,255,0.2)', marginLeft: 4 }} />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="dash-empty" style={{ marginTop: 40 }}>
          <Search size={32} style={{ color: 'rgba(255,255,255,0.15)', marginBottom: 12 }} />
          <p style={{ fontSize: 15, marginBottom: 4 }}>No inspections match your filter</p>
          <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.25)' }}>Try adjusting your search or filter criteria</p>
        </div>
      )}

      {/* ══ Slide-in Side Drawer ══ */}
      <AnimatePresence>
        {selectedIns && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setSelectedIns(null)}
              style={{ position: 'fixed', inset: 0, zIndex: 100, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }}
            />
            {/* Drawer */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              style={{
                position: 'fixed', top: 0, right: 0, bottom: 0, width: 520, maxWidth: '90vw',
                zIndex: 101, overflowY: 'auto',
                background: 'linear-gradient(180deg, rgba(6,15,9,0.99), rgba(6,15,9,0.97))',
                borderLeft: '1px solid rgba(255,255,255,0.08)',
                boxShadow: '-16px 0 48px rgba(0,0,0,0.5)',
                padding: '32px 28px',
              }}
              onClick={e => e.stopPropagation()}
            >
              {/* Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 28 }}>
                <div>
                  <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 800, color: '#fff', marginBottom: 6 }}>{selectedIns.materialName}</h2>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>{selectedIns.transactionId}</span>
                    <StatusBadge status={selectedIns.priority} color={priorityColors[selectedIns.priority]} size="xs" />
                  </div>
                </div>
                <button onClick={() => setSelectedIns(null)} style={{
                  background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: 8, padding: 8, cursor: 'pointer', color: 'rgba(255,255,255,0.5)',
                  transition: 'all 0.15s',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = '#fff'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.color = 'rgba(255,255,255,0.5)'; }}
                ><X size={18} /></button>
              </div>

              {/* Metadata Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 14, marginBottom: 28 }}>
                {[
                  { label: 'Status', el: <StatusBadge status={selectedIns.status} color={statusColors[selectedIns.status]} /> },
                  { label: 'MQS Score', el: <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}><MQSRing score={selectedIns.mqsScore} size={38} strokeWidth={3} /><span style={{ fontFamily: 'var(--font-mono)', fontSize: 14, fontWeight: 800, color: '#fff' }}>{selectedIns.mqsScore}</span></div> },
                  { label: 'Escrow', el: <StatusBadge status={selectedIns.escrowStatus} color={selectedIns.escrowStatus === 'RELEASED' ? 'lime' : selectedIns.escrowStatus === 'HELD' ? 'danger' : 'amber'} /> },
                  { label: 'Seller', el: <span style={{ fontSize: 13, color: '#fff', fontWeight: 600 }}>{selectedIns.sellerName}</span> },
                  { label: 'Location', el: <span style={{ fontSize: 13, color: '#fff', display: 'flex', alignItems: 'center', gap: 4 }}><MapPin size={12} style={{ color: '#38BDF8' }} />{selectedIns.location}</span> },
                  { label: 'Due Date', el: <span style={{ fontSize: 13, color: '#fff', fontFamily: 'var(--font-mono)' }}>{new Date(selectedIns.dueDate).toLocaleDateString()}</span> },
                ].map((item, i) => (
                  <div key={i} style={{ padding: '12px 14px', borderRadius: 10, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
                    <div className="dash-micro-label" style={{ marginBottom: 6 }}>{item.label}</div>
                    {item.el}
                  </div>
                ))}
              </div>

              {/* QAR Form */}
              <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 24, marginBottom: 24 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 18 }}>
                  <FileText size={16} style={{ color: '#38BDF8' }} />
                  <h3 style={{ fontSize: 14, fontWeight: 700, color: '#fff', fontFamily: 'var(--font-display)' }}>Quality Assurance Report</h3>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 }}>
                  <div>
                    <label className="dash-label">Purity Verified %</label>
                    <input className="dash-input" type="number" placeholder="e.g. 96.2" value={qarForm.purityVerified} onChange={e => setQarForm(f => ({ ...f, purityVerified: e.target.value }))} />
                  </div>
                  <div>
                    <label className="dash-label">Moisture Verified %</label>
                    <input className="dash-input" type="number" placeholder="e.g. 1.1" value={qarForm.moistureVerified} onChange={e => setQarForm(f => ({ ...f, moistureVerified: e.target.value }))} />
                  </div>
                  <div>
                    <label className="dash-label">Contamination Verified %</label>
                    <input className="dash-input" type="number" placeholder="e.g. 1.8" value={qarForm.contaminationVerified} onChange={e => setQarForm(f => ({ ...f, contaminationVerified: e.target.value }))} />
                  </div>
                  <div>
                    <label className="dash-label">Visual Grade</label>
                    <select className="dash-select" value={qarForm.visualGrade} onChange={e => setQarForm(f => ({ ...f, visualGrade: e.target.value }))}>
                      <option value="A">A — Excellent</option>
                      <option value="B">B — Good</option>
                      <option value="C">C — Fair</option>
                      <option value="D">D — Poor</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="dash-label">Inspector Notes</label>
                  <textarea className="dash-input" style={{ minHeight: 70, resize: 'vertical' }} placeholder="Observations, deviations, photo references..." value={qarForm.notes} onChange={e => setQarForm(f => ({ ...f, notes: e.target.value }))} />
                </div>
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                <button className="btn-primary" style={{ flex: 1 }}>
                  <CheckCircle size={14} /> Approve & Submit QAR
                </button>
                <button className="btn-danger" style={{ flex: 1 }}>
                  <AlertTriangle size={14} /> Flag Discrepancy
                </button>
              </div>
              <div style={{ marginTop: 10, textAlign: 'center' }}>
                <span className="api-tooltip">POST /tpqc/{selectedIns.transactionId}/report</span>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
