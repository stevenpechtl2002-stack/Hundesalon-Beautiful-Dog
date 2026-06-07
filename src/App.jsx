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
import Footer from './components/Footer'
import PropertiesPage from './pages/PropertiesPage'
import PropertyDetailPage from './pages/PropertyDetailPage'
import AdminInseratePage from './pages/AdminInseratePage'
import ImpressumPage from './pages/ImpressumPage'
import DatenschutzPage from './pages/DatenschutzPage'
import AgbPage from './pages/AgbPage'

function HomePage({ loaded, setLoaded }) {
  return (
    <>
      <AnimatePresence>
        {!loaded && <LoadingScreen onComplete={() => setLoaded(true)} />}
      </AnimatePresence>
      <main>
        <Hero />
        <PropertyMarquee />
        <Features />
        <Services />
        <About />
        <InteractiveSelector />
        <Reviews />
        <Booking />
        <Location />
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
            <Route path="/immobilien/:id" element={<PropertyDetailPage />} />
            <Route path="/admin/inserate" element={<AdminInseratePage />} />
            <Route path="/impressum" element={<ImpressumPage />} />
            <Route path="/datenschutz" element={<DatenschutzPage />} />
            <Route path="/agb" element={<AgbPage />} />
          </Routes>
        </div>
      </AdminProvider>
    </BrowserRouter>
  )
}
