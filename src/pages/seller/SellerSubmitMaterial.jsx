import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import MQSRing from '../../components/ui/MQSRing';
import StatusBadge from '../../components/ui/StatusBadge';
import { Upload, Database, Edit3, ArrowRight, CheckCircle, AlertTriangle, Shield, Cpu, Sparkles, Loader2 } from 'lucide-react';

const fadeUp = { hidden: { opacity: 0, y: 18 }, visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } } };

const materialTypes = [
  { code: '3901', name: 'HDPE / LDPE / LLDPE' }, { code: '3907', name: 'PET' }, { code: '3903', name: 'ABS' },
  { code: '7404', name: 'Copper Scrap' }, { code: '7204', name: 'Steel Scrap' }, { code: '7601', name: 'Aluminium' },
  { code: '4707', name: 'Paper Pulp' }, { code: '7001', name: 'Glass Cullet' }, { code: '8507', name: 'Li-Ion Batteries' },
  { code: '4004', name: 'Rubber / Tyre' }, { code: '5202', name: 'Textile Waste' },
];

const hazardClasses = ['Non-Hazardous', 'Class 1 — Explosives', 'Class 3 — Flammable Liquids', 'Class 6.1 — Toxic', 'Class 8 — Corrosive', 'Class 9 — Miscellaneous'];

const pipelineStages = ['Normalising', 'Anomaly Check', 'MQS Computation', 'No-Trade List Screen', 'Routing Decision'];
const routes = ['Direct Path', 'Mediated Path', 'Reverse Auction', 'BLOCKED'];

/* ── Section Divider ── */
function SectionTitle({ children }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '24px 0 14px' }}>
      <span className="dash-micro-label" style={{ flexShrink: 0 }}>{children}</span>
      <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.06)' }} />
    </div>
  );
}

export default function SellerSubmitMaterial() {
  const [activeTab, setActiveTab] = useState('manual');
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [pipelineStep, setPipelineStep] = useState(-1);
  const [result, setResult] = useState(null);
  const [form, setForm] = useState({ materialType: '', quantity: '', unit: 'tonnes', purity: '', moisture: '', contamination: '', particleSize: '', hazardClass: 'Non-Hazardous', availability: '', logistics: '' });

  const update = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const autoFill = () => {
    setForm({ materialType: '3901', quantity: '45', unit: 'tonnes', purity: '96.2', moisture: '1.1', contamination: '1.8', particleSize: '3-5mm', hazardClass: 'Non-Hazardous', availability: '2025-06-15', logistics: 'Covered trucks only; no rail' });
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    await new Promise(r => setTimeout(r, 600));
    setSubmitting(false);
    setSubmitted(true);
    for (let i = 0; i < pipelineStages.length; i++) {
      await new Promise(r => setTimeout(r, 800));
      setPipelineStep(i);
    }
    await new Promise(r => setTimeout(r, 500));
    const mqs = Math.floor(Math.random() * 50) + 45;
    const routeIdx = mqs >= 75 ? 0 : mqs >= 50 ? 1 : mqs >= 30 ? 2 : 3;
    setResult({ mqs, route: routes[routeIdx] });
  };

  const tabs = [
    { key: 'sensor', label: 'Sensor Upload', desc: 'NIR / XRF / TinyML data', icon: Upload, badge: '0.85' },
    { key: 'erp', label: 'ERP Import', desc: 'SAP, Oracle, Dynamics', icon: Database, badge: '0.75' },
    { key: 'manual', label: 'Manual Entry', desc: 'Form-based submission', icon: Edit3, badge: '0.55' },
  ];

  return (
    <motion.div initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.06 } } }}>
      <motion.div variants={fadeUp} style={{ marginBottom: 24 }}>
        <h1 className="dash-h1" style={{ marginBottom: 4 }}>Submit Material</h1>
        <p className="dash-subtitle">Submit material data for AI classification and MQS scoring</p>
      </motion.div>

      {!submitted ? (
        <>
          {/* ── Icon Card Tabs ── */}
          <motion.div variants={fadeUp} style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 24 }}>
            {tabs.map(tab => {
              const Icon = tab.icon;
              const active = activeTab === tab.key;
              return (
                <button key={tab.key} onClick={() => setActiveTab(tab.key)} style={{
                  display: 'flex', alignItems: 'center', gap: 14, padding: '18px 20px',
                  borderRadius: 14, cursor: 'pointer', textAlign: 'left', border: 'none',
                  background: active
                    ? 'linear-gradient(135deg, rgba(184,245,60,0.08), rgba(184,245,60,0.02))'
                    : 'linear-gradient(135deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.01) 100%)',
                  borderWidth: 1, borderStyle: 'solid',
                  borderColor: active ? 'rgba(184,245,60,0.25)' : 'rgba(255,255,255,0.06)',
                  transition: 'all 0.25s cubic-bezier(0.4,0,0.2,1)',
                  boxShadow: active ? '0 0 20px rgba(184,245,60,0.08), inset 0 1px 0 rgba(184,245,60,0.06)' : 'inset 0 1px 0 rgba(255,255,255,0.04)',
                }}>
                  <div style={{
                    width: 44, height: 44, borderRadius: 11,
                    background: active ? 'rgba(184,245,60,0.12)' : 'rgba(255,255,255,0.04)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: active ? '#B8F53C' : 'rgba(255,255,255,0.3)',
                    transition: 'all 0.2s', flexShrink: 0,
                  }}>
                    <Icon size={20} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 14, fontWeight: 700, color: active ? '#fff' : 'rgba(255,255,255,0.6)', marginBottom: 2 }}>{tab.label}</div>
                    <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', fontFamily: 'var(--font-mono)' }}>{tab.desc}</div>
                  </div>
                  <span style={{
                    fontSize: 10, padding: '2px 7px', borderRadius: 5,
                    background: active ? 'rgba(184,245,60,0.1)' : 'rgba(255,255,255,0.05)',
                    fontFamily: 'var(--font-mono)', fontWeight: 700,
                    color: active ? '#B8F53C' : 'rgba(255,255,255,0.25)',
                  }}>w: {tab.badge}</span>
                </button>
              );
            })}
          </motion.div>

          {/* Sensor Tab */}
          {activeTab === 'sensor' && (
            <motion.div variants={fadeUp} className="glass-card" style={{ padding: 32 }}>
              <div style={{ border: '2px dashed rgba(184,245,60,0.2)', borderRadius: 'var(--radius-card)', padding: 48, textAlign: 'center' }}>
                <Upload size={40} style={{ color: 'rgba(184,245,60,0.3)', marginBottom: 16 }} />
                <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.6)', marginBottom: 8 }}>Drop sensor output file here</p>
                <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)', fontFamily: 'var(--font-mono)' }}>Supports JSON, CSV from NIR/XRF/TinyML sensors</p>
                <button className="btn-secondary" style={{ marginTop: 16 }}>Browse Files</button>
              </div>
            </motion.div>
          )}

          {/* ERP Tab */}
          {activeTab === 'erp' && (
            <motion.div variants={fadeUp} className="glass-card" style={{ padding: 32 }}>
              <h3 style={{ fontSize: 15, color: '#fff', marginBottom: 16, fontFamily: 'var(--font-display)' }}>ERP Connector</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 24 }}>
                {['SAP S/4HANA', 'Oracle EBS', 'Dynamics 365'].map(erp => (
                  <button key={erp} className="btn-secondary" style={{ padding: 20, justifyContent: 'center' }}>{erp}</button>
                ))}
              </div>
              <p className="dash-subtitle">Last sync: Never · Configure OAuth to connect</p>
            </motion.div>
          )}

          {/* Manual Tab */}
          {activeTab === 'manual' && (
            <motion.div variants={fadeUp} className="glass-card" style={{ padding: 32 }}>
              {/* AI Pre-fill */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 4 }}>
                <button onClick={autoFill} style={{
                  display: 'flex', alignItems: 'center', gap: 5,
                  background: 'none', border: 'none', cursor: 'pointer',
                  color: '#B8F53C', fontSize: 11, fontFamily: 'var(--font-mono)', fontWeight: 600,
                  opacity: 0.7, transition: 'opacity 0.2s',
                }}
                onMouseEnter={e => e.currentTarget.style.opacity = '1'}
                onMouseLeave={e => e.currentTarget.style.opacity = '0.7'}
                >
                  <Sparkles size={12} /> Auto-fill from last submission
                </button>
              </div>

              {/* Section: Material Identity */}
              <SectionTitle>Material Identity</SectionTitle>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 16 }}>
                <div><label className="dash-label">Material Type</label><select className="dash-select" value={form.materialType} onChange={e => update('materialType', e.target.value)}><option value="">Select material</option>{materialTypes.map(m => <option key={m.code} value={m.code}>{m.code} — {m.name}</option>)}</select></div>
                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 8 }}>
                  <div><label className="dash-label">Quantity</label><input className="dash-input" type="number" value={form.quantity} onChange={e => update('quantity', e.target.value)} placeholder="0" /></div>
                  <div><label className="dash-label">Unit</label><select className="dash-select" value={form.unit} onChange={e => update('unit', e.target.value)}><option value="tonnes">Tonnes</option><option value="kg">Kg</option><option value="litres">Litres</option></select></div>
                </div>
              </div>

              {/* Section: Quality Parameters */}
              <SectionTitle>Quality Parameters</SectionTitle>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
                <div><label className="dash-label">Purity %</label><input className="dash-input" type="number" value={form.purity} onChange={e => update('purity', e.target.value)} placeholder="95.0" /></div>
                <div><label className="dash-label">Moisture %</label><input className="dash-input" type="number" value={form.moisture} onChange={e => update('moisture', e.target.value)} placeholder="1.5" /></div>
                <div><label className="dash-label">Contamination %</label><input className="dash-input" type="number" value={form.contamination} onChange={e => update('contamination', e.target.value)} placeholder="2.0" /></div>
                <div><label className="dash-label">Particle Size</label><input className="dash-input" value={form.particleSize} onChange={e => update('particleSize', e.target.value)} placeholder="3-5mm" /></div>
              </div>

              {/* Section: Logistics */}
              <SectionTitle>Logistics & Compliance</SectionTitle>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 16 }}>
                <div><label className="dash-label">Hazard Class</label><select className="dash-select" value={form.hazardClass} onChange={e => update('hazardClass', e.target.value)}>{hazardClasses.map(h => <option key={h} value={h}>{h}</option>)}</select></div>
                <div><label className="dash-label">Availability Period</label><input className="dash-input" type="date" value={form.availability} onChange={e => update('availability', e.target.value)} /></div>
              </div>
              <div style={{ marginTop: 16 }}><label className="dash-label">Logistics Constraints</label><textarea className="dash-input" style={{ minHeight: 60, resize: 'vertical' }} value={form.logistics} onChange={e => update('logistics', e.target.value)} placeholder="e.g., No rail transport; must use covered trucks" /></div>

              {/* Submit */}
              <div style={{ marginTop: 24, display: 'flex', alignItems: 'center', gap: 12 }}>
                <button onClick={handleSubmit} disabled={submitting} className="btn-primary" style={{ opacity: submitting ? 0.7 : 1 }}>
                  {submitting ? <><Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> Processing...</> : <>Submit to IRE <ArrowRight size={16} /></>}
                </button>
                <span className="api-tooltip">POST /ai/classify</span>
              </div>
            </motion.div>
          )}
        </>
      ) : (
        /* IRE Pipeline Progress */
        <motion.div variants={fadeUp}>
          <div className="glass-card" style={{ padding: 32 }}>
            <h3 style={{ fontSize: 16, color: '#fff', marginBottom: 24, fontFamily: 'var(--font-display)' }}>IRE Pipeline Processing</h3>

            {/* Pipeline Node Connector */}
            <div style={{ display: 'flex', gap: 0, marginBottom: 32, position: 'relative' }}>
              {pipelineStages.map((stage, i) => {
                const done = i <= pipelineStep;
                const active = i === pipelineStep && !result;
                return (
                  <div key={i} style={{ flex: 1, textAlign: 'center', position: 'relative' }}>
                    <div style={{
                      width: 38, height: 38, borderRadius: '50%', margin: '0 auto 8px',
                      background: done ? 'rgba(184,245,60,0.15)' : 'rgba(255,255,255,0.04)',
                      border: `2px solid ${done ? '#B8F53C' : 'rgba(255,255,255,0.08)'}`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      transition: 'all 0.4s ease',
                      boxShadow: active ? '0 0 0 4px rgba(184,245,60,0.15), 0 0 20px rgba(184,245,60,0.2)' : done ? '0 0 12px rgba(184,245,60,0.15)' : 'none',
                    }}>
                      {done ? <CheckCircle size={16} style={{ color: '#B8F53C' }} /> : <Cpu size={14} style={{ color: 'rgba(255,255,255,0.2)' }} />}
                    </div>
                    {i < pipelineStages.length - 1 && (
                      <div style={{
                        position: 'absolute', top: 19, left: '60%', width: '80%', height: 2,
                        background: 'rgba(255,255,255,0.06)', overflow: 'hidden', borderRadius: 1,
                      }}>
                        <div style={{
                          width: '100%', height: '100%', background: '#B8F53C',
                          transform: done ? 'translateX(0)' : 'translateX(-100%)',
                          transition: 'transform 0.6s ease',
                        }} />
                      </div>
                    )}
                    <div style={{ fontSize: 10, color: done ? '#B8F53C' : 'rgba(255,255,255,0.3)', fontWeight: done ? 700 : 400, transition: 'color 0.4s', fontFamily: 'var(--font-mono)', letterSpacing: '0.02em' }}>{stage}</div>
                  </div>
                );
              })}
            </div>

            {!result && <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.4)', fontSize: 13, fontStyle: 'italic', fontFamily: 'var(--font-body)' }}>Routing your materials through the IRE pipeline...</p>}

            {/* Result Card */}
            <AnimatePresence>
              {result && (
                <motion.div
                  initial={{ y: 40, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                  style={{
                    textAlign: 'center', padding: 32,
                    borderTop: `1px solid ${result.route === 'BLOCKED' ? 'rgba(239,68,68,0.15)' : 'rgba(184,245,60,0.1)'}`,
                    background: result.route === 'BLOCKED' ? 'rgba(239,68,68,0.03)' : 'rgba(184,245,60,0.02)',
                    borderRadius: '0 0 14px 14px', marginTop: 16,
                  }}
                >
                  <MQSRing score={result.mqs} size={96} strokeWidth={6} />
                  <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', marginTop: 12, marginBottom: 8, fontFamily: 'var(--font-mono)' }}>Material Quality Score</div>
                  <StatusBadge status={result.route} color={result.route === 'BLOCKED' ? 'danger' : result.route === 'Direct Path' ? 'lime' : 'amber'} size="md" />

                  {result.route === 'BLOCKED' && (
                    <div style={{ marginTop: 16, padding: '12px 16px', borderRadius: 10, background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.12)', textAlign: 'left' }}>
                      <div style={{ fontSize: 12, fontWeight: 700, color: '#fb7185', marginBottom: 6 }}>Improvement Recommendations:</div>
                      <ul style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', margin: 0, paddingLeft: 16, lineHeight: 1.8 }}>
                        <li>Increase purity above 85% threshold</li>
                        <li>Reduce contamination to below 3%</li>
                        <li>Provide certified lab analysis report</li>
                      </ul>
                    </div>
                  )}

                  <div style={{ marginTop: 20, display: 'flex', justifyContent: 'center', gap: 8 }}>
                    <button className="btn-primary">Publish Listing</button>
                    <button onClick={() => { setSubmitted(false); setPipelineStep(-1); setResult(null); }} className="btn-secondary">Submit Another</button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
