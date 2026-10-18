import './InfoTip.css';

export default function InfoTip({ teks, label = 'Informasi' }) {
  return <span className="info-tip" tabIndex={0} aria-label={`${label}: ${teks}`} data-tip={teks}>i</span>;
}
