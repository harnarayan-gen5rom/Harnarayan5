import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sun, Moon, Menu, X } from 'lucide-react'
import { useTheme } from '../hooks/useTheme'
import { navLinks } from '../data/portfolio'

export default function Navbar() {
  const { isDark, toggleTheme } = useTheme()
  const [scrolled,    setScrolled]    = useState(false)
  const [mobileOpen,  setMobileOpen]  = useState(false)
  const [activeLink,  setActiveLink]  = useState('')

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const handleNav = (href) => {
    setMobileOpen(false)
    setActiveLink(href)
    const el = document.querySelector(href)
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <>
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? 'glass border-b border-white/5 shadow-2xl'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-10 flex items-center justify-between h-20">
          {/* Logo */}
          <motion.a
            href="#"
            className="flex items-center gap-3 group"
            whileHover={{ scale: 1.02 }}
          >
            <div className="relative w-9 h-9">
              <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-cyan-400 via-violet-500 to-pink-500 opacity-80 group-hover:opacity-100 transition-opacity" />
              <div className="absolute inset-[2px] rounded-[6px] bg-dark-900 dark:bg-dark-900 flex items-center justify-center">
                <span className="text-xs font-bold font-display gradient-text-cyan">AR</span>
              </div>
            </div>
            <div className="hidden sm:block">
              <div className="text-sm font-display font-bold dark:text-white text-dark-800 leading-tight">
                Alex Rivera
              </div>
              <div className="text-[10px] font-mono text-accent-cyan/70 tracking-widest uppercase">
                Creative Director
              </div>
            </div>
          </motion.a>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <button
                key={link.href}
                onClick={() => handleNav(link.href)}
                className={`
                  text-sm font-display font-medium transition-all duration-300
                  animated-underline
                  ${activeLink === link.href
                    ? 'text-accent-cyan'
                    : 'dark:text-white/60 text-dark-700 hover:text-accent-cyan dark:hover:text-white'
                  }
                `}
              >
                {link.label}
              </button>
            ))}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-4">
            {/* Theme toggle */}
            <motion.button
              onClick={toggleTheme}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.94 }}
              className="relative w-10 h-10 rounded-xl glass flex items-center justify-center
                         dark:text-white/70 text-dark-700 hover:text-accent-cyan transition-colors"
              aria-label="Toggle theme"
            >
              <AnimatePresence mode="wait">
                {isDark ? (
                  <motion.div key="sun"
                    initial={{ rotate: -90, opacity: 0, scale: 0.5 }}
                    animate={{ rotate: 0, opacity: 1, scale: 1 }}
                    exit={{ rotate: 90, opacity: 0, scale: 0.5 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Sun size={16} />
                  </motion.div>
                ) : (
                  <motion.div key="moon"
                    initial={{ rotate: 90, opacity: 0, scale: 0.5 }}
                    animate={{ rotate: 0, opacity: 1, scale: 1 }}
                    exit={{ rotate: -90, opacity: 0, scale: 0.5 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Moon size={16} />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>

            {/* CTA */}
            <motion.button
              onClick={() => handleNav('#contact')}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              className="hidden sm:flex btn-glow items-center gap-2 px-5 py-2.5 rounded-xl
                         bg-gradient-to-r from-accent-cyan/10 to-accent-violet/10
                         border border-accent-cyan/20 hover:border-accent-cyan/50
                         dark:text-white text-dark-800 text-sm font-display font-semibold
                         transition-all duration-300"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-accent-cyan animate-pulse" />
              Hire Me
            </motion.button>

            {/* Mobile menu toggle */}
            <motion.button
              onClick={() => setMobileOpen(o => !o)}
              whileTap={{ scale: 0.95 }}
              className="md:hidden w-10 h-10 rounded-xl glass flex items-center justify-center
                         dark:text-white text-dark-800"
            >
              {mobileOpen ? <X size={18} /> : <Menu size={18} />}
            </motion.button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed inset-y-0 right-0 w-72 z-40 glass border-l border-white/05
                       flex flex-col justify-center px-10 gap-6 md:hidden"
          >
            {navLinks.map((link, i) => (
              <motion.button
                key={link.href}
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.07 }}
                onClick={() => handleNav(link.href)}
                className="text-left text-2xl font-display font-semibold
                           dark:text-white/80 text-dark-700
                           hover:text-accent-cyan transition-colors"
              >
                {link.label}
              </motion.button>
            ))}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="mt-6 pt-6 border-t border-white/10"
            >
              <button
                onClick={() => handleNav('#contact')}
                className="w-full btn-glow py-3 rounded-xl bg-gradient-to-r from-accent-cyan to-accent-violet
                           text-dark-950 font-display font-bold text-sm"
              >
                Let's Work Together
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMobileOpen(false)}
            className="fixed inset-0 z-30 bg-dark-950/60 backdrop-blur-sm md:hidden"
          />
        )}
      </AnimatePresence>
    </>
  )
}
