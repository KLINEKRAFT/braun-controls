# Switchboard

Six interactive controls in the spirit of Dieter Rams. A study in
neumorphic hardware UI rendered in React.

Built by [KLINEKRAFT](https://colinkline.com).

## Controls

1. **Slide toggle** — power
2. **Twin button** — channel A/B
3. **Rotary knob** — gain (drag to rotate, arrow keys for fine control)
4. **Vertical sliders** — three-band mix (drag or arrow keys)
5. **Push button** — momentary trigger with counter
6. **Mini toggle** — standby

## Stack

- Vite + React 18
- Plain CSS with custom properties — no Tailwind, no UI library
- Pointer events for touch + mouse
- Fully keyboard accessible

## Develop

```bash
npm install
npm run dev
```

## Deploy

Build to `dist/`:

```bash
npm run build
```

Drag `dist/` into Vercel, Cloudflare Pages, or wherever.

## Type

- **Display:** Fraunces (italic for the "board" wordmark)
- **Body / mono:** JetBrains Mono

## Palette

- Cream `#ECE7DE`
- Plastic `#FAF8F4`
- Ink `#1A1814`
- Accent `#E84B27`

---

KLINEKRAFT · Tulsa OK
