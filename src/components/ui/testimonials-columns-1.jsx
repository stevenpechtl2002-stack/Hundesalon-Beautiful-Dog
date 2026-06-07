import React from 'react'
import { motion } from 'framer-motion'

export function TestimonialsColumn({ className, testimonials, duration = 10 }) {
  return (
    <div className={className} style={{ overflow: 'hidden' }}>
      <motion.div
        animate={{ translateY: '-50%' }}
        transition={{ duration, repeat: Infinity, ease: 'linear', repeatType: 'loop' }}
        className="flex flex-col gap-6 pb-6"
      >
        {[...Array(2)].map((_, index) => (
          <React.Fragment key={index}>
            {testimonials.map(({ text, image, name, role, stars }, i) => (
              <div
                key={i}
                className="p-7 rounded-3xl max-w-xs w-full"
                style={{
                  background: 'white',
                  border: '1.5px solid #eee',
                  boxShadow: '0 4px 24px rgba(0,0,0,0.06)',
                }}
              >
                <div className="flex gap-0.5 mb-3">
                  {Array(stars ?? 5).fill(0).map((_, s) => (
                    <span key={s} style={{ color: '#f59e0b', fontSize: 14 }}>★</span>
                  ))}
                </div>
                <p className="font-nunito text-gray-600 text-sm leading-relaxed italic">„{text}"</p>
                <div className="flex items-center gap-3 mt-5 pt-4" style={{ borderTop: '1px solid #f3f3f3' }}>
                  {image ? (
                    <img src={image} alt={name} className="w-10 h-10 rounded-full object-cover flex-shrink-0" />
                  ) : (
                    <div className="w-10 h-10 rounded-full flex items-center justify-center text-lg flex-shrink-0"
                      style={{ background: 'var(--site-badge-bg, #f0ede8)' }}>
                      {name?.[0] ?? '👤'}
                    </div>
                  )}
                  <div>
                    <p className="font-nunito font-800 text-gray-800 text-sm leading-5">{name}</p>
                    <p className="font-nunito text-gray-400 text-xs leading-5">{role}</p>
                  </div>
                </div>
              </div>
            ))}
          </React.Fragment>
        ))}
      </motion.div>
    </div>
  )
}
