import { motion } from 'framer-motion'
import { useAdmin } from '../context/AdminContext'
import EditableText from './admin/EditableText'

export default function Booking() {
  const { content } = useAdmin()
  if (!content) return null
  const { contact } = content

  return (
    <section id="buchen" className="py-24" style={{ background: 'var(--site-bg, #FAFAFA)' }}>
      <div className="max-w-3xl mx-auto px-8 md:px-16">

        <motion.div className="text-center mb-14"
          initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}>
          <span className="inline-block font-nunito text-xs font-700 tracking-[0.25em] uppercase mb-3 px-4 py-1.5 rounded-full"
            style={{ background: 'var(--site-badge-bg, #f0ede8)', color: 'var(--site-badge-text, #7a6e65)' }}>Kontakt</span>
          <h2 className="font-pacifico text-3xl md:text-5xl text-gray-900 mt-2">Kostenlos beraten lassen</h2>
          <p className="font-nunito text-gray-400 mt-4 max-w-xl mx-auto">
            Unverbindliche Erstberatung — wir melden uns innerhalb von 24 Stunden bei Ihnen
          </p>
        </motion.div>

        <motion.div className="grid md:grid-cols-3 gap-5"
          initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.7, delay: 0.1 }}>

          {/* WhatsApp */}
          <motion.a
            href={`https://wa.me/${contact.phoneMobile?.replace(/\s|\+|-/g,'')}`}
            target="_blank" rel="noopener noreferrer"
            className="flex flex-col items-center gap-4 p-8 rounded-3xl bg-white cursor-pointer"
            style={{ boxShadow: '0 2px 16px rgba(0,0,0,0.06)', border: '1px solid #eeebe6' }}
            whileHover={{ y: -6, boxShadow: '0 16px 40px rgba(0,0,0,0.10)' }}>
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl"
              style={{ background: '#dcfce7' }}>💬</div>
            <div className="text-center">
              <p className="font-nunito font-800 text-gray-800 mb-1">WhatsApp</p>
              <p className="font-nunito text-gray-400 text-sm">Direkt chatten</p>
              <p className="font-nunito font-700 text-sm mt-2" style={{ color: '#16a34a' }}>
                <EditableText path="contact.phoneMobile" tag="span">{contact.phoneMobile}</EditableText>
              </p>
            </div>
          </motion.a>

          {/* Telefon */}
          <motion.a
            href={`tel:${contact.phone?.replace(/\s|\+|-/g,'')}`}
            className="flex flex-col items-center gap-4 p-8 rounded-3xl bg-white cursor-pointer"
            style={{ boxShadow: '0 2px 16px rgba(0,0,0,0.06)', border: '1px solid #eeebe6' }}
            whileHover={{ y: -6, boxShadow: '0 16px 40px rgba(0,0,0,0.10)' }}>
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl"
              style={{ background: 'var(--site-badge-bg, #f0ede8)' }}>📞</div>
            <div className="text-center">
              <p className="font-nunito font-800 text-gray-800 mb-1">Telefon</p>
              <p className="font-nunito text-gray-400 text-sm">Mo–Fr 9–18 Uhr</p>
              <p className="font-nunito font-700 text-sm mt-2" style={{ color: 'var(--site-btn, #1e1a16)' }}>
                <EditableText path="contact.phone" tag="span">{contact.phone}</EditableText>
              </p>
            </div>
          </motion.a>

          {/* E-Mail */}
          <motion.a
            href={`mailto:${contact.email}`}
            className="flex flex-col items-center gap-4 p-8 rounded-3xl bg-white cursor-pointer"
            style={{ boxShadow: '0 2px 16px rgba(0,0,0,0.06)', border: '1px solid #eeebe6' }}
            whileHover={{ y: -6, boxShadow: '0 16px 40px rgba(0,0,0,0.10)' }}>
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl"
              style={{ background: 'var(--site-badge-bg, #f0ede8)' }}>✉️</div>
            <div className="text-center">
              <p className="font-nunito font-800 text-gray-800 mb-1">E-Mail</p>
              <p className="font-nunito text-gray-400 text-sm">Antwort in 24h</p>
              <p className="font-nunito font-700 text-xs mt-2" style={{ color: 'var(--site-btn, #1e1a16)' }}>
                <EditableText path="contact.email" tag="span">{contact.email}</EditableText>
              </p>
            </div>
          </motion.a>
        </motion.div>

        <motion.div className="mt-10 text-center"
          initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.3 }}>
          <motion.a
            href={`https://wa.me/${contact.phoneMobile?.replace(/\s|\+|-/g,'')}`}
            target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-3 font-nunito font-800 text-sm px-10 py-4 rounded-2xl text-white"
            style={{ background: 'var(--site-btn, #1e1a16)', boxShadow: '0 8px 28px rgba(0,0,0,0.20)' }}
            whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
            <span>💬</span> Jetzt kostenlos auf WhatsApp beraten lassen
          </motion.a>
        </motion.div>

      </div>
    </section>
  )
}
