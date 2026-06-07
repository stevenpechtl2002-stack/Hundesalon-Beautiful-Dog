import React from 'react'
import { motion } from 'framer-motion'

export function TestimonialsColumn({ className, testimonials, duration = 10 }) {
  return (
    <div className={className} style={{ overflow: 'hidden', minWidth: 0 }}>
      <motion.div
        animate={{ translateY: '-50%' }}
        transition={{ duration, repeat: Infinity, ease: 'linear', repeatType: 'loop' }}
        style={{ display: 'flex', flexDirection: 'column', gap: 16, paddingBottom: 16 }}
      >
        {[...Array(2)].map((_, index) => (
          <React.Fragment key={index}>
            {testimonials.map(({ text, image, name, role, stars }, i) => (
              <div
                key={i}
                style={{
                  padding: '24px 20px',
                  borderRadius: 20,
                  background: 'white',
                  border: '1.5px solid #eee',
                  boxShadow: '0 4px 24px rgba(0,0,0,0.06)',
                  width: '100%',
                  boxSizing: 'border-box',
                }}
              >
                <div style={{ display: 'flex', gap: 2, marginBottom: 10 }}>
                  {Array(stars ?? 5).fill(0).map((_, s) => (
                    <span key={s} style={{ color: '#f59e0b', fontSize: 13 }}>★</span>
                  ))}
                </div>
                <p className="font-nunito" style={{ color: '#555', fontSize: 13, lineHeight: 1.7, fontStyle: 'italic' }}>
                  „{text}"
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 16, paddingTop: 14, borderTop: '1px solid #f3f3f3' }}>
                  {image ? (
                    <img src={image} alt={name} style={{ width: 36, height: 36, borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }} />
                  ) : (
                    <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--site-badge-bg, #f0ede8)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, flexShrink: 0 }}>
                      {name?.[0] ?? '👤'}
                    </div>
                  )}
                  <div>
                    <p className="font-nunito" style={{ fontWeight: 800, color: '#1a1a1a', fontSize: 13, margin: 0 }}>{name}</p>
                    <p className="font-nunito" style={{ color: '#aaa', fontSize: 12, margin: 0 }}>{role}</p>
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
