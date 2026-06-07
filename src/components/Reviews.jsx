import { motion } from 'framer-motion'
import { useAdmin } from '../context/AdminContext'
import EditableText from './admin/EditableText'
import { TestimonialsColumn } from './ui/testimonials-columns-1'

const FALLBACK_TESTIMONIALS = [
  { text: 'Wir haben über NordzypernImmo unsere Traumvilla in Kyrenia gefunden. Die Beratung war erstklassig und der gesamte Kaufprozess reibungslos.', name: 'Markus & Julia S.', role: 'Käufer · Kyrenia', stars: 5 },
  { text: 'Als Erstkäufer in Nordzypern war ich unsicher. Das Team hat mich von Anfang bis Ende begleitet. Absolute Empfehlung!', name: 'Thomas B.', role: 'Käufer · Famagusta', stars: 5 },
  { text: 'Innerhalb von drei Wochen hatten wir unser Ferienhaus gefunden. Professionell, ehrlich und immer erreichbar.', name: 'Sandra M.', role: 'Käuferin · Iskele', stars: 5 },
  { text: 'Die Immobilienauswahl ist hervorragend und die Preise fair. Unser Apartment in Nikosia ist genau das, was wir gesucht haben.', name: 'Peter & Anna K.', role: 'Käufer · Nikosia', stars: 5 },
  { text: 'NordzypernImmo hat uns bei allen rechtlichen Fragen geholfen. Ohne diese Unterstützung wäre der Kauf in einem fremden Land viel schwieriger gewesen.', name: 'Klaus H.', role: 'Investor · Kyrenia', stars: 5 },
  { text: 'Fantastischer Service! Wir haben unser Penthouse deutlich unter dem Marktwert erworben dank der Marktkenntnisse des Teams.', name: 'Michael & Lisa F.', role: 'Käufer · Long Beach', stars: 5 },
  { text: 'Transparente Kommunikation, keine versteckten Kosten. Endlich ein Makler dem man vertrauen kann.', name: 'Renate W.', role: 'Käuferin · Esentepe', stars: 5 },
  { text: 'Von der ersten Besichtigung bis zur Schlüsselübergabe wurde alles perfekt koordiniert. Danke für alles!', name: 'Stefan P.', role: 'Käufer · Famagusta', stars: 5 },
  { text: 'Ich lebe seit zwei Jahren in meiner Villa und bin täglich dankbar, diesen Schritt gewagt zu haben. NordzypernImmo machte es möglich.', name: 'Brigitte L.', role: 'Käuferin · Kyrenia', stars: 5 },
]

export default function Reviews() {
  const { content } = useAdmin()
  if (!content) return null
  const { reviews } = content

  const rawItems = reviews?.items || []
  const testimonials = rawItems.length >= 6
    ? rawItems.map(r => ({ text: r.text, name: r.author, role: r.dog || 'Kunde', stars: r.stars ?? 5 }))
    : FALLBACK_TESTIMONIALS

  const col1 = testimonials.slice(0, 3)
  const col2 = testimonials.slice(3, 6)
  const col3 = testimonials.slice(6, 9)

  return (
    <section id="bewertungen" className="py-24 relative overflow-hidden" style={{ background: 'var(--site-bg, #FAFAFA)' }}>
      <div className="max-w-7xl mx-auto px-8 md:px-16">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true }}
          className="flex flex-col items-center justify-center max-w-2xl mx-auto mb-14 text-center"
        >
          <span className="inline-block font-nunito text-xs font-700 tracking-[0.25em] uppercase mb-4 px-4 py-1.5 rounded-full"
            style={{ background: 'var(--site-badge-bg, #f0ede8)', color: 'var(--site-badge-text, #7a6e65)' }}>
            <EditableText path="reviews.label">{reviews?.label || 'Kundenstimmen'}</EditableText>
          </span>
          <h2 className="font-playfair text-3xl md:text-5xl text-gray-900 mb-4" style={{ fontWeight: 700 }}>
            <EditableText path="reviews.title">{reviews?.title || 'Was unsere Kunden sagen'}</EditableText>
          </h2>
          <p className="font-nunito text-gray-400 text-sm">
            Echte Erfahrungen von Käufern und Mietern in Nordzypern
          </p>

          {/* Rating badge */}
          <div className="flex items-center gap-3 mt-6 px-5 py-3 rounded-2xl bg-white" style={{ boxShadow: '0 2px 16px rgba(0,0,0,0.07)', border: '1px solid #eee' }}>
            <span className="font-playfair text-3xl text-gray-900" style={{ fontWeight: 700 }}>
              <EditableText path="reviews.rating">{reviews?.rating || '4.9'}</EditableText>
            </span>
            <div>
              <div className="flex text-yellow-400 text-sm">★★★★★</div>
              <p className="font-nunito text-gray-400 text-xs">
                <EditableText path="reviews.ratingCount">{reviews?.ratingCount || 'Aus über 120 Bewertungen'}</EditableText>
              </p>
            </div>
          </div>
        </motion.div>

        {/* Columns */}
        <div
          className="flex justify-center gap-6 mt-4"
          style={{
            maskImage: 'linear-gradient(to bottom, transparent, black 15%, black 85%, transparent)',
            WebkitMaskImage: 'linear-gradient(to bottom, transparent, black 15%, black 85%, transparent)',
            maxHeight: 720,
            overflow: 'hidden',
          }}
        >
          <TestimonialsColumn testimonials={col1} duration={18} />
          <TestimonialsColumn testimonials={col2} duration={22} className="hidden md:block" />
          <TestimonialsColumn testimonials={col3} duration={20} className="hidden lg:block" />
        </div>
      </div>
    </section>
  )
}
