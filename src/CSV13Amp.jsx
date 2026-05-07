import { useState, useRef, useCallback } from 'react'

/* ─────────────────────────────────────────────
   Braun CSV 13 — flat SVG recreation
   After the Figma reference. Less drama, more truth.
   ───────────────────────────────────────────── */

const SOURCE_POSITIONS = [
  'radio',
  'phono 1',
  'phono 2',
  'phono 3',
  'phono 4',
  'tonel',
  'stereo  T 1080',
]

// SVG units. Aspect ratio matches the Figma frame closely.
const W = 1290
const H = 280

export default function CSV13Amp() {
  const [sourceIndex, setSourceIndex] = useState(0)
  const [knobs, setKnobs] = useState([0.55, 0.50, 0.55, 0.45]) // 0..1
  const [powerOn, setPowerOn] = useState(true)
  const [activeStatus, setActiveStatus] = useState(0) // 0=rein, 1=pr, 2=rf

  const setKnob = (i, val) => {
    setKnobs(prev => {
      const next = prev.slice()
      next[i] = Math.max(0, Math.min(1, val))
      return next
    })
  }

  const cycleSource = () => setSourceIndex(i => (i + 1) % SOURCE_POSITIONS.length)

  return (
    <svg
      className="amp"
      viewBox={`0 0 ${W} ${H}`}
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Braun CSV 13 stereo amplifier control panel"
    >
      <defs>
        {/* Soft drop shadow under the chassis */}
        <filter id="amp-shadow" x="-5%" y="-20%" width="110%" height="160%">
          <feGaussianBlur in="SourceAlpha" stdDeviation="6" />
          <feOffset dx="0" dy="6" />
          <feComponentTransfer>
            <feFuncA type="linear" slope="0.18" />
          </feComponentTransfer>
          <feMerge>
            <feMergeNode />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        {/* Knob shadow — knobs cast shadow onto the panel */}
        <filter id="knob-shadow" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur in="SourceAlpha" stdDeviation="2.5" />
          <feOffset dx="2" dy="3" />
          <feComponentTransfer>
            <feFuncA type="linear" slope="0.30" />
          </feComponentTransfer>
          <feMerge>
            <feMergeNode />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Chassis — subtle warm gray with soft shadow */}
      <g filter="url(#amp-shadow)">
        <rect
          x="20" y="20"
          width={W - 40} height={H - 40}
          rx="2"
          fill="#E8E5DE"
          stroke="#C9C4BA"
          strokeWidth="0.5"
        />
        {/* Inner highlight along the top edge */}
        <line
          x1="22" y1="22"
          x2={W - 22} y2="22"
          stroke="rgba(255,255,255,0.7)"
          strokeWidth="1"
        />
      </g>

      {/* Mounting screws at the four corners */}
      <Screw cx={50}      cy={50} />
      <Screw cx={W - 50}  cy={50} />
      <Screw cx={50}      cy={H - 50} />
      <Screw cx={W - 50}  cy={H - 50} />

      {/* Power dot indicator + ein/aus marks (top left area) */}
      <PowerCluster
        cx={140} cy={H / 2}
        on={powerOn}
        onToggle={() => setPowerOn(p => !p)}
      />

      {/* Source selector — the iconic teardrop */}
      <SourceSelector
        cx={310} cy={H / 2}
        index={sourceIndex}
        onClick={cycleSource}
      />

      {/* Four big rotary knobs */}
      {['lautstärke', 'balance', 'tiefen', 'höhen'].map((label, i) => (
        <RotaryKnob
          key={label}
          cx={510 + i * 175}
          cy={H / 2}
          value={knobs[i]}
          onChange={(v) => setKnob(i, v)}
          label={label}
        />
      ))}

      {/* Three status indicators on the right */}
      <StatusCluster
        cx={W - 110} cy={H / 2}
        active={activeStatus}
        onSelect={setActiveStatus}
      />

      {/* BRAUN wordmark, lower-left of the panel */}
      <text
        x={120} y={H - 50}
        fill="#0A0A0A"
        fontFamily="'Inter Tight', 'Helvetica Neue', sans-serif"
        fontWeight="600"
        fontSize="22"
        letterSpacing="3"
      >
        BRAUN
      </text>
    </svg>
  )
}

/* ─── Mounting screw ─── */

function Screw({ cx, cy }) {
  return (
    <g>
      <circle cx={cx} cy={cy} r="6" fill="#D4CFC4" />
      <circle cx={cx} cy={cy} r="4" fill="#A8A39A" />
      {/* Slot at 45° */}
      <line
        x1={cx - 3} y1={cy - 3}
        x2={cx + 3} y2={cy + 3}
        stroke="#3A3A37"
        strokeWidth="1"
        strokeLinecap="round"
      />
    </g>
  )
}

/* ─── Power button + indicator ─── */

function PowerCluster({ cx, cy, on, onToggle }) {
  return (
    <g>
      {/* Orange power dot, above the button — pulses when on */}
      <circle
        cx={cx} cy={cy - 30}
        r="5"
        fill={on ? '#FF6B1F' : '#3A3A37'}
        style={{
          filter: on ? 'drop-shadow(0 0 4px rgba(255,107,31,0.6))' : 'none',
          transition: 'fill 0.3s, filter 0.3s',
        }}
      />
      {/* Tan/peach push button */}
      <g
        onClick={onToggle}
        style={{ cursor: 'pointer' }}
      >
        <ellipse
          cx={cx} cy={cy + 12}
          rx="14" ry="5"
          fill="#E8C8A8"
          stroke="#C9A782"
          strokeWidth="0.5"
        />
        {/* Highlight along the top */}
        <ellipse
          cx={cx} cy={cy + 10.5}
          rx="11" ry="2"
          fill="rgba(255,255,255,0.4)"
        />
      </g>
      {/* "ein/aus" label below */}
      <text
        x={cx} y={cy + 38}
        textAnchor="middle"
        fill="#0A0A0A"
        fontFamily="'Inter Tight', sans-serif"
        fontSize="9"
        letterSpacing="1.5"
      >
        ein / aus
      </text>
    </g>
  )
}

/* ─── Source selector — teardrop knob ─── */

function SourceSelector({ cx, cy, index, onClick }) {
  // The teardrop pivots around its base.
  // Total fan range — wider than before so labels don't overlap.
  const totalRange = 150
  const startAngle = -totalRange / 2
  const angle = startAngle + (index / (SOURCE_POSITIONS.length - 1)) * totalRange

  // Teardrop path — pointed tip at 0,-58, fat base at 0,18 (bigger than before)
  const teardropPath = `
    M 0 -58
    Q -10 -28, -19 0
    Q -23 14, -12 17
    Q 0 19, 12 17
    Q 23 14, 19 0
    Q 10 -28, 0 -58
    Z
  `

  return (
    <g>
      {/* Position labels — fanned around at a wider radius */}
      {SOURCE_POSITIONS.map((label, i) => {
        const labelAngle = startAngle + (i / (SOURCE_POSITIONS.length - 1)) * totalRange
        const rad = (labelAngle * Math.PI) / 180
        const labelR = 92
        const lx = cx + Math.sin(rad) * labelR
        const ly = cy - Math.cos(rad) * labelR
        const isActive = i === index
        // Anchor labels based on which side of vertical they're on
        const textAnchor = labelAngle < -10 ? 'end' : labelAngle > 10 ? 'start' : 'middle'
        return (
          <text
            key={i}
            x={lx} y={ly}
            textAnchor={textAnchor}
            dominantBaseline="middle"
            fill={isActive ? '#0A0A0A' : '#9A9388'}
            fontFamily="'Inter Tight', sans-serif"
            fontWeight={isActive ? 500 : 400}
            fontSize="9"
            letterSpacing="0.5"
            style={{ transition: 'fill 0.25s, font-weight 0.25s' }}
          >
            {label}
          </text>
        )
      })}

      {/* Teardrop knob, rotates around its base point */}
      <g
        transform={`translate(${cx}, ${cy}) rotate(${angle})`}
        onClick={onClick}
        style={{ cursor: 'pointer', transition: 'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)' }}
        filter="url(#knob-shadow)"
      >
        <path d={teardropPath} fill="#0A0A0A" />
        {/* Subtle highlight strip along the left edge */}
        <path
          d="M -8 -45 Q -14 -18, -19 0"
          fill="none"
          stroke="rgba(255,255,255,0.15)"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </g>
    </g>
  )
}

/* ─── Big rotary knob — black cylinder seen from above ─── */

function RotaryKnob({ cx, cy, value, onChange, label }) {
  // Sweep ±135° → 270° total
  const minAngle = -135
  const maxAngle =  135
  const range = maxAngle - minAngle
  const angle = minAngle + value * range

  const dragRef = useRef(null)

  const handlePointerDown = (e) => {
    e.stopPropagation()
    e.target.setPointerCapture?.(e.pointerId)
    dragRef.current = { startY: e.clientY, startVal: value }
  }
  const handlePointerMove = (e) => {
    if (!dragRef.current) return
    e.stopPropagation()
    const deltaY = dragRef.current.startY - e.clientY
    onChange(dragRef.current.startVal + deltaY / 200)
  }
  const handlePointerUp = (e) => {
    if (dragRef.current) {
      e.target.releasePointerCapture?.(e.pointerId)
      dragRef.current = null
    }
  }

  // Tick marks: 13 around the dial, major at min/center/max
  const ticks = Array.from({ length: 13 }, (_, i) => ({
    angle: minAngle + (i / 12) * range,
    isMajor: i === 0 || i === 6 || i === 12,
  }))

  const r = 50           // outer ring radius
  const knobR = 32       // black knob body radius

  return (
    <g>
      {/* Tick marks around the dial */}
      {ticks.map((t, i) => {
        const rad = (t.angle * Math.PI) / 180
        const inner = r - (t.isMajor ? 8 : 4)
        const outer = r
        return (
          <line
            key={i}
            x1={cx + Math.sin(rad) * inner}
            y1={cy - Math.cos(rad) * inner}
            x2={cx + Math.sin(rad) * outer}
            y2={cy - Math.cos(rad) * outer}
            stroke="#0A0A0A"
            strokeWidth={t.isMajor ? 1.5 : 1}
            opacity={t.isMajor ? 0.7 : 0.5}
          />
        )
      })}

      {/* Numeric labels at top, right, left */}
      <text x={cx}        y={cy - r - 10} textAnchor="middle" fill="#0A0A0A" fontFamily="'Inter Tight', sans-serif" fontSize="10">12</text>
      <text x={cx + r + 8} y={cy + 3}      textAnchor="start"  fill="#0A0A0A" fontFamily="'Inter Tight', sans-serif" fontSize="10">4</text>
      <text x={cx - r - 8} y={cy + 3}      textAnchor="end"    fill="#0A0A0A" fontFamily="'Inter Tight', sans-serif" fontSize="10">24</text>

      {/* Knob body — black circle with a white indicator line */}
      <g
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        style={{ cursor: 'grab', touchAction: 'none' }}
        filter="url(#knob-shadow)"
      >
        <circle cx={cx} cy={cy} r={knobR} fill="#0A0A0A" />
        {/* Subtle radial highlight to give a hint of dimensionality */}
        <circle cx={cx - 6} cy={cy - 8} r={knobR - 4} fill="url(#knob-highlight)" opacity="0.25" pointerEvents="none" />
        {/* Indicator line — rotates with value */}
        <line
          x1={cx + Math.sin((angle * Math.PI) / 180) * 12}
          y1={cy - Math.cos((angle * Math.PI) / 180) * 12}
          x2={cx + Math.sin((angle * Math.PI) / 180) * (knobR - 4)}
          y2={cy - Math.cos((angle * Math.PI) / 180) * (knobR - 4)}
          stroke="#FFFFFF"
          strokeWidth="2"
          strokeLinecap="round"
          style={{ transition: 'all 0.05s linear' }}
        />
      </g>

      {/* Label below the knob */}
      <text
        x={cx} y={cy + r + 30}
        textAnchor="middle"
        fill="#0A0A0A"
        fontFamily="'Inter Tight', sans-serif"
        fontSize="11"
        letterSpacing="0.5"
      >
        {label}
      </text>

      {/* Define the highlight gradient once (idempotent — multiple defs are fine) */}
      <defs>
        <radialGradient id="knob-highlight" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
        </radialGradient>
      </defs>
    </g>
  )
}

/* ─── Three small status pills on the right ─── */

function StatusCluster({ cx, cy, active, onSelect }) {
  const items = [
    { label: 'rein' },
    { label: 'pr' },
    { label: 'rf' },
  ]
  const spacing = 38

  return (
    <g>
      {items.map((item, i) => {
        const y = cy - spacing + i * spacing
        const isActive = i === active
        return (
          <g key={i}>
            {/* Indicator dot */}
            <circle
              cx={cx - 22}
              cy={y}
              r="4"
              fill={isActive ? '#FF6B1F' : '#3A3A37'}
              style={{
                filter: isActive ? 'drop-shadow(0 0 3px rgba(255,107,31,0.6))' : 'none',
                transition: 'fill 0.25s, filter 0.25s',
              }}
            />
            {/* Tan push button */}
            <g
              onClick={() => onSelect(i)}
              style={{ cursor: 'pointer' }}
            >
              <ellipse
                cx={cx + 4}
                cy={y}
                rx="11" ry="4"
                fill="#E8C8A8"
                stroke="#C9A782"
                strokeWidth="0.5"
              />
              <ellipse
                cx={cx + 4}
                cy={y - 1}
                rx="8" ry="1.5"
                fill="rgba(255,255,255,0.4)"
              />
            </g>
            {/* Label */}
            <text
              x={cx + 22} y={y + 3}
              fill="#0A0A0A"
              fontFamily="'Inter Tight', sans-serif"
              fontSize="10"
              letterSpacing="0.5"
            >
              {item.label}
            </text>
          </g>
        )
      })}
    </g>
  )
}
