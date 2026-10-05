import './cards.css';

export default function AddNewCard({ title, description, onClick }) {
  return (
    <button type="button" className="card add-new-card" onClick={onClick}>
      <span className="add-new-card__circle" aria-hidden="true">
        <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 5v14M5 12h14" />
        </svg>
      </span>
      <span className="add-new-card__title">{title}</span>
      {description && <span className="add-new-card__desc">{description}</span>}
    </button>
  );
}
