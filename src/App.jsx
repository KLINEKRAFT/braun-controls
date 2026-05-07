import { useState, useEffect } from 'react'
import { DeviceProvider, useDevice } from './DeviceContext.jsx'
import CSV13Amp from './CSV13Amp.jsx'
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
  const {
    theme, power,
    view,
    volume, balance, bass, treble,
    activeStatus,
  } = useDevice()

  // Apply theme to <html> for global reach (selection color, scrollbar, etc.)
  useEffect(() => {
    document.documentElement.dataset.theme = theme
  }, [theme])

  /* Compute CSS variables from knob state.
     - bass (0..1) → shadow depth multiplier (0.2..2.5)
     - treble (0..1) → border alpha (0..0.30)
     - volume (0..1) → density padding multiplier (0.5..1.4)
     - balance (0..1) → horizontal layout shift (-3..+3 percent) */
  const cssVars = {
    '--shadow-depth': (0.2 + bass * 2.3).toFixed(2),
    '--stroke-alpha': (treble * 0.30).toFixed(3),
    '--density-padding': (0.5 + volume * 0.9).toFixed(2),
    '--balance-shift': ((balance - 0.5) * 6).toFixed(1),
  }

  return (
    <div className="page" data-power={power ? 'on' : 'off'} style={cssVars}>
      <main className="shell">
        <header className="masthead">
          <h1 className="masthead__title">
            braun <em>controls</em>
          </h1>
          <div className="masthead__meta">
            <strong>klinekraft / 2026</strong>
            <span>after dieter rams · 1965</span>
            <span>tulsa, ok</span>
          </div>
          <Dial size={88} />
        </header>

        <section className="subhead">
          <p>
            A study in hardware interface design after Dieter Rams.
            The amp at the top is not a decoration — every control on it
            does something to this page. Drag a knob, twist the dial,
            press the button. The page is the device.
          </p>
          <blockquote className="subhead__quote">
            “Indifference towards the people who use the product is one
            of the cardinal sins of design.”
          </blockquote>
        </section>

        {/* Hero — flat SVG amp */}
        <section className="hero">
          <CSV13Amp />
          <div className="hero__caption">
            <span><strong>csv 13</strong> — stereo amplifier, 1965</span>
            <span>dieter rams · braun ag</span>
          </div>
        </section>

        {/* Now-playing strip — shows the current view + live readouts */}
        <NowPlaying view={view} volume={volume} balance={balance} bass={bass} treble={treble} />

        <ControlStudy />

        <footer className="foot">
          <span>tulsa ok · 36.15°n 95.99°w</span>
          <a
            className="foot__center"
            href="https://colinkline.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="KLINEKRAFT"
          >
            <img
              className="foot__logo"
              src="/klinekraft_logo.svg"
              alt="KLINEKRAFT Design Co"
            />
          </a>
          <span className="foot__right">less, but better.</span>
        </footer>
      </main>
    </div>
  )
}

function NowPlaying({ view, volume, balance, bass, treble }) {
  return (
    <div className="now-playing">
      <span className="now-playing__indicator" aria-hidden="true" />
      <div className="now-playing__label">
        <span className="now-playing__title">{view.label}</span>
        <span className="now-playing__desc">{view.description}</span>
      </div>
      <div className="now-playing__metric">
        vol&nbsp;<strong>{Math.round(volume * 100).toString().padStart(2, '0')}</strong>
        <span style={{ margin: '0 6px', opacity: 0.4 }}>·</span>
        bal&nbsp;<strong>{balance < 0.5 ? 'L' : balance > 0.5 ? 'R' : 'C'}{Math.round(Math.abs(balance - 0.5) * 100).toString().padStart(2, '0')}</strong>
        <span style={{ margin: '0 6px', opacity: 0.4 }}>·</span>
        bass&nbsp;<strong>{Math.round(bass * 100).toString().padStart(2, '0')}</strong>
        <span style={{ margin: '0 6px', opacity: 0.4 }}>·</span>
        treb&nbsp;<strong>{Math.round(treble * 100).toString().padStart(2, '0')}</strong>
      </div>
    </div>
  )
}

function ControlStudy() {
  const [slide, setSlide] = useState(true)
  const [twin, setTwin] = useState(0)
  const [knob, setKnob] = useState(38)
  const [sliders, setSliders] = useState([55, 38, 72])
  const [pushCount, setPushCount] = useState(0)
  const [mini, setMini] = useState(false)

  return (
    <>
      <div className="section-label">
        <span className="section-label__index">02</span>
        <span className="section-label__title">control study</span>
        <span style={{ marginLeft: 'auto', color: 'var(--ink-faint)' }}>
          six interactive elements · click, drag, slide
        </span>
      </div>

      <div className="grid">
        <article className="panel" aria-label="Power slide toggle">
          <span className="panel__label">no. 01 · power</span>
          <span className="panel__index">i</span>
          <SlideToggle value={slide} onChange={setSlide} />
          <span className="panel__readout">
            state · <strong>{slide ? 'on' : 'off'}</strong>
          </span>
        </article>

        <article className="panel" aria-label="Channel selector">
          <span className="panel__label">no. 02 · channel</span>
          <span className="panel__index">ii</span>
          <TwinButton value={twin} onChange={setTwin} />
          <span className="panel__readout">
            ch · <strong>{twin === 0 ? 'a' : 'b'}</strong>
          </span>
        </article>

        <article className="panel" aria-label="Rotary knob">
          <span className="panel__label">no. 03 · gain</span>
          <span className="panel__index">iii</span>
          <RotaryKnob value={knob} onChange={setKnob} />
          <span className="panel__readout">
            db · <strong>{knob.toString().padStart(2, '0')}</strong>
          </span>
        </article>

        <article className="panel" aria-label="Vertical slider bank">
          <span className="panel__label">no. 04 · mix</span>
          <span className="panel__index">iv</span>
          <VerticalSliders values={sliders} onChange={setSliders} />
          <span className="panel__readout">
            l <strong>{sliders[0]}</strong> · m <strong>{sliders[1]}</strong> · h <strong>{sliders[2]}</strong>
          </span>
        </article>

        <article className="panel" aria-label="Push button">
          <span className="panel__label">no. 05 · trigger</span>
          <span className="panel__index">v</span>
          <PushButton onPress={() => setPushCount(c => c + 1)} />
          <span className="panel__readout">
            count · <strong>{pushCount.toString().padStart(3, '0')}</strong>
          </span>
        </article>

        <article className="panel" aria-label="Standby toggle">
          <span className="panel__label">no. 06 · standby</span>
          <span className="panel__index">vi</span>
          <MiniToggle value={mini} onChange={setMini} />
          <span className="panel__readout">
            mode · <strong>{mini ? 'active' : 'idle'}</strong>
          </span>
        </article>
      </div>
    </>
  )
}
