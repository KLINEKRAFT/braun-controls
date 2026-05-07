export default function MiniToggle({ value, onChange }) {
  return (
    <div className="ctrl" style={{ width: '100%', display: 'grid', placeItems: 'center' }}>
      <div className="mini" data-on={value}>
        <button
          type="button"
          role="switch"
          aria-checked={value}
          aria-label="Standby"
          className="mini__pill"
          data-on={value}
          onClick={() => onChange(!value)}
        >
          <span className="mini__knob" />
        </button>
        <span className="mini__indicator" aria-hidden="true" />
      </div>
    </div>
  )
}
