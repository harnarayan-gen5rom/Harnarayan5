import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { ArrowUpRight, CheckCircle2 } from 'lucide-react'
import { services } from '../data/portfolio'

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } },
}

export default function Services() {
  const ref    = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section id="services" ref={ref}
      className="section-padding relative overflow-hidden dark:bg-dark-900 bg-white/50">
      {/* BG accent */}
      <div className="absolute bottom-0 right-1/4 w-96 h-96 orb orb-magenta opacity-8 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        {/* Header */}
        <div className="mb-16 text-center max-w-3xl mx-auto">
          <motion.span
            initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}}
            className="tag-badge mb-4 inline-block"
          >
            03 — Services
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-display font-extrabold
                       dark:text-white text-dark-900 mb-5"
          >
            What I <span className="gradient-text">bring to the table.</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.15 }}
            className="dark:text-white/45 text-dark-500 font-body leading-relaxed"
          >
            End-to-end creative services, from initial concept to final delivery.
            Every service is built around your story.
          </motion.p>
        </div>

        {/* Service cards grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {services.map((service, i) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 50 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: i * 0.12 }}
              className="glass-card rounded-3xl p-7 group relative overflow-hidden flex flex-col"
            >
              {/* Gradient bg glow on hover */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                style={{ background: `radial-gradient(circle at 30% 30%, ${service.accentColor}0d, transparent 70%)` }}
              />

              {/* Icon */}
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl mb-6 shrink-0"
                style={{
                  background: `${service.accentColor}15`,
                  border: `1px solid ${service.accentColor}25`,
                }}
              >
                {service.icon}
              </div>

              {/* Title */}
              <h3 className="text-lg font-display font-bold dark:text-white text-dark-900 mb-3">
                {service.title}
              </h3>

              {/* Description */}
              <p className="text-sm dark:text-white/45 text-dark-500 font-body leading-relaxed mb-6 flex-1">
                {service.description}
              </p>

              {/* Features list */}
              <ul className="space-y-2 mb-6">
                {service.features.map(feat => (
                  <li key={feat} className="flex items-center gap-2 text-xs dark:text-white/50 text-dark-500">
                    <CheckCircle2 size={12} style={{ color: service.accentColor }} className="shrink-0" />
                    {feat}
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <button
                className="group/btn flex items-center gap-1.5 text-xs font-display font-semibold
                           transition-all duration-300"
                style={{ color: service.accentColor }}
              >
                Learn More
                <ArrowUpRight size={12}
                  className="group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
              </button>

              {/* Bottom accent line */}
              <div
                className="absolute bottom-0 left-0 h-[2px] w-0 group-hover:w-full transition-all duration-700"
                style={{ background: `linear-gradient(90deg, ${service.accentColor}, transparent)` }}
              />
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA banner */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.5 }}
          className="mt-14 glass-card rounded-3xl p-8 sm:p-10 gradient-border
                     flex flex-col sm:flex-row items-center justify-between gap-6"
        >
          <div>
            <div className="text-xl font-display font-bold dark:text-white text-dark-900 mb-1">
              Need a custom package?
            </div>
            <div className="text-sm dark:text-white/45 text-dark-500">
              Every project is different — let's talk about what you need.
            </div>
          </div>
          <motion.a
            href="#contact"
            onClick={e => { e.preventDefault(); document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' }) }}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            className="btn-glow shrink-0 flex items-center gap-2 px-8 py-3.5 rounded-xl
                       bg-gradient-to-r from-accent-cyan to-accent-violet
                       text-dark-950 font-display font-bold text-sm"
          >
            Start a Conversation <ArrowUpRight size={14} />
          </motion.a>
        </motion.div>
      </div>
    </section>
  )
}
