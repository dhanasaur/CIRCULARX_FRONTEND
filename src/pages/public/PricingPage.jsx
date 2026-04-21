import { motion } from 'framer-motion';
import { Check, X } from 'lucide-react';
import { Link } from 'react-router-dom';

const fadeUp = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6 } } };

const plans = [
  {
    name: 'Starter', price: 'Free', period: '', desc: 'For SMEs exploring circular economy', cta: 'Get Started Free',
    features: [
      { text: 'Manual entry only', included: true },
      { text: 'Basic listing (5/month)', included: true },
      { text: 'Standard MQS scoring', included: true },
      { text: 'Community support', included: true },
      { text: 'ERP integrations', included: false },
      { text: 'Compliance document vault', included: false },
      { text: 'Carbon credit generation', included: false },
      { text: 'DPP export', included: false },
    ],
  },
  {
    name: 'Pro', price: '$199', period: '/month', desc: 'For scaling waste management operations', cta: 'Start Pro Trial', featured: true,
    features: [
      { text: 'Manual + ERP integration', included: true },
      { text: 'Unlimited listings', included: true },
      { text: 'Advanced MQS + AI routing', included: true },
      { text: 'Priority support', included: true },
      { text: 'ERP integrations (SAP/Oracle)', included: true },
      { text: 'Compliance document vault', included: true },
      { text: 'Carbon credit generation', included: true },
      { text: 'Full DPP export', included: true },
    ],
  },
  {
    name: 'Enterprise API', price: '$999', period: '/month', desc: 'For large-scale industrial operations', cta: 'Contact Sales',
    features: [
      { text: 'Sensor + ERP + Manual', included: true },
      { text: 'Unlimited everything', included: true },
      { text: 'Custom compliance overlays', included: true },
      { text: 'Dedicated QC priority', included: true },
      { text: 'Real-time sensor integration', included: true },
      { text: 'Full API access', included: true },
      { text: 'SLA guarantees (99.9%)', included: true },
      { text: 'Advanced analytics & exports', included: true },
    ],
  },
];

export default function PricingPage() {
  return (
    <div>
      <section style={{ background: 'var(--color-brand-forest)', padding: '96px 24px', textAlign: 'center' }} className="grain-overlay">
        <div style={{ position: 'relative', zIndex: 2 }}>
          <motion.h1 initial="hidden" animate="visible" variants={fadeUp} style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(32px, 5vw, 48px)', color: '#fff', marginBottom: 16 }}>
            Simple, Transparent <span style={{ color: '#B8F53C' }}>Pricing</span>
          </motion.h1>
          <motion.p initial="hidden" animate="visible" variants={fadeUp} style={{ fontSize: 16, color: 'rgba(255,255,255,0.6)', maxWidth: 500, margin: '0 auto' }}>
            Scale your circular economy operations with plans built for every stage.
          </motion.p>
        </div>
      </section>

      <section style={{ background: 'var(--color-brand-cream)', padding: '80px 24px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24, marginBottom: 48 }}>
            {plans.map((plan, i) => (
              <motion.div key={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
                style={{
                  background: plan.featured ? 'var(--color-brand-forest)' : '#fff',
                  borderRadius: 'var(--radius-card)', padding: 36, position: 'relative', overflow: 'hidden',
                  border: plan.featured ? '2px solid #B8F53C' : '1px solid rgba(0,0,0,0.06)',
                  display: 'flex', flexDirection: 'column',
                }}>
                {plan.featured && (
                  <div style={{ position: 'absolute', top: 16, right: -28, background: '#B8F53C', color: 'var(--color-brand-dark)', fontSize: 10, fontWeight: 700, padding: '4px 32px', transform: 'rotate(45deg)', fontFamily: 'var(--font-mono)' }}>POPULAR</div>
                )}
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 22, color: plan.featured ? '#fff' : 'var(--color-brand-forest)', marginBottom: 8 }}>{plan.name}</h3>
                <p style={{ fontSize: 13, color: plan.featured ? 'rgba(255,255,255,0.5)' : 'var(--color-brand-slate)', marginBottom: 24 }}>{plan.desc}</p>
                <div style={{ marginBottom: 28 }}>
                  <span style={{ fontFamily: 'var(--font-display)', fontSize: 40, fontWeight: 800, color: plan.featured ? '#B8F53C' : 'var(--color-brand-forest)' }}>{plan.price}</span>
                  <span style={{ fontSize: 14, color: plan.featured ? 'rgba(255,255,255,0.4)' : 'var(--color-brand-slate)' }}>{plan.period}</span>
                </div>
                <div style={{ flex: 1, marginBottom: 28 }}>
                  {plan.features.map((f, j) => (
                    <div key={j} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                      {f.included ? <Check size={16} style={{ color: plan.featured ? '#B8F53C' : 'var(--color-brand-mid)', flexShrink: 0 }} /> : <X size={16} style={{ color: plan.featured ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.15)', flexShrink: 0 }} />}
                      <span style={{ fontSize: 13, color: f.included ? (plan.featured ? 'rgba(255,255,255,0.8)' : 'var(--color-brand-forest)') : (plan.featured ? 'rgba(255,255,255,0.25)' : 'rgba(0,0,0,0.25)') }}>{f.text}</span>
                    </div>
                  ))}
                </div>
                <Link to="/register" style={{
                  display: 'block', textAlign: 'center', padding: '14px 0', borderRadius: 'var(--radius-btn)',
                  background: plan.featured ? '#B8F53C' : 'var(--color-brand-forest)',
                  color: plan.featured ? 'var(--color-brand-dark)' : '#fff',
                  fontSize: 14, fontWeight: 700, textDecoration: 'none', transition: 'opacity 0.2s',
                }}>{plan.cta}</Link>
              </motion.div>
            ))}
          </div>
          <div style={{ textAlign: 'center', padding: '24px 32px', borderRadius: 'var(--radius-card)', background: 'rgba(13,43,30,0.04)', border: '1px solid rgba(13,43,30,0.08)' }}>
            <p style={{ fontSize: 14, color: 'var(--color-brand-forest)', margin: 0 }}>
              <strong>Transaction Fees:</strong> 1.5% of GMV (1% seller / 0.5% buyer) · <strong>Broker Commission:</strong> 8% of processing fee
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
