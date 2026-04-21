import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

export default function KPICard({ title, value, suffix = '', prefix = '', icon: Icon, trend, trendLabel, color = 'lime', delay = 0 }) {
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
    lime: { accent: '#B8F53C', bg: 'rgba(184,245,60,0.06)', glow: 'rgba(184,245,60,0.08)', border: 'rgba(184,245,60,0.12)' },
    blue: { accent: '#38BDF8', bg: 'rgba(56,189,248,0.06)', glow: 'rgba(56,189,248,0.08)', border: 'rgba(56,189,248,0.12)' },
    amber: { accent: '#F59E0B', bg: 'rgba(245,158,11,0.06)', glow: 'rgba(245,158,11,0.08)', border: 'rgba(245,158,11,0.12)' },
    rose: { accent: '#FB7185', bg: 'rgba(251,113,133,0.06)', glow: 'rgba(251,113,133,0.08)', border: 'rgba(251,113,133,0.12)' },
  };
  const c = colorMap[color] || colorMap.lime;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: delay * 0.08, ease: [0.25, 0.46, 0.45, 0.94] }}
      style={{
        position: 'relative',
        padding: '22px 24px',
        borderRadius: 14,
        background: 'rgba(255,255,255,0.025)',
        border: `1px solid ${c.border}`,
        overflow: 'hidden',
        cursor: 'default',
        transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.borderColor = c.accent + '30';
        e.currentTarget.style.boxShadow = `0 0 30px ${c.glow}, inset 0 1px 0 ${c.border}`;
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = c.border;
        e.currentTarget.style.boxShadow = '';
      }}
    >
      {/* Subtle gradient glow */}
      <div style={{
        position: 'absolute', top: -40, right: -40, width: 120, height: 120,
        borderRadius: '50%', background: c.bg, filter: 'blur(40px)', pointerEvents: 'none',
      }} />

      <div style={{ position: 'relative', zIndex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
          <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.45)', fontWeight: 500, letterSpacing: '0.01em' }}>{title}</span>
          {Icon && (
            <div style={{
              width: 32, height: 32, borderRadius: 8,
              background: c.bg, display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Icon size={16} style={{ color: c.accent }} />
            </div>
          )}
        </div>
        <div style={{
          fontFamily: 'var(--font-display)', fontSize: 30, fontWeight: 800, color: '#fff',
          letterSpacing: '-0.03em', lineHeight: 1, marginBottom: trend !== undefined ? 10 : 0,
        }}>
          {prefix}{count.toLocaleString()}{suffix}
        </div>
        {trend !== undefined && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: 3,
              fontSize: 11, fontWeight: 600, fontFamily: 'var(--font-mono)',
              color: trend >= 0 ? '#B8F53C' : '#FB7185',
              background: trend >= 0 ? 'rgba(184,245,60,0.08)' : 'rgba(251,113,133,0.08)',
              padding: '2px 7px', borderRadius: 4,
            }}>
              {trend >= 0 ? '↑' : '↓'} {Math.abs(trend)}%
            </span>
            {trendLabel && <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.25)' }}>{trendLabel}</span>}
          </div>
        )}
      </div>
    </motion.div>
  );
}
