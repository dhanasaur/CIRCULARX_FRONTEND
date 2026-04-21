import { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Bell, Shield, SlidersHorizontal, Save, Check, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const fadeUp = { hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0 } };

const tabs = [
  { key: 'profile', label: 'Profile', icon: User },
  { key: 'notifications', label: 'Notifications', icon: Bell },
  { key: 'security', label: 'Security', icon: Shield },
  { key: 'preferences', label: 'Preferences', icon: SlidersHorizontal },
];

const roleProfiles = {
  seller: { name: 'Rajesh Menon', company: 'GreenTech Recyclers Pvt. Ltd.', email: 'ops@greentech.in', phone: '+91 98765 43210', gstin: '29AABCU9603R1ZM', pan: 'AABCU9603R', regNo: 'U37100KA2019PTC123456', address: 'Plot 42, KIADB Industrial Area,\nPeenya Phase 2, Bengaluru 560058' },
  buyer: { name: 'Ananya Sharma', company: 'EcoPlast Manufacturing Ltd.', email: 'ananya@ecoplast.com', phone: '+91 87654 32109', gstin: '27AADCE1234F1Z5', pan: 'AADCE1234F', regNo: 'U25200MH2018PTC234567', address: '18/B, MIDC Taloja,\nNavi Mumbai 410208' },
  qc: { name: 'Vikram Patel', company: 'CIRCULARX Quality Division', email: 'vikram@circularx.com', phone: '+91 76543 21098', inspectorId: 'QCI-0042', badge: 'QC-INS-0042', region: 'South India' },
};

export default function SettingsPage({ role }) {
  const [tab, setTab] = useState('profile');
  const [toast, setToast] = useState('');
  const profile = roleProfiles[role] || roleProfiles.seller;
  const [form, setForm] = useState({ ...profile });
  const [notifs, setNotifs] = useState({ matchAlerts: true, zopaProposals: true, qarResults: true, expiryReminders: true, weeklyDigest: false, eprGeneration: true });
  const [pwForm, setPwForm] = useState({ current: '', newPw: '', confirm: '' });
  const [twoFA, setTwoFA] = useState(false);
  const [prefs, setPrefs] = useState({ currency: 'USD', priceUnit: 'tonne', timezone: 'IST', listingDuration: 30 });

  const save = (msg) => { setToast(msg); setTimeout(() => setToast(''), 3000); };
  const inputStyle = { width: '100%', padding: '10px 14px', borderRadius: 8, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: '#fff', fontSize: 13, fontFamily: 'var(--font-body)', outline: 'none', boxSizing: 'border-box' };
  const labelStyle = { fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.4)', display: 'block', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' };

  return (
    <motion.div initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.06 } } }}>
      <motion.h1 variants={fadeUp} style={{ fontFamily: 'var(--font-display)', fontSize: 26, fontWeight: 800, color: '#fff', marginBottom: 24, letterSpacing: '-0.02em' }}>Settings</motion.h1>

      {toast && <div style={{ position: 'fixed', top: 24, right: 24, zIndex: 200, padding: '12px 20px', borderRadius: 10, background: '#B8F53C', color: '#0D2B1E', fontSize: 13, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 8, boxShadow: '0 8px 30px rgba(184,245,60,0.3)' }}><Check size={14} /> {toast}</div>}

      <div style={{ display: 'flex', gap: 24 }} className="settings-layout">
        {/* Tab Nav */}
        <div style={{ width: 200, flexShrink: 0, display: 'flex', flexDirection: 'column', gap: 4 }}>
          {tabs.map(t => { const Icon = t.icon; return (
            <button key={t.key} onClick={() => setTab(t.key)} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', borderRadius: 8, background: tab === t.key ? 'rgba(184,245,60,0.08)' : 'transparent', color: tab === t.key ? '#B8F53C' : 'rgba(255,255,255,0.4)', border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 500, fontFamily: 'var(--font-body)', transition: 'all 0.15s', width: '100%', textAlign: 'left', borderLeft: tab === t.key ? '2px solid #B8F53C' : '2px solid transparent' }}>
              <Icon size={16} /> {t.label}
            </button>
          ); })}
        </div>

        {/* Content */}
        <div style={{ flex: 1, padding: 28, borderRadius: 14, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
          {tab === 'profile' && (
            <div>
              <h2 style={{ fontSize: 16, fontFamily: 'var(--font-display)', color: '#fff', marginBottom: 24 }}>Profile Information</h2>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 28 }}>
                <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'var(--color-brand-mid)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, fontWeight: 700, color: '#fff' }}>{form.name?.charAt(0)}</div>
                <div><div style={{ fontSize: 15, fontWeight: 600, color: '#fff' }}>{form.name}</div><div style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)' }}>{form.company}</div></div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div><label style={labelStyle}>Full Name</label><input style={inputStyle} value={form.name} onChange={e => setForm(f => ({...f, name: e.target.value}))} /></div>
                <div><label style={labelStyle}>Company</label><input style={inputStyle} value={form.company} onChange={e => setForm(f => ({...f, company: e.target.value}))} /></div>
                <div><label style={labelStyle}>Email</label><input style={inputStyle} value={form.email} onChange={e => setForm(f => ({...f, email: e.target.value}))} /></div>
                <div><label style={labelStyle}>Phone</label><input style={inputStyle} value={form.phone} onChange={e => setForm(f => ({...f, phone: e.target.value}))} /></div>
                {form.gstin && <div><label style={labelStyle}>GSTIN</label><input style={inputStyle} value={form.gstin} readOnly style={{...inputStyle, opacity: 0.6}} /></div>}
                {form.inspectorId && <div><label style={labelStyle}>Inspector ID</label><input style={{...inputStyle, opacity: 0.6}} value={form.inspectorId} readOnly /></div>}
              </div>
              {form.address && <div style={{ marginTop: 16 }}><label style={labelStyle}>Business Address</label><textarea style={{...inputStyle, height: 80, resize: 'none'}} value={form.address} onChange={e => setForm(f => ({...f, address: e.target.value}))} /></div>}
              <button onClick={() => save('Profile updated successfully')} style={{ marginTop: 24, padding: '10px 24px', borderRadius: 8, background: '#B8F53C', color: '#0D2B1E', border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 700, fontFamily: 'var(--font-body)', display: 'flex', alignItems: 'center', gap: 6 }}><Save size={14} /> Save Changes</button>
            </div>
          )}

          {tab === 'notifications' && (
            <div>
              <h2 style={{ fontSize: 16, fontFamily: 'var(--font-display)', color: '#fff', marginBottom: 24 }}>Notification Preferences</h2>
              {Object.entries({ matchAlerts: 'New buyer/seller match alerts', zopaProposals: 'ZOPA price proposals', qarResults: 'QAR inspection results', expiryReminders: 'Listing expiry reminders (7 days)', weeklyDigest: 'Weekly analytics digest', eprGeneration: 'EPR certificate generation' }).map(([key, label]) => (
                <div key={key} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                  <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.65)' }}>{label}</span>
                  <button onClick={() => setNotifs(n => ({...n, [key]: !n[key]}))} style={{ width: 44, height: 24, borderRadius: 12, border: 'none', cursor: 'pointer', background: notifs[key] ? '#B8F53C' : 'rgba(255,255,255,0.1)', position: 'relative', transition: 'background 0.2s' }}>
                    <span style={{ position: 'absolute', top: 2, left: notifs[key] ? 22 : 2, width: 20, height: 20, borderRadius: '50%', background: notifs[key] ? '#0D2B1E' : 'rgba(255,255,255,0.4)', transition: 'left 0.2s' }} />
                  </button>
                </div>
              ))}
              <button onClick={() => save('Notification preferences saved')} style={{ marginTop: 24, padding: '10px 24px', borderRadius: 8, background: '#B8F53C', color: '#0D2B1E', border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 700, fontFamily: 'var(--font-body)' }}>Save Preferences</button>
            </div>
          )}

          {tab === 'security' && (
            <div>
              <h2 style={{ fontSize: 16, fontFamily: 'var(--font-display)', color: '#fff', marginBottom: 24 }}>Security Settings</h2>
              <h3 style={{ fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,0.5)', marginBottom: 16 }}>Change Password</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 400 }}>
                <div><label style={labelStyle}>Current Password</label><input type="password" style={inputStyle} value={pwForm.current} onChange={e => setPwForm(f => ({...f, current: e.target.value}))} /></div>
                <div><label style={labelStyle}>New Password</label><input type="password" style={inputStyle} value={pwForm.newPw} onChange={e => setPwForm(f => ({...f, newPw: e.target.value}))} /></div>
                <div><label style={labelStyle}>Confirm New Password</label><input type="password" style={inputStyle} value={pwForm.confirm} onChange={e => setPwForm(f => ({...f, confirm: e.target.value}))} /></div>
                <button onClick={() => { if (pwForm.newPw !== pwForm.confirm) { save('Passwords do not match'); return; } save('Password updated'); setPwForm({ current: '', newPw: '', confirm: '' }); }} style={{ padding: '10px 24px', borderRadius: 8, background: '#B8F53C', color: '#0D2B1E', border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 700, fontFamily: 'var(--font-body)', alignSelf: 'flex-start' }}>Update Password</button>
              </div>
              <div style={{ marginTop: 32, padding: 20, borderRadius: 12, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <span style={{ fontSize: 14, fontWeight: 600, color: '#fff' }}>Two-Factor Authentication</span>
                  <span style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: twoFA ? '#B8F53C' : '#F59E0B', fontWeight: 600 }}>{twoFA ? 'ENABLED' : 'DISABLED'}</span>
                </div>
                <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)', margin: 0 }}>{twoFA ? '2FA is active on your account.' : 'Enable 2FA for additional account security.'}</p>
                <button onClick={() => { setTwoFA(!twoFA); save(twoFA ? '2FA disabled' : '2FA enabled'); }} style={{ marginTop: 12, padding: '8px 16px', borderRadius: 6, background: 'rgba(255,255,255,0.04)', color: twoFA ? '#EF4444' : '#B8F53C', border: `1px solid ${twoFA ? 'rgba(239,68,68,0.2)' : 'rgba(184,245,60,0.2)'}`, cursor: 'pointer', fontSize: 12, fontWeight: 600, fontFamily: 'var(--font-body)' }}>{twoFA ? 'Disable 2FA' : 'Enable 2FA'}</button>
              </div>
              <div style={{ marginTop: 24 }}>
                <h3 style={{ fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,0.5)', marginBottom: 12 }}>Active Sessions</h3>
                {[{ device: 'Chrome on Windows', loc: 'Bengaluru, IN', time: 'Now', current: true }, { device: 'Safari on iPhone', loc: 'Mumbai, IN', time: '2d ago', current: false }].map((s, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                    <div><div style={{ fontSize: 13, color: '#fff' }}>{s.device} {s.current && <span style={{ fontSize: 9, padding: '2px 6px', borderRadius: 4, background: 'rgba(184,245,60,0.1)', color: '#B8F53C', marginLeft: 6 }}>CURRENT</span>}</div><div style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', fontFamily: 'var(--font-mono)' }}>{s.loc} · {s.time}</div></div>
                    {!s.current && <button onClick={() => save('Session revoked')} style={{ padding: '4px 12px', borderRadius: 4, background: 'rgba(239,68,68,0.08)', color: '#FB7185', border: '1px solid rgba(239,68,68,0.15)', cursor: 'pointer', fontSize: 11, fontWeight: 600, fontFamily: 'var(--font-body)' }}>Revoke</button>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {tab === 'preferences' && (
            <div>
              <h2 style={{ fontSize: 16, fontFamily: 'var(--font-display)', color: '#fff', marginBottom: 24 }}>Preferences</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                <div><label style={labelStyle}>Default Currency</label>
                  <div style={{ display: 'flex', gap: 8 }}>{['USD', 'INR', 'EUR'].map(c => (
                    <button key={c} onClick={() => setPrefs(p => ({...p, currency: c}))} style={{ padding: '8px 20px', borderRadius: 6, background: prefs.currency === c ? 'rgba(184,245,60,0.1)' : 'rgba(255,255,255,0.03)', color: prefs.currency === c ? '#B8F53C' : 'rgba(255,255,255,0.4)', border: `1px solid ${prefs.currency === c ? 'rgba(184,245,60,0.2)' : 'rgba(255,255,255,0.06)'}`, cursor: 'pointer', fontSize: 12, fontWeight: 600, fontFamily: 'var(--font-mono)' }}>{c}</button>
                  ))}</div>
                </div>
                <div><label style={labelStyle}>Price Display</label>
                  <div style={{ display: 'flex', gap: 8 }}>{[['tonne', 'Per Tonne'], ['kg', 'Per Kg']].map(([v, l]) => (
                    <button key={v} onClick={() => setPrefs(p => ({...p, priceUnit: v}))} style={{ padding: '8px 20px', borderRadius: 6, background: prefs.priceUnit === v ? 'rgba(184,245,60,0.1)' : 'rgba(255,255,255,0.03)', color: prefs.priceUnit === v ? '#B8F53C' : 'rgba(255,255,255,0.4)', border: `1px solid ${prefs.priceUnit === v ? 'rgba(184,245,60,0.2)' : 'rgba(255,255,255,0.06)'}`, cursor: 'pointer', fontSize: 12, fontWeight: 600, fontFamily: 'var(--font-body)' }}>{l}</button>
                  ))}</div>
                </div>
                {role === 'seller' && <div><label style={labelStyle}>Default Listing Duration</label>
                  <div style={{ display: 'flex', gap: 8 }}>{[30, 60, 90].map(d => (
                    <button key={d} onClick={() => setPrefs(p => ({...p, listingDuration: d}))} style={{ padding: '8px 20px', borderRadius: 6, background: prefs.listingDuration === d ? 'rgba(184,245,60,0.1)' : 'rgba(255,255,255,0.03)', color: prefs.listingDuration === d ? '#B8F53C' : 'rgba(255,255,255,0.4)', border: `1px solid ${prefs.listingDuration === d ? 'rgba(184,245,60,0.2)' : 'rgba(255,255,255,0.06)'}`, cursor: 'pointer', fontSize: 12, fontWeight: 600, fontFamily: 'var(--font-mono)' }}>{d} days</button>
                  ))}</div>
                </div>}
                <div><label style={labelStyle}>Timezone</label><input style={{...inputStyle, maxWidth: 300}} value="IST (UTC+5:30)" readOnly /></div>
                <div><label style={labelStyle}>Language</label><input style={{...inputStyle, maxWidth: 300}} value="English" readOnly /></div>
              </div>
              <button onClick={() => save('Preferences saved')} style={{ marginTop: 24, padding: '10px 24px', borderRadius: 8, background: '#B8F53C', color: '#0D2B1E', border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 700, fontFamily: 'var(--font-body)' }}>Save Preferences</button>
            </div>
          )}
        </div>
      </div>
      <style>{`@media (max-width: 768px) { .settings-layout { flex-direction: column !important; } }`}</style>
    </motion.div>
  );
}
