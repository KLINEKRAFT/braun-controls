import { useRef, useCallback } from 'react'

export default function VerticalSliders({ values, onChange }) {
  return (
    <div className="ctrl" style={{ width: '100%', height: '100%', display: 'grid', placeItems: 'center' }}>
      <div className="sliders">
        {values.map((v, i) => (
          <Slider
            key={i}
            value={v}
            onChange={(next) => {
              const copy = values.slice()
              copy[i] = next
              onChange(copy)
            }}
            label={['Low', 'Mid', 'High'][i]}
          />
        ))}
      </div>
    </div>
  )
}

function Slider({ value, onChange, label }) {
  const trackRef = useRef(null)
  const draggingRef = useRef(false)

  const updateFromPointer = useCallback((clientY) => {
    const track = trackRef.current
    if (!track) return
    const rect = track.getBoundingClientRect()
    // Top of the track = 100, bottom = 0.
    const relative = (rect.bottom - clientY) / rect.height
    const clamped = Math.max(0, Math.min(1, relative))
    onChange(Math.round(clamped * 100))
  }, [onChange])

  const handlePointerDown = (e) => {
    e.currentTarget.setPointerCapture?.(e.pointerId)
    draggingRef.current = true
    updateFromPointer(e.clientY)
  }

  const handlePointerMove = (e) => {
    if (!draggingRef.current) return
    updateFromPointer(e.clientY)
  }

  const handlePointerUp = (e) => {
    draggingRef.current = false
    e.currentTarget.releasePointerCapture?.(e.pointerId)
  }

  const handleKeyDown = (e) => {
    let delta = 0
    if (e.key === 'ArrowUp') delta = 1
    if (e.key === 'ArrowDown') delta = -1
    if (e.key === 'PageUp') delta = 10
    if (e.key === 'PageDown') delta = -10
    if (e.key === 'Home') return onChange(100)
    if (e.key === 'End') return onChange(0)
    if (delta !== 0) {
      e.preventDefault()
      onChange(Math.max(0, Math.min(100, value + delta)))
    }
  }

  // Handle position: 0 = bottom, 100 = top.
  const top = `${100 - value}%`

  return (
    <div className="slider">
      <span className="slider__top-pip" aria-hidden="true" />
      <div
        className="slider__track"
        ref={trackRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
      >
        <div
          className="slider__handle"
          role="slider"
          tabIndex={0}
          aria-label={label}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={value}
          aria-orientation="vertical"
          style={{ top }}
          onKeyDown={handleKeyDown}
        />
      </div>
    </div>
  )
}
