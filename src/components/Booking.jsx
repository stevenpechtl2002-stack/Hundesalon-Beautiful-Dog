import { motion } from 'framer-motion'

export default function Booking() {
  return (
    <section id="buchen" className="py-24"
      style={{ background: '#FAFAFA' }}>
      <div className="max-w-2xl mx-auto px-8 md:px-16">

        <motion.div className="text-center mb-12"
          initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}>
          <span className="inline-block font-nunito text-xs font-700 tracking-[0.25em] uppercase mb-3 px-4 py-1.5 rounded-full"
            style={{ background: '#f0ede8', color: '#7a6e65' }}>Termin buchen</span>
          <h2 className="font-pacifico text-3xl md:text-5xl text-gray-900 mt-2">Ihren Wunschtermin sichern</h2>
          <p className="font-nunito text-gray-400 mt-4">Wählen Sie einfach Ihren Wunschtermin</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          className="flex justify-center">
          <iframe
            src="https://www.zentime.io/embed/kalender/f3cb0bc0-9fb1-4df3-8fe3-b8d1946f735c"
            width="100%"
            height="720"
            frameBorder="0"
            style={{
              maxWidth: 480,
              borderRadius: 16,
              boxShadow: '0 8px 30px rgba(0,0,0,0.1)',
              display: 'block',
            }}
            title="Termin buchen"
          />
        </motion.div>

      </div>
    </section>
  )
}
