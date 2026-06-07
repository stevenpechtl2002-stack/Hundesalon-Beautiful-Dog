import { useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { FaBed, FaBath, FaRulerCombined } from 'react-icons/fa'

const CARDS = [
  {
    title: 'Luxusvilla Kyrenia',
    location: 'Kyrenia · Meerblick',
    price: '€ 485.000',
    deal: 'Kaufen',
    rooms: 4, baths: 3, sqm: 220,
    tags: ['Pool', 'Neubau'],
    image: 'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=600&q=80',
  },
  {
    title: 'Strandvilla Famagusta',
    location: 'Famagusta · Strandlage',
    price: '€ 620.000',
    deal: 'Kaufen',
    rooms: 5, baths: 4, sqm: 310,
    tags: ['Strand', 'Garten'],
    image: 'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?auto=format&fit=crop&w=600&q=80',
  },
  {
    title: 'Penthouse Iskele',
    location: 'Iskele · Dachterrasse',
    price: '€ 295.000',
    deal: 'Kaufen',
    rooms: 3, baths: 2, sqm: 140,
    tags: ['Pool', 'Neubau'],
    image: 'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?auto=format&fit=crop&w=600&q=80',
  },
  {
    title: 'Apartment Kyrenia Hafen',
    location: 'Kyrenia · Hafenblick',
    price: '€ 189.000',
    deal: 'Kaufen',
    rooms: 2, baths: 1, sqm: 85,
    tags: ['Balkon', 'Möbliert'],
    image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=600&q=80',
  },
  {
    title: 'Bergvilla Bellapais',
    location: 'Bellapais · Bergblick',
    price: '€ 2.400 / Mo',
    deal: 'Mieten',
    rooms: 3, baths: 2, sqm: 160,
    tags: ['Garten', 'Möbliert'],
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=600&q=80',
  },
  {
    title: 'City Apartment Nikosia',
    location: 'Nikosia · Zentrum',
    price: '€ 155.000',
    deal: 'Kaufen',
    rooms: 2, baths: 1, sqm: 72,
    tags: ['Zentral', 'Neubau'],
    image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=600&q=80',
  },
  {
    title: 'Esentepe Residenz',
    location: 'Esentepe · Panorama',
    price: '€ 245.000',
    deal: 'Kaufen',
    rooms: 3, baths: 2, sqm: 175,
    tags: ['Meerblick', 'Garage'],
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=600&q=80',
  },
  {
    title: 'Long Beach Apartment',
    location: 'Iskele · Long Beach',
    price: '€ 1.800 / Mo',
    deal: 'Mieten',
    rooms: 2, baths: 2, sqm: 95,
    tags: ['Strand', 'Pool'],
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80',
  },
]

function Card({ card }) {
  const isRent = card.deal === 'Mieten'
  return (
    <div
      className="flex-shrink-0 rounded-3xl overflow-hidden bg-white group cursor-pointer"
      style={{
        width: 300,
        boxShadow: '0 4px 28px rgba(0,0,0,0.09)',
        border: '1px solid #eee',
      }}
    >
      {/* Image */}
      <div className="relative overflow-hidden" style={{ height: 190 }}>
        <img
          src={card.image}
          alt={card.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.4) 0%, transparent 55%)' }} />
        <div className="absolute top-3 left-3 flex gap-1.5">
          {card.tags.map(t => (
            <span key={t} className="font-nunito font-700 text-xs px-2.5 py-1 rounded-full bg-white text-gray-700"
              style={{ boxShadow: '0 1px 6px rgba(0,0,0,0.12)' }}>{t}</span>
          ))}
        </div>
        <span
          className="absolute bottom-3 left-3 font-nunito font-800 text-xs px-3 py-1 rounded-full text-white"
          style={{ background: isRent ? '#0ea5e9' : 'var(--site-btn, #1e1a16)' }}
        >
          {card.deal}
        </span>
      </div>

      {/* Body */}
      <div className="p-4">
        <p className="font-nunito text-xs text-gray-400 mb-1">📍 {card.location}</p>
        <h3 className="font-playfair text-lg text-gray-900 mb-3 leading-snug" style={{ fontWeight: 600 }}>{card.title}</h3>
        <div className="flex items-center gap-4 text-gray-400 text-xs font-nunito font-600 mb-3">
          <span className="flex items-center gap-1.5"><FaBed size={12} /> {card.rooms} Zi.</span>
          <span className="flex items-center gap-1.5"><FaBath size={11} /> {card.baths} Bad</span>
          <span className="flex items-center gap-1.5"><FaRulerCombined size={11} /> {card.sqm} m²</span>
        </div>
        <div className="flex items-center justify-between">
          <p className="font-playfair text-xl text-gray-900" style={{ fontWeight: 700 }}>{card.price}</p>
          <a
            href="/immobilien"
            className="font-nunito font-700 text-xs px-4 py-2 rounded-xl text-white"
            style={{ background: 'var(--site-btn, #1e1a16)' }}
            onClick={e => e.stopPropagation()}
          >
            Details →
          </a>
        </div>
      </div>
    </div>
  )
}

export default function PropertyMarquee() {
  const doubled = [...CARDS, ...CARDS]
  const [paused, setPaused] = useState(false)

  return (
    <section className="py-20 overflow-hidden" style={{ background: 'white' }}>
      {/* Header */}
      <div className="max-w-7xl mx-auto px-8 md:px-16 mb-12">
        <motion.div
          initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className="inline-block font-nunito text-xs font-700 tracking-[0.25em] uppercase mb-3 px-4 py-1.5 rounded-full"
            style={{ background: 'var(--site-badge-bg, #f0ede8)', color: 'var(--site-badge-text, #7a6e65)' }}>
            Aktuelle Objekte
          </span>
          <div className="flex items-end justify-between flex-wrap gap-4">
            <h2 className="font-playfair text-3xl md:text-5xl text-gray-900" style={{ fontWeight: 700 }}>
              Unsere <span style={{ fontStyle: 'italic' }}>Highlights</span>
            </h2>
            <a href="/immobilien"
              className="font-nunito font-700 text-sm px-6 py-3 rounded-xl"
              style={{ background: 'var(--site-badge-bg, #f0ede8)', color: 'var(--site-btn, #1e1a16)' }}>
              Alle Objekte →
            </a>
          </div>
        </motion.div>
      </div>

      {/* Marquee track */}
      <div
        className="relative"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        {/* Fade edges */}
        <div className="absolute left-0 top-0 bottom-0 z-10 pointer-events-none w-24"
          style={{ background: 'linear-gradient(to right, white, transparent)' }} />
        <div className="absolute right-0 top-0 bottom-0 z-10 pointer-events-none w-24"
          style={{ background: 'linear-gradient(to left, white, transparent)' }} />

        {/* Scrolling row */}
        <div
          className="flex gap-5 px-5"
          style={{
            animation: `marquee 40s linear infinite`,
            animationPlayState: paused ? 'paused' : 'running',
            width: 'max-content',
          }}
        >
          {doubled.map((card, i) => (
            <Card key={i} card={card} />
          ))}
        </div>
      </div>

      <style>{`
        @keyframes marquee {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </section>
  )
}
