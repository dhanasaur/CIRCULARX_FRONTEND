import { useEffect, useRef, useState } from 'react';

export default function MQSRing({ score, size = 56, strokeWidth = 4, showLabel = true }) {
  const [animatedScore, setAnimatedScore] = useState(0);
  const [hovered, setHovered] = useState(false);
  const ref = useRef(null);
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (animatedScore / 100) * circumference;

  const color = animatedScore >= 75 ? '#B8F53C' : animatedScore >= 50 ? '#F59E0B' : '#EF4444';
  const bgColor = animatedScore >= 75 ? 'rgba(184,245,60,0.1)' : animatedScore >= 50 ? 'rgba(245,158,11,0.1)' : 'rgba(239,68,68,0.1)';

  const outerRadius = radius + 6;
  const outerCirc = 2 * Math.PI * outerRadius;

  useEffect(() => {
    const observer = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        let start = 0;
        const dur = 1200;
        const t0 = performance.now();
        function step(now) {
          const p = Math.min((now - t0) / dur, 1);
          const eased = 1 - Math.pow(1 - p, 3);
          setAnimatedScore(Math.floor(eased * score));
          if (p < 1) requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
        observer.disconnect();
      }
    }, { threshold: 0.3 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [score]);

  const outerSize = size + 16;

  return (
    <div
      ref={ref}
      style={{ width: outerSize, height: outerSize, position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Outer hover ring */}
      <svg
        width={outerSize}
        height={outerSize}
        style={{
          position: 'absolute', inset: 0,
          transform: 'rotate(-90deg)',
          opacity: hovered ? 0.35 : 0,
          transition: 'opacity 0.3s ease',
        }}
      >
        <circle
          cx={outerSize / 2} cy={outerSize / 2} r={outerRadius}
          fill="none" stroke={color} strokeWidth={1.5}
          strokeDasharray={`${outerCirc * 0.25} ${outerCirc * 0.75}`}
          style={{ filter: `drop-shadow(0 0 4px ${color}60)` }}
        />
      </svg>

      {/* Main ring */}
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth={strokeWidth} />
        <circle
          cx={size / 2} cy={size / 2} r={radius}
          fill="none" stroke={color} strokeWidth={strokeWidth}
          strokeDasharray={circumference} strokeDashoffset={offset}
          strokeLinecap="round"
          style={{
            transition: 'stroke-dashoffset 0.3s ease, stroke 0.3s ease',
            filter: `drop-shadow(0 0 4px ${color}50)`,
          }}
        />
      </svg>
      {showLabel && (
        <span style={{
          position: 'absolute', inset: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: 'var(--font-mono)', fontSize: size * 0.26, fontWeight: 700, color,
        }}>
          {animatedScore}
        </span>
      )}
    </div>
  );
}
