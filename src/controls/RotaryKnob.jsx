import { useRef, useEffect, useCallback } from 'react'

// Knob sweeps from -135° (min) to +135° (max), 270° total range.
const MIN_ANGLE = -135
const MAX_ANGLE = 135
const RANGE = MAX_ANGLE - MIN_ANGLE

export default function RotaryKnob({ value, onChange }) {
  const wrapRef = useRef(null)
  const draggingRef = useRef(false)
  // Track the "virtual" angle the user has rotated to so we can clamp without
  // snapping when their pointer crosses the discontinuity at the bottom.
  const lastAngleRef = useRef(valueToAngle(value))

  // Keep the virtual angle in sync if `value` changes externally.
  useEffect(() => {
    if (!draggingRef.current) lastAngleRef.current = valueToAngle(value)
  }, [value])

  const updateFromPointer = useCallback((clientX, clientY) => {
    const el = wrapRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const cx = rect.left + rect.width / 2
    const cy = rect.top + rect.height / 2
    // 0° points up; clockwise positive.
    const dx = clientX - cx
    const dy = clientY - cy
    let raw = Math.atan2(dx, -dy) * (180 / Math.PI) // -180..180

    // Walk from the previous angle along the shortest path so the knob
    // moves smoothly even though the underlying value is clamped.
    const prev = lastAngleRef.current
    let delta = raw - normalize(prev)
    if (delta > 180) delta -= 360
    if (delta < -180) delta += 360
    let next = prev + delta
    if (next < MIN_ANGLE) next = MIN_ANGLE
    if (next > MAX_ANGLE) next = MAX_ANGLE
    lastAngleRef.current = next

    onChange(angleToValue(next))
  }, [onChange])

  const handlePointerDown = (e) => {
    e.currentTarget.setPointerCapture?.(e.pointerId)
    draggingRef.current = true
    updateFromPointer(e.clientX, e.clientY)
  }

  const handlePointerMove = (e) => {
    if (!draggingRef.current) return
    updateFromPointer(e.clientX, e.clientY)
  }

  const handlePointerUp = (e) => {
    draggingRef.current = false
    e.currentTarget.releasePointerCapture?.(e.pointerId)
  }

  const handleKeyDown = (e) => {
    let delta = 0
    if (e.key === 'ArrowRight' || e.key === 'ArrowUp') delta = 1
    if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') delta = -1
    if (e.key === 'PageUp') delta = 5
    if (e.key === 'PageDown') delta = -5
    if (e.key === 'Home') return onChange(0)
    if (e.key === 'End') return onChange(100)
    if (delta !== 0) {
      e.preventDefault()
      onChange(Math.max(0, Math.min(100, value + delta)))
    }
  }

  // Generate tick mark positions: 13 ticks evenly spaced across the active range,
  // with major ticks at min and max.
  const ticks = Array.from({ length: 13 }, (_, i) => {
    const angle = MIN_ANGLE + (i / 12) * RANGE
    const isMajor = i === 0 || i === 12
    return { angle, isMajor }
  })

  const knobAngle = valueToAngle(value)

  return (
    <div className="ctrl" style={{ width: '100%', display: 'grid', placeItems: 'center' }}>
      <div className="rotary" ref={wrapRef}>
        <div className="rotary__ring" />
        <div className="rotary__ticks">
          {ticks.map((t, i) => (
            <div
              key={i}
              className={`rotary__tick ${t.isMajor ? 'rotary__tick--major' : ''}`}
              style={{ transform: `rotate(${t.angle}deg)` }}
            />
          ))}
        </div>
        <div
          className="rotary__knob"
          role="slider"
          tabIndex={0}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={value}
          aria-label="Gain"
          style={{ transform: `rotate(${knobAngle}deg)` }}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          onKeyDown={handleKeyDown}
        >
          <div className="rotary__indicator" />
        </div>
      </div>
    </div>
  )
}

function valueToAngle(v) {
  return MIN_ANGLE + (v / 100) * RANGE
}

function angleToValue(a) {
  return Math.round(((a - MIN_ANGLE) / RANGE) * 100)
}

function normalize(a) {
  let x = a
  while (x > 180) x -= 360
  while (x < -180) x += 360
  return x
}
