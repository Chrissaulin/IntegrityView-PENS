import { useEffect, useMemo, useState } from 'react';
import Sidebar from '../components/layout/Sidebar';
import Topbar from '../components/layout/Topbar';
import RingkasanCards from '../components/dashboard/RingkasanCards';
import SebaranJawabanChart from '../components/dashboard/SebaranJawabanChart';
import StatistikPanel from '../components/dashboard/StatistikPanel';
import { getRingkasanDashboard, getSebaranPerInstrumen, getUser } from '../data/mock';
import './Dashboard.css';

export default function Dashboard({ onBackToLanding, onNavigate, onOpenInstrument }) {
  const user = getUser();
  const [loading, setLoading] = useState(true);
  const [selectedKey, setSelectedKey] = useState(null);

  const ringkasan = useMemo(() => getRingkasanDashboard(), []);
  const sebaran = useMemo(() => getSebaranPerInstrumen(), []);

  useEffect(() => {
    const t = window.setTimeout(() => {
      setLoading(false);
      if (sebaran.length) setSelectedKey(sebaran[0].key);
    }, 500);
    return () => window.clearTimeout(t);
  }, [sebaran]);

  const handleMenu = (key) => {
    if (key === 'beranda') {
      if (onBackToLanding) onBackToLanding();
      return;
    }
    if (onNavigate) onNavigate(key);
  };

  return (
    <div className="app-shell">
      <Sidebar active="dashboard" onNavigate={handleMenu} user={user} />

      <div className="app-main">
        <Topbar user={user} notifCount={3} onProfil={() => handleMenu('profil')} />

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
              <RingkasanCards ringkasan={ringkasan} />

              <div className="dashboard__duo">
                <section className="dashboard__box dashboard__box--left" aria-labelledby="sebaran-title">
                  <div className="dashboard__box-head">
                    <div>
                      <p className="label-eyebrow">Distribusi Jawaban</p>
                      <h2 className="dashboard__box-title" id="sebaran-title">Sebaran Jawaban per Instrumen</h2>
                    </div>
                  </div>
                  <SebaranJawabanChart
                    data={sebaran}
                    selectedKey={selectedKey}
                    onSelect={setSelectedKey}
                    onOpenDetail={onOpenInstrument}
                  />
                </section>

                <section className="dashboard__box dashboard__box--right" aria-labelledby="statistik-title">
                  <div className="dashboard__box-head">
                    <div>
                      <p className="label-eyebrow">Analisis</p>
                      <h2 className="dashboard__box-title" id="statistik-title">Ringkasan Statistik & Rekomendasi</h2>
                    </div>
                  </div>
                  <StatistikPanel selectedKey={selectedKey} onOpenDetail={onOpenInstrument} />
                </section>
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
}
