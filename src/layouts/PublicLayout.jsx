import { Outlet, Link, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';

export default function PublicLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { pathname } = useLocation();

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/about', label: 'About' },
    { to: '/how-it-works', label: 'How It Works' },
    { to: '/pricing', label: 'Pricing' },
    { to: '/compliance', label: 'Compliance' },
  ];

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-brand-cream)', color: '#1a1a1a' }}>
      {/* Navbar */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        background: 'rgba(245,241,235,0.85)', backdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(0,0,0,0.06)',
      }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 64 }}>
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none' }}>
            <img src="/logo.png" alt="CIRCULARX" style={{ height: 32 }} />
            <span style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 800, color: 'var(--color-brand-forest)', letterSpacing: '-0.02em' }}>CIRCULAR<span style={{ color: 'var(--color-brand-lime-dim)' }}>X</span></span>
          </Link>

          {/* Desktop nav */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 32 }} className="desktop-nav">
            {navLinks.map(link => (
              <Link key={link.to} to={link.to} style={{
                fontSize: 14, fontWeight: 500, color: pathname === link.to ? 'var(--color-brand-forest)' : 'var(--color-brand-slate)',
                textDecoration: 'none', transition: 'color 0.2s', borderBottom: pathname === link.to ? '2px solid var(--color-brand-forest)' : '2px solid transparent', paddingBottom: 2,
              }}>
                {link.label}
              </Link>
            ))}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }} className="desktop-nav">
            <Link to="/login" style={{
              fontSize: 14, fontWeight: 500, color: 'var(--color-brand-forest)', textDecoration: 'none', padding: '8px 16px', borderRadius: 'var(--radius-btn)', border: '1px solid var(--color-brand-forest)', transition: 'all 0.2s',
            }}>
              Sign In
            </Link>
            <Link to="/register" style={{
              fontSize: 14, fontWeight: 600, color: 'var(--color-brand-dark)', textDecoration: 'none', padding: '8px 20px', borderRadius: 'var(--radius-btn)', background: 'var(--color-brand-lime)', transition: 'all 0.2s',
            }}>
              Get Started
            </Link>
          </div>

          {/* Mobile toggle */}
          <button onClick={() => setMobileOpen(!mobileOpen)} className="mobile-nav-toggle" style={{ display: 'none', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-brand-forest)' }}>
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div style={{ background: 'var(--color-brand-cream)', borderTop: '1px solid rgba(0,0,0,0.06)', padding: '16px 24px' }} className="mobile-menu">
            {navLinks.map(link => (
              <Link key={link.to} to={link.to} onClick={() => setMobileOpen(false)} style={{ display: 'block', padding: '12px 0', fontSize: 15, fontWeight: 500, color: 'var(--color-brand-forest)', textDecoration: 'none', borderBottom: '1px solid rgba(0,0,0,0.04)' }}>
                {link.label}
              </Link>
            ))}
            <div style={{ display: 'flex', gap: 12, marginTop: 16 }}>
              <Link to="/login" onClick={() => setMobileOpen(false)} style={{ flex: 1, textAlign: 'center', padding: '10px 0', fontSize: 14, fontWeight: 500, color: 'var(--color-brand-forest)', textDecoration: 'none', border: '1px solid var(--color-brand-forest)', borderRadius: 'var(--radius-btn)' }}>Sign In</Link>
              <Link to="/register" onClick={() => setMobileOpen(false)} style={{ flex: 1, textAlign: 'center', padding: '10px 0', fontSize: 14, fontWeight: 600, color: 'var(--color-brand-dark)', textDecoration: 'none', background: 'var(--color-brand-lime)', borderRadius: 'var(--radius-btn)' }}>Get Started</Link>
            </div>
          </div>
        )}
      </nav>

      <main style={{ paddingTop: 64 }}>
        <Outlet />
      </main>

      {/* Footer */}
      <footer style={{ background: 'var(--color-brand-forest)', color: 'rgba(255,255,255,0.7)', padding: '64px 24px 32px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 40, marginBottom: 48 }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                <img src="/logo.png" alt="CIRCULARX" style={{ height: 28 }} />
                <span style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 800, color: '#fff' }}>CIRCULAR<span style={{ color: 'var(--color-brand-lime)' }}>X</span></span>
              </div>
              <p style={{ fontSize: 13, lineHeight: 1.6, color: 'rgba(255,255,255,0.5)' }}>Close the Loop. Open the Market.<br />AI-Powered Industrial Material Circularity</p>
            </div>
            <div>
              <h4 style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'rgba(255,255,255,0.4)', marginBottom: 16 }}>Platform</h4>
              {['How It Works', 'Pricing', 'Compliance', 'About'].map(l => (
                <Link key={l} to={`/${l.toLowerCase().replace(/ /g, '-')}`} style={{ display: 'block', fontSize: 13, color: 'rgba(255,255,255,0.6)', textDecoration: 'none', marginBottom: 8, transition: 'color 0.2s' }}
                  onMouseEnter={e => e.target.style.color = '#B8F53C'} onMouseLeave={e => e.target.style.color = 'rgba(255,255,255,0.6)'}>{l}</Link>
              ))}
            </div>
            <div>
              <h4 style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'rgba(255,255,255,0.4)', marginBottom: 16 }}>Roles</h4>
              {['Sellers', 'Buyers', 'Quality Control'].map(l => (
                <span key={l} style={{ display: 'block', fontSize: 13, color: 'rgba(255,255,255,0.6)', marginBottom: 8 }}>{l}</span>
              ))}
            </div>
            <div>
              <h4 style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'rgba(255,255,255,0.4)', marginBottom: 16 }}>Compliance</h4>
              {['Basel Convention', 'EU ESPR 2026', 'Verra VCS', 'GHG Protocol'].map(l => (
                <span key={l} style={{ display: 'block', fontSize: 13, color: 'rgba(255,255,255,0.6)', marginBottom: 8 }}>{l}</span>
              ))}
            </div>
          </div>
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: 24, display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: 16 }}>
            <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
              {['SDG 9', 'SDG 12', 'SDG 13'].map(s => (
                <span key={s} style={{ fontSize: 10, padding: '3px 8px', borderRadius: 4, background: 'rgba(184,245,60,0.1)', color: '#B8F53C', fontFamily: 'var(--font-mono)', fontWeight: 600 }}>{s}</span>
              ))}
            </div>
            <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', margin: 0 }}>
              CIRCULARX is aligned with UN SDGs 9, 12 & 13 and the EU Circular Economy Action Plan. © 2025 CIRCULARX.
            </p>
          </div>
        </div>
      </footer>

      <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .mobile-nav-toggle { display: block !important; }
        }
        @media (min-width: 769px) {
          .mobile-menu { display: none !important; }
        }
      `}</style>
    </div>
  );
}
