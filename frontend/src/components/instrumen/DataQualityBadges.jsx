import './DataQualityBadges.css';
import { formatAngka } from '../../data/mock';

/* Baris label + nilai untuk panel Kualitas Data.
   Tanpa catatan kecil berulang dan tanpa garis pemisah antar baris. */
export default function DataQualityBadges({ persenSeragam, duplikat, n, pembanding }) {
  const rows = [
    { label: 'Jawaban seragam', value: formatAngka(persenSeragam) + '%', warn: persenSeragam > 50 },
    { label: 'Duplikat terdeteksi', value: String(duplikat), warn: duplikat > 0 },
    { label: 'Jumlah responden', value: n.toLocaleString('id-ID'), warn: n < 30 },
    { label: 'Responden pembanding', value: pembanding == null ? 'Tanpa pembanding' : pembanding.toLocaleString('id-ID'), warn: pembanding != null && pembanding < 30 }
  ];

  return (
    <div className="dqb">
      {rows.map((row) => (
        <div key={row.label} className={`dqb__row ${row.warn ? 'dqb__row--warn' : 'dqb__row--ok'}`}>
          <span className="dqb__label">{row.label}</span>
          <span className="dqb__value">{row.value}</span>
        </div>
      ))}
    </div>
  );
}
