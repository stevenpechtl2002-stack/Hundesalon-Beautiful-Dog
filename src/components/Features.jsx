import { motion } from 'framer-motion'
import { useAdmin } from '../context/AdminContext'
import EditableText from './admin/EditableText'

const container = { hidden: {}, show: { transition: { staggerChildren: 0.09 } } }
const card = { hidden: { opacity: 0, y: 40 }, show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } } }

export default function Features() {
  const { content } = useAdmin()
  if (!content) return null
  const { features } = content

  return (
    <section className="py-24" style={{ background: 'white' }}>
      <div className="max-w-7xl mx-auto px-8 md:px-16">
        <motion.div className="text-center mb-14"
          initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}>
          <span className="inline-block font-nunito text-xs font-700 tracking-[0.25em] uppercase mb-3 px-4 py-1.5 rounded-full"
            style={{ background: '#f0ede8', color: '#7a6e65' }}>
            <EditableText path="features.label">{features.label}</EditableText>
          </span>
          <h2 className="font-pacifico text-3xl md:text-5xl text-gray-900 mt-2">
            <EditableText path="features.title">{features.title}</EditableText>
          </h2>
          <p className="font-nunito text-gray-400 mt-4 max-w-lg mx-auto">
            <EditableText path="features.subtitle">{features.subtitle}</EditableText>
          </p>
        </motion.div>

        <motion.div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5"
          variants={container} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.1 }}>
          {features.items.map((item, i) => (
            <motion.div key={i} variants={card}
              className="group flex gap-4 p-6 rounded-3xl border border-transparent hover:border-rosa/30 transition-all duration-300"
              style={{ background: 'white', boxShadow: '0 2px 20px rgba(0,0,0,0.05)' }}
              whileHover={{ y: -6, boxShadow: '0 16px 48px rgba(0,0,0,0.08)' }}>
              <div className="w-12 h-12 flex-shrink-0 rounded-2xl flex items-center justify-center text-2xl"
                style={{ background: '#f5f3f0' }}>
                <EditableText path={`features.items.${i}.icon`} tag="span">{item.icon}</EditableText>
              </div>
              <div>
                <EditableText path={`features.items.${i}.title`} tag="h3" className="font-nunito font-800 text-gray-800 mb-1.5">
                  {item.title}
                </EditableText>
                <EditableText path={`features.items.${i}.desc`} tag="p" className="font-nunito text-gray-400 text-sm leading-relaxed">
                  {item.desc}
                </EditableText>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
