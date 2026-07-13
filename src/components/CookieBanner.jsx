import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function CookieBanner() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (!localStorage.getItem('cookie-consent')) setVisible(true)
  }, [])

  function accept() {
    localStorage.setItem('cookie-consent', 'accepted')
    setVisible(false)
  }

  function decline() {
    localStorage.setItem('cookie-consent', 'declined')
    setVisible(false)
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 120, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 120, opacity: 0 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          style={{
            position: 'fixed', bottom: 24, left: '50%', transform: 'translateX(-50%)',
            zIndex: 9999, width: 'calc(100% - 48px)', maxWidth: 720,
            background: '#1a1614', borderRadius: 20,
            border: '1px solid rgba(255,255,255,0.1)',
            boxShadow: '0 8px 40px rgba(0,0,0,0.45)',
            padding: '20px 24px',
            display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap',
          }}
        >
          <span style={{ fontSize: 24 }}>🍪</span>
          <div style={{ flex: 1, minWidth: 200 }}>
            <p style={{ margin: 0, fontFamily: 'Nunito, sans-serif', fontSize: 14, fontWeight: 700, color: 'white', marginBottom: 2 }}>
              Wir verwenden Cookies
            </p>
            <p style={{ margin: 0, fontFamily: 'Nunito, sans-serif', fontSize: 13, color: 'rgba(255,255,255,0.55)', lineHeight: 1.5 }}>
              Diese Website nutzt Cookies für ein besseres Nutzungserlebnis.{' '}
              <a href="/datenschutz" style={{ color: 'rgba(255,255,255,0.75)', textDecoration: 'underline' }}>Datenschutz</a>
            </p>
          </div>
          <div style={{ display: 'flex', gap: 10, flexShrink: 0 }}>
            <button onClick={decline} style={{
              padding: '9px 18px', borderRadius: 10, fontSize: 13, fontWeight: 700,
              border: '1.5px solid rgba(255,255,255,0.2)', background: 'transparent',
              color: 'rgba(255,255,255,0.6)', cursor: 'pointer', fontFamily: 'Nunito, sans-serif',
            }}>
              Ablehnen
            </button>
            <button onClick={accept} style={{
              padding: '9px 20px', borderRadius: 10, fontSize: 13, fontWeight: 800,
              border: 'none', background: 'var(--site-btn, #1e1a16)',
              color: 'white', cursor: 'pointer', fontFamily: 'Nunito, sans-serif',
              boxShadow: '0 4px 16px rgba(0,0,0,0.3)',
            }}>
              Akzeptieren
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
