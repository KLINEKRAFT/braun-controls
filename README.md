# braun controls

A study in hardware interface design after Dieter Rams.

Built around a three.js recreation of the Braun CSV 13 amplifier of
1965 — Rams' iconic stereo amp face — with an accompanying interactive
study of six neumorphic control elements below.

By [KLINEKRAFT](https://colinkline.com).

## What's in here

**Hero scene.** A 3D recreation of the CSV 13 amplifier face panel —
brushed aluminum body, four black knobs (lautstärke, balance, tiefen,
höhen), the iconic teardrop source selector, BRAUN wordmark, status
indicators, mounting screws. Drag to orbit, scroll to zoom, click the
controls to interact.

**Control study.** Six neumorphic switches in CSS:

1. Slide toggle (power)
2. Twin button radio (channel A/B)
3. Rotary knob (gain) — drag to rotate, arrow keys for precision
4. Three vertical sliders (mix)
5. Push button (trigger) with counter
6. Mini toggle (standby)

## Stack

- Vite + React 18
- three.js + @react-three/fiber + drei for the hero
- Plain CSS with custom properties — no Tailwind, no UI library
- Pointer events for touch + mouse, fully keyboard accessible

## Type & color

- **Sans:** Inter Tight (open-source stand-in for Akzidenz-Grotesk,
  Braun's house typeface during the Rams era)
- **Mono:** JetBrains Mono
- **Convention:** all-lowercase, tight tracking — after Braun's house style

Palette derived directly from the CSV 13 face panel: porcelain
white surface, matte black knobs, tan/peach status indicators,
Braun-orange accent.

## Develop

```bash
npm install
npm run dev
```

## Deploy

```bash
npm run build
```

Drag `dist/` into Vercel, Cloudflare Pages, or wherever.

---

KLINEKRAFT · Tulsa OK · less, but better
