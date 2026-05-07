import { useState, useCallback } from 'react'

export default function PushButton({ onPress }) {
  const [pressed, setPressed] = useState(false)

  const flash = useCallback(() => {
    setPressed(true)
    setTimeout(() => setPressed(false), 240)
  }, [])

  const handleClick = () => {
    flash()
    onPress?.()
  }

  return (
    <div className="ctrl" style={{ width: '100%', display: 'grid', placeItems: 'center' }}>
      <div className="push" data-pressed={pressed}>
        <span className="push__pip" aria-hidden="true" />
        <div className="push__well" aria-hidden="true" />
        <button
          type="button"
          className="push__cap"
          aria-label="Trigger"
          onClick={handleClick}
        />
      </div>
    </div>
  )
}
