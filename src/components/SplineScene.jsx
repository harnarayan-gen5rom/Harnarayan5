import { useEffect } from 'react'

export default function SplineScene() {
  useEffect(() => {
    // Inject the Spline web-component script if not already present
    const id = 'spline-viewer-script'
    if (!document.getElementById(id)) {
      const s = document.createElement('script')
      s.id = id
      s.type = 'module'
      s.src = 'https://unpkg.com/@splinetool/viewer@1.12.73/build/spline-viewer.js'
      s.async = true
      document.head.appendChild(s)
    }
  }, [])

  return (
    <section id="spline-scene" className="w-full max-w-7xl mx-auto px-6 lg:px-10 pb-20">
      <div className="w-full mx-auto rounded-2xl overflow-hidden shadow-lg glass-card"
           style={{
             // Responsive height: smaller on small screens, larger on desktop
             height: 'min(max(40vh, 320px), 720px)'
           }}>
        <spline-viewer
          loading-anim-type="none"
          url="https://prod.spline.design/bCzuLFEqzOSbl9ic/scene.splinecode"
          style={{ width: '100%', height: '100%', display: 'block' }}
        ></spline-viewer>
      </div>
    </section>
  )
}
