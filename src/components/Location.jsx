import { motion } from 'framer-motion'
import { useAdmin } from '../context/AdminContext'
import EditableText from './admin/EditableText'

export default function Location() {
  const { content } = useAdmin()
  if (!content) return null
  const { contact, openingHours } = content

  return (
    <section className="py-24" style={{ background:'white' }}>
      <div className="max-w-7xl mx-auto px-8 md:px-16">
        <motion.div className="text-center mb-14"
          initial={{ opacity:0, y:30 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }}>
          <span className="inline-block font-nunito text-xs font-700 tracking-[0.25em] uppercase mb-3 px-4 py-1.5 rounded-full" style={{ background:'#f0ede8', color:'#7a6e65' }}>Unser Salon</span>
          <h2 className="font-pacifico text-3xl md:text-4xl text-gray-900 mt-2">Besuchen Sie uns in Pforzheim 📍</h2>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 items-center">
          <motion.div className="rounded-3xl overflow-hidden relative" style={{ height:380, boxShadow:'0 8px 40px rgba(0,0,0,0.07)' }}
            initial={{ opacity:0, x:-30 }} whileInView={{ opacity:1, x:0 }} viewport={{ once:true }} transition={{ duration:0.7 }}>
            <iframe title="Hundesalon Beautiful Dog Standort"
              src="https://www.openstreetmap.org/export/embed.html?bbox=8.6890,48.8820,8.7290,48.9020&layer=mapnik&marker=48.8921,8.7090"
              className="w-full h-full border-0" style={{ borderRadius:24 }} />
          </motion.div>

          <motion.div initial={{ opacity:0, x:30 }} whileInView={{ opacity:1, x:0 }} viewport={{ once:true }} transition={{ duration:0.7 }}>
            <div className="glass rounded-3xl p-8 flex flex-col gap-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0" style={{ background:'#f5f3f0' }}>🐾</div>
                <div>
                  <h3 className="font-pacifico text-xl text-gray-900">Hundesalon Beautiful Dog</h3>
                  <p className="font-nunito text-gray-400 text-sm">Pforzheim</p>
                </div>
              </div>

              <div className="space-y-4 font-nunito text-sm">
                <div className="flex items-start gap-3">
                  <span className="text-base mt-0.5">📍</span>
                  <div>
                    <p className="font-600 text-gray-400 text-xs uppercase tracking-wide mb-0.5">Adresse</p>
                    <EditableText path="contact.address" tag="p" className="font-600 text-gray-700">{contact.address}</EditableText>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-base mt-0.5">📞</span>
                  <div>
                    <p className="font-600 text-gray-400 text-xs uppercase tracking-wide mb-0.5">Telefon</p>
                    <a href={`tel:${contact.phone?.replace(/\s|-/g,'')}`} className="font-600 text-gray-700 hover:text-pink-400 transition-colors">
                      <EditableText path="contact.phone" tag="span">{contact.phone}</EditableText>
                    </a>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-base mt-0.5">✉️</span>
                  <div>
                    <p className="font-600 text-gray-400 text-xs uppercase tracking-wide mb-0.5">E-Mail</p>
                    <a href={`mailto:${contact.email}`} className="font-600 text-gray-700 hover:text-pink-400 transition-colors">
                      <EditableText path="contact.email" tag="span">{contact.email}</EditableText>
                    </a>
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-100 pt-5">
                <p className="font-nunito font-700 text-gray-700 text-sm mb-3">Öffnungszeiten</p>
                <div className="space-y-2">
                  {openingHours.map(({ days, hours, isOpen }, i) => (
                    <div key={i} className="flex justify-between items-center">
                      <EditableText path={`openingHours.${i}.days`} tag="span" className="font-nunito text-gray-500 text-sm">{days}</EditableText>
                      <EditableText path={`openingHours.${i}.hours`} tag="span" className={`font-nunito font-700 text-sm ${isOpen ? 'text-gray-800' : 'text-gray-300'}`}>{hours}</EditableText>
                    </div>
                  ))}
                </div>
              </div>

              <motion.a href="https://www.google.com/maps/search/Richard-Wagner-Allee+15,+75179+Pforzheim"
                target="_blank" rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 p-3 rounded-xl font-nunito font-700 text-sm"
                style={{ background:'#f5f3f0', border:'1px solid #e8e2db', color:'#5a4a3a' }}
                whileHover={{ scale:1.02 }}>
                📍 In Google Maps öffnen
              </motion.a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
