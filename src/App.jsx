import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ThemeProvider } from './hooks/useTheme'
import CustomCursor      from './components/CustomCursor'
import FloatingElements  from './components/FloatingElements'
import Navbar            from './components/Navbar'
import Hero              from './components/Hero'
import SplineScene       from './components/SplineScene'
import About             from './components/About'
import Portfolio         from './components/Portfolio'
import Services          from './components/Services'
import Tools             from './components/Tools'
import Testimonials      from './components/Testimonials'
import Contact           from './components/Contact'
import Footer            from './components/Footer'

function PageLoader() {
  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: 0 }}
      transition={{ duration: 0.6, delay: 1.0 }}
      style={{ pointerEvents: 'none' }}
      className="fixed inset-0 z-[9999] dark:bg-dark-950 bg-light-bg flex items-center justify-center"
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col items-center gap-4"
      >
        <div className="relative w-14 h-14">
          <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-cyan-400 via-violet-500 to-pink-500 animate-spin-slow opacity-70" />
          <div className="absolute inset-[3px] rounded-[9px] dark:bg-dark-950 bg-light-bg flex items-center justify-center">
            <span className="text-lg font-display font-extrabold gradient-text">AR</span>
          </div>
        </div>
        <div className="flex gap-1">
          {[0, 1, 2].map(i => (
            <motion.div key={i}
              className="w-1.5 h-1.5 rounded-full bg-accent-cyan"
              animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1.1, 0.8] }}
              transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.18 }}
            />
          ))}
        </div>
      </motion.div>
    </motion.div>
  )
}

function AppInner() {
  // Smooth scroll polyfill
  useEffect(() => {
    document.documentElement.style.scrollBehavior = 'smooth'
  }, [])

  return (
    <div className="relative min-h-screen dark:bg-dark-950 bg-light-bg transition-colors duration-500">
      {/* Noise overlay */}
      <div className="noise-overlay" />

      {/* Loader */}
      <PageLoader />

      {/* Cursor */}
      <CustomCursor />

      {/* Floating 3D elements */}
      <FloatingElements />

      {/* Navigation */}
      <Navbar />

      {/* Main content */}
      <main>
        <Hero />
        <SplineScene />
        <About />
        <Portfolio />
        <Services />
        <Tools />
        <Testimonials />
        <Contact />
      </main>

      <Footer />
    </div>
  )
}

export default function App() {
  return (
    <ThemeProvider>
      <AppInner />
    </ThemeProvider>
  )
}
