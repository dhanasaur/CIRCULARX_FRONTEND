import { useState } from 'react';
import KPICard from '../../components/ui/KPICard';
import MQSRing from '../../components/ui/MQSRing';
import StatusBadge from '../../components/ui/StatusBadge';
import { motion } from 'framer-motion';
import { ClipboardCheck, Calendar, CheckCircle, AlertTriangle, Clock, MapPin, ArrowRight, FileWarning, Activity, BarChart3, ShieldAlert } from 'lucide-react';
import { inspections, qarReports, disputes } from '../../mock/inspections';
import { Link } from 'react-router-dom';
import { LineChart, Line, AreaChart, Area, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import './QCDashboard.css';

const fadeUp = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } };
const stagger = { visible: { transition: { staggerChildren: 0.1 } } };

const statusColors = { PENDING: 'amber', SCHEDULED: 'info', APPROVED: 'lime', DISCREPANCY: 'danger' };
const priorityColors = { LOW: 'slate', MEDIUM: 'info', HIGH: 'amber', CRITICAL: 'danger' };
const priorityOrder = { CRITICAL: 0, HIGH: 1, MEDIUM: 2, LOW: 3 };

const completionData = [
  { day: 'Mon', completed: 3, pending: 2 }, { day: 'Tue', completed: 5, pending: 1 },
  { day: 'Wed', completed: 4, pending: 3 }, { day: 'Thu', completed: 6, pending: 2 },
  { day: 'Fri', completed: 4, pending: 1 }, { day: 'Sat', completed: 2, pending: 0 },
  { day: 'Sun', completed: 1, pending: 0 },
];

const outcomeData = [
  { name: 'Approved', value: 68, color: '#00e68a' },
  { name: 'Conditional', value: 15, color: '#F59E0B' },
  { name: 'Rejected', value: 12, color: '#EF4444' },
  { name: 'Pending', value: 5, color: '#64748B' },
];

const calendarSlots = [
  { day: 'Tue', time: '10:00', material: 'SS Turnings', location: 'Pune', priority: 'HIGH' },
  { day: 'Thu', time: '14:00', material: 'Nylon 6 Regrind', location: 'Vadodara', priority: 'MEDIUM' },
  { day: 'Fri', time: '09:00', material: 'Al Ingots', location: 'Ahmedabad', priority: 'MEDIUM' },
];

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: 'rgba(6,15,9,0.95)', border: '1px solid rgba(0,212,255,0.25)', borderRadius: 12, padding: '12px 16px', backdropFilter: 'blur(12px)', boxShadow: '0 8px 32px rgba(0,0,0,0.4)' }}>
      <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', marginBottom: 6, fontFamily: 'var(--font-mono)' }}>{label}</div>
      {payload.map((p, i) => (
        <div key={i} style={{ fontSize: 14, fontWeight: 700, color: p.color || '#fff' }}>{p.name}: {p.value}</div>
      ))}
    </div>
  );
};

export default function QCDashboard() {
  const pending = inspections.filter(i => ['PENDING', 'SCHEDULED'].includes(i.status)).length;
  const sortedInspections = [...inspections].sort((a, b) => (priorityOrder[a.priority] ?? 99) - (priorityOrder[b.priority] ?? 99));

  return (
    <motion.div className="qcc" initial="hidden" animate="visible" variants={stagger}>

      {/* ── Hero Banner ── */}
      <motion.div variants={fadeUp} className="qcc-hero">
        <div className="qcc-hero-left">
          <div className="qcc-hero-left-top">
            <span className="qcc-hero-badge">QC Authority Portal</span>
            <span className="qcc-hero-sub">Inspector: QC-INS-0042</span>
          </div>
          <h1 className="qcc-hero-title">Good evening, Vikram</h1>
        </div>
        <Link to="/qc/inspections" className="qcc-hero-cta">
          <ShieldAlert size={16} /> Enter Inspection Queue
        </Link>
      </motion.div>

      {/* ── KPI Grid ── */}
      <div className="qcc-kpi-grid">
        <KPICard title="Pending Inspections" value={pending} icon={ClipboardCheck} color="amber" delay={0} />
        <KPICard title="Approval Rate" value={83} suffix="%" icon={CheckCircle} trend={2} trendLabel="vs last wk" color="lime" delay={1} />
        <KPICard title="Active Disputes" value={disputes.length} icon={AlertTriangle} color="rose" delay={2} />
        <KPICard title="Avg Turnaround" value={18} suffix=" hrs" icon={Clock} trend={-5} trendLabel="faster" color="blue" delay={3} />
        <KPICard title="QARs Submitted" value={25} icon={BarChart3} trend={12} color="lime" delay={4} />
      </div>

      {/* ── Analytics Row ── */}
      <div className="qcc-analytics-row">
        {/* QAR Completion Trend */}
        <motion.div variants={fadeUp} className="qcc-chart-card">
          <div className="qcc-chart-head">
            <div>
              <h3 className="qcc-chart-title">QAR Assessment Trajectory</h3>
              <span className="qcc-chart-sub">Last 7 days performance metrics</span>
            </div>
            <div className="qcc-legend">
              {[{ label: 'Completed', color: '#00e68a' }, { label: 'Pending', color: '#F59E0B' }].map((l, i) => (
                <div key={i} className="qcc-legend-item">
                  <span className="qcc-legend-dot" style={{ background: l.color }} /> {l.label}
                </div>
              ))}
            </div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={completionData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="qcCompGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#00e68a" stopOpacity={0.25} />
                  <stop offset="100%" stopColor="#00e68a" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
              <XAxis dataKey="day" tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 12 }} axisLine={false} tickLine={false} dy={10} />
              <YAxis tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 12, fontFamily: 'var(--font-mono)' }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'rgba(255,255,255,0.1)', strokeWidth: 1, strokeDasharray: '4 4' }} />
              <Area type="monotone" dataKey="completed" stroke="#00e68a" strokeWidth={3} fill="url(#qcCompGrad)" activeDot={{ r: 6, fill: '#00e68a', stroke: '#060F09', strokeWidth: 3 }} name="Completed" />
              <Line type="monotone" dataKey="pending" stroke="#F59E0B" strokeWidth={2} strokeDasharray="6 6" dot={{ fill: '#F59E0B', r: 4, strokeWidth: 0 }} name="Pending" />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Inspection Outcomes Donut */}
        <motion.div variants={fadeUp} className="qcc-donut-card">
          <h3 className="qcc-donut-title">Global Quality Outcomes</h3>
          <div className="qcc-donut-wrap">
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie data={outcomeData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={4} dataKey="value" stroke="none">
                  {outcomeData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                </Pie>
                <Tooltip contentStyle={{ background: 'rgba(6,15,9,0.95)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8, fontSize: 13, color: '#fff', boxShadow: '0 8px 32px rgba(0,0,0,0.4)' }} itemStyle={{ color: '#fff' }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="qcc-donut-center">
              <div style={{ textAlign: 'center' }}>
                <div className="qcc-donut-pct">83%</div>
                <div className="qcc-donut-pct-label">Pass Rate</div>
              </div>
            </div>
          </div>
          <div className="qcc-donut-legend">
            {outcomeData.map((c, i) => (
              <div key={i} className="qcc-donut-legend-item">
                <div className="qcc-donut-legend-label">
                  <span className="qcc-donut-legend-dot" style={{ background: c.color }} /> {c.name}
                </div>
                <span className="qcc-donut-legend-val" style={{ color: c.color }}>{c.value}%</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* ── Priority Operations Matrix ── */}
      <div className="qcc-matrix-row">
        {/* Inspection Queue */}
        <motion.div variants={fadeUp} className="qcc-queue-card">
          <div className="qcc-queue-head">
            <div className="qcc-queue-head-left">
              <div className="qcc-queue-icon">
                <ClipboardCheck size={18} style={{ color: '#F59E0B' }} />
              </div>
              <div>
                <h3 className="qcc-queue-title">Priority Inspection Queue</h3>
                <span className="qcc-queue-sub">Critical timeline operations</span>
              </div>
            </div>
            <Link to="/qc/inspections" className="qcc-queue-link">Access Full Queue →</Link>
          </div>

          <div className="qcc-inspection-list">
            {sortedInspections.slice(0, 4).map((ins) => (
              <div
                key={ins.id}
                className="qcc-insp-card"
                style={{
                  background: ins.priority === 'CRITICAL' ? 'rgba(239,68,68,0.05)' : 'rgba(255,255,255,0.02)',
                  borderColor: ins.priority === 'CRITICAL' ? 'rgba(239,68,68,0.2)' : 'rgba(255,255,255,0.05)',
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(0,230,138,0.3)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = ins.priority === 'CRITICAL' ? 'rgba(239,68,68,0.2)' : 'rgba(255,255,255,0.05)'; }}
              >
                <div className="qcc-insp-card-top">
                  <div className="qcc-insp-card-left">
                    <div className="qcc-insp-name-row">
                      <span className="qcc-insp-name">{ins.materialName}</span>
                      <StatusBadge status={ins.priority} color={priorityColors[ins.priority]} size="xs" />
                    </div>
                    <div className="qcc-insp-meta">
                      <span className="qcc-insp-id">{ins.transactionId}</span>
                      <span className="qcc-insp-loc"><MapPin size={12} /> {ins.location}</span>
                    </div>
                  </div>
                  <MQSRing score={ins.mqsScore} size={44} strokeWidth={4} />
                </div>
                <div className="qcc-insp-foot">
                  <div className="qcc-insp-badges">
                    <StatusBadge status={ins.status} color={statusColors[ins.status]} size="sm" />
                    <StatusBadge status={ins.escrowStatus} color={ins.escrowStatus === 'RELEASED' ? 'lime' : ins.escrowStatus === 'HELD' ? 'danger' : 'amber'} size="sm" />
                  </div>
                  <span className="qcc-insp-due">Due: {new Date(ins.dueDate).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Schedule & Disputes Panel */}
        <div className="qcc-side-col">
          {/* On-Site Schedule */}
          <motion.div variants={fadeUp} className="qcc-schedule-card">
            <div className="qcc-schedule-head">
              <Calendar size={18} style={{ color: '#00d4ff' }} />
              <h4 className="qcc-schedule-title">On-Site Schedule</h4>
            </div>
            <div className="qcc-schedule-list">
              {calendarSlots.map((slot, i) => (
                <div key={i} className="qcc-slot">
                  <div className="qcc-slot-icon">
                    <span className="qcc-slot-day">{slot.day}</span>
                    <span className="qcc-slot-time">{slot.time}</span>
                  </div>
                  <div className="qcc-slot-info">
                    <div className="qcc-slot-mat">{slot.material}</div>
                    <div className="qcc-slot-loc"><MapPin size={10} /> {slot.location}</div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Active Mediations */}
          <motion.div variants={fadeUp} className="qcc-dispute-card">
            <div className="qcc-dispute-head">
              <FileWarning size={18} style={{ color: '#EF4444' }} />
              <h4 className="qcc-dispute-title">Active Mediations</h4>
            </div>
            {disputes.map(d => (
              <div key={d.id} className="qcc-dispute-item">
                <div className="qcc-dispute-item-head">
                  <span className="qcc-dispute-id">{d.id}</span>
                  <span className="qcc-dispute-tier">TIER {d.tier}</span>
                </div>
                <div className="qcc-dispute-mat">{d.materialName}</div>
                <div className="qcc-dispute-desc">{d.description}</div>
                <div className="qcc-dispute-foot">
                  <span className="qcc-dispute-risk">Risk: ${d.escrowAmount.toLocaleString()}</span>
                  <Link to="/qc/disputes" className="qcc-dispute-link">Manage Case →</Link>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
