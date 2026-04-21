import { useState } from 'react';
import KPICard from '../../components/ui/KPICard';
import MaterialCard from '../../components/ui/MaterialCard';
import MQSRing from '../../components/ui/MQSRing';
import { motion } from 'framer-motion';
import { ShoppingCart, Package, TrendingDown, Leaf, ClipboardCheck, ArrowRightLeft, Search, ArrowRight, Target, Sparkles } from 'lucide-react';
import { listings } from '../../mock/listings';
import { transactions } from '../../mock/transactions';
import { Link } from 'react-router-dom';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, AreaChart, Area, XAxis, YAxis, CartesianGrid } from 'recharts';

const fadeUp = { hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0 } };
const stagger = { visible: { transition: { staggerChildren: 0.06 } } };

const categoryData = [
  { name: 'Plastics', value: 42, color: '#B8F53C' },
  { name: 'Metals', value: 28, color: '#38BDF8' },
  { name: 'Paper', value: 15, color: '#F59E0B' },
  { name: 'Other', value: 15, color: '#64748B' },
];

const spendData = [
  { month: 'Oct', spend: 18200 }, { month: 'Nov', spend: 22400 }, { month: 'Dec', spend: 19800 },
  { month: 'Jan', spend: 31200 }, { month: 'Feb', spend: 28600 }, { month: 'Mar', spend: 35800 },
];

const matchAlerts = [
  { id: 1, material: 'HDPE Pellets (Reprocessed)', mqs: 88, price: '$38/t', seller: 'GreenTech Recyclers', fit: 94, location: 'Bengaluru, IN' },
  { id: 2, material: 'ABS Regrind', mqs: 83, price: '$52/t', seller: 'NovaPoly Works', fit: 87, location: 'Noida, IN' },
  { id: 3, material: 'Glass Cullet (Clear)', mqs: 82, price: '$18/t', seller: 'ClearVision Glass', fit: 79, location: 'Surat, IN' },
];

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: 'rgba(6,15,9,0.95)', border: '1px solid rgba(56,189,248,0.15)', borderRadius: 10, padding: '10px 14px', backdropFilter: 'blur(8px)' }}>
      <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', marginBottom: 4, fontFamily: 'var(--font-mono)' }}>{label}</div>
      <div style={{ fontSize: 14, fontWeight: 600, color: '#fff' }}>${payload[0]?.value?.toLocaleString()}</div>
    </div>
  );
};

export default function BuyerDashboard() {
  const matchedListings = listings.filter(l => l.status === 'ACTIVE' && l.status !== 'BLOCKED').slice(0, 4);
  const buyerTxns = transactions.filter(t => t.buyerName === 'EcoPlast Manufacturing');

  return (
    <motion.div initial="hidden" animate="visible" variants={stagger}>
      {/* Header */}
      <motion.div variants={fadeUp} transition={{ duration: 0.4 }} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 28, flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 26, fontWeight: 800, color: '#fff', marginBottom: 6, letterSpacing: '-0.02em' }}>
            Good evening, Ananya
          </h1>
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#38BDF8', display: 'inline-block' }} />
            EcoPlast Manufacturing · Buyer Dashboard
          </p>
        </div>
        <Link to="/buyer/marketplace" style={{
          display: 'inline-flex', alignItems: 'center', gap: 8, padding: '10px 22px',
          borderRadius: 10, background: '#B8F53C', color: 'var(--color-brand-dark)',
          fontSize: 13, fontWeight: 700, textDecoration: 'none', fontFamily: 'var(--font-body)',
          boxShadow: '0 0 20px rgba(184,245,60,0.2)',
        }}>
          <Search size={14} /> Browse Marketplace
        </Link>
      </motion.div>

      {/* KPI Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(195px, 1fr))', gap: 14, marginBottom: 28 }}>
        <KPICard title="Active Requests" value={5} icon={ShoppingCart} color="blue" delay={0} />
        <KPICard title="Sourced (MTD)" value={186} suffix=" t" icon={Package} trend={24} trendLabel="vs last mo" color="lime" delay={1} />
        <KPICard title="Cost Savings vs Virgin" value={23} suffix="%" icon={TrendingDown} trend={5} color="lime" delay={2} />
        <KPICard title="Scope 3 Avoided" value={142} suffix=" tCO₂e" icon={Leaf} color="blue" delay={3} />
        <KPICard title="Pending QAR" value={2} icon={ClipboardCheck} color="amber" delay={4} />
        <KPICard title="Completed" value={8} icon={ArrowRightLeft} trend={15} color="lime" delay={5} />
      </div>

      {/* Charts Row */}
      <div style={{ display: 'grid', gridTemplateColumns: '3fr 2fr', gap: 16, marginBottom: 28 }} className="buyer-grid-2">
        {/* Spend Trend */}
        <motion.div variants={fadeUp} transition={{ duration: 0.4 }} style={{ padding: 24, borderRadius: 14, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <div>
              <h3 style={{ fontSize: 14, fontWeight: 600, color: 'rgba(255,255,255,0.7)', marginBottom: 2 }}>Procurement Spend</h3>
              <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', fontFamily: 'var(--font-mono)' }}>Last 6 months · Total $156K</span>
            </div>
            <div style={{ fontSize: 20, fontWeight: 800, color: '#38BDF8', fontFamily: 'var(--font-display)' }}>$35.8K</div>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={spendData}>
              <defs>
                <linearGradient id="spendGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#38BDF8" stopOpacity={0.2} />
                  <stop offset="100%" stopColor="#38BDF8" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="month" tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 11, fontFamily: 'JetBrains Mono' }} axisLine={false} tickLine={false} tickFormatter={v => `$${(v / 1000).toFixed(0)}k`} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="spend" stroke="#38BDF8" strokeWidth={2.5} fill="url(#spendGrad)" dot={{ fill: '#38BDF8', r: 3, strokeWidth: 0 }} activeDot={{ fill: '#38BDF8', r: 5, stroke: '#fff', strokeWidth: 2 }} />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Category Mix Donut */}
        <motion.div variants={fadeUp} transition={{ duration: 0.4 }} style={{ padding: 24, borderRadius: 14, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
          <h3 style={{ fontSize: 14, fontWeight: 600, color: 'rgba(255,255,255,0.7)', marginBottom: 16 }}>Material Category Mix</h3>
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie data={categoryData} cx="50%" cy="50%" innerRadius={45} outerRadius={72} paddingAngle={4} dataKey="value" stroke="none">
                {categoryData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
              </Pie>
              <Tooltip contentStyle={{ background: 'rgba(6,15,9,0.95)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, fontSize: 12, color: '#fff' }} />
            </PieChart>
          </ResponsiveContainer>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, justifyContent: 'center', marginTop: 8 }}>
            {categoryData.map((c, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: 'rgba(255,255,255,0.5)' }}>
                <span style={{ width: 8, height: 8, borderRadius: 2, background: c.color, flexShrink: 0 }} /> {c.name} <span style={{ fontFamily: 'var(--font-mono)', color: c.color }}>{c.value}%</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Match Alerts */}
      <motion.div variants={fadeUp} transition={{ duration: 0.4 }} style={{ padding: 24, borderRadius: 14, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', marginBottom: 28 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 28, height: 28, borderRadius: 7, background: 'rgba(184,245,60,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Sparkles size={14} style={{ color: '#B8F53C' }} />
            </div>
            <h3 style={{ fontSize: 14, fontWeight: 600, color: 'rgba(255,255,255,0.7)' }}>AI Match Alerts</h3>
            <span style={{ fontSize: 10, padding: '2px 8px', borderRadius: 10, background: 'rgba(184,245,60,0.1)', color: '#B8F53C', fontFamily: 'var(--font-mono)', fontWeight: 600 }}>{matchAlerts.length} new</span>
          </div>
          <Link to="/buyer/marketplace" style={{ fontSize: 11, color: '#B8F53C', fontWeight: 600, textDecoration: 'none' }}>Browse All →</Link>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 12 }}>
          {matchAlerts.map((alert) => (
            <div key={alert.id} style={{
              padding: 18, borderRadius: 12,
              background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)',
              transition: 'all 0.2s', cursor: 'pointer',
            }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(184,245,60,0.2)'; e.currentTarget.style.boxShadow = '0 0 20px rgba(184,245,60,0.08)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'; e.currentTarget.style.boxShadow = ''; }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: '#fff', marginBottom: 3 }}>{alert.material}</div>
                  <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)' }}>{alert.seller} · {alert.location}</div>
                </div>
                <MQSRing score={alert.mqs} size={40} strokeWidth={3} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', gap: 12 }}>
                  <span style={{ fontSize: 12, color: '#B8F53C', fontFamily: 'var(--font-mono)', fontWeight: 600 }}>{alert.price}</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: 'rgba(255,255,255,0.35)' }}>
                    <Target size={10} /> Fit: <span style={{ color: '#B8F53C', fontFamily: 'var(--font-mono)', fontWeight: 600 }}>{alert.fit}%</span>
                  </span>
                </div>
                <button style={{ padding: '6px 14px', borderRadius: 6, background: 'rgba(184,245,60,0.08)', color: '#B8F53C', border: '1px solid rgba(184,245,60,0.15)', fontSize: 11, fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-body)' }}>Express Interest</button>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Bottom Row: Recent Transactions + Scope 3 Quick View */}
      <div style={{ display: 'grid', gridTemplateColumns: '3fr 2fr', gap: 16 }} className="buyer-grid-2">
        {/* Recent Transactions */}
        <motion.div variants={fadeUp} transition={{ duration: 0.4 }} style={{ padding: 24, borderRadius: 14, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <h3 style={{ fontSize: 14, fontWeight: 600, color: 'rgba(255,255,255,0.7)' }}>Recent Transactions</h3>
            <span className="api-tooltip">GET /transactions</span>
          </div>
          {buyerTxns.slice(0, 4).map((txn, i) => (
            <div key={txn.id} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '12px 0', borderBottom: i < 3 ? '1px solid rgba(255,255,255,0.04)' : 'none' }}>
              <MQSRing score={txn.mqsScore} size={34} strokeWidth={3} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 500, color: '#fff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{txn.materialName}</div>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', fontFamily: 'var(--font-mono)' }}>{txn.id} · {txn.sellerName}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 13, fontFamily: 'var(--font-mono)', fontWeight: 600, color: '#fff' }}>{txn.agreedPrice ? `$${txn.agreedPrice}` : '—'}</div>
                <div style={{ marginTop: 2 }}><StatusBadgeInline status={txn.status} /></div>
              </div>
            </div>
          ))}
        </motion.div>

        {/* Scope 3 Quick View */}
        <motion.div variants={fadeUp} transition={{ duration: 0.4 }} style={{ padding: 24, borderRadius: 14, background: 'rgba(56,189,248,0.03)', border: '1px solid rgba(56,189,248,0.1)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
            <Leaf size={16} style={{ color: '#38BDF8' }} />
            <h3 style={{ fontSize: 14, fontWeight: 600, color: 'rgba(255,255,255,0.7)' }}>Scope 3 Impact</h3>
          </div>
          <div style={{ textAlign: 'center', marginBottom: 20 }}>
            <div style={{ fontSize: 48, fontFamily: 'var(--font-display)', fontWeight: 800, color: '#38BDF8', letterSpacing: '-0.03em' }}>228</div>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>tCO₂e avoided this year</div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div style={{ padding: 14, borderRadius: 10, background: 'rgba(255,255,255,0.02)', textAlign: 'center' }}>
              <div style={{ fontSize: 20, fontWeight: 700, color: '#B8F53C', fontFamily: 'var(--font-display)' }}>445</div>
              <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.35)', marginTop: 2 }}>Tonnes Sourced</div>
            </div>
            <div style={{ padding: 14, borderRadius: 10, background: 'rgba(255,255,255,0.02)', textAlign: 'center' }}>
              <div style={{ fontSize: 20, fontWeight: 700, color: '#F59E0B', fontFamily: 'var(--font-display)' }}>12</div>
              <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.35)', marginTop: 2 }}>DPPs Generated</div>
            </div>
          </div>
          <Link to="/buyer/scope3" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, marginTop: 16, fontSize: 12, color: '#38BDF8', fontWeight: 600, textDecoration: 'none' }}>
            Full Scope 3 Report <ArrowRight size={12} />
          </Link>
        </motion.div>
      </div>

      <style>{`
        @media (max-width: 1024px) { .buyer-grid-2 { grid-template-columns: 1fr !important; } }
      `}</style>
    </motion.div>
  );
}

function StatusBadgeInline({ status }) {
  const colorMap = {
    ACTIVE: '#B8F53C', BUYER_INTERESTED: '#38BDF8', PRICE_PROPOSED: '#F59E0B', AGREED: '#B8F53C',
    LOCKED: '#B8F53C', ESCROW_LOCKED: '#B8F53C', QAR_PENDING: '#F59E0B', COMPLETED: '#B8F53C',
    SETTLED: '#B8F53C', DISPUTED: '#EF4444', BLOCKED: '#EF4444',
  };
  const c = colorMap[status] || '#64748B';
  return (
    <span style={{ fontSize: 9, fontFamily: 'var(--font-mono)', fontWeight: 600, color: c, background: `${c}12`, padding: '1px 6px', borderRadius: 3, textTransform: 'uppercase', letterSpacing: '0.03em' }}>
      {status?.replace(/_/g, ' ')}
    </span>
  );
}
