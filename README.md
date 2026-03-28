# Alex Rivera — Creative Portfolio

A premium, award-worthy personal portfolio website for creative professionals specializing in Video Editing, Motion Graphics, and Graphic Design.

## Tech Stack

- **React 18** + **Vite 5** — blazing-fast dev + build
- **Tailwind CSS 3** — utility-first styling with custom design tokens
- **Framer Motion** — cinematic page animations, scroll reveals, hover effects
- **Lucide React** — crisp SVG icons

## Design System

| Token | Value |
|---|---|
| Dark BG | `#02020a` → `#0d0d20` |
| Accent Cyan | `#00f5ff` |
| Accent Violet | `#9f5cff` |
| Accent Magenta | `#ff2d87` |
| Display Font | Syne (Google Fonts) |
| Body Font | DM Sans (Google Fonts) |
| Mono Font | JetBrains Mono (Google Fonts) |

## Sections

1. **Hero** — fullscreen cinematic intro with typewriter, particle canvas, animated headline, stat counters
2. **About** — profile card, bio, trait highlights, animated skill bars, career timeline
3. **Portfolio** — filterable project grid (Video / Motion / Design) with hover previews
4. **Services** — 4 service cards with icons, feature lists, animated gradient borders
5. **Tools** — 10-tool grid with mastery bars, scrolling marquee, philosophy blocks
6. **Testimonials** — 4 client cards (desktop grid + mobile carousel)
7. **Contact** — form with validation, info cards, social links, availability badge
8. **Footer** — minimal branded footer with scroll-to-top

## Premium Features

- 🎯 Custom CSS cursor (dot + ring with hover expansion)
- 🌗 Dark / Light theme toggle with smooth transition (persisted to localStorage)
- 🪐 Mouse-parallax floating 3D elements (glass orbs, metallic rings, holographic panels)
- ✨ Particle canvas animation in hero
- 📜 Scroll-triggered reveal animations via Framer Motion + `useInView`
- 🔤 Typewriter role animation (Video Editor → Motion Designer → ...)
- 💫 Glassmorphism cards with animated gradient borders
- 🎨 Noise overlay texture for premium tactile feel
- 📱 Fully responsive (mobile, tablet, desktop)
- 🔠 Custom scrollbar with gradient thumb
- ⚡ Vite-optimized build for production

## Getting Started

```bash
# 1. Install dependencies
npm install

# 2. Run dev server
npm run dev

# 3. Build for production
npm run build

# 4. Preview production build
npm run preview
```

The site runs at `http://localhost:5173` by default.

## Customization

### Update your info
Edit `/src/data/portfolio.js` to change:
- Projects (title, category, client, description, tags)
- Services offered
- Tool proficiency levels
- Testimonials
- Stats (years, projects, clients, awards)
- Nav links

### Change colors
Edit `/tailwind.config.js` under `theme.extend.colors`.

### Change fonts
Replace Google Fonts link in `index.html` and update `tailwind.config.js` `fontFamily`.

### Add real images
Replace the SVG placeholder visuals in `Portfolio.jsx` with actual `<img>` tags pointing to your project screenshots.

## Folder Structure

```
src/
├── components/
│   ├── CustomCursor.jsx      # CSS cursor with JS lag animation
│   ├── FloatingElements.jsx  # Mouse-parallax 3D decorative elements
│   ├── Navbar.jsx            # Glass navbar with mobile drawer + theme toggle
│   ├── Hero.jsx              # Fullscreen hero with particles + typewriter
│   ├── About.jsx             # Profile, skills, experience
│   ├── Portfolio.jsx         # Filterable project grid
│   ├── Services.jsx          # Service offering cards
│   ├── Tools.jsx             # Software toolkit + marquee
│   ├── Testimonials.jsx      # Client feedback (grid + mobile carousel)
│   ├── Contact.jsx           # Contact form + social links
│   └── Footer.jsx            # Minimal footer
├── hooks/
│   ├── useTheme.jsx          # Dark/light theme context + localStorage
│   └── useMouseParallax.js   # Mouse position → parallax offset hook
├── data/
│   └── portfolio.js          # All site data (projects, services, tools, etc.)
├── App.jsx                   # Root layout + page loader
├── main.jsx                  # ReactDOM entry
└── index.css                 # Global styles (glassmorphism, cursors, animations)
```

## License

MIT — free to use and adapt for your own portfolio.
