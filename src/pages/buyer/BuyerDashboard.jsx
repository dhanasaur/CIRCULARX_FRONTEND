import { useEffect, useRef, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { LayoutGrid, Users, ChevronDown, TrendingUp, Percent, Clock, Package } from 'lucide-react';
import './BuyerDashboard.css';

const fadeUp = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.45 } } };
const stagger = { visible: { transition: { staggerChildren: 0.07 } } };

/* ═══ Globe Canvas ═══ */
function Globe({ w = 190, h = 190 }) {
  const ref = useRef(null);
  const raf = useRef(null);
  const rot = useRef(0);

  const draw = useCallback(() => {
    const c = ref.current; if (!c) return;
    const ctx = c.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    c.width = w * dpr; c.height = h * dpr; ctx.scale(dpr, dpr);
    const cx = w / 2, cy = h / 2, r = w * 0.36;
    ctx.clearRect(0, 0, w, h);
    rot.current += 0.003;

    // glow
    const g = ctx.createRadialGradient(cx, cy, r * 0.5, cx, cy, r * 1.5);
    g.addColorStop(0, 'rgba(0,230,138,0.07)'); g.addColorStop(0.6, 'rgba(0,200,255,0.03)'); g.addColorStop(1, 'transparent');
    ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);

    // sphere
    ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(0,230,138,0.22)'; ctx.lineWidth = 1.5; ctx.stroke();
    const sf = ctx.createRadialGradient(cx - r * 0.3, cy - r * 0.3, 0, cx, cy, r);
    sf.addColorStop(0, 'rgba(0,230,138,0.05)'); sf.addColorStop(1, 'rgba(0,60,40,0.02)');
    ctx.fillStyle = sf; ctx.fill();

    // lat/lon
    ctx.save(); ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.clip();
    for (let lat = -60; lat <= 60; lat += 30) {
      const y = cy + r * Math.sin(lat * Math.PI / 180), lr = r * Math.cos(lat * Math.PI / 180);
      ctx.beginPath(); ctx.ellipse(cx, y, lr, lr * 0.15, 0, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(0,230,138,0.1)'; ctx.lineWidth = 0.7; ctx.stroke();
    }
    for (let lon = 0; lon < 180; lon += 30) {
      const a = lon * Math.PI / 180 + rot.current;
      ctx.beginPath(); ctx.ellipse(cx, cy, r * Math.abs(Math.cos(a)), r, 0, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(0,230,138,0.08)'; ctx.lineWidth = 0.7; ctx.stroke();
    }
    ctx.restore();

    // orbits
    [0, 1].forEach(i => {
      ctx.save(); ctx.translate(cx, cy); ctx.rotate(rot.current * (1.5 + i * 0.5) + i * 1.2);
      ctx.beginPath(); ctx.ellipse(0, 0, r * (1.2 + i * 0.15), r * 0.18, 0.3 + i * 0.4, 0, Math.PI * 2);
      ctx.strokeStyle = i === 0 ? 'rgba(0,212,255,0.28)' : 'rgba(0,230,138,0.18)';
      ctx.lineWidth = 1.2; ctx.setLineDash([4, 6]); ctx.stroke(); ctx.setLineDash([]); ctx.restore();
    });

    // nodes
    [{ la: 20, lo: 78 }, { la: 25, lo: 121 }, { la: 35, lo: -118 }, { la: 51, lo: 0 }, { la: -23, lo: -46 }, { la: 1, lo: 103 }]
      .forEach(({ la, lo }) => {
        const phi = (90 - la) * Math.PI / 180, th = (lo + rot.current * 50) * Math.PI / 180;
        const x3 = Math.sin(phi) * Math.cos(th), z3 = Math.sin(phi) * Math.sin(th), y3 = Math.cos(phi);
        if (z3 > -0.15) {
          const px = cx + x3 * r * 0.85, py = cy - y3 * r * 0.85, al = Math.max(0.2, (z3 + 0.15) / 1.15);
          const ng = ctx.createRadialGradient(px, py, 0, px, py, 7);
          ng.addColorStop(0, `rgba(0,230,138,${al * 0.5})`); ng.addColorStop(1, 'transparent');
          ctx.fillStyle = ng; ctx.fillRect(px - 7, py - 7, 14, 14);
          ctx.beginPath(); ctx.arc(px, py, 2, 0, Math.PI * 2); ctx.fillStyle = `rgba(0,230,138,${al})`; ctx.fill();
        }
      });
    raf.current = requestAnimationFrame(draw);
  }, [w, h]);

  useEffect(() => { draw(); return () => { if (raf.current) cancelAnimationFrame(raf.current); }; }, [draw]);
  return <canvas ref={ref} style={{ width: w, height: h }} />;
}

/* ═══ MQS Ring ═══ */
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
        <circle cx={size / 2} cy={size / 2} r={rad} fill="none" stroke="#00e68a" strokeWidth={sw}
          strokeDasharray={circ} strokeDashoffset={off} strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset .3s ease', filter: 'drop-shadow(0 0 4px rgba(0,230,138,0.4))' }} />
      </svg>
      <span style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: 'var(--font-display)', fontSize: size * 0.32, fontWeight: 800, color: '#00e68a',
        textShadow: '0 0 10px rgba(0,230,138,0.3)' }}>{val}</span>
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

/* ═══ Material Card Data ═══ */
const materials = [
  { name: 'HDPE Pellets', status: 'ACTIVE', mqs: 94, qty: '10t', floor: '$12.0k', mqsVal: '925t', price: '$18.1k' },
  { name: 'Copper Wire Scrap', status: 'AGREED', mqs: 92, qty: '100t', floor: '$21.0k', mqsVal: '925t', price: '$17.1k' },
];
const bentoMats = [
  { name: 'HDPE Pellets', status: 'ACTIVE', mqs: 94, qty: '100t', floor: '$12.0k', mqsVal: '5.23t', price: '$17.2k' },
  { name: 'Copper Wire Scrap', status: 'AGREED', mqs: 94, qty: '100', floor: '$02.0k', mqsVal: '5.23t', price: '$50.00' },
];

/* ═══ Pipeline Data ═══ */
const pipeline = [
  { title: 'Listed', count: 1, items: ['Listed (1)', 'Sourced:: 186t'] },
  { title: 'Buyer Interested', count: 1, items: ['Buyer (1)', 'Sourced ±: 186t'] },
  { title: 'Price Proposed', count: 1, items: ['Price Proposed (1)', 'Price Proposed (1)'] },
  { title: 'Agreed', count: 1, items: ['Agreed (1)', 'Agreed: AGREED'] },
  { title: 'Locked', count: 1, items: ['Locked (1)', 'Sourced: 186t'] },
];

/* ═══ Small Material Card ═══ */
function MatCard({ m, size = 64 }) {
  return (
    <div className="bcc-mc">
      <Ring score={m.mqs} size={size} />
      <div className="bcc-mc-info">
        <div className="bcc-mc-top">
          <span className="bcc-mc-name">{m.name}</span>
          <span className={`bcc-badge ${m.status === 'ACTIVE' ? 'bcc-badge-active' : 'bcc-badge-agreed'}`}>{m.status}</span>
        </div>
        <div className="bcc-mc-grid">
          <div><div className="bcc-mc-lbl">Qty</div><div className="bcc-mc-val">{m.qty}</div></div>
          <div><div className="bcc-mc-lbl">Floor</div><div className="bcc-mc-val">{m.floor}</div></div>
          <div><div className="bcc-mc-lbl">MQS</div><div className="bcc-mc-val">{m.mqsVal}</div></div>
          <div><div className="bcc-mc-lbl">Price</div><div className="bcc-mc-val">{m.price}</div></div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════
   MAIN DASHBOARD
   ═══════════════════════════════════════ */
export default function BuyerDashboard() {
  return (
    <motion.div className="bcc" initial="hidden" animate="visible" variants={stagger}>

      {/* ── Header ── */}
      <motion.div variants={fadeUp} className="bcc-head">
        <h1>Buyer Command Center</h1>
        <div className="bcc-head-actions">
          <button className="bcc-ibtn"><LayoutGrid size={17} /></button>
          <button className="bcc-ibtn"><Users size={17} /></button>
        </div>
      </motion.div>

      {/* ── Top Row: Env Impact + Material Cards ── */}
      <motion.div variants={fadeUp} className="bcc-top">
        {/* Environmental Impact */}
        <div className="bcc-env">
          <div className="bcc-env-title">Environmental Impact</div>
          <Globe w={190} h={190} />
          <div className="bcc-env-bot">
            <h3>Global</h3>
            <p>Sourced: <strong>186t</strong>, CO2 Avoided: <strong>142tCO2e</strong></p>
          </div>
        </div>

        {/* Material Cards */}
        <div className="bcc-mats-col">
          <div className="bcc-mats-hdr">
            <h2>Material Cards</h2>
            <button className="bcc-filter-btn">All material <ChevronDown size={13} /></button>
          </div>
          <div className="bcc-mats-row">
            {materials.map((m, i) => <MatCard key={i} m={m} size={60} />)}
          </div>
        </div>
      </motion.div>

      {/* ── Bento Box ── */}
      <motion.div variants={fadeUp}>
        <h2 className="bcc-bento-label">Bento Box</h2>
        <div className="bcc-bento">
          {/* Sourced MTD - tall card spanning 2 rows */}
          <div className="bcc-bento-sourced">
            <div className="bcc-bento-icon"><TrendingUp size={20} /></div>
            <div>
              <div className="bcc-bento-lbl">Sourced (MTD):</div>
              <div className="bcc-bento-val"><Num target={186} /><span>t</span></div>
            </div>
          </div>

          {/* Cost Savings - row 1 col 2 */}
          <div className="bcc-bento-kpi">
            <div className="kpi-icon"><Percent size={18} /></div>
            <div>
              <div className="kpi-lbl">Cost Savings:</div>
              <div className="kpi-val">$<Num target={24000} /></div>
            </div>
          </div>

          {/* HDPE Pellets - row 1-2 col 3 */}
          <div className="bcc-bento-mat">
            <Ring score={bentoMats[0].mqs} size={72} />
            <div className="bcc-mc-info">
              <div className="bcc-mc-top">
                <span className="bcc-mc-name">{bentoMats[0].name}</span>
                <span className="bcc-badge bcc-badge-active">{bentoMats[0].status}</span>
              </div>
              <div className="bcc-mc-grid">
                <div><div className="bcc-mc-lbl">Qty</div><div className="bcc-mc-val">{bentoMats[0].qty}</div></div>
                <div><div className="bcc-mc-lbl">Floor</div><div className="bcc-mc-val">{bentoMats[0].floor}</div></div>
                <div><div className="bcc-mc-lbl">MQS</div><div className="bcc-mc-val">{bentoMats[0].mqsVal}</div></div>
                <div><div className="bcc-mc-lbl">Price</div><div className="bcc-mc-val">{bentoMats[0].price}</div></div>
              </div>
            </div>
          </div>

          {/* Copper Wire Scrap - row 1-2 col 4 */}
          <div className="bcc-bento-mat">
            <Ring score={bentoMats[1].mqs} size={72} />
            <div className="bcc-mc-info">
              <div className="bcc-mc-top">
                <span className="bcc-mc-name">{bentoMats[1].name}</span>
                <span className="bcc-badge bcc-badge-agreed">{bentoMats[1].status}</span>
              </div>
              <div className="bcc-mc-grid">
                <div><div className="bcc-mc-lbl">Qty</div><div className="bcc-mc-val">{bentoMats[1].qty}</div></div>
                <div><div className="bcc-mc-lbl">Floor</div><div className="bcc-mc-val">{bentoMats[1].floor}</div></div>
                <div><div className="bcc-mc-lbl">MQS</div><div className="bcc-mc-val">{bentoMats[1].mqsVal}</div></div>
                <div><div className="bcc-mc-lbl">Price</div><div className="bcc-mc-val">{bentoMats[1].price}</div></div>
              </div>
            </div>
          </div>

          {/* Scope 3 Avoided - row 2 col 2 */}
          <div className="bcc-bento-kpi">
            <div className="kpi-icon green"><Clock size={18} /></div>
            <div>
              <div className="kpi-lbl">Scope 3 Avoided:</div>
              <div className="kpi-val"><Num target={142} />tCO2e</div>
            </div>
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
                  <h4><span className="pip-sq"><Package size={8} /></span> {s.title} ({s.count})</h4>
                  {s.items.map((item, j) => (
                    <div key={j} className="bcc-pip-item">
                      {typeof item === 'string' && item.includes(':')
                        ? <>{item.split(':')[0]}: <strong>{item.split(':').slice(1).join(':').trim()}</strong></>
                        : item
                      }
                    </div>
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
