import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FaBed, FaBath, FaRulerCombined } from 'react-icons/fa'
import { useAdmin } from '../context/AdminContext'

function Card({ card }) {
  const isRent = card.deal === 'mieten'
  return (
    <Link
      to={`/immobilien/${card.id}`}
      className="flex-shrink-0 rounded-3xl overflow-hidden bg-white group"
      style={{ width: 300, boxShadow: '0 4px 28px rgba(0,0,0,0.09)', border: '1px solid #eee', display: 'block' }}
    >
      {/* Image */}
      <div className="relative overflow-hidden" style={{ height: 190 }}>
        <img
          src={card.images[0]}
          alt={card.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.4) 0%, transparent 55%)' }} />
        <div className="absolute top-3 left-3 flex gap-1.5">
          {card.tags.slice(0, 2).map(t => (
            <span key={t} className="font-nunito font-700 text-xs px-2.5 py-1 rounded-full bg-white text-gray-700"
              style={{ boxShadow: '0 1px 6px rgba(0,0,0,0.12)' }}>{t}</span>
          ))}
        </div>
        <span className="absolute bottom-3 left-3 font-nunito font-800 text-xs px-3 py-1 rounded-full text-white"
          style={{ background: isRent ? '#0ea5e9' : 'var(--site-btn, #1e1a16)' }}>
          {isRent ? 'Mieten' : 'Kaufen'}
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
          <p className="font-playfair text-xl text-gray-900" style={{ fontWeight: 700 }}>
            €{card.price.toLocaleString('de-DE')}{isRent && <span className="text-sm text-gray-400 font-nunito font-400">/Mo</span>}
          </p>
          <span className="font-nunito font-700 text-xs px-4 py-2 rounded-xl text-white"
            style={{ background: 'var(--site-btn, #1e1a16)' }}>
            Details →
          </span>
        </div>
      </div>
    </Link>
  )
}

export default function PropertyMarquee() {
  const { content } = useAdmin()
  const marqueeCards = (content?.properties || []).filter(p => p.inMarquee)
  const doubled = marqueeCards.length > 0 ? [...marqueeCards, ...marqueeCards] : []
  const [paused, setPaused] = useState(false)
  if (doubled.length === 0) return null

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
