import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useState } from 'react'

function HouseIcon({ size = 120, color = 'var(--site-badge-bg, #c8beb4)' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
      <motion.path
        d="M50 12 L88 45 L88 90 L62 90 L62 65 L38 65 L38 90 L12 90 L12 45 Z"
        fill={color}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.5, type: 'spring', stiffness: 180 }}
        style={{ transformOrigin: '50px 51px' }}
      />
      <motion.rect
        x="40" y="55" width="20" height="20" rx="3"
        fill="white" fillOpacity="0.6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.4 }}
      />
      <motion.path
        d="M50 5 L95 45 H85 L50 13 L15 45 H5 Z"
        fill={color}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.4, type: 'spring' }}
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
          style={{ background: 'var(--site-bg, #FAFAFA)' }}
        >
          <HouseIcon size={120} color="var(--site-badge-bg, #c8beb4)" />

          <motion.h1
            className="font-pacifico text-4xl mt-6"
            style={{ color: 'var(--site-badge-bg, #c8beb4)' }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.5 }}
          >
            NordzypernImmo
          </motion.h1>
          <motion.p
            className="font-nunito text-gray-400 mt-2 text-sm tracking-widest uppercase"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 0.4 }}
          >
            Nordzypern
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
