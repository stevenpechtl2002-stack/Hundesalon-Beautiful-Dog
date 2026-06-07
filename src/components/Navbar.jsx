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
  return (
    <svg width="38" height="28" viewBox="0 0 200 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Cyprus island silhouette — top-down view */}
      <path
        d="
          M 18 72
          C 20 65, 28 58, 38 54
          C 48 50, 52 44, 58 40
          C 64 36, 72 32, 80 30
          C 90 28, 100 26, 110 27
          C 120 28, 128 30, 136 35
          C 144 40, 150 46, 154 50
          C 162 48, 170 44, 176 42
          C 180 40, 183 41, 182 45
          C 181 49, 176 52, 170 55
          C 164 58, 158 58, 154 60
          C 152 66, 148 72, 142 78
          C 136 84, 128 88, 118 90
          C 108 92, 96 92, 84 90
          C 72 88, 60 84, 50 80
          C 40 76, 28 76, 22 76
          Z
        "
        fill={color}
        opacity="0.95"
      />
      {/* Karpass peninsula (pointy bit top-right) */}
      <path
        d="
          M 154 50
          C 160 46, 168 42, 176 40
          C 180 39, 183 40, 182 44
          C 181 48, 175 52, 168 54
          C 162 56, 156 57, 154 58
          Z
        "
        fill={color}
        opacity="0.9"
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
        <motion.div whileHover={{ scale: 1.1 }} transition={{ type: 'spring', stiffness: 400 }}>
          <CyprusSvg color={logoColor} />
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
