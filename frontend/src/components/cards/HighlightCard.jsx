import { BlobDecor } from './StatCard';

export default function HighlightCard({ title, description, ctaLabel, onCta, badges = [] }) {
  return (
    <article className="card highlight-card">
      <BlobDecor color="#FFFFFF" />
      {badges.length > 0 && (
        <div className="highlight-card__badges">
          {badges.map((b, i) => (
            <span key={i} className={`badge ${b.tone === 'important' ? 'badge-important' : 'badge-new'}`}>
              {b.label}
            </span>
          ))}
        </div>
      )}
      <h3 className="highlight-card__title">{title}</h3>
      <p className="highlight-card__desc">{description}</p>
      <button type="button" className="btn btn-ghost-light highlight-card__cta" onClick={onCta}>
        {ctaLabel}
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M5 12h14M13 6l6 6-6 6" />
        </svg>
      </button>
    </article>
  );
}
