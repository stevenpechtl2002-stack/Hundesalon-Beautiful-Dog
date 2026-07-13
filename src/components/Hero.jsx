import { useEffect, useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { useAdmin } from '../context/AdminContext'
import EditableText from './admin/EditableText'
import EditableImage from './admin/EditableImage'

function useCountUp(target, duration = 2000, decimals = 0) {
  const [count, setCount] = useState(0)
  const ref = useRef(null)
  const started = useRef(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started.current) {
        started.current = true
        const start = performance.now()
        const tick = (now) => {
          const p = Math.min((now - start) / duration, 1)
          const ease = 1 - Math.pow(1 - p, 3)
          setCount(parseFloat((ease * target).toFixed(decimals)))
          if (p < 1) requestAnimationFrame(tick)
        }
        requestAnimationFrame(tick)
      }
    }, { threshold: 0.5 })
    observer.observe(el)
    return () => observer.disconnect()
  }, [target, duration, decimals])
  return { count, ref }
}

function StatItem({ target, suffix, label, decimals = 0 }) {
  const { count, ref } = useCountUp(target, 2200, decimals)
  return (
    <div ref={ref} className="text-center">
      <p className="font-playfair font-700 text-3xl md:text-4xl text-white">
        {decimals > 0 ? count.toFixed(decimals) : Math.floor(count)}{suffix}
      </p>
      <p className="font-nunito text-xs mt-1 tracking-widest uppercase" style={{ color: 'rgba(255,255,255,0.55)' }}>{label}</p>
    </div>
  )
}

export default function Hero() {
  const { content, isAdmin } = useAdmin()
  const [ready, setReady] = useState(false)

  useEffect(() => { setReady(true) }, [])

  if (!content) return null
  const { hero } = content

  const fadeUp = (delay) => ({
    initial: { opacity: 0, y: 32 },
    animate: ready ? { opacity: 1, y: 0 } : {},
    transition: { delay, duration: 0.85, ease: [0.22, 1, 0.36, 1] },
  })

  return (
    <section
      id="home"
      className="relative flex flex-col items-center justify-center overflow-hidden"
      style={{ minHeight: '100vh', paddingTop: isAdmin ? 52 : 0 }}
    >
      <div className="absolute inset-0">
        <EditableImage
          path="hero.image"
          src={hero.image}
          alt="Hero Villa"
          className="w-full h-full object-cover"
          style={{ display: 'block' }}
          fallback={
            <div className="w-full h-full" style={{ background: 'linear-gradient(135deg, #1e3a5f, #0a1628)' }} />
          }
        />
        <div className="absolute inset-0" style={{
          background: 'linear-gradient(to right, rgba(10,14,20,0.82) 0%, rgba(10,14,20,0.55) 55%, rgba(10,14,20,0.20) 100%)'
        }} />
        <div className="absolute inset-0" style={{
          background: 'linear-gradient(to top, rgba(10,14,20,0.70) 0%, transparent 50%)'
        }} />
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto px-8 md:px-16 flex flex-col justify-center" style={{ minHeight: '100vh', paddingTop: 120, paddingBottom: 80 }}>
        <div className="max-w-2xl">

          <motion.div {...fadeUp(0.1)} className="mb-8">
            <span className="inline-flex items-center gap-2 font-nunito font-600 text-xs tracking-[0.3em] uppercase px-5 py-2 rounded-full"
              style={{ background: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.2)', color: 'rgba(255,255,255,0.85)' }}>
              🏠 Premium Immobilien · Nordzypern
            </span>
          </motion.div>

          <motion.h1
            className="font-playfair leading-[1.08] mb-6 text-white"
            style={{ fontSize: 'clamp(2.8rem, 6vw, 6rem)', fontWeight: 700 }}
            initial={{ opacity: 0, y: 40 }}
            animate={ready ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.2, duration: 0.95, ease: [0.22, 1, 0.36, 1] }}
          >
            <EditableText path="hero.title" tag="span">{hero.title}</EditableText>
            <br />
            <span style={{ fontStyle: 'italic', color: 'rgba(255,255,255,0.85)' }}>
              <EditableText path="hero.titleHighlight" tag="span">{hero.titleHighlight}</EditableText>
            </span>
          </motion.h1>

          <motion.p {...fadeUp(0.4)}
            className="font-nunito font-400 leading-relaxed mb-10"
            style={{ fontSize: 'clamp(1rem, 1.4vw, 1.2rem)', color: 'rgba(255,255,255,0.70)', maxWidth: '42ch' }}>
            <EditableText path="hero.subtitle">{hero.subtitle}</EditableText>
          </motion.p>

          <motion.div {...fadeUp(0.55)} className="flex flex-wrap gap-4 mb-14">
            <motion.a
              href="#buchen"
              className="font-nunito font-700 text-sm px-9 py-4 rounded-xl text-white"
              style={{ background: 'var(--site-btn, #1e1a16)', boxShadow: '0 8px 32px rgba(0,0,0,0.35)' }}
              whileHover={{ scale: 1.05, boxShadow: '0 12px 40px rgba(0,0,0,0.45)' }}
              whileTap={{ scale: 0.97 }}
            >
              Kostenlos beraten lassen →
            </motion.a>
            <motion.a
              href="/immobilien"
              className="font-nunito font-700 text-sm px-9 py-4 rounded-xl"
              style={{ background: 'rgba(255,255,255,0.14)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.28)', color: 'white' }}
              whileHover={{ scale: 1.05, background: 'rgba(255,255,255,0.22)' }}
              whileTap={{ scale: 0.97 }}
            >
              Alle Objekte →
            </motion.a>
            <motion.a
              href={`tel:${hero.phone?.replace(/\s|-/g, '')}`}
              className="font-nunito font-700 text-sm px-6 py-4 rounded-xl flex items-center gap-2"
              style={{ background: 'rgba(255,255,255,0.10)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.20)', color: 'rgba(255,255,255,0.85)' }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
            >
              <span>📞</span>
              <EditableText path="hero.phone" tag="span">{hero.phone}</EditableText>
            </motion.a>
          </motion.div>

          <motion.div {...fadeUp(0.7)} style={{ width: 48, height: 1, background: 'rgba(255,255,255,0.25)', marginBottom: 32 }} />

          <motion.div {...fadeUp(0.8)} className="flex gap-12">
            <StatItem target={250} suffix="+" label="Immobilien" />
            <StatItem target={15} suffix=" J." label="Erfahrung" />
          </motion.div>
        </div>
      </div>

      <motion.div
        className="absolute hidden md:flex items-center gap-3 px-5 py-3 rounded-2xl"
        style={{ right: '5%', bottom: '12%', background: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.22)', boxShadow: '0 8px 32px rgba(0,0,0,0.18)' }}
        initial={{ opacity: 0, y: 20 }}
        animate={ready ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 1.1, duration: 0.8 }}
      >
        <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 3.8, ease: 'easeInOut' }} className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl" style={{ background: 'rgba(255,255,255,0.15)' }}>🌊</div>
          <div>
            <p className="font-nunito font-800 text-sm text-white">Ab €155.000</p>
            <p className="font-nunito text-xs" style={{ color: 'rgba(255,255,255,0.6)' }}>Strandlage · Kyrenia</p>
          </div>
        </motion.div>
      </motion.div>

      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        initial={{ opacity: 0 }} animate={ready ? { opacity: 1 } : {}} transition={{ delay: 1.5, duration: 0.8 }}
      >
        <span className="font-nunito text-xs tracking-widest uppercase" style={{ color: 'rgba(255,255,255,0.4)' }}>Entdecken</span>
        <motion.div
          className="w-0.5 rounded-full"
          style={{ height: 40, background: 'rgba(255,255,255,0.3)' }}
          animate={{ scaleY: [0.3, 1, 0.3], opacity: [0.4, 1, 0.4] }}
          transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
        />
      </motion.div>
    </section>
  )
}
