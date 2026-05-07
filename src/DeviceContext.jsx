import { createContext, useContext, useState, useMemo } from 'react'

/* The page is the device. This context holds every piece of state that
   the amp controls drive — theme, power, view, density, balance,
   shadow depth, stroke weight, etc. Components subscribe to what they
   care about. */

const VIEWS = [
  { id: 'radio',    label: 'radio',           description: 'current view' },
  { id: 'phono1',   label: 'phono 1',         description: 'process notes' },
  { id: 'phono2',   label: 'phono 2',         description: 'palette breakdown' },
  { id: 'phono3',   label: 'phono 3',         description: 'typography spec' },
  { id: 'phono4',   label: 'phono 4',         description: 'construction details' },
  { id: 'tonel',    label: 'tonel',           description: 'changelog' },
  { id: 'stereo',   label: 'stereo  T 1080',  description: 'credits' },
]

const DeviceContext = createContext(null)

export function DeviceProvider({ children }) {
  const [theme, setTheme]       = useState('light')      // 'light' | 'dark'
  const [power, setPower]       = useState(true)          // false = page is "off"
  const [viewIndex, setViewIndex] = useState(0)           // index into VIEWS
  const [volume, setVolume]     = useState(0.55)          // 0..1 — page density
  const [balance, setBalance]   = useState(0.50)          // 0..1 — left/right shift
  const [bass, setBass]         = useState(0.50)          // 0..1 — shadow depth
  const [treble, setTreble]     = useState(0.50)          // 0..1 — stroke crispness
  const [activeStatus, setActiveStatus] = useState(0)     // rein/pr/rf

  const cycleView = () => setViewIndex(i => (i + 1) % VIEWS.length)
  const toggleTheme = () => setTheme(t => (t === 'light' ? 'dark' : 'light'))
  const togglePower = () => setPower(p => !p)

  const value = useMemo(() => ({
    theme, setTheme, toggleTheme,
    power, setPower, togglePower,
    viewIndex, setViewIndex, cycleView,
    view: VIEWS[viewIndex],
    views: VIEWS,
    volume, setVolume,
    balance, setBalance,
    bass, setBass,
    treble, setTreble,
    activeStatus, setActiveStatus,
  }), [theme, power, viewIndex, volume, balance, bass, treble, activeStatus])

  return (
    <DeviceContext.Provider value={value}>
      {children}
    </DeviceContext.Provider>
  )
}

export function useDevice() {
  const ctx = useContext(DeviceContext)
  if (!ctx) throw new Error('useDevice must be used within DeviceProvider')
  return ctx
}
