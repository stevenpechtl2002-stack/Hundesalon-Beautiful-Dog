import { motion } from 'framer-motion'
import { Badge } from './badge'
import { useAdmin } from '../../context/AdminContext'
import EditableText from '../admin/EditableText'

const FEATURE_IMAGES = [
  'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1560520653-9e0e4c89eb11?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1533104816931-20fa691ff6ca?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=800&q=80',
]

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.10 } },
}
const item = {
  hidden: { opacity: 0, y: 32 },
  show: { opacity: 1, y: 0, transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] } },
}

function Feature() {
  const { content } = useAdmin()
  if (!content) return null
  const { features } = content

  return (
    <section id="ueber-uns" className="w-full py-20 lg:py-32" style={{ background: 'var(--site-bg, #FAFAFA)' }}>
      <div className="max-w-7xl mx-auto px-8 md:px-16">
        <div className="flex flex-col gap-14">

          {/* Header */}
          <motion.div
            className="flex flex-col gap-4 items-start"
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <Badge
              className="font-nunito font-700 text-xs tracking-[0.25em] uppercase"
              style={{ background: 'var(--site-badge-bg, #f0ede8)', color: 'var(--site-badge-text, #7a6e65)', border: 'none' }}
            >
              <EditableText path="features.label">{features.label}</EditableText>
            </Badge>

            <div className="flex flex-col gap-3 max-w-2xl">
              <h2 className="font-playfair text-3xl md:text-5xl tracking-tight text-gray-900" style={{ fontWeight: 700 }}>
                <EditableText path="features.title">{features.title}</EditableText>
              </h2>
              <p className="font-nunito text-lg leading-relaxed max-w-xl" style={{ color: '#9e9490' }}>
                <EditableText path="features.subtitle">{features.subtitle}</EditableText>
              </p>
            </div>
          </motion.div>

          {/* Grid */}
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7"
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.1 }}
          >
            {features.items.map((feat, i) => (
              <motion.div
                key={i}
                variants={item}
                className="flex flex-col gap-3 group"
                whileHover={{ y: -4 }}
                transition={{ type: 'spring', stiffness: 300, damping: 24 }}
              >
                {/* Image */}
                <div
                  className="rounded-2xl overflow-hidden mb-1"
                  style={{ aspectRatio: '16/9', boxShadow: '0 4px 24px rgba(0,0,0,0.08)' }}
                >
                  <img
                    src={FEATURE_IMAGES[i % FEATURE_IMAGES.length]}
                    alt={feat.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>

                {/* Icon + Title */}
                <div className="flex items-center gap-2.5 mt-1">
                  <span className="text-2xl">
                    <EditableText path={`features.items.${i}.icon`} tag="span">{feat.icon}</EditableText>
                  </span>
                  <h3 className="font-playfair text-xl text-gray-900 tracking-tight" style={{ fontWeight: 600 }}>
                    <EditableText path={`features.items.${i}.title`} tag="span">{feat.title}</EditableText>
                  </h3>
                </div>

                {/* Description */}
                <p className="font-nunito text-base leading-relaxed" style={{ color: '#9e9490' }}>
                  <EditableText path={`features.items.${i}.desc`} tag="span">{feat.desc}</EditableText>
                </p>
              </motion.div>
            ))}
          </motion.div>

        </div>
      </div>
    </section>
  )
}

export { Feature }
