import { createContext, useContext, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, AlertTriangle, XCircle, Info, X } from 'lucide-react';

const ToastContext = createContext(null);

const ICONS = {
  success: CheckCircle,
  info: Info,
  warning: AlertTriangle,
  error: XCircle,
};

const COLORS = {
  success: { accent: '#B8F53C', bg: 'rgba(184,245,60,0.08)', border: 'rgba(184,245,60,0.2)' },
  info: { accent: '#F59E0B', bg: 'rgba(245,158,11,0.08)', border: 'rgba(245,158,11,0.2)' },
  warning: { accent: '#F59E0B', bg: 'rgba(245,158,11,0.08)', border: 'rgba(245,158,11,0.2)' },
  error: { accent: '#EF4444', bg: 'rgba(239,68,68,0.08)', border: 'rgba(239,68,68,0.2)' },
};

function Toast({ id, message, type = 'success', onDismiss }) {
  const Icon = ICONS[type] || ICONS.success;
  const c = COLORS[type] || COLORS.success;

  return (
    <motion.div
      layout
      initial={{ x: 40, opacity: 0, scale: 0.95 }}
      animate={{ x: 0, opacity: 1, scale: 1 }}
      exit={{ x: 40, opacity: 0, scale: 0.95 }}
      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
      style={{
        position: 'relative', overflow: 'hidden',
        background: 'rgba(6,15,9,0.97)',
        border: `1px solid ${c.border}`,
        borderRadius: 12, padding: '14px 18px', minWidth: 300, maxWidth: 420,
        boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
        backdropFilter: 'blur(16px)',
        display: 'flex', alignItems: 'flex-start', gap: 12,
        cursor: 'pointer',
      }}
      onClick={() => onDismiss(id)}
    >
      {/* Left accent bar */}
      <div style={{
        position: 'absolute', left: 0, top: 0, bottom: 0, width: 3,
        background: c.accent, borderRadius: '12px 0 0 12px',
        boxShadow: `0 0 12px ${c.accent}40`,
      }} />

      <div style={{
        width: 28, height: 28, borderRadius: 7,
        background: c.bg, display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0, marginLeft: 4,
      }}>
        <Icon size={14} style={{ color: c.accent }} />
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,0.85)', lineHeight: 1.4 }}>{message}</div>
      </div>

      <button
        onClick={e => { e.stopPropagation(); onDismiss(id); }}
        style={{
          background: 'none', border: 'none', cursor: 'pointer', padding: 2,
          color: 'rgba(255,255,255,0.25)', transition: 'color 0.15s',
          flexShrink: 0,
        }}
        onMouseEnter={e => e.currentTarget.style.color = 'rgba(255,255,255,0.5)'}
        onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.25)'}
      >
        <X size={14} />
      </button>

      {/* Countdown progress bar */}
      <motion.div
        initial={{ scaleX: 1 }}
        animate={{ scaleX: 0 }}
        transition={{ duration: 4, ease: 'linear' }}
        style={{
          position: 'absolute', bottom: 0, left: 0, right: 0, height: 2,
          background: c.accent, transformOrigin: 'left', opacity: 0.5,
        }}
      />
    </motion.div>
  );
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'success') => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 4200);
    return id;
  }, []);

  const dismiss = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={addToast}>
      {children}
      {/* Toast Container */}
      <div style={{
        position: 'fixed', top: 20, right: 20, zIndex: 9999,
        display: 'flex', flexDirection: 'column', gap: 8,
        pointerEvents: 'none',
      }}>
        <AnimatePresence mode="popLayout">
          {toasts.map(t => (
            <div key={t.id} style={{ pointerEvents: 'auto' }}>
              <Toast id={t.id} message={t.message} type={t.type} onDismiss={dismiss} />
            </div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
}
