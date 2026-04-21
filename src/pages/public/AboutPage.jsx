import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, Users, Scale, Globe, Shield, Code } from 'lucide-react';

const fadeUp = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6 } } };
const stagger = { visible: { transition: { staggerChildren: 0.1 } } };

const phases = [
  { phase: 'Phase 1', region: 'India', status: 'Active', color: '#aff12bff' },
  { phase: 'Phase 2', region: 'SEA + UAE', status: '2026', color: '#38BDF8' },
  { phase: 'Phase 3', region: 'EU + US', status: '2027', color: '#F59E0B' },
];

const regulations = [
  { jurisdiction: 'India', rule: 'DPDP Act 2023', response: 'Full data localization & consent management' },
  { jurisdiction: 'India', rule: 'Plastic Waste Rules 2022', response: 'Automated EPR certificate generation' },
  { jurisdiction: 'EU', rule: 'ESPR 2026', response: 'Digital Product Passport (DPP) export' },
  { jurisdiction: 'International', rule: 'Basel Convention', response: 'No-Trade List screening & hazardous manifest' },
];

export default function AboutPage() {
  return (
    <div>
      {/* Hero */}
      <section style={{ background: 'var(--color-brand-forest)', padding: '96px 24px', position: 'relative' }} className="grain-overlay">
        <div style={{ maxWidth: 1000, margin: '0 auto', position: 'relative', zIndex: 2, textAlign: 'center' }}>
          <motion.h1 initial="hidden" animate="visible" variants={fadeUp} style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(32px, 5vw, 52px)', color: '#fff', marginBottom: 16 }}>
            About <span style={{ color: '#B8F53C' }}>CIRCULARX</span>
          </motion.h1>
          <motion.p initial="hidden" animate="visible" variants={fadeUp} style={{ fontSize: 18, color: 'rgba(255,255,255,0.6)', maxWidth: 600, margin: '0 auto' }}>
            Close the Loop. Open the Market.
          </motion.p>
        </div>
      </section>

      {/* Mission / Vision */}
      <section style={{ padding: '80px 24px', background: 'var(--color-brand-cream)' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 48 }}>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 28, color: 'var(--color-brand-forest)', marginBottom: 16 }}>Our Mission</h2>
            <p style={{ fontSize: 16, lineHeight: 1.8, color: 'var(--color-brand-slate)' }}>
              To eliminate industrial waste by building the world's most intelligent marketplace for secondary materials — where every tonne of waste finds its highest-value second life through AI-powered routing, transparent quality assurance, and automated compliance.
            </p>
          </motion.div>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 28, color: 'var(--color-brand-forest)', marginBottom: 16 }}>Our Vision</h2>
            <p style={{ fontSize: 16, lineHeight: 1.8, color: 'var(--color-brand-slate)' }}>
              A world where industrial waste streams are as liquid and tradeable as any commodity — with full provenance, real-time pricing, and zero compliance friction. A truly circular global economy powered by trust and technology.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Geographic Phases */}
      <section style={{ padding: '80px 24px', background: '#fff' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto', textAlign: 'center' }}>
          <motion.h2 initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} style={{ fontFamily: 'var(--font-display)', fontSize: 32, color: 'var(--color-brand-forest)', marginBottom: 48 }}>
            Global Expansion Roadmap
          </motion.h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 24 }}>
            {phases.map((p, i) => (
              <motion.div key={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
                className="glass-card-light" style={{ padding: 32, textAlign: 'center', borderTop: `3px solid ${p.color}` }}>
                <Globe size={32} style={{ color: p.color, marginBottom: 12 }} />
                <div style={{ fontSize: 12, fontFamily: 'var(--font-mono)', color: p.color, fontWeight: 600, marginBottom: 8 }}>{p.phase}</div>
                <h3 style={{ fontSize: 22, color: 'var(--color-brand-forest)', marginBottom: 8 }}>{p.region}</h3>
                <span style={{ fontSize: 13, padding: '4px 12px', borderRadius: 12, background: `${p.color}15`, color: p.color, fontWeight: 600 }}>{p.status}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Regulatory Alignment */}
      <section style={{ padding: '80px 24px', background: 'var(--color-brand-cream)' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto' }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 28, color: 'var(--color-brand-forest)', marginBottom: 32, textAlign: 'center' }}>Regulatory Alignment</h2>
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
                {regulations.map((r, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
                    <td style={{ padding: '12px 16px', fontWeight: 600, color: 'var(--color-brand-forest)' }}>{r.jurisdiction}</td>
                    <td style={{ padding: '12px 16px', color: 'var(--color-brand-slate)', fontFamily: 'var(--font-mono)', fontSize: 13 }}>{r.rule}</td>
                    <td style={{ padding: '12px 16px', color: 'var(--color-brand-slate)' }}>{r.response}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
}
