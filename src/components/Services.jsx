import { motion } from 'framer-motion'
import { useAdmin } from '../context/AdminContext'
import EditableText from './admin/EditableText'

const container = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } }
const card = { hidden: { opacity: 0, y: 30 }, show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } } }

export default function Services() {
  const { content, updateService } = useAdmin()
  if (!content) return null
  const raw = content.services?.items || content.services || []
  const services = raw

  return (
    <section id="leistungen" className="py-24" style={{ background: '#FAFAFA' }}>
      <div className="max-w-7xl mx-auto px-8 md:px-16">
        <motion.div className="text-center mb-12"
          initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}>
          <span className="inline-block font-nunito text-xs font-700 tracking-[0.25em] uppercase mb-3 px-4 py-1.5 rounded-full" style={{ background: '#f0ede8', color: '#7a6e65' }}>Leistungen</span>
          <h2 className="font-pacifico text-3xl md:text-5xl text-gray-900">
            <EditableText path="services.title">{content.services?.title || 'Alles für Ihren Liebling'}</EditableText>
          </h2>
          <p className="font-nunito text-gray-400 mt-3 text-sm">
            <EditableText path="services.subtitle">{content.services?.subtitle || 'Professionelle Pflege mit Herz — spezialisiert auf kleine und mittelgroße Rassen'}</EditableText>
          </p>
        </motion.div>

        <motion.div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5" variants={container} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.1 }}>
          {services.map((s, i) => (
            <motion.div key={i} variants={card} className="bg-white rounded-3xl p-7 flex flex-col gap-5"
              style={{ boxShadow: '0 2px 16px rgba(0,0,0,0.06)', border: '1px solid #eeebe6' }}
              whileHover={{ y: -6, boxShadow: '0 16px 48px rgba(0,0,0,0.10)' }} transition={{ duration: 0.25 }}>
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0" style={{ background: '#f5f3f0' }}>
                {s.icon}
              </div>
              <div className="flex-1">
                <EditableText path={`services.items.${i}.title`} tag="h3" className="font-nunito font-800 text-gray-800 mb-2">
                  {s.title}
                </EditableText>
                <EditableText path={`services.items.${i}.desc`} tag="p" className="font-nunito text-gray-400 text-sm leading-relaxed">
                  {s.desc}
                </EditableText>
              </div>
              <div className="flex items-center justify-end pt-3 border-t border-gray-50">
                <motion.a href="#buchen" className="font-nunito font-700 text-xs px-4 py-2 rounded-xl text-white"
                  style={{ background: '#1e1a16' }} whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.95 }}>
                  Termin anfragen
                </motion.a>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <div className="flex justify-center mt-10">
          <motion.a href="#buchen" className="font-nunito font-700 text-sm px-7 py-3.5 rounded-2xl text-white"
            style={{ background: '#1e1a16', boxShadow: '0 6px 24px rgba(0,0,0,0.18)' }}
            whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
            Alle Leistungen ansehen →
          </motion.a>
        </div>
      </div>
    </section>
  )
}
