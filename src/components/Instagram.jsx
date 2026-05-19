import { motion } from 'framer-motion'
import { useAdmin } from '../context/AdminContext'
import EditableText from './admin/EditableText'
import EditableImage from './admin/EditableImage'

const FALLBACK_PHOTOS = [
  'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400&q=80',
  'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=400&q=80',
  'https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?w=400&q=80',
  'https://images.unsplash.com/photo-1477884213360-7e9d7dcc1e48?w=400&q=80',
  'https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?w=400&q=80',
  'https://images.unsplash.com/photo-1574158622682-e40e69881006?w=400&q=80',
]

const container = { hidden: {}, show: { transition: { staggerChildren: 0.07 } } }
const item = { hidden: { opacity: 0, scale: 0.88 }, show: { opacity: 1, scale: 1, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } } }

export default function Instagram() {
  const { content } = useAdmin()
  if (!content) return null
  const { instagram } = content

  return (
    <section className="py-24" style={{ background: 'white' }}>
      <div className="max-w-7xl mx-auto px-8 md:px-16">
        <motion.div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12"
          initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}>
          <div>
            <span className="inline-block font-nunito text-xs font-700 tracking-[0.25em] uppercase mb-3 px-4 py-1.5 rounded-full"
              style={{ background: '#FFB5D818', color: '#FFB5D8' }}>
              <EditableText path="instagram.label">{instagram.label}</EditableText>
            </span>
            <h2 className="font-pacifico text-3xl md:text-5xl text-gray-900 mt-2">
              <EditableText path="instagram.handle">{instagram.handle}</EditableText>
            </h2>
          </div>
          <motion.a href={instagram.url} target="_blank" rel="noopener noreferrer"
            className="font-nunito font-700 text-sm px-6 py-3 rounded-2xl text-gray-600 self-start whitespace-nowrap flex items-center gap-2"
            style={{ background: '#f8f8f8', border: '1px solid #eee' }}
            whileHover={{ scale: 1.04, background: 'linear-gradient(135deg,#FFB5D8,#C5B5EA)', color: 'white', border: '1px solid transparent' }}>
            Folgen
          </motion.a>
        </motion.div>

        <motion.div className="grid grid-cols-2 md:grid-cols-3 gap-4"
          variants={container} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.1 }}>
          {instagram.photos.map((p, i) => (
            <motion.div key={i} variants={item} className="relative overflow-hidden rounded-3xl aspect-square group">
              <EditableImage
                path={`instagram.photos.${i}.url`}
                src={p.url}
                alt={`Foto ${i + 1}`}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                fallback={<img src={FALLBACK_PHOTOS[i]} alt="" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />}
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/35 transition-all duration-300 flex items-center justify-center pointer-events-none">
                <p className="opacity-0 group-hover:opacity-100 font-nunito font-700 text-sm text-white">❤️ {p.likes}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
