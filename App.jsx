import { useState } from 'react'
import SlideToggle from './controls/SlideToggle.jsx'
import TwinButton from './controls/TwinButton.jsx'
import RotaryKnob from './controls/RotaryKnob.jsx'
import VerticalSliders from './controls/VerticalSliders.jsx'
import PushButton from './controls/PushButton.jsx'
import MiniToggle from './controls/MiniToggle.jsx'

export default function App() {
  const [power, setPower] = useState(true)
  const [twinSelect, setTwinSelect] = useState(0)        // 0 | 1
  const [knob, setKnob] = useState(38)                   // 0..100
  const [sliders, setSliders] = useState([55, 38, 72])   // each 0..100
  const [pushCount, setPushCount] = useState(0)
  const [mini, setMini] = useState(false)

  return (
    <main className="shell">
      <header className="masthead">
        <h1 className="masthead__title">
          Switch<em>board</em>
        </h1>
        <div className="masthead__meta">
          <strong>SWB ‹ 001</strong>
          <span>WORKING CONTROLS · STUDY №1</span>
          <span>KLINEKRAFT / TULSA</span>
        </div>
      </header>

      <section className="subhead">
        <p>
          Six controls in the spirit of Dieter Rams — the principle being that
          good design is as little design as possible, and that every surface,
          shadow, and click should justify itself. Each switch below is fully
          interactive. Touch, drag, click.
        </p>
        <blockquote className="subhead__quote">
          “Indifference towards the people who use the product is one of the
          cardinal sins of design.”
        </blockquote>
      </section>

      <div className="grid">
        <article className="panel" aria-label="Power slide toggle">
          <span className="panel__label">№ 01 · Power</span>
          <span className="panel__index">i</span>
          <SlideToggle value={power} onChange={setPower} />
          <span className="panel__readout">
            STATE · <strong>{power ? 'ON' : 'OFF'}</strong>
          </span>
        </article>

        <article className="panel" aria-label="Channel selector">
          <span className="panel__label">№ 02 · Channel</span>
          <span className="panel__index">ii</span>
          <TwinButton value={twinSelect} onChange={setTwinSelect} />
          <span className="panel__readout">
            CH · <strong>{twinSelect === 0 ? 'A' : 'B'}</strong>
          </span>
        </article>

        <article className="panel" aria-label="Rotary knob">
          <span className="panel__label">№ 03 · Gain</span>
          <span className="panel__index">iii</span>
          <RotaryKnob value={knob} onChange={setKnob} />
          <span className="panel__readout">
            DB · <strong>{knob.toString().padStart(2, '0')}</strong>
          </span>
        </article>

        <article className="panel" aria-label="Vertical slider bank">
          <span className="panel__label">№ 04 · Mix</span>
          <span className="panel__index">iv</span>
          <VerticalSliders values={sliders} onChange={setSliders} />
          <span className="panel__readout">
            L <strong>{sliders[0]}</strong> · M <strong>{sliders[1]}</strong> · H <strong>{sliders[2]}</strong>
          </span>
        </article>

        <article className="panel" aria-label="Push button">
          <span className="panel__label">№ 05 · Trigger</span>
          <span className="panel__index">v</span>
          <PushButton onPress={() => setPushCount(c => c + 1)} />
          <span className="panel__readout">
            COUNT · <strong>{pushCount.toString().padStart(3, '0')}</strong>
          </span>
        </article>

        <article className="panel" aria-label="Standby toggle">
          <span className="panel__label">№ 06 · Standby</span>
          <span className="panel__index">vi</span>
          <MiniToggle value={mini} onChange={setMini} />
          <span className="panel__readout">
            MODE · <strong>{mini ? 'ACTIVE' : 'IDLE'}</strong>
          </span>
        </article>
      </div>

      <footer className="foot">
        <span>Tulsa OK · 36.15°N 95.99°W</span>
        <span>Less, but better.</span>
        <span className="foot__klinekraft">KLINEKRAFT —</span>
      </footer>
    </main>
  )
}
