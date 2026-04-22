import { useState } from 'react';
import { motion } from 'framer-motion';
import TransactionCard from '../../components/ui/TransactionCard';
import ZOPABar from '../../components/ui/ZOPABar';
import StatusBadge from '../../components/ui/StatusBadge';
import { transactions, KANBAN_COLUMNS } from '../../mock/transactions';
import { X } from 'lucide-react';

const fadeUp = { hidden: { opacity: 0, y: 18 }, visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } } };

export default function SellerTransactions() {
  const [selectedTxn, setSelectedTxn] = useState(null);

  return (
    <motion.div initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.08 } } }}>
      <motion.div variants={fadeUp} style={{ marginBottom: 24 }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 700, color: '#fff', marginBottom: 4 }}>Transaction Pipeline</h1>
        <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)' }}>Track your transactions across all stages</p>
      </motion.div>

      {/* Kanban */}
      <motion.div variants={fadeUp} style={{ display: 'flex', gap: 12, overflowX: 'auto', paddingBottom: 16 }} className="dark-scrollbar">
        {KANBAN_COLUMNS.map(col => {
          const colTxns = transactions.filter(t => t.status === col.key);
          return (
            <div key={col.key} style={{ minWidth: 260, flex: '0 0 260px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12, padding: '0 4px' }}>
                <span style={{ fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,0.6)' }}>{col.label}</span>
                <span style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: 'rgba(255,255,255,0.25)', background: 'rgba(255,255,255,0.05)', padding: '1px 6px', borderRadius: 4 }}>{colTxns.length}</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {colTxns.map(txn => (
                  <TransactionCard key={txn.id} transaction={txn} onClick={() => setSelectedTxn(txn)} />
                ))}
                {colTxns.length === 0 && (
                  <div style={{ padding: 24, textAlign: 'center', border: '1px dashed rgba(255,255,255,0.08)', borderRadius: 'var(--radius-card)', color: 'rgba(255,255,255,0.2)', fontSize: 12 }}>
                    No transactions
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </motion.div>

      {/* Detail Modal */}
      {selectedTxn && (
        <div className="modal-backdrop" style={{ position: 'fixed', inset: 0, zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }} onClick={() => setSelectedTxn(null)}>
          <div className="glass-card" style={{ maxWidth: 640, width: '100%', maxHeight: '80vh', overflow: 'auto', padding: 32 }} onClick={e => e.stopPropagation()} className2="dark-scrollbar">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
              <div>
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 20, color: '#fff', marginBottom: 4 }}>{selectedTxn.materialName}</h2>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>{selectedTxn.id}</span>
              </div>
              <button onClick={() => setSelectedTxn(null)} style={{ background: 'rgba(255,255,255,0.06)', border: 'none', borderRadius: 6, padding: 6, cursor: 'pointer', color: 'rgba(255,255,255,0.5)' }}><X size={18} /></button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>
              <div><span style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)' }}>Status</span><div style={{ marginTop: 4 }}><StatusBadge status={selectedTxn.status} color={selectedTxn.status === 'DISPUTED' ? 'danger' : selectedTxn.status.includes('QAR') ? 'amber' : 'lime'} /></div></div>
              <div><span style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)' }}>Quantity</span><div style={{ fontSize: 16, fontWeight: 600, color: '#fff', fontFamily: 'var(--font-mono)', marginTop: 4 }}>{selectedTxn.quantity} {selectedTxn.unit}</div></div>
              <div><span style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)' }}>Buyer</span><div style={{ fontSize: 14, color: '#fff', marginTop: 4 }}>{selectedTxn.buyerName}</div></div>
              <div><span style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)' }}>Location</span><div style={{ fontSize: 14, color: '#fff', marginTop: 4 }}>{selectedTxn.location}</div></div>
              {selectedTxn.escrowAmount && <div><span style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)' }}>Escrow</span><div style={{ fontSize: 16, fontWeight: 600, color: '#B8F53C', fontFamily: 'var(--font-mono)', marginTop: 4 }}>${selectedTxn.escrowAmount.toLocaleString()}</div></div>}
              {selectedTxn.co2Avoided && <div><span style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)' }}>CO₂e Avoided</span><div style={{ fontSize: 16, fontWeight: 600, color: '#B8F53C', fontFamily: 'var(--font-mono)', marginTop: 4 }}>{selectedTxn.co2Avoided} t</div></div>}
            </div>

            {/* ZOPA Visualization */}
            {selectedTxn.floorPrice && selectedTxn.ceilingPrice && (
              <div style={{ marginBottom: 24 }}>
                <h3 style={{ fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,0.5)', marginBottom: 12 }}>ZOPA Negotiation</h3>
                <ZOPABar floorPrice={selectedTxn.floorPrice} ceilingPrice={selectedTxn.ceilingPrice} marketRef={selectedTxn.marketRef} agreedPrice={selectedTxn.agreedPrice} />
              </div>
            )}

            {/* Counter-offer history */}
            {selectedTxn.counterOffers?.length > 0 && (
              <div>
                <h3 style={{ fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,0.5)', marginBottom: 12 }}>Negotiation History</h3>
                {selectedTxn.counterOffers.map((co, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,0.04)', fontSize: 13 }}>
                    <span style={{ color: 'rgba(255,255,255,0.6)', textTransform: 'capitalize' }}>{co.party}</span>
                    <span style={{ fontFamily: 'var(--font-mono)', color: '#fff' }}>${co.price}</span>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'rgba(255,255,255,0.3)' }}>{new Date(co.timestamp).toLocaleDateString()}</span>
                  </div>
                ))}
              </div>
            )}

            <div style={{ marginTop: 20, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <button style={{ padding: '10px 20px', borderRadius: 'var(--radius-btn)', background: 'rgba(184,245,60,0.1)', color: '#B8F53C', border: '1px solid rgba(184,245,60,0.25)', cursor: 'pointer', fontSize: 13, fontWeight: 600, fontFamily: 'var(--font-body)' }}>View DPP</button>
              <button style={{ padding: '10px 20px', borderRadius: 'var(--radius-btn)', background: 'rgba(255,255,255,0.04)', color: 'rgba(255,255,255,0.6)', border: '1px solid rgba(255,255,255,0.08)', cursor: 'pointer', fontSize: 13, fontWeight: 500, fontFamily: 'var(--font-body)' }}>Download Documents</button>
              <span className="api-tooltip" style={{ alignSelf: 'center' }}>GET /transactions/{selectedTxn.id}</span>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}
