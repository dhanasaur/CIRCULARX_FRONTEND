import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard, Package, Upload, ArrowRightLeft, ShieldCheck, BarChart3,
  Settings, LogOut, Bell, ChevronLeft, ChevronRight, ShoppingCart, Search,
  ClipboardCheck, AlertTriangle, Eye, Menu
} from 'lucide-react';

const sidebarConfigs = {
  seller: {
    title: 'Seller',
    basePath: '/seller',
    links: [
      { to: '/seller/dashboard', icon: LayoutDashboard, label: 'Overview' },
      { to: '/seller/listings', icon: Package, label: 'My Listings' },
      { to: '/seller/submit', icon: Upload, label: 'Submit Material' },
      { to: '/seller/transactions', icon: ArrowRightLeft, label: 'Transactions' },
      { to: '/seller/compliance', icon: ShieldCheck, label: 'Compliance Vault' },
      { to: '/seller/analytics', icon: BarChart3, label: 'Analytics' },
      { to: '/seller/settings', icon: Settings, label: 'Settings' },
    ],
  },
  buyer: {
    title: 'Buyer',
    basePath: '/buyer',
    links: [
      { to: '/buyer/dashboard', icon: LayoutDashboard, label: 'Overview' },
      { to: '/buyer/marketplace', icon: Search, label: 'Browse Marketplace' },
      { to: '/buyer/requests', icon: ShoppingCart, label: 'My Requests' },
      { to: '/buyer/transactions', icon: ArrowRightLeft, label: 'Transactions' },
      { to: '/buyer/scope3', icon: BarChart3, label: 'Scope 3 Tracker' },
      { to: '/buyer/analytics', icon: BarChart3, label: 'Analytics' },
      { to: '/buyer/settings', icon: Settings, label: 'Settings' },
    ],
  },
  qc: {
    title: 'QC Team',
    basePath: '/qc',
    links: [
      { to: '/qc/dashboard', icon: LayoutDashboard, label: 'Overview' },
      { to: '/qc/inspections', icon: ClipboardCheck, label: 'Inspection Queue' },
      { to: '/qc/disputes', icon: AlertTriangle, label: 'Dispute Cases' },
      { to: '/qc/transactions', icon: Eye, label: 'All Transactions' },
      { to: '/qc/settings', icon: Settings, label: 'Settings' },
    ],
  },
};

export default function DashboardLayout({ role }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const config = sidebarConfigs[role];

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const sidebarWidth = collapsed ? 64 : 240;
  const bgColor = 'var(--color-brand-dark)';
  const sidebarBg = 'rgba(255,255,255,0.02)';

  return (
    <div className="dashboard-bg" style={{ display: 'flex', minHeight: '100vh', color: '#fff' }}>
      {/* Mobile overlay */}
      {mobileOpen && <div onClick={() => setMobileOpen(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 40 }} />}

      {/* Sidebar */}
      <aside style={{
        position: 'fixed', top: 0, left: 0, bottom: 0, width: sidebarWidth, zIndex: 50,
        background: sidebarBg, borderRight: '1px solid rgba(255,255,255,0.06)',
        transition: 'width 0.3s ease, transform 0.3s ease',
        display: 'flex', flexDirection: 'column', overflow: 'hidden',
        transform: mobileOpen ? 'translateX(0)' : undefined,
      }} className={`sidebar-container ${mobileOpen ? 'mobile-open' : ''}`}>
        {/* Logo */}
        <div style={{ padding: collapsed ? '20px 12px' : '20px 20px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <Link to="/" style={{ fontFamily: 'var(--font-display)', fontSize: collapsed ? 16 : 18, fontWeight: 800, color: '#fff', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 8 }}>
            <img src="/logo.png" alt="CX" style={{ height: collapsed ? 22 : 26, flexShrink: 0 }} />
            {!collapsed && <>CIRCULAR<span style={{ color: 'var(--color-brand-lime)' }}>X</span></>}
          </Link>
          {!collapsed && <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', fontFamily: 'var(--font-mono)', marginTop: 4, textTransform: 'uppercase', letterSpacing: '0.1em' }}>{config.title} Dashboard</div>}
        </div>

        {/* Nav links */}
        <nav style={{ flex: 1, padding: '12px 8px', display: 'flex', flexDirection: 'column', gap: 2, overflowY: 'auto' }} className="dark-scrollbar">
          {config.links.map(link => {
            const Icon = link.icon;
            const isActive = pathname === link.to || (link.to !== config.basePath + '/dashboard' && pathname.startsWith(link.to));
            return (
              <Link key={link.to} to={link.to} onClick={() => setMobileOpen(false)} className={`sidebar-link ${isActive ? 'active' : ''}`}
                style={collapsed ? { justifyContent: 'center', padding: '12px' } : {}}>
                <Icon size={18} style={{ flexShrink: 0 }} />
                <span style={{ opacity: collapsed ? 0 : 1, transition: 'opacity 0.2s ease', width: collapsed ? 0 : 'auto', overflow: 'hidden' }}>{link.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Bottom */}
        <div style={{ padding: '12px 8px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          <button onClick={() => setCollapsed(!collapsed)} className="sidebar-link" style={{ width: '100%', background: 'none', border: 'none', cursor: 'pointer', justifyContent: collapsed ? 'center' : 'flex-start', padding: collapsed ? '12px' : '10px 16px' }}>
            {collapsed ? <ChevronRight size={18} style={{ flexShrink: 0 }} /> : <ChevronLeft size={18} style={{ flexShrink: 0 }} />}
            <span style={{ opacity: collapsed ? 0 : 1, transition: 'opacity 0.2s ease', width: collapsed ? 0 : 'auto', overflow: 'hidden' }}>Collapse</span>
          </button>
          <button onClick={handleLogout} className="sidebar-link" style={{ width: '100%', background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.4)', justifyContent: collapsed ? 'center' : 'flex-start', padding: collapsed ? '12px' : '10px 16px' }}>
            <LogOut size={18} style={{ flexShrink: 0 }} />
            <span style={{ opacity: collapsed ? 0 : 1, transition: 'opacity 0.2s ease', width: collapsed ? 0 : 'auto', overflow: 'hidden' }}>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Spacer for fixed sidebar */}
      <div style={{ width: sidebarWidth, flexShrink: 0, transition: 'width 0.3s ease' }} className="sidebar-spacer" />

      {/* Main content */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }} className="main-content-area">
        {/* Topbar */}
        <header style={{
          height: 56, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '0 24px', borderBottom: '1px solid rgba(255,255,255,0.06)',
          background: 'rgba(255,255,255,0.02)', position: 'sticky', top: 0, zIndex: 30,
          backdropFilter: 'blur(8px)',
        }}>
          <button onClick={() => setMobileOpen(!mobileOpen)} style={{ display: 'none', background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }} className="mobile-menu-btn">
            <Menu size={20} />
          </button>
          <div />
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <button style={{ position: 'relative', background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)', cursor: 'pointer' }}>
              <Bell size={18} />
              <span style={{ position: 'absolute', top: -2, right: -2, width: 8, height: 8, borderRadius: '50%', background: 'var(--color-brand-lime)' }} />
            </button>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--color-brand-mid)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 600, color: '#fff' }}>
                {user?.name?.charAt(0) || role?.charAt(0)?.toUpperCase()}
              </div>
              <div style={{ lineHeight: 1.2 }} className="user-info-desktop">
                <div style={{ fontSize: 13, fontWeight: 500, color: '#fff' }}>{user?.name || 'User'}</div>
                <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.35)', fontFamily: 'var(--font-mono)' }}>{user?.company || role?.toUpperCase()}</div>
              </div>
            </div>
          </div>
        </header>

        <main style={{ flex: 1, padding: 24, maxWidth: 1400, width: '100%', margin: '0 auto' }} className="dark-scrollbar">
          <Outlet />
        </main>
      </div>

      <style>{`
        @media (max-width: 1024px) {
          .sidebar-container { transform: translateX(-100%); width: 240px !important; }
          .sidebar-container.mobile-open { transform: translateX(0) !important; }
          .sidebar-spacer { display: none; }
          .main-content-area { margin-left: 0 !important; }
          .mobile-menu-btn { display: block !important; }
          .user-info-desktop { display: none; }
        }
      `}</style>
    </div>
  );
}
