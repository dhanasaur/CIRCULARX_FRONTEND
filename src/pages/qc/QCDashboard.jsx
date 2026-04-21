import { useState } from 'react';
import KPICard from '../../components/ui/KPICard';
import StatusBadge from '../../components/ui/StatusBadge';
import MQSRing from '../../components/ui/MQSRing';
import { motion } from 'framer-motion';
import { ClipboardCheck, Calendar, CheckCircle, AlertTriangle, Clock, MapPin, ArrowRight, FileWarning, Activity, BarChart3 } from 'lucide-react';
import { inspections, qarReports, disputes } from '../../mock/inspections';
import { Link } from 'react-router-dom';
import { LineChart, Line, AreaChart, Area, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const fadeUp = { hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0 } };
const stagger = { visible: { transition: { staggerChildren: 0.06 } } };

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
  { name: 'Approved', value: 68, color: '#B8F53C' },
  { name: 'Conditional', value: 15, color: '#F59E0B' },
  { name: 'Rejected', value: 12, color: '#EF4444' },
  { name: 'Pending', value: 5, color: '#64748B' },
];

const calendarSlots = [
  { day: 'Tue', time: '10:00', material: 'SS Turnings', location: 'Pune', priority: 'HIGH' },
  { day: 'Thu', time: '14:00', material: 'Nylon 6 Regrind', location: 'Vadodara', priority: 'MEDIUM' },
  { day: 'Fri', time: '09:00', material: 'Al Ingots (Secondary)', location: 'Ahmedabad', priority: 'MEDIUM' },
];

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: 'rgba(6,15,9,0.95)', border: '1px solid rgba(245,158,11,0.15)', borderRadius: 10, padding: '10px 14px', backdropFilter: 'blur(8px)' }}>
      <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', marginBottom: 4, fontFamily: 'var(--font-mono)' }}>{label}</div>
      {payload.map((p, i) => (
        <div key={i} style={{ fontSize: 13, fontWeight: 600, color: p.color || '#fff' }}>{p.name}: {p.value}</div>
      ))}
    </div>
  );
};

export default function QCDashboard() {
  const pending = inspections.filter(i => ['PENDING', 'SCHEDULED'].includes(i.status)).length;
  const approved = inspections.filter(i => i.status === 'APPROVED').length;
  const discrepancies = inspections.filter(i => i.status === 'DISCREPANCY').length;
  const sortedInspections = [...inspections].sort((a, b) => (priorityOrder[a.priority] ?? 99) - (priorityOrder[b.priority] ?? 99));

  return (
    <motion.div initial="hidden" animate="visible" variants={stagger}>
      {/* Header */}
      <motion.div variants={fadeUp} transition={{ duration: 0.4 }} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 28, flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 26, fontWeight: 800, color: '#fff', marginBottom: 6, letterSpacing: '-0.02em' }}>
            Good evening, Vikram
          </h1>
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#F59E0B', display: 'inline-block', animation: 'pulse 2s ease-in-out infinite' }} />
            QC Inspector · QC-INS-0042 · South India Region
          </p>
        </div>
        <Link to="/qc/inspections" style={{
          display: 'inline-flex', alignItems: 'center', gap: 8, padding: '10px 22px',
          borderRadius: 10, background: '#B8F53C', color: 'var(--color-brand-dark)',
          fontSize: 13, fontWeight: 700, textDecoration: 'none', fontFamily: 'var(--font-body)',
          boxShadow: '0 0 20px rgba(184,245,60,0.2)',
        }}>
          <ClipboardCheck size={14} /> View Queue
        </Link>
      </motion.div>

      {/* KPI Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(185px, 1fr))', gap: 14, marginBottom: 28 }}>
        <KPICard title="Pending Inspections" value={pending} icon={ClipboardCheck} color="amber" delay={0} />
        <KPICard title="Scheduled This Week" value={3} icon={Calendar} color="blue" delay={1} />
        <KPICard title="Approval Rate" value={83} suffix="%" icon={CheckCircle} trend={2} trendLabel="vs last wk" color="lime" delay={2} />
        <KPICard title="Active Disputes" value={discrepancies} icon={AlertTriangle} color="rose" delay={3} />
        <KPICard title="Avg Turnaround" value={18} suffix=" hrs" icon={Clock} trend={-5} trendLabel="faster" color="blue" delay={4} />
        <KPICard title="QARs Submitted" value={25} icon={BarChart3} trend={12} color="lime" delay={5} />
      </div>

      {/* Charts Row */}
      <div style={{ display: 'grid', gridTemplateColumns: '3fr 2fr', gap: 16, marginBottom: 28 }} className="qc-grid-2">
        {/* QAR Completion Trend */}
        <motion.div variants={fadeUp} transition={{ duration: 0.4 }} style={{ padding: 24, borderRadius: 14, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <div>
              <h3 style={{ fontSize: 14, fontWeight: 600, color: 'rgba(255,255,255,0.7)', marginBottom: 2 }}>QAR Completion Rate</h3>
              <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', fontFamily: 'var(--font-mono)' }}>Last 7 days · {completionData.reduce((s, d) => s + d.completed, 0)} completed</span>
            </div>
            <div style={{ display: 'flex', gap: 12 }}>
              {[{ label: 'Completed', color: '#B8F53C' }, { label: 'Pending', color: '#F59E0B' }].map((l, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 10, color: 'rgba(255,255,255,0.4)' }}>
                  <span style={{ width: 8, height: 3, borderRadius: 2, background: l.color }} /> {l.label}
                </div>
              ))}
            </div>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={completionData}>
              <defs>
                <linearGradient id="qcCompGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#B8F53C" stopOpacity={0.2} />
                  <stop offset="100%" stopColor="#B8F53C" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="day" tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 11, fontFamily: 'DM Sans' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 11, fontFamily: 'JetBrains Mono' }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="completed" stroke="#B8F53C" strokeWidth={2.5} fill="url(#qcCompGrad)" dot={{ fill: '#B8F53C', r: 3, strokeWidth: 0 }} activeDot={{ fill: '#B8F53C', r: 5, stroke: '#fff', strokeWidth: 2 }} name="Completed" />
              <Line type="monotone" dataKey="pending" stroke="#F59E0B" strokeWidth={1.5} strokeDasharray="4 4" dot={{ fill: '#F59E0B', r: 2.5 }} name="Pending" />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Inspection Outcomes Donut */}
        <motion.div variants={fadeUp} transition={{ duration: 0.4 }} style={{ padding: 24, borderRadius: 14, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
          <h3 style={{ fontSize: 14, fontWeight: 600, color: 'rgba(255,255,255,0.7)', marginBottom: 16 }}>Inspection Outcomes</h3>
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie data={outcomeData} cx="50%" cy="50%" innerRadius={45} outerRadius={72} paddingAngle={4} dataKey="value" stroke="none">
                {outcomeData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
              </Pie>
              <Tooltip contentStyle={{ background: 'rgba(6,15,9,0.95)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, fontSize: 12, color: '#fff' }} />
            </PieChart>
          </ResponsiveContainer>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, justifyContent: 'center', marginTop: 8 }}>
            {outcomeData.map((c, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, color: 'rgba(255,255,255,0.5)' }}>
                <span style={{ width: 8, height: 8, borderRadius: 2, background: c.color }} /> {c.name} <span style={{ fontFamily: 'var(--font-mono)', color: c.color }}>{c.value}%</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Bottom Grid: Queue + Side Panels */}
      <div style={{ display: 'grid', gridTemplateColumns: '5fr 3fr', gap: 16 }} className="qc-grid-2">
        {/* Inspection Queue Preview */}
        <motion.div variants={fadeUp} transition={{ duration: 0.4 }} style={{ padding: 24, borderRadius: 14, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 28, height: 28, borderRadius: 7, background: 'rgba(245,158,11,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <ClipboardCheck size={14} style={{ color: '#F59E0B' }} />
              </div>
              <h3 style={{ fontSize: 14, fontWeight: 600, color: 'rgba(255,255,255,0.7)' }}>Priority Queue</h3>
              <span style={{ fontSize: 10, padding: '2px 8px', borderRadius: 10, background: 'rgba(245,158,11,0.1)', color: '#F59E0B', fontFamily: 'var(--font-mono)', fontWeight: 600 }}>{pending} pending</span>
            </div>
            <Link to="/qc/inspections" style={{ fontSize: 11, color: '#B8F53C', fontWeight: 600, textDecoration: 'none' }}>View All →</Link>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {sortedInspections.slice(0, 4).map((ins) => (
              <div key={ins.id} style={{
                padding: 16, borderRadius: 12,
                background: ins.priority === 'CRITICAL' ? 'rgba(239,68,68,0.04)' : 'rgba(255,255,255,0.015)',
                border: `1px solid ${ins.priority === 'CRITICAL' ? 'rgba(239,68,68,0.15)' : 'rgba(255,255,255,0.05)'}`,
                cursor: 'pointer', transition: 'all 0.2s',
              }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(184,245,60,0.15)'; e.currentTarget.style.boxShadow = '0 0 15px rgba(184,245,60,0.05)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = ins.priority === 'CRITICAL' ? 'rgba(239,68,68,0.15)' : 'rgba(255,255,255,0.05)'; e.currentTarget.style.boxShadow = ''; }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                      <span style={{ fontSize: 14, fontWeight: 600, color: '#fff' }}>{ins.materialName}</span>
                      <StatusBadge status={ins.priority} color={priorityColors[ins.priority]} size="xs" />
                    </div>
                    <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', display: 'flex', gap: 12 }}>
                      <span style={{ fontFamily: 'var(--font-mono)' }}>{ins.transactionId}</span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 3 }}><MapPin size={10} /> {ins.location}</span>
                    </div>
                  </div>
                  <MQSRing score={ins.mqsScore} size={36} strokeWidth={3} />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <StatusBadge status={ins.status} color={statusColors[ins.status]} size="xs" />
                    <StatusBadge status={ins.escrowStatus} color={ins.escrowStatus === 'RELEASED' ? 'lime' : ins.escrowStatus === 'HELD' ? 'danger' : 'amber'} size="xs" />
                  </div>
                  <span style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: 'rgba(255,255,255,0.3)' }}>
                    Due: {new Date(ins.dueDate).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Right Side */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Weekly Schedule */}
          <motion.div variants={fadeUp} transition={{ duration: 0.4 }} style={{ padding: 20, borderRadius: 14, background: 'rgba(56,189,248,0.03)', border: '1px solid rgba(56,189,248,0.1)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
              <Calendar size={14} style={{ color: '#38BDF8' }} />
              <h4 style={{ fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,0.6)', margin: 0 }}>This Week</h4>
              <span style={{ fontSize: 10, padding: '2px 8px', borderRadius: 10, background: 'rgba(56,189,248,0.1)', color: '#38BDF8', fontFamily: 'var(--font-mono)', fontWeight: 600 }}>{calendarSlots.length} scheduled</span>
            </div>
            {calendarSlots.map((slot, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', gap: 10, padding: '12px', marginBottom: 6, borderRadius: 10,
                background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)', transition: 'all 0.15s',
              }}
                onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(56,189,248,0.15)'}
                onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.04)'}
              >
                <div style={{ width: 36, height: 36, borderRadius: 8, background: 'rgba(56,189,248,0.06)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <span style={{ fontSize: 10, fontFamily: 'var(--font-mono)', color: '#38BDF8', fontWeight: 700, lineHeight: 1 }}>{slot.day}</span>
                  <span style={{ fontSize: 8, fontFamily: 'var(--font-mono)', color: 'rgba(255,255,255,0.3)', lineHeight: 1, marginTop: 1 }}>{slot.time}</span>
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, color: '#fff', fontWeight: 500 }}>{slot.material}</div>
                  <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', display: 'flex', alignItems: 'center', gap: 3 }}><MapPin size={8} /> {slot.location}</div>
                </div>
                <StatusBadge status={slot.priority} color={priorityColors[slot.priority]} size="xs" />
              </div>
            ))}
          </motion.div>

          {/* Active Disputes */}
          <motion.div variants={fadeUp} transition={{ duration: 0.4 }} style={{ padding: 20, borderRadius: 14, background: 'rgba(239,68,68,0.03)', border: '1px solid rgba(239,68,68,0.1)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
              <FileWarning size={14} style={{ color: '#EF4444' }} />
              <h4 style={{ fontSize: 13, fontWeight: 600, color: '#FB7185', margin: 0 }}>Active Disputes</h4>
            </div>
            {disputes.map(d => (
              <div key={d.id} style={{ padding: 14, borderRadius: 10, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)', marginBottom: 8 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <span style={{ fontSize: 12, fontFamily: 'var(--font-mono)', color: '#FB7185', fontWeight: 600 }}>{d.id}</span>
                  <span style={{ fontSize: 10, padding: '2px 8px', borderRadius: 4, background: 'rgba(239,68,68,0.1)', color: '#FB7185', fontFamily: 'var(--font-mono)', fontWeight: 600 }}>TIER {d.tier}</span>
                </div>
                <div style={{ fontSize: 13, color: '#fff', fontWeight: 500, marginBottom: 4 }}>{d.materialName}</div>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', lineHeight: 1.5, marginBottom: 6 }}>{d.description}</div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: 'rgba(255,255,255,0.25)' }}>Escrow: ${d.escrowAmount.toLocaleString()}</span>
                  <span style={{ fontSize: 10, padding: '2px 8px', borderRadius: 4, background: 'rgba(245,158,11,0.08)', color: '#F59E0B', fontFamily: 'var(--font-mono)', fontWeight: 600 }}>{d.status}</span>
                </div>
              </div>
            ))}
            <Link to="/qc/disputes" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, marginTop: 8, fontSize: 12, color: '#FB7185', fontWeight: 600, textDecoration: 'none' }}>
              View All Disputes <ArrowRight size={12} />
            </Link>
          </motion.div>

          {/* Recent QARs */}
          <motion.div variants={fadeUp} transition={{ duration: 0.4 }} style={{ padding: 20, borderRadius: 14, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
            <h4 style={{ fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,0.5)', margin: '0 0 14px' }}>Recent QARs</h4>
            {qarReports.slice(0, 3).map(qar => (
              <div key={qar.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                <div style={{
                  width: 28, height: 28, borderRadius: 7,
                  background: qar.result === 'APPROVED' ? 'rgba(184,245,60,0.08)' : 'rgba(239,68,68,0.08)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  {qar.result === 'APPROVED' ? <CheckCircle size={13} style={{ color: '#B8F53C' }} /> : <AlertTriangle size={13} style={{ color: '#EF4444' }} />}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, color: '#fff', fontWeight: 500 }}>{qar.materialName}</div>
                  <div style={{ fontSize: 10, fontFamily: 'var(--font-mono)', color: 'rgba(255,255,255,0.25)' }}>{qar.id}</div>
                </div>
                <span style={{ fontSize: 10, fontFamily: 'var(--font-mono)', color: qar.result === 'APPROVED' ? '#B8F53C' : '#EF4444', fontWeight: 600 }}>{qar.result}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      <style>{`
        @media (max-width: 1024px) { .qc-grid-2 { grid-template-columns: 1fr !important; } }
      `}</style>
    </motion.div>
  );
}
