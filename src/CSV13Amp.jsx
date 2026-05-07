import { useRef } from 'react'
import { useDevice } from './DeviceContext.jsx'

/* ─────────────────────────────────────────────
   Braun CSV 13 — flat SVG, interactive
   Every control drives global page state via context.
   The page is the device.
   ───────────────────────────────────────────── */

const W = 1290
const H = 280

export default function CSV13Amp() {
  const {
    power, togglePower,
    view, viewIndex, cycleView, views,
    volume, setVolume,
    balance, setBalance,
    bass, setBass,
    treble, setTreble,
    activeStatus, setActiveStatus,
  } = useDevice()

  return (
    <svg
      className="amp"
      viewBox={`0 0 ${W} ${H}`}
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Braun CSV 13 stereo amplifier control panel"
    >
      <defs>
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

        <radialGradient id="knob-highlight" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Chassis */}
      <g filter="url(#amp-shadow)">
        <rect
          x="20" y="20"
          width={W - 40} height={H - 40}
          rx="2"
          fill="var(--amp-face)"
          stroke="var(--amp-edge)"
          strokeWidth="0.5"
        />
        <line
          x1="22" y1="22"
          x2={W - 22} y2="22"
          stroke="var(--amp-highlight)"
          strokeWidth="1"
        />
      </g>

      {/* Mounting screws */}
      <Screw cx={50}     cy={50} />
      <Screw cx={W - 50} cy={50} />
      <Screw cx={50}     cy={H - 50} />
      <Screw cx={W - 50} cy={H - 50} />

      {/* Power button — toggles whole page on/off */}
      <PowerCluster
        cx={140} cy={H / 2}
        on={power}
        onToggle={togglePower}
      />

      {/* Source selector — cycles through page views */}
      <SourceSelector
        cx={310} cy={H / 2}
        index={viewIndex}
        positions={views.map(v => v.label)}
        onClick={cycleView}
      />

      {/* Four knobs, each driving a different page property */}
      <RotaryKnob
        cx={510} cy={H / 2}
        value={volume}
        onChange={setVolume}
        label="lautstärke"
      />
      <RotaryKnob
        cx={685} cy={H / 2}
        value={balance}
        onChange={setBalance}
        label="balance"
        bipolar
      />
      <RotaryKnob
        cx={860} cy={H / 2}
        value={bass}
        onChange={setBass}
        label="tiefen"
      />
      <RotaryKnob
        cx={1035} cy={H / 2}
        value={treble}
        onChange={setTreble}
        label="höhen"
      />

      {/* Status pills */}
      <StatusCluster
        cx={W - 110} cy={H / 2}
        active={activeStatus}
        onSelect={setActiveStatus}
      />

      {/* KLINEKRAFT wordmark — replaces BRAUN, matched to grey label color */}
      <text
        x={120} y={H - 50}
        fill="var(--amp-wordmark)"
        fontFamily="'Inter Tight', 'Helvetica Neue', sans-serif"
        fontWeight="600"
        fontSize="22"
        letterSpacing="3"
      >
        KLINEKRAFT
      </text>
    </svg>
  )
}

/* ─── Mounting screw ─── */

function Screw({ cx, cy }) {
  return (
    <g>
      <circle cx={cx} cy={cy} r="6" fill="var(--screw-recess)" />
      <circle cx={cx} cy={cy} r="4" fill="var(--screw-body)" />
      <line
        x1={cx - 3} y1={cy - 3}
        x2={cx + 3} y2={cy + 3}
        stroke="var(--screw-slot)"
        strokeWidth="1"
        strokeLinecap="round"
      />
    </g>
  )
}

/* ─── Power cluster — toggles entire page on/off ─── */

function PowerCluster({ cx, cy, on, onToggle }) {
  return (
    <g>
      <circle
        cx={cx} cy={cy - 30}
        r="5"
        fill={on ? 'var(--power-on)' : 'var(--power-off)'}
        style={{
          filter: on ? 'drop-shadow(0 0 4px var(--orange-glow))' : 'none',
          transition: 'fill 0.3s, filter 0.3s',
        }}
      />
      <g onClick={onToggle} style={{ cursor: 'pointer' }}>
        <ellipse
          cx={cx} cy={cy + 12}
          rx="14" ry="5"
          fill="var(--button-tan)"
          stroke="var(--button-tan-edge)"
          strokeWidth="0.5"
        />
        <ellipse
          cx={cx} cy={cy + 10.5}
          rx="11" ry="2"
          fill="rgba(255,255,255,0.4)"
        />
      </g>
      <text
        x={cx} y={cy + 38}
        textAnchor="middle"
        fill="var(--ink)"
        fontFamily="'Inter Tight', sans-serif"
        fontSize="9"
        letterSpacing="1.5"
      >
        ein / aus
      </text>
    </g>
  )
}

/* ─── Source selector — cycles through page views ─── */

function SourceSelector({ cx, cy, index, positions, onClick }) {
  const totalRange = 150
  const startAngle = -totalRange / 2
  const angle = startAngle + (index / (positions.length - 1)) * totalRange

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
      {positions.map((label, i) => {
        const labelAngle = startAngle + (i / (positions.length - 1)) * totalRange
        const rad = (labelAngle * Math.PI) / 180
        const labelR = 92
        const lx = cx + Math.sin(rad) * labelR
        const ly = cy - Math.cos(rad) * labelR
        const isActive = i === index
        const textAnchor = labelAngle < -10 ? 'end' : labelAngle > 10 ? 'start' : 'middle'
        return (
          <text
            key={i}
            x={lx} y={ly}
            textAnchor={textAnchor}
            dominantBaseline="middle"
            fill={isActive ? 'var(--ink)' : 'var(--ink-faint)'}
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

      <g
        transform={`translate(${cx}, ${cy}) rotate(${angle})`}
        onClick={onClick}
        style={{ cursor: 'pointer', transition: 'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)' }}
        filter="url(#knob-shadow)"
      >
        <path d={teardropPath} fill="var(--knob-black)" />
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

/* ─── Big rotary knob ─── */

function RotaryKnob({ cx, cy, value, onChange, label, bipolar = false }) {
  // Bipolar (balance) maps 0..1 to -135..+135, where 0.5 = 0°.
  // Regular knobs map 0..1 to -135..+135 too, but their visual cue is fill-from-bottom.
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

  const ticks = Array.from({ length: 13 }, (_, i) => ({
    angle: minAngle + (i / 12) * range,
    isMajor: i === 0 || i === 6 || i === 12,
  }))

  const r = 50
  const knobR = 32

  return (
    <g>
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
            stroke="var(--ink)"
            strokeWidth={t.isMajor ? 1.5 : 1}
            opacity={t.isMajor ? 0.7 : 0.5}
          />
        )
      })}

      <text x={cx}        y={cy - r - 10} textAnchor="middle" fill="var(--ink)" fontFamily="'Inter Tight', sans-serif" fontSize="10">12</text>
      <text x={cx + r + 8} y={cy + 3}      textAnchor="start"  fill="var(--ink)" fontFamily="'Inter Tight', sans-serif" fontSize="10">4</text>
      <text x={cx - r - 8} y={cy + 3}      textAnchor="end"    fill="var(--ink)" fontFamily="'Inter Tight', sans-serif" fontSize="10">24</text>

      <g
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        style={{ cursor: 'grab', touchAction: 'none' }}
        filter="url(#knob-shadow)"
      >
        <circle cx={cx} cy={cy} r={knobR} fill="var(--knob-black)" />
        <circle cx={cx - 6} cy={cy - 8} r={knobR - 4} fill="url(#knob-highlight)" opacity="0.18" pointerEvents="none" />
        <line
          x1={cx + Math.sin((angle * Math.PI) / 180) * 12}
          y1={cy - Math.cos((angle * Math.PI) / 180) * 12}
          x2={cx + Math.sin((angle * Math.PI) / 180) * (knobR - 4)}
          y2={cy - Math.cos((angle * Math.PI) / 180) * (knobR - 4)}
          stroke="var(--knob-indicator)"
          strokeWidth="2"
          strokeLinecap="round"
          style={{ transition: 'all 0.05s linear' }}
        />
      </g>

      <text
        x={cx} y={cy + r + 30}
        textAnchor="middle"
        fill="var(--ink)"
        fontFamily="'Inter Tight', sans-serif"
        fontSize="11"
        letterSpacing="0.5"
      >
        {label}
      </text>
    </g>
  )
}

/* ─── Status pills ─── */

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
            <circle
              cx={cx - 22}
              cy={y}
              r="4"
              fill={isActive ? 'var(--power-on)' : 'var(--power-off)'}
              style={{
                filter: isActive ? 'drop-shadow(0 0 3px var(--orange-glow))' : 'none',
                transition: 'fill 0.25s, filter 0.25s',
              }}
            />
            <g
              onClick={() => onSelect(i)}
              style={{ cursor: 'pointer' }}
            >
              <ellipse
                cx={cx + 4}
                cy={y}
                rx="11" ry="4"
                fill="var(--button-tan)"
                stroke="var(--button-tan-edge)"
                strokeWidth="0.5"
              />
              <ellipse
                cx={cx + 4}
                cy={y - 1}
                rx="8" ry="1.5"
                fill="rgba(255,255,255,0.4)"
              />
            </g>
            <text
              x={cx + 22} y={y + 3}
              fill="var(--ink)"
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
