import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FaBed, FaBath, FaRulerCombined, FaHeart, FaRegHeart, FaSearch, FaChevronDown } from 'react-icons/fa'

const ALL_PROPERTIES = [
  {
    id: 1, type: 'haus', deal: 'kaufen',
    title: 'Luxusvilla mit Meerblick', location: 'Kyrenia', region: 'Kyrenia',
    price: 485000, rooms: 4, baths: 3, sqm: 220,
    tags: ['Meerblick', 'Pool', 'Neubau'],
    image: 'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 2, type: 'wohnung', deal: 'kaufen',
    title: 'Apartment mit Panoramablick', location: 'Kyrenia Zentrum', region: 'Kyrenia',
    price: 189000, rooms: 2, baths: 1, sqm: 85,
    tags: ['Meerblick', 'Balkon'],
    image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 3, type: 'haus', deal: 'kaufen',
    title: 'Villa direkt am Strand', location: 'Famagusta', region: 'Famagusta',
    price: 620000, rooms: 5, baths: 4, sqm: 310,
    tags: ['Strandlage', 'Pool', 'Garten'],
    image: 'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 4, type: 'wohnung', deal: 'mieten',
    title: 'Modernes Studio-Apartment', location: 'Kyrenia Hafen', region: 'Kyrenia',
    price: 950, rooms: 1, baths: 1, sqm: 48,
    tags: ['Möbliert', 'Hafenblick'],
    image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 5, type: 'wohnung', deal: 'kaufen',
    title: 'Penthouse mit Infinitypool', location: 'Iskele', region: 'Iskele',
    price: 295000, rooms: 3, baths: 2, sqm: 140,
    tags: ['Pool', 'Neubau', 'Dachterrasse'],
    image: 'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 6, type: 'haus', deal: 'mieten',
    title: 'Ferienhaus mit Bergblick', location: 'Bellapais', region: 'Kyrenia',
    price: 2400, rooms: 3, baths: 2, sqm: 160,
    tags: ['Bergblick', 'Garten', 'Möbliert'],
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 7, type: 'wohnung', deal: 'kaufen',
    title: 'City Apartment Nikosia', location: 'Nikosia', region: 'Nikosia',
    price: 155000, rooms: 2, baths: 1, sqm: 72,
    tags: ['Zentral', 'Neubau'],
    image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 8, type: 'haus', deal: 'kaufen',
    title: 'Doppelhaushälfte Esentepe', location: 'Esentepe', region: 'Kyrenia',
    price: 245000, rooms: 3, baths: 2, sqm: 175,
    tags: ['Garten', 'Meerblick', 'Garage'],
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 9, type: 'wohnung', deal: 'mieten',
    title: 'Luxus-Apartment Strandlage', location: 'Long Beach, Iskele', region: 'Iskele',
    price: 1800, rooms: 2, baths: 2, sqm: 95,
    tags: ['Strandlage', 'Pool', 'Möbliert'],
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
  },
]

const REGIONS = ['Alle Regionen', 'Kyrenia', 'Famagusta', 'Iskele', 'Nikosia']
const PRICE_RANGES_KAUFEN = [
  { label: 'Alle Preise', min: 0, max: Infinity },
  { label: 'Bis €200.000', min: 0, max: 200000 },
  { label: '€200K – €350K', min: 200000, max: 350000 },
  { label: '€350K – €500K', min: 350000, max: 500000 },
  { label: 'Über €500.000', min: 500000, max: Infinity },
]
const PRICE_RANGES_MIETEN = [
  { label: 'Alle Preise', min: 0, max: Infinity },
  { label: 'Bis €1.000/Mo', min: 0, max: 1000 },
  { label: '€1.000 – €2.000', min: 1000, max: 2000 },
  { label: 'Über €2.000/Mo', min: 2000, max: Infinity },
]

function PropertyCard({ property }) {
  const [liked, setLiked] = useState(false)
  const isRent = property.deal === 'mieten'

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="bg-white rounded-3xl overflow-hidden group"
      style={{ boxShadow: '0 2px 20px rgba(0,0,0,0.07)', border: '1px solid #eee' }}
    >
      {/* Image */}
      <div className="relative overflow-hidden" style={{ height: 220 }}>
        <img
          src={property.image}
          alt={property.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.35) 0%, transparent 50%)' }} />

        {/* Tags */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
          {property.tags.slice(0, 2).map(tag => (
            <span key={tag} className="font-nunito font-700 text-xs px-2.5 py-1 rounded-full bg-white text-gray-700"
              style={{ boxShadow: '0 1px 6px rgba(0,0,0,0.12)' }}>
              {tag}
            </span>
          ))}
        </div>

        {/* Like */}
        <button
          onClick={() => setLiked(l => !l)}
          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white flex items-center justify-center"
          style={{ boxShadow: '0 1px 6px rgba(0,0,0,0.15)' }}
        >
          {liked
            ? <FaHeart size={15} color="#ef4444" />
            : <FaRegHeart size={15} color="#aaa" />}
        </button>

        {/* Deal badge */}
        <div className="absolute bottom-3 left-3">
          <span className="font-nunito font-800 text-xs px-3 py-1 rounded-full text-white"
            style={{ background: isRent ? '#0ea5e9' : 'var(--site-btn, #1e1a16)' }}>
            {isRent ? 'Mieten' : 'Kaufen'}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <p className="font-nunito text-xs text-gray-400 mb-1 flex items-center gap-1">
          📍 {property.location}
        </p>
        <h3 className="font-pacifico text-lg text-gray-900 mb-3 leading-snug">{property.title}</h3>

        {/* Stats */}
        <div className="flex items-center gap-4 text-gray-500 text-xs font-nunito font-600 mb-4">
          <span className="flex items-center gap-1.5"><FaBed size={13} /> {property.rooms} Zi.</span>
          <span className="flex items-center gap-1.5"><FaBath size={12} /> {property.baths} Bad</span>
          <span className="flex items-center gap-1.5"><FaRulerCombined size={12} /> {property.sqm} m²</span>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <p className="font-nunito text-xs text-gray-400">{isRent ? 'Miete/Monat' : 'Kaufpreis'}</p>
            <p className="font-pacifico text-2xl" style={{ color: 'var(--site-btn, #1e1a16)' }}>
              €{property.price.toLocaleString('de-DE')}
              {isRent && <span className="text-sm text-gray-400 font-nunito font-400">/Mo</span>}
            </p>
          </div>
          <motion.a
            href="#buchen"
            className="font-nunito font-700 text-xs px-4 py-2.5 rounded-xl text-white"
            style={{ background: 'var(--site-btn, #1e1a16)' }}
            whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}
          >
            Anfragen →
          </motion.a>
        </div>
      </div>
    </motion.div>
  )
}

function Select({ value, onChange, options, label }) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        className="appearance-none font-nunito font-600 text-sm pl-4 pr-9 py-2.5 rounded-xl border cursor-pointer outline-none"
        style={{ background: 'white', borderColor: '#e5e7eb', color: '#374151', minWidth: 160 }}
      >
        {options.map(o => (
          <option key={o.value ?? o.label} value={o.value ?? o.label}>{o.label}</option>
        ))}
      </select>
      <FaChevronDown size={11} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
    </div>
  )
}

export default function PropertiesPage() {
  const [deal, setDeal] = useState('kaufen')
  const [propType, setPropType] = useState('alle')
  const [region, setRegion] = useState('Alle Regionen')
  const [priceIdx, setPriceIdx] = useState('Alle Preise')
  const [search, setSearch] = useState('')
  const [sortBy, setSortBy] = useState('relevanz')

  const priceRanges = deal === 'kaufen' ? PRICE_RANGES_KAUFEN : PRICE_RANGES_MIETEN
  const activePriceRange = priceRanges.find(r => r.label === priceIdx) || priceRanges[0]

  const filtered = useMemo(() => {
    let list = ALL_PROPERTIES.filter(p => p.deal === deal)
    if (propType !== 'alle') list = list.filter(p => p.type === propType)
    if (region !== 'Alle Regionen') list = list.filter(p => p.region === region)
    list = list.filter(p => p.price >= activePriceRange.min && p.price <= activePriceRange.max)
    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter(p =>
        p.title.toLowerCase().includes(q) ||
        p.location.toLowerCase().includes(q) ||
        p.tags.some(t => t.toLowerCase().includes(q))
      )
    }
    if (sortBy === 'preis-asc') list = [...list].sort((a, b) => a.price - b.price)
    if (sortBy === 'preis-desc') list = [...list].sort((a, b) => b.price - a.price)
    if (sortBy === 'groesse') list = [...list].sort((a, b) => b.sqm - a.sqm)
    return list
  }, [deal, propType, region, priceIdx, search, sortBy, activePriceRange])

  // reset price when switching deal
  const switchDeal = (d) => { setDeal(d); setPriceIdx('Alle Preise') }

  return (
    <div className="min-h-screen" style={{ background: 'var(--site-bg, #FAFAFA)' }}>

      {/* Page Header */}
      <div className="pt-28 pb-10 px-8 md:px-16" style={{ background: 'white', borderBottom: '1px solid #eee' }}>
        <div className="max-w-7xl mx-auto">
          <span className="inline-block font-nunito text-xs font-700 tracking-[0.25em] uppercase mb-3 px-4 py-1.5 rounded-full"
            style={{ background: 'var(--site-badge-bg, #f0ede8)', color: 'var(--site-badge-text, #7a6e65)' }}>
            NordzypernImmo
          </span>
          <h1 className="font-pacifico text-4xl md:text-5xl text-gray-900 mt-2 mb-2">Immobilien</h1>
          <p className="font-nunito text-gray-400">
            {filtered.length} {filtered.length === 1 ? 'Objekt' : 'Objekte'} gefunden
          </p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="sticky top-[72px] z-40 px-8 md:px-16 py-4"
        style={{ background: 'rgba(250,250,250,0.96)', backdropFilter: 'blur(16px)', borderBottom: '1px solid #eeebe6', boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}>
        <div className="max-w-7xl mx-auto flex flex-wrap items-center gap-3">

          {/* Kaufen / Mieten toggle */}
          <div className="flex rounded-xl overflow-hidden" style={{ border: '1px solid #e5e7eb' }}>
            {['kaufen', 'mieten'].map(d => (
              <button key={d} onClick={() => switchDeal(d)}
                className="font-nunito font-700 text-sm px-5 py-2.5 capitalize transition-colors"
                style={{
                  background: deal === d ? 'var(--site-btn, #1e1a16)' : 'white',
                  color: deal === d ? 'white' : '#555',
                }}>
                {d.charAt(0).toUpperCase() + d.slice(1)}
              </button>
            ))}
          </div>

          {/* Type filter */}
          <div className="flex rounded-xl overflow-hidden" style={{ border: '1px solid #e5e7eb' }}>
            {[['alle', 'Alle'], ['haus', '🏠 Haus'], ['wohnung', '🏢 Wohnung']].map(([val, lbl]) => (
              <button key={val} onClick={() => setPropType(val)}
                className="font-nunito font-600 text-sm px-4 py-2.5 transition-colors"
                style={{
                  background: propType === val ? 'var(--site-badge-bg, #f0ede8)' : 'white',
                  color: propType === val ? '#5a4a3a' : '#555',
                  borderRight: val !== 'wohnung' ? '1px solid #e5e7eb' : 'none',
                }}>
                {lbl}
              </button>
            ))}
          </div>

          {/* Region */}
          <Select value={region} onChange={setRegion}
            options={REGIONS.map(r => ({ label: r, value: r }))} />

          {/* Price */}
          <Select value={priceIdx} onChange={setPriceIdx}
            options={priceRanges.map(r => ({ label: r.label, value: r.label }))} />

          {/* Search */}
          <div className="relative flex-1 min-w-[180px]">
            <FaSearch size={13} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text" value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Suchen…"
              className="w-full font-nunito text-sm pl-9 pr-4 py-2.5 rounded-xl outline-none border"
              style={{ borderColor: '#e5e7eb', background: 'white', color: '#374151' }}
            />
          </div>

          {/* Sort */}
          <Select value={sortBy} onChange={setSortBy}
            options={[
              { label: 'Relevanz', value: 'relevanz' },
              { label: 'Preis aufsteigend', value: 'preis-asc' },
              { label: 'Preis absteigend', value: 'preis-desc' },
              { label: 'Größe', value: 'groesse' },
            ]} />
        </div>
      </div>

      {/* Grid */}
      <div className="max-w-7xl mx-auto px-8 md:px-16 py-10">
        <AnimatePresence mode="popLayout">
          {filtered.length > 0 ? (
            <motion.div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6" layout>
              {filtered.map(p => <PropertyCard key={p.id} property={p} />)}
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="text-center py-24">
              <p className="text-5xl mb-4">🏠</p>
              <p className="font-pacifico text-2xl text-gray-300 mb-2">Keine Objekte gefunden</p>
              <p className="font-nunito text-gray-400 text-sm">Versuchen Sie andere Filtereinstellungen</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* CTA Banner */}
        {filtered.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="mt-16 rounded-3xl p-10 text-center text-white"
            style={{ background: 'linear-gradient(135deg, #1e1a16 0%, #3a3228 100%)' }}>
            <p className="font-nunito text-xs tracking-[0.25em] uppercase text-gray-400 mb-3">Kostenlos & unverbindlich</p>
            <h2 className="font-pacifico text-3xl mb-3">Nichts Passendes gefunden?</h2>
            <p className="font-nunito text-gray-400 mb-8 max-w-md mx-auto">
              Wir haben oft Objekte, die noch nicht online sind. Kontaktieren Sie uns — wir finden Ihr Traumobjekt.
            </p>
            <motion.a href="/#buchen"
              className="inline-flex items-center gap-2 font-nunito font-800 text-sm px-10 py-4 rounded-2xl"
              style={{ background: 'var(--site-badge-bg, #f0ede8)', color: '#1e1a16' }}
              whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>
              💬 Kostenlos beraten lassen
            </motion.a>
          </motion.div>
        )}
      </div>
    </div>
  )
}
