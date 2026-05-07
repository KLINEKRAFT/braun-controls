export default function SlideToggle({ value, onChange }) {
  return (
    <div
      className="ctrl"
      style={{ width: '100%', display: 'grid', placeItems: 'center' }}
    >
      <button
        type="button"
        role="switch"
        aria-checked={value}
        aria-label="Power"
        className="slide-toggle"
        data-on={value}
        onClick={() => onChange(!value)}
      >
        <span className="slide-toggle__knob">
          <span className="slide-toggle__pip" />
        </span>
      </button>
    </div>
  )
}
