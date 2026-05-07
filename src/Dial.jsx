import { useRef, useCallback } from 'react'
import { useDevice } from './DeviceContext.jsx'

/* The Dial — ivory body with chrome bezel, vertical center bar, red indicator dot.
   Drag to rotate. Acts as the dark mode toggle: 0° = light, 180° = dark. */

export default function Dial({ size = 88 }) {
  const { theme, toggleTheme } = useDevice()
  const groupRef = useRef(null)
  const dragRef = useRef(null)

  // Two stable positions: light = 0°, dark = 180°
  const targetAngle = theme === 'dark' ? 180 : 0

  const handlePointerDown = useCallback((e) => {
    e.currentTarget.setPointerCapture?.(e.pointerId)
    dragRef.current = { startY: e.clientY, startAngle: targetAngle, dragged: false }
  }, [targetAngle])

  const handlePointerMove = useCallback((e) => {
    if (!dragRef.current) return
    const drag = dragRef.current
    // Vertical drag of 60px = 180° rotation
    const deltaY = drag.startY - e.clientY
    if (Math.abs(deltaY) > 4) drag.dragged = true
  }, [])

  const handlePointerUp = useCallback((e) => {
    if (!dragRef.current) return
    e.currentTarget.releasePointerCapture?.(e.pointerId)
    // Always snap to the toggled position regardless of drag distance —
    // dragging gives tactile feel but the destination is binary.
    if (dragRef.current.dragged ||
        Math.abs(e.clientY - (dragRef.current.startY ?? 0)) < 6) {
      toggleTheme()
    }
    dragRef.current = null
  }, [toggleTheme])

  return (
    <button
      type="button"
      className="dial"
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
      aria-pressed={theme === 'dark'}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={() => { dragRef.current = null }}
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 200 200"
        xmlns="http://www.w3.org/2000/svg"
        className="dial__svg"
      >
        <defs>
          {/* Chrome bezel — outer ring with metallic gradient */}
          <radialGradient id="dial-bezel" cx="50%" cy="50%" r="50%">
            <stop offset="80%" stopColor="var(--dial-bezel-inner)" />
            <stop offset="92%" stopColor="var(--dial-bezel-mid)" />
            <stop offset="100%" stopColor="var(--dial-bezel-outer)" />
          </radialGradient>

          {/* Body shading — left side darker, right side lighter, soft */}
          <linearGradient id="dial-body" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="var(--dial-body-shade)" />
            <stop offset="50%" stopColor="var(--dial-body)" />
            <stop offset="100%" stopColor="var(--dial-body-light)" />
          </linearGradient>

          {/* Center bar with subtle gradient */}
          <linearGradient id="dial-bar" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="var(--dial-bar-shade)" />
            <stop offset="50%" stopColor="var(--dial-bar)" />
            <stop offset="100%" stopColor="var(--dial-bar-light)" />
          </linearGradient>

          {/* Drop shadow under dial */}
          <filter id="dial-shadow" x="-20%" y="-20%" width="140%" height="160%">
            <feGaussianBlur in="SourceAlpha" stdDeviation="4" />
            <feOffset dx="0" dy="6" />
            <feComponentTransfer>
              <feFuncA type="linear" slope="0.35" />
            </feComponentTransfer>
            <feMerge>
              <feMergeNode />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Bezel */}
        <circle cx="100" cy="100" r="92" fill="url(#dial-bezel)" />

        {/* Inner body — rotates with theme */}
        <g
          ref={groupRef}
          style={{
            transformOrigin: '100px 100px',
            transform: `rotate(${targetAngle}deg)`,
            transition: 'transform 0.65s cubic-bezier(0.34, 1.56, 0.64, 1)',
          }}
          filter="url(#dial-shadow)"
        >
          {/* Round body */}
          <circle cx="100" cy="100" r="78" fill="url(#dial-body)" />

          {/* Vertical center handle bar */}
          <rect
            x="80" y="20"
            width="40" height="160"
            rx="4"
            fill="url(#dial-bar)"
          />

          {/* Top notch on the bar — small rounded indent */}
          <rect
            x="86" y="22"
            width="28" height="6"
            rx="3"
            fill="var(--dial-bar-shade)"
            opacity="0.5"
          />

          {/* The red indicator dot */}
          <circle cx="100" cy="50" r="6" fill="var(--dial-dot)" />
        </g>
      </svg>
    </button>
  )
}
