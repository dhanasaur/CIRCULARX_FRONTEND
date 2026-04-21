import { useState } from 'react';
import { motion } from 'framer-motion';
import MQSRing from '../../components/ui/MQSRing';
import StatusBadge from '../../components/ui/StatusBadge';
import { Upload, Database, Edit3, ArrowRight, CheckCircle, AlertTriangle, Shield, Cpu } from 'lucide-react';

const fadeUp = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.4 } } };

const materialTypes = [
  { code: '3901', name: 'HDPE / LDPE / LLDPE' }, { code: '3907', name: 'PET' }, { code: '3903', name: 'ABS' },
  { code: '7404', name: 'Copper Scrap' }, { code: '7204', name: 'Steel Scrap' }, { code: '7601', name: 'Aluminium' },
  { code: '4707', name: 'Paper Pulp' }, { code: '7001', name: 'Glass Cullet' }, { code: '8507', name: 'Li-Ion Batteries' },
  { code: '4004', name: 'Rubber / Tyre' }, { code: '5202', name: 'Textile Waste' },
];

const hazardClasses = ['Non-Hazardous', 'Class 1 — Explosives', 'Class 3 — Flammable Liquids', 'Class 6.1 — Toxic', 'Class 8 — Corrosive', 'Class 9 — Miscellaneous'];

const pipelineStages = ['Normalising', 'Anomaly Check', 'MQS Computation', 'No-Trade List Screen', 'Routing Decision'];
const routes = ['Direct Path', 'Mediated Path', 'Reverse Auction', 'BLOCKED'];

export default function SellerSubmitMaterial() {
  const [activeTab, setActiveTab] = useState('manual');
  const [submitted, setSubmitted] = useState(false);
  const [pipelineStep, setPipelineStep] = useState(-1);
  const [result, setResult] = useState(null);
  const [form, setForm] = useState({ materialType: '', quantity: '', unit: 'tonnes', purity: '', moisture: '', contamination: '', particleSize: '', hazardClass: 'Non-Hazardous', availability: '', logistics: '' });

  const update = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const inputStyle = { width: '100%', padding: '10px 12px', borderRadius: 6, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: '#fff', fontSize: 13, outline: 'none', boxSizing: 'border-box', fontFamily: 'var(--font-body)' };
  const labelStyle = { fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: 6 };

  const handleSubmit = async () => {
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
    { key: 'sensor', label: 'Sensor Upload', icon: Upload, badge: '0.85' },
    { key: 'erp', label: 'ERP Import', icon: Database, badge: '0.75' },
    { key: 'manual', label: 'Manual Entry', icon: Edit3, badge: '0.55' },
  ];

  return (
    <motion.div initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.08 } } }}>
      <motion.div variants={fadeUp} style={{ marginBottom: 24 }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 700, color: '#fff', marginBottom: 4 }}>Submit Material</h1>
        <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)' }}>Submit material data for AI classification and MQS scoring</p>
      </motion.div>

      {!submitted ? (
        <>
          {/* Tabs */}
          <motion.div variants={fadeUp} style={{ display: 'flex', gap: 8, marginBottom: 24, flexWrap: 'wrap' }}>
            {tabs.map(tab => {
              const Icon = tab.icon;
              const active = activeTab === tab.key;
              return (
                <button key={tab.key} onClick={() => setActiveTab(tab.key)} style={{
                  display: 'flex', alignItems: 'center', gap: 8, padding: '10px 20px', borderRadius: 'var(--radius-btn)',
                  background: active ? 'rgba(184,245,60,0.1)' : 'rgba(255,255,255,0.03)', border: `1px solid ${active ? 'rgba(184,245,60,0.25)' : 'rgba(255,255,255,0.06)'}`,
                  color: active ? '#B8F53C' : 'rgba(255,255,255,0.5)', cursor: 'pointer', fontSize: 13, fontWeight: 600, fontFamily: 'var(--font-body)',
                }}>
                  <Icon size={16} /> {tab.label}
                  <span style={{ fontSize: 10, padding: '1px 6px', borderRadius: 4, background: 'rgba(255,255,255,0.06)', fontFamily: 'var(--font-mono)', color: 'rgba(255,255,255,0.35)' }}>w: {tab.badge}</span>
                </button>
              );
            })}
          </motion.div>

          {/* Sensor Tab */}
          {activeTab === 'sensor' && (
            <motion.div variants={fadeUp} className="glass-card" style={{ padding: 32 }}>
              <div style={{ border: '2px dashed rgba(184,245,60,0.2)', borderRadius: 'var(--radius-card)', padding: 48, textAlign: 'center' }}>
                <Upload size={40} style={{ color: 'rgba(255,255,255,0.2)', marginBottom: 16 }} />
                <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.6)', marginBottom: 8 }}>Drop sensor output file here</p>
                <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)' }}>Supports JSON, CSV from NIR/XRF/TinyML sensors</p>
                <button style={{ marginTop: 16, padding: '10px 24px', borderRadius: 'var(--radius-btn)', background: 'rgba(184,245,60,0.1)', color: '#B8F53C', border: '1px solid rgba(184,245,60,0.25)', cursor: 'pointer', fontSize: 13, fontWeight: 600, fontFamily: 'var(--font-body)' }}>Browse Files</button>
              </div>
            </motion.div>
          )}

          {/* ERP Tab */}
          {activeTab === 'erp' && (
            <motion.div variants={fadeUp} className="glass-card" style={{ padding: 32 }}>
              <h3 style={{ fontSize: 15, color: '#fff', marginBottom: 16 }}>ERP Connector</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 24 }}>
                {['SAP S/4HANA', 'Oracle EBS', 'Dynamics 365'].map(erp => (
                  <button key={erp} style={{ padding: 20, borderRadius: 'var(--radius-card)', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.6)', cursor: 'pointer', fontSize: 14, fontWeight: 500, textAlign: 'center', fontFamily: 'var(--font-body)' }}>{erp}</button>
                ))}
              </div>
              <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)' }}>Last sync: Never · Configure OAuth to connect</p>
            </motion.div>
          )}

          {/* Manual Tab */}
          {activeTab === 'manual' && (
            <motion.div variants={fadeUp} className="glass-card" style={{ padding: 32 }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 20 }}>
                <div><label style={labelStyle}>Material Type</label><select style={inputStyle} value={form.materialType} onChange={e => update('materialType', e.target.value)}><option value="">Select material</option>{materialTypes.map(m => <option key={m.code} value={m.code} style={{ background: '#060F09' }}>{m.code} — {m.name}</option>)}</select></div>
                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 8 }}>
                  <div><label style={labelStyle}>Quantity</label><input style={inputStyle} type="number" value={form.quantity} onChange={e => update('quantity', e.target.value)} placeholder="0" /></div>
                  <div><label style={labelStyle}>Unit</label><select style={inputStyle} value={form.unit} onChange={e => update('unit', e.target.value)}><option value="tonnes" style={{ background: '#060F09' }}>Tonnes</option><option value="kg" style={{ background: '#060F09' }}>Kg</option><option value="litres" style={{ background: '#060F09' }}>Litres</option></select></div>
                </div>
                <div><label style={labelStyle}>Purity %</label><input style={inputStyle} type="number" value={form.purity} onChange={e => update('purity', e.target.value)} placeholder="95.0" /></div>
                <div><label style={labelStyle}>Moisture %</label><input style={inputStyle} type="number" value={form.moisture} onChange={e => update('moisture', e.target.value)} placeholder="1.5" /></div>
                <div><label style={labelStyle}>Contamination %</label><input style={inputStyle} type="number" value={form.contamination} onChange={e => update('contamination', e.target.value)} placeholder="2.0" /></div>
                <div><label style={labelStyle}>Particle Size</label><input style={inputStyle} value={form.particleSize} onChange={e => update('particleSize', e.target.value)} placeholder="3-5mm" /></div>
                <div><label style={labelStyle}>Hazard Class</label><select style={inputStyle} value={form.hazardClass} onChange={e => update('hazardClass', e.target.value)}>{hazardClasses.map(h => <option key={h} value={h} style={{ background: '#060F09' }}>{h}</option>)}</select></div>
                <div><label style={labelStyle}>Availability Period</label><input style={inputStyle} type="date" value={form.availability} onChange={e => update('availability', e.target.value)} /></div>
              </div>
              <div style={{ marginTop: 20 }}><label style={labelStyle}>Logistics Constraints</label><textarea style={{ ...inputStyle, minHeight: 60, resize: 'vertical' }} value={form.logistics} onChange={e => update('logistics', e.target.value)} placeholder="e.g., No rail transport; must use covered trucks" /></div>
              <div style={{ marginTop: 24, display: 'flex', alignItems: 'center', gap: 12 }}>
                <button onClick={handleSubmit} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '12px 28px', borderRadius: 'var(--radius-btn)', background: '#B8F53C', color: 'var(--color-brand-dark)', border: 'none', cursor: 'pointer', fontSize: 14, fontWeight: 700, fontFamily: 'var(--font-body)' }}>
                  Submit to IRE <ArrowRight size={16} />
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
            <div style={{ display: 'flex', gap: 0, marginBottom: 32 }}>
              {pipelineStages.map((stage, i) => {
                const done = i <= pipelineStep;
                const active = i === pipelineStep && !result;
                return (
                  <div key={i} style={{ flex: 1, textAlign: 'center', position: 'relative' }}>
                    <div style={{
                      width: 36, height: 36, borderRadius: '50%', margin: '0 auto 8px',
                      background: done ? 'rgba(184,245,60,0.15)' : 'rgba(255,255,255,0.04)',
                      border: `2px solid ${done ? '#B8F53C' : 'rgba(255,255,255,0.08)'}`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      transition: 'all 0.4s ease',
                      boxShadow: active ? '0 0 20px rgba(184,245,60,0.3)' : 'none',
                    }}>
                      {done ? <CheckCircle size={16} style={{ color: '#B8F53C' }} /> : <Cpu size={14} style={{ color: 'rgba(255,255,255,0.2)' }} />}
                    </div>
                    {i < pipelineStages.length - 1 && <div style={{ position: 'absolute', top: 18, left: '60%', width: '80%', height: 2, background: done ? '#B8F53C' : 'rgba(255,255,255,0.06)', transition: 'background 0.4s' }} />}
                    <div style={{ fontSize: 11, color: done ? '#B8F53C' : 'rgba(255,255,255,0.3)', fontWeight: done ? 600 : 400, transition: 'color 0.4s' }}>{stage}</div>
                  </div>
                );
              })}
            </div>

            {!result && <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.4)', fontSize: 13, fontStyle: 'italic' }}>Routing your materials through the IRE pipeline...</p>}

            {result && (
              <div style={{ textAlign: 'center', padding: 24, borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                <MQSRing score={result.mqs} size={96} strokeWidth={6} />
                <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', marginTop: 12, marginBottom: 8 }}>Material Quality Score</div>
                <StatusBadge status={result.route} color={result.route === 'BLOCKED' ? 'danger' : result.route === 'Direct Path' ? 'lime' : 'amber'} size="md" />
                <div style={{ marginTop: 20, display: 'flex', justifyContent: 'center', gap: 8 }}>
                  <button style={{ padding: '10px 20px', borderRadius: 'var(--radius-btn)', background: '#B8F53C', color: 'var(--color-brand-dark)', border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 700, fontFamily: 'var(--font-body)' }}>Publish Listing</button>
                  <button onClick={() => { setSubmitted(false); setPipelineStep(-1); setResult(null); }} style={{ padding: '10px 20px', borderRadius: 'var(--radius-btn)', background: 'rgba(255,255,255,0.04)', color: 'rgba(255,255,255,0.5)', border: '1px solid rgba(255,255,255,0.08)', cursor: 'pointer', fontSize: 13, fontFamily: 'var(--font-body)' }}>Submit Another</button>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
