import { formatAngka } from '../../data/mock';
import './Delta.css';

export default function Delta({ value, unit = 'poin', compact = false, desimal = 1 }) {
  if (value == null) return null;
  const arah = Math.abs(value) < 0.5 ? 'flat' : value > 0 ? 'up' : 'down';
  return <span className={`delta delta--${arah}`} aria-label={`Selisih ${formatAngka(value, desimal)} ${unit}`}>
    {arah === 'up' ? '↑' : arah === 'down' ? '↓' : '→'} {value > 0 ? '+' : ''}{formatAngka(value, desimal)}{compact ? '' : `\u00a0${unit}`}
  </span>;
}
