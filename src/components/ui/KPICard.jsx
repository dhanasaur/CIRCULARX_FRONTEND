import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

const SPARKLINE_DATA = {
  default: [3, 5, 4, 7, 6, 8, 7],
};

function Sparkline({ data = SPARKLINE_DATA.default, color = '#B8F53C', width = 60, height = 24 }) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const points = data.map((v, i) =>
    `${(i / (data.length - 1)) * width},${height - ((v - min) / range) * height * 0.85 - 2}`
  ).join(' ');

  return (
    <svg width={width} height={height} style={{ display: 'block', overflow: 'visible' }}>
      <defs>
        <linearGradient id={`spark-${color.replace('#','')}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity={0.3} />
          <stop offset="100%" stopColor={color} stopOpacity={0} />
        </linearGradient>
      </defs>
      <polygon
        points={`0,${height} ${points} ${width},${height}`}
        fill={`url(#spark-${color.replace('#','')})`}
      />
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ filter: `drop-shadow(0 0 3px ${color}40)` }}
      />
    </svg>
  );
}

export default function KPICard({ title, value, suffix = '', prefix = '', icon: Icon, trend, trendLabel, color = 'lime', delay = 0, sparkData }) {
  const numericValue = typeof value === 'number' ? value : parseFloat(value) || 0;
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const dur = 1500;
          const t0 = performance.now();
          function step(now) {
            const p = Math.min((now - t0) / dur, 1);
            const eased = 1 - Math.pow(1 - p, 3);
            setCount(Math.floor(eased * numericValue));
            if (p < 1) requestAnimationFrame(step);
          }
          requestAnimationFrame(step);
        }
      },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [numericValue]);

  const colorMap = {
    lime:   { accent: '#B8F53C', bg: 'rgba(184,245,60,0.06)',  glow: 'rgba(184,245,60,0.12)',  border: 'rgba(184,245,60,0.12)', rgb: '184,245,60' },
    blue:   { accent: '#38BDF8', bg: 'rgba(56,189,248,0.06)',  glow: 'rgba(56,189,248,0.12)',  border: 'rgba(56,189,248,0.12)', rgb: '56,189,248' },
    amber:  { accent: '#F59E0B', bg: 'rgba(245,158,11,0.06)', glow: 'rgba(245,158,11,0.12)', border: 'rgba(245,158,11,0.12)', rgb: '245,158,11' },
    rose:   { accent: '#fb7185', bg: 'rgba(251,113,133,0.06)',glow: 'rgba(251,113,133,0.12)',border: 'rgba(251,113,133,0.12)', rgb: '251,113,133' },
    purple: { accent: '#A78BFA', bg: 'rgba(167,139,250,0.06)',glow: 'rgba(167,139,250,0.12)',border: 'rgba(167,139,250,0.12)', rgb: '167,139,250' },
  };
  const c = colorMap[color] || colorMap.lime;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: delay * 0.06, ease: [0.22, 1, 0.36, 1] }}
      style={{
        position: 'relative',
        padding: '20px 22px 18px',
        borderRadius: 14,
        background: 'linear-gradient(135deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.01) 100%)',
        border: `1px solid ${c.border}`,
        borderTop: `2px solid ${c.accent}`,
        overflow: 'hidden',
        cursor: 'default',
        backdropFilter: 'blur(16px)',
        boxShadow: `0 -2px 12px rgba(${c.rgb},0.15), inset 0 1px 0 rgba(255,255,255,0.06), 0 4px 24px rgba(0,0,0,0.25)`,
        transition: 'border-color 0.3s ease, box-shadow 0.3s ease, transform 0.3s cubic-bezier(0.4,0,0.2,1)',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.borderColor = c.accent + '35';
        e.currentTarget.style.boxShadow = `0 0 30px ${c.glow}, 0 0 0 1px rgba(${c.rgb},0.15), inset 0 1px 0 ${c.border}`;
        e.currentTarget.style.transform = 'translateY(-2px)';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = c.border;
        e.currentTarget.style.boxShadow = '';
        e.currentTarget.style.transform = '';
      }}
    >
      {/* Radial gradient accent glow */}
      <div style={{
        position: 'absolute', top: -40, right: -40, width: 130, height: 130,
        borderRadius: '50%',
        background: `radial-gradient(circle at top right, rgba(${c.rgb},0.12) 0%, transparent 60%)`,
        pointerEvents: 'none',
      }} />

      <div style={{ position: 'relative', zIndex: 1 }}>
        {/* Header: title + icon */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
          <span className="dash-micro-label" style={{ color: 'rgba(255,255,255,0.45)', letterSpacing: '0.04em' }}>{title}</span>
          {Icon && (
            <div style={{
              width: 36, height: 36, borderRadius: 9,
              background: c.bg, display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Icon size={17} style={{ color: c.accent }} />
            </div>
          )}
        </div>

        {/* Value */}
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 8 }}>
          <div style={{
            fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 800, color: '#fff',
            letterSpacing: '-0.03em', lineHeight: 1,
          }}>
            {prefix}{count.toLocaleString()}{suffix && <span style={{ fontSize: 16, opacity: 0.4, marginLeft: 2 }}>{suffix}</span>}
          </div>
          {/* Sparkline */}
          <div style={{ flexShrink: 0, opacity: 0.7 }}>
            <Sparkline data={sparkData} color={c.accent} />
          </div>
        </div>

        {/* Trend indicator */}
        {trend !== undefined && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 10 }}>
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: 3,
              fontSize: 11, fontWeight: 700, fontFamily: 'var(--font-mono)',
              color: trend >= 0 ? '#B8F53C' : '#fb7185',
              background: trend >= 0 ? 'rgba(184,245,60,0.08)' : 'rgba(251,113,133,0.08)',
              padding: '2px 7px', borderRadius: 4,
            }}>
              {trend >= 0 ? '▲' : '▼'} {Math.abs(trend)}%
            </span>
            {trendLabel && <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.25)' }}>{trendLabel}</span>}
          </div>
        )}
      </div>
    </motion.div>
  );
}
