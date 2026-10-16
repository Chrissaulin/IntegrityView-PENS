import './RingkasanCards.css';
import { formatAngka } from '../../data/mock';

export default function RingkasanCards({ ringkasan }) {
  const r = ringkasan;
  const deltaClass = r.delta > 0 ? 'badge-up' : r.delta < 0 ? 'badge-down' : 'badge-flat';
  const deltaArrow = r.delta > 0 ? 'Naik' : r.delta < 0 ? 'Turun' : 'Datar';

  return (
    <div className="ringkasan-cards">
      <article className="rcard">
        <p className="rcard__eyebrow">Total Instrumen</p>
        <div className="rcard__num">{r.totalInstrumen}</div>
        <ul className="rcard__detail">
          <li><span className="rcard__detail-key">Layanan</span><span>{r.kelompok.layanan.join(', ')}</span></li>
          <li><span className="rcard__detail-key">Internal</span><span>{r.kelompok.internal.join(', ')}</span></li>
        </ul>
        <p className="rcard__sub">{r.riil} instrumen berdata riil, {r.simulasi} data simulasi</p>
      </article>

      <article className="rcard">
        <p className="rcard__eyebrow">Jumlah Responden</p>
        <div className="rcard__num">{r.responden.total.toLocaleString('id-ID')}</div>
        <ul className="rcard__detail">
          <li><span className="rcard__detail-key">Dosen</span><span>{r.responden.dosen.toLocaleString('id-ID')} responden</span></li>
          <li><span className="rcard__detail-key">Tenaga Kependidikan</span><span>{r.responden.tendik.toLocaleString('id-ID')} responden</span></li>
        </ul>
        <p className="rcard__sub">Responden unik berdasarkan email di seluruh instrumen</p>
      </article>

      <article className="rcard">
        <p className="rcard__eyebrow">Rata-rata Skor ZI</p>
        <div className="rcard__num">
          {formatAngka(r.rataSkor)}<span className="rcard__unit">%</span>
        </div>
        <ul className="rcard__detail">
          <li>
            <span className="rcard__detail-key">Interval 95%</span>
            <span>{formatAngka(r.ci.bawah)}% – {formatAngka(r.ci.atas)}%</span>
          </li>
          <li>
            <span className="rcard__detail-key">vs periode lalu</span>
            <span className={`badge ${deltaClass}`}>
              {deltaArrow} {formatAngka(Math.abs(r.delta))} poin
            </span>
          </li>
        </ul>
        <p className="rcard__sub">Indeks = total skor aktual / total skor maksimal × 100</p>
      </article>
    </div>
  );
}
