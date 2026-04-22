import { motion } from 'framer-motion';
import { Leaf, TrendingDown, Download, Factory, Droplets, Recycle, ArrowRight } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';

const fadeUp = { hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0 } };
const stagger = { visible: { transition: { staggerChildren: 0.06 } } };

const monthlyEmissions = [
  { month: 'Oct', avoided: 18, baseline: 42 }, { month: 'Nov', avoided: 24, baseline: 45 },
  { month: 'Dec', avoided: 21, baseline: 40 }, { month: 'Jan', avoided: 32, baseline: 52 },
  { month: 'Feb', avoided: 38, baseline: 55 }, { month: 'Mar', avoided: 42, baseline: 58 },
];

const materialImpact = [
  { material: 'HDPE Pellets', avoided: 38, baseline: 62, savings: '39%', color: '#B8F53C' },
  { material: 'Aluminium Ingots', avoided: 85, baseline: 120, savings: '29%', color: '#38BDF8' },
  { material: 'Paper Pulp', avoided: 12, baseline: 28, savings: '57%', color: '#F59E0B' },
  { material: 'PET Flakes', avoided: 22, baseline: 45, savings: '51%', color: '#A78BFA' },
  { material: 'Glass Cullet', avoided: 8, baseline: 18, savings: '56%', color: '#FB7185' },
];

const methodology = [
  { label: 'Virgin Material Displacement', desc: 'Emissions avoided by replacing primary material extraction and processing', value: '142 tCO₂e', icon: Factory },
  { label: 'Landfill Methane Avoidance', desc: 'CH₄ emissions prevented by diverting waste from landfill', value: '86 tCO₂e', icon: Droplets },
  { label: 'Transport Optimisation', desc: 'Emissions reduced through AI-optimised logistics routing', value: '12 tCO₂e', icon: Recycle },
];

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: 'rgba(6,15,9,0.95)', border: '1px solid rgba(56,189,248,0.15)', borderRadius: 10, padding: '10px 14px', backdropFilter: 'blur(8px)' }}>
      <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', marginBottom: 4, fontFamily: 'var(--font-mono)' }}>{label}</div>
      {payload.map((p, i) => (
        <div key={i} style={{ fontSize: 13, fontWeight: 600, color: p.color || '#fff' }}>{p.name}: {p.value} tCO₂e</div>
      ))}
    </div>
  );
};

export default function BuyerScope3() {
  const totalAvoided = monthlyEmissions.reduce((s, m) => s + m.avoided, 0);
  const totalBaseline = monthlyEmissions.reduce((s, m) => s + m.baseline, 0);

  return (
    <motion.div initial="hidden" animate="visible" variants={stagger}>
      <motion.div variants={fadeUp} transition={{ duration: 0.4 }} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 28, flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h1 className="dash-h1" style={{ marginBottom: 6 }}>Scope 3 GHG Tracker</h1>
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)' }}>Category 1 — Purchased Goods & Services · GHG Protocol Aligned</p>
        </div>
        <button style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '10px 20px', borderRadius: 10, background: 'rgba(56,189,248,0.08)', color: '#38BDF8', border: '1px solid rgba(56,189,248,0.2)', cursor: 'pointer', fontSize: 13, fontWeight: 600, fontFamily: 'var(--font-body)' }}>
          <Download size={14} /> Export CSV
        </button>
      </motion.div>

      {/* Impact Summary */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 14, marginBottom: 28 }}>
        {[
          { label: 'Total Emissions Avoided', value: `${totalAvoided} tCO₂e`, color: '#38BDF8', icon: Leaf },
          { label: 'Baseline Emissions', value: `${totalBaseline} tCO₂e`, color: 'rgba(255,255,255,0.5)', icon: Factory },
          { label: 'Reduction Rate', value: `${Math.round((totalAvoided / totalBaseline) * 100)}%`, color: '#B8F53C', icon: TrendingDown },
          { label: 'Carbon Credits Earned', value: '24 VCUs', color: '#F59E0B', icon: Recycle },
        ].map((stat, i) => (
          <motion.div key={i} variants={fadeUp} transition={{ duration: 0.4 }} style={{
            padding: 22, borderRadius: 14,
            background: 'rgba(255,255,255,0.025)', border: `1px solid ${stat.color === 'rgba(255,255,255,0.5)' ? 'rgba(255,255,255,0.06)' : stat.color + '18'}`,
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.45)' }}>{stat.label}</span>
              <stat.icon size={16} style={{ color: stat.color }} />
            </div>
            <div style={{ fontSize: 28, fontFamily: 'var(--font-display)', fontWeight: 800, color: stat.color, letterSpacing: '-0.03em' }}>{stat.value}</div>
          </motion.div>
        ))}
      </div>

      {/* Monthly Emissions Chart */}
      <motion.div variants={fadeUp} transition={{ duration: 0.4 }} style={{ padding: 24, borderRadius: 14, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', marginBottom: 16 }}>
        <h3 style={{ fontSize: 14, fontWeight: 600, color: 'rgba(255,255,255,0.7)', marginBottom: 20 }}>Monthly Emissions: Baseline vs Avoided</h3>
        <ResponsiveContainer width="100%" height={240}>
          <AreaChart data={monthlyEmissions}>
            <defs>
              <linearGradient id="baseGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#64748B" stopOpacity={0.15}/><stop offset="100%" stopColor="#64748B" stopOpacity={0}/></linearGradient>
              <linearGradient id="avoidGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#38BDF8" stopOpacity={0.2}/><stop offset="100%" stopColor="#38BDF8" stopOpacity={0}/></linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
            <XAxis dataKey="month" tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: 'rgba(255,255,255,0.25)', fontSize: 11, fontFamily: 'var(--font-mono)' }} axisLine={false} tickLine={false} />
            <Tooltip content={<CustomTooltip />} />
            <Area type="monotone" dataKey="baseline" stroke="#64748B" strokeWidth={1.5} fill="url(#baseGrad)" dot={false} name="Baseline" />
            <Area type="monotone" dataKey="avoided" stroke="#38BDF8" strokeWidth={2.5} fill="url(#avoidGrad)" dot={{ fill: '#38BDF8', r: 3 }} name="Avoided" />
          </AreaChart>
        </ResponsiveContainer>
        <div style={{ display: 'flex', gap: 20, justifyContent: 'center', marginTop: 12 }}>
          {[{ label: 'Baseline (virgin)', color: '#64748B' }, { label: 'Emissions Avoided', color: '#38BDF8' }].map((l, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: 'rgba(255,255,255,0.5)' }}>
              <span style={{ width: 10, height: 3, borderRadius: 2, background: l.color }} /> {l.label}
            </div>
          ))}
        </div>
      </motion.div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }} className="scope3-grid">
        {/* Per-Material Impact */}
        <motion.div variants={fadeUp} transition={{ duration: 0.4 }} style={{ padding: 24, borderRadius: 14, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
          <h3 style={{ fontSize: 14, fontWeight: 600, color: 'rgba(255,255,255,0.7)', marginBottom: 16 }}>Per-Material Carbon Impact</h3>
          {materialImpact.map((m, i) => (
            <div key={i} style={{ marginBottom: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                <span style={{ fontSize: 13, color: '#fff', fontWeight: 500 }}>{m.material}</span>
                <span style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: '#B8F53C' }}>-{m.savings}</span>
              </div>
              <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
                <div style={{ flex: 1, height: 8, borderRadius: 4, background: 'rgba(255,255,255,0.04)', overflow: 'hidden', position: 'relative' }}>
                  <div style={{ position: 'absolute', height: '100%', width: `${(m.baseline / 120) * 100}%`, background: 'rgba(100,116,139,0.3)', borderRadius: 4 }} />
                  <div style={{ position: 'absolute', height: '100%', width: `${(m.avoided / 120) * 100}%`, background: m.color, borderRadius: 4, transition: 'width 1s ease' }} />
                </div>
                <span style={{ fontSize: 10, fontFamily: 'var(--font-mono)', color: 'rgba(255,255,255,0.3)', width: 55, textAlign: 'right' }}>{m.avoided}/{m.baseline}</span>
              </div>
            </div>
          ))}
        </motion.div>

        {/* Methodology */}
        <motion.div variants={fadeUp} transition={{ duration: 0.4 }} style={{ padding: 24, borderRadius: 14, background: 'rgba(56,189,248,0.03)', border: '1px solid rgba(56,189,248,0.1)' }}>
          <h3 style={{ fontSize: 14, fontWeight: 600, color: 'rgba(255,255,255,0.7)', marginBottom: 16 }}>Methodology Breakdown</h3>
          {methodology.map((m, i) => {
            const Icon = m.icon;
            return (
              <div key={i} style={{ padding: 16, borderRadius: 10, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)', marginBottom: 8 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Icon size={14} style={{ color: '#38BDF8' }} />
                    <span style={{ fontSize: 13, fontWeight: 600, color: '#fff' }}>{m.label}</span>
                  </div>
                  <span style={{ fontSize: 14, fontFamily: 'var(--font-mono)', fontWeight: 700, color: '#38BDF8' }}>{m.value}</span>
                </div>
                <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', margin: 0, lineHeight: 1.5 }}>{m.desc}</p>
              </div>
            );
          })}
          <div style={{ textAlign: 'center', marginTop: 12 }}>
            <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.25)', fontFamily: 'var(--font-mono)' }}>Verified under Verra VCS Standard</span>
          </div>
        </motion.div>
      </div>

      <style>{`@media (max-width: 1024px) { .scope3-grid { grid-template-columns: 1fr !important; } }`}</style>
    </motion.div>
  );
}
