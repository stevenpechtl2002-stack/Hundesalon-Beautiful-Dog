import { useState, useRef } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { FaBed, FaBath, FaRulerCombined, FaCheck, FaArrowLeft, FaWhatsapp, FaPhone } from 'react-icons/fa'
import { useAdmin } from '../context/AdminContext'

export default function PropertyDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { content } = useAdmin()
  const PROPERTIES = content?.properties || []
  const property = PROPERTIES.find(p => p.id === Number(id))
  const [activeImg, setActiveImg] = useState(0)
  const [lightbox, setLightbox] = useState(false)
  const touchStartX = useRef(null)

  function prev() { setActiveImg(i => (i - 1 + property.images.length) % property.images.length) }
  function next() { setActiveImg(i => (i + 1) % property.images.length) }

  function handleTouchStart(e) { touchStartX.current = e.touches[0].clientX }
  function handleTouchEnd(e) {
    if (touchStartX.current === null) return
    const dx = e.changedTouches[0].clientX - touchStartX.current
    if (Math.abs(dx) > 40) { dx < 0 ? next() : prev() }
    touchStartX.current = null
  }
  function handleImageClick(e) {
    if (property.images.length <= 1) { setLightbox(true); return }
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    if (x < rect.width * 0.35) prev()
    else if (x > rect.width * 0.65) next()
    else setLightbox(true)
  }

  if (!property) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4" style={{ background: 'var(--site-bg, #FAFAFA)', paddingTop: 72 }}>
        <p className="text-5xl">🏠</p>
        <p className="font-playfair text-2xl text-gray-400">Objekt nicht gefunden</p>
        <Link to="/immobilien" className="font-nunito font-700 text-sm px-6 py-3 rounded-xl text-white" style={{ background: 'var(--site-btn, #1e1a16)' }}>
          ← Zurück zur Übersicht
        </Link>
      </div>
    )
  }

  const isRent = property.deal === 'mieten'
  const similar = (content?.properties || []).filter(p => p.id !== property.id && p.region === property.region).slice(0, 3)
  const whatsappMsg = encodeURIComponent(`Hallo, ich interessiere mich für "${property.title}" (ID ${property.id}) für ${isRent ? '€' + property.price.toLocaleString('de-DE') + '/Mo Miete' : '€' + property.price.toLocaleString('de-DE')}. Können Sie mir mehr Informationen geben?`)

  return (
    <div className="min-h-screen" style={{ background: 'var(--site-bg, #FAFAFA)', paddingTop: 72 }}>

      {/* Back button */}
      <div className="max-w-7xl mx-auto px-8 md:px-16 pt-8 pb-4">
        <button onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 font-nunito font-600 text-sm text-gray-500 hover:text-gray-900 transition-colors">
          <FaArrowLeft size={13} /> Zurück
        </button>
      </div>

      <div className="max-w-7xl mx-auto px-8 md:px-16 pb-24">
        <div className="grid lg:grid-cols-[1fr_380px] gap-12">

          {/* LEFT: images + details */}
          <div>
            {/* Main image */}
            <motion.div
              className="rounded-3xl overflow-hidden mb-3 relative select-none"
              style={{ height: 480, boxShadow: '0 8px 40px rgba(0,0,0,0.12)', cursor: property.images.length > 1 ? 'pointer' : 'zoom-in' }}
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
              onClick={handleImageClick}
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
            >
              <AnimatePresence mode="wait">
                <motion.img
                  key={activeImg}
                  src={property.images[activeImg]}
                  alt={property.title}
                  className="w-full h-full object-cover"
                  initial={{ opacity: 0, x: 40 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -40 }}
                  transition={{ duration: 0.25 }}
                  draggable={false}
                />
              </AnimatePresence>

              {/* Tags */}
              <div className="absolute top-4 left-4 flex gap-2 flex-wrap">
                {property.tags.map(t => (
                  <span key={t} className="font-nunito font-700 text-xs px-3 py-1 rounded-full bg-white text-gray-700"
                    style={{ boxShadow: '0 1px 6px rgba(0,0,0,0.12)' }}>{t}</span>
                ))}
              </div>

              {/* Deal badge */}
              <span className="absolute top-4 right-4 font-nunito font-800 text-xs px-4 py-1.5 rounded-full text-white"
                style={{ background: isRent ? '#0ea5e9' : 'var(--site-btn, #1e1a16)' }}>
                {isRent ? 'Mieten' : 'Kaufen'}
              </span>

              {/* Prev / Next arrows */}
              {property.images.length > 1 && (
                <>
                  <button
                    onClick={e => { e.stopPropagation(); prev() }}
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-lg transition-all"
                    style={{ background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(6px)', border: '1px solid rgba(255,255,255,0.2)' }}
                  >‹</button>
                  <button
                    onClick={e => { e.stopPropagation(); next() }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-lg transition-all"
                    style={{ background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(6px)', border: '1px solid rgba(255,255,255,0.2)' }}
                  >›</button>

                  {/* Dot indicators */}
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
                    {property.images.map((_, i) => (
                      <button key={i} onClick={e => { e.stopPropagation(); setActiveImg(i) }}
                        className="rounded-full transition-all duration-200"
                        style={{ width: i === activeImg ? 20 : 6, height: 6, background: i === activeImg ? 'white' : 'rgba(255,255,255,0.45)' }} />
                    ))}
                  </div>
                </>
              )}

              {/* Counter + zoom hint */}
              <div className="absolute bottom-4 right-4 font-nunito text-xs text-white px-3 py-1 rounded-full"
                style={{ background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(8px)' }}>
                {property.images.length > 1 ? `${activeImg + 1} / ${property.images.length}` : '🔍 Vergrößern'}
              </div>
            </motion.div>

            {/* Thumbnails */}
            <div className="flex gap-3 mb-10">
              {property.images.map((img, i) => (
                <button key={i} onClick={() => setActiveImg(i)}
                  className="rounded-2xl overflow-hidden flex-1 transition-all duration-200"
                  style={{ height: 90, outline: activeImg === i ? '3px solid var(--site-btn, #1e1a16)' : '3px solid transparent', outlineOffset: 2 }}>
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>

            {/* Description */}
            <div className="mb-8">
              <h2 className="font-playfair text-2xl text-gray-900 mb-4" style={{ fontWeight: 700 }}>Beschreibung</h2>
              <p className="font-nunito text-gray-500 leading-relaxed text-base">{property.description}</p>
            </div>

            {/* Features */}
            <div className="mb-10">
              <h2 className="font-playfair text-2xl text-gray-900 mb-4" style={{ fontWeight: 700 }}>Ausstattung</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {property.features.map(f => (
                  <div key={f} className="flex items-center gap-2.5 bg-white rounded-xl px-4 py-3"
                    style={{ border: '1px solid #eee', boxShadow: '0 1px 8px rgba(0,0,0,0.04)' }}>
                    <FaCheck size={11} style={{ color: 'var(--site-btn, #1e1a16)', flexShrink: 0 }} />
                    <span className="font-nunito text-sm text-gray-700">{f}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Details table */}
            <div>
              <h2 className="font-playfair text-2xl text-gray-900 mb-4" style={{ fontWeight: 700 }}>Objektdetails</h2>
              <div className="bg-white rounded-2xl overflow-hidden" style={{ border: '1px solid #eee' }}>
                {[
                  ['Typ', property.type === 'haus' ? '🏠 Haus / Villa' : '🏢 Wohnung / Apartment'],
                  ['Angebot', isRent ? '🔑 Miete' : '💰 Kauf'],
                  ['Wohnfläche', `${property.sqm} m²`],
                  ['Zimmer', `${property.rooms} Schlafzimmer`],
                  ['Badezimmer', `${property.baths} Badezimmer`],
                  ['Baujahr', property.year],
                  ['Etage', property.floor ? `${property.floor}. Etage` : 'Erdgeschoss / Villa'],
                  ['Stellplatz', property.parking ? '✅ Vorhanden' : '❌ Nicht vorhanden'],
                  ['Region', property.region],
                ].map(([label, val], i) => (
                  <div key={label} className="flex justify-between px-5 py-3.5 font-nunito text-sm"
                    style={{ borderBottom: i < 8 ? '1px solid #f3f3f3' : 'none', background: i % 2 === 0 ? 'white' : '#fafafa' }}>
                    <span className="text-gray-400 font-600">{label}</span>
                    <span className="text-gray-800 font-700">{val}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT: sticky contact card */}
          <div>
            <div className="sticky top-24">
              <motion.div className="bg-white rounded-3xl p-7"
                style={{ boxShadow: '0 8px 40px rgba(0,0,0,0.10)', border: '1px solid #eee' }}
                initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.1 }}>

                {/* Title + price */}
                <h1 className="font-playfair text-2xl text-gray-900 mb-1 leading-snug" style={{ fontWeight: 700 }}>
                  {property.title}
                </h1>
                <p className="font-nunito text-gray-400 text-sm mb-5">📍 {property.location}</p>

                <div className="mb-6 pb-6" style={{ borderBottom: '1px solid #f0ede8' }}>
                  <p className="font-nunito text-xs text-gray-400 mb-1">{isRent ? 'Miete / Monat' : 'Kaufpreis'}</p>
                  <p className="font-playfair text-4xl text-gray-900" style={{ fontWeight: 700 }}>
                    €{property.price.toLocaleString('de-DE')}
                    {isRent && <span className="text-lg text-gray-400 font-nunito font-400"> /Mo</span>}
                  </p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-3 mb-7">
                  {[
                    { icon: <FaBed />, val: property.rooms, label: 'Zimmer' },
                    { icon: <FaBath />, val: property.baths, label: 'Bäder' },
                    { icon: <FaRulerCombined />, val: `${property.sqm}`, label: 'm²' },
                  ].map(s => (
                    <div key={s.label} className="rounded-2xl p-3 text-center" style={{ background: 'var(--site-badge-bg, #f0ede8)' }}>
                      <div className="text-gray-500 flex justify-center mb-1" style={{ fontSize: 14 }}>{s.icon}</div>
                      <p className="font-playfair text-xl text-gray-900" style={{ fontWeight: 700 }}>{s.val}</p>
                      <p className="font-nunito text-gray-400 text-xs">{s.label}</p>
                    </div>
                  ))}
                </div>

                {/* CTAs */}
                <div className="flex flex-col gap-3">
                  <motion.a
                    href={`https://wa.me/4915251946226?text=${whatsappMsg}`}
                    target="_blank" rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2.5 w-full py-4 rounded-2xl font-nunito font-700 text-sm text-white"
                    style={{ background: '#22c55e', boxShadow: '0 6px 20px rgba(34,197,94,0.30)' }}
                    whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                    <FaWhatsapp size={18} /> WhatsApp Anfrage
                  </motion.a>
                  <motion.a
                    href="tel:+4915251946226"
                    className="flex items-center justify-center gap-2.5 w-full py-4 rounded-2xl font-nunito font-700 text-sm"
                    style={{ background: 'var(--site-btn, #1e1a16)', color: 'white', boxShadow: '0 6px 20px rgba(0,0,0,0.18)' }}
                    whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                    <FaPhone size={14} /> +49 152 51946226
                  </motion.a>
                  <Link to="/#buchen"
                    className="flex items-center justify-center w-full py-3.5 rounded-2xl font-nunito font-700 text-sm"
                    style={{ background: 'var(--site-badge-bg, #f0ede8)', color: 'var(--site-btn, #1e1a16)' }}>
                    ✉️ Kontaktformular
                  </Link>
                </div>

                <p className="font-nunito text-xs text-gray-400 text-center mt-4">
                  Kostenlose & unverbindliche Beratung
                </p>
              </motion.div>

              {/* Agent card */}
              <motion.div className="mt-4 bg-white rounded-2xl p-5 flex items-center gap-4"
                style={{ border: '1px solid #eee' }}
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
                <div className="w-12 h-12 rounded-full flex items-center justify-center text-2xl flex-shrink-0"
                  style={{ background: 'var(--site-badge-bg, #f0ede8)' }}>👨‍💼</div>
                <div>
                  <p className="font-nunito font-800 text-sm text-gray-800">Andreas Pechtl</p>
                  <p className="font-nunito text-xs text-gray-400">Ihr persönlicher Berater</p>
                  <p className="font-nunito text-xs font-700 mt-0.5" style={{ color: 'var(--site-btn, #1e1a16)' }}>15 J. Erfahrung</p>
                </div>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Similar properties */}
        {similar.length > 0 && (
          <div className="mt-20">
            <h2 className="font-playfair text-3xl text-gray-900 mb-8" style={{ fontWeight: 700 }}>
              Ähnliche Objekte in <span style={{ fontStyle: 'italic' }}>{property.region}</span>
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {similar.map(p => (
                <Link key={p.id} to={`/immobilien/${p.id}`}
                  className="bg-white rounded-3xl overflow-hidden group hover:-translate-y-1 transition-transform duration-300"
                  style={{ boxShadow: '0 2px 20px rgba(0,0,0,0.07)', border: '1px solid #eee' }}>
                  <div style={{ height: 180, overflow: 'hidden' }}>
                    <img src={p.images[0]} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                  <div className="p-4">
                    <p className="font-nunito text-xs text-gray-400 mb-1">📍 {p.location}</p>
                    <h3 className="font-playfair text-lg text-gray-900 mb-2" style={{ fontWeight: 600 }}>{p.title}</h3>
                    <p className="font-playfair text-xl text-gray-900" style={{ fontWeight: 700 }}>
                      €{p.price.toLocaleString('de-DE')}{p.deal === 'mieten' && <span className="text-sm text-gray-400 font-nunito font-400">/Mo</span>}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox && (
          <motion.div
            className="fixed inset-0 z-[9999] flex items-center justify-center select-none"
            style={{ background: 'rgba(0,0,0,0.94)', backdropFilter: 'blur(10px)' }}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setLightbox(false)}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            <AnimatePresence mode="wait">
              <motion.img
                key={activeImg}
                src={property.images[activeImg]}
                alt={property.title}
                className="max-w-[90vw] max-h-[85vh] object-contain rounded-2xl"
                initial={{ opacity: 0, x: 60 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -60 }}
                transition={{ duration: 0.2 }}
                onClick={e => e.stopPropagation()}
                draggable={false}
              />
            </AnimatePresence>

            {/* Close */}
            <button onClick={() => setLightbox(false)}
              className="absolute top-6 right-6 w-10 h-10 rounded-full bg-white flex items-center justify-center font-nunito font-700 text-gray-700 text-lg">
              ✕
            </button>

            {/* Prev / Next */}
            {property.images.length > 1 && (
              <>
                <button onClick={e => { e.stopPropagation(); prev() }}
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full flex items-center justify-center text-white text-2xl font-bold"
                  style={{ background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.25)' }}>‹</button>
                <button onClick={e => { e.stopPropagation(); next() }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full flex items-center justify-center text-white text-2xl font-bold"
                  style={{ background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.25)' }}>›</button>
              </>
            )}

            {/* Counter */}
            <div className="absolute top-6 left-1/2 -translate-x-1/2 font-nunito text-sm text-white font-700 px-4 py-1.5 rounded-full"
              style={{ background: 'rgba(0,0,0,0.4)' }}>
              {activeImg + 1} / {property.images.length}
            </div>

            {/* Dots */}
            <div className="absolute bottom-6 flex gap-2">
              {property.images.map((_, i) => (
                <button key={i} onClick={e => { e.stopPropagation(); setActiveImg(i) }}
                  className="rounded-full transition-all duration-200"
                  style={{ width: i === activeImg ? 24 : 8, height: 8, background: i === activeImg ? 'white' : 'rgba(255,255,255,0.35)' }} />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
