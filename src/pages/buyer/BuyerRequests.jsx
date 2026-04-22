import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Search, X, CheckCircle, Clock, Target, ArrowRight } from 'lucide-react';

const fadeUp = { hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0 } };
const stagger = { visible: { transition: { staggerChildren: 0.06 } } };

const initialRequests = [
  { id: 'REQ-001', material: 'HDPE Pellets', qty: 100, unit: 't', budget: 40, status: 'IN_NEGOTIATION', matches: 3, date: '2025-03-12', notes: 'Min purity 92%, post-industrial preferred' },
  { id: 'REQ-002', material: 'PET Flakes', qty: 50, unit: 't', budget: 48, status: 'OPEN', matches: 2, date: '2025-03-15', notes: 'Clear or light blue, food-grade acceptable' },
  { id: 'REQ-003', material: 'Aluminium Scrap', qty: 20, unit: 't', budget: 300, status: 'MATCHED', matches: 1, date: '2025-03-08', notes: '6000 series preferred' },
  { id: 'REQ-004', material: 'Kraft Paper', qty: 60, unit: 't', budget: 25, status: 'OPEN', matches: 0, date: '2025-03-18', notes: 'OCC grade, baled' },
  { id: 'REQ-005', material: 'PP Granules', qty: 75, unit: 't', budget: 32, status: 'FULFILLED', matches: 5, date: '2025-02-20', notes: 'Injection grade, any color' },
];

const statusConfig = {
  OPEN: { bg: 'rgba(56,189,248,0.08)', color: '#38BDF8' },
  MATCHED: { bg: 'rgba(184,245,60,0.08)', color: '#B8F53C' },
  IN_NEGOTIATION: { bg: 'rgba(245,158,11,0.08)', color: '#F59E0B' },
  FULFILLED: { bg: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.5)' },
};

const categories = ['Plastics', 'Metals', 'Paper & Cellulose', 'Glass', 'Rubber', 'Textiles', 'E-Waste', 'Chemicals'];

export default function BuyerRequests() {
  const [requests, setRequests] = useState(initialRequests);
  const [showModal, setShowModal] = useState(false);
  const [filter, setFilter] = useState('ALL');
  const [toast, setToast] = useState('');
  const [newReq, setNewReq] = useState({ material: '', qty: '', budget: '', requiredBy: '', purity: '', notes: '' });

  const filtered = requests.filter(r => filter === 'ALL' || r.status === filter);

  const handleSubmit = () => {
    const req = { id: `REQ-${String(requests.length + 1).padStart(3, '0')}`, material: newReq.material, qty: Number(newReq.qty), unit: 't', budget: Number(newReq.budget), status: 'OPEN', matches: 0, date: new Date().toISOString().split('T')[0], notes: newReq.notes };
    setRequests(r => [req, ...r]);
    setShowModal(false);
    setNewReq({ material: '', qty: '', budget: '', requiredBy: '', purity: '', notes: '' });
    setToast('Request submitted! We\'ll notify you when matches are found.');
    setTimeout(() => setToast(''), 3000);
  };

  const inputStyle = { width: '100%', padding: '10px 14px', borderRadius: 8, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: '#fff', fontSize: 13, fontFamily: 'var(--font-body)', outline: 'none', boxSizing: 'border-box' };

  return (
    <motion.div initial="hidden" animate="visible" variants={stagger}>
      {toast && <div style={{ position: 'fixed', top: 24, right: 24, zIndex: 200, padding: '12px 20px', borderRadius: 10, background: '#B8F53C', color: '#0D2B1E', fontSize: 13, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 8, boxShadow: '0 8px 30px rgba(184,245,60,0.3)' }}><CheckCircle size={14} /> {toast}</div>}

      <motion.div variants={fadeUp} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 className="dash-h1" style={{ marginBottom: 6 }}>My Requests</h1>
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)' }}>{requests.length} procurement requests · {requests.filter(r => r.status === 'OPEN').length} open</p>
        </div>
        <button onClick={() => setShowModal(true)} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '10px 22px', borderRadius: 10, background: '#B8F53C', color: '#0D2B1E', fontSize: 13, fontWeight: 700, border: 'none', cursor: 'pointer', fontFamily: 'var(--font-body)', boxShadow: '0 0 20px rgba(184,245,60,0.2)' }}><Plus size={14} /> New Request</button>
      </motion.div>

      <motion.div variants={fadeUp} style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
        {['ALL', 'OPEN', 'MATCHED', 'IN_NEGOTIATION', 'FULFILLED'].map(s => (
          <button key={s} onClick={() => setFilter(s)} style={{ padding: '6px 14px', borderRadius: 6, fontSize: 11, fontWeight: 600, cursor: 'pointer', background: filter === s ? 'rgba(184,245,60,0.1)' : 'rgba(255,255,255,0.03)', color: filter === s ? '#B8F53C' : 'rgba(255,255,255,0.4)', border: `1px solid ${filter === s ? 'rgba(184,245,60,0.2)' : 'rgba(255,255,255,0.06)'}`, fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.03em' }}>{s === 'ALL' ? 'All' : s.replace(/_/g, ' ')}</button>
        ))}
      </motion.div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {filtered.map(req => { const sc = statusConfig[req.status] || statusConfig.OPEN; return (
          <motion.div key={req.id} variants={fadeUp} style={{ padding: 20, borderRadius: 14, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', cursor: 'pointer', transition: 'all 0.2s' }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(184,245,60,0.15)'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'; }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16, flexWrap: 'wrap' }}>
              <div style={{ flex: 1, minWidth: 200 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                  <span style={{ fontSize: 15, fontWeight: 600, color: '#fff' }}>{req.material}</span>
                  <span style={{ fontSize: 10, padding: '2px 8px', borderRadius: 4, background: sc.bg, color: sc.color, fontFamily: 'var(--font-mono)', fontWeight: 600 }}>{req.status.replace(/_/g, ' ')}</span>
                </div>
                <div style={{ display: 'flex', gap: 16, fontSize: 12, color: 'rgba(255,255,255,0.35)' }}>
                  <span style={{ fontFamily: 'var(--font-mono)' }}>{req.id}</span>
                  <span>{req.qty}{req.unit}</span>
                  <span>Max ${req.budget}/{req.unit}</span>
                  <span>Created: {req.date}</span>
                </div>
                {req.notes && <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)', marginTop: 6, margin: '6px 0 0' }}>{req.notes}</p>}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ textAlign: 'center', padding: '8px 16px', borderRadius: 8, background: 'rgba(255,255,255,0.02)' }}>
                  <div style={{ fontSize: 20, fontWeight: 700, color: req.matches > 0 ? '#B8F53C' : 'rgba(255,255,255,0.2)', fontFamily: 'var(--font-display)' }}>{req.matches}</div>
                  <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase' }}>Matches</div>
                </div>
                {req.matches > 0 && req.status !== 'FULFILLED' && (
                  <button style={{ padding: '8px 14px', borderRadius: 6, background: 'rgba(184,245,60,0.08)', color: '#B8F53C', border: '1px solid rgba(184,245,60,0.15)', cursor: 'pointer', fontSize: 11, fontWeight: 600, fontFamily: 'var(--font-body)', display: 'flex', alignItems: 'center', gap: 4 }}>View <ArrowRight size={10} /></button>
                )}
              </div>
            </div>
          </motion.div>
        ); })}
      </div>

      {/* New Request Modal */}
      {showModal && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, background: 'rgba(6,15,9,0.85)', backdropFilter: 'blur(8px)' }} onClick={() => setShowModal(false)}>
          <div style={{ maxWidth: 520, width: '100%', padding: 32, borderRadius: 16, background: 'rgba(6,15,9,0.96)', border: '1px solid rgba(255,255,255,0.08)' }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 24 }}>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 20, color: '#fff' }}>New Procurement Request</h2>
              <button onClick={() => setShowModal(false)} style={{ background: 'rgba(255,255,255,0.06)', border: 'none', borderRadius: 6, padding: 6, cursor: 'pointer', color: 'rgba(255,255,255,0.5)' }}><X size={18} /></button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div><label style={{ fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.4)', display: 'block', marginBottom: 6, textTransform: 'uppercase' }}>Material</label>
                <select value={newReq.material} onChange={e => setNewReq(f => ({...f, material: e.target.value}))} style={{...inputStyle, background: 'rgba(255,255,255,0.04)'}}>
                  <option value="">Select material</option>
                  {['HDPE Pellets', 'PET Flakes', 'PP Granules', 'ABS Regrind', 'Nylon 6', 'Aluminium Scrap', 'Copper Wire', 'Steel Turnings', 'Kraft Paper', 'Glass Cullet'].map(m => <option key={m} value={m}>{m}</option>)}
                </select>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div><label style={{ fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.4)', display: 'block', marginBottom: 6, textTransform: 'uppercase' }}>Quantity (tonnes)</label><input style={inputStyle} type="number" value={newReq.qty} onChange={e => setNewReq(f => ({...f, qty: e.target.value}))} /></div>
                <div><label style={{ fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.4)', display: 'block', marginBottom: 6, textTransform: 'uppercase' }}>Max Budget ($/t)</label><input style={inputStyle} type="number" value={newReq.budget} onChange={e => setNewReq(f => ({...f, budget: e.target.value}))} /></div>
              </div>
              <div><label style={{ fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.4)', display: 'block', marginBottom: 6, textTransform: 'uppercase' }}>Required By</label><input style={inputStyle} type="date" value={newReq.requiredBy} onChange={e => setNewReq(f => ({...f, requiredBy: e.target.value}))} /></div>
              <div><label style={{ fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.4)', display: 'block', marginBottom: 6, textTransform: 'uppercase' }}>Notes</label><textarea style={{...inputStyle, height: 60, resize: 'none'}} value={newReq.notes} onChange={e => setNewReq(f => ({...f, notes: e.target.value}))} placeholder="Min purity, color, grade preferences..." /></div>
            </div>
            <button onClick={handleSubmit} disabled={!newReq.material || !newReq.qty} style={{ width: '100%', marginTop: 20, padding: '12px', borderRadius: 8, background: newReq.material && newReq.qty ? '#B8F53C' : 'rgba(255,255,255,0.06)', color: newReq.material && newReq.qty ? '#0D2B1E' : 'rgba(255,255,255,0.2)', border: 'none', cursor: newReq.material && newReq.qty ? 'pointer' : 'default', fontSize: 14, fontWeight: 700, fontFamily: 'var(--font-body)' }}>Submit Request</button>
          </div>
        </div>
      )}
    </motion.div>
  );
}
