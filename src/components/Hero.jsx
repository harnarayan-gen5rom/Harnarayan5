import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowDown, Play, Sparkles } from 'lucide-react'
import { stats } from '../data/portfolio'

const ROLES = ['Video Editor', 'Motion Designer', 'Graphic Designer', 'Creative Director']

function TypewriterText() {
  const [idx,    setIdx]    = useState(0)
  const [text,   setText]   = useState('')
  const [deleting, setDel]  = useState(false)

  useEffect(() => {
    const target = ROLES[idx]
    const speed  = deleting ? 40 : 90

    const timeout = setTimeout(() => {
      if (!deleting && text === target) {
        setTimeout(() => setDel(true), 1800)
        return
      }
      if (deleting && text === '') {
        setDel(false)
        setIdx(i => (i + 1) % ROLES.length)
        return
      }
      setText(prev => deleting ? prev.slice(0, -1) : target.slice(0, prev.length + 1))
    }, speed)

    return () => clearTimeout(timeout)
  }, [text, deleting, idx])

  return (
    <span className="gradient-text">
      {text}
      <span className="typewriter-cursor" />
    </span>
  )
}

// Particle canvas
function ParticleCanvas() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx    = canvas.getContext('2d')
    let animId

    const resize = () => {
      canvas.width  = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    const particles = Array.from({ length: 55 }, () => ({
      x:   Math.random() * canvas.width,
      y:   Math.random() * canvas.height,
      r:   Math.random() * 1.5 + 0.3,
      vx:  (Math.random() - 0.5) * 0.25,
      vy: -(Math.random() * 0.4 + 0.1),
      a:   Math.random() * 0.6 + 0.1,
      color: ['#00f5ff', '#9f5cff', '#ff2d87', '#c8d6e5'][Math.floor(Math.random() * 4)],
    }))

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      particles.forEach(p => {
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fillStyle = p.color + Math.floor(p.a * 255).toString(16).padStart(2,'0')
        ctx.fill()

        p.x += p.vx
        p.y += p.vy
        if (p.y < -5)           p.y = canvas.height + 5
        if (p.x < -5)           p.x = canvas.width  + 5
        if (p.x > canvas.width  + 5) p.x = -5
      })
      animId = requestAnimationFrame(draw)
    }
    draw()

    return () => {
      window.removeEventListener('resize', resize)
      cancelAnimationFrame(animId)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 z-0 opacity-50 pointer-events-none"
    />
  )
}

export default function Hero() {
  const scrollToWork = () => {
    document.querySelector('#portfolio')?.scrollIntoView({ behavior: 'smooth' })
  }
  const scrollToContact = () => {
    document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden
                 dark:bg-dark-950 bg-light-bg"
    >
      {/* Grid background */}
      <div className="absolute inset-0 grid-decoration opacity-60" />

      {/* Particles */}
      <ParticleCanvas />

      {/* Radial gradient center glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 70% 60% at 50% 50%, rgba(159,92,255,0.08) 0%, transparent 70%)',
        }}
      />

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-10 pt-28 pb-20 text-center">

        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="inline-flex items-center gap-2 mb-8 px-4 py-2 rounded-full
                     glass border border-accent-cyan/20"
        >
          <Sparkles size={13} className="text-accent-cyan" />
          <span className="text-xs font-mono text-accent-cyan/80 tracking-widest uppercase">
            Available for Freelance
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-accent-cyan animate-pulse" />
        </motion.div>

        {/* Headline */}
        <div className="overflow-hidden mb-4">
          <motion.h1
            initial={{ y: '100%', opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.35, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="text-5xl sm:text-7xl lg:text-8xl xl:text-9xl font-display font-extrabold
                       leading-[0.92] tracking-tight dark:text-white text-dark-900"
          >
            Crafting
          </motion.h1>
        </div>
        <div className="overflow-hidden mb-4">
          <motion.h1
            initial={{ y: '100%', opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="text-5xl sm:text-7xl lg:text-8xl xl:text-9xl font-display font-extrabold
                       leading-[0.92] tracking-tight gradient-text"
          >
            Visual
          </motion.h1>
        </div>
        <div className="overflow-hidden mb-10">
          <motion.h1
            initial={{ y: '100%', opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.65, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="text-5xl sm:text-7xl lg:text-8xl xl:text-9xl font-display font-extrabold
                       leading-[0.92] tracking-tight dark:text-white/90 text-dark-800"
          >
            Experiences
          </motion.h1>
        </div>

        {/* Typewriter */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="text-xl sm:text-2xl lg:text-3xl font-display font-medium
                     dark:text-white/50 text-dark-600 mb-6 min-h-[1.5em]"
        >
          I'm a <TypewriterText />
        </motion.div>

        {/* Sub-description */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0, duration: 0.7 }}
          className="max-w-2xl mx-auto text-base sm:text-lg dark:text-white/40 text-dark-500
                     font-body leading-relaxed mb-12"
        >
          8 years designing motion, editing stories, and building visual identities
          that move people — and move markets.
        </motion.p>

        {/* CTA buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1, duration: 0.6 }}
          className="flex flex-wrap items-center justify-center gap-4 mb-20"
        >
          <motion.button
            onClick={scrollToWork}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            className="btn-glow group flex items-center gap-3 px-8 py-4 rounded-2xl
                       bg-gradient-to-r from-accent-cyan via-accent-violet to-accent-magenta
                       text-dark-950 font-display font-bold text-sm tracking-wide
                       shadow-glow-cyan transition-all duration-300"
          >
            <Play size={16} className="group-hover:translate-x-0.5 transition-transform" />
            View My Work
          </motion.button>

          <motion.button
            onClick={scrollToContact}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            className="btn-glow flex items-center gap-3 px-8 py-4 rounded-2xl
                       glass border border-white/10 hover:border-accent-cyan/40
                       dark:text-white text-dark-800 font-display font-semibold text-sm
                       transition-all duration-300"
          >
            Start a Project
          </motion.button>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.3, duration: 0.7 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-px glass-card rounded-2xl overflow-hidden
                     max-w-3xl mx-auto border border-white/5"
        >
          {stats.map((stat, i) => (
            <div
              key={i}
              className="px-6 py-5 text-center dark:bg-white/[0.02] bg-white/60
                         border-r border-b border-white/5 last:border-r-0"
            >
              <div className="text-2xl sm:text-3xl font-display font-bold gradient-text-cyan">
                {stat.value}
              </div>
              <div className="text-xs dark:text-white/40 text-dark-500 font-mono tracking-wide mt-1">
                {stat.label}
              </div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="text-[10px] font-mono tracking-widest uppercase dark:text-white/30 text-dark-400">
          Scroll
        </span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
        >
          <ArrowDown size={14} className="dark:text-white/30 text-dark-400" />
        </motion.div>
      </motion.div>
    </section>
  )
}
