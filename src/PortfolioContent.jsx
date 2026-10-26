import React, {useEffect, useMemo, useRef, useState} from 'react'
import {portfolioProjects,originalPortfolio,resumeLink} from './portfolioData.js'
import './portfolioFull.css'

const ROOT='https://harnarayan-gen5rom.github.io/GEN5ROM/'
const categories=[
  {id:'all',label:'All work'},
  {id:'motion',label:'Motion graphics'},
  {id:'video',label:'Video editing'},
  {id:'kids',label:'AI stories'},
  {id:'design',label:'Graphic design'}
]
const strengths=[
  {no:'01',title:'Motion design',body:'Kinetic typography, animated explainers, graphic transitions and visual storytelling.'},
  {no:'02',title:'Video editing',body:'Narrative pacing, short-form content, promotional films, audio finishing and color.'},
  {no:'03',title:'Visual effects',body:'Compositing, tracking, dimensional effects and polished visual layers.'},
  {no:'04',title:'Interactive design',body:'Spline 3D explorations, motion-led concepts, Framer and immersive web experiences.'}
]
const timeline=[
  {period:'APR 2026 — SEP 2026',company:'ZIGENCY',place:'DELHI · FULL-TIME',role:'Video Editor & Motion Graphics Designer',description:'Created property showcases, promotional edits, real-estate reels and AI-focused digital content. Combined footage, animated typography, motion graphics, VFX and sound design from script to delivery.',tags:['Real estate marketing','AI / technology content','Brand campaigns'],href:'https://www.instagram.com/zigency.in/'},
  {period:'NOV 2025 — APR 2026',company:'INDEPENDENT PROJECTS',place:'NEW DELHI',role:'Freelance Video Editor & Motion Graphics Designer',description:'Edited videos and short-form content for YouTubers and digital creators, adapting narrative, pacing, graphics and visual identity to each platform.',tags:['Creator content','Short-form editing','Motion graphics']},
  {period:'AUG 2025 — OCT 2025',company:'NEOFOX MEDIA',place:'DELHI · INTERNSHIP',role:'Video Editor Intern',description:'Edited long- and short-form videos, trailers and showreels. Supported narrative cuts, color grading, audio finishing, motion graphics and feedback-based revisions.',tags:['Video production','Color & audio','Post-production']}
]
const software=['After Effects','Premiere Pro','Photoshop','Illustrator','Adobe Dimension','DaVinci Resolve','Spline 3D','Framer']
const capabilities=['Motion graphics','Video editing','Compositing & VFX','Motion tracking','Kinetic typography','Color grading','Sound design','Graphic design','Storyboarding','AI-assisted production','Social media content','Interactive 3D']
const socials=[
  {name:'GITHUB',url:'https://github.com/harnarayan-gen5rom'},
  {name:'ORIGINAL GEN5ROM',url:originalPortfolio},
  {name:'SPLINE 3D',url:'https://prod.spline.design/bCzuLFEqzOSbl9ic/scene.splinecode'}
]

function Kicker({children,index}){return <div className="pf-kicker"><span>{index}</span><i/>{children}</div>}
function SectionHeading({number,label,title,description}) {
  return <div className="pf-section-heading">
    <div><Kicker index={number}>{label}</Kicker><h2>{title}</h2></div>
    {description&&<p>{description}</p>}
  </div>
}
export default function PortfolioContent(){
  const [filter,setFilter]=useState('all')
  const [limit,setLimit]=useState(12)
  const [activeProject,setActiveProject]=useState(null)
  const [activeSection,setActiveSection]=useState('work')
  const closeRef=useRef(null),previousFocus=useRef(null)
  const projects=useMemo(()=>portfolioProjects.filter(item=>filter==='all'||item.category===filter),[filter])
  const displayed=projects.slice(0,limit)

  useEffect(()=>{
    if(!activeProject)return
    previousFocus.current=document.activeElement
    const before=document.body.style.overflow
    document.body.style.overflow='hidden'
    const handleKey=e=>{
      if(e.key==='Escape')setActiveProject(null)
      if(e.key==='Tab'){
        const links=[...document.querySelectorAll('.pf-modal [data-dialog-control]')]
        if(!links.length)return
        if(e.shiftKey&&document.activeElement===links[0]){e.preventDefault();links.at(-1).focus()}
        else if(!e.shiftKey&&document.activeElement===links.at(-1)){e.preventDefault();links[0].focus()}
      }
    }
    document.addEventListener('keydown',handleKey)
    requestAnimationFrame(()=>closeRef.current?.focus())
    return()=>{
      document.body.style.overflow=before
      document.removeEventListener('keydown',handleKey)
      previousFocus.current?.focus?.()
    }
  },[activeProject])
  useEffect(()=>{
    if(!('IntersectionObserver' in window))return
    const nodes=[...document.querySelectorAll('.pf-section[data-track]')]
    const obs=new IntersectionObserver(entries=>{
      entries.forEach(e=>{if(e.isIntersecting)setActiveSection(e.target.id)})
    },{rootMargin:'-20% 0px -65% 0px',threshold:0})
    nodes.forEach(el=>obs.observe(el))
    return()=>obs.disconnect()
  },[])
  return <>
    <div className="pf-site" id="portfolio">
      <nav className="pf-sticky" aria-label="Portfolio sections">
        <div className="pf-container pf-sticky-inner">
          <a href="#home" className="pf-brand" aria-label="Back to interactive hero">G<span>5</span> / PORTFOLIO</a>
          <div className="pf-nav-links">
            {['work','experience','about','skills','contact'].map(x=><a key={x} href={'#'+x} className={activeSection===x?'pf-current':''}>{x.toUpperCase()}</a>)}
          </div>
          <a className="pf-nav-mail" href="mailto:narayansingh28489@gmail.com">LET'S TALK <span aria-hidden="true">↗</span></a>
        </div>
      </nav>

      <section className="pf-intro pf-container" aria-label="Portfolio introduction">
        <Kicker index="00">THE PERSON BEHIND THE MOTION</Kicker>
        <div className="pf-intro-grid">
          <h2>Ideas made<br/><em>visible.</em></h2>
          <div className="pf-intro-aside">
            <p>I'm <strong>Harnarayan</strong>, a video editor and motion graphics designer based in New Delhi. I turn complex ideas into visuals people can connect with.</p>
            <div className="pf-cta-line"><a href="#work" className="pf-action">EXPLORE PROJECTS <span>↗</span></a><a className="pf-minor" href={resumeLink} target="_blank" rel="noopener noreferrer">VIEW RESUME <span>↗</span></a></div>
            <div className="pf-mini-meta"><span>01+ YEAR PROFESSIONAL EXPERIENCE</span><span>DELHI, INDIA</span></div>
          </div>
        </div>
      </section>

      <section className="pf-section pf-work" id="work" data-track>
        <div className="pf-container">
          <SectionHeading number="01 / 05" label="THE SELECTED ARCHIVE" title={<>Work that <em>moves.</em></>} description="A collection of motion graphics, edits, visual effects, AI storytelling and design pieces from my original portfolio."/>
          <div className="pf-work-toolbar">
            <div className="pf-filter-list" role="group" aria-label="Filter portfolio projects">
              {categories.map(c=><button key={c.id} className={filter===c.id?'active':''} onClick={()=>{setFilter(c.id);setLimit(12)}} aria-pressed={filter===c.id}>{c.label}</button>)}
            </div>
            <span className="pf-count">{String(projects.length).padStart(2,'0')} PROJECTS</span>
          </div>
          <div className="pf-work-grid">
            {displayed.map((p,i)=><button key={p.id} className="pf-project" onClick={()=>setActiveProject(p)} aria-label={'Open '+p.title}>
              <span className="pf-project-image">
                <img src={p.image} alt="" loading="lazy" decoding="async" referrerPolicy="no-referrer" onError={e=>{e.currentTarget.style.opacity='0'}}/>
                <span className="pf-project-overlay">{p.video?'PLAY PROJECT':'VIEW ARTWORK'} <span>↗</span></span>
              </span>
              <span className="pf-project-info"><span className="pf-project-type">{p.categoryLabel}<span> / {String(i+1).padStart(2,'0')}</span></span><strong>{p.title}</strong></span>
            </button>)}
          </div>
          {displayed.length<projects.length&&<div className="pf-more"><button onClick={()=>setLimit(n=>Math.min(projects.length,n+12))}>VIEW MORE WORK <span aria-hidden="true">↓</span><small>{displayed.length} OF {projects.length}</small></button></div>}
          {displayed.length===projects.length&&<div className="pf-end-note">YOU'VE SEEN ALL {projects.length} PROJECTS <span>✳</span></div>}
        </div>
      </section>

      <section className="pf-section pf-experience" id="experience" data-track>
        <div className="pf-container">
          <SectionHeading number="02 / 05" label="THE JOURNEY" title={<>Experience & <em>growth.</em></>} description="Real experience, real work—concept development, editing, feedback and final delivery."/>
          <div className="pf-timeline">
            {timeline.map((item,i)=><article className="pf-job" key={item.company}>
              <div className="pf-job-date"><span>{String(i+1).padStart(2,'0')}</span><strong>{item.period}</strong></div>
              <div className="pf-job-detail">
                <div className="pf-job-heading"><span>{item.company}</span><small>{item.place}</small></div>
                <h3>{item.role}</h3>
                <p>{item.description}</p>
                <div className="pf-tag-row">{item.tags.map(t=><span key={t}>{t}</span>)}</div>
                {item.href&&<a className="pf-inline-link" href={item.href} rel="noopener noreferrer" target="_blank">SEE ZIGENCY'S INSTAGRAM ↗</a>}
              </div>
            </article>)}
          </div>
        </div>
      </section>

      <section className="pf-section pf-about" id="about" data-track>
        <div className="pf-container">
          <SectionHeading number="03 / 05" label="A LITTLE ABOUT ME" title={<>Beyond the <em>timeline.</em></>} />
          <div className="pf-about-grid">
            <div className="pf-portrait">
              <img src={ROOT+'assets/harnarayan-profile.webp'} alt="Portrait of Harnarayan" loading="lazy" decoding="async" />
              <div className="pf-photo-caption"><span>HARNARAYAN / GEN5ROM</span><span>NEW DELHI, INDIA</span></div>
            </div>
            <div className="pf-bio">
              <p className="pf-bio-lead">I don't just edit clips. I build the rhythm, movement and visual language that give an idea its identity.</p>
              <p>With around one year of professional experience across real-estate marketing, AI-focused media and creator content, I work from concept and scripts to motion design, editing, revisions and delivery.</p>
              <p>I enjoy learning new tools and exploring the space where motion graphics, visual effects and interactive 3D meet.</p>
              <div className="pf-education">
                <span>EDUCATION & TRAINING</span>
                <div><strong>B.Sc. (Biology) — Pursuing</strong><small>Indira Gandhi National Open University (IGNOU) · Distance learning</small></div>
                <div><strong>Graphic Design & Motion Graphics Training</strong><small>DICE Academy · New Delhi</small></div>
              </div>
              <a href={resumeLink} className="pf-action" target="_blank" rel="noopener noreferrer">VIEW FULL RESUME <span>↗</span></a>
            </div>
          </div>
        </div>
      </section>

      <section className="pf-section pf-skills" id="skills" data-track>
        <div className="pf-container">
          <SectionHeading number="04 / 05" label="MY TOOLKIT" title={<>Crafted across <em>disciplines.</em></>} description="From the first frame to the final export: a toolkit for motion, design and storytelling."/>
          <div className="pf-strength-grid">
            {strengths.map(s=><div className="pf-strength" key={s.no}><span>{s.no} / CAPABILITY</span><h3>{s.title}</h3><p>{s.body}</p></div>)}
          </div>
          <div className="pf-tools-grid">
            <div><h3>SOFTWARE</h3><div className="pf-skill-list">{software.map(x=><span key={x}>{x}</span>)}</div></div>
            <div><h3>WHAT I DO</h3><div className="pf-skill-list">{capabilities.map(x=><span key={x}>{x}</span>)}</div></div>
          </div>
          <div className="pf-lab">
            <div><span className="pf-lab-label">INTERACTIVE EXPERIMENT / LUMEN FOLD</span><h3>Motion you can <em>feel.</em></h3><p>Move your pointer, touch, or drag the 3D cloth above—watch it deform and reform with reactive light between the fabric.</p></div>
            <a href="#home" className="pf-action">RETURN TO THE 3D EXPERIENCE <span>↗</span></a>
          </div>
        </div>
      </section>

      <section className="pf-section pf-contact" id="contact" data-track>
        <div className="pf-container">
          <Kicker index="05 / 05">LET'S BUILD SOMETHING</Kicker>
          <div className="pf-contact-grid">
            <h2>Have an idea?<br/><em>Let's move it.</em></h2>
            <div className="pf-contact-right">
              <p>Whether it's a motion-driven brand story, product explainer, promotional video, or creative collaboration—I'd love to hear what you're making.</p>
              <a className="pf-email" href="mailto:narayansingh28489@gmail.com">narayansingh28489@gmail.com <span>↗</span></a>
              <div className="pf-socials">{socials.map(x=><a key={x.name} href={x.url} target="_blank" rel="noopener noreferrer">{x.name} <span>↗</span></a>)}</div>
            </div>
          </div>
          <footer className="pf-end-footer"><a href="#home">GEN5ROM / LUMEN FOLD ↑</a><span>BUILT TO MOVE · NEW DELHI</span><a href={resumeLink} target="_blank" rel="noopener noreferrer">RESUME ↗</a></footer>
        </div>
      </section>
    </div>

    {activeProject&&<div className="pf-modal" role="presentation">
      <div className="pf-modal-shade" onClick={()=>setActiveProject(null)}/>
      <div className="pf-modal-panel" role="dialog" aria-modal="true" aria-labelledby="pf-modal-title">
        <div className="pf-modal-top"><span>GEN5ROM / PROJECT ARCHIVE</span><button data-dialog-control ref={closeRef} onClick={()=>setActiveProject(null)} aria-label="Close project">✕</button></div>
        <div className="pf-modal-meta"><span>{activeProject.categoryLabel}</span><h3 id="pf-modal-title">{activeProject.title}</h3></div>
        {activeProject.video?
          <div className="pf-embed"><iframe src={'https://www.youtube-nocookie.com/embed/'+activeProject.video+'?autoplay=1&rel=0&playsinline=1'} title={activeProject.title} allow="autoplay; encrypted-media; picture-in-picture; fullscreen" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen/></div>:
          <div className="pf-art-detail"><img src={activeProject.image} alt={activeProject.title}/></div>}
        <div className="pf-modal-actions">
          {activeProject.video?<a data-dialog-control href={'https://youtu.be/'+activeProject.video} target="_blank" rel="noopener noreferrer">OPEN ORIGINAL VIDEO ↗</a>:
            <a data-dialog-control href={activeProject.image} target="_blank" rel="noopener noreferrer">VIEW FULL IMAGE ↗</a>}
          <span>ESC TO CLOSE</span>
        </div>
      </div>
    </div>}
  </>
}
