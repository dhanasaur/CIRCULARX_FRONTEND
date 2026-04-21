import { useState } from 'react';
import KPICard from '../../components/ui/KPICard';
import TransactionCard from '../../components/ui/TransactionCard';
import MQSRing from '../../components/ui/MQSRing';
import StatusBadge from '../../components/ui/StatusBadge';
import { motion } from 'framer-motion';
import { Package, ArrowRightLeft, DollarSign, Leaf, FileCheck, TrendingUp, Bell, ArrowRight, Eye, Zap, Clock } from 'lucide-react';
import { transactions } from '../../mock/transactions';
import { listings } from '../../mock/listings';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Area, AreaChart } from 'recharts';
import { Link } from 'react-router-dom';
import { differenceInDays } from 'date-fns';

const fadeUp = { hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0 } };
const stagger = { visible: { transition: { staggerChildren: 0.06 } } };

const mqsData = [
  { range: '0–25', count: 1, fill: '#EF4444' },
  { range: '26–50', count: 2, fill: '#F59E0B' },
  { range: '51–75', count: 4, fill: '#F59E0B' },
  { range: '76–100', count: 9, fill: '#B8F53C' },
];

const revenueData = [
  { month: 'Oct', revenue: 12400 },
  { month: 'Nov', revenue: 18200 },
  { month: 'Dec', revenue: 15800 },
  { month: 'Jan', revenue: 22100 },
  { month: 'Feb', revenue: 28600 },
  { month: 'Mar', revenue: 34200 },
];

const activityFeed = [
  { id: 1, text: 'EcoPlast Manufacturing expressed interest in PET Flakes listing', time: '2h ago', type: 'match', color: '#38BDF8' },
  { id: 2, text: 'ZOPA proposal received for Waste Tyre Crumb Rubber — USD 48/tonne', time: '5h ago', type: 'zopa', color: '#B8F53C' },
  { id: 3, text: 'QAR approved for HDPE Pellets — escrow of $1,890 released', time: '1d ago', type: 'qar', color: '#B8F53C' },
  { id: 4, text: 'New buyer match: AlloyForm Industries for Aluminium Ingots', time: '1d ago', type: 'match', color: '#38BDF8' },
  { id: 5, text: 'EPR Certificate EPR-2025-0891 generated for Paper Pulp', time: '2d ago', type: 'compliance', color: '#F59E0B' },
];

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: 'rgba(6,15,9,0.95)', border: '1px solid rgba(184,245,60,0.15)', borderRadius: 10, padding: '10px 14px', backdropFilter: 'blur(8px)' }}>
      <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', marginBottom: 4, fontFamily: 'var(--font-mono)' }}>{label}</div>
      {payload.map((p, i) => (
        <div key={i} style={{ fontSize: 14, fontWeight: 600, color: '#fff' }}>
          {typeof p.value === 'number' && p.value > 100 ? `$${p.value.toLocaleString()}` : p.value}
        </div>
      ))}
    </div>
  );
};

export default function SellerDashboard() {
  const sellerTxns = transactions.filter(t => t.sellerName === 'GreenTech Recyclers').slice(0, 4);
  const sellerListings = listings.filter(l => l.sellerId === 'USR-S-001');
  const activeListings = sellerListings.filter(l => !['COMPLETED', 'BLOCKED', 'SETTLED'].includes(l.status)).length;
  const urgentListings = sellerListings.filter(l => {
    if (!l.expiryDate) return false;
    return differenceInDays(new Date(l.expiryDate), new Date()) <= 7;
  });

  return (
    <motion.div initial="hidden" animate="visible" variants={stagger}>
      {/* Header */}
      <motion.div variants={fadeUp} transition={{ duration: 0.4 }} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 28, flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 26, fontWeight: 800, color: '#fff', marginBottom: 6, letterSpacing: '-0.02em' }}>
            Good evening, Rajesh
          </h1>
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#B8F53C', display: 'inline-block' }} />
            GreenTech Recyclers · Seller Dashboard
          </p>
        </div>
        <Link to="/seller/submit" style={{
          display: 'inline-flex', alignItems: 'center', gap: 8, padding: '10px 22px',
          borderRadius: 10, background: '#B8F53C', color: 'var(--color-brand-dark)',
          fontSize: 13, fontWeight: 700, textDecoration: 'none', fontFamily: 'var(--font-body)',
          boxShadow: '0 0 20px rgba(184,245,60,0.2)', transition: 'all 0.2s',
        }}>
          <Zap size={14} /> Submit Material
        </Link>
      </motion.div>

      {/* KPI Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(195px, 1fr))', gap: 14, marginBottom: 28 }}>
        <KPICard title="Active Listings" value={activeListings} icon={Package} trend={12} trendLabel="vs last mo" color="lime" delay={0} />
        <KPICard title="Pending Transactions" value={3} icon={ArrowRightLeft} color="blue" delay={1} />
        <KPICard title="Revenue (MTD)" value={34200} prefix="$" icon={DollarSign} trend={19} trendLabel="vs last mo" color="lime" delay={2} />
        <KPICard title="Waste Diverted" value={445} suffix=" t" icon={Leaf} trend={8} trendLabel="vs last mo" color="blue" delay={3} />
        <KPICard title="CO₂e Avoided" value={228} suffix=" t" icon={TrendingUp} color="amber" delay={4} />
        <KPICard title="EPR Certificates" value={12} icon={FileCheck} color="lime" delay={5} />
      </div>

      {/* Charts Row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 28 }} className="seller-grid-2">
        {/* Revenue Chart */}
        <motion.div variants={fadeUp} transition={{ duration: 0.4 }} style={{
          padding: 24, borderRadius: 14,
          background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <div>
              <h3 style={{ fontSize: 14, fontWeight: 600, color: 'rgba(255,255,255,0.7)', marginBottom: 2 }}>Revenue Trend</h3>
              <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', fontFamily: 'var(--font-mono)' }}>Last 6 months</span>
            </div>
            <div style={{ fontSize: 20, fontWeight: 800, color: '#B8F53C', fontFamily: 'var(--font-display)' }}>$34.2K</div>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={revenueData}>
              <defs>
                <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#B8F53C" stopOpacity={0.2} />
                  <stop offset="100%" stopColor="#B8F53C" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="month" tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 11, fontFamily: 'DM Sans' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 11, fontFamily: 'JetBrains Mono' }} axisLine={false} tickLine={false} tickFormatter={v => `$${(v / 1000).toFixed(0)}k`} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="revenue" stroke="#B8F53C" strokeWidth={2.5} fill="url(#revGrad)" dot={{ fill: '#B8F53C', r: 3, strokeWidth: 0 }} activeDot={{ fill: '#B8F53C', r: 5, stroke: '#fff', strokeWidth: 2 }} />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* MQS Distribution */}
        <motion.div variants={fadeUp} transition={{ duration: 0.4 }} style={{
          padding: 24, borderRadius: 14,
          background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <div>
              <h3 style={{ fontSize: 14, fontWeight: 600, color: 'rgba(255,255,255,0.7)', marginBottom: 2 }}>MQS Distribution</h3>
              <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', fontFamily: 'var(--font-mono)' }}>Across {sellerListings.length} listings</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <MQSRing score={78} size={36} strokeWidth={3} />
              <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)' }}>avg</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={mqsData} barCategoryGap="25%">
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="range" tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 11, fontFamily: 'DM Sans' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 11, fontFamily: 'JetBrains Mono' }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                {mqsData.map((entry, i) => (
                  <rect key={i} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Bottom Row: Activity + Quick Actions */}
      <div style={{ display: 'grid', gridTemplateColumns: '5fr 3fr', gap: 16 }} className="seller-grid-2">
        {/* Recent Activity */}
        <motion.div variants={fadeUp} transition={{ duration: 0.4 }} style={{
          padding: 24, borderRadius: 14,
          background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 28, height: 28, borderRadius: 7, background: 'rgba(184,245,60,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Bell size={14} style={{ color: '#B8F53C' }} />
              </div>
              <h3 style={{ fontSize: 14, fontWeight: 600, color: 'rgba(255,255,255,0.7)' }}>Activity Feed</h3>
            </div>
            <span style={{ fontSize: 11, color: '#B8F53C', fontWeight: 600, cursor: 'pointer' }}>View All →</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {activityFeed.map((item, i) => (
              <div key={item.id} style={{
                padding: '14px 0', borderBottom: i < activityFeed.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none',
                display: 'flex', gap: 12, alignItems: 'flex-start', cursor: 'pointer', transition: 'background 0.15s',
              }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.015)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: item.color, flexShrink: 0, marginTop: 5 }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.65)', margin: 0, lineHeight: 1.5 }}>{item.text}</p>
                  <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.2)', fontFamily: 'var(--font-mono)', marginTop: 4, display: 'block' }}>{item.time}</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Urgent + Quick Links */}
        <motion.div variants={fadeUp} transition={{ duration: 0.4 }} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Urgent Materials */}
          <div style={{ padding: 20, borderRadius: 14, background: 'rgba(245,158,11,0.04)', border: '1px solid rgba(245,158,11,0.12)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
              <Clock size={14} style={{ color: '#F59E0B' }} />
              <h4 style={{ fontSize: 13, fontWeight: 600, color: '#F59E0B', margin: 0 }}>Expiring Soon</h4>
            </div>
            {urgentListings.length > 0 ? urgentListings.slice(0, 3).map(l => {
              const days = differenceInDays(new Date(l.expiryDate), new Date());
              return (
                <div key={l.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                  <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '60%' }}>{l.materialName}</span>
                  <span style={{ fontSize: 11, fontFamily: 'var(--font-mono)', fontWeight: 600, color: days <= 2 ? '#EF4444' : '#F59E0B' }}>{days}d left</span>
                </div>
              );
            }) : (
              <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)', margin: 0 }}>No urgent listings</p>
            )}
          </div>

          {/* Quick Actions */}
          <div style={{ padding: 20, borderRadius: 14, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', flex: 1 }}>
            <h4 style={{ fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,0.5)', margin: '0 0 14px' }}>Quick Actions</h4>
            {[
              { label: 'View Listings', to: '/seller/listings', icon: Package },
              { label: 'Transaction Pipeline', to: '/seller/transactions', icon: ArrowRightLeft },
              { label: 'Compliance Vault', to: '/seller/compliance', icon: FileCheck },
            ].map((action, i) => {
              const Icon = action.icon;
              return (
                <Link key={i} to={action.to} style={{
                  display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', marginBottom: 4,
                  borderRadius: 8, textDecoration: 'none', color: 'rgba(255,255,255,0.55)',
                  transition: 'all 0.15s', fontSize: 13, fontWeight: 500,
                }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'rgba(184,245,60,0.06)'; e.currentTarget.style.color = '#B8F53C'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = ''; e.currentTarget.style.color = 'rgba(255,255,255,0.55)'; }}
                >
                  <Icon size={15} /> {action.label} <ArrowRight size={12} style={{ marginLeft: 'auto', opacity: 0.4 }} />
                </Link>
              );
            })}
          </div>
        </motion.div>
      </div>

      <style>{`
        @media (max-width: 1024px) {
          .seller-grid-2 { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </motion.div>
  );
}
