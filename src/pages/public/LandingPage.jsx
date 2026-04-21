import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Zap, Shield, FileText, Brain, Repeat, TrendingDown, Factory, Leaf, Recycle } from 'lucide-react';
import useCountUp from '../../hooks/useCountUp';

const fadeUp = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6 } } };
const stagger = { visible: { transition: { staggerChildren: 0.1 } } };

function AnimatedCounter({ end, suffix = '', prefix = '' }) {
  const { count, ref } = useCountUp(end);
  return <span ref={ref}>{prefix}{count.toLocaleString()}{suffix}</span>;
}

export default function LandingPage() {
  return (
    <div>
      {/* HERO */}
      <section style={{ position: 'relative', minHeight: '100vh', display: 'flex', alignItems: 'center', background: 'var(--color-brand-forest)', overflow: 'hidden' }} className="grain-overlay">
        {/* Animated SVG background */}
        <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', zIndex: 0, opacity: 0.15 }}>
          <defs>
            <linearGradient id="flowGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#B8F53C" stopOpacity="0" />
              <stop offset="50%" stopColor="#B8F53C" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#B8F53C" stopOpacity="0" />
            </linearGradient>
          </defs>
          {[...Array(5)].map((_, i) => (
            <g key={i}>
              <path d={`M${-100 + i * 50},${150 + i * 120} Q${400 + i * 80},${50 + i * 60} ${800 + i * 100},${200 + i * 80} T${1600},${300 + i * 50}`} fill="none" stroke="rgba(184,245,60,0.08)" strokeWidth="1" />
              <circle r="3" fill="url(#flowGrad)">
                <animateMotion dur={`${6 + i * 2}s`} repeatCount="indefinite" path={`M${-100 + i * 50},${150 + i * 120} Q${400 + i * 80},${50 + i * 60} ${800 + i * 100},${200 + i * 80} T${1600},${300 + i * 50}`} />
              </circle>
            </g>
          ))}
          {/* Nodes */}
          {[{ x: 200, y: 300, label: 'Seller' }, { x: 700, y: 200, label: 'IRE' }, { x: 1200, y: 350, label: 'Buyer' }].map((node, i) => (
            <g key={i}>
              <circle cx={node.x} cy={node.y} r="8" fill="none" stroke="#B8F53C" strokeWidth="1.5" opacity="0.4">
                <animate attributeName="r" values="8;14;8" dur="3s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.4;0.15;0.4" dur="3s" repeatCount="indefinite" />
              </circle>
              <circle cx={node.x} cy={node.y} r="3" fill="#B8F53C" opacity="0.6" />
            </g>
          ))}
        </svg>

        <div style={{ position: 'relative', zIndex: 2, maxWidth: 1200, margin: '0 auto', padding: '120px 24px 80px', width: '100%' }}>
          <motion.div initial="hidden" animate="visible" variants={stagger}>
            <motion.div variants={fadeUp} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '6px 14px', borderRadius: 20, background: 'rgba(184,245,60,0.1)', border: '1px solid rgba(184,245,60,0.2)', marginBottom: 24 }}>
              <img src="/logo.png" alt="CX" style={{ height: 16 }} />
              <span style={{ fontSize: 12, color: '#B8F53C', fontWeight: 600, fontFamily: 'var(--font-mono)' }}>AI-POWERED CIRCULAR ECONOMY</span>
            </motion.div>

            <motion.h1 variants={fadeUp} style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(36px, 6vw, 72px)', fontWeight: 800, color: '#fff', lineHeight: 1.05, marginBottom: 24, maxWidth: 800 }}>
              Every Tonne Has a{' '}
              <span style={{ color: 'var(--color-brand-lime)' }}>Second Life</span>
            </motion.h1>

            <motion.p variants={fadeUp} style={{ fontSize: 'clamp(16px, 2vw, 20px)', color: 'rgba(255,255,255,0.6)', maxWidth: 560, lineHeight: 1.6, marginBottom: 40 }}>
              The AI-powered B2B marketplace that transforms industrial waste streams into tradeable materials. Intelligent routing, automated compliance, and real-time carbon credit generation.
            </motion.p>

            <motion.div variants={fadeUp} style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
              <Link to="/register?role=seller" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '14px 28px', background: 'var(--color-brand-lime)', color: 'var(--color-brand-dark)', borderRadius: 'var(--radius-btn)', fontSize: 15, fontWeight: 700, textDecoration: 'none', fontFamily: 'var(--font-body)', transition: 'transform 0.2s' }}>
                List Your Waste <ArrowRight size={16} />
              </Link>
              <Link to="/register?role=buyer" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '14px 28px', background: 'rgba(255,255,255,0.08)', color: '#fff', borderRadius: 'var(--radius-btn)', fontSize: 15, fontWeight: 600, textDecoration: 'none', border: '1px solid rgba(255,255,255,0.15)', fontFamily: 'var(--font-body)', transition: 'all 0.2s' }}>
                Source Materials <ArrowRight size={16} />
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* METRICS TICKER */}
      <section style={{ background: 'var(--color-brand-dark)', borderTop: '1px solid rgba(184,245,60,0.1)', borderBottom: '1px solid rgba(184,245,60,0.1)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '32px 24px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 32, textAlign: 'center' }}>
          {[
            { value: 5000, suffix: '+', label: 'Enterprises' },
            { value: 250000, label: 'Tonnes/Year Diverted' },
            { value: 180000, label: 'tCO₂e Credits Generated' },
            { value: 85, prefix: 'USD ', suffix: 'M', label: 'Gross Merchandise Value' },
          ].map((m, i) => (
            <div key={i}>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 32, fontWeight: 800, color: 'var(--color-brand-lime)', marginBottom: 4 }}>
                <AnimatedCounter end={m.value} prefix={m.prefix || ''} suffix={m.suffix || ''} />
              </div>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', fontWeight: 500 }}>{m.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section style={{ background: 'var(--color-brand-cream)', padding: '96px 24px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} style={{ textAlign: 'center', marginBottom: 64 }}>
            <motion.h2 variants={fadeUp} style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(28px, 4vw, 44px)', color: 'var(--color-brand-forest)', marginBottom: 16 }}>How It Works</motion.h2>
            <motion.p variants={fadeUp} style={{ fontSize: 16, color: 'var(--color-brand-slate)', maxWidth: 600, margin: '0 auto' }}>From registration to settlement — a 9-step intelligent transaction lifecycle.</motion.p>
          </motion.div>

          <div style={{ display: 'flex', overflowX: 'auto', gap: 0, paddingBottom: 16 }} className="dark-scrollbar">
            {[
              { step: 1, label: 'Register', endpoint: 'POST /auth/register' },
              { step: 2, label: 'AI Classify', endpoint: 'POST /ai/classify' },
              { step: 3, label: 'List Material', endpoint: 'POST /listings' },
              { step: 4, label: 'Price Fetch', endpoint: 'GET /pricing/market' },
              { step: 5, label: 'Match Buyers', endpoint: 'GET /matching' },
              { step: 6, label: 'Buyer Confirms', endpoint: 'PATCH /interest' },
              { step: 7, label: 'ZOPA Negotiate', endpoint: 'POST /negotiate' },
              { step: 8, label: 'Escrow Lock', endpoint: 'POST /escrow/lock' },
              { step: 9, label: 'Settlement', endpoint: 'GET /dpp/{id}' },
            ].map((s, i) => (
              <div key={i} style={{ minWidth: 140, textAlign: 'center', position: 'relative', flex: '0 0 auto' }}>
                <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'var(--color-brand-forest)', color: 'var(--color-brand-lime)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px', fontSize: 14, fontWeight: 700, fontFamily: 'var(--font-mono)' }}>{s.step}</div>
                {i < 8 && <div style={{ position: 'absolute', top: 20, left: '60%', width: '80%', height: 1, background: 'var(--color-brand-mid)' }} />}
                <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-brand-forest)', marginBottom: 4 }}>{s.label}</div>
                <code style={{ fontSize: 9, color: 'var(--color-brand-slate)', fontFamily: 'var(--font-mono)' }}>{s.endpoint}</code>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ROLE CARDS */}
      <section style={{ background: 'var(--color-brand-forest)', padding: '96px 24px' }} className="grain-overlay">
        <div style={{ maxWidth: 1200, margin: '0 auto', position: 'relative', zIndex: 2 }}>
          <motion.h2 initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} style={{ textAlign: 'center', fontFamily: 'var(--font-display)', fontSize: 'clamp(28px, 4vw, 40px)', color: '#fff', marginBottom: 56 }}>
            Built for Every Role in the <span style={{ color: 'var(--color-brand-lime)' }}>Circular Chain</span>
          </motion.h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24 }}>
            {[
              { icon: Factory, title: 'Waste Generators', desc: 'List industrial waste streams, get AI-powered quality scoring, and connect with verified buyers. Automated EPR certificates and carbon credits on every transaction.', cta: 'List Your Waste', to: '/register?role=seller' },
              { icon: Leaf, title: 'End-Use Manufacturers', desc: 'Source quality-verified recycled materials with transparent provenance. Scope 3 emissions tracking and Digital Product Passports included.', cta: 'Source Materials', to: '/register?role=buyer' },
              { icon: Shield, title: 'Quality Control Team', desc: 'Structured inspection workflows, QAR submission forms, and three-tier dispute resolution. Ensure material authenticity and compliance.', cta: 'Join QC Team', to: '/register?role=qc' },
            ].map((card, i) => {
              const Icon = card.icon;
              return (
                <motion.div key={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
                  className="glass-card" style={{ padding: 32, display: 'flex', flexDirection: 'column' }}
                >
                  <div style={{ width: 48, height: 48, borderRadius: 12, background: 'rgba(184,245,60,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
                    <Icon size={24} style={{ color: '#B8F53C' }} />
                  </div>
                  <h3 style={{ fontSize: 22, color: '#fff', marginBottom: 12 }}>{card.title}</h3>
                  <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.55)', lineHeight: 1.7, flex: 1, marginBottom: 24 }}>{card.desc}</p>
                  <Link to={card.to} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 14, fontWeight: 600, color: '#B8F53C', textDecoration: 'none' }}>
                    {card.cta} <ArrowRight size={14} />
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section style={{ background: 'var(--color-brand-cream)', padding: '96px 24px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <motion.h2 initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} style={{ textAlign: 'center', fontFamily: 'var(--font-display)', fontSize: 'clamp(28px, 4vw, 40px)', color: 'var(--color-brand-forest)', marginBottom: 56 }}>
            Platform Capabilities
          </motion.h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 20 }}>
            {[
              { icon: Brain, title: 'Intelligent Routing Engine', desc: 'AI classifies and routes materials through Direct, Mediated, or Reverse Auction pathways based on MQS scores and market conditions.' },
              { icon: Zap, title: 'ZOPA-RL Negotiation', desc: 'Reinforcement learning-powered Zone of Possible Agreement engine that optimises price discovery for both parties.' },
              { icon: FileText, title: 'Digital Product Passport', desc: 'Auto-generated DPPs with full chain of custody, material composition, QAR results, and certification data — EU ESPR 2026 compliant.' },
              { icon: Shield, title: 'Compliance Automation', desc: 'Automated EPR certificates, hazardous waste manifests, and carbon credit generation on every settled transaction.' },
              { icon: Repeat, title: 'Reverse Auction Mode', desc: 'For low-MQS materials: competitive bidding by specialised processors ensures maximum value extraction from challenging waste streams.' },
              { icon: TrendingDown, title: 'Shelf-Life Decay Pricing', desc: 'Dynamic pricing that adjusts material floor prices as shelf-life approaches expiry, preventing value destruction.' },
            ].map((feat, i) => {
              const Icon = feat.icon;
              return (
                <motion.div key={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
                  className="glass-card-light" style={{ padding: 28 }}
                  onMouseEnter={e => e.currentTarget.style.boxShadow = '0 8px 30px rgba(13,43,30,0.08)'}
                  onMouseLeave={e => e.currentTarget.style.boxShadow = ''}
                >
                  <Icon size={22} style={{ color: 'var(--color-brand-mid)', marginBottom: 16 }} />
                  <h3 style={{ fontSize: 17, color: 'var(--color-brand-forest)', marginBottom: 8, fontFamily: 'var(--font-display)' }}>{feat.title}</h3>
                  <p style={{ fontSize: 14, color: 'var(--color-brand-slate)', lineHeight: 1.65, margin: 0 }}>{feat.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* TRUST BADGES */}
      <section style={{ background: 'var(--color-brand-dark)', padding: '48px 24px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', textAlign: 'center' }}>
          <div style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.15em', color: 'rgba(255,255,255,0.3)', marginBottom: 24, fontWeight: 600 }}>Trusted Compliance Frameworks</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 24 }}>
            {['Basel Convention', 'EU ESPR 2026', 'Verra VCS', 'GHG Protocol', 'Hyperledger Fabric', 'ISO 14001', 'ISO 9001'].map((badge, i) => (
              <span key={i} style={{ padding: '8px 18px', borderRadius: 6, border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.5)', fontSize: 12, fontWeight: 500 }}>{badge}</span>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section style={{ background: 'var(--color-brand-cream)', padding: '80px 24px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <h2 style={{ textAlign: 'center', fontFamily: 'var(--font-display)', fontSize: 32, color: 'var(--color-brand-forest)', marginBottom: 48 }}>What Enterprises Say</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24 }}>
            {[
              { quote: 'CIRCULARX reduced our waste disposal costs by 40% while generating carbon credits we never knew we were eligible for.', name: 'Priya Venkatesh', role: 'Head of Sustainability, TechFab Industries', company: 'TECHFAB' },
              { quote: 'The MQS scoring system and automated DPPs have transformed how we source recycled feedstock. True enterprise-grade quality assurance.', name: 'Marcus Chen', role: 'VP Procurement, GreenBuild Manufacturing', company: 'GREENBUILD' },
              { quote: 'Three-tier dispute resolution and the ZOPA engine brought trust to a market that desperately needed it.', name: 'Aisha Rahman', role: 'COO, CircularMet Recyclers', company: 'CIRCULARMET' },
            ].map((t, i) => (
              <div key={i} className="glass-card-light" style={{ padding: 28 }}>
                <p style={{ fontSize: 15, color: 'var(--color-brand-forest)', lineHeight: 1.7, fontStyle: 'italic', marginBottom: 20 }}>"{t.quote}"</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'var(--color-brand-forest)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 700, color: 'var(--color-brand-lime)' }}>{t.name.charAt(0)}</div>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--color-brand-forest)' }}>{t.name}</div>
                    <div style={{ fontSize: 12, color: 'var(--color-brand-slate)' }}>{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
