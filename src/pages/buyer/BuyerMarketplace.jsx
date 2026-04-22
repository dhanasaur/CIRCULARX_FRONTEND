import { useState } from 'react';
import { motion } from 'framer-motion';
import MaterialCard from '../../components/ui/MaterialCard';
import { listings } from '../../mock/listings';
import { Filter, Grid3X3, List, Search, SlidersHorizontal, X } from 'lucide-react';

const fadeUp = { hidden: { opacity: 0, y: 18 }, visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } } };

const categories = ['All', 'Plastics', 'Metals', 'Paper & Cellulose', 'Glass', 'Rubber', 'E-Waste', 'Chemical Waste', 'Industrial Minerals', 'Textiles'];
const sortOptions = [{ value: 'mqs', label: 'MQS Score' }, { value: 'price', label: 'Price' }, { value: 'expiry', label: 'Expiry Date' }, { value: 'newest', label: 'Newest' }];

export default function BuyerMarketplace() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [mqsRange, setMqsRange] = useState([0, 100]);
  const [sortBy, setSortBy] = useState('mqs');
  const [viewMode, setViewMode] = useState('grid');
  const [showFilters, setShowFilters] = useState(true);
  const [thresholdModal, setThresholdModal] = useState({ isOpen: false, listing: null, maxPrice: '' });

  const filtered = listings
    .filter(l => l.status !== 'BLOCKED' && l.status !== 'COMPLETED')
    .filter(l => category === 'All' || l.category === category)
    .filter(l => l.mqsScore >= mqsRange[0] && l.mqsScore <= mqsRange[1])
    .filter(l => !search || l.materialName.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      if (sortBy === 'mqs') return b.mqsScore - a.mqsScore;
      if (sortBy === 'price') return a.floorPrice - b.floorPrice;
      if (sortBy === 'expiry') return new Date(a.expiryDate) - new Date(b.expiryDate);
      return new Date(b.listedDate) - new Date(a.listedDate);
    });

  return (
    <motion.div initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.06 } } }}>
      <motion.div variants={fadeUp} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 className="dash-h1" style={{ marginBottom: 4 }}>Browse Marketplace</h1>
          <p className="dash-subtitle">{filtered.length} materials available</p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={() => setShowFilters(!showFilters)} className="btn-secondary" style={{ gap: 6 }}>
            <SlidersHorizontal size={14} /> {showFilters ? 'Hide' : 'Show'} Filters
          </button>
          <button onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')} className="btn-secondary" style={{ padding: '8px 12px' }}>
            {viewMode === 'grid' ? <List size={16} /> : <Grid3X3 size={16} />}
          </button>
        </div>
      </motion.div>

      <div style={{ display: 'flex', gap: 20 }}>
        {/* ── Filters sidebar ── */}
        {showFilters && (
          <motion.div
            variants={fadeUp}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="glass-card"
            style={{ width: 240, padding: 20, flexShrink: 0, height: 'fit-content', position: 'sticky', top: 80 }}
          >
            {/* Search */}
            <div style={{ marginBottom: 20 }}>
              <label className="dash-label">Search</label>
              <div style={{ position: 'relative' }}>
                <Search size={14} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.3)' }} />
                <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Material name..."
                  className="dash-input" style={{ paddingLeft: 30 }} />
              </div>
            </div>

            {/* Category */}
            <div style={{ marginBottom: 20 }}>
              <label className="dash-label">Category</label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                {categories.map(cat => (
                  <button key={cat} onClick={() => setCategory(cat)} style={{
                    padding: '7px 10px', borderRadius: 6, border: 'none', cursor: 'pointer', textAlign: 'left', fontSize: 12,
                    background: category === cat ? 'rgba(184,245,60,0.1)' : 'transparent',
                    color: category === cat ? '#B8F53C' : 'rgba(255,255,255,0.5)',
                    fontFamily: 'var(--font-body)', fontWeight: category === cat ? 700 : 400,
                    transition: 'all 0.15s', borderLeft: category === cat ? '2px solid #B8F53C' : '2px solid transparent',
                  }}>{cat}</button>
                ))}
              </div>
            </div>

            {/* MQS Range */}
            <div style={{ marginBottom: 20 }}>
              <label className="dash-label">
                MQS Range: <span style={{ color: '#B8F53C', fontWeight: 700 }}>{mqsRange[0]}-{mqsRange[1]}</span>
              </label>
              <input type="range" min={0} max={100} value={mqsRange[0]} onChange={e => setMqsRange([+e.target.value, mqsRange[1]])} style={{ width: '100%', accentColor: '#B8F53C' }} />
            </div>

            {/* Sort */}
            <div>
              <label className="dash-label">Sort By</label>
              <select value={sortBy} onChange={e => setSortBy(e.target.value)} className="dash-select">
                {sortOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>

            {/* Active filter count */}
            {(category !== 'All' || search || mqsRange[0] > 0) && (
              <button onClick={() => { setCategory('All'); setSearch(''); setMqsRange([0, 100]); }}
                style={{
                  marginTop: 16, width: '100%', padding: '8px', borderRadius: 6,
                  background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.12)',
                  color: '#fb7185', fontSize: 11, fontWeight: 700, cursor: 'pointer',
                  fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.04em',
                }}>
                Clear All Filters
              </button>
            )}
          </motion.div>
        )}

        {/* ── Listings grid ── */}
        <div style={{ flex: 1 }}>
          <div style={{ display: 'grid', gridTemplateColumns: viewMode === 'grid' ? 'repeat(auto-fill, minmax(280px, 1fr))' : '1fr', gap: 14 }}>
            {filtered.map(listing => (
              <motion.div key={listing.id} variants={fadeUp}>
                <MaterialCard
                  listing={listing}
                  actionLabel="Set Threshold"
                  onAction={(l) => setThresholdModal({ isOpen: true, listing: l, maxPrice: l.floorPrice.toString() })}
                />
              </motion.div>
            ))}
          </div>
          {filtered.length === 0 && (
            <div className="dash-empty" style={{ marginTop: 40 }}>
              <Search size={32} style={{ color: 'rgba(255,255,255,0.15)', marginBottom: 12 }} />
              <p style={{ fontSize: 15, marginBottom: 4 }}>No materials match your filters</p>
              <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.25)' }}>Try adjusting your criteria or check back later</p>
            </div>
          )}
        </div>
      </div>

      {/* Threshold Modal for ZOPA-RL */}
      {thresholdModal.isOpen && thresholdModal.listing && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 100,
          background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20
        }}>
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="glass-card"
            style={{ width: '100%', maxWidth: 440, padding: 24, position: 'relative' }}
          >
            <button onClick={() => setThresholdModal({ isOpen: false, listing: null, maxPrice: '' })} style={{
              position: 'absolute', top: 16, right: 16, background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer'
            }}>
              <X size={18} />
            </button>

            <h3 style={{ fontSize: 18, fontWeight: 700, fontFamily: 'var(--font-display)', marginBottom: 8, color: '#fff' }}>Set Negotiation Threshold</h3>
            <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', marginBottom: 20, lineHeight: 1.5 }}>
              Enter your absolute maximum price for <strong style={{ color: '#fff' }}>{thresholdModal.listing.materialName}</strong>. This ceiling will be used by our <strong style={{ color: '#B8F53C' }}>ZOPA-RL</strong> engine to automatically negotiate optimal settlement terms.
            </p>

            <div style={{ marginBottom: 24 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <span className="dash-micro-label" style={{ color: 'rgba(255,255,255,0.4)' }}>Max Value ({thresholdModal.listing.unit})</span>
                <span className="dash-micro-label" style={{ color: 'rgba(255,255,255,0.4)' }}>Floor Price: ${thresholdModal.listing.floorPrice}</span>
              </div>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.4)', fontFamily: 'var(--font-mono)' }}>$</span>
                <input
                  type="number"
                  value={thresholdModal.maxPrice}
                  onChange={e => setThresholdModal({ ...thresholdModal, maxPrice: e.target.value })}
                  className="dash-input"
                  style={{ paddingLeft: 32, fontSize: 16, fontFamily: 'var(--font-mono)', height: 48, width: '100%' }}
                />
              </div>
              <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', marginTop: 10, fontStyle: 'italic' }}>
                * The ZOPA-RL engine will never expose this threshold directly to the seller.
              </p>
            </div>

            <div style={{ display: 'flex', gap: 12 }}>
              <button onClick={() => setThresholdModal({ isOpen: false, listing: null, maxPrice: '' })} className="btn-secondary" style={{ flex: 3, padding: '12px 0 12px 12px' }}>
                Cancel
              </button>
              <button onClick={() => {
                // Mock submission
                setThresholdModal({ isOpen: false, listing: null, maxPrice: '' });
                // We could dispatch a toast here
                if (window.showToast) {
                  window.showToast('Threshold set! ZOPA-RL active.', 'success');
                }
              }} style={{
                flex: 1, padding: '12px 0', background: 'rgba(184,245,60,0.1)', color: '#B8F53C', border: '1px solid rgba(184,245,60,0.3)', borderRadius: 8,
                fontSize: 13, fontWeight: 700, fontFamily: 'var(--font-mono)', textTransform: 'uppercase', cursor: 'pointer',
                boxShadow: 'inset 0 0 20px rgba(184,245,60,0.05)', transition: 'all 0.2s'
              }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(184,245,60,0.2)'; e.currentTarget.style.boxShadow = '0 0 20px rgba(184,245,60,0.2), inset 0 0 20px rgba(184,245,60,0.1)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(184,245,60,0.1)'; e.currentTarget.style.boxShadow = 'inset 0 0 20px rgba(184,245,60,0.05)'; }}
              >
                Submit Threshold
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
}
