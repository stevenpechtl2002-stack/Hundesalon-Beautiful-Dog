import { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { AdminProvider } from './context/AdminContext'
import AdminBar from './components/admin/AdminBar'
import LoadingScreen from './components/LoadingScreen'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Features from './components/Features'
import Services from './components/Services'
import About from './components/About'
import InteractiveSelector from './components/ui/interactive-selector'
import PropertyMarquee from './components/PropertyMarquee'
import Reviews from './components/Reviews'
import Location from './components/Location'
import Booking from './components/Booking'
import Instagram from './components/Instagram'
import Footer from './components/Footer'
import PropertiesPage from './pages/PropertiesPage'

function HomePage({ loaded, setLoaded }) {
  return (
    <>
      <AnimatePresence>
        {!loaded && <LoadingScreen onComplete={() => setLoaded(true)} />}
      </AnimatePresence>
      <main>
        <Hero />
        <Features />
        <Services />
        <About />
        <PropertyMarquee />
        <InteractiveSelector />
        <Reviews />
        <Booking />
        <Location />
        <Instagram />
      </main>
      <Footer />
    </>
  )
}

export default function App() {
  const [loaded, setLoaded] = useState(false)

  return (
    <BrowserRouter>
      <AdminProvider>
        <div className="font-nunito">
          <AdminBar />
          <Navbar />
          <Routes>
            <Route path="/" element={<HomePage loaded={loaded} setLoaded={setLoaded} />} />
            <Route path="/immobilien" element={<PropertiesPage />} />
          </Routes>
        </div>
      </AdminProvider>
    </BrowserRouter>
  )
}
