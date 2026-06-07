import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { useAdmin } from '../context/AdminContext'
import EditableText from './admin/EditableText'

const HOUSE_POS = [
  {x:8,y:25,r:-20,d:0},{x:16,y:65,r:15,d:0.4},{x:25,y:35,r:-10,d:0.8},
  {x:35,y:72,r:22,d:1.2},{x:47,y:18,r:-15,d:1.6},{x:55,y:58,r:10,d:2.0},
  {x:65,y:28,r:-18,d:2.4},{x:75,y:75,r:20,d:2.8},{x:85,y:42,r:-8,d:3.2},
  {x:93,y:82,r:25,d:3.6},
]
const container = { hidden:{}, show:{ transition:{ staggerChildren:0.08 } } }
const row = { hidden:{ opacity:0, y:30 }, show:{ opacity:1, y:0, transition:{ duration:0.6, ease:[0.22,1,0.36,1] } } }

export default function Footer() {
  const { content } = useAdmin()
  if (!content) return null
  const { contact, openingHours } = content

  return (
    <footer className="relative pt-20 pb-8 overflow-hidden" style={{ background:'linear-gradient(160deg,#1e1e2e,#12121a)' }}>
      {HOUSE_POS.map((p,i) => (
        <motion.div key={i} className="absolute pointer-events-none text-white"
          style={{ left:`${p.x}%`, top:`${p.y}%`, rotate:p.r, fontSize:16 }}
          animate={{ opacity:[0,0.10,0] }}
          transition={{ duration:4, delay:p.d, repeat:Infinity, repeatDelay:9 }}>
          🏠
        </motion.div>
      ))}

      <motion.div className="relative z-10 max-w-7xl mx-auto px-8 md:px-16" variants={container} initial="hidden" whileInView="show" viewport={{ once:true }}>
        <div className="grid md:grid-cols-4 gap-12 mb-16">

          <motion.div variants={row} className="md:col-span-2">
            <div className="flex items-center gap-3 mb-5">
              <span className="text-3xl">🏠</span>
              <h3 className="font-pacifico text-2xl" style={{ color:'var(--site-badge-bg, #c8beb4)' }}>NordzypernImmo</h3>
            </div>
            <p className="font-nunito text-gray-500 leading-relaxed mb-6 max-w-xs">
              <EditableText path="footer.tagline">{content.footer?.tagline || 'Pforzheims Premium Hundesalon — professionelle Pflege mit Liebe und Leidenschaft seit über 15 Jahren.'}</EditableText>
            </p>
          </motion.div>

          <motion.div variants={row}>
            <h4 className="font-nunito font-800 text-white text-xs tracking-[0.25em] uppercase mb-5">Kontakt</h4>
            <div className="space-y-3 font-nunito text-gray-500 text-sm">
              <p className="flex items-start gap-2"><span className="mt-0.5">📍</span>
                <EditableText path="contact.address" tag="span">{contact.address}</EditableText>
              </p>
              <p className="flex items-center gap-2"><span>📞</span>
                <a href={`tel:${contact.phone?.replace(/\s|-/g,'')}`} className="hover:text-gray-300 transition-colors">
                  <EditableText path="contact.phone" tag="span">{contact.phone}</EditableText>
                </a>
              </p>
              <p className="flex items-center gap-2"><span>✉️</span>
                <a href={`mailto:${contact.email}`} className="hover:text-gray-300 transition-colors text-xs">
                  <EditableText path="contact.email" tag="span">{contact.email}</EditableText>
                </a>
              </p>
            </div>
          </motion.div>

          <motion.div variants={row}>
            <h4 className="font-nunito font-800 text-white text-xs tracking-[0.25em] uppercase mb-5">Öffnungszeiten</h4>
            <div className="space-y-2.5 font-nunito text-sm">
              {openingHours.map(({ days, hours, isOpen }, i) => (
                <div key={i} className="flex justify-between gap-4">
                  <EditableText path={`openingHours.${i}.days`} tag="span" className="text-gray-500">{days}</EditableText>
                  <EditableText path={`openingHours.${i}.hours`} tag="span" className={isOpen ? 'text-white font-600' : 'text-gray-600'}>{hours}</EditableText>
                </div>
              ))}
            </div>
            <motion.a href="#buchen" className="inline-block mt-6 font-nunito font-700 text-sm px-5 py-2.5 rounded-xl"
              style={{ background:'white', color:'var(--site-btn, #1e1a16)' }}
              whileHover={{ scale:1.05 }} whileTap={{ scale:0.96 }}>
              Jetzt beraten 🏠
            </motion.a>
          </motion.div>
        </div>

        <motion.div variants={row} className="border-t border-gray-800 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="font-nunito text-gray-600 text-xs">
            <EditableText path="footer.copyright" tag="span">{content.footer?.copyright || '© 2025 NordzypernImmo. Alle Rechte vorbehalten.'}</EditableText>
          </p>
          <div className="flex gap-6 items-center">
            <Link to="/impressum" className="font-nunito text-gray-600 text-xs hover:text-gray-400 transition-colors">Impressum</Link>
            <Link to="/datenschutz" className="font-nunito text-gray-600 text-xs hover:text-gray-400 transition-colors">Datenschutz</Link>
            <Link to="/agb" className="font-nunito text-gray-600 text-xs hover:text-gray-400 transition-colors">AGB</Link>
          </div>
        </motion.div>
      </motion.div>
    </footer>
  )
}
