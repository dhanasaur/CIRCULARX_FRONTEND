import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Factory, ShoppingCart, ClipboardCheck, Recycle, Eye, EyeOff } from 'lucide-react';

const roles = [
  { key: 'seller', label: 'Seller', desc: 'Waste Generator', icon: Factory },
  { key: 'buyer', label: 'Buyer', desc: 'Manufacturer', icon: ShoppingCart },
  { key: 'qc', label: 'QC Team', desc: 'Quality Control', icon: ClipboardCheck },
];

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('seller');
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) { setError('Please fill in all fields'); return; }
    setError('');
    setLoading(true);
    try {
      await login(email, password, role);
      navigate(`/${role}/dashboard`);
    } catch {
      setError('Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {/* Left panel */}
      <div style={{ flex: 1, background: 'var(--color-brand-forest)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 48, position: 'relative', overflow: 'hidden' }} className="grain-overlay login-left-panel">
        <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.1 }}>
          {[...Array(8)].map((_, i) => (
            <circle key={i} cx={200 + Math.sin(i) * 150} cy={200 + Math.cos(i) * 150} r={60 + i * 30} fill="none" stroke="#B8F53C" strokeWidth="0.5" opacity={0.3 - i * 0.03}>
              <animateTransform attributeName="transform" type="rotate" from={`0 ${200 + Math.sin(i) * 150} ${200 + Math.cos(i) * 150}`} to={`360 ${200 + Math.sin(i) * 150} ${200 + Math.cos(i) * 150}`} dur={`${20 + i * 5}s`} repeatCount="indefinite" />
            </circle>
          ))}
        </svg>
        <div style={{ position: 'relative', zIndex: 2, maxWidth: 400 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 32 }}>
            <img src="/logo.png" alt="CIRCULARX" style={{ height: 40, marginBottom: 4 }} />
            <span style={{ fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 800, color: '#fff' }}>CIRCULAR<span style={{ color: '#B8F53C' }}>X</span></span>
          </div>
          <blockquote style={{ fontSize: 24, fontFamily: 'var(--font-display)', fontWeight: 600, color: 'rgba(255,255,255,0.85)', lineHeight: 1.4, marginBottom: 16, borderLeft: '3px solid #B8F53C', paddingLeft: 20 }}>
            "In a circular economy, waste is not an endpoint — it is the beginning of a new value chain."
          </blockquote>
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)' }}>Close the Loop. Open the Market.</p>
        </div>
      </div>

      {/* Right panel — Login form */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 48, background: 'var(--color-brand-cream)' }}>
        <div style={{ width: '100%', maxWidth: 400 }}>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 28, color: 'var(--color-brand-forest)', marginBottom: 8 }}>Welcome Back</h1>
          <p style={{ fontSize: 14, color: 'var(--color-brand-slate)', marginBottom: 32 }}>Sign in to your CIRCULARX dashboard</p>

          <form onSubmit={handleSubmit}>
            {/* Role selector */}
            <div style={{ marginBottom: 24 }}>
              <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-brand-forest)', display: 'block', marginBottom: 8 }}>Select Role</label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
                {roles.map(r => {
                  const Icon = r.icon;
                  const isActive = role === r.key;
                  return (
                    <button key={r.key} type="button" onClick={() => setRole(r.key)} style={{
                      padding: '12px 8px', borderRadius: 'var(--radius-btn)', cursor: 'pointer', textAlign: 'center',
                      background: isActive ? 'var(--color-brand-forest)' : '#fff',
                      color: isActive ? '#fff' : 'var(--color-brand-forest)',
                      border: `1.5px solid ${isActive ? 'var(--color-brand-forest)' : 'rgba(0,0,0,0.1)'}`,
                      transition: 'all 0.2s',
                    }}>
                      <Icon size={18} style={{ margin: '0 auto 4px', display: 'block', color: isActive ? '#B8F53C' : 'var(--color-brand-slate)' }} />
                      <div style={{ fontSize: 12, fontWeight: 600 }}>{r.label}</div>
                      <div style={{ fontSize: 10, opacity: 0.6 }}>{r.desc}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Email */}
            <div style={{ marginBottom: 16 }}>
              <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-brand-forest)', display: 'block', marginBottom: 6 }}>Email Address</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@company.com"
                style={{ width: '100%', padding: '12px 14px', borderRadius: 'var(--radius-btn)', border: '1.5px solid rgba(0,0,0,0.1)', fontSize: 14, fontFamily: 'var(--font-body)', background: '#fff', outline: 'none', transition: 'border 0.2s', boxSizing: 'border-box' }}
                onFocus={e => e.target.style.borderColor = 'var(--color-brand-mid)'} onBlur={e => e.target.style.borderColor = 'rgba(0,0,0,0.1)'}
              />
            </div>

            {/* Password */}
            <div style={{ marginBottom: 24, position: 'relative' }}>
              <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--color-brand-forest)', display: 'block', marginBottom: 6 }}>Password</label>
              <div style={{ position: 'relative' }}>
                <input type={showPw ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••"
                  style={{ width: '100%', padding: '12px 40px 12px 14px', borderRadius: 'var(--radius-btn)', border: '1.5px solid rgba(0,0,0,0.1)', fontSize: 14, fontFamily: 'var(--font-body)', background: '#fff', outline: 'none', boxSizing: 'border-box' }}
                  onFocus={e => e.target.style.borderColor = 'var(--color-brand-mid)'} onBlur={e => e.target.style.borderColor = 'rgba(0,0,0,0.1)'}
                />
                <button type="button" onClick={() => setShowPw(!showPw)} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-brand-slate)' }}>
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              <div style={{ textAlign: 'right', marginTop: 8 }}>
                <a href="#" style={{ fontSize: 12, color: 'var(--color-brand-mid)', textDecoration: 'none' }}>Forgot Password?</a>
              </div>
            </div>

            {error && <div style={{ fontSize: 13, color: '#EF4444', marginBottom: 16, padding: '8px 12px', background: 'rgba(239,68,68,0.06)', borderRadius: 6 }}>{error}</div>}

            <button type="submit" disabled={loading} style={{
              width: '100%', padding: '14px 0', borderRadius: 'var(--radius-btn)', border: 'none', cursor: 'pointer',
              background: 'var(--color-brand-forest)', color: '#fff', fontSize: 15, fontWeight: 700, fontFamily: 'var(--font-body)',
              opacity: loading ? 0.7 : 1, transition: 'opacity 0.2s',
            }}>
              {loading ? 'Signing in...' : 'Sign In'}
            </button>

            <p style={{ textAlign: 'center', marginTop: 20, fontSize: 13, color: 'var(--color-brand-slate)' }}>
              Don't have an account? <Link to="/register" style={{ color: 'var(--color-brand-mid)', fontWeight: 600, textDecoration: 'none' }}>Register</Link>
            </p>

            <div style={{ textAlign: 'center', marginTop: 16 }}>
              <span className="api-tooltip">POST /auth/login</span>
            </div>
          </form>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .login-left-panel { display: none !important; }
        }
      `}</style>
    </div>
  );
}
