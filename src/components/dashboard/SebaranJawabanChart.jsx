import { useState } from 'react';
import './SebaranJawabanChart.css';
import { formatAngka } from '../../data/mock';

const SKALA = [
  { label: 'Sangat Tidak Setuju', short: 'STS', color: '#C25E1E' },
  { label: 'Tidak Setuju', short: 'TS', color: '#F5843C' },
  { label: 'Setuju', short: 'S', color: '#7FA8D9' },
  { label: 'Sangat Setuju', short: 'SS', color: '#0B1B33' }
];

const MIN_LABEL_PCT = 7;

export default function SebaranJawabanChart({ data, selectedKey, onSelect, onOpenDetail }) {
  const [tooltip, setTooltip] = useState(null);

  if (!data || !data.length) {
    return (
      <div className="sebaran sebaran--empty">
        <p>Belum ada data sebaran jawaban.</p>
      </div>
    );
  }

  const showTip = (e, item, segIdx) => {
    const rect = e.currentTarget.closest('.sebaran__inner').getBoundingClientRect();
    setTooltip({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      item,
      segIdx
    });
  };

  return (
    <div className="sebaran">
      <div className="sebaran__legend">
        {SKALA.map((s, i) => (
          <span key={s.short} className="sebaran__legend-item">
            <span className="sebaran__legend-swatch" style={{ background: s.color }} />
            {i + 1} · {s.label}
          </span>
        ))}
      </div>

      <div className="sebaran__inner" onMouseLeave={() => setTooltip(null)}>
        {data.map((item) => {
          const isSelected = item.key === selectedKey;
          return (
            <button
              key={item.key}
              type="button"
              className={`sebaran__row ${isSelected ? 'is-selected' : ''}`}
              onClick={() => onSelect(item.key)}
              aria-pressed={isSelected}
              aria-label={`Pilih ${item.namaPanjang}, ${formatAngka(item.persenSetuju)} persen setuju`}
            >
              <span className="sebaran__name">
                {item.nama}
                {item.sumber === 'simulasi' && (
                  <span className="sebaran__tag">simulasi</span>
                )}
              </span>

              <span className="sebaran__bar" role="img" aria-label={`Sebaran jawaban ${item.nama}`}>
                {item.distribusiPersen.map((pct, i) => {
                  const abs = item.distribusiAbsolut[i];
                  return (
                    <span
                      key={i}
                      className={`sebaran__seg ${item.sumber === 'simulasi' ? 'sebaran__seg--simulasi' : ''}`}
                      style={{ width: pct + '%', background: SKALA[i].color }}
                      onMouseMove={(e) => showTip(e, item, i)}
                    >
                      {pct >= MIN_LABEL_PCT && (
                        <span className="sebaran__seg-label">{formatAngka(pct, 0)}%</span>
                      )}
                      {abs === 0 && null}
                    </span>
                  );
                })}
              </span>

              <span className="sebaran__pct">
                {formatAngka(item.persenSetuju)}%
              </span>

              {onOpenDetail && (
                <span
                  className="sebaran__open"
                  role="button"
                  tabIndex={0}
                  aria-label={`Buka dashboard lengkap ${item.nama}`}
                  title={`Dashboard lengkap ${item.nama}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    onOpenDetail(item.key);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      e.stopPropagation();
                      onOpenDetail(item.key);
                    }
                  }}
                >
                  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M7 17 17 7M9 7h8v8" />
                  </svg>
                </span>
              )}
            </button>
          );
        })}

        {tooltip && (
          <div
            className="sebaran__tooltip"
            style={{ left: tooltip.x + 14, top: tooltip.y - 8 }}
            role="status"
          >
            <strong>{tooltip.item.namaPanjang}</strong>
            <span>
              {SKALA[tooltip.segIdx].label} ({tooltip.segIdx + 1}):{' '}
              {formatAngka(tooltip.item.distribusiPersen[tooltip.segIdx])}% · n = {tooltip.item.distribusiAbsolut[tooltip.segIdx]}
            </span>
            <span className="sebaran__tooltip-note">Total jawaban: {tooltip.item.n}</span>
          </div>
        )}
      </div>

      <p className="sebaran__note">
        Diurutkan dari persentase Setuju + Sangat Setuju terendah. Klik batang untuk melihat statistik instrumen.
      </p>
    </div>
  );
}
