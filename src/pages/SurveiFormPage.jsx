import { useMemo, useState } from 'react';
import { getButirSurvei, saveResponse } from '../data/mock';
import './SurveiFormPage.css';

const LIKERT = [
  { value: 4, label: 'Sangat Setuju' },
  { value: 3, label: 'Setuju' },
  { value: 2, label: 'Tidak Setuju' },
  { value: 1, label: 'Sangat Tidak Setuju' }
];

export default function SurveiFormPage({ surveiKey, onBack, onSelesai }) {
  const data = useMemo(() => getButirSurvei(surveiKey), [surveiKey]);
  const [step, setStep] = useState(0);
  const [jawaban, setJawaban] = useState({});
  const [errors, setErrors] = useState({});
  const [sukses, setSukses] = useState(false);

  if (!data) {
    return (
      <div className="sform sform--empty">
        <p>Instrumen tidak ditemukan.</p>
        <button type="button" className="btn btn-outline-navy" onClick={onBack}>Kembali ke Pusat Survei</button>
      </div>
    );
  }

  const totalButir = data.butir.length;
  const perStep = Math.ceil(totalButir / data.langkah.length);
  const langkahAktual = Math.ceil(totalButir / perStep);

  const butirPerStep = [];
  for (let s = 0; s < langkahAktual; s++) {
    butirPerStep.push(data.butir.slice(s * perStep, (s + 1) * perStep));
  }

  const idxGlobal = (s, i) => s * perStep + i;
  const terjawab = Object.keys(jawaban).length;
  const pct = Math.round((terjawab / totalButir) * 100);

  const pilihJawaban = (idx, val) => {
    setJawaban({ ...jawaban, [idx]: val });
    setErrors({ ...errors, [idx]: undefined });
  };

  const validasiStep = (s) => {
    const err = {};
    butirPerStep[s].forEach((_, i) => {
      const idx = idxGlobal(s, i);
      if (jawaban[idx] == null) err[idx] = 'Pilih salah satu jawaban.';
    });
    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const next = () => {
    if (!validasiStep(step)) return;
    setStep(Math.min(langkahAktual - 1, step + 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const prev = () => {
    setStep(Math.max(0, step - 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const submit = (e) => {
    e.preventDefault();
    if (!validasiStep(step)) return;
    const arr = data.butir.map((_, i) => jawaban[i]);
    saveResponse(surveiKey, arr);
    setSukses(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (sukses) {
    return (
      <div className="sform">
        <div className="sform__success">
          <span className="sform__success-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" width="30" height="30" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
              <path d="m5 13 4 4L19 7" />
            </svg>
          </span>
          <h2 className="sform__success-title">Jawaban tersimpan</h2>
          <p className="sform__success-text">
            Terima kasih. Respons {data.nama} Anda tercatat di peramban ini dan progres di Pusat Survei telah diperbarui.
          </p>
          <button type="button" className="btn btn-primary" onClick={onSelesai}>
            Kembali ke Pusat Survei
          </button>
        </div>
      </div>
    );
  }

  const isLast = step === langkahAktual - 1;

  return (
    <div className="sform">
      {/* Step header */}
      <div className="sform__stephead">
        <div className="sform__dots">
          {Array.from({ length: langkahAktual }, (_, i) => (
            <span
              key={i}
              className={`sform__dot ${i === step ? 'is-active' : ''} ${i < step ? 'is-done' : ''}`}
              aria-current={i === step ? 'step' : undefined}
            >
              {i < step ? (
                <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m5 13 4 4L19 7" />
                </svg>
              ) : (i + 1)}
            </span>
          ))}
        </div>
        <div className="sform__progress" role="progressbar" aria-valuenow={pct} aria-valuemin="0" aria-valuemax="100">
          <span style={{ width: pct + '%' }} />
        </div>
        <span className="sform__steplabel">Langkah {step + 1} dari {langkahAktual} · {terjawab}/{totalButir} terjawab</span>
      </div>

      <header className="sform__head">
        <p className="label-eyebrow">{data.nama}</p>
        <h1 className="sform__title">{data.namaPanjang}</h1>
        <p className="sform__sub">{totalButir} pertanyaan, {langkahAktual} langkah. Jawaban tersimpan di peramban ini, tidak dikirim ke server.</p>
      </header>

      <form className="sform__card" onSubmit={submit} noValidate>
        <h2 className="sform__step-title">
          Langkah {step + 1}: {data.langkah[step] || 'Bagian ' + (step + 1)}
        </h2>

        {butirPerStep[step].map((nama, i) => {
          const idx = idxGlobal(step, i);
          const err = errors[idx];
          return (
            <fieldset key={idx} className={`sform__field ${err ? 'has-error' : ''}`}>
              <legend className="sform__question">
                {idx + 1}. {nama} <span className="sform__req" aria-label="wajib">*</span>
              </legend>
              <div className="sform__likert" role="radiogroup" aria-label={nama}>
                {LIKERT.map((l) => {
                  const checked = jawaban[idx] === l.value;
                  return (
                    <label
                      key={l.value}
                      className={`sform__option ${checked ? 'is-checked' : ''}`}
                    >
                      <input
                        type="radio"
                        name={`q${idx}`}
                        value={l.value}
                        checked={checked}
                        onChange={() => pilihJawaban(idx, l.value)}
                      />
                      <span className="sform__option-dot" aria-hidden="true" />
                      <span className="sform__option-label">{l.label}</span>
                    </label>
                  );
                })}
              </div>
              {err && <p className="sform__error">{err}</p>}
            </fieldset>
          );
        })}

        <div className="sform__actions">
          {step > 0 ? (
            <button type="button" className="btn btn-outline-navy" onClick={prev}>Kembali</button>
          ) : (
            <button type="button" className="btn btn-outline-navy" onClick={onBack}>Batal</button>
          )}
          {isLast ? (
            <button type="submit" className="btn btn-primary">Kirim Jawaban</button>
          ) : (
            <button type="button" className="btn btn-primary" onClick={next}>Lanjut</button>
          )}
        </div>
      </form>
    </div>
  );
}
