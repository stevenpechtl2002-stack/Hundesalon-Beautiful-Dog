import React, { useState, useEffect } from 'react'
import { FaHome, FaUmbrellaBeach, FaMountain, FaSwimmingPool, FaCity } from 'react-icons/fa'

const InteractiveSelector = () => {
  const [activeIndex, setActiveIndex] = useState(0)
  const [animatedOptions, setAnimatedOptions] = useState([])

  const options = [
    {
      title: 'Kyrenia Residences',
      description: 'Meerblick-Apartments ab €185.000',
      image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80',
      icon: <FaHome size={22} className="text-white" />,
    },
    {
      title: 'Strandvillen',
      description: 'Direkter Meerzugang ab €320.000',
      image: 'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?auto=format&fit=crop&w=800&q=80',
      icon: <FaUmbrellaBeach size={22} className="text-white" />,
    },
    {
      title: 'Bergresidenz',
      description: 'Panoramablick auf Kyrenia ab €215.000',
      image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=800&q=80',
      icon: <FaMountain size={22} className="text-white" />,
    },
    {
      title: 'Pool-Penthouse',
      description: 'Luxus-Penthouse mit Infinitypool ab €280.000',
      image: 'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?auto=format&fit=crop&w=800&q=80',
      icon: <FaSwimmingPool size={22} className="text-white" />,
    },
    {
      title: 'City Apartments',
      description: 'Zentral in Nikosia ab €155.000',
      image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80',
      icon: <FaCity size={22} className="text-white" />,
    },
  ]

  useEffect(() => {
    const timers = []
    options.forEach((_, i) => {
      const timer = setTimeout(() => {
        setAnimatedOptions(prev => [...prev, i])
      }, 180 * i)
      timers.push(timer)
    })
    return () => timers.forEach(clearTimeout)
  }, [])

  return (
    <div className="relative flex flex-col items-center justify-center py-24" style={{ background: '#1a1a1a' }}>
      {/* Header */}
      <div className="w-full max-w-2xl px-6 mb-12 text-center">
        <span className="inline-block font-nunito text-xs font-700 tracking-[0.25em] uppercase mb-4 px-4 py-1.5 rounded-full"
          style={{ background: 'rgba(255,255,255,0.08)', color: '#c8beb4' }}>
          Ausgewählte Objekte
        </span>
        <h2 className="font-pacifico text-4xl md:text-5xl text-white mb-4 animate-fadeInTop" style={{ animationDelay: '0.3s' }}>
          Ihr Traumobjekt
        </h2>
        <p className="font-nunito text-lg text-gray-400 max-w-xl mx-auto animate-fadeInTop" style={{ animationDelay: '0.6s' }}>
          Exklusive Immobilien in den schönsten Lagen Nordzyperns — entdecken Sie Ihr neues Zuhause.
        </p>
      </div>

      {/* Selector */}
      <div className="options flex w-full max-w-[900px] h-[420px] mx-auto items-stretch overflow-hidden"
        style={{ minWidth: 320 }}>
        {options.map((option, index) => (
          <div
            key={index}
            onClick={() => index !== activeIndex && setActiveIndex(index)}
            style={{
              backgroundImage: `url('${option.image}')`,
              backgroundSize: activeIndex === index ? 'auto 100%' : 'auto 120%',
              backgroundPosition: 'center',
              opacity: animatedOptions.includes(index) ? 1 : 0,
              transform: animatedOptions.includes(index) ? 'translateX(0)' : 'translateX(-60px)',
              transition: 'opacity 0.6s ease, transform 0.6s ease, flex 0.7s ease, box-shadow 0.7s ease, background-size 0.7s ease',
              minWidth: 60,
              borderWidth: 2,
              borderStyle: 'solid',
              borderColor: activeIndex === index ? 'rgba(255,255,255,0.4)' : '#2a2a2a',
              cursor: activeIndex === index ? 'default' : 'pointer',
              backgroundColor: '#18181b',
              boxShadow: activeIndex === index ? '0 20px 60px rgba(0,0,0,0.5)' : '0 10px 30px rgba(0,0,0,0.3)',
              flex: activeIndex === index ? '7 1 0%' : '1 1 0%',
              zIndex: activeIndex === index ? 10 : 1,
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            {/* Gradient overlay */}
            <div style={{
              position: 'absolute', inset: 0, pointerEvents: 'none',
              background: activeIndex === index
                ? 'linear-gradient(to top, rgba(0,0,0,0.75) 0%, transparent 55%)'
                : 'linear-gradient(to top, rgba(0,0,0,0.5) 0%, transparent 60%)',
              transition: 'all 0.7s ease',
            }} />

            {/* Label */}
            <div style={{
              position: 'absolute', left: 0, right: 0, bottom: 20,
              display: 'flex', alignItems: 'center', padding: '0 16px', gap: 12, zIndex: 2,
            }}>
              <div style={{
                minWidth: 42, maxWidth: 42, height: 42,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                borderRadius: '50%', background: 'rgba(28,28,28,0.88)',
                backdropFilter: 'blur(10px)', border: '2px solid #444', flexShrink: 0,
              }}>
                {option.icon}
              </div>
              <div style={{ whiteSpace: 'pre', position: 'relative' }}>
                <div style={{
                  fontFamily: 'Nunito, sans-serif', fontWeight: 700, fontSize: 17, color: 'white',
                  transition: 'opacity 0.7s ease, transform 0.7s ease',
                  opacity: activeIndex === index ? 1 : 0,
                  transform: activeIndex === index ? 'translateX(0)' : 'translateX(25px)',
                }}>
                  {option.title}
                </div>
                <div style={{
                  fontFamily: 'Nunito, sans-serif', fontSize: 14, color: '#ccc',
                  transition: 'opacity 0.7s ease, transform 0.7s ease',
                  transitionDelay: '0.05s',
                  opacity: activeIndex === index ? 1 : 0,
                  transform: activeIndex === index ? 'translateX(0)' : 'translateX(25px)',
                }}>
                  {option.description}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div className="mt-12 text-center">
        <a
          href="#buchen"
          className="inline-flex items-center gap-2 font-nunito font-800 text-sm px-10 py-4 rounded-2xl text-white"
          style={{ background: 'var(--site-btn, #f0ede8)', color: '#1a1a1a', boxShadow: '0 8px 28px rgba(0,0,0,0.35)' }}
        >
          Alle Objekte anfragen →
        </a>
      </div>

      <style>{`
        @keyframes fadeInFromTop {
          from { opacity: 0; transform: translateY(-20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeInTop {
          opacity: 0;
          animation: fadeInFromTop 0.8s ease-in-out forwards;
        }
      `}</style>
    </div>
  )
}

export default InteractiveSelector
