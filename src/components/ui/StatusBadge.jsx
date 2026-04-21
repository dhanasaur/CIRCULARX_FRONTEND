const colorMap = {
  lime: { bg: 'rgba(184,245,60,0.12)', text: '#B8F53C', border: 'rgba(184,245,60,0.3)' },
  amber: { bg: 'rgba(245,158,11,0.12)', text: '#F59E0B', border: 'rgba(245,158,11,0.3)' },
  danger: { bg: 'rgba(239,68,68,0.12)', text: '#EF4444', border: 'rgba(239,68,68,0.3)' },
  info: { bg: 'rgba(56,189,248,0.12)', text: '#38BDF8', border: 'rgba(56,189,248,0.3)' },
  slate: { bg: 'rgba(100,116,139,0.12)', text: '#94A3B8', border: 'rgba(100,116,139,0.3)' },
};

const pulseStatuses = ['LOCKED', 'ESCROW_LOCKED'];
const amberPulseStatuses = ['QAR_PENDING'];

export default function StatusBadge({ status, color = 'lime', size = 'sm' }) {
  const resolvedColor = color || 'slate';
  const c = colorMap[resolvedColor] || colorMap.slate;
  const isPulse = pulseStatuses.includes(status);
  const isAmberPulse = amberPulseStatuses.includes(status);

  const sizeStyles = {
    xs: { fontSize: 10, padding: '1px 6px' },
    sm: { fontSize: 11, padding: '2px 8px' },
    md: { fontSize: 12, padding: '4px 10px' },
  };

  return (
    <span
      className={isPulse ? 'badge-locked' : isAmberPulse ? 'badge-qar-pending' : ''}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 4,
        fontFamily: 'var(--font-mono)',
        fontWeight: 600,
        letterSpacing: '0.02em',
        borderRadius: 'var(--radius-badge)',
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
