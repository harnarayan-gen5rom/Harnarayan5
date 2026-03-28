import { motion } from 'framer-motion'
import { useMouseParallax } from '../hooks/useMouseParallax'

export default function FloatingElements() {
  const mouse = useMouseParallax(0.018)

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0" aria-hidden>
      {/* Large orbs */}
      <motion.div
        className="orb orb-cyan"
        style={{ width: 600, height: 600, top: '-15%', left: '-10%' }}
        animate={{ x: [0, 30, 0], y: [0, -20, 0] }}
        transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="orb orb-violet"
        style={{ width: 500, height: 500, top: '30%', right: '-8%' }}
        animate={{ x: [0, -25, 0], y: [0, 30, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
      />
      <motion.div
        className="orb orb-magenta"
        style={{ width: 400, height: 400, bottom: '10%', left: '20%' }}
        animate={{ x: [0, 20, -20, 0], y: [0, -30, 0] }}
        transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut', delay: 4 }}
      />

      {/* Mouse-tracked floating shapes */}
      <motion.div
        className="absolute"
        style={{
          top: '18%', right: '12%',
          x: mouse.x * -1.6, y: mouse.y * -1.6,
        }}
        animate={{ y: [0, -20, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
      >
        {/* Glass orb */}
        <div
          style={{
            width: 90, height: 90,
            borderRadius: '50%',
            background: 'radial-gradient(circle at 35% 35%, rgba(0,245,255,0.35), rgba(159,92,255,0.1) 60%, transparent)',
            border: '1px solid rgba(0,245,255,0.25)',
            backdropFilter: 'blur(8px)',
            boxShadow: '0 0 40px rgba(0,245,255,0.15), inset 0 0 20px rgba(0,245,255,0.05)',
          }}
        />
      </motion.div>

      {/* Metallic ring top-left */}
      <motion.div
        className="absolute"
        style={{ top: '42%', left: '5%', x: mouse.x * 1.2, y: mouse.y * 1.2 }}
        animate={{ rotate: 360 }}
        transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
      >
        <div style={{
          width: 70, height: 70,
          borderRadius: '50%',
          border: '2px solid transparent',
          background: 'linear-gradient(#0d0d20, #0d0d20) padding-box, linear-gradient(135deg, #00f5ff, #9f5cff, #ff2d87) border-box',
          opacity: 0.6,
        }} />
      </motion.div>

      {/* Geometric diamond */}
      <motion.div
        className="absolute"
        style={{ bottom: '28%', right: '8%', x: mouse.x * 2, y: mouse.y * 2 }}
        animate={{ rotate: [0, 45, 0], scale: [1, 1.05, 1] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
      >
        <div style={{
          width: 44, height: 44,
          background: 'linear-gradient(135deg, rgba(159,92,255,0.4), rgba(255,45,135,0.4))',
          border: '1px solid rgba(159,92,255,0.3)',
          transform: 'rotate(45deg)',
          backdropFilter: 'blur(4px)',
        }} />
      </motion.div>

      {/* Small glowing dot cluster */}
      {[
        { top: '65%', left: '3%',   size: 6,  color: '#00f5ff', delay: 0   },
        { top: '67%', left: '5%',   size: 4,  color: '#9f5cff', delay: 0.5 },
        { top: '63%', left: '6.5%', size: 5,  color: '#ff2d87', delay: 1   },
        { top: '12%', right: '30%', size: 5,  color: '#00f5ff', delay: 0.3 },
        { top: '15%', right: '28%', size: 3,  color: '#9f5cff', delay: 0.8 },
      ].map((dot, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            top: dot.top, left: dot.left, right: dot.right,
            width: dot.size, height: dot.size,
            background: dot.color,
            boxShadow: `0 0 ${dot.size * 3}px ${dot.color}`,
            x: mouse.x * 0.8, y: mouse.y * 0.8,
          }}
          animate={{ opacity: [0.4, 1, 0.4], scale: [0.8, 1.2, 0.8] }}
          transition={{ duration: 3, repeat: Infinity, delay: dot.delay, ease: 'easeInOut' }}
        />
      ))}

      {/* Holographic panel */}
      <motion.div
        className="absolute"
        style={{ top: '55%', left: '2%', x: mouse.x * 0.5, y: mouse.y * 0.5 }}
        animate={{ y: [0, -12, 0], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
      >
        <div style={{
          width: 48, height: 80,
          background: 'linear-gradient(135deg, rgba(0,245,255,0.08), rgba(159,92,255,0.12))',
          border: '1px solid rgba(0,245,255,0.15)',
          borderRadius: 8,
          backdropFilter: 'blur(4px)',
        }} />
      </motion.div>

      {/* Cross/plus decorations */}
      {[
        { top: '33%', right: '22%', color: 'rgba(0,245,255,0.3)' },
        { top: '78%', left: '18%', color: 'rgba(159,92,255,0.3)' },
      ].map((cross, i) => (
        <motion.div
          key={i}
          className="absolute"
          style={{ top: cross.top, right: cross.right, left: cross.left }}
          animate={{ rotate: [0, 90, 0], scale: [1, 1.1, 1] }}
          transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut', delay: i * 3 }}
        >
          <svg width="20" height="20" viewBox="0 0 20 20">
            <line x1="10" y1="0" x2="10" y2="20" stroke={cross.color} strokeWidth="1.5"/>
            <line x1="0" y1="10" x2="20" y2="10" stroke={cross.color} strokeWidth="1.5"/>
          </svg>
        </motion.div>
      ))}
    </div>
  )
}
