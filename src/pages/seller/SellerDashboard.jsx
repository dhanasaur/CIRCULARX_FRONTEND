import { useState } from 'react';
import KPICard from '../../components/ui/KPICard';
import MQSRing from '../../components/ui/MQSRing';
import { motion } from 'framer-motion';
import { Package, ArrowRightLeft, DollarSign, Leaf, FileCheck, TrendingUp, Bell, ArrowRight, Zap, Clock } from 'lucide-react';
import { transactions } from '../../mock/transactions';
import { listings } from '../../mock/listings';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { Link } from 'react-router-dom';
import { differenceInDays } from 'date-fns';
import './SellerDashboard.css';

const fadeUp = { hidden: { opacity: 0, y: 18 }, visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } } };
const stagger = { visible: { transition: { staggerChildren: 0.06 } } };

const mqsData = [
  { range: '0–25', count: 1, fill: 'rgba(239, 68, 68, 0.8)' },
  { range: '26–50', count: 2, fill: 'rgba(245, 158, 11, 0.8)' },
  { range: '51–75', count: 4, fill: 'rgba(245, 158, 11, 0.8)' },
  { range: '76–100', count: 9, fill: 'rgba(184, 245, 60, 0.8)' },
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
    <div style={{ background: 'rgba(6,15,9,0.95)', border: '1px solid rgba(184,245,60,0.15)', borderRadius: 12, padding: '12px 16px', backdropFilter: 'blur(12px)', boxShadow: '0 8px 32px rgba(0,0,0,0.4)' }}>
      <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', marginBottom: 6, fontFamily: 'var(--font-mono)' }}>{label}</div>
      {payload.map((p, i) => (
        <div key={i} style={{ fontSize: 16, fontWeight: 700, color: '#fff' }}>
          {typeof p.value === 'number' && p.value > 100 ? `$${p.value.toLocaleString()}` : p.value}
        </div>
      ))}
    </div>
  );
};

export default function SellerDashboard() {
  const sellerListings = listings.filter(l => l.sellerId === 'USR-S-001');
  const activeListings = sellerListings.filter(l => !['COMPLETED', 'BLOCKED', 'SETTLED'].includes(l.status)).length;
  const urgentListings = sellerListings.filter(l => {
    if (!l.expiryDate) return false;
    return differenceInDays(new Date(l.expiryDate), new Date()) <= 7;
  });

  return (
    <motion.div className="scc" initial="hidden" animate="visible" variants={stagger}>

      {/* ── Hero Banner ── */}
      <motion.div variants={fadeUp} className="scc-hero">
        <div className="scc-hero-left">
          <div className="scc-hero-left-top">
            <span className="scc-hero-badge">Generator Portal</span>
            <span className="scc-hero-sub">GreenTech Recyclers</span>
          </div>
          <h1 className="dash-h1" style={{ fontSize: 'clamp(24px, 3vw, 32px)' }}>Operations Hub</h1>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
          <div style={{ textAlign: 'center' }}>
            <MQSRing score={78} size={64} strokeWidth={5} />
            <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', fontFamily: 'var(--font-mono)', marginTop: 4, letterSpacing: '0.04em', textTransform: 'uppercase' }}>Platform Trust</div>
          </div>
          <Link to="/seller/submit" className="scc-hero-cta">
            <Zap size={16} /> Submit Material
          </Link>
        </div>
      </motion.div>

      {/* ── KPI Grid ── */}
      <div className="scc-kpi-grid">
        <KPICard title="Active Listings" value={activeListings} icon={Package} trend={12} trendLabel="vs last mo" color="lime" delay={0} sparkData={[3,4,3,5,4,5,activeListings]} />
        <KPICard title="Revenue (MTD)" value={34200} prefix="$" icon={DollarSign} trend={19} trendLabel="vs last mo" color="lime" delay={1} sparkData={[12400,18200,15800,22100,28600,34200]} />
        <KPICard title="Pending Txns" value={3} icon={ArrowRightLeft} color="blue" delay={2} sparkData={[5,4,3,4,3,2,3]} />
        <KPICard title="Waste Diverted" value={445} suffix=" t" icon={Leaf} trend={8} trendLabel="vs last mo" color="amber" delay={3} sparkData={[320,350,380,400,420,430,445]} />
      </div>

      {/* ── Analytics Row ── */}
      <div className="scc-analytics-row">
        {/* Revenue Chart */}
        <motion.div variants={fadeUp} className="scc-chart-card">
          <div className="scc-chart-card-head">
            <div>
              <h3 className="scc-chart-title">Revenue Trajectory</h3>
              <span className="scc-chart-sub">6-month performance analysis</span>
            </div>
            <div>
              <div className="scc-chart-value">$34.2K</div>
              <div className="scc-chart-trend">+19% from last month</div>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={revenueData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#B8F53C" stopOpacity={0.25} />
                  <stop offset="100%" stopColor="#B8F53C" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="2 4" stroke="rgba(255,255,255,0.04)" vertical={false} />
              <XAxis dataKey="month" tick={{ fill: 'rgba(255,255,255,0.25)', fontSize: 11, fontFamily: 'var(--font-mono)' }} axisLine={false} tickLine={false} dy={10} />
              <YAxis tick={{ fill: 'rgba(255,255,255,0.25)', fontSize: 11, fontFamily: 'var(--font-mono)' }} axisLine={false} tickLine={false} tickFormatter={v => `$${(v / 1000).toFixed(0)}k`} />
              <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'rgba(255,255,255,0.1)', strokeWidth: 1, strokeDasharray: '4 4' }} />
              <Area type="monotone" dataKey="revenue" stroke="#B8F53C" strokeWidth={2.5} fill="url(#revGrad)" activeDot={{ r: 6, fill: '#B8F53C', stroke: '#060F09', strokeWidth: 3 }} style={{ filter: 'drop-shadow(0 0 6px rgba(184,245,60,0.4))' }} />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Quality Distribution */}
        <motion.div variants={fadeUp} className="scc-quality-card">
          <h3 className="scc-chart-title">Quality (MQS) Index</h3>
          <span className="scc-chart-sub" style={{ marginBottom: 20, display: 'block' }}>Batch quality distribution</span>
          <div className="scc-quality-ring-row">
            <MQSRing score={78} size={64} strokeWidth={4} />
            <div>
              <div className="scc-quality-score">78/100</div>
              <div className="scc-quality-label">Portfolio Average</div>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={140}>
            <BarChart data={mqsData} margin={{ top: 0, right: 0, left: -30, bottom: 0 }}>
              <CartesianGrid strokeDasharray="2 4" stroke="rgba(255,255,255,0.04)" vertical={false} />
              <XAxis dataKey="range" tick={{ fill: 'rgba(255,255,255,0.25)', fontSize: 11, fontFamily: 'var(--font-mono)' }} axisLine={false} tickLine={false} dy={10} />
              <YAxis tick={{ fill: 'rgba(255,255,255,0.25)', fontSize: 11, fontFamily: 'var(--font-mono)' }} axisLine={false} tickLine={false} />
              <Tooltip cursor={{ fill: 'rgba(255,255,255,0.02)' }} contentStyle={{ background: 'rgba(6,15,9,0.97)', border: '1px solid rgba(184,245,60,0.15)', borderRadius: 10, backdropFilter: 'blur(12px)', boxShadow: '0 8px 32px rgba(0,0,0,0.4)' }} itemStyle={{ color: '#fff', fontSize: 12, fontWeight: 600 }} />
              <Bar dataKey="count" radius={[4, 4, 0, 0]} maxBarSize={40}>
                {mqsData.map((entry, i) => (
                  <cell key={i} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* ── Operations Hub ── */}
      <div className="scc-ops-row">
        {/* Activity Stream */}
        <motion.div variants={fadeUp} className="scc-activity-card">
          <div className="scc-activity-head">
            <div className="scc-activity-head-left">
              <div className="scc-activity-icon">
                <Bell size={18} style={{ color: '#B8F53C' }} />
              </div>
              <h3 className="scc-activity-title">Activity Stream</h3>
            </div>
            <span className="scc-view-all">View All</span>
          </div>
          <div className="scc-feed-list">
            {activityFeed.map((item) => (
              <div key={item.id} className="scc-feed-item">
                <span className="scc-feed-dot" style={{ background: item.color, boxShadow: `0 0 10px ${item.color}` }} />
                <p className="scc-feed-text">{item.text}</p>
                <span className="scc-feed-time">{item.time}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Action Center */}
        <motion.div variants={fadeUp} className="scc-action-col">
          {/* Urgent Items */}
          <div className="scc-urgent-card">
            <div className="scc-urgent-head">
              <Clock size={18} style={{ color: '#F59E0B' }} />
              <h4 className="scc-urgent-title">Attention Required</h4>
            </div>
            {urgentListings.length > 0 ? urgentListings.slice(0, 3).map(l => {
              const days = differenceInDays(new Date(l.expiryDate), new Date());
              return (
                <div key={l.id} className="scc-urgent-row">
                  <span className="scc-urgent-name">{l.materialName}</span>
                  <span style={{ fontSize: 12, fontFamily: 'var(--font-mono)', fontWeight: 700, color: days <= 2 ? '#EF4444' : '#F59E0B' }}>
                    Exp in {days}d
                  </span>
                </div>
              );
            }) : (
              <p className="scc-urgent-empty">No urgent items pending.</p>
            )}
          </div>

          {/* Quick Links */}
          <div className="scc-quicknav-card">
            <h4 className="scc-quicknav-title">Quick Navigation</h4>
            {[
              { label: 'Manage Inventory', to: '/seller/listings', icon: Package },
              { label: 'Active Negotiations', to: '/seller/transactions', icon: ArrowRightLeft },
              { label: 'Compliance Records', to: '/seller/compliance', icon: FileCheck },
            ].map((action, i) => {
              const Icon = action.icon;
              return (
                <Link key={i} to={action.to} className="scc-quicknav-link">
                  <Icon size={18} /> {action.label}
                  <ArrowRight size={14} className="scc-quicknav-arrow" />
                </Link>
              );
            })}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
