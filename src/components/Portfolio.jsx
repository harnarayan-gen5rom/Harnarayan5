import { useRef, useState } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import { ArrowUpRight, Clock, User2, Tag } from 'lucide-react'
import { projects } from '../data/portfolio'

const CATEGORIES = ['All', 'Video Editing', 'Motion Graphics', 'Graphic Design']

// Gradient SVG placeholders for project visuals
const ProjectVisual = ({ gradient, accentColor, title, category }) => {
  const symbols = {
    'Motion Graphics': (
      <>
        <circle cx="50" cy="50" r="30" fill="none" stroke={accentColor} strokeWidth="1.5" strokeDasharray="4 4"/>
        <circle cx="50" cy="50" r="18" fill={accentColor + '22'} stroke={accentColor} strokeWidth="1"/>
        <line x1="20" y1="50" x2="80" y2="50" stroke={accentColor + '66'} strokeWidth="1"/>
        <line x1="50" y1="20" x2="50" y2="80" stroke={accentColor + '66'} strokeWidth="1"/>
        <circle cx="50" cy="50" r="5" fill={accentColor}/>
      </>
    ),
    'Video Editing': (
      <>
        <rect x="15" y="30" width="70" height="40" rx="4" fill="none" stroke={accentColor} strokeWidth="1.5"/>
        <polygon points="40,42 40,58 60,50" fill={accentColor}/>
        <line x1="15" y1="80" x2="30" y2="80" stroke={accentColor} strokeWidth="2"/>
        <line x1="35" y1="80" x2="55" y2="80" stroke={accentColor + '66'} strokeWidth="2"/>
        <line x1="60" y1="80" x2="85" y2="80" stroke={accentColor} strokeWidth="2"/>
      </>
    ),
    'Graphic Design': (
      <>
        <rect x="20" y="20" width="60" height="60" rx="4" fill="none" stroke={accentColor} strokeWidth="1.5"/>
        <rect x="28" y="28" width="20" height="20" fill={accentColor + '44'} stroke={accentColor} strokeWidth="1"/>
        <line x1="55" y1="30" x2="75" y2="30" stroke={accentColor} strokeWidth="2"/>
        <line x1="55" y1="37" x2="72" y2="37" stroke={accentColor + '66'} strokeWidth="1.5"/>
        <line x1="28" y1="58" x2="72" y2="58" stroke={accentColor + '44'} strokeWidth="1"/>
        <line x1="28" y1="64" x2="64" y2="64" stroke={accentColor + '33'} strokeWidth="1"/>
      </>
    ),
  }

  return (
    <svg viewBox="0 0 100 100" className="w-full h-full" style={{ display: 'block' }}>
      <defs>
        <radialGradient id={`g-${title.replace(/\s/g,'')}`} cx="50%" cy="50%" r="70%">
          <stop offset="0%"   stopColor={accentColor} stopOpacity="0.12"/>
          <stop offset="100%" stopColor={accentColor} stopOpacity="0"/>
        </radialGradient>
      </defs>
      <rect width="100" height="100" fill={`url(#g-${title.replace(/\s/g,'')})`}/>
      {symbols[category]}
    </svg>
  )
}

function ProjectCard({ project, index }) {
  const [hovered, setHovered] = useState(false)
  const ref    = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
      className="project-card glass-card rounded-3xl overflow-hidden group cursor-pointer"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      whileHover={{ y: -6 }}
    >
      {/* Visual area */}
      <div className="relative h-52 overflow-hidden"
           style={{ background: `linear-gradient(135deg, ${project.accentColor}11, transparent)` }}>
        <div className="project-card-img absolute inset-0 flex items-center justify-center p-8">
          <ProjectVisual {...project} />
        </div>

        {/* Hover overlay */}
        <div className="project-card-overlay absolute inset-0 bg-dark-950/80 flex items-center justify-center gap-4">
          <motion.a
            href={project.link}
            whileHover={{ scale: 1.05 }}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-display font-semibold text-sm
                       text-dark-950 bg-gradient-to-r from-accent-cyan to-accent-violet"
          >
            View Case Study <ArrowUpRight size={14} />
          </motion.a>
        </div>

        {/* Category badge */}
        <div className="absolute top-4 left-4">
          <span
            className="text-[10px] font-mono uppercase tracking-widest px-3 py-1 rounded-full"
            style={{
              background: project.accentColor + '18',
              border: `1px solid ${project.accentColor}33`,
              color: project.accentColor,
            }}
          >
            {project.category}
          </span>
        </div>

        {/* Year */}
        <div className="absolute top-4 right-4">
          <span className="text-[10px] font-mono dark:text-white/30 text-dark-400">
            {project.year}
          </span>
        </div>
      </div>

      {/* Info */}
      <div className="p-6">
        <h3 className="text-lg font-display font-bold dark:text-white text-dark-900 mb-2 group-hover:gradient-text transition-all">
          {project.title}
        </h3>
        <p className="text-sm dark:text-white/45 text-dark-500 leading-relaxed mb-4 font-body">
          {project.description}
        </p>

        <div className="flex items-center justify-between">
          {/* Meta */}
          <div className="flex items-center gap-3 text-xs dark:text-white/30 text-dark-400">
            <span className="flex items-center gap-1">
              <User2 size={11}/> {project.client}
            </span>
            {project.duration && (
              <span className="flex items-center gap-1">
                <Clock size={11}/> {project.duration}
              </span>
            )}
          </div>

          {/* Tags */}
          <div className="flex gap-1">
            {project.tags.slice(0, 2).map(tag => (
              <span key={tag}
                className="text-[9px] font-mono px-2 py-0.5 rounded-full
                           dark:bg-white/5 bg-black/5 dark:text-white/40 text-dark-400">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom accent bar */}
      <div
        className="h-[2px] w-0 group-hover:w-full transition-all duration-700"
        style={{ background: `linear-gradient(90deg, ${project.accentColor}, transparent)` }}
      />
    </motion.div>
  )
}

export default function Portfolio() {
  const [activeCategory, setActiveCategory] = useState('All')
  const ref    = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-100px' })

  const filtered = activeCategory === 'All'
    ? projects
    : projects.filter(p => p.category === activeCategory)

  return (
    <section id="portfolio" ref={ref}
      className="section-padding relative overflow-hidden dark:bg-dark-950 bg-light-bg">
      {/* Orb */}
      <div className="absolute top-1/3 right-0 w-96 h-96 orb orb-cyan opacity-8 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        {/* Header */}
        <div className="mb-14">
          <motion.span
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            className="tag-badge mb-4 inline-block"
          >
            02 — Selected Work
          </motion.span>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-display font-extrabold
                         dark:text-white text-dark-900"
            >
              Projects that<br />
              <span className="gradient-text-warm">made an impact.</span>
            </motion.h2>

            <motion.a
              href="#contact"
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ delay: 0.3 }}
              className="group flex items-center gap-2 text-sm font-display font-semibold
                         dark:text-white/60 text-dark-500 hover:text-accent-cyan transition-colors"
            >
              All Projects
              <ArrowUpRight size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </motion.a>
          </div>
        </div>

        {/* Filter tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.2 }}
          className="flex flex-wrap gap-2 mb-10"
        >
          {CATEGORIES.map(cat => (
            <motion.button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className={`px-5 py-2 rounded-full text-sm font-display font-semibold transition-all duration-300
                ${activeCategory === cat
                  ? 'bg-gradient-to-r from-accent-cyan to-accent-violet text-dark-950 shadow-glow-cyan'
                  : 'glass dark:text-white/50 text-dark-500 hover:text-accent-cyan border border-white/10 hover:border-accent-cyan/30'
                }`}
            >
              {cat}
            </motion.button>
          ))}
        </motion.div>

        {/* Grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filtered.map((project, i) => (
              <ProjectCard key={project.id} project={project} index={i} />
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  )
}
