import { useEffect, useMemo, useState } from 'react';
import Sidebar from '../components/layout/Sidebar';
import Topbar from '../components/layout/Topbar';
import RingkasanCards from '../components/dashboard/RingkasanCards';
import SebaranJawabanChart, { SebaranLegend } from '../components/dashboard/SebaranJawabanChart';
import StatistikPanel from '../components/dashboard/StatistikPanel';
import PeriodHeatmap from '../components/dashboard/PeriodHeatmap';
import ReportFilters from '../components/dashboard/ReportFilters';
import { useReportFilters } from '../data/useReportFilters';
import { getReportData } from '../data/reportData';
import { getUser } from '../data/mock';
import './Dashboard.css';

export default function Dashboard({ onBackToLanding, onNavigate, onOpenInstrument }) {
  const user = getUser();
  const [loading, setLoading] = useState(true);
  const [selectedKey, setSelectedKey] = useState(null);
  const [tab, setTab] = useState('sebaran');
  const { filter, setFilter } = useReportFilters();

  const laporan = useMemo(() => getReportData(filter), [filter]);
  const { ringkasan, sebaran } = laporan;

  useEffect(() => {
    const t = window.setTimeout(() => {
      setLoading(false);
    }, 500);
    return () => window.clearTimeout(t);
  }, []);

  const aktifKey = laporan.instrumen.some((s) => s.info.key === selectedKey && s.aktif)
    ? selectedKey : sebaran[0]?.key || null;

  const handleMenu = (key) => {
    if (key === 'beranda') {
      if (onBackToLanding) onBackToLanding();
      return;
    }
    if (onNavigate) onNavigate(key);
  };

  return (
    <div className="app-shell dashboard-shell">
      <Sidebar active="dashboard" onNavigate={handleMenu} user={user} />

      <div className="app-main">
         <Topbar compact user={user} notifCount={3} onProfil={() => handleMenu('profil')} />

        <main className="app-content">
          {loading ? (
            <div className="dashboard__loading" role="status" aria-label="Memuat data dashboard">
              <div className="dashboard__loading-cards">
                <div className="skeleton skeleton--card" />
                <div className="skeleton skeleton--card" />
                <div className="skeleton skeleton--card" />
              </div>
              <div className="skeleton skeleton--panel" />
            </div>
          ) : (
            <>
              <div className="dashboard__report">
               <ReportFilters filter={filter} onChange={setFilter} />
              <RingkasanCards ringkasan={ringkasan} pembanding={laporan.periodePembanding} />

              <div className="dashboard__duo">
                <section className="dashboard__box dashboard__box--left" aria-labelledby="sebaran-title">
                  <div className="dashboard__box-head">
                     <h2 className="dashboard__box-title" id="sebaran-title">{tab === 'sebaran' ? 'Sebaran Jawaban per Instrumen' : 'Perubahan Indeks Tahunan'}</h2>
                     {tab === 'sebaran' && <SebaranLegend />}
                    <div className="dashboard__tabs" role="group" aria-label="Tampilan grafik">
                      <button type="button" className={tab === 'sebaran' ? 'is-active' : ''} aria-pressed={tab === 'sebaran'} onClick={() => setTab('sebaran')}>Sebaran</button>
                      <button type="button" className={tab === 'perubahan' ? 'is-active' : ''} aria-pressed={tab === 'perubahan'} onClick={() => setTab('perubahan')}>Perubahan</button>
                    </div>
                  </div>
                  {tab === 'sebaran' ? <SebaranJawabanChart
                    data={sebaran}
                     selectedKey={aktifKey}
                    onSelect={setSelectedKey}
                    onOpenDetail={onOpenInstrument}
                  /> : <PeriodHeatmap instrumen={laporan.instrumen} periode={filter.periode} selectedKey={aktifKey} onSelect={setSelectedKey} tampilkanSelisih={laporan.periodePembanding != null} />}
                </section>

                 <section className="dashboard__box dashboard__box--right" aria-label="Instrumen terpilih">
                  <StatistikPanel selectedKey={aktifKey} onOpenDetail={onOpenInstrument} laporan={laporan} />
                </section>
              </div>
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
}
