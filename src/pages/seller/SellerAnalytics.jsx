import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, ScatterChart, Scatter, AreaChart, Area } from 'recharts';
import { TrendingUp, Recycle, MapPin, FileText } from 'lucide-react';

const fadeUp = { hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0 } };
const stagger = { visible: { transition: { staggerChildren: 0.06 } } };

const categoryBreakdown = [
  { name: 'Plastics', value: 38, color: '#B8F53C' },
  { name: 'Metals', value: 25, color: '#38BDF8' },
  { name: 'Paper', value: 18, color: '#F59E0B' },
  { name: 'Glass', value: 8, color: '#A78BFA' },
  { name: 'Rubber', value: 6, color: '#FB7185' },
  { name: 'Other', value: 5, color: '#64748B' },
];

const revenueVsVolume = [
  { volume: 45, revenue: 1890, name: 'HDPE' }, { volume: 120, revenue: 3600, name: 'PET' },
  { volume: 200, revenue: 4800, name: 'Paper' }, { volume: 30, revenue: 67500, name: 'Aluminium' },
  { volume: 8, revenue: 51600, name: 'Copper' }, { volume: 15, revenue: 1110, name: 'Nylon' },
  { volume: 80, revenue: 4000, name: 'Rubber' }, { volume: 150, revenue: 2700, name: 'Glass' },
];

const mqsTrend = [
  { month: 'Oct', avg: 68 }, { month: 'Nov', avg: 72 }, { month: 'Dec', avg: 70 },
  { month: 'Jan', avg: 75 }, { month: 'Feb', avg: 78 }, { month: 'Mar', avg: 81 },
];

const buyerGeo = [
  { city: 'Pune', count: 12, value: '$82K' }, { city: 'Mumbai', count: 8, value: '$65K' },
  { city: 'Chennai', count: 6, value: '$41K' }, { city: 'Delhi', count: 5, value: '$38K' },
  { city: 'Ahmedabad', count: 4, value: '$29K' }, { city: 'Bengaluru', count: 3, value: '$22K' },
];

const complianceTimeline = [
  { month: 'Oct', epr: 1, carbon: 1, dpp: 1 }, { month: 'Nov', epr: 2, carbon: 2, dpp: 2 },
  { month: 'Dec', epr: 1, carbon: 1, dpp: 1 }, { month: 'Jan', epr: 3, carbon: 3, dpp: 3 },
  { month: 'Feb', epr: 2, carbon: 2, dpp: 2 }, { month: 'Mar', epr: 3, carbon: 3, dpp: 3 },
];

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: 'rgba(6,15,9,0.95)', border: '1px solid rgba(184,245,60,0.15)', borderRadius: 10, padding: '10px 14px', backdropFilter: 'blur(8px)' }}>
      <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', marginBottom: 4, fontFamily: 'var(--font-mono)' }}>{label || payload[0]?.payload?.name}</div>
      {payload.map((p, i) => (
        <div key={i} style={{ fontSize: 13, fontWeight: 600, color: p.color || '#fff', display: 'flex', gap: 8 }}>
          <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11 }}>{p.name}:</span> {typeof p.value === 'number' ? p.value.toLocaleString() : p.value}
        </div>
      ))}
    </div>
  );
};

export default function SellerAnalytics() {
  return (
    <motion.div initial="hidden" animate="visible" variants={stagger}>
      <motion.div variants={fadeUp} transition={{ duration: 0.4 }} style={{ marginBottom: 28 }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 26, fontWeight: 800, color: '#fff', marginBottom: 6, letterSpacing: '-0.02em' }}>Analytics</h1>
        <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)' }}>Comprehensive insights into your circular economy operations</p>
      </motion.div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }} className="analytics-grid">
        {/* Category Breakdown */}
        <motion.div variants={fadeUp} transition={{ duration: 0.4 }} style={{ padding: 24, borderRadius: 14, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
            <Recycle size={16} style={{ color: '#B8F53C' }} />
            <h3 style={{ fontSize: 14, fontWeight: 600, color: 'rgba(255,255,255,0.7)' }}>Waste Stream by Category</h3>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={categoryBreakdown} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={3} dataKey="value" stroke="none">
                {categoryBreakdown.map((e, i) => <Cell key={i} fill={e.color} />)}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, justifyContent: 'center' }}>
            {categoryBreakdown.map((c, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, color: 'rgba(255,255,255,0.5)' }}>
                <span style={{ width: 8, height: 8, borderRadius: 2, background: c.color }} /> {c.name} <span style={{ fontFamily: 'var(--font-mono)', color: c.color }}>{c.value}%</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* MQS Trend */}
        <motion.div variants={fadeUp} transition={{ duration: 0.4 }} style={{ padding: 24, borderRadius: 14, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
            <TrendingUp size={16} style={{ color: '#38BDF8' }} />
            <h3 style={{ fontSize: 14, fontWeight: 600, color: 'rgba(255,255,255,0.7)' }}>MQS Score Trend</h3>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={mqsTrend}>
              <defs><linearGradient id="mqsGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#38BDF8" stopOpacity={0.2}/><stop offset="100%" stopColor="#38BDF8" stopOpacity={0}/></linearGradient></defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="month" tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis domain={[60, 90]} tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 11, fontFamily: 'JetBrains Mono' }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="avg" stroke="#38BDF8" strokeWidth={2.5} fill="url(#mqsGrad)" dot={{ fill: '#38BDF8', r: 3, strokeWidth: 0 }} />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '3fr 2fr', gap: 16, marginBottom: 16 }} className="analytics-grid">
        {/* Revenue vs Volume */}
        <motion.div variants={fadeUp} transition={{ duration: 0.4 }} style={{ padding: 24, borderRadius: 14, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
          <h3 style={{ fontSize: 14, fontWeight: 600, color: 'rgba(255,255,255,0.7)', marginBottom: 20 }}>Revenue vs Waste Volume</h3>
          <ResponsiveContainer width="100%" height={220}>
            <ScatterChart>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="volume" name="Volume (t)" tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis dataKey="revenue" name="Revenue ($)" tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 11, fontFamily: 'JetBrains Mono' }} axisLine={false} tickLine={false} tickFormatter={v => `$${(v/1000).toFixed(0)}k`} />
              <Tooltip content={<CustomTooltip />} />
              <Scatter data={revenueVsVolume} fill="#B8F53C" opacity={0.8} />
            </ScatterChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Buyer Heatmap */}
        <motion.div variants={fadeUp} transition={{ duration: 0.4 }} style={{ padding: 24, borderRadius: 14, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
            <MapPin size={16} style={{ color: '#F59E0B' }} />
            <h3 style={{ fontSize: 14, fontWeight: 600, color: 'rgba(255,255,255,0.7)' }}>Buyer Geographic Distribution</h3>
          </div>
          {buyerGeo.map((city, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderBottom: i < buyerGeo.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none' }}>
              <span style={{ fontSize: 13, color: '#fff', fontWeight: 500, width: 90 }}>{city.city}</span>
              <div style={{ flex: 1, height: 6, borderRadius: 3, background: 'rgba(255,255,255,0.04)', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${(city.count / 12) * 100}%`, background: 'linear-gradient(90deg, #B8F53C, #38BDF8)', borderRadius: 3, transition: 'width 0.8s ease' }} />
              </div>
              <span style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: '#B8F53C', width: 50, textAlign: 'right' }}>{city.value}</span>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Compliance Timeline */}
      <motion.div variants={fadeUp} transition={{ duration: 0.4 }} style={{ padding: 24, borderRadius: 14, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
          <FileText size={16} style={{ color: '#F59E0B' }} />
          <h3 style={{ fontSize: 14, fontWeight: 600, color: 'rgba(255,255,255,0.7)' }}>Compliance Documents Generated</h3>
        </div>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={complianceTimeline}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
            <XAxis dataKey="month" tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 11 }} axisLine={false} tickLine={false} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="epr" stackId="a" fill="#B8F53C" radius={[0, 0, 0, 0]} name="EPR" />
            <Bar dataKey="carbon" stackId="a" fill="#38BDF8" name="Carbon Credit" />
            <Bar dataKey="dpp" stackId="a" fill="#F59E0B" radius={[4, 4, 0, 0]} name="DPP" />
          </BarChart>
        </ResponsiveContainer>
        <div style={{ display: 'flex', gap: 20, justifyContent: 'center', marginTop: 12 }}>
          {[{ label: 'EPR', color: '#B8F53C' }, { label: 'Carbon Credit', color: '#38BDF8' }, { label: 'DPP', color: '#F59E0B' }].map((l, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: 'rgba(255,255,255,0.5)' }}>
              <span style={{ width: 10, height: 10, borderRadius: 2, background: l.color }} /> {l.label}
            </div>
          ))}
        </div>
      </motion.div>

      <style>{`@media (max-width: 1024px) { .analytics-grid { grid-template-columns: 1fr !important; } }`}</style>
    </motion.div>
  );
}
