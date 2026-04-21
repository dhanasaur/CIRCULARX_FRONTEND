import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Factory, ShoppingCart, ClipboardCheck } from 'lucide-react';

const fadeUp = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5 } } };

const tabs = [
  { key: 'seller', label: 'Seller Journey', icon: Factory },
  { key: 'buyer', label: 'Buyer Journey', icon: ShoppingCart },
  { key: 'qc', label: 'QC Team Journey', icon: ClipboardCheck },
];

const journeys = {
  seller: [
    { step: 1, title: 'Register & Onboard', desc: 'Create your account, submit KYC, configure integrations.', endpoint: 'POST /auth/register' },
    { step: 2, title: 'Submit Material Data', desc: 'Upload via sensors (NIR/XRF), ERP connector, or manual entry.', endpoint: 'POST /ai/classify' },
    { step: 3, title: 'IRE Classification', desc: 'AI normalises data, runs anomaly checks, computes MQS.', endpoint: 'GET /ire/result' },
    { step: 4, title: 'Listing Published', desc: 'Material published with MQS, route, and shelf-life countdown.', endpoint: 'POST /listings' },
    { step: 5, title: 'Buyer Matching', desc: 'AI matches listings with suitable buyers by specs and location.', endpoint: 'GET /matching' },
    { step: 6, title: 'ZOPA Negotiation', desc: 'AI-mediated price negotiation within the ZOPA zone.', endpoint: 'POST /negotiate/zopa' },
    { step: 7, title: 'Escrow Lock', desc: 'Buyer locks payment into escrow until QAR approval.', endpoint: 'POST /escrow/lock' },
    { step: 8, title: 'QAR Inspection', desc: 'Quality team inspects material and submits QAR.', endpoint: 'GET /tpqc/inspections' },
    { step: 9, title: 'Settlement', desc: 'Escrow released, EPR + carbon credits + DPP generated.', endpoint: 'GET /dpp/{id}' },
  ],
  buyer: [
    { step: 1, title: 'Browse Marketplace', desc: 'Filter materials by category, MQS, location, and price.', endpoint: 'GET /listings' },
    { step: 2, title: 'Match Alert', desc: 'AI notifications for matching materials.', endpoint: 'GET /matching/alerts' },
    { step: 3, title: 'Express Interest', desc: 'Submit ceiling price for desired materials.', endpoint: 'POST /interest' },
    { step: 4, title: 'ZOPA Proposal', desc: 'Review AI-generated ZOPA price proposal.', endpoint: 'GET /negotiate/proposal' },
    { step: 5, title: 'Counter-Offer', desc: 'Accept or submit one counter-offer per round.', endpoint: 'PATCH /negotiate/counter' },
    { step: 6, title: 'Lock Escrow', desc: 'Confirm agreed price and lock escrow payment.', endpoint: 'POST /escrow/lock' },
    { step: 7, title: 'QAR Review', desc: 'Review quality assessment from inspection team.', endpoint: 'GET /tpqc/{id}' },
    { step: 8, title: 'Receive DPP', desc: 'Download DPP, Scope 3 record, and certificates.', endpoint: 'GET /dpp/{id}' },
  ],
  qc: [
    { step: 1, title: 'Assignment', desc: 'Receive inspection assignments by region and specialisation.', endpoint: 'GET /tpqc/inspections/' },
    { step: 2, title: 'Schedule', desc: 'Coordinate site visit with seller.', endpoint: 'PATCH /tpqc/{id}/schedule' },
    { step: 3, title: 'Inspect', desc: 'Visual inspection, spot sampling, quantity verification.', endpoint: 'Field work' },
    { step: 4, title: 'Submit QAR', desc: 'Complete structured QAR with lab results and digital signature.', endpoint: 'POST /tpqc/{id}/report' },
    { step: 5, title: 'Approve/Dispute', desc: 'Approve to release escrow or raise discrepancy.', endpoint: 'POST /tpqc/{id}/approve' },
  ],
};

export default function HowItWorksPage() {
  const [activeTab, setActiveTab] = useState('seller');
  return (
    <div>
      <section style={{ background: 'var(--color-brand-forest)', padding: '96px 24px', textAlign: 'center' }} className="grain-overlay">
        <div style={{ position: 'relative', zIndex: 2 }}>
          <motion.h1 initial="hidden" animate="visible" variants={fadeUp} style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(32px,5vw,48px)', color: '#fff', marginBottom: 16 }}>
            How <span style={{ color: '#B8F53C' }}>CIRCULARX</span> Works
          </motion.h1>
          <motion.p initial="hidden" animate="visible" variants={fadeUp} style={{ fontSize: 16, color: 'rgba(255,255,255,0.6)', maxWidth: 550, margin: '0 auto' }}>
            Three distinct journeys, one intelligent platform.
          </motion.p>
        </div>
      </section>

      <section style={{ background: 'var(--color-brand-cream)', padding: '60px 24px 96px' }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginBottom: 48, flexWrap: 'wrap' }}>
            {tabs.map(tab => {
              const Icon = tab.icon;
              const active = activeTab === tab.key;
              return (
                <button key={tab.key} onClick={() => setActiveTab(tab.key)} style={{
                  display: 'flex', alignItems: 'center', gap: 8, padding: '12px 24px', borderRadius: 'var(--radius-btn)',
                  background: active ? 'var(--color-brand-forest)' : 'transparent', color: active ? '#fff' : 'var(--color-brand-forest)',
                  border: `1.5px solid ${active ? 'var(--color-brand-forest)' : 'rgba(0,0,0,0.1)'}`,
                  fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-body)',
                }}>
                  <Icon size={16} style={{ color: active ? '#B8F53C' : 'var(--color-brand-slate)' }} /> {tab.label}
                </button>
              );
            })}
          </div>

          <AnimatePresence mode="wait">
            <motion.div key={activeTab} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }}>
              <div style={{ position: 'relative' }}>
                <div style={{ position: 'absolute', left: 24, top: 0, bottom: 0, width: 2, background: 'rgba(13,43,30,0.1)' }} />
                {journeys[activeTab].map((step, i) => (
                  <div key={i} style={{ display: 'flex', gap: 24, marginBottom: 32, position: 'relative' }}>
                    <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'var(--color-brand-forest)', color: '#B8F53C', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: 14, flexShrink: 0, zIndex: 1 }}>{step.step}</div>
                    <div className="glass-card-light" style={{ padding: 24, flex: 1 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 8 }}>
                        <h3 style={{ fontSize: 17, color: 'var(--color-brand-forest)', margin: 0, fontFamily: 'var(--font-display)' }}>{step.title}</h3>
                        <code style={{ fontSize: 10, padding: '2px 8px', borderRadius: 4, background: 'var(--color-brand-dark)', color: '#B8F53C', fontFamily: 'var(--font-mono)' }}>{step.endpoint}</code>
                      </div>
                      <p style={{ fontSize: 14, color: 'var(--color-brand-slate)', lineHeight: 1.6, marginTop: 8, marginBottom: 0 }}>{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </section>
    </div>
  );
}
