import { formatAngka } from '../../data/mock';
import './PeriodTrend.css';

export default function PeriodTrend({ tren, selected }) {
  if (!tren?.length) return <p>Belum ada data untuk kombinasi filter ini.</p>;
  const x = (i) => 80 + i * 190;
  const y = (v) => 145 - (v - 45) * 2.5;
  return (
    <div className="period-trend">
      <svg viewBox="0 0 550 175" role="img" aria-label="Perbandingan indeks tahunan beserta interval kepercayaan 95 persen">
        {[60, 80, 100].map((v) => <g key={v}><line x1="46" x2="500" y1={y(v)} y2={y(v)} className="period-trend__guide" /><text x="10" y={y(v) + 4}>{v}%</text></g>)}
        {tren.map((p, i) => p.skor != null && <g key={p.key}>
          <line x1={x(i)} x2={x(i)} y1={y(p.ci.atas)} y2={y(p.ci.bawah)} className="period-trend__ci" />
          {i > 0 && tren[i - 1].skor != null && <line x1={x(i - 1)} y1={y(tren[i - 1].skor)} x2={x(i)} y2={y(p.skor)} className="period-trend__line" />}
          <circle cx={x(i)} cy={y(p.skor)} r="4" className={p.key === selected ? 'period-trend__selected' : 'period-trend__point'}><title>{p.keterangan}: {formatAngka(p.skor)}%</title></circle>
          <text x={x(i)} y={y(p.skor) - 11} textAnchor="middle">{formatAngka(p.skor)}%</text>
          <text x={x(i)} y="169" textAnchor="middle">{p.short}</text>
        </g>)}
      </svg>
    </div>
  );
}
