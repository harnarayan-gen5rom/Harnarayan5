import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { tools } from '../data/portfolio'

const SOFTWARE_LOGOS = {
  'After Effects':   { abbr: 'Ae', color: '#9999FF', bg: '#00005B' },
  'Premiere Pro':    { abbr: 'Pr', color: '#EA77FF', bg: '#2A0040' },
  'Photoshop':       { abbr: 'Ps', color: '#31A8FF', bg: '#001C32' },
  'Illustrator':     { abbr: 'Ai', color: '#FF9A00', bg: '#2B1700' },
  'Blender':         { abbr: 'Bn', color: '#E87D0D', bg: '#1A0E00' },
  'DaVinci Resolve': { abbr: 'Dr', color: '#FF5A5A', bg: '#1F0000' },
  'Cinema 4D':       { abbr: 'C4', color: '#009FFC', bg: '#001E3A' },
  'Figma':           { abbr: 'Fg', color: '#A259FF', bg: '#1A0040' },
  'Lightroom':       { abbr: 'Lr', color: '#31A8FF', bg: '#001220' },
  'InDesign':        { abbr: 'Id', color: '#FF3366', bg: '#2A001A' },
}

const MARQUEE_ITEMS = [
  'After Effects', 'Premiere Pro', 'DaVinci Resolve', 'Cinema 4D',
  'Blender', 'Photoshop', 'Illustrator', 'Figma', 'InDesign', 'Lightroom',
  'Nuke', 'Houdini', 'Unreal Engine', 'Logic Pro', 'Ableton Live',
]

function ToolCard({ tool, index, inView }) {
  const logo = SOFTWARE_LOGOS[tool.name] || { abbr: tool.name.slice(0,2), color: tool.color, bg: '#111' }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.85 }}
      animate={inView ? { opacity: 1, scale: 1 } : {}}
      transition={{ duration: 0.5, delay: index * 0.07, ease: [0.16, 1, 0.3, 1] }}
      className="glass-card rounded-2xl p-5 group flex flex-col items-center gap-3 text-center"
    >
      {/* Software icon */}
      <div
        className="w-14 h-14 rounded-xl flex items-center justify-center font-display font-extrabold text-sm
                   transition-transform duration-300 group-hover:scale-110"
        style={{ background: logo.bg, color: logo.color, border: `1px solid ${logo.color}30` }}
      >
        {logo.abbr}
      </div>

      <div>
        <div className="text-xs font-display font-bold dark:text-white text-dark-800 mb-1">
          {tool.name}
        </div>
        <div className="text-[10px] font-mono dark:text-white/30 text-dark-400 uppercase tracking-widest">
          {tool.category}
        </div>
      </div>

      {/* Mini skill bar */}
      <div className="w-full h-1 dark:bg-white/5 bg-black/5 rounded-full overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          style={{ background: `linear-gradient(90deg, ${tool.color}88, ${tool.color})` }}
          initial={{ width: 0 }}
          animate={inView ? { width: `${tool.level}%` } : {}}
          transition={{ duration: 1, delay: 0.3 + index * 0.06, ease: [0.16, 1, 0.3, 1] }}
        />
      </div>

      <span className="text-[10px] font-mono" style={{ color: tool.color }}>
        {tool.level}%
      </span>
    </motion.div>
  )
}

export default function Tools() {
  const ref    = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section id="tools" ref={ref}
      className="section-padding relative overflow-hidden dark:bg-dark-950 bg-light-bg">
      {/* BG orb */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px]
                      orb orb-violet opacity-5 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        {/* Header */}
        <div className="mb-16 text-center max-w-3xl mx-auto">
          <motion.span
            initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}}
            className="tag-badge mb-4 inline-block"
          >
            04 — Toolkit
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-display font-extrabold
                       dark:text-white text-dark-900 mb-5"
          >
            Industry-standard
            <br /><span className="gradient-text-cyan">tools, mastered.</span>
          </motion.h2>
        </div>

        {/* Tools grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-20">
          {tools.map((tool, i) => (
            <ToolCard key={tool.name} tool={tool} index={i} inView={inView} />
          ))}
        </div>

        {/* Marquee strip */}
        <motion.div
          initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.5 }}
          className="relative overflow-hidden py-4"
        >
          {/* Edge fades */}
          <div className="absolute left-0 top-0 bottom-0 w-24 z-10
                          dark:bg-gradient-to-r dark:from-dark-950 from-light-bg to-transparent" />
          <div className="absolute right-0 top-0 bottom-0 w-24 z-10
                          dark:bg-gradient-to-l dark:from-dark-950 from-light-bg to-transparent" />

          <div className="marquee-inner">
            {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((item, i) => (
              <div key={i} className="flex items-center gap-6 mx-6 shrink-0">
                <span className="dark:text-white/20 text-dark-300 font-display font-semibold text-sm whitespace-nowrap">
                  {item}
                </span>
                <span className="w-1 h-1 rounded-full bg-accent-cyan/40" />
              </div>
            ))}
          </div>
        </motion.div>

        {/* Philosophy block */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.6 }}
          className="mt-16 grid sm:grid-cols-3 gap-5"
        >
          {[
            { label: 'Workflow Philosophy', text: 'I believe the best tool is the one that disappears — the software serves the story, never the other way around.' },
            { label: 'Performance First',   text: 'Optimized render pipelines and asset management mean I deliver faster without cutting corners.' },
            { label: 'Always Learning',     text: 'New releases, plugins, and techniques are tracked weekly. I treat craft as a lifelong practice.' },
          ].map((item, i) => (
            <div key={i} className="glass-card rounded-2xl p-6">
              <div className="w-8 h-0.5 bg-gradient-to-r from-accent-cyan to-accent-violet mb-4" />
              <div className="text-sm font-display font-bold dark:text-white text-dark-800 mb-2">
                {item.label}
              </div>
              <div className="text-xs dark:text-white/40 text-dark-500 leading-relaxed">
                {item.text}
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
