import { useState } from 'react'
import CSV13Amp from './CSV13Amp.jsx'
import SlideToggle from './controls/SlideToggle.jsx'
import TwinButton from './controls/TwinButton.jsx'
import RotaryKnob from './controls/RotaryKnob.jsx'
import VerticalSliders from './controls/VerticalSliders.jsx'
import PushButton from './controls/PushButton.jsx'
import MiniToggle from './controls/MiniToggle.jsx'

export default function App() {
  const [power, setPower] = useState(true)
  const [twinSelect, setTwinSelect] = useState(0)
  const [knob, setKnob] = useState(38)
  const [sliders, setSliders] = useState([55, 38, 72])
  const [pushCount, setPushCount] = useState(0)
  const [mini, setMini] = useState(false)

  return (
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
      </header>

      <section className="subhead">
        <p>
          A study in hardware interface design after Dieter Rams.
          Built around the Braun CSV 13 amplifier of 1965 — a piece
          of audio equipment whose face panel still teaches a useful
          lesson sixty years later about what a control should look
          like, feel like, behave like.
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
          <SlideToggle value={power} onChange={setPower} />
          <span className="panel__readout">
            state · <strong>{power ? 'on' : 'off'}</strong>
          </span>
        </article>

        <article className="panel" aria-label="Channel selector">
          <span className="panel__label">no. 02 · channel</span>
          <span className="panel__index">ii</span>
          <TwinButton value={twinSelect} onChange={setTwinSelect} />
          <span className="panel__readout">
            ch · <strong>{twinSelect === 0 ? 'a' : 'b'}</strong>
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
  )
}
