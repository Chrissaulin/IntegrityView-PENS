import './cards.css';

export function BlobDecor({ color = 'currentColor' }) {
  return (
    <svg className="blob" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path
        fill={color}
        d="M43.9,-59.8C56.7,-50.4,67.4,-37.6,71.6,-22.6C75.9,-7.6,73.7,9.6,67.6,24.5C61.5,39.4,51.5,52,38.6,60.2C25.7,68.5,9.9,72.4,-4.9,69.6C-19.7,66.8,-33.5,57.4,-45.6,46.2C-57.7,35,-68.1,22.1,-71.6,7.1C-75.1,-7.9,-71.6,-25,-62.5,-37.6C-53.4,-50.2,-38.7,-58.3,-23.9,-62.5C-9.1,-66.7,5.7,-67,19.9,-64.1C34.1,-61.2,31.1,-69.2,43.9,-59.8Z"
        transform="translate(100 100)"
      />
    </svg>
  );
}

export default function StatCard({ eyebrow, value, unit, note, delta, deltaLabel, dark = false, children }) {
  const trendClass = delta == null ? '' : delta > 0 ? 'badge-up' : delta < 0 ? 'badge-down' : 'badge-flat';
  const trendText = delta == null ? '' : (delta > 0 ? '↑ ' : delta < 0 ? '↓ ' : '→ ') + Math.abs(delta).toFixed(1).replace('.', ',') + (deltaLabel || '');

  return (
    <article className={`card stat-card ${dark ? 'stat-card--dark' : ''}`}>
      {!dark && <BlobDecor color="#0B1B33" />}
      {dark && <BlobDecor color="#FFFFFF" />}
      <p className="label-eyebrow stat-card__eyebrow">{eyebrow}</p>
      <div className="stat-card__value">
        {value}
        {unit && <span className="stat-card__unit">{unit}</span>}
      </div>
      <div className="stat-card__foot">
        {delta != null && <span className={`badge ${trendClass}`}>{trendText}</span>}
        {note && <span className="stat-card__note">{note}</span>}
      </div>
      {children}
    </article>
  );
}
