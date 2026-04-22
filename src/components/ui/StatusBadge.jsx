const colorMap = {
  lime:   { bg: 'rgba(184,245,60,0.1)',   text: '#B8F53C', border: 'rgba(184,245,60,0.2)' },
  amber:  { bg: 'rgba(245,158,11,0.1)',   text: '#F59E0B', border: 'rgba(245,158,11,0.2)' },
  danger: { bg: 'rgba(239,68,68,0.1)',    text: '#FB7185', border: 'rgba(239,68,68,0.2)' },
  info:   { bg: 'rgba(56,189,248,0.1)',   text: '#38BDF8', border: 'rgba(56,189,248,0.2)' },
  slate:  { bg: 'rgba(100,116,139,0.1)',  text: '#94A3B8', border: 'rgba(100,116,139,0.2)' },
  purple: { bg: 'rgba(167,139,250,0.1)',  text: '#A78BFA', border: 'rgba(167,139,250,0.2)' },
};

const pulseStatuses = ['LOCKED', 'ESCROW_LOCKED'];
const amberPulseStatuses = ['QAR_PENDING'];

export default function StatusBadge({ status, color = 'lime', size = 'sm' }) {
  const resolvedColor = color || 'slate';
  const c = colorMap[resolvedColor] || colorMap.slate;
  const isPulse = pulseStatuses.includes(status);
  const isAmberPulse = amberPulseStatuses.includes(status);

  const sizeStyles = {
    xs: { fontSize: 10, padding: '3px 8px' },
    sm: { fontSize: 11, padding: '3px 9px' },
    md: { fontSize: 12, padding: '4px 11px' },
  };

  return (
    <span
      className={isPulse ? 'badge-locked' : isAmberPulse ? 'badge-qar-pending' : ''}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 5,
        fontFamily: 'var(--font-mono)',
        fontWeight: 700,
        letterSpacing: '0.06em',
        borderRadius: 6,
        background: c.bg,
        color: c.text,
        border: `1px solid ${c.border}`,
        textTransform: 'uppercase',
        whiteSpace: 'nowrap',
        ...sizeStyles[size],
      }}
    >
      <span style={{ width: 6, height: 6, borderRadius: '50%', background: c.text, flexShrink: 0 }} />
      {status?.replace(/_/g, ' ')}
    </span>
  );
}
