import { motion } from 'framer-motion'
import { ArrowUp, Github, Linkedin, Twitter, Instagram } from 'lucide-react'
import { navLinks } from '../data/portfolio'

const SOCIALS = [
  { icon: Github,    href: '#' },
  { icon: Linkedin,  href: '#' },
  { icon: Twitter,   href: '#' },
  { icon: Instagram, href: '#' },
]

export default function Footer() {
  const scrollTop = () => window.scrollTo({ top: 0, behavior: 'smooth' })

  return (
    <footer className="relative dark:bg-dark-900 bg-white/70 border-t dark:border-white/5 border-black/5">
      {/* Top accent line */}
      <div className="h-px w-full bg-gradient-to-r from-transparent via-accent-cyan/40 to-transparent" />

      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-14">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          {/* Left — brand */}
          <div className="flex flex-col items-center md:items-start gap-3">
            <div className="flex items-center gap-3">
              <div className="relative w-8 h-8">
                <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-cyan-400 via-violet-500 to-pink-500" />
                <div className="absolute inset-[2px] rounded-[5px] dark:bg-dark-900 bg-white flex items-center justify-center">
                  <span className="text-[10px] font-bold font-display gradient-text-cyan">AR</span>
                </div>
              </div>
              <span className="font-display font-bold dark:text-white text-dark-900 text-sm">
                Alex Rivera
              </span>
            </div>
            <p className="text-xs dark:text-white/30 text-dark-400 font-body max-w-xs text-center md:text-left">
              Creative Director crafting cinematic visuals, motion systems, and brand identities.
            </p>
          </div>

          {/* Center — nav */}
          <div className="flex flex-wrap justify-center gap-6">
            {navLinks.map(link => (
              <button
                key={link.href}
                onClick={() => document.querySelector(link.href)?.scrollIntoView({ behavior: 'smooth' })}
                className="text-xs font-display font-medium dark:text-white/40 text-dark-500
                           hover:text-accent-cyan transition-colors animated-underline"
              >
                {link.label}
              </button>
            ))}
          </div>

          {/* Right — socials + scroll-top */}
          <div className="flex items-center gap-4">
            {SOCIALS.map(({ icon: Icon, href }, i) => (
              <a key={i} href={href}
                className="dark:text-white/30 text-dark-400 hover:text-accent-cyan transition-colors">
                <Icon size={15} />
              </a>
            ))}
            <motion.button
              onClick={scrollTop}
              whileHover={{ scale: 1.1, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="w-9 h-9 rounded-xl glass border border-white/10 hover:border-accent-cyan/30
                         flex items-center justify-center dark:text-white/40 text-dark-400
                         hover:text-accent-cyan transition-colors ml-2"
            >
              <ArrowUp size={14} />
            </motion.button>
          </div>
        </div>

        {/* Bottom line */}
        <div className="mt-10 pt-6 border-t dark:border-white/5 border-black/5
                        flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-[11px] font-mono dark:text-white/20 text-dark-400">
            © 2025 Alex Rivera. All rights reserved.
          </p>
          <p className="text-[11px] font-mono dark:text-white/20 text-dark-400 flex items-center gap-1.5">
            Designed & Built with
            <span className="gradient-text font-bold">precision.</span>
          </p>
        </div>
      </div>
    </footer>
  )
}
