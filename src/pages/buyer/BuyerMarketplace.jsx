import { useState } from 'react';
import { motion } from 'framer-motion';
import MaterialCard from '../../components/ui/MaterialCard';
import { listings } from '../../mock/listings';
import { Filter, Grid3X3, List, Search } from 'lucide-react';

const fadeUp = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.4 } } };

const categories = ['All', 'Plastics', 'Metals', 'Paper & Cellulose', 'Glass', 'Rubber', 'E-Waste', 'Chemical Waste', 'Industrial Minerals', 'Textiles'];
const sortOptions = [{ value: 'mqs', label: 'MQS Score' }, { value: 'price', label: 'Price' }, { value: 'expiry', label: 'Expiry Date' }, { value: 'newest', label: 'Newest' }];

export default function BuyerMarketplace() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [mqsRange, setMqsRange] = useState([0, 100]);
  const [sortBy, setSortBy] = useState('mqs');
  const [viewMode, setViewMode] = useState('grid');
  const [showFilters, setShowFilters] = useState(true);

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
    <motion.div initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.08 } } }}>
      <motion.div variants={fadeUp} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 700, color: '#fff', marginBottom: 4 }}>Browse Marketplace</h1>
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)' }}>{filtered.length} materials available</p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={() => setShowFilters(!showFilters)} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px', borderRadius: 'var(--radius-btn)', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.6)', cursor: 'pointer', fontSize: 13, fontFamily: 'var(--font-body)' }}>
            <Filter size={14} /> Filters
          </button>
          <button onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')} style={{ padding: '8px 12px', borderRadius: 'var(--radius-btn)', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.6)', cursor: 'pointer' }}>
            {viewMode === 'grid' ? <List size={16} /> : <Grid3X3 size={16} />}
          </button>
        </div>
      </motion.div>

      <div style={{ display: 'flex', gap: 24 }}>
        {/* Filters sidebar */}
        {showFilters && (
          <motion.div variants={fadeUp} className="glass-card" style={{ width: 240, padding: 20, flexShrink: 0, height: 'fit-content', position: 'sticky', top: 80 }} className2="filter-sidebar">
            <div style={{ marginBottom: 20 }}>
              <label style={{ fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: 8 }}>Search</label>
              <div style={{ position: 'relative' }}>
                <Search size={14} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.3)' }} />
                <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Material name..."
                  style={{ width: '100%', padding: '8px 10px 8px 30px', borderRadius: 6, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: '#fff', fontSize: 13, outline: 'none', boxSizing: 'border-box', fontFamily: 'var(--font-body)' }} />
              </div>
            </div>

            <div style={{ marginBottom: 20 }}>
              <label style={{ fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: 8 }}>Category</label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {categories.map(cat => (
                  <button key={cat} onClick={() => setCategory(cat)} style={{
                    padding: '6px 10px', borderRadius: 4, border: 'none', cursor: 'pointer', textAlign: 'left', fontSize: 12,
                    background: category === cat ? 'rgba(184,245,60,0.1)' : 'transparent', color: category === cat ? '#B8F53C' : 'rgba(255,255,255,0.5)',
                    fontFamily: 'var(--font-body)', fontWeight: category === cat ? 600 : 400, transition: 'all 0.15s',
                  }}>{cat}</button>
                ))}
              </div>
            </div>

            <div style={{ marginBottom: 20 }}>
              <label style={{ fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: 8 }}>MQS Range: {mqsRange[0]}-{mqsRange[1]}</label>
              <input type="range" min={0} max={100} value={mqsRange[0]} onChange={e => setMqsRange([+e.target.value, mqsRange[1]])} style={{ width: '100%', accentColor: '#B8F53C' }} />
            </div>

            <div>
              <label style={{ fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: 8 }}>Sort By</label>
              <select value={sortBy} onChange={e => setSortBy(e.target.value)}
                style={{ width: '100%', padding: '8px 10px', borderRadius: 6, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: '#fff', fontSize: 13, outline: 'none', fontFamily: 'var(--font-body)' }}>
                {sortOptions.map(o => <option key={o.value} value={o.value} style={{ background: '#0D2B1E' }}>{o.label}</option>)}
              </select>
            </div>
          </motion.div>
        )}

        {/* Listings grid */}
        <div style={{ flex: 1 }}>
          <div style={{ display: 'grid', gridTemplateColumns: viewMode === 'grid' ? 'repeat(auto-fill, minmax(280px, 1fr))' : '1fr', gap: 16 }}>
            {filtered.map(listing => (
              <motion.div key={listing.id} variants={fadeUp}>
                <MaterialCard listing={listing} actionLabel="Express Interest" />
              </motion.div>
            ))}
          </div>
          {filtered.length === 0 && (
            <div style={{ textAlign: 'center', padding: 64, color: 'rgba(255,255,255,0.3)' }}>
              <p style={{ fontSize: 16, marginBottom: 8 }}>No materials match your filters.</p>
              <p style={{ fontSize: 13 }}>Try adjusting your search criteria or check back later.</p>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
