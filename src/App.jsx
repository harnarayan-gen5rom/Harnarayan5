import React, { useEffect, useRef, useState } from 'react'
import { createLumenScene } from './lumen3d.js'
import './lumen.css'
import PortfolioContent from './PortfolioContent.jsx'

const projects = [
  { name: 'Motion Study 01', type: 'Motion Design', id: 'yDnmJa0fTsw', url: 'https://youtu.be/yDnmJa0fTsw' },
  { name: 'Motion Study 02', type: 'Visual Storytelling', id: 'I5RlqsDqhug', url: 'https://youtu.be/I5RlqsDqhug' },
  { name: 'Short Film / 01', type: 'Short-form Edit', id: '7uWk-hbkJkY', url: 'https://youtube.com/shorts/7uWk-hbkJkY' },
  { name: 'Short Film / 02', type: 'Short-form Edit', id: '1AOYe9wDsU4', url: 'https://youtube.com/shorts/1AOYe9wDsU4' }
]

const sections = ['WORK', 'ABOUT', 'CONTACT']

export default function App() {
  const canvasRef = useRef(null)
  const engineRef = useRef(null)
  const holdingRef = useRef(false)
  const pointRef = useRef({x: 0, y: 0, t: 0, downX: 0, downY: 0})
  const [mode, setMode] = useState('home')
  const [selected, setSelected] = useState(null)
  const [renderStatus, setRenderStatus] = useState('loading')
  const [stateLabel, setStateLabel] = useState('MOVE TO INTERACT')
  const [energy, setEnergy] = useState(0)
  const [holding, setHolding] = useState(false)
  const [showHelp, setShowHelp] = useState(false)
  const [reduced, setReduced] = useState(false)
  const modalClose = useRef(null)
  const previousFocus = useRef(null)

  useEffect(() => {
    let disposed = false
    const canvas = canvasRef.current
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    setReduced(prefersReduced)
    const onKey = e => {
      if (e.key !== 'Escape') return
      if (document.querySelector('.project-modal')) return
      engineRef.current?.setMode('home')
      setMode('home')
    }
    window.addEventListener('keydown', onKey)
    createLumenScene(canvas, {
      isCancelled: () => disposed,
      reducedMotion: prefersReduced,
      onReady: () => { if (!disposed) setRenderStatus('ready') },
      onFailure: () => { if (!disposed) setRenderStatus('fallback') },
      onEnergy: value => { if (!disposed) setEnergy(Math.round(value * 100)) },
      onState: label => { if (!disposed) setStateLabel(label) },
      onProject: index => { if (!disposed) setSelected(index) }
    }).then(engine => {
      if (disposed) engine?.dispose()
      else engineRef.current = engine
    }).catch(() => {
      if (!disposed) setRenderStatus('fallback')
    })
    return () => {
      disposed = true
      window.removeEventListener('keydown', onKey)
      engineRef.current?.dispose()
      engineRef.current = null
    }
  }, [])

  useEffect(() => {
    if (selected === null) return
    previousFocus.current = document.activeElement
    modalClose.current?.focus()
    const onKey = e => {
      if (e.key === 'Escape') setSelected(null)
      if (e.key === 'Tab') {
        const items = Array.from(document.querySelectorAll('.project-modal button, .project-modal a[href]'))
        if (!items.length) return
        if (e.shiftKey && document.activeElement === items[0]) { e.preventDefault(); items[items.length - 1].focus() }
        else if (!e.shiftKey && document.activeElement === items[items.length - 1]) { e.preventDefault(); items[0].focus() }
      }
    }
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('keydown', onKey)
      previousFocus.current?.focus?.()
    }
  }, [selected])

  function changeMode(next) {
    engineRef.current?.setMode(next)
    setMode(next)
    setShowHelp(false)
  }

  function feedPointer(e, isDown) {
    if (selected !== null) return
    const r = e.currentTarget.getBoundingClientRect()
    if (!r.width || !r.height) return
    const x = (e.clientX - r.left) / r.width
    const y = (e.clientY - r.top) / r.height
    const old = pointRef.current
    const now = performance.now()
    const speed = old.t ? Math.min(2.5, Math.hypot(x - old.x, y - old.y) / Math.max((now-old.t)/1000, .008)) : 0
    pointRef.current = {...old, x, y, t:now}
    engineRef.current?.pointer(x, y, speed, isDown)
  }

  function pointerDown(e) {
    if (e.target.closest('button,a,input,[role="dialog"]')) return
    pointRef.current.downX=e.clientX
    pointRef.current.downY=e.clientY
    pointRef.current.t=0 // prevent stale pointer velocity from creating a snap
    holdingRef.current=true
    setHolding(true)
    e.currentTarget.setPointerCapture?.(e.pointerId)
    feedPointer(e, true)
  }
  function pointerMove(e) {
    if (e.pointerType === 'touch' && !holdingRef.current) return
    feedPointer(e, holdingRef.current)
  }
  function pointerUp(e) {
    holdingRef.current=false
    if (e.currentTarget.hasPointerCapture?.(e.pointerId)) e.currentTarget.releasePointerCapture(e.pointerId)
    if (e.target.closest('button,a,input,[role="dialog"]')) { setHolding(false); engineRef.current?.release(); return }
    const click = Math.hypot(e.clientX-pointRef.current.downX,e.clientY-pointRef.current.downY) < 14
    feedPointer(e, false)
    engineRef.current?.release()
    setHolding(false)
    if (!click) return
    if (mode === 'work') {
      const index = engineRef.current?.pickProject(pointRef.current.x, pointRef.current.y)
      if (index !== null && index !== undefined && index >= 0) setSelected(index)
    } else if (mode === 'home' && engineRef.current?.isNearAperture(pointRef.current.x, pointRef.current.y)) {
      changeMode('work')
    } else if (mode === 'home') engineRef.current?.ripple()
  }
  function release() {
    holdingRef.current=false
    setHolding(false)
    engineRef.current?.release()
    engineRef.current?.pointerLeave()
  }

  return (
    <>
    <main
      id="home"
      className={'lumen-site view-'+mode+(holding?' sculpting':'')}
      onPointerDown={pointerDown} onPointerMove={pointerMove}
      onPointerUp={pointerUp} onPointerCancel={release} onPointerLeave={release}
      aria-label="Lumen Fold interactive portfolio"
    >
      <div className="gallery-ambient" aria-hidden="true" />
      <canvas className={'lumen-canvas '+(renderStatus === 'ready'?'ready':'')} ref={canvasRef} aria-hidden="true" />
      <div className="floor-mist" aria-hidden="true" />
      {renderStatus !== 'ready' && (
        <div className="fallback-sculpture" aria-hidden="true">{Array.from({length:14},(_,i)=><i key={i}/>)}</div>
      )}
      <header className="lumen-header">
        <a className="wordmark" href="#home" onClick={e=>{e.preventDefault();changeMode('home')}}>GEN<span>5</span>ROM</a>
        <nav className="primary-navigation" aria-label="Main">
          {sections.map(s => <a key={s} href={'#'+s.toLowerCase()}>{s}</a>)}
        </nav>
      </header>

      <div className={'home-headline '+(mode==='home'?'visible':'')} aria-hidden={mode !== 'home'}>
        <div className="concept-index">HARNARAYAN / MOTION & VIDEO <span>— INTERACTIVE STUDY</span></div>
        <h1>LUMEN<br/>FOLD<span className="title-stop">.</span></h1>
        <p>SCULPT THE INVISIBLE.</p>
        <div className="lumen-hero-role">VIDEO EDITOR <span>·</span> MOTION GRAPHICS DESIGNER</div>
        <div className="lumen-hero-actions">
          <a className="unfold-link" href="#work" tabIndex={mode==='home'?0:-1}>EXPLORE MY WORK <span aria-hidden="true">↗</span></a>
          <button className="lumen-unfold-secondary" onClick={()=>changeMode('work')} tabIndex={mode==='home'?0:-1}>3D GALLERY <span aria-hidden="true">↗</span></button>
        </div>
      </div>

      <section className={'lumen-info '+(mode==='work'?'info-visible':'')} aria-label="Selected work" aria-hidden={mode !== 'work'}>
        <span className="section-kicker">01 — SELECTED WORK</span>
        <h2>THE<br/>GALLERY<span>.</span></h2>
        <p>Four pieces. A thousand ways to move.</p>
        <div className="project-list" role="list">
          {projects.map((p,i)=><button role="listitem" tabIndex={mode==='work'?0:-1} key={p.id} onClick={()=>setSelected(i)}><span>0{i+1}</span><strong>{p.name}</strong><small>{p.type}</small><b>↗</b></button>)}
        </div>
        <button className="return-link" onClick={()=>changeMode('home')} tabIndex={mode==='work'?0:-1}>← RETURN TO SCULPTURE</button>
      </section>

      <section className={'lumen-info editorial-info '+(mode==='about'?'info-visible':'')} aria-label="About" aria-hidden={mode !== 'about'}>
        <span className="section-kicker">02 — THE ARTIST</span>
        <h2>IDEAS<br/>IN MOTION<span>.</span></h2>
        <p>I'm Harnarayan, a video editor and motion graphics designer. I turn complex ideas into clear, expressive visual stories.</p>
        <div className="skill-tags"><span>AFTER EFFECTS</span><span>PREMIERE PRO</span><span>ILLUSTRATOR</span><span>PHOTOSHOP</span><span>SPLINE</span><span>FRAMER</span></div>
        <a className="return-link" href="https://harnarayan-gen5rom.github.io/GEN5ROM/" target="_blank" rel="noreferrer" tabIndex={mode==='about'?0:-1}>VIEW FULL PORTFOLIO ↗</a>
      </section>

      <section className={'lumen-info editorial-info '+(mode==='contact'?'info-visible':'')} aria-label="Contact" aria-hidden={mode !== 'contact'}>
        <span className="section-kicker">03 — COLLABORATE</span>
        <h2>LET'S MAKE<br/>IT MOVE<span>.</span></h2>
        <p>Have a story, a product, or an idea worth bringing to life? I'd love to hear about it.</p>
        <div className="contact-links">
          <a href="https://harnarayan-gen5rom.github.io/GEN5ROM/#contact" target="_blank" rel="noreferrer" tabIndex={mode==='contact'?0:-1}>SEND AN INQUIRY <span>↗</span></a>
          <a href="https://github.com/harnarayan-gen5rom" target="_blank" rel="noreferrer" tabIndex={mode==='contact'?0:-1}>EXPLORE GITHUB <span>↗</span></a>
        </div>
        <button className="return-link" onClick={()=>changeMode('home')} tabIndex={mode==='contact'?0:-1}>← BACK TO LUMEN FOLD</button>
      </section>

      <footer className="lumen-footer">
        <div className="interaction-meter">
          <span className="interaction-ring" aria-hidden="true"><i/></span>
          <div className="footer-status"><strong>{holding?'DRAG THE FABRIC':stateLabel}</strong><span>{renderStatus==='loading'?'PREPARING CLOTH SIMULATION':renderStatus==='fallback'?'FABRIC PREVIEW · WEBGL UNAVAILABLE':renderStatus==='ready'?'REAL-TIME 3D / ORGANIC CLOTH':'INTERACTIVE EXPERIMENT'}</span></div>
          <div className="meter-line"><span style={{width:energy+'%'}}/></div>
        </div>
        <div className="footer-middle"><button onClick={()=>setShowHelp(v=>!v)} aria-expanded={showHelp} aria-controls="interaction-guide">HOW TO INTERACT <span>?</span></button></div>
        <div className="slide-count">LUMEN <span>/ GEN5ROM</span></div>
      </footer>

      {showHelp && <div className="help-bubble" id="interaction-guide" role="note"><button aria-label="Close guide" onClick={()=>setShowHelp(false)}>×</button><strong>TOUCH THE INVISIBLE.</strong><p>Move over the flowing white cloth to bend it. On phones, press and drag to pull the fabric; release to watch the waves settle. Open WORK to explore projects.</p></div>}

      {renderStatus==='loading'&&<div className="load-marker" aria-live="polite"><span className="load-orbit"/>INITIALIZING LIGHT...</div>}
      {selected !== null && <div className="project-modal" role="presentation">
        <div className="modal-shade" onClick={()=>setSelected(null)}/>
        <div className="modal-window" role="dialog" aria-modal="true" aria-labelledby="activeProjectTitle">
          <div className="modal-heading"><span>GEN5ROM / PROJECT TRANSMISSION</span><button ref={modalClose} onClick={()=>setSelected(null)} aria-label="Close project">✕</button></div>
          <h2 id="activeProjectTitle">{projects[selected].name}</h2>
          <div className="video-shell"><iframe title={projects[selected].name} src={'https://www.youtube-nocookie.com/embed/'+projects[selected].id+'?autoplay=1&playsinline=1&rel=0'} allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowFullScreen referrerPolicy="strict-origin-when-cross-origin"/></div>
          <div className="modal-bottom"><span>{projects[selected].type}</span><a href={projects[selected].url} target="_blank" rel="noreferrer">OPEN ORIGINAL ↗</a></div>
        </div>
      </div>}
      {reduced&&<span className="screen-reader-only">Reduced motion mode is enabled. Navigation and project links remain available.</span>}
    </main>
    <PortfolioContent/>
    </>
  )
}