import { motion } from 'framer-motion'

const PAW_POS = [
  {x:8,y:25,r:-20,d:0},{x:16,y:65,r:15,d:0.4},{x:25,y:35,r:-10,d:0.8},
  {x:35,y:72,r:22,d:1.2},{x:47,y:18,r:-15,d:1.6},{x:55,y:58,r:10,d:2.0},
  {x:65,y:28,r:-18,d:2.4},{x:75,y:75,r:20,d:2.8},{x:85,y:42,r:-8,d:3.2},
  {x:93,y:82,r:25,d:3.6},
]

const container = { hidden:{}, show:{ transition:{ staggerChildren:0.08 } } }
const row = { hidden:{ opacity:0, y:30 }, show:{ opacity:1, y:0, transition:{ duration:0.6, ease:[0.22,1,0.36,1] } } }

export default function Footer() {
  return (
    <footer className="relative pt-20 pb-8 overflow-hidden" style={{ background:'linear-gradient(160deg,#1e1e2e,#12121a)' }}>

      {PAW_POS.map((p,i) => (
        <motion.div key={i} className="absolute pointer-events-none"
          style={{ left:`${p.x}%`, top:`${p.y}%`, rotate:p.r }}
          animate={{ opacity:[0,0.12,0] }}
          transition={{ duration:4, delay:p.d, repeat:Infinity, repeatDelay:9 }}>
          <svg width="18" height="18" viewBox="0 0 100 100">
            <ellipse cx="18" cy="52" rx="10" ry="12" fill="#FFB5D8"/>
            <ellipse cx="37" cy="36" rx="10" ry="12" fill="#FFB5D8"/>
            <ellipse cx="63" cy="36" rx="10" ry="12" fill="#FFB5D8"/>
            <ellipse cx="82" cy="52" rx="10" ry="12" fill="#FFB5D8"/>
            <path d="M50,88 C36,88 26,79 26,68 C26,57 32,54 38,54 C42,54 46,56 50,59 C54,56 58,54 62,54 C68,54 74,57 74,68 C74,79 64,88 50,88 Z" fill="#FFB5D8"/>
          </svg>
        </motion.div>
      ))}

      <motion.div className="relative z-10 max-w-7xl mx-auto px-8 md:px-16"
        variants={container} initial="hidden" whileInView="show" viewport={{ once:true }}>

        <div className="grid md:grid-cols-4 gap-12 mb-16">

          <motion.div variants={row} className="md:col-span-2">
            <div className="flex items-center gap-3 mb-5">
              <svg width="34" height="34" viewBox="0 0 100 100">
                <ellipse cx="18" cy="52" rx="10" ry="12" fill="#FFB5D8"/>
                <ellipse cx="37" cy="36" rx="10" ry="12" fill="#FFB5D8"/>
                <ellipse cx="63" cy="36" rx="10" ry="12" fill="#FFB5D8"/>
                <ellipse cx="82" cy="52" rx="10" ry="12" fill="#FFB5D8"/>
                <path d="M50,88 C36,88 26,79 26,68 C26,57 32,54 38,54 C42,54 46,56 50,59 C54,56 58,54 62,54 C68,54 74,57 74,68 C74,79 64,88 50,88 Z" fill="#FFB5D8"/>
              </svg>
              <h3 className="font-pacifico text-2xl" style={{ color:'#FFB5D8' }}>Hundesalon Beautiful Dog</h3>
            </div>
            <p className="font-nunito text-gray-500 leading-relaxed mb-6 max-w-xs">
              Pforzheims Premium Hundesalon — professionelle Pflege mit Liebe und Leidenschaft seit über 15 Jahren.
            </p>
            <div className="flex gap-3">
              {['IG','FB','TK'].map(s => (
                <motion.a key={s} href="#"
                  className="w-10 h-10 rounded-xl flex items-center justify-center font-nunito font-800 text-xs"
                  style={{ background:'rgba(255,181,216,0.1)', color:'#FFB5D8' }}
                  whileHover={{ background:'rgba(255,181,216,0.25)', scale:1.1 }}>
                  {s}
                </motion.a>
              ))}
            </div>
          </motion.div>

          <motion.div variants={row}>
            <h4 className="font-nunito font-800 text-white text-xs tracking-[0.25em] uppercase mb-5">Kontakt</h4>
            <div className="space-y-3 font-nunito text-gray-500 text-sm">
              <p className="flex items-start gap-2"><span className="mt-0.5">📍</span><span>Richard-Wagner-Allee 15<br/>75179 Pforzheim</span></p>
              <p className="flex items-center gap-2"><span>📞</span><a href="tel:072313742100" className="hover:text-rosa transition-colors">07231 - 37 42 100</a></p>
              <p className="flex items-center gap-2"><span>✉️</span><a href="mailto:kontakt@hundesalon-pforzheim.de" className="hover:text-rosa transition-colors text-xs">kontakt@hundesalon-pforzheim.de</a></p>
            </div>
          </motion.div>

          <motion.div variants={row}>
            <h4 className="font-nunito font-800 text-white text-xs tracking-[0.25em] uppercase mb-5">Öffnungszeiten</h4>
            <div className="space-y-2.5 font-nunito text-sm">
              {[{d:'Mo – Do',t:'08:30 – 17:30',o:true},{d:'Fr – So',t:'Nach Absprache',o:true}].map(({d,t,o})=>(
                <div key={d} className="flex justify-between gap-4">
                  <span className="text-gray-500">{d}</span>
                  <span className={o?'text-white font-600':'text-gray-600'}>{t}</span>
                </div>
              ))}
            </div>
            <motion.a href="#buchen"
              className="inline-block mt-6 font-nunito font-700 text-sm px-5 py-2.5 rounded-xl text-white"
              style={{ background:'linear-gradient(135deg,#FFB5D8,#C5B5EA)' }}
              whileHover={{ scale:1.05 }} whileTap={{ scale:0.96 }}>
              Jetzt buchen 🐾
            </motion.a>
          </motion.div>

        </div>

        <motion.div variants={row} className="border-t border-gray-800 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="font-nunito text-gray-600 text-xs">© 2025 Hundesalon Beautiful Dog. Alle Rechte vorbehalten.</p>
          <div className="flex gap-6 items-center">
            {['Impressum','Datenschutz','AGB'].map(l=>(
              <a key={l} href="#" className="font-nunito text-gray-600 text-xs hover:text-gray-400 transition-colors">{l}</a>
            ))}
            <a
              href="https://beautiful-dog.sanity.studio"
              target="_blank"
              rel="noopener noreferrer"
              className="font-nunito text-xs px-3 py-1.5 rounded-lg transition-all"
              style={{ background: 'rgba(255,181,216,0.12)', border: '1px solid rgba(255,181,216,0.2)', color: '#FFB5D8' }}
              title="Admin Login">
              🐾 Admin
            </a>
          </div>
        </motion.div>

      </motion.div>
    </footer>
  )
}
