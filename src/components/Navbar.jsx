import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAdmin } from '../context/AdminContext'
import EditableText from './admin/EditableText'

const ANCHOR_LINKS = [
  { label: 'Warum Nordzypern', href: '#ueber-uns' },
  { label: 'Leistungen', href: '#leistungen' },
  { label: 'Bewertungen', href: '#bewertungen' },
  { label: 'Kontakt', href: '#buchen' },
]

function CyprusSvg({ color = 'white' }) {
  // Single closed path tracing Cyprus coastline clockwise from west tip
  return (
    <svg width="54" height="30" viewBox="0 0 290 158" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="
          M 8,92
          C 10,84 14,74 20,64
          C 24,57 28,51 32,46
          C 28,44 24,40 26,35
          C 28,30 34,28 42,30
          C 50,26 60,23 72,21
          C 84,19 96,18 108,19
          C 118,20 126,23 132,27
          C 138,24 146,21 156,19
          C 168,17 180,16 192,17
          C 204,18 216,20 228,22
          C 238,24 248,27 256,31
          C 264,34 270,38 273,43
          C 275,48 273,53 268,56
          C 262,59 253,61 242,62
          C 230,63 218,62 208,62
          C 198,62 190,63 184,66
          C 186,72 188,79 188,86
          C 188,94 186,101 181,107
          C 176,113 168,117 158,120
          C 148,123 136,123 124,122
          C 112,121 100,117 90,112
          C 80,107 72,100 66,94
          C 58,98 48,100 38,98
          C 30,96 20,94 12,92
          Z
        "
        fill="none"
        stroke={color}
        strokeWidth="5"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  )
}

export default function Navbar() {
  const { content } = useAdmin()
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const isProperties = location.pathname === '/immobilien'

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', handler)
    return () => window.removeEventListener('scroll', handler)
  }, [])

  const linkColor = (scrolled || isProperties) ? '#555' : 'rgba(255,255,255,0.9)'
  const logoColor = (scrolled || isProperties) ? '#333' : 'white'
  const navBg = isProperties
    ? 'rgba(250,250,250,0.97)'
    : scrolled ? 'rgba(250,250,250,0.95)' : 'transparent'

  const handleAnchor = (href) => {
    if (isProperties) {
      navigate('/')
      setTimeout(() => {
        document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' })
      }, 300)
    } else {
      document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' })
    }
    setOpen(false)
  }

  return (
    <motion.nav
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-12"
      style={{ height: 72 }}
      animate={{
        background: navBg,
        backdropFilter: (scrolled || isProperties) ? 'blur(20px)' : 'blur(0px)',
        boxShadow: (scrolled || isProperties) ? '0 2px 20px rgba(0,0,0,0.06)' : 'none',
      }}
      transition={{ duration: 0.4 }}
    >
      {/* Logo */}
      <Link to="/" className="flex items-center gap-2 group">
        <motion.div whileHover={{ scale: 1.1 }} transition={{ type: 'spring', stiffness: 400 }} className="text-2xl">
          🏠
        </motion.div>
        <span className="font-pacifico text-xl" style={{ color: logoColor }}>
          <EditableText path="navbar.logo" tag="span">{content?.navbar?.logo || 'NordzypernImmo'}</EditableText>
        </span>
      </Link>

      {/* Desktop links */}
      <div className="hidden md:flex items-center gap-6">
        {/* Immobilien page link */}
        <Link
          to="/immobilien"
          className="font-nunito font-700 text-sm tracking-wide relative group"
          style={{ color: isProperties ? 'var(--site-btn, #1e1a16)' : linkColor }}
        >
          Immobilien
          {isProperties && (
            <span className="absolute -bottom-1 left-0 w-full h-0.5 rounded-full" style={{ background: 'var(--site-btn, #1e1a16)' }} />
          )}
        </Link>

        {ANCHOR_LINKS.map((l) => (
          <motion.button
            key={l.href}
            onClick={() => handleAnchor(l.href)}
            className="font-nunito font-600 text-sm tracking-wide relative group bg-transparent border-0 cursor-pointer"
            style={{ color: linkColor }}
            whileHover={{ y: -1 }}
          >
            {l.label}
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 group-hover:w-full transition-all duration-300 rounded-full"
              style={{ background: 'var(--site-btn, #1e1a16)' }} />
          </motion.button>
        ))}

        <motion.button
          onClick={() => handleAnchor('#buchen')}
          className="font-nunito font-700 text-sm px-5 py-2.5 rounded-full text-white cursor-pointer border-0"
          style={{ background: 'var(--site-btn, #1e1a16)' }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Kostenlos beraten 🏠
        </motion.button>
      </div>

      {/* Mobile hamburger */}
      <button
        className="md:hidden flex flex-col gap-1.5 p-2"
        onClick={() => setOpen(!open)}
        aria-label="Menu"
      >
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className="block h-0.5 w-6 rounded-full"
            style={{ background: (scrolled || isProperties) ? '#333' : 'white' }}
            animate={{
              rotate: open && i === 0 ? 45 : open && i === 2 ? -45 : 0,
              y: open && i === 0 ? 8 : open && i === 2 ? -8 : 0,
              opacity: open && i === 1 ? 0 : 1,
            }}
          />
        ))}
      </button>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="md:hidden absolute top-full left-0 right-0 glass py-6 px-6 flex flex-col gap-4"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <Link to="/immobilien" className="font-nunito font-700 text-gray-900 text-lg" onClick={() => setOpen(false)}>
              🏠 Immobilien
            </Link>
            {ANCHOR_LINKS.map((l) => (
              <button
                key={l.href}
                onClick={() => handleAnchor(l.href)}
                className="font-nunito font-600 text-gray-700 text-lg text-left bg-transparent border-0 cursor-pointer"
              >
                {l.label}
              </button>
            ))}
            <button
              onClick={() => handleAnchor('#buchen')}
              className="font-nunito font-700 text-center py-3 rounded-full text-white border-0 cursor-pointer"
              style={{ background: 'var(--site-btn, #1e1a16)' }}
            >
              Kostenlos beraten 🏠
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  )
}
