import { useEffect, useRef, useState } from 'react';

export default function MQSRing({ score, size = 56, strokeWidth = 4, showLabel = true }) {
  const [animatedScore, setAnimatedScore] = useState(0);
  const ref = useRef(null);
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (animatedScore / 100) * circumference;

  const color = animatedScore >= 75 ? '#00e68a' : animatedScore >= 50 ? '#F59E0B' : '#EF4444';
  const bgColor = animatedScore >= 75 ? 'rgba(0,230,138,0.1)' : animatedScore >= 50 ? 'rgba(245,158,11,0.1)' : 'rgba(239,68,68,0.1)';

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

  return (
    <div ref={ref} style={{ width: size, height: size, position: 'relative' }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth={strokeWidth} />
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke={color} strokeWidth={strokeWidth} strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round" style={{ transition: 'stroke-dashoffset 0.3s ease, stroke 0.3s ease' }} />
      </svg>
      {showLabel && (
        <span style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-mono)', fontSize: size * 0.26, fontWeight: 600, color }} >
          {animatedScore}
        </span>
      )}
    </div>
  );
}
