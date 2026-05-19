import { useState, useRef, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { useAdmin } from '../context/AdminContext'
import EditableText from './admin/EditableText'
import EditableImage from './admin/EditableImage'

const FALLBACK_BEFORE = 'https://images.unsplash.com/photo-1586671267731-da2cf3ceeb80?w=600&q=80'
const FALLBACK_AFTER  = 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=600&q=80'

function SliderCard({ pair, index }) {
  const [pos, setPos] = useState(50)
  const containerRef = useRef(null)
  const dragging = useRef(false)

  const update = useCallback((clientX) => {
    const rect = containerRef.current?.getBoundingClientRect()
    if (!rect) return
    setPos(Math.max(5, Math.min(95, ((clientX - rect.left) / rect.width) * 100)))
  }, [])

  useEffect(() => {
    const up = () => { dragging.current = false }
    window.addEventListener('mouseup', up)
    window.addEventListener('touchend', up)
    return () => { window.removeEventListener('mouseup', up); window.removeEventListener('touchend', up) }
  }, [])

  const afterSrc = pair.after || FALLBACK_AFTER
  const beforeSrc = pair.before || FALLBACK_BEFORE

  return (
    <motion.div className="flex flex-col gap-4"
      initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }} transition={{ delay: index * 0.15, duration: 0.7 }}>

      <div ref={containerRef} className="relative overflow-hidden select-none"
        style={{ height: 380, borderRadius: 24 }}
        onMouseMove={e => { if (dragging.current) update(e.clientX) }}
        onMouseDown={e => { dragging.current = true; update(e.clientX) }}
        onTouchStart={e => { dragging.current = true; update(e.touches[0].clientX) }}
        onTouchMove={e => { if (dragging.current) update(e.touches[0].clientX) }}>

        {/* After */}
        <EditableImage path={`beforeAfter.pairs.${index}.after`} src={pair.after} alt="Nachher"
          className="absolute inset-0 w-full h-full object-cover"
          fallback={<img src={FALLBACK_AFTER} alt="Nachher" className="absolute inset-0 w-full h-full object-cover" />}
        />
        <div className="absolute top-3 right-3 z-10 glass rounded-xl px-3 py-1 pointer-events-none">
          <span className="font-nunito font-700 text-xs" style={{ color: '#6b6055' }}>NACHHER ✨</span>
        </div>

        {/* Before */}
        <div className="absolute inset-0 overflow-hidden" style={{ width: `${pos}%` }}>
          <EditableImage path={`beforeAfter.pairs.${index}.before`} src={pair.before} alt="Vorher"
            className="absolute inset-0 h-full object-cover"
            style={{ width: `${100 / (pos / 100)}%`, maxWidth: 'none' }}
            fallback={<img src={FALLBACK_BEFORE} alt="Vorher" className="absolute inset-0 h-full object-cover" style={{ width: `${100 / (pos / 100)}%`, maxWidth: 'none' }} />}
          />
          <div className="absolute top-3 left-3 z-10 glass rounded-xl px-3 py-1 pointer-events-none">
            <span className="font-nunito font-700 text-xs text-gray-500">VORHER</span>
          </div>
        </div>

        <div className="ba-handle" style={{ left: `calc(${pos}% - 1.5px)` }} />
      </div>

      <div className="glass rounded-2xl px-5 py-3 flex items-center justify-between">
        <div>
          <EditableText path={`beforeAfter.pairs.${index}.name`} tag="p" className="font-nunito font-800 text-gray-800">{pair.name}</EditableText>
          <EditableText path={`beforeAfter.pairs.${index}.breed`} tag="p" className="font-nunito text-gray-400 text-sm">{pair.breed}</EditableText>
        </div>
        <span className="text-2xl">🐾</span>
      </div>
    </motion.div>
  )
}

export default function BeforeAfter() {
  const { content } = useAdmin()
  if (!content) return null
  const { beforeAfter } = content

  return (
    <section className="py-24" style={{ background: 'var(--site-bg, #FAFAFA)' }}>
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <motion.div className="text-center mb-16" initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <span className="inline-block font-nunito text-sm font-700 tracking-widest uppercase mb-3 px-4 py-1.5 rounded-full" style={{ background: 'var(--site-badge-bg, #f0ede8)', color: 'var(--site-badge-text, #7a6e65)' }}>
            <EditableText path="beforeAfter.label">{beforeAfter.label}</EditableText>
          </span>
          <h2 className="font-pacifico text-4xl md:text-5xl text-gray-800 mt-2">
            <EditableText path="beforeAfter.title">{beforeAfter.title}</EditableText>
          </h2>
          <p className="font-nunito text-gray-500 mt-4 max-w-xl mx-auto">
            <EditableText path="beforeAfter.subtitle">{beforeAfter.subtitle}</EditableText>
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {beforeAfter.pairs.map((pair, i) => <SliderCard key={i} pair={pair} index={i} />)}
        </div>
      </div>
    </section>
  )
}
