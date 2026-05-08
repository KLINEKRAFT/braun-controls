import { createContext, useContext, useState, useMemo, useRef, useCallback } from 'react'

/* Page state, stripped to essentials.
   - theme: 'light' | 'dark'  — toggled by the dial widget
   - signal: a transient Rams "signal color" applied as a global wash
     whenever the user presses any tile. Each tile flashes its own hue. */

const DeviceContext = createContext(null)

const FLASH_MS = 1100

export function DeviceProvider({ children }) {
  const [theme, setTheme] = useState('light')
  const [signal, setSignal] = useState(null)
  const timerRef = useRef(null)

  const toggleTheme = useCallback(() => {
    setTheme((t) => (t === 'light' ? 'dark' : 'light'))
  }, [])

  const flash = useCallback((color) => {
    setSignal(color)
    if (timerRef.current) clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => setSignal(null), FLASH_MS)
  }, [])

  const value = useMemo(
    () => ({ theme, setTheme, toggleTheme, signal, flash }),
    [theme, signal, toggleTheme, flash],
  )

  return <DeviceContext.Provider value={value}>{children}</DeviceContext.Provider>
}

export function useDevice() {
  const ctx = useContext(DeviceContext)
  if (!ctx) throw new Error('useDevice must be used within DeviceProvider')
  return ctx
}
