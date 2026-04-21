import { motion } from 'framer-motion';
import { FileText, Shield, Leaf, AlertTriangle } from 'lucide-react';

const fadeUp = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5 } } };

const docs = [
  { icon: FileText, title: 'EPR Certificate', desc: 'Auto-generated Extended Producer Responsibility certificates for every settled transaction. Jurisdiction-aware formatting for India PWM Rules 2022.' },
  { icon: Leaf, title: 'Carbon Credit (Verra VCS)', desc: 'Verified carbon credits using landfill methane avoidance + virgin material displacement methodology. Tradeable on voluntary carbon markets.' },
  { icon: Shield, title: 'Scope 3 GHG Record', desc: 'GHG Protocol-formatted emissions records for Category 1 purchased goods. Direct integration with corporate sustainability reporting.' },
  { icon: AlertTriangle, title: 'Hazardous Waste Manifest', desc: 'UN class-coded transport manifests for hazardous materials. Basel Convention compliant with cross-border tracking.' },
];

const dppFields = [
  'Material Origin & Source', 'Chemical Composition', 'Physical Properties', 'MQS Score & Route',
  'Chain of Custody', 'QAR Results', 'Certifications', 'Carbon Footprint', 'Recyclability Index',
];

const regMap = [
  { jurisdiction: 'India', rule: 'DPDP Act 2023', response: 'Data localization, consent management, right to erasure' },
  { jurisdiction: 'India', rule: 'Plastic Waste Rules 2022', response: 'Automated EPR certificate generation per transaction' },
  { jurisdiction: 'India', rule: 'Hazardous Waste Rules 2016', response: 'UN class coding, manifest generation, No-Trade List screen' },
  { jurisdiction: 'EU', rule: 'ESPR 2026', response: 'Digital Product Passport with full schema compliance' },
  { jurisdiction: 'International', rule: 'Basel Convention', response: 'Cross-border waste movement screening and documentation' },
  { jurisdiction: 'International', rule: 'GHG Protocol', response: 'Scope 3 Category 1 emissions tracking and export' },
  { jurisdiction: 'International', rule: 'Verra VCS', response: 'Carbon credit methodology: methane avoidance + displacement' },
];

export default function CompliancePage() {
  return (
    <div>
      <section style={{ background: 'var(--color-brand-forest)', padding: '96px 24px', textAlign: 'center' }} className="grain-overlay">
        <div style={{ position: 'relative', zIndex: 2 }}>
          <motion.h1 initial="hidden" animate="visible" variants={fadeUp} style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(32px,5vw,48px)', color: '#fff', marginBottom: 16 }}>
            Compliance & <span style={{ color: '#B8F53C' }}>ESG</span>
          </motion.h1>
          <motion.p initial="hidden" animate="visible" variants={fadeUp} style={{ fontSize: 16, color: 'rgba(255,255,255,0.6)', maxWidth: 550, margin: '0 auto' }}>
            Automated compliance documentation for every transaction on the platform.
          </motion.p>
        </div>
      </section>

      {/* Auto-generated docs */}
      <section style={{ background: 'var(--color-brand-cream)', padding: '80px 24px' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto' }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 28, color: 'var(--color-brand-forest)', marginBottom: 40, textAlign: 'center' }}>Auto-Generated Documents</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
            {docs.map((d, i) => {
              const Icon = d.icon;
              return (
                <motion.div key={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="glass-card-light" style={{ padding: 28 }}>
                  <Icon size={24} style={{ color: 'var(--color-brand-mid)', marginBottom: 16 }} />
                  <h3 style={{ fontSize: 17, color: 'var(--color-brand-forest)', marginBottom: 8, fontFamily: 'var(--font-display)' }}>{d.title}</h3>
                  <p style={{ fontSize: 14, color: 'var(--color-brand-slate)', lineHeight: 1.65, margin: 0 }}>{d.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* DPP Schema */}
      <section style={{ background: '#fff', padding: '80px 24px' }}>
        <div style={{ maxWidth: 800, margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 28, color: 'var(--color-brand-forest)', marginBottom: 16 }}>Digital Product Passport</h2>
          <p style={{ fontSize: 14, color: 'var(--color-brand-slate)', marginBottom: 32 }}>EU ESPR 2026-compliant DPP schema fields included in every passport:</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 10 }}>
            {dppFields.map((f, i) => (
              <span key={i} style={{ padding: '8px 16px', borderRadius: 20, background: 'rgba(13,43,30,0.05)', border: '1px solid rgba(13,43,30,0.1)', fontSize: 13, color: 'var(--color-brand-forest)', fontWeight: 500 }}>{f}</span>
            ))}
          </div>
        </div>
      </section>

      {/* Regulatory mapping */}
      <section style={{ background: 'var(--color-brand-cream)', padding: '80px 24px' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto' }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 28, color: 'var(--color-brand-forest)', marginBottom: 32, textAlign: 'center' }}>Regulatory Mapping</h2>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--color-brand-forest)' }}>
                  {['Jurisdiction', 'Regulation', 'CIRCULARX Response'].map(h => (
                    <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 700, color: 'var(--color-brand-forest)', fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {regMap.map((r, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
                    <td style={{ padding: '12px 16px', fontWeight: 600, color: 'var(--color-brand-forest)' }}>{r.jurisdiction}</td>
                    <td style={{ padding: '12px 16px', fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--color-brand-slate)' }}>{r.rule}</td>
                    <td style={{ padding: '12px 16px', color: 'var(--color-brand-slate)' }}>{r.response}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Carbon methodology */}
      <section style={{ background: 'var(--color-brand-forest)', padding: '80px 24px' }} className="grain-overlay">
        <div style={{ maxWidth: 800, margin: '0 auto', position: 'relative', zIndex: 2, textAlign: 'center' }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 28, color: '#fff', marginBottom: 16 }}>Carbon Credit Methodology</h2>
          <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.6)', lineHeight: 1.8, maxWidth: 600, margin: '0 auto' }}>
            CIRCULARX generates verified carbon credits using a dual methodology: <strong style={{ color: '#B8F53C' }}>landfill methane avoidance</strong> (prevented CH₄ emissions from diverted organic/plastic waste) combined with <strong style={{ color: '#B8F53C' }}>virgin material displacement</strong> (avoided extraction and processing emissions). Credits are issued under the Verra VCS standard and tradeable on voluntary carbon markets.
          </p>
        </div>
      </section>
    </div>
  );
}
