import { motion } from 'framer-motion';
import { Construction } from 'lucide-react';

const fadeUp = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5 } } };

export default function PlaceholderPage({ title, subtitle, dark = true }) {
  return (
    <motion.div initial="hidden" animate="visible" variants={fadeUp} style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      minHeight: dark ? 400 : '60vh', textAlign: 'center', padding: 48,
    }}>
      <Construction size={48} style={{ color: dark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.15)', marginBottom: 20 }} />
      <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 24, color: dark ? '#fff' : 'var(--color-brand-forest)', marginBottom: 8 }}>{title}</h2>
      <p style={{ fontSize: 14, color: dark ? 'rgba(255,255,255,0.4)' : 'var(--color-brand-slate)', maxWidth: 400 }}>
        {subtitle || 'This section is being routed through the IRE pipeline. Check back soon.'}
      </p>
    </motion.div>
  );
}
