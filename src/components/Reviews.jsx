import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { useAdmin } from '../context/AdminContext'
import EditableText from './admin/EditableText'

function Card({ r, index }) {
  return (
    <div className="min-w-[300px] max-w-[300px] mx-3 bg-white rounded-3xl p-6 flex flex-col gap-3"
      style={{ boxShadow: '0 4px 24px rgba(0,0,0,0.06)' }}>
      <div className="flex gap-0.5">{Array(r.stars).fill(0).map((_, i) => <span key={i} className="text-yellow-400">★</span>)}</div>
      <p className="font-nunito text-gray-600 text-sm leading-relaxed flex-1 italic">
        "<EditableText path={`reviews.items.${index}.text`} tag="span">{r.text}</EditableText>"
      </p>
      <div className="flex items-center gap-3 pt-2 border-t border-gray-50">
        <div className="w-9 h-9 rounded-full flex items-center justify-center text-lg" style={{ background: '#f5f3f0' }}>
          <EditableText path={`reviews.items.${index}.avatar`} tag="span">{r.avatar}</EditableText>
        </div>
        <div>
          <EditableText path={`reviews.items.${index}.author`} tag="p" className="font-nunito font-700 text-gray-800 text-sm">{r.author}</EditableText>
          <EditableText path={`reviews.items.${index}.dog`} tag="p" className="font-nunito text-gray-400 text-xs">{r.dog}</EditableText>
        </div>
      </div>
    </div>
  )
}

export default function Reviews() {
  const { content } = useAdmin()
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    let pos = 0, paused = false
    const total = el.scrollWidth / 2
    const tick = () => {
      if (!paused) { pos += 0.5; if (pos >= total) pos = 0; el.style.transform = `translateX(-${pos}px)` }
      raf = requestAnimationFrame(tick)
    }
    let raf = requestAnimationFrame(tick)
    el.addEventListener('mouseenter', () => paused = true)
    el.addEventListener('mouseleave', () => paused = false)
    return () => cancelAnimationFrame(raf)
  }, [content])

  if (!content) return null
  const { reviews } = content

  return (
    <section id="bewertungen" className="py-24 overflow-hidden" style={{ background: '#FAFAFA' }}>
      <div className="max-w-7xl mx-auto px-8 md:px-16">
        <motion.div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-14"
          initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}>
          <div>
            <span className="inline-block font-nunito text-xs font-700 tracking-[0.25em] uppercase mb-3 px-4 py-1.5 rounded-full"
              style={{ background: '#f0ede8', color: '#7a6e65' }}>
              <EditableText path="reviews.label">{reviews.label}</EditableText>
            </span>
            <h2 className="font-pacifico text-3xl md:text-5xl text-gray-900 mt-2">
              <EditableText path="reviews.title">{reviews.title}</EditableText>
            </h2>
          </div>
          <div className="flex items-center gap-3 px-5 py-3 rounded-2xl bg-white" style={{ boxShadow: '0 2px 16px rgba(0,0,0,0.06)' }}>
            <span className="font-pacifico text-3xl text-gray-900">
              <EditableText path="reviews.rating">{reviews.rating}</EditableText>
            </span>
            <div>
              <div className="flex text-yellow-400 text-sm">★★★★★</div>
              <p className="font-nunito text-gray-400 text-xs">
                <EditableText path="reviews.ratingCount">{reviews.ratingCount}</EditableText>
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="relative">
        <div className="absolute left-0 top-0 bottom-0 w-20 z-10 pointer-events-none" style={{ background: 'linear-gradient(to right, #FAFAFA, transparent)' }} />
        <div className="absolute right-0 top-0 bottom-0 w-20 z-10 pointer-events-none" style={{ background: 'linear-gradient(to left, #FAFAFA, transparent)' }} />
        <div className="overflow-hidden">
          <div ref={ref} className="flex py-2 will-change-transform" style={{ width: 'max-content' }}>
            {[...reviews.items, ...reviews.items].map((r, i) => <Card key={i} r={r} index={i % reviews.items.length} />)}
          </div>
        </div>
      </div>
    </section>
  )
}
