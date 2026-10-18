import { useMemo, useState } from 'react';
import Sidebar from '../components/layout/Sidebar';
import Topbar from '../components/layout/Topbar';
import { SURVEI_DESKRIPSI, SURVEI_LANGKAH, getUser, jumlahTerisi, sudahDiisi } from '../data/mock';
import { getReportData } from '../data/reportData';
import { useReportFilters } from '../data/useReportFilters';
import './SurveiPage.css';

const KATEGORI = ['Semua', 'Integritas & Korupsi', 'Pelayanan Publik', 'Pelaporan', 'Budaya & 5R'];

export default function SurveiPage({ onNavigate, onIsiSurvei }) {
  const user = getUser();
  const [kategori, setKategori] = useState('Semua');

  const { filter } = useReportFilters();
  const laporan = useMemo(() => getReportData({ ...filter, kategori: 'Semua' }), [filter]);
  const daftar = useMemo(() => laporan.instrumen.map(({ info, aktif }) => ({
    ...info,
    deskripsi: SURVEI_DESKRIPSI[info.key] || '',
    langkah: SURVEI_LANGKAH[info.key],
    jumlahButir: aktif?.butir.length || 0,
    responden: aktif?.jumlahResponden || 0
  })), [laporan]);
  const terisi = useMemo(() => jumlahTerisi(), []);
  /* Jumlah instrumen & responden dari sumber yang sama dengan dashboard. */
  const jumlahInstrumen = daftar.length;
  const totalResponden = laporan.ringkasan.responden.total;

  const filtered = useMemo(() => {
    if (kategori === 'Semua') return daftar;
    return daftar.filter((d) => d.kategori === kategori);
  }, [daftar, kategori]);

  const handleMenu = (key) => {
    if (onNavigate) onNavigate(key);
  };

  const mulaiBerikutnya = () => {
    const belum = daftar.find((d) => !sudahDiisi(d.key)) || daftar[0];
    if (belum && onIsiSurvei) onIsiSurvei(belum.key);
  };

  return (
    <div className="app-shell">
      <Sidebar active="survei" onNavigate={handleMenu} user={user} />

      <div className="app-main">
        <Topbar user={user} notifCount={3} onProfil={() => handleMenu('profil')} />

        <main className="app-content">
          <section className="survei-hero">
            <div className="survei-hero__text">
              <p className="label-eyebrow">Pusat Survei</p>
              <h1 className="survei-hero__title">Semua instrumen Zona Integritas di satu tempat.</h1>
              <p className="survei-hero__lead">
                Pilih instrumen, klik Isi Survei, jawaban tersimpan di peramban ini. Progres pengisian dihitung dari respons yang sudah tersimpan.
              </p>
            </div>

            <div className="survei-hero__progress">
              <div className="survei-hero__progress-num">
                {terisi}<span className="survei-hero__progress-of"> / {jumlahInstrumen}</span>
              </div>
              <p className="survei-hero__progress-label">Survei sudah diisi</p>
              <div className="survei-hero__progress-bar" role="progressbar" aria-valuenow={terisi} aria-valuemin="0" aria-valuemax={jumlahInstrumen}>
                <span style={{ width: (terisi / jumlahInstrumen) * 100 + '%' }} />
              </div>
              <p className="survei-hero__progress-note">Hanya menghitung form internal di peramban ini.</p>
            </div>
          </section>

          <section className="survei-stats">
            <div className="survei-stat">
              <span className="survei-stat__num">{jumlahInstrumen}</span>
              <span className="survei-stat__label">Total instrumen</span>
            </div>
            <div className="survei-stat">
              <span className="survei-stat__num">{totalResponden.toLocaleString('id-ID')}</span>
              <span className="survei-stat__label">Total responden</span>
            </div>
            <div className="survei-stat">
              <span className="survei-stat__num">{laporan.ringkasan.totalInstrumen}</span>
              <span className="survei-stat__label">Instrumen aktif</span>
            </div>
            <div className="survei-stat">
              <span className="survei-stat__num">{laporan.periode.short}</span>
              <span className="survei-stat__label">Periode data</span>
            </div>
          </section>

          <div className="survei-toolbar">
            <div className="survei-filter" role="group" aria-label="Filter kategori instrumen">
              {KATEGORI.map((k) => (
                <button
                  key={k}
                  type="button"
                  className={`survei-filter__btn ${kategori === k ? 'is-active' : ''}`}
                  aria-pressed={kategori === k}
                  onClick={() => setKategori(k)}
                >
                  {k}
                </button>
              ))}
            </div>
            <button type="button" className="btn btn-primary" onClick={mulaiBerikutnya}>
              Mulai Survei Berikutnya
            </button>
          </div>

          {filtered.length === 0 ? (
            <p className="survei-empty">Tidak ada instrumen pada kategori ini.</p>
          ) : (
            <div className="survei-grid">
              {filtered.map((d) => {
                const sudah = sudahDiisi(d.key);
                return (
                  <article key={d.key} className={`scard ${sudah ? 'scard--done' : ''}`}>
                    <div className="scard__top">
                      <span className="scard__kategori">{d.kategori}</span>
                      {sudah && <span className="badge badge-up">Sudah Diisi</span>}
                    </div>
                    <h3 className="scard__name">{d.namaPanjang}</h3>
                    <p className="scard__desc">{d.deskripsi}</p>
                    <div className="scard__meta">
                      <span>{d.jumlahButir} pertanyaan</span>
                      <span aria-hidden="true">·</span>
                      <span>{d.responden.toLocaleString('id-ID')} responden</span>
                    </div>
                    <button
                      type="button"
                      className={`btn btn-block scard__cta ${sudah ? 'btn-outline-navy' : 'btn-primary'}`}
                      onClick={() => onIsiSurvei && onIsiSurvei(d.key)}
                    >
                      {sudah ? 'Isi Ulang' : 'Isi Survei'}
                    </button>
                  </article>
                );
              })}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
