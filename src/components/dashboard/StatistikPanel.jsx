import { useLayoutEffect, useRef, useState } from 'react';
import './StatistikPanel.css';
import RecommendationList from '../instrumen/RecommendationList';
import { formatAngka } from '../../data/mock';
import Delta from './Delta';

export default function StatistikPanel({ selectedKey, onOpenDetail, laporan }) {
  if (!selectedKey) return <p className="spanel spanel--empty">Belum ada data untuk kombinasi filter ini.</p>;
  const hasil = laporan.instrumen.find((s) => s.info.key === selectedKey);
  const st = hasil?.aktif;
  if (!st) return <p className="spanel spanel--empty">Belum ada data untuk kombinasi filter ini (n kurang dari 5).</p>;
  const sebelumnya = hasil.pembanding;

  return <div className="spanel">
    <div className="spanel__head">
      <h3 className="spanel__title">{hasil.info.namaPanjang}</h3>
      <button type="button" className="spanel__full-link" onClick={() => onOpenDetail?.(selectedKey)}>Lihat Dashboard Lengkap</button>
    </div>
    <div className="spanel__grid">
      <Stat label="Responden (n)" value={st.jumlahResponden.toLocaleString('id-ID')} delta={sebelumnya && st.jumlahResponden - sebelumnya.jumlahResponden} unit="responden" />
      <Stat label="Rata-rata skor" value={`${formatAngka(st.skor)}%`} delta={hasil.delta} />
      <Stat label="Setuju + Sangat Setuju" value={`${formatAngka(st.persenSetuju)}%`} delta={sebelumnya && st.persenSetuju - sebelumnya.persenSetuju} />
      <Stat label="Cronbach's alpha" value={formatAngka(st.alpha, 2)} delta={sebelumnya && st.alpha - sebelumnya.alpha} unit="nilai" desimal={2} />
    </div>
    <RekomendasiPanel items={hasil.rekomendasi} onOpenDetail={() => onOpenDetail?.(selectedKey)} />
  </div>;
}

function Stat({ label, value, delta, unit, desimal }) {
  return <div className="spanel__stat">
    <span className="spanel__stat-label">{label}</span>
    <span className="spanel__stat-value">{value}</span>
    <Delta value={delta} unit={unit} desimal={desimal} compact />
  </div>;
}

function RekomendasiPanel({ items, onOpenDetail }) {
  const areaRef = useRef(null);
  const [muat, setMuat] = useState(3);
  useLayoutEffect(() => {
    const area = areaRef.current;
    if (!area) return;
    const ro = new ResizeObserver(() => {
      /* Sisakan ruang judul, tautan, dan paling banyak dua baris dasar per item. */
      const tersedia = area.clientHeight - 58;
      setMuat(Math.max(1, Math.min(3, Math.floor(tersedia / 72))));
    });
    ro.observe(area);
    return () => ro.disconnect();
  }, []);
  const jumlah = Math.min(muat, items.length);
  return <section className="spanel__rek" ref={areaRef} aria-label="Rekomendasi">
    <h4 className="spanel__rek-title">Rekomendasi</h4>
    <RecommendationList items={items} max={jumlah} />
    {items.length > jumlah && <button type="button" className="spanel__more" onClick={onOpenDetail}>Lihat semua rekomendasi</button>}
  </section>;
}
