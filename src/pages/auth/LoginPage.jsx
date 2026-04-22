import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Eye, EyeOff } from 'lucide-react';

const roles = [
  { key: 'seller', label: 'Seller' },
  { key: 'buyer', label: 'Buyer' },
  { key: 'qc', label: 'QC Team' },
];

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('seller');
  const [showPw, setShowPw] = useState(false);
  const [keepSigned, setKeepSigned] = useState(false);
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
      {/* ─── Left Panel: Full-bleed hero image ─── */}
      <div className="login-left-panel" style={{
        flex: '0 0 48%', position: 'relative', overflow: 'hidden',
        background: 'var(--color-brand-forest)',
      }}>
        <video
          src="/login-hero.mp4"
          autoPlay
          muted
          loop
          playsInline
          style={{
            position: 'absolute', inset: 0,
            width: '100%', height: '100%',
            objectFit: 'cover', objectPosition: 'center',
          }}
        />
        {/* Subtle gradient overlay for depth */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(180deg, rgba(13,43,30,0.15) 0%, rgba(13,43,30,0.35) 100%)',
          pointerEvents: 'none',
        }} />
      </div>

      {/* ─── Right Panel: Login form ─── */}
      <div style={{
        flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '48px 40px', background: 'var(--color-brand-cream)',
        overflowY: 'auto',
      }}>
        <div style={{ width: '100%', maxWidth: 420 }}>

          {/* Brand mark */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 44 }}>
            <img src="/logo.png" alt="CircularX" style={{ height: 36 }} />
            <span style={{
              fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 700,
              color: 'var(--color-brand-forest)', letterSpacing: '0.14em',
            }}>
              CIRCULARX
            </span>
          </div>

          {/* Heading */}
          <h1 style={{
            fontFamily: 'var(--font-display)', fontSize: 32, fontWeight: 800,
            color: 'var(--color-brand-forest)', marginBottom: 8, letterSpacing: '-0.01em',
          }}>
            Welcome Back
          </h1>
          <p style={{
            fontSize: 14, color: 'var(--color-brand-slate)', marginBottom: 36, lineHeight: 1.5,
          }}>
            Enter your credentials to access the regenerative network.
          </p>

          <form onSubmit={handleSubmit} autoComplete="off">

            {/* ── Role selector ── */}
            <div style={{ marginBottom: 28 }}>
              <label style={labelStyle}>Role</label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
                {roles.map(r => {
                  const isActive = role === r.key;
                  return (
                    <button
                      key={r.key}
                      type="button"
                      onClick={() => setRole(r.key)}
                      style={{
                        padding: '11px 0',
                        borderRadius: 8,
                        cursor: 'pointer',
                        textAlign: 'center',
                        fontSize: 13,
                        fontWeight: 600,
                        fontFamily: 'var(--font-body)',
                        letterSpacing: '0.01em',
                        background: isActive ? 'var(--color-brand-forest)' : 'transparent',
                        color: isActive ? '#fff' : 'var(--color-brand-forest)',
                        border: isActive
                          ? '1.5px solid var(--color-brand-forest)'
                          : '1.5px solid rgba(13,43,30,0.2)',
                        transition: 'all 0.25s cubic-bezier(0.4,0,0.2,1)',
                        boxShadow: isActive ? '0 2px 8px rgba(13,43,30,0.18)' : 'none',
                      }}
                      onMouseEnter={e => {
                        if (!isActive) {
                          e.currentTarget.style.borderColor = 'var(--color-brand-forest)';
                          e.currentTarget.style.background = 'rgba(13,43,30,0.04)';
                        }
                      }}
                      onMouseLeave={e => {
                        if (!isActive) {
                          e.currentTarget.style.borderColor = 'rgba(13,43,30,0.2)';
                          e.currentTarget.style.background = 'transparent';
                        }
                      }}
                    >
                      {r.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* ── Email ── */}
            <div style={{ marginBottom: 20 }}>
              <label style={labelStyle}>Email</label>
              <div style={{ position: 'relative' }}>
                <input
                  id="login-email"
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  style={inputStyle}
                  onFocus={e => e.target.style.borderColor = 'var(--color-brand-mid)'}
                  onBlur={e => e.target.style.borderColor = 'rgba(0,0,0,0.12)'}
                />
                {/* Google SSO hint icon */}
                <div style={{
                  position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
                  width: 22, height: 22, borderRadius: '50%',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer',
                }}>
                  <svg width="18" height="18" viewBox="0 0 24 24">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                </div>
              </div>
            </div>

            {/* ── Password ── */}
            <div style={{ marginBottom: 22 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <label style={{ ...labelStyle, marginBottom: 0 }}>Password</label>
                <a href="#" style={{
                  fontSize: 12, color: 'var(--color-brand-mid)',
                  textDecoration: 'none', fontWeight: 500,
                }}
                  onMouseEnter={e => e.currentTarget.style.textDecoration = 'underline'}
                  onMouseLeave={e => e.currentTarget.style.textDecoration = 'none'}
                >
                  Forgot Password?
                </a>
              </div>
              <div style={{ position: 'relative' }}>
                <input
                  id="login-password"
                  type={showPw ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Password"
                  style={{ ...inputStyle, paddingRight: 44 }}
                  onFocus={e => e.target.style.borderColor = 'var(--color-brand-mid)'}
                  onBlur={e => e.target.style.borderColor = 'rgba(0,0,0,0.12)'}
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  style={{
                    position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
                    background: 'none', border: 'none', cursor: 'pointer',
                    color: 'var(--color-brand-slate)', padding: 2,
                    display: 'flex', alignItems: 'center',
                  }}
                >
                  {showPw ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
            </div>

            {/* ── Keep signed in ── */}
            <label style={{
              display: 'flex', alignItems: 'center', gap: 10, marginBottom: 28,
              cursor: 'pointer', fontSize: 13, color: 'var(--color-brand-forest)',
              userSelect: 'none',
            }}>
              <div
                onClick={() => setKeepSigned(!keepSigned)}
                style={{
                  width: 18, height: 18, borderRadius: 4, flexShrink: 0,
                  border: keepSigned ? 'none' : '1.5px solid rgba(13,43,30,0.25)',
                  background: keepSigned ? 'var(--color-brand-forest)' : '#fff',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transition: 'all 0.2s',
                }}
              >
                {keepSigned && (
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path d="M2.5 6L5 8.5L9.5 3.5" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )}
              </div>
              Keep me signed in
            </label>

            {/* ── Error ── */}
            {error && (
              <div style={{
                fontSize: 13, color: '#EF4444', marginBottom: 16,
                padding: '10px 14px', background: 'rgba(239,68,68,0.06)',
                borderRadius: 8, border: '1px solid rgba(239,68,68,0.12)',
              }}>
                {error}
              </div>
            )}

            {/* ── Submit ── */}
            <button
              id="login-submit"
              type="submit"
              disabled={loading}
              style={{
                width: '100%', padding: '15px 0',
                borderRadius: 50, border: 'none', cursor: 'pointer',
                background: loading
                  ? 'var(--color-brand-mid)'
                  : 'linear-gradient(135deg, var(--color-brand-forest) 0%, var(--color-brand-mid) 100%)',
                color: '#fff',
                fontSize: 14, fontWeight: 700, fontFamily: 'var(--font-body)',
                letterSpacing: '0.08em', textTransform: 'uppercase',
                transition: 'all 0.3s cubic-bezier(0.4,0,0.2,1)',
                boxShadow: '0 4px 16px rgba(13,43,30,0.25)',
                opacity: loading ? 0.75 : 1,
              }}
              onMouseEnter={e => {
                if (!loading) {
                  e.currentTarget.style.boxShadow = '0 6px 24px rgba(13,43,30,0.35)';
                  e.currentTarget.style.transform = 'translateY(-1px)';
                }
              }}
              onMouseLeave={e => {
                e.currentTarget.style.boxShadow = '0 4px 16px rgba(13,43,30,0.25)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              {loading ? 'Signing in…' : 'Sign In to Network'}
            </button>

            {/* ── Register link ── */}
            <p style={{
              textAlign: 'center', marginTop: 24,
              fontSize: 13, color: 'var(--color-brand-slate)',
            }}>
              New to the value chain?{' '}
              <Link to="/register" style={{
                color: 'var(--color-brand-forest)', fontWeight: 600,
                textDecoration: 'underline', textUnderlineOffset: 3,
              }}>
                Register Account
              </Link>
            </p>

            {/* ── API tooltip ── */}
            <div style={{ textAlign: 'center', marginTop: 14 }}>
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

/* ─── Shared inline styles ─── */
const labelStyle = {
  fontSize: 13,
  fontWeight: 600,
  color: 'var(--color-brand-forest)',
  display: 'block',
  marginBottom: 8,
};

const inputStyle = {
  width: '100%',
  padding: '13px 16px',
  borderRadius: 8,
  border: '1.5px solid rgba(0,0,0,0.12)',
  fontSize: 14,
  fontFamily: 'var(--font-body)',
  background: '#fff',
  color: 'var(--color-brand-forest)',
  outline: 'none',
  transition: 'border-color 0.2s, box-shadow 0.2s',
  boxSizing: 'border-box',
};
