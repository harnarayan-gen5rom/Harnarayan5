import { useRef, useState } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import { Star, Quote, ChevronLeft, ChevronRight } from 'lucide-react'
import { testimonials } from '../data/portfolio'

function StarRating({ count }) {
  return (
    <div className="flex gap-1">
      {Array.from({ length: count }).map((_, i) => (
        <Star key={i} size={12} className="fill-amber-400 text-amber-400" />
      ))}
    </div>
  )
}

export default function Testimonials() {
  const ref    = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-100px' })
  const [active, setActive] = useState(0)

  const prev = () => setActive(a => (a - 1 + testimonials.length) % testimonials.length)
  const next = () => setActive(a => (a + 1) % testimonials.length)

  return (
    <section id="testimonials" ref={ref}
      className="section-padding relative overflow-hidden dark:bg-dark-900 bg-white/50">

      <div className="absolute top-1/2 left-0 w-80 h-80 orb orb-cyan opacity-8 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-96 h-96 orb orb-violet opacity-8 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        {/* Header */}
        <div className="mb-16 text-center">
          <motion.span
            initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}}
            className="tag-badge mb-4 inline-block"
          >
            05 — Testimonials
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-display font-extrabold
                       dark:text-white text-dark-900"
          >
            What clients <span className="gradient-text-warm">say.</span>
          </motion.h2>
        </div>

        {/* Desktop grid */}
        <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-4 gap-5 mb-12">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 40 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: i * 0.1 }}
              className="glass-card rounded-3xl p-6 flex flex-col group relative overflow-hidden"
            >
              {/* Glow */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-3xl"
                style={{ background: `radial-gradient(circle at 20% 20%, ${t.accentColor}0a, transparent 60%)` }}
              />

              {/* Quote icon */}
              <div className="mb-4">
                <Quote size={24} style={{ color: t.accentColor }} className="opacity-60" />
              </div>

              {/* Text */}
              <p className="text-sm dark:text-white/60 text-dark-600 font-body leading-relaxed mb-6 flex-1">
                "{t.text}"
              </p>

              <div className="border-t border-white/5 pt-4">
                <StarRating count={t.rating} />
                <div className="mt-3 flex items-center gap-3">
                  {/* Avatar */}
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-display font-bold"
                    style={{ background: `${t.accentColor}20`, color: t.accentColor, border: `1px solid ${t.accentColor}30` }}
                  >
                    {t.avatar}
                  </div>
                  <div>
                    <div className="text-xs font-display font-bold dark:text-white text-dark-800">
                      {t.name}
                    </div>
                    <div className="text-[10px] dark:text-white/35 text-dark-400">
                      {t.role} · {t.company}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Mobile carousel */}
        <div className="md:hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.4 }}
              className="glass-card rounded-3xl p-7 mb-6"
            >
              <Quote size={24} style={{ color: testimonials[active].accentColor }} className="opacity-60 mb-4" />
              <p className="text-sm dark:text-white/60 text-dark-600 font-body leading-relaxed mb-6">
                "{testimonials[active].text}"
              </p>
              <StarRating count={testimonials[active].rating} />
              <div className="mt-4 flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-display font-bold"
                  style={{
                    background: `${testimonials[active].accentColor}20`,
                    color: testimonials[active].accentColor,
                    border: `1px solid ${testimonials[active].accentColor}30`
                  }}
                >
                  {testimonials[active].avatar}
                </div>
                <div>
                  <div className="text-sm font-display font-bold dark:text-white text-dark-800">
                    {testimonials[active].name}
                  </div>
                  <div className="text-xs dark:text-white/40 text-dark-500">
                    {testimonials[active].role} · {testimonials[active].company}
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          <div className="flex items-center justify-center gap-4">
            <button onClick={prev}
              className="w-10 h-10 glass rounded-full flex items-center justify-center
                         dark:text-white/60 text-dark-500 hover:text-accent-cyan transition-colors">
              <ChevronLeft size={18} />
            </button>
            <div className="flex gap-2">
              {testimonials.map((_, i) => (
                <button key={i} onClick={() => setActive(i)}
                  className={`rounded-full transition-all duration-300 ${
                    i === active ? 'w-6 h-2 bg-accent-cyan' : 'w-2 h-2 bg-white/20'
                  }`}
                />
              ))}
            </div>
            <button onClick={next}
              className="w-10 h-10 glass rounded-full flex items-center justify-center
                         dark:text-white/60 text-dark-500 hover:text-accent-cyan transition-colors">
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        {/* Trust badges */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.5 }}
          className="mt-14 glass-card rounded-3xl p-8 flex flex-wrap items-center justify-center gap-10"
        >
          {[
            { value: '100%', label: 'Client Satisfaction' },
            { value: '< 48h', label: 'Average Response Time' },
            { value: '5★', label: 'Average Rating' },
            { value: '120+', label: 'Happy Clients' },
          ].map((item, i) => (
            <div key={i} className="text-center">
              <div className="text-2xl font-display font-extrabold gradient-text-cyan mb-1">
                {item.value}
              </div>
              <div className="text-xs font-mono dark:text-white/35 text-dark-400 uppercase tracking-wider">
                {item.label}
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
