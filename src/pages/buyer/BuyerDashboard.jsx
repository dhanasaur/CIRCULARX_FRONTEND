import { useEffect, useRef, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { LayoutGrid, Users, ChevronDown, TrendingUp, Percent, Clock, Package, Bell, Settings, Zap } from 'lucide-react';
import './BuyerDashboard.css';

const fadeUp = { hidden: { opacity: 0, y: 18 }, visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } } };
const stagger = { visible: { transition: { staggerChildren: 0.06 } } };

/* ═══ Market Ticker Data ═══ */
const tickerItems = [
  { name: 'HDPE', price: '$18.1k', delta: '+2.4%', up: true },
  { name: 'Copper', price: '$17.1k', delta: '+0.8%', up: true },
  { name: 'PET', price: '$9.4k', delta: '-1.2%', up: false },
  { name: 'Aluminium', price: '$15.3k', delta: '+3.1%', up: true },
  { name: 'Paper Pulp', price: '$2.8k', delta: '-0.6%', up: false },
  { name: 'Steel Scrap', price: '$4.2k', delta: '+1.5%', up: true },
  { name: 'Rubber', price: '$3.1k', delta: '+0.3%', up: true },
  { name: 'Glass Cullet', price: '$1.9k', delta: '-0.9%', up: false },
];

/* ═══ Globe Canvas ═══ */
function Globe({ w = 190, h = 190 }) {
  const ref = useRef(null);
  const raf = useRef(null);
  const rot = useRef(0);

  const nodes = [
    { la: 20, lo: 78 }, { la: 25, lo: 121 }, { la: 35, lo: -118 },
    { la: 51, lo: 0 }, { la: -23, lo: -46 }, { la: 1, lo: 103 },
  ];

  const draw = useCallback(() => {
    const c = ref.current; if (!c) return;
    const ctx = c.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    c.width = w * dpr; c.height = h * dpr; ctx.scale(dpr, dpr);
    const cx = w / 2, cy = h / 2, r = w * 0.36;
    ctx.clearRect(0, 0, w, h);
    rot.current += 0.003;

    // background glow — stronger
    const g = ctx.createRadialGradient(cx, cy, r * 0.3, cx, cy, r * 1.6);
    g.addColorStop(0, 'rgba(184,245,60,0.09)'); g.addColorStop(0.5, 'rgba(184,245,60,0.04)'); g.addColorStop(1, 'transparent');
    ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);

    // pulsing outer rings
    const pulse1 = 0.5 + 0.5 * Math.sin(Date.now() / 1500);
    const pulse2 = 0.5 + 0.5 * Math.sin(Date.now() / 2500 + 1);
    ctx.beginPath(); ctx.arc(cx, cy, r * 1.25, 0, Math.PI * 2);
    ctx.strokeStyle = `rgba(184,245,60,${0.05 + pulse1 * 0.06})`; ctx.lineWidth = 1; ctx.stroke();
    ctx.beginPath(); ctx.arc(cx, cy, r * 1.4, 0, Math.PI * 2);
    ctx.strokeStyle = `rgba(184,245,60,${0.03 + pulse2 * 0.04})`; ctx.lineWidth = 0.7; ctx.stroke();

    // sphere
    ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(184,245,60,0.22)'; ctx.lineWidth = 1.5; ctx.stroke();
    const sf = ctx.createRadialGradient(cx - r * 0.3, cy - r * 0.3, 0, cx, cy, r);
    sf.addColorStop(0, 'rgba(184,245,60,0.06)'); sf.addColorStop(1, 'rgba(13,43,30,0.02)');
    ctx.fillStyle = sf; ctx.fill();

    // lat/lon
    ctx.save(); ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.clip();
    for (let lat = -60; lat <= 60; lat += 30) {
      const y = cy + r * Math.sin(lat * Math.PI / 180), lr = r * Math.cos(lat * Math.PI / 180);
      ctx.beginPath(); ctx.ellipse(cx, y, lr, lr * 0.15, 0, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(184,245,60,0.1)'; ctx.lineWidth = 0.7; ctx.stroke();
    }
    for (let lon = 0; lon < 180; lon += 30) {
      const a = lon * Math.PI / 180 + rot.current;
      ctx.beginPath(); ctx.ellipse(cx, cy, r * Math.abs(Math.cos(a)), r, 0, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(184,245,60,0.08)'; ctx.lineWidth = 0.7; ctx.stroke();
    }
    ctx.restore();

    // orbits
    [0, 1].forEach(i => {
      ctx.save(); ctx.translate(cx, cy); ctx.rotate(rot.current * (1.5 + i * 0.5) + i * 1.2);
      ctx.beginPath(); ctx.ellipse(0, 0, r * (1.2 + i * 0.15), r * 0.18, 0.3 + i * 0.4, 0, Math.PI * 2);
      ctx.strokeStyle = i === 0 ? 'rgba(56,189,248,0.28)' : 'rgba(184,245,60,0.18)';
      ctx.lineWidth = 1.2; ctx.setLineDash([4, 6]); ctx.stroke(); ctx.setLineDash([]); ctx.restore();
    });

    // nodes + connections
    const visibleNodes = [];
    nodes.forEach(({ la, lo }) => {
      const phi = (90 - la) * Math.PI / 180, th = (lo + rot.current * 50) * Math.PI / 180;
      const x3 = Math.sin(phi) * Math.cos(th), z3 = Math.sin(phi) * Math.sin(th), y3 = Math.cos(phi);
      if (z3 > -0.15) {
        const px = cx + x3 * r * 0.85, py = cy - y3 * r * 0.85, al = Math.max(0.2, (z3 + 0.15) / 1.15);
        visibleNodes.push({ px, py, al });
        const ng = ctx.createRadialGradient(px, py, 0, px, py, 7);
        ng.addColorStop(0, `rgba(184,245,60,${al * 0.5})`); ng.addColorStop(1, 'transparent');
        ctx.fillStyle = ng; ctx.fillRect(px - 7, py - 7, 14, 14);
        ctx.beginPath(); ctx.arc(px, py, 2.5, 0, Math.PI * 2); ctx.fillStyle = `rgba(184,245,60,${al})`; ctx.fill();
      }
    });

    // bezier connections between visible nodes
    for (let i = 0; i < visibleNodes.length; i++) {
      for (let j = i + 1; j < visibleNodes.length; j++) {
        const a = visibleNodes[i], b = visibleNodes[j];
        const midX = (a.px + b.px) / 2, midY = (a.py + b.py) / 2 - 15;
        ctx.beginPath(); ctx.moveTo(a.px, a.py);
        ctx.quadraticCurveTo(midX, midY, b.px, b.py);
        ctx.strokeStyle = `rgba(184,245,60,${Math.min(a.al, b.al) * 0.15})`;
        ctx.lineWidth = 0.8; ctx.stroke();
      }
    }

    raf.current = requestAnimationFrame(draw);
  }, [w, h]);

  useEffect(() => { draw(); return () => { if (raf.current) cancelAnimationFrame(raf.current); }; }, [draw]);
  return <canvas ref={ref} style={{ width: w, height: h }} />;
}

/* ═══ MQS Ring (local) ═══ */
function Ring({ score, size = 64 }) {
  const [val, setVal] = useState(0);
  const el = useRef(null);
  const sw = 5, rad = (size - sw) / 2, circ = 2 * Math.PI * rad, off = circ - (val / 100) * circ;

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        const t0 = performance.now();
        (function step(now) {
          const p = Math.min((now - t0) / 1200, 1);
          setVal(Math.floor((1 - Math.pow(1 - p, 3)) * score));
          if (p < 1) requestAnimationFrame(step);
        })(performance.now());
        obs.disconnect();
      }
    }, { threshold: 0.3 });
    if (el.current) obs.observe(el.current);
    return () => obs.disconnect();
  }, [score]);

  return (
    <div ref={el} style={{ width: size, height: size, position: 'relative', flexShrink: 0 }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={size / 2} cy={size / 2} r={rad} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={sw} />
        <circle cx={size / 2} cy={size / 2} r={rad} fill="none" stroke="#B8F53C" strokeWidth={sw}
          strokeDasharray={circ} strokeDashoffset={off} strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset .3s ease', filter: 'drop-shadow(0 0 4px rgba(184,245,60,0.4))' }} />
      </svg>
      <span style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: 'var(--font-display)', fontSize: size * 0.32, fontWeight: 800, color: '#B8F53C',
        textShadow: '0 0 10px rgba(184,245,60,0.3)' }}>{val}</span>
    </div>
  );
}

/* ═══ Animated Number ═══ */
function Num({ target, prefix = '', suffix = '' }) {
  const [v, setV] = useState(0);
  const el = useRef(null), started = useRef(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !started.current) {
        started.current = true;
        const t0 = performance.now();
        (function step(now) {
          const p = Math.min((now - t0) / 1400, 1);
          setV(Math.floor((1 - Math.pow(1 - p, 3)) * target));
          if (p < 1) requestAnimationFrame(step);
        })(performance.now());
      }
    }, { threshold: 0.3 });
    if (el.current) obs.observe(el.current);
    return () => obs.disconnect();
  }, [target]);
  return <span ref={el}>{prefix}{v.toLocaleString()}{suffix}</span>;
}

/* ═══ Mini Sparkline ═══ */
function MiniSpark({ data = [3, 5, 4, 7, 6, 8, 7], color = '#B8F53C', w = 56, h = 20 }) {
  const max = Math.max(...data), min = Math.min(...data), range = max - min || 1;
  const pts = data.map((v, i) => `${(i / (data.length - 1)) * w},${h - ((v - min) / range) * h * 0.8 - 2}`).join(' ');
  return (
    <svg width={w} height={h} style={{ display: 'block' }}>
      <polyline points={pts} fill="none" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"
        style={{ filter: `drop-shadow(0 0 3px ${color}40)` }} />
    </svg>
  );
}

/* ═══ Material Card Data ═══ */
const materials = [
  { name: 'HDPE Pellets', status: 'ACTIVE', mqs: 94, qty: '10t', floor: '$12.0k', mqsVal: '925t', price: '$18.1k', daysLeft: 12 },
  { name: 'Copper Wire Scrap', status: 'AGREED', mqs: 92, qty: '100t', floor: '$21.0k', mqsVal: '925t', price: '$17.1k', daysLeft: 5 },
];
const bentoMats = [
  { name: 'HDPE Pellets', status: 'ACTIVE', mqs: 94, qty: '100t', floor: '$12.0k', mqsVal: '5.23t', price: '$17.2k' },
  { name: 'Copper Wire Scrap', status: 'AGREED', mqs: 94, qty: '100t', floor: '$20.0k', mqsVal: '5.23t', price: '$50.00' },
];

/* ═══ Pipeline Data ═══ */
const pipeline = [
  { title: 'Listed', count: 3, items: ['PET Flakes — 45t', 'Nylon Regrind — 8t', 'Glass Cullet — 120t'] },
  { title: 'Buyer Interested', count: 2, items: ['HDPE Pellets — 10t', 'Rubber Crumb — 15t'] },
  { title: 'Price Proposed', count: 1, items: ['Copper Wire — 100t'] },
  { title: 'Agreed', count: 1, items: ['Al Ingots — 30t'] },
  { title: 'Escrow Locked', count: 1, items: ['Steel Turnings — 50t'] },
];

/* ═══ Small Material Card ═══ */
function MatCard({ m, size = 64 }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div className="bcc-mc" onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
      <div className="bcc-mc-accent" />
      <Ring score={m.mqs} size={size} />
      <div className="bcc-mc-info">
        <div className="bcc-mc-top">
          <span className="bcc-mc-name" style={{ minWidth: 0, flex: 1, marginRight: '8px' }}>{m.name}</span>
          <span className={`bcc-badge ${m.status === 'ACTIVE' ? 'bcc-badge-active' : 'bcc-badge-agreed'}`} style={{ flexShrink: 0 }}>{m.status}</span>
        </div>
        <div className="bcc-mc-grid">
          <div><div className="bcc-mc-lbl">Qty</div><div className="bcc-mc-val">{m.qty}</div></div>
          <div><div className="bcc-mc-lbl">Floor</div><div className="bcc-mc-val">{m.floor}</div></div>
          <div><div className="bcc-mc-lbl">MQS</div><div className="bcc-mc-val">{m.mqsVal}</div></div>
          <div><div className="bcc-mc-lbl">Price</div><div className="bcc-mc-val">{m.price}</div></div>
        </div>
        {m.daysLeft && m.daysLeft <= 7 && (
          <div className="bcc-mc-shelf" style={{ color: m.daysLeft <= 2 ? '#EF4444' : '#F59E0B' }}>
            ⏱ {m.daysLeft} days left
          </div>
        )}
      </div>
      {/* Slide-in CTA on hover */}
      <div className="bcc-mc-cta" style={{ transform: hovered ? 'translateX(0)' : 'translateX(100%)' }}>
        Place Bid
      </div>
    </div>
  );
}

/* ═══ Live Timestamp ═══ */
function LiveTime() {
  const [t, setT] = useState(new Date());
  useEffect(() => { const id = setInterval(() => setT(new Date()), 1000); return () => clearInterval(id); }, []);
  return <span>{t.toLocaleString()}</span>;
}

/* ═══════════════════════════════════════
   MAIN DASHBOARD
   ═══════════════════════════════════════ */
export default function BuyerDashboard() {
  return (
    <motion.div className="bcc" initial="hidden" animate="visible" variants={stagger}>

      {/* ── Header Row 1 ── */}
      <motion.div variants={fadeUp} className="bcc-head">
        <div>
          <h1 className="dash-h1">Command Center</h1>
          <div className="dash-subtitle"><LiveTime /></div>
        </div>
        <div className="bcc-head-actions">
          <button className="bcc-ibtn" style={{ position: 'relative' }}>
            <Bell size={17} />
            <span style={{ position: 'absolute', top: 6, right: 6, width: 7, height: 7, borderRadius: '50%', background: '#B8F53C' }} />
          </button>
          <button className="bcc-ibtn"><Settings size={17} /></button>
          <button className="bcc-ibtn"><LayoutGrid size={17} /></button>
        </div>
      </motion.div>

      {/* ── Header Row 2: Market Ticker ── */}
      <motion.div variants={fadeUp} className="bcc-ticker-wrap">
        <div className="market-ticker">
          <div className="market-ticker-inner">
            {[...tickerItems, ...tickerItems].map((t, i) => (
              <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 11, fontFamily: 'var(--font-mono)', fontWeight: 600 }}>
                <span style={{ color: 'rgba(255,255,255,0.5)' }}>{t.name}</span>
                <span style={{ color: '#fff' }}>{t.price}</span>
                <span style={{ color: t.up ? '#B8F53C' : '#FB7185', fontSize: 10 }}>
                  {t.up ? '↑' : '↓'} {t.delta}
                </span>
              </span>
            ))}
          </div>
        </div>
      </motion.div>

      {/* ── Top Row: Env Impact + Material Cards ── */}
      <motion.div variants={fadeUp} className="bcc-top">
        {/* Environmental Impact — Globe */}
        <div className="bcc-env">
          <div className="bcc-env-title">Environmental Impact</div>
          <Globe w={190} h={190} />
          <div className="bcc-env-bot">
            <h3>Global ESG Footprint</h3>
            <p>Sourced: <strong>186t</strong> · CO₂ Avoided: <strong>142 tCO₂e</strong></p>
          </div>
        </div>

        {/* Material Cards */}
        <div className="bcc-mats-col">
          <div className="bcc-mats-hdr">
            <h2>Active Materials</h2>
            <button className="bcc-filter-btn">All material <ChevronDown size={13} /></button>
          </div>
          <div className="bcc-mats-row">
            {materials.map((m, i) => <MatCard key={i} m={m} size={52} />)}
          </div>
        </div>
      </motion.div>

      {/* ── Bento KPI Grid ── */}
      <motion.div variants={fadeUp}>
        <h2 className="bcc-bento-label">Operational Metrics</h2>
        <div className="bcc-bento">
          {/* Sourced MTD — hero card */}
          <div className="bcc-bento-sourced">
            <div className="bcc-bento-icon"><TrendingUp size={20} /></div>
            <div>
              <div className="bcc-bento-lbl">Sourced (MTD)</div>
              <div className="bcc-bento-val"><Num target={186} /><span>t</span></div>
            </div>
            <div style={{ position: 'absolute', bottom: 16, right: 16, opacity: 0.6 }}>
              <MiniSpark data={[120, 135, 148, 160, 155, 172, 186]} />
            </div>
          </div>

          {/* Cost Savings */}
          <div className="bcc-bento-kpi">
            <div className="kpi-icon"><Percent size={18} /></div>
            <div style={{ flex: 1 }}>
              <div className="kpi-lbl">Cost Savings</div>
              <div className="kpi-val">$<Num target={24000} /></div>
            </div>
            <div style={{ opacity: 0.6 }}><MiniSpark data={[18, 19, 21, 20, 23, 22, 24]} color="#38BDF8" /></div>
          </div>

          {/* HDPE Pellets — material card */}
          <div className="bcc-bento-mat">
            <Ring score={bentoMats[0].mqs} size={72} />
            <div className="bcc-mc-info">
              <div className="bcc-mc-top">
                <span className="bcc-mc-name" style={{ minWidth: 0, flex: 1, marginRight: '8px' }}>{bentoMats[0].name}</span>
                <span className="bcc-badge bcc-badge-active" style={{ flexShrink: 0 }}>{bentoMats[0].status}</span>
              </div>
              <div className="bcc-mc-grid">
                <div><div className="bcc-mc-lbl">Qty</div><div className="bcc-mc-val">{bentoMats[0].qty}</div></div>
                <div><div className="bcc-mc-lbl">Floor</div><div className="bcc-mc-val">{bentoMats[0].floor}</div></div>
                <div><div className="bcc-mc-lbl">MQS</div><div className="bcc-mc-val">{bentoMats[0].mqsVal}</div></div>
                <div><div className="bcc-mc-lbl">Price</div><div className="bcc-mc-val">{bentoMats[0].price}</div></div>
              </div>
            </div>
          </div>

          {/* Copper Wire Scrap — material card */}
          <div className="bcc-bento-mat">
            <Ring score={bentoMats[1].mqs} size={72} />
            <div className="bcc-mc-info">
              <div className="bcc-mc-top">
                <span className="bcc-mc-name" style={{ minWidth: 0, flex: 1, marginRight: '8px' }}>{bentoMats[1].name}</span>
                <span className="bcc-badge bcc-badge-agreed" style={{ flexShrink: 0 }}>{bentoMats[1].status}</span>
              </div>
              <div className="bcc-mc-grid">
                <div><div className="bcc-mc-lbl">Qty</div><div className="bcc-mc-val">{bentoMats[1].qty}</div></div>
                <div><div className="bcc-mc-lbl">Floor</div><div className="bcc-mc-val">{bentoMats[1].floor}</div></div>
                <div><div className="bcc-mc-lbl">MQS</div><div className="bcc-mc-val">{bentoMats[1].mqsVal}</div></div>
                <div><div className="bcc-mc-lbl">Price</div><div className="bcc-mc-val">{bentoMats[1].price}</div></div>
              </div>
            </div>
          </div>

          {/* Scope 3 Avoided */}
          <div className="bcc-bento-kpi">
            <div className="kpi-icon green"><Clock size={18} /></div>
            <div style={{ flex: 1 }}>
              <div className="kpi-lbl">Scope 3 Avoided</div>
              <div className="kpi-val"><Num target={142} /> tCO₂e</div>
            </div>
            <div style={{ opacity: 0.6 }}><MiniSpark data={[95, 102, 110, 118, 125, 134, 142]} /></div>
          </div>
        </div>
      </motion.div>

      {/* ── Transaction Pipeline ── */}
      <motion.div variants={fadeUp}>
        <h2 className="bcc-pip-label">Transaction Pipeline</h2>
        <div className="bcc-pip">
          <div className="bcc-pip-line" />
          <div className="bcc-pip-track">
            {pipeline.map((s, i) => (
              <div key={i} className="bcc-pip-stage">
                <div className="bcc-pip-dot" />
                <div className="bcc-pip-card">
                  <h4>
                    <span className="pip-sq"><Package size={8} /></span>
                    {s.title}
                    <span className="bcc-pip-count">{s.count}</span>
                  </h4>
                  {s.items.map((item, j) => (
                    <div key={j} className="bcc-pip-item">{item}</div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
