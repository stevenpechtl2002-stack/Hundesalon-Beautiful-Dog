import { useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import { AdminProvider } from './context/AdminContext'
import AdminBar from './components/admin/AdminBar'
import LoadingScreen from './components/LoadingScreen'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Features from './components/Features'
import Services from './components/Services'
import About from './components/About'
import BeforeAfter from './components/BeforeAfter'
import Reviews from './components/Reviews'
import Location from './components/Location'
import Booking from './components/Booking'
import Instagram from './components/Instagram'
import Footer from './components/Footer'

export default function App() {
  const [loaded, setLoaded] = useState(false)

  return (
    <AdminProvider>
      <AnimatePresence>
        {!loaded && <LoadingScreen onComplete={() => setLoaded(true)} />}
      </AnimatePresence>
      <div className="font-nunito" style={{ paddingTop: 0 }}>
        <AdminBar />
        <Navbar />
        <main>
          <Hero />
          <Features />
          <Services />
          <About />
          <BeforeAfter />
          <Reviews />
          <Booking />
          <Location />
          <Instagram />
        </main>
        <Footer />
      </div>
    </AdminProvider>
  )
}
