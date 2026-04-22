import { motion } from 'framer-motion';
import StatusBadge from '../../components/ui/StatusBadge';
import { complianceDocs } from '../../mock/inspections';
import { FileText, Download, Leaf, Shield, AlertTriangle } from 'lucide-react';

const fadeUp = { hidden: { opacity: 0, y: 18 }, visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } } };

const typeIcons = { 'EPR Certificate': FileText, 'Carbon Credit': Leaf, 'Scope 3 Record': Shield, 'DPP': FileText, 'Hazardous Manifest': AlertTriangle };
const typeColors = { 'EPR Certificate': '#B8F53C', 'Carbon Credit': '#38BDF8', 'Scope 3 Record': '#F59E0B', 'DPP': '#B8F53C', 'Hazardous Manifest': '#EF4444' };

export default function SellerCompliance() {
  const totalEPR = complianceDocs.filter(d => d.type === 'EPR Certificate').length;
  const totalCO2 = complianceDocs.filter(d => d.co2e).reduce((s, d) => s + d.co2e, 0);

  return (
    <motion.div initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.08 } } }}>
      <motion.div variants={fadeUp} style={{ marginBottom: 24 }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 700, color: '#fff', marginBottom: 4 }}>Compliance Vault</h1>
        <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)' }}>Auto-generated compliance documents for all transactions</p>
      </motion.div>

      {/* Aggregate stats */}
      <motion.div variants={fadeUp} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 32 }}>
        {[
          { label: 'EPR Certificates', value: totalEPR, color: '#B8F53C' },
          { label: 'Total tCO₂e Credited', value: totalCO2, color: '#38BDF8' },
          { label: 'Documents Generated', value: complianceDocs.length, color: '#F59E0B' },
        ].map((s, i) => (
          <div key={i} className="glass-card" style={{ padding: 20, textAlign: 'center' }}>
            <div style={{ fontSize: 28, fontFamily: 'var(--font-display)', fontWeight: 700, color: s.color }}>{s.value}</div>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', marginTop: 4 }}>{s.label}</div>
          </div>
        ))}
      </motion.div>

      {/* Document grid */}
      <motion.div variants={fadeUp} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
        {complianceDocs.map(doc => {
          const Icon = typeIcons[doc.type] || FileText;
          const color = typeColors[doc.type] || '#64748B';
          return (
            <div key={doc.id} className="glass-card" style={{ padding: 20, transition: 'box-shadow 0.3s' }}
              onMouseEnter={e => e.currentTarget.style.boxShadow = '0 0 20px rgba(184,245,60,0.15)'}
              onMouseLeave={e => e.currentTarget.style.boxShadow = ''}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                <div style={{ width: 36, height: 36, borderRadius: 8, background: `${color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon size={18} style={{ color }} />
                </div>
                <button style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 6, padding: '4px 10px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: 'rgba(255,255,255,0.5)', fontFamily: 'var(--font-body)' }}>
                  <Download size={12} /> PDF
                </button>
              </div>
              <div style={{ fontSize: 14, fontWeight: 600, color: '#fff', marginBottom: 4 }}>{doc.type}</div>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', marginBottom: 8 }}>{doc.materialName}</div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, fontFamily: 'var(--font-mono)', color: 'rgba(255,255,255,0.3)' }}>
                <span>{doc.transactionId}</span>
                <span>{new Date(doc.date).toLocaleDateString()}</span>
              </div>
              {doc.co2e && <div style={{ marginTop: 8, fontSize: 12, fontFamily: 'var(--font-mono)', color: '#B8F53C' }}>{doc.co2e} tCO₂e</div>}
            </div>
          );
        })}
      </motion.div>
    </motion.div>
  );
}
