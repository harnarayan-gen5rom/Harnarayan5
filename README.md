# GEN5ROM — LUMEN FOLD

**SCULPT THE INVISIBLE.**

An independent, immersive, full-screen WebGL experiment made for Harnarayan's interactive portfolio. The concept is a monumental composition of individual pearlescent ceramic, optical-glass and polished-metal ribbon surfaces against a warm ivory photographic studio background.

## Live experience

GitHub Pages: https://harnarayan-gen5rom.github.io/Harnarayan5/

**This repository is independent.** Original GEN5ROM and GEN5ROM-CYBER websites are not modified by this project.

## Features

- **Real-time 3D**, authored with Three.js via version-pinned lazy browser import.
- **14 distinct ribbon surfaces (10 on low-power devices)** generated from unique Catmull-Rom spatial splines, tessellated as indexed 3D meshes; subtly convex surface profiles and metallic edge tracers.
- **Distance-sensitive sculpting**: projected world-space pointer positions influence each ribbon's springs, local displacement, wave motion, lighting and camera.
- **Press-and-hold aperture**: increased influence radius and controlled surface depth; release propagates an elastic recovery ripple.
- **Click-to-unfold** transitions to a true 3D gallery with interactive project planes linking to real work samples.
- **WORK / ABOUT / CONTACT**, keyboard navigation, mobile touch events, video modal and reduced-motion fallback.
- **Responsive composition**, adaptive pixel ratio, reduced topology and reduced transmission complexity on lower-powered devices.
- **WebGL graceful degradation** with a lightweight gallery-like fallback.
- **Resource cleanup** for render loops, textures, materials, geometries, listeners and resize observers.

## Technology

React 18 · Vite 5 · Three.js 0.164.1 (on-demand ESM) · WebGL

```bash
npm ci
npm run dev
npm run build
npm run preview
```

## Primary files

- `src/App.jsx` — navigation, UI, project selection and input lifecycle
- `src/lumen3d.js` — spline ribbon geometry, physically based materials, 3D projection, deformation physics and WebGL scene
- `src/lumen.css` — clean responsive full-viewport composition
- `.github/workflows/lumen-qa.yml` — Vite build, desktop/mobile browser navigation checks and an actual WebGL render probe

## Testing

GitHub Actions validates the Vite production build, desktop/mobile UI interactions, video modal, and a separate headless software-WebGL initialization/render probe.

**Note:** The reference image defines the visual direction, not a photographic pixel-exact match. Lighting/refraction depends on GPU capabilities. On lower-powered devices the renderer intentionally uses simpler materials for responsiveness.
