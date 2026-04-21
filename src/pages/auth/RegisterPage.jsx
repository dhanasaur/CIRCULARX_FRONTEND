import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Factory, ShoppingCart, Users, ArrowRight, ArrowLeft, Check } from 'lucide-react';

const roleOptions = [
  { key: 'seller', label: 'Seller', desc: 'I generate industrial waste and want to list materials for sale.', icon: Factory },
  { key: 'buyer', label: 'Buyer', desc: 'I manufacture products and want to source recycled materials.', icon: ShoppingCart },
  { key: 'broker', label: 'Broker', desc: 'I facilitate material transactions between sellers and buyers.', icon: Users },
];

const sectors = ['Waste Management', 'Plastics Manufacturing', 'Metals & Mining', 'Chemical Processing', 'Textiles', 'Electronics', 'Construction', 'Paper & Packaging', 'Automotive', 'Other'];
const sizes = ['1-50', '51-200', '201-500', '501-1000', '1000+'];
const integrations = ['Edge Sensor API', 'ERP Connector (SAP)', 'ERP Connector (Oracle)', 'ERP Connector (Dynamics)', 'Manual Entry Only'];
const categories = ['Plastics', 'Metals', 'Paper & Cellulose', 'Glass', 'Rubber', 'Textiles', 'E-Waste', 'Chemical Waste', 'Industrial Minerals', 'Construction Waste'];

export default function RegisterPage() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ role: 'seller', companyName: '', gstin: '', sector: '', location: '', size: '', integration: '', eprNumber: '', hazLicence: '', categories: [] });
  const { register } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const update = (key, val) => setForm(f => ({ ...f, [key]: val }));
  const toggleCat = (cat) => setForm(f => ({ ...f, categories: f.categories.includes(cat) ? f.categories.filter(c => c !== cat) : [...f.categories, cat] }));

  const handleSubmit = async () => {
    setLoading(true);
    await register(form);
    const role = form.role === 'broker' ? 'seller' : form.role;
    navigate(`/${role}/dashboard`);
  };

  const inputStyle = { width: '100%', padding: '12px 14px', borderRadius: 'var(--radius-btn)', border: '1.5px solid rgba(0,0,0,0.1)', fontSize: 14, fontFamily: 'var(--font-body)', background: '#fff', outline: 'none', boxSizing: 'border-box' };
  const labelStyle = { fontSize: 12, fontWeight: 600, color: 'var(--color-brand-forest)', display: 'block', marginBottom: 6 };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-brand-cream)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '80px 24px 48px' }}>
      <div style={{ width: '100%', maxWidth: 560 }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, textDecoration: 'none' }}>
            <img src="/logo.png" alt="CIRCULARX" style={{ height: 32 }} />
            <span style={{ fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 800, color: 'var(--color-brand-forest)' }}>CIRCULAR<span style={{ color: 'var(--color-brand-lime-dim)' }}>X</span></span>
          </Link>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 28, color: 'var(--color-brand-forest)', marginTop: 16, marginBottom: 8 }}>Create Account</h1>
          <p style={{ fontSize: 14, color: 'var(--color-brand-slate)' }}>Join the circular economy marketplace</p>
        </div>

        {/* Progress dots */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginBottom: 32 }}>
          {[1, 2, 3, 4].map(s => (
            <div key={s} style={{ width: s <= step ? 32 : 8, height: 8, borderRadius: 4, background: s <= step ? 'var(--color-brand-forest)' : 'rgba(0,0,0,0.1)', transition: 'all 0.3s' }} />
          ))}
        </div>

        <div className="glass-card-light" style={{ padding: 36 }}>
          {/* Step 1: Role */}
          {step === 1 && (
            <div>
              <h2 style={{ fontSize: 18, fontFamily: 'var(--font-display)', color: 'var(--color-brand-forest)', marginBottom: 20 }}>Select Your Role</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {roleOptions.map(r => {
                  const Icon = r.icon;
                  const active = form.role === r.key;
                  return (
                    <button key={r.key} type="button" onClick={() => update('role', r.key)} style={{
                      display: 'flex', alignItems: 'center', gap: 16, padding: 20, borderRadius: 'var(--radius-card)', cursor: 'pointer', textAlign: 'left',
                      background: active ? 'var(--color-brand-forest)' : '#fff', color: active ? '#fff' : 'var(--color-brand-forest)',
                      border: `1.5px solid ${active ? 'var(--color-brand-forest)' : 'rgba(0,0,0,0.08)'}`, transition: 'all 0.2s',
                    }}>
                      <Icon size={24} style={{ color: active ? '#B8F53C' : 'var(--color-brand-slate)', flexShrink: 0 }} />
                      <div>
                        <div style={{ fontSize: 15, fontWeight: 600 }}>{r.label}</div>
                        <div style={{ fontSize: 13, opacity: 0.6, marginTop: 2 }}>{r.desc}</div>
                      </div>
                      {active && <Check size={20} style={{ marginLeft: 'auto', color: '#B8F53C' }} />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Step 2: Organisation */}
          {step === 2 && (
            <div>
              <h2 style={{ fontSize: 18, fontFamily: 'var(--font-display)', color: 'var(--color-brand-forest)', marginBottom: 20 }}>Organisation Details</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div><label style={labelStyle}>Company Name</label><input style={inputStyle} value={form.companyName} onChange={e => update('companyName', e.target.value)} placeholder="Acme Recyclers Pvt. Ltd." /></div>
                <div><label style={labelStyle}>GSTIN / VAT Number</label><input style={inputStyle} value={form.gstin} onChange={e => update('gstin', e.target.value)} placeholder="29AABCU9603R1ZM" /></div>
                <div><label style={labelStyle}>Industry Sector</label><select style={inputStyle} value={form.sector} onChange={e => update('sector', e.target.value)}><option value="">Select sector</option>{sectors.map(s => <option key={s} value={s}>{s}</option>)}</select></div>
                <div><label style={labelStyle}>Location</label><input style={inputStyle} value={form.location} onChange={e => update('location', e.target.value)} placeholder="Bengaluru, India" /></div>
                <div><label style={labelStyle}>Organisation Size</label><select style={inputStyle} value={form.size} onChange={e => update('size', e.target.value)}><option value="">Select size</option>{sizes.map(s => <option key={s} value={s}>{s} employees</option>)}</select></div>
              </div>
            </div>
          )}

          {/* Step 3: Integration */}
          {step === 3 && (
            <div>
              <h2 style={{ fontSize: 18, fontFamily: 'var(--font-display)', color: 'var(--color-brand-forest)', marginBottom: 20 }}>Integration Setup</h2>
              <p style={{ fontSize: 13, color: 'var(--color-brand-slate)', marginBottom: 16 }}>How will you submit material data to CIRCULARX?</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {integrations.map(ig => (
                  <button key={ig} type="button" onClick={() => update('integration', ig)} style={{
                    padding: '14px 16px', borderRadius: 'var(--radius-btn)', cursor: 'pointer', textAlign: 'left', fontSize: 14,
                    background: form.integration === ig ? 'var(--color-brand-forest)' : '#fff', color: form.integration === ig ? '#fff' : 'var(--color-brand-forest)',
                    border: `1.5px solid ${form.integration === ig ? 'var(--color-brand-forest)' : 'rgba(0,0,0,0.08)'}`,
                    fontFamily: 'var(--font-body)', fontWeight: 500, transition: 'all 0.2s',
                  }}>{ig}</button>
                ))}
              </div>
            </div>
          )}

          {/* Step 4: Compliance */}
          {step === 4 && (
            <div>
              <h2 style={{ fontSize: 18, fontFamily: 'var(--font-display)', color: 'var(--color-brand-forest)', marginBottom: 20 }}>Compliance Profile</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div><label style={labelStyle}>EPR Registration Number (optional)</label><input style={inputStyle} value={form.eprNumber} onChange={e => update('eprNumber', e.target.value)} placeholder="EPR/P/HQ/2024/00123" /></div>
                <div><label style={labelStyle}>Hazardous Waste Licence (if applicable)</label><input style={inputStyle} value={form.hazLicence} onChange={e => update('hazLicence', e.target.value)} placeholder="HWM/KA/2024/0456" /></div>
                <div>
                  <label style={labelStyle}>Preferred Material Categories</label>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                    {categories.map(cat => (
                      <button key={cat} type="button" onClick={() => toggleCat(cat)} style={{
                        padding: '6px 14px', borderRadius: 16, fontSize: 12, fontWeight: 500, cursor: 'pointer',
                        background: form.categories.includes(cat) ? 'var(--color-brand-forest)' : 'rgba(0,0,0,0.04)',
                        color: form.categories.includes(cat) ? '#B8F53C' : 'var(--color-brand-slate)',
                        border: `1px solid ${form.categories.includes(cat) ? 'var(--color-brand-forest)' : 'rgba(0,0,0,0.08)'}`,
                        fontFamily: 'var(--font-body)', transition: 'all 0.2s',
                      }}>{cat}</button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 28, gap: 12 }}>
            {step > 1 ? (
              <button onClick={() => setStep(s => s - 1)} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '12px 20px', borderRadius: 'var(--radius-btn)', border: '1.5px solid rgba(0,0,0,0.1)', background: 'transparent', cursor: 'pointer', fontSize: 14, fontWeight: 500, color: 'var(--color-brand-forest)', fontFamily: 'var(--font-body)' }}>
                <ArrowLeft size={16} /> Back
              </button>
            ) : <div />}
            {step < 4 ? (
              <button onClick={() => setStep(s => s + 1)} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '12px 24px', borderRadius: 'var(--radius-btn)', border: 'none', background: 'var(--color-brand-forest)', cursor: 'pointer', fontSize: 14, fontWeight: 600, color: '#fff', fontFamily: 'var(--font-body)' }}>
                Next <ArrowRight size={16} />
              </button>
            ) : (
              <button onClick={handleSubmit} disabled={loading} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '12px 24px', borderRadius: 'var(--radius-btn)', border: 'none', background: '#B8F53C', cursor: 'pointer', fontSize: 14, fontWeight: 700, color: 'var(--color-brand-dark)', fontFamily: 'var(--font-body)', opacity: loading ? 0.7 : 1 }}>
                {loading ? 'Creating account...' : 'Create Account'} <ArrowRight size={16} />
              </button>
            )}
          </div>
        </div>

        <p style={{ textAlign: 'center', marginTop: 20, fontSize: 13, color: 'var(--color-brand-slate)' }}>
          Already have an account? <Link to="/login" style={{ color: 'var(--color-brand-mid)', fontWeight: 600, textDecoration: 'none' }}>Sign In</Link>
        </p>
        <div style={{ textAlign: 'center', marginTop: 8 }}><span className="api-tooltip">POST /auth/register</span></div>
      </div>
    </div>
  );
}
