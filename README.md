# braun controls

The page is the device.

A study in hardware interface design after Dieter Rams. Built around an
interactive recreation of the Braun CSV 13 amplifier of 1965 — but with
a twist: every control on the amp actually controls something about
the page itself.

By [KLINEKRAFT](https://colinkline.com).

## What the controls do

The amp at the top is wired to global page state:

- **Dial (top right)** → flips light/dark mode. Click or drag.
- **Power button (ein/aus)** → toggles the entire page on or off. Off
  = grayscale, dimmed, devices look sleeping.
- **Source selector (teardrop)** → cycles through page views: radio,
  phono 1–4, tonel, stereo T 1080. Each represents a different content
  mode (process notes, palette, typography, etc.). Click to advance.
- **Lautstärke (volume)** → controls the page's spatial density. Low
  = generous whitespace. High = packed.
- **Balance** → shifts the entire layout left or right. Bipolar.
- **Tiefen (bass)** → controls shadow depth across the page. Low = flat,
  pure 2D. High = deep neumorphic dimensionality.
- **Höhen (treble)** → controls border crispness. Adds visible edges to
  every panel.
- **Status pills (rein / pr / rf)** → small mode indicators.

The "now playing" strip below the amp shows live readouts of every
control. As you turn knobs, the page changes shape.

## Six-piece control study

Below the hero, six neumorphic switches in CSS as a pure aesthetic
study — these don't drive global state, they just exist to be touched:
slide toggle, twin button radio, rotary knob, vertical slider bank,
push button, mini toggle.

## Stack

- Vite + React 18
- React Context for global device state
- Plain CSS with custom properties — no Tailwind, no UI library
- Pointer events for touch + mouse, fully keyboard accessible
- Total: ~52 KB JS / 4 KB CSS gzipped

## Type & color

- **Sans:** Inter Tight (open-source stand-in for Akzidenz-Grotesk,
  Braun's house typeface during the Rams era)
- **Mono:** JetBrains Mono
- All-lowercase, tight tracking — after Braun's house style
- Dual palette: porcelain light + ink-warm dark, both derived from the
  CSV 13 face

## Develop

```bash
npm install
npm run dev
```

## Deploy

```bash
npm run build
```

Drop `dist/` into Vercel, Cloudflare Pages, or wherever.

---

KLINEKRAFT · Tulsa OK · less, but better
