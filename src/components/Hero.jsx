import { useEffect, useState, useRef } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'
import { useSanityQuery } from '../hooks/useSanity'
import { urlFor } from '../sanityClient'

function useCountUp(target, duration = 1800, decimals = 0) {
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

function StatItem({ target, suffix, label, decimals = 0, duration = 1600 }) {
  const { count, ref } = useCountUp(target, duration, decimals)
  return (
    <div ref={ref}>
      <p className="font-pacifico text-2xl" style={{
        background: 'linear-gradient(135deg,#FFB5D8,#C5B5EA)',
        WebkitBackgroundClip: 'text', backgroundClip: 'text', WebkitTextFillColor: 'transparent'
      }}>{decimals > 0 ? count.toFixed(decimals) : Math.floor(count)}{suffix}</p>
      <p className="font-nunito text-xs mt-0.5" style={{ color: '#b0a0c0' }}>{label}</p>
    </div>
  )
}

const FALLBACK = {
  heroTitle: 'Hundesalon Beautiful Dog',
  heroSubtitle: 'Ihr Liebling als Beauty-Lounge und Wohlfühl-Oase — professionelle Pflege mit Herz, die Ihren Hund nicht nur schön, sondern auch gesund hält.',
  phone: '07231 - 37 42 100',
}

export default function Hero() {
  const sanity = useSanityQuery(`*[_type == "siteContent"][0]{heroTitle, heroSubtitle, phone, heroImage}`)
  const content = sanity || FALLBACK
  const [ready, setReady] = useState(false)
  const rawX = useMotionValue(0)
  const rawY = useMotionValue(0)
  const px = useSpring(rawX, { stiffness: 60, damping: 28 })
  const py = useSpring(rawY, { stiffness: 60, damping: 28 })

  useEffect(() => {
    setReady(true)
    const h = (e) => {
      rawX.set((e.clientX / window.innerWidth - 0.5) * 14)
      rawY.set((e.clientY / window.innerHeight - 0.5) * 8)
    }
    window.addEventListener('mousemove', h)
    return () => window.removeEventListener('mousemove', h)
  }, [rawX, rawY])

  const stagger = (delay) => ({
    initial: { opacity: 0, y: 28 },
    animate: ready ? { opacity: 1, y: 0 } : {},
    transition: { delay, duration: 0.75, ease: [0.22, 1, 0.36, 1] },
  })

  return (
    <section id="home" className="relative min-h-screen flex items-center overflow-hidden"
      style={{ background: '#ffffff' }}>

      {/* Soft background tints matching video's light palette */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background: 'radial-gradient(ellipse 70% 80% at 80% 50%, #FFF5F9 0%, #ffffff 55%)'
      }} />
      <div className="absolute inset-0 pointer-events-none" style={{
        background: 'radial-gradient(ellipse 50% 60% at 10% 40%, #F8F4FF 0%, transparent 60%)'
      }} />

      {/* ── VIDEO: desktop only — fills right portion, bleeds to screen edge ── */}
      <motion.div
        className="absolute top-0 right-0 h-full hidden md:block"
        style={{ width: '70%' }}
        initial={{ opacity: 0 }}
        animate={ready ? { opacity: 1 } : {}}
        transition={{ delay: 0.2, duration: 1.2 }}>

        {content.heroImage
          ? <img src={urlFor(content.heroImage).width(1400).url()} alt="Hero" className="w-full h-full object-cover" style={{ display: 'block' }} />
          : <video src="/hund.mp4" autoPlay loop muted playsInline className="w-full h-full object-cover" style={{ display: 'block' }} />
        }

        {/* Gradient mask: left edge only */}
        <div className="absolute inset-0 pointer-events-none" style={{
          background: 'linear-gradient(to right, #ffffff 0%, transparent 12%)'
        }} />
      </motion.div>

      {/* ── CONTENT ── */}
      <div className="relative max-w-7xl mx-auto px-2 md:px-4 py-24 w-full">
        <div className="max-w-md">

          {/* Tag badge */}
          <motion.div {...stagger(0.1)} className="mb-6">
            <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full"
              style={{ background: 'rgba(255,181,216,0.15)', border: '1px solid rgba(255,181,216,0.35)' }}>
              <span className="text-sm">🐾</span>
              <span className="font-nunito font-700 text-xs tracking-[0.25em] uppercase" style={{ color: '#d4789a' }}>Premium Hundesalon · Pforzheim</span>
            </div>
          </motion.div>

          {/* Headline */}
          <motion.h1
            className="font-pacifico leading-[1.05] mb-6"
            style={{ fontSize: 'clamp(3rem, 5.5vw, 6.5rem)', color: '#1a1025' }}
            initial={{ opacity: 0, y: 50 }}
            animate={ready ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.2, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}>
            {content.heroTitle?.split(' ')[0] || 'Hundesalon'}<br />
            <span style={{
              background: 'linear-gradient(135deg, #FFB5D8, #C5B5EA)',
              WebkitBackgroundClip: 'text', backgroundClip: 'text', WebkitTextFillColor: 'transparent',
            }}>{content.heroTitle?.split(' ').slice(1).join(' ') || 'Beautiful Dog'}</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p {...stagger(0.42)}
            className="font-nunito font-400 mb-7 leading-relaxed"
            style={{ fontSize: 'clamp(1rem, 1.3vw, 1.15rem)', maxWidth: '38ch', color: '#7a6b8a' }}>
            {content.heroSubtitle}
          </motion.p>

          {/* Trust chips */}
          <motion.div {...stagger(0.52)} className="flex flex-wrap gap-2 mb-8">
            {['Zertifizierte Groomerin', 'Naturprodukte', 'Kleine & Mittlere Rassen'].map(chip => (
              <span key={chip} className="font-nunito font-600 text-xs px-3.5 py-1.5 rounded-full"
                style={{ background: '#f5f0ff', border: '1px solid #e8dff5', color: '#9b85c4' }}>
                {chip}
              </span>
            ))}
          </motion.div>

          {/* Google badge + open */}
          <motion.div {...stagger(0.62)} className="flex flex-wrap items-center gap-3 mb-9">
            <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-2xl"
              style={{ background: 'white', border: '1px solid #ece8f5', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
              <svg width="15" height="15" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              <div className="flex text-yellow-400 text-sm">★★★★★</div>
              <span className="font-nunito font-800 text-sm" style={{ color: '#1a1025' }}>4.9</span>
              <span className="font-nunito text-xs" style={{ color: '#b0a0c0' }}>· 387 Bewertungen</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl"
              style={{ background: '#f0fdf8', border: '1px solid #bbf7d0' }}>
              <div className="w-1.5 h-1.5 rounded-full bg-green-400" style={{ boxShadow: '0 0 6px #4ade80' }} />
              <span className="font-nunito font-700 text-green-700 text-xs">Heute geöffnet</span>
            </div>
          </motion.div>

          {/* CTAs */}
          <motion.div {...stagger(0.75)} className="flex flex-wrap gap-3">
            <motion.a href="#buchen"
              className="font-nunito font-800 text-sm px-8 py-4 rounded-2xl text-white"
              style={{ background: 'linear-gradient(135deg,#FFB5D8,#C5B5EA)', boxShadow: '0 8px 28px rgba(255,181,216,0.45)' }}
              whileHover={{ scale: 1.05, boxShadow: '0 14px 44px rgba(255,181,216,0.65)' }}
              whileTap={{ scale: 0.97 }}>
              Termin buchen →
            </motion.a>
            <motion.a href="tel:072313742100"
              className="font-nunito font-700 text-sm px-7 py-4 rounded-2xl flex items-center gap-2"
              style={{ background: 'white', border: '1px solid #ece8f5', color: '#5a4a6a', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}
              whileHover={{ scale: 1.05, boxShadow: '0 6px 20px rgba(0,0,0,0.1)' }}
              whileTap={{ scale: 0.97 }}>
              <span>📞</span> {content.phone}
            </motion.a>
          </motion.div>

          {/* Stats */}
          <motion.div {...stagger(0.9)} className="flex gap-8 mt-10 pt-8"
            style={{ borderTop: '1px solid #ede8f5' }}>
            <StatItem target={500} suffix="+" label="Zufriedene Hunde" duration={4000} />
            <StatItem target={15} suffix=" J." label="Erfahrung" duration={3500} />
            <StatItem target={4.9} suffix="★" label="Google Rating" decimals={1} duration={3000} />
          </motion.div>

        </div>
      </div>

      {/* ── VIDEO: mobile only — contained block below text ── */}
      <motion.div
        className="md:hidden w-full px-6 pb-10"
        initial={{ opacity: 0, y: 20 }}
        animate={ready ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 0.5, duration: 0.8 }}>
        <div className="rounded-3xl overflow-hidden w-full"
          style={{ aspectRatio: '4/3', boxShadow: '0 12px 40px rgba(255,181,216,0.25)' }}>
          {content.heroImage
            ? <img src={urlFor(content.heroImage).width(800).url()} alt="Hero" className="w-full h-full object-cover" />
            : <video src="/hund.mp4" autoPlay loop muted playsInline className="w-full h-full object-cover" />
          }
        </div>
      </motion.div>

      {/* Floating badges over video */}
      <motion.div
        className="absolute hidden md:flex items-center gap-2 px-4 py-2.5 rounded-2xl"
        style={{
          right: '6%', top: '22%',
          background: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(16px)',
          border: '1px solid rgba(255,181,216,0.25)', boxShadow: '0 8px 32px rgba(0,0,0,0.08)'
        }}
        initial={{ opacity: 0, y: -20 }}
        animate={ready ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 1, duration: 0.8 }}>
        <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 3.5, ease: 'easeInOut' }}
          className="flex items-center gap-2">
          <span className="text-xl">✂️</span>
          <div>
            <p className="font-nunito font-800 text-xs" style={{ color: '#1a1025' }}>Profi-Styling</p>
            <p className="font-nunito text-xs" style={{ color: '#b0a0c0' }}>Alle Rassen</p>
          </div>
        </motion.div>
      </motion.div>

      <motion.div
        className="absolute hidden md:flex items-center gap-2 px-4 py-2.5 rounded-2xl"
        style={{
          right: '10%', bottom: '20%',
          background: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(16px)',
          border: '1px solid rgba(197,181,234,0.3)', boxShadow: '0 8px 32px rgba(0,0,0,0.08)'
        }}
        initial={{ opacity: 0, y: 20 }}
        animate={ready ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 1.15, duration: 0.8 }}>
        <motion.div animate={{ y: [0, 5, 0] }} transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut', delay: 1 }}
          className="flex items-center gap-2">
          <span className="text-xl">🌿</span>
          <div>
            <p className="font-nunito font-800 text-xs" style={{ color: '#1a1025' }}>Naturprodukte</p>
            <p className="font-nunito text-xs" style={{ color: '#b0a0c0' }}>Sanft & sicher</p>
          </div>
        </motion.div>
      </motion.div>

    </section>
  )
}
