import './cards.css';

export default function SoftStatCard({ title, items = [], footerNote }) {
  const max = Math.max(...items.map(i => i.value), 1);
  return (
    <article className="card soft-stat-card">
      <p className="label-eyebrow">{title}</p>
      <ul className="soft-stat-card__list">
        {items.map((it) => {
          const pct = Math.max(4, (it.value / max) * 100);
          return (
            <li key={it.label} className="soft-stat-card__row">
              <div className="soft-stat-card__row-head">
                <span className="soft-stat-card__label">{it.label}</span>
                <span className="soft-stat-card__value">{it.display ?? it.value}</span>
              </div>
              <div className="soft-stat-card__bar" role="progressbar" aria-valuenow={it.value} aria-valuemin="0" aria-valuemax="100" aria-label={it.label}>
                <span className="soft-stat-card__bar-fill" style={{ width: pct + '%' }} />
              </div>
            </li>
          );
        })}
      </ul>
      {footerNote && <p className="soft-stat-card__note">{footerNote}</p>}
    </article>
  );
}
