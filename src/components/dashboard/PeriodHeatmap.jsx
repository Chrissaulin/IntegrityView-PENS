import { formatAngka } from '../../data/mock';
import { PERIODE } from '../../data/reportData';
import './PeriodHeatmap.css';

export default function PeriodHeatmap({ instrumen, periode, selectedKey, onSelect, tampilkanSelisih }) {
  if (!instrumen.length) return <p>Belum ada data untuk kombinasi filter ini.</p>;
  return (
    <div className="heatmap" role="table" aria-label="Indeks instrumen per tahun">
      <div className="heatmap__row" role="row">
        <span role="columnheader">Instrumen</span>
        {PERIODE.map((p) => <span role="columnheader" key={p.key} title={p.keterangan} className={periode === p.key ? 'heatmap__active' : ''}>{p.short}</span>)}
      </div>
      {instrumen.map((entry) => (
        <button key={entry.info.key} type="button" className={`heatmap__row heatmap__data ${selectedKey === entry.info.key ? 'heatmap__selected' : ''}`} onClick={() => onSelect(entry.info.key)} role="row" aria-label={`Pilih ${entry.info.namaPanjang}`}>
          <span role="rowheader">{entry.info.nama}</span>
          {entry.tren.map((p) => <span key={p.key} role="cell" className={periode === p.key ? 'heatmap__active' : ''} title={`${entry.info.nama}: ${p.keterangan}`} style={{ backgroundColor: `rgba(11, 27, 51, ${p.skor == null ? 0.05 : 0.12 + p.skor / 125})`, color: p.skor > 62 ? 'var(--white)' : 'var(--navy-900)' }}>
            {p.skor == null ? 'n < 5' : `${formatAngka(p.skor)}%`}
            {tampilkanSelisih && p.deltaTahunan != null && <small>{p.deltaTahunan >= 0.5 ? '↑ +' : p.deltaTahunan <= -0.5 ? '↓ ' : '→ '}{formatAngka(p.deltaTahunan)} poin</small>}
          </span>)}
        </button>
      ))}
    </div>
  );
}
