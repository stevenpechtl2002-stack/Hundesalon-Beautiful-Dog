import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useState } from 'react'

// Real paw print SVG path
function PawPrint({ size = 120, color = '#c8beb4' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100">
      {/* Toe pads — spread wide in an arc */}
      {[
        { cx: 18, cy: 52, rx: 10, ry: 12, delay: 0 },
        { cx: 37, cy: 36, rx: 10, ry: 12, delay: 0.12 },
        { cx: 63, cy: 36, rx: 10, ry: 12, delay: 0.24 },
        { cx: 82, cy: 52, rx: 10, ry: 12, delay: 0.36 },
      ].map((p, i) => (
        <motion.ellipse
          key={i} cx={p.cx} cy={p.cy} rx={p.rx} ry={p.ry}
          fill={color}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: p.delay, duration: 0.4, type: 'spring', stiffness: 220 }}
          style={{ transformOrigin: `${p.cx}px ${p.cy}px` }}
        />
      ))}
      {/* Main pad — large kidney/heart shape */}
      <motion.path
        d="M50,88 C36,88 26,79 26,68 C26,57 32,54 38,54 C42,54 46,56 50,59 C54,56 58,54 62,54 C68,54 74,57 74,68 C74,79 64,88 50,88 Z"
        fill={color}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.52, duration: 0.5, type: 'spring', stiffness: 160 }}
        style={{ transformOrigin: '50px 71px' }}
      />
    </svg>
  )
}

export default function LoadingScreen({ onComplete }) {
  const [phase, setPhase] = useState('draw')

  useEffect(() => {
    const t1 = setTimeout(() => setPhase('fade'), 1800)
    const t2 = setTimeout(() => onComplete(), 2400)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [onComplete])

  return (
    <AnimatePresence>
      {phase !== 'done' && (
        <motion.div
          key="loader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 0.6, ease: 'easeInOut' }}
          className="fixed inset-0 z-[9998] flex flex-col items-center justify-center"
          style={{ background: '#FAFAFA' }}
        >
          <PawPrint size={120} color="#c8beb4" />

          <motion.h1
            className="font-pacifico text-4xl mt-6"
            style={{ color: '#c8beb4' }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.5 }}
          >
            Beautiful Dog
          </motion.h1>
          <motion.p
            className="font-nunito text-gray-400 mt-2 text-sm tracking-widest uppercase"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 0.4 }}
          >
            Hundesalon · Pforzheim
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
