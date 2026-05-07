export default function TwinButton({ value, onChange }) {
  return (
    <div
      className="ctrl"
      style={{ width: '100%', display: 'grid', placeItems: 'center' }}
    >
      <div
        className="twin"
        data-on={value === 1}
        role="radiogroup"
        aria-label="Channel"
      >
        <button
          type="button"
          role="radio"
          aria-checked={value === 0}
          aria-label="Channel A"
          className="twin__btn"
          data-active={value === 0}
          onClick={() => onChange(0)}
        />
        <button
          type="button"
          role="radio"
          aria-checked={value === 1}
          aria-label="Channel B"
          className="twin__btn"
          data-active={value === 1}
          onClick={() => onChange(1)}
        />
        <span className="twin__indicator" aria-hidden="true" />
      </div>
    </div>
  )
}
