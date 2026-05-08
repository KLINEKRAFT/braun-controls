import { useEffect, useState, useRef, useCallback } from 'react'
import { DeviceProvider, useDevice } from './DeviceContext.jsx'
import Dial from './Dial.jsx'
import SlideToggle from './controls/SlideToggle.jsx'
import TwinButton from './controls/TwinButton.jsx'
import RotaryKnob from './controls/RotaryKnob.jsx'
import VerticalSliders from './controls/VerticalSliders.jsx'
import PushButton from './controls/PushButton.jsx'
import MiniToggle from './controls/MiniToggle.jsx'

export default function App() {
  return (
    <DeviceProvider>
      <Page />
    </DeviceProvider>
  )
}

function Page() {
  const { theme, signal } = useDevice()

  useEffect(() => {
    document.documentElement.dataset.theme = theme
  }, [theme])

  return (
    <div className="page" data-signal={signal ?? 'none'}>
      <div className="grid">
        <Tiles />
      </div>
    </div>
  )
}

function Tiles() {
  const { flash } = useDevice()

  const [slide, setSlide] = useState(true)
  const [twin, setTwin] = useState(0)
  const [knob, setKnob] = useState(38)
  const [sliders, setSliders] = useState([55, 38, 72])
  const [pushed, setPushed] = useState(false)
  const [mini, setMini] = useState(false)

  return (
    <>
      <Tile className="tile-rotary" signal="orange" onPressFlash={flash}>
        <RotaryKnob value={knob} onChange={setKnob} />
      </Tile>

      <Tile className="tile-sliders" signal="green" onPressFlash={flash}>
        <VerticalSliders values={sliders} onChange={setSliders} />
      </Tile>

      <Tile className="tile-slide" signal="orange" onPressFlash={flash}>
        <SlideToggle value={slide} onChange={setSlide} />
      </Tile>

      <Tile className="tile-twin" signal="yellow" onPressFlash={flash}>
        <TwinButton value={twin} onChange={setTwin} />
      </Tile>

      <Tile className="tile-dial" signal="blue" onPressFlash={flash}>
        <Dial size={140} />
      </Tile>

      <Tile className="tile-push" signal="red" onPressFlash={flash}>
        <PushButton onPress={() => setPushed((p) => !p)} />
      </Tile>

      <Tile className="tile-mini" signal="orange" onPressFlash={flash}>
        <MiniToggle value={mini} onChange={setMini} />
      </Tile>

      <a
        className="tile tile-logo"
        href="https://colinkline.com"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="KLINEKRAFT"
      >
        <img className="tile-logo__img" src="/klinekraft_logo.svg" alt="" aria-hidden="true" />
      </a>
    </>
  )
}

function Tile({ children, className = '', signal, onPressFlash }) {
  const ref = useRef(null)

  const handlePointerDown = useCallback(
    (e) => {
      const el = ref.current
      if (el) {
        const rect = el.getBoundingClientRect()
        el.style.setProperty('--ripple-x', `${e.clientX - rect.left}px`)
        el.style.setProperty('--ripple-y', `${e.clientY - rect.top}px`)
        el.dataset.pressed = 'true'
        // Strip the marker on the next frame so the animation can replay.
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            if (el) el.dataset.pressed = 'false'
          })
        })
      }
      if (signal && onPressFlash) onPressFlash(signal)
    },
    [signal, onPressFlash],
  )

  return (
    <section
      ref={ref}
      className={`tile ${className}`}
      onPointerDown={handlePointerDown}
    >
      <span className="tile__ripple" aria-hidden="true" />
      {children}
    </section>
  )
}
