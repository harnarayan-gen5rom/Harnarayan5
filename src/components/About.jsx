import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { User, Zap, Award, Globe } from 'lucide-react'
import { tools } from '../data/portfolio'

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } },
}

const stagger = {
  hidden: {},
  show:   { transition: { staggerChildren: 0.08 } },
}

function SkillBar({ name, level, color, index }) {
  const ref    = useRef(null)
  const inView = useInView(ref, { once: true })

  return (
    <div ref={ref} className="group">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-display font-medium dark:text-white/80 text-dark-700">
          {name}
        </span>
        <span className="text-xs font-mono" style={{ color }}>
          {level}%
        </span>
      </div>
      <div className="h-1.5 dark:bg-white/5 bg-black/5 rounded-full overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          style={{ background: `linear-gradient(90deg, ${color}99, ${color})` }}
          initial={{ width: 0 }}
          animate={inView ? { width: `${level}%` } : { width: 0 }}
          transition={{ duration: 1, delay: index * 0.06, ease: [0.16, 1, 0.3, 1] }}
        />
      </div>
    </div>
  )
}

const traits = [
  { icon: Zap,   label: 'Fast Delivery',    desc: 'Tight deadlines, zero compromise on quality'   },
  { icon: Award, label: 'Award-Winning',    desc: '14 industry awards across design disciplines'  },
  { icon: Globe, label: 'Global Clients',   desc: 'Partnered with brands across 18 countries'     },
  { icon: User,  label: 'Director-Level',   desc: 'Led creative for campaigns up to $2M budget'   },
]

export default function About() {
  const sectionRef = useRef(null)
  const inView     = useInView(sectionRef, { once: true, margin: '-100px' })

  return (
    <section id="about" ref={sectionRef} className="section-padding relative overflow-hidden dark:bg-dark-900 bg-white/50">
      {/* Gradient accent */}
      <div className="absolute top-0 left-1/4 w-96 h-96 orb orb-violet opacity-10 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        {/* Header */}
        <motion.div
          variants={stagger}
          initial="hidden"
          animate={inView ? 'show' : 'hidden'}
          className="mb-20 flex flex-col sm:flex-row sm:items-end justify-between gap-6"
        >
          <div>
            <motion.span variants={fadeUp} className="tag-badge mb-4 inline-block">
              01 — About Me
            </motion.span>
            <motion.h2 variants={fadeUp}
              className="text-4xl sm:text-5xl lg:text-6xl font-display font-extrabold
                         dark:text-white text-dark-900 leading-tight">
              Creative by nature,<br />
              <span className="gradient-text">precise by craft.</span>
            </motion.h2>
          </div>
          <motion.p variants={fadeUp}
            className="max-w-xs text-sm dark:text-white/40 text-dark-500 font-body leading-relaxed">
            Based in Los Angeles — working globally with studios, agencies, and independent brands.
          </motion.p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Left — Profile + Bio */}
          <motion.div
            variants={stagger}
            initial="hidden"
            animate={inView ? 'show' : 'hidden'}
            className="space-y-8"
          >
            {/* Profile card */}
            <motion.div variants={fadeUp} className="glass-card rounded-3xl p-8 gradient-border">
              <div className="flex items-start gap-6">
                {/* Avatar */}
                <div className="relative shrink-0">
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-accent-cyan via-accent-violet to-accent-magenta p-[2px]">
                    <div className="w-full h-full rounded-[14px] dark:bg-dark-800 bg-white/80 flex items-center justify-center">
                      <span className="text-3xl font-display font-extrabold gradient-text">AR</span>
                    </div>
                  </div>
                  <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-400 border-2 border-dark-900" />
                </div>
                <div>
                  <div className="text-xl font-display font-bold dark:text-white text-dark-900 mb-1">
                    Alex Rivera
                  </div>
                  <div className="text-sm font-mono gradient-text-cyan mb-3">
                    Creative Director & Visual Storyteller
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    {['Video Editing', 'Motion', 'Design'].map(t => (
                      <span key={t} className="tag-badge">{t}</span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Bio */}
            <motion.div variants={fadeUp} className="space-y-4">
              {[
                `I'm a Los Angeles-based creative with 8 years of experience turning concepts into cinematic realities — across video production, motion graphics, and visual identity design.`,
                `My work lives at the intersection of storytelling and technology. Whether I'm crafting a 60-second brand spot or a 200-frame animation system, every decision is intentional.`,
                `Clients come to me when they want work that doesn't just look good — but feels undeniably right.`,
              ].map((para, i) => (
                <p key={i} className="dark:text-white/55 text-dark-600 font-body leading-relaxed text-[15px]">
                  {para}
                </p>
              ))}
            </motion.div>

            {/* Trait cards */}
            <motion.div variants={stagger} className="grid grid-cols-2 gap-3">
              {traits.map(({ icon: Icon, label, desc }) => (
                <motion.div key={label} variants={fadeUp}
                  className="glass-card rounded-2xl p-4 group hover:border-accent-cyan/20 transition-colors">
                  <Icon size={18} className="text-accent-cyan mb-2 group-hover:scale-110 transition-transform" />
                  <div className="text-xs font-display font-bold dark:text-white text-dark-800 mb-0.5">{label}</div>
                  <div className="text-[11px] dark:text-white/40 text-dark-500">{desc}</div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right — Skills */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-8"
          >
            <div>
              <span className="tag-badge mb-4 inline-block">Proficiency</span>
              <h3 className="text-2xl font-display font-bold dark:text-white text-dark-900 mb-8">
                Tool Mastery
              </h3>
              <div className="space-y-5">
                {tools.map((tool, i) => (
                  <SkillBar key={tool.name} {...tool} index={i} />
                ))}
              </div>
            </div>

            {/* Experience timeline */}
            <div className="glass-card rounded-3xl p-6">
              <h4 className="text-sm font-display font-bold dark:text-white text-dark-800 mb-5 tracking-wide">
                Career Highlights
              </h4>
              <div className="space-y-5">
                {[
                  { year: '2024', role: 'Freelance Creative Director', org: 'Global Clients' },
                  { year: '2021', role: 'Senior Motion Designer',      org: 'Phantom Studio, NYC' },
                  { year: '2019', role: 'Video Editor',                org: 'Lux Films, LA' },
                  { year: '2016', role: 'Junior Designer',             org: 'Orbit Creative Agency' },
                ].map((item, i) => (
                  <div key={i} className="flex gap-4 items-start">
                    <div className="shrink-0 mt-1">
                      <span className="text-[11px] font-mono text-accent-cyan/70">{item.year}</span>
                    </div>
                    <div className="flex-1 border-l border-white/10 pl-4">
                      <div className="text-sm font-display font-semibold dark:text-white text-dark-800">
                        {item.role}
                      </div>
                      <div className="text-xs dark:text-white/40 text-dark-500">{item.org}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
