import { useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import { Send, Mail, MapPin, Clock, Github, Linkedin, Twitter, Instagram, ArrowUpRight } from 'lucide-react'

const SOCIALS = [
  { icon: Github,    label: 'GitHub',    href: '#', color: '#c8d6e5' },
  { icon: Linkedin,  label: 'LinkedIn',  href: '#', color: '#00f5ff' },
  { icon: Twitter,   label: 'Twitter',   href: '#', color: '#00f5ff' },
  { icon: Instagram, label: 'Instagram', href: '#', color: '#ff2d87' },
]

const INFO = [
  { icon: Mail,    label: 'Email',      value: 'alex@studio.co',      color: '#00f5ff' },
  { icon: MapPin,  label: 'Location',   value: 'Los Angeles, CA',      color: '#9f5cff' },
  { icon: Clock,   label: 'Availability', value: 'Open to projects',   color: '#ff2d87' },
]

export default function Contact() {
  const ref    = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-100px' })
  const [form, setForm] = useState({ name: '', email: '', project: '', message: '' })
  const [sent, setSent]  = useState(false)
  const [sending, setSending] = useState(false)

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const handleSubmit = (e) => {
    e.preventDefault()
    setSending(true)
    setTimeout(() => { setSending(false); setSent(true) }, 1600)
  }

  return (
    <section id="contact" ref={ref}
      className="section-padding relative overflow-hidden dark:bg-dark-950 bg-light-bg">

      <div className="absolute top-0 right-0 w-96 h-96 orb orb-cyan opacity-8 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 orb orb-magenta opacity-8 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        {/* Header */}
        <div className="mb-16 text-center">
          <motion.span
            initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}}
            className="tag-badge mb-4 inline-block"
          >
            06 — Contact
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-display font-extrabold
                       dark:text-white text-dark-900 mb-4"
          >
            Let's build something
            <br /><span className="gradient-text">extraordinary.</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.15 }}
            className="dark:text-white/45 text-dark-500 font-body max-w-xl mx-auto"
          >
            Have a project in mind? I'd love to hear about it. Let's create something
            that makes your audience stop and stare.
          </motion.p>
        </div>

        <div className="grid lg:grid-cols-5 gap-10">
          {/* Left sidebar */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7 }}
            className="lg:col-span-2 space-y-6"
          >
            {/* Info cards */}
            {INFO.map(({ icon: Icon, label, value, color }) => (
              <div key={label} className="glass-card rounded-2xl p-5 flex items-center gap-4 group">
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0
                             transition-transform duration-300 group-hover:scale-110"
                  style={{ background: `${color}15`, border: `1px solid ${color}25` }}
                >
                  <Icon size={16} style={{ color }} />
                </div>
                <div>
                  <div className="text-[10px] font-mono dark:text-white/35 text-dark-400 uppercase tracking-widest mb-0.5">
                    {label}
                  </div>
                  <div className="text-sm font-display font-semibold dark:text-white text-dark-800">
                    {value}
                  </div>
                </div>
              </div>
            ))}

            {/* Social links */}
            <div className="glass-card rounded-2xl p-5">
              <div className="text-xs font-mono dark:text-white/35 text-dark-400 uppercase tracking-widest mb-4">
                Follow the work
              </div>
              <div className="flex gap-3">
                {SOCIALS.map(({ icon: Icon, label, href, color }) => (
                  <motion.a
                    key={label}
                    href={href}
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    aria-label={label}
                    className="w-10 h-10 glass rounded-xl flex items-center justify-center
                               dark:text-white/40 text-dark-400 hover:text-accent-cyan transition-colors"
                  >
                    <Icon size={15} />
                  </motion.a>
                ))}
              </div>
            </div>

            {/* Availability card */}
            <div className="glass-card rounded-2xl p-5 gradient-border">
              <div className="flex items-center gap-2 mb-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-xs font-mono text-emerald-400 uppercase tracking-widest">
                  Available Now
                </span>
              </div>
              <div className="text-sm dark:text-white/50 text-dark-500 font-body leading-relaxed">
                Currently accepting new projects for Q2 2025. Limited spots available.
              </div>
            </div>
          </motion.div>

          {/* Right — Form */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="lg:col-span-3"
          >
            <div className="glass-card rounded-3xl p-8 sm:p-10 relative overflow-hidden">
              {/* Decorative gradient */}
              <div className="absolute top-0 right-0 w-48 h-48 pointer-events-none"
                style={{ background: 'radial-gradient(circle at 80% 20%, rgba(0,245,255,0.06), transparent 70%)' }} />

              {sent ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center justify-center text-center py-16 gap-5"
                >
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-accent-cyan to-accent-violet
                                  flex items-center justify-center text-4xl">
                    ✦
                  </div>
                  <h3 className="text-2xl font-display font-bold dark:text-white text-dark-900">
                    Message Sent!
                  </h3>
                  <p className="dark:text-white/45 text-dark-500 text-sm max-w-sm">
                    Thank you for reaching out. I'll get back to you within 24 hours.
                  </p>
                  <motion.button
                    onClick={() => setSent(false)}
                    whileHover={{ scale: 1.03 }}
                    className="mt-2 px-6 py-3 rounded-xl glass border border-accent-cyan/20 text-sm
                               font-display font-semibold dark:text-white text-dark-800"
                  >
                    Send Another
                  </motion.button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-mono dark:text-white/40 text-dark-500
                                        uppercase tracking-widest mb-2">
                        Your Name
                      </label>
                      <input
                        type="text" name="name" required
                        value={form.name} onChange={handleChange}
                        placeholder="John Doe"
                        className="form-input"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-mono dark:text-white/40 text-dark-500
                                        uppercase tracking-widest mb-2">
                        Email Address
                      </label>
                      <input
                        type="email" name="email" required
                        value={form.email} onChange={handleChange}
                        placeholder="you@company.com"
                        className="form-input"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-mono dark:text-white/40 text-dark-500
                                      uppercase tracking-widest mb-2">
                      Project Type
                    </label>
                    <select
                      name="project" value={form.project} onChange={handleChange}
                      className="form-input"
                    >
                      <option value="" disabled>Select a service...</option>
                      <option value="video">Video Production</option>
                      <option value="motion">Motion Graphics</option>
                      <option value="design">Graphic Design</option>
                      <option value="direction">Creative Direction</option>
                      <option value="other">Other / Multiple</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-mono dark:text-white/40 text-dark-500
                                      uppercase tracking-widest mb-2">
                      Tell Me About Your Project
                    </label>
                    <textarea
                      name="message" required rows={5}
                      value={form.message} onChange={handleChange}
                      placeholder="Describe your project, timeline, goals..."
                      className="form-input resize-none"
                    />
                  </div>

                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    disabled={sending}
                    className="btn-glow w-full flex items-center justify-center gap-3 py-4 rounded-xl
                               bg-gradient-to-r from-accent-cyan via-accent-violet to-accent-magenta
                               text-dark-950 font-display font-bold tracking-wide
                               disabled:opacity-60 transition-all duration-300"
                  >
                    {sending ? (
                      <>
                        <span className="w-4 h-4 border-2 border-dark-950/30 border-t-dark-950
                                         rounded-full animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send size={16} />
                        Send Message
                        <ArrowUpRight size={14} />
                      </>
                    )}
                  </motion.button>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
