import { useEffect, useMemo, useRef, useState } from 'react';
import ItemDistributionBar, { SkalaLegend } from '../components/instrumen/ItemDistributionBar';
import RecommendationList from '../components/instrumen/RecommendationList';
import DataQualityBadges from '../components/instrumen/DataQualityBadges';
import ReportTemplate from '../components/instrumen/ReportTemplate';
import PeriodTrend from '../components/instrumen/PeriodTrend';
import ReportFilters from '../components/dashboard/ReportFilters';
import Delta from '../components/dashboard/Delta';
import { useReportFilters } from '../data/useReportFilters';
import { getReportData } from '../data/reportData';
import { unduhLaporanPdf, namaFileLaporan } from '../lib/reportPdf';
import {
  SURVEI_INFO, formatAngka
} from '../data/mock';
import './InstrumentDetailPage.css';

/* Tinggi baris daftar butir: nyaman dibaca, jarak antar baris cukup.
   Scroll internal hanya muncul bila jumlah butir melebihi tinggi panel. */
const ROW_MIN = 38;
const ROW_MAX = 56;

/* Panel kanan: Rekomendasi (atas) + Kualitas Data (bawah), tinggi penuh. */

export default function InstrumentDetailPage({ slug, onBack }) {
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);
  const [ekspor, setEkspor] = useState(false);
  const [mengunduh, setMengunduh] = useState(false);
  const [tab, setTab] = useState('distribusi');
  const { filter, setFilter } = useReportFilters();
  const reportRef = useRef(null);

  const distRef = useRef(null);
  const [distAvail, setDistAvail] = useState(0);

  const info = useMemo(() => SURVEI_INFO.find((s) => s.key === slug), [slug]);
  const laporan = useMemo(() => getReportData(filter), [filter]);
  const hasil = laporan.instrumen.find((s) => s.info.key === slug);
  const st = hasil?.aktif;
  const rekomendasi = hasil?.rekomendasi;
  const duplikat = st?.duplikat;

  useEffect(() => {
    const t = window.setTimeout(() => setLoading(false), 350);
    return () => window.clearTimeout(t);
  }, [slug]);

  /* Ukur tinggi area daftar distribusi. */
  useEffect(() => {
    if (!distRef.current) return;
    const el = distRef.current;
    const ro = new ResizeObserver((entries) => {
      setDistAvail(entries[0].contentRect.height);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [loading, tab]);

  const sebaranButir = hasil?.sebaranButir || [];

  const jumlahButir = sebaranButir.length;

  const rowHeight = (() => {
    if (!jumlahButir || !distAvail) return ROW_MAX;
    const ideal = Math.floor(distAvail / jumlahButir);
    return Math.max(ROW_MIN, Math.min(ROW_MAX, ideal));
  })();

  const perluScroll = jumlahButir * rowHeight > distAvail + 1 && jumlahButir > 0;

  /* Maks 3 rekomendasi langsung; tombol "Lihat semua" bila ada lebih. */
  const rekomendasiTampil = rekomendasi?.slice(0, 3) || [];

  const handleEkspor = () => setEkspor(true);

  const handleUnduh = async () => {
    if (!reportRef.current || mengunduh) return;
    setMengunduh(true);
    try {
      const nama = namaFileLaporan(info?.nama || slug, laporan.periode.label);
      await unduhLaporanPdf(reportRef.current, nama);
      setEkspor(false);
    } finally {
      setMengunduh(false);
    }
  };

  const [tanggalCetak] = useState(() => {
    const d = new Date();
    const bulan = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
    return `${d.getDate()} ${bulan[d.getMonth()]} ${d.getFullYear()}`;
  });

  if (loading) {
    return (
      <div className="idp idp--loading" role="status" aria-label="Memuat detail instrumen">
        <div className="skeleton" style={{ height: 48 }} />
        <div className="idp__cards">
          <div className="skeleton" /><div className="skeleton" /><div className="skeleton" /><div className="skeleton" />
        </div>
        <div className="skeleton" style={{ flex: 1 }} />
      </div>
    );
  }

  if (!info || !st) {
    return (
      <div className="idp idp--empty">
        <ReportFilters filter={filter} onChange={setFilter} />
        <p>Belum ada data untuk kombinasi filter ini (n kurang dari 5).</p>
        <button type="button" className="btn btn-outline-navy" onClick={onBack}>Kembali ke Ringkasan</button>
      </div>
    );
  }

  return (
    <div className="idp">
      {/* === Header === */}
      <header className="idp__header">
        <nav className="idp__breadcrumb" aria-label="Breadcrumb">
          <button type="button" className="idp__crumb-link" onClick={onBack}>Ringkasan</button>
          <span className="idp__crumb-sep" aria-hidden="true">/</span>
          <span className="idp__crumb-current">{info.namaPanjang}</span>
        </nav>

        <div className="idp__header-right">
          <button type="button" className="btn btn-primary idp__ekspor" onClick={handleEkspor}>
            Ekspor
          </button>
        </div>
      </header>
      <ReportFilters filter={filter} onChange={setFilter} />

      {/* === 4 kartu === */}
      <div className="idp__cards">
        <MiniCard label="Jumlah Responden (n)" value={st.jumlahResponden.toLocaleString('id-ID')} delta={hasil.pembanding && st.jumlahResponden - hasil.pembanding.jumlahResponden} unit="responden" />
        <MiniCard label="Rata-rata Skor" value={formatAngka(st.skor) + '%'} delta={hasil.delta} />
        <MiniCard label="Setuju + Sangat Setuju" value={formatAngka(st.persenSetuju) + '%'} delta={hasil.pembanding && st.persenSetuju - hasil.pembanding.persenSetuju} />
        <MiniCard
          label="Cronbach's Alpha"
          value={formatAngka(st.alpha, 2)}
          note={st.alpha >= 0.7 ? 'Reliabel' : null}
          delta={hasil.pembanding && st.alpha - hasil.pembanding.alpha}
          unit="nilai"
          desimal={2}
        />
      </div>

      {/* === Dua panel === */}
      <div className="idp__panels">
        <section className="idp__panel idp__panel--left" aria-labelledby="dist-butir-title">
          <div className="idp__panel-head">
             <h2 className="idp__panel-title" id="dist-butir-title">{tab === 'distribusi' ? 'Distribusi Jawaban per Butir' : 'Perbandingan antar tahun'}</h2>
            <div className="idp__tabs" role="group" aria-label="Tampilan instrumen">
              <button type="button" aria-pressed={tab === 'distribusi'} className={tab === 'distribusi' ? 'is-active' : ''} onClick={() => setTab('distribusi')}>Distribusi</button>
               <button type="button" aria-pressed={tab === 'perubahan'} className={tab === 'perubahan' ? 'is-active' : ''} onClick={() => setTab('perubahan')}>Perbandingan antar tahun</button>
            </div>
          </div>
          {tab === 'distribusi' ? <>
          <SkalaLegend />
          <div
            ref={distRef}
            className={`idp__dist-list ${perluScroll ? 'idp__dist-list--scroll' : ''}`}
          >
            {sebaranButir.map((item) => (
              <div key={item.nama} className="idp__dist-row" style={{ height: rowHeight, minHeight: rowHeight }}>
                <ItemDistributionBar item={item} height={rowHeight} compact={rowHeight < 44} />
              </div>
            ))}
          </div>

          <p className="idp__panel-note">
            Diurutkan dari persentase Setuju + Sangat Setuju terendah.
          </p>
          </> : <>
            <PeriodTrend tren={hasil.tren} selected={filter.periode} />
            {laporan.periodePembanding ? <>
            <p className="idp__panel-note">Selisih indeks butir vs {laporan.periodePembanding.label} (poin).</p>
            <div className="idp__change-list">
              {hasil.perubahanButir.map((b) => <div key={b.nama} className="idp__change-row">
                <span title={b.nama}>{b.nama}</span>
                <span className="idp__change-track"><i style={{ left: b.delta == null ? '50%' : b.delta < 0 ? `${50 - Math.min(48, -b.delta * 2)}%` : '50%', width: b.delta == null ? 0 : `${Math.min(48, Math.abs(b.delta) * 2)}%`, background: b.delta < 0 ? 'var(--orange-500)' : 'var(--navy-500)' }} /></span>
                <Delta value={b.delta} compact />
              </div>)}
            </div>
            </> : <p className="idp__panel-note">{laporan.periode.label} belum memiliki tahun pembanding.</p>}
          </>}
        </section>

        <section className="idp__panel idp__panel--right">
          <div className="idp__half idp__half--top idp__half--rek">
            <div className="idp__half-head">
              <h2 className="idp__panel-title">Rekomendasi</h2>
              {rekomendasi.length > 3 && (
                <button type="button" className="idp__more" onClick={() => setModal('rekomendasi-all')}>
                  Lihat semua rekomendasi
                </button>
              )}
            </div>
            <RecommendationList
              items={rekomendasiTampil}
              max={3}
              onDetail={(r) => setModal({ rekomendasi: r })}
            />
          </div>

          <div className="idp__half idp__half--bottom">
            <div className="idp__half-head">
              <h2 className="idp__panel-title">Kualitas Data</h2>
              <span className="idp__quality-extra">Median {formatAngka(st.median)}% · Simpangan baku {formatAngka(st.simpanganBaku, 2)}</span>
            </div>
            <DataQualityBadges
              persenSeragam={st.persenSeragam}
              duplikat={duplikat}
              n={st.jumlahResponden}
              pembanding={hasil.pembanding?.jumlahResponden ?? null}
            />
          </div>
        </section>
      </div>

      {/* === Modal rekomendasi === */}
      {modal && (
        <div className="idp__modal-overlay" onClick={() => setModal(null)} role="presentation">
          <div
            className="idp__modal"
            role="dialog"
            aria-modal="true"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="idp__modal-head">
              <h3>
                {modal === 'rekomendasi-all' && 'Semua Rekomendasi'}
                {modal.rekomendasi && 'Detail Rekomendasi'}
              </h3>
              <button type="button" className="idp__modal-close" onClick={() => setModal(null)} aria-label="Tutup">×</button>
            </div>

            <div className="idp__modal-body">
              {modal === 'rekomendasi-all' && (
                <RecommendationList
                  items={rekomendasi}
                  max={rekomendasi.length}
                  full
                />
              )}

              {modal.rekomendasi && (
                <>
                  <span className={`reclist__prio prioritas--${modal.rekomendasi.prioritas.toLowerCase()}`}>
                    {modal.rekomendasi.prioritas}
                  </span>
                  <p className="idp__modal-rek-teks">{modal.rekomendasi.teks}</p>
                  <p className="idp__modal-rek-dasar">Dasar data: {modal.rekomendasi.dasar}</p>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* === Modal pratinjau ekspor PDF === */}
      {ekspor && (
        <div className="idp__modal-overlay" onClick={() => !mengunduh && setEkspor(false)} role="presentation">
          <div
            className="idp__modal idp__modal--report"
            role="dialog"
            aria-modal="true"
            aria-label={`Pratinjau Laporan ${info?.namaPanjang}`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="idp__modal-head">
              <h3>Pratinjau Laporan — {info?.namaPanjang}</h3>
              <button type="button" className="idp__modal-close" onClick={() => setEkspor(false)} aria-label="Tutup" disabled={mengunduh}>×</button>
            </div>

            <div className="idp__modal-preview">
              <div className="idp__preview-scale" ref={reportRef}>
                <ReportTemplate
                  info={info}
                  st={st}
                  rekomendasi={rekomendasi}
                  periode={laporan.periode.keterangan}
                  tanggalCetak={tanggalCetak}
                  laporan={laporan}
                  hasil={hasil}
                />
              </div>
            </div>

            <div className="idp__modal-foot">
              <button type="button" className="btn btn-outline-navy" onClick={() => setEkspor(false)} disabled={mengunduh}>
                Batal
              </button>
              <button type="button" className="btn btn-primary" onClick={handleUnduh} disabled={mengunduh}>
                {mengunduh ? (
                  <>
                    <span className="idp__spinner" aria-hidden="true" />
                    Menyiapkan…
                  </>
                ) : 'Unduh PDF'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function MiniCard({ label, value, note, delta, unit, desimal }) {
  return (
    <article className="idp__minicard">
      <span className="idp__minicard-label">{label}</span>
      <span className="idp__minicard-value">
        {value}
        {note && <span className="idp__minicard-note">{note}</span>}
      </span>
      <Delta value={delta} unit={unit} desimal={desimal} compact />
    </article>
  );
}
