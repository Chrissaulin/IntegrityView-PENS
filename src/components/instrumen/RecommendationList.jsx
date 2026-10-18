import './RecommendationList.css';

const PRIORITAS_CLASS = {
  'Tinggi': 'prioritas--tinggi',
  'Sedang': 'prioritas--sedang',
  'Pantau': 'prioritas--pantau'
};

/* Daftar rekomendasi. Baris 1 = label prioritas + judul, baris 2 = dasar data.
   Judul dan dasar data selalu tampil sebagai kalimat utuh (tanpa pemotongan).
   Varian `full` dipakai di modal "Lihat semua rekomendasi": tanpa tombol Detail. */
export default function RecommendationList({ items, max = 3, onDetail, compact = false, full = false }) {
  if (!items || !items.length) {
    return (
      <p className="reclist__empty">Tidak ada rekomendasi — seluruh indikator dalam batas wajar.</p>
    );
  }

  const shown = items.slice(0, max);

  return (
    <ul className={`reclist ${compact ? 'reclist--compact' : ''} ${full ? 'reclist--full' : ''}`}>
      {shown.map((r, i) => (
        <li key={i} className="reclist__item">
          <div className="reclist__row1">
            <span className={`reclist__prio ${PRIORITAS_CLASS[r.prioritas] || ''}`}>
              {r.prioritas}
            </span>
            <p className="reclist__teks">{r.teks}</p>
            {onDetail && !full && (
              <button
                type="button"
                className="reclist__detail"
                onClick={() => onDetail(r)}
                aria-label={`Detail rekomendasi: ${r.teks}`}
              >
                Detail
              </button>
            )}
          </div>
          <p className="reclist__dasar">Dasar data: {r.dasar}</p>
        </li>
      ))}
    </ul>
  );
}
