# Cobound Homepage -- cobound.dev

## What This Is
Landing page for Cobound. Two paths: Prova (compliance) and COBOUND (multi-agent coordination).
Headline: "The world needs proof. We build it."

## Stack
- Vite + React 19 + TypeScript
- Tailwind CSS (via CDN script tag)
- Framer Motion for animations
- Three.js (@react-three/fiber) for particle system
- Monaco Editor for live YAML validator playground
- js-yaml for parsing

## Key Components
- App.tsx -- main layout, section ordering
- Hero.tsx -- dual-path cards (Prova live link + COBOUND scroll)
- ProvaSection.tsx -- Prova feature cards, certificate preview, CTA
- ProductsSection.tsx -- Validator playground with live DFS cycle detection
- ParticleSystem.tsx -- Three.js particle background
- AmbientBackground.tsx -- aurora gradient background (activates after hero)
- StickyNav.tsx -- appears after hero scrolls away
- GlassCard.tsx -- glassmorphism card component
- lib/cycleDetection.ts -- O(n+m) DFS cycle detection (pure TS)

## Design
- Near-black background (#050505)
- Glass cards with subtle borders
- Teal/green (#34d399) for Prova accents
- Blue for COBOUND accents, pink for secondary
- Fonts: Inter (via Google Fonts CDN)
- No em dashes in any text

## Build
- npm run dev (port 3000)
- npm run build (runs generate-og.mjs first, then vite build)
