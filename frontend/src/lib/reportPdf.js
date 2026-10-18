import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

/* Render elemen DOM laporan menjadi PDF A4 multi-halaman.
   Tiap .rt__page dirender terpisah, lalu ditempel per halaman agar konten
   tidak terpotong di tengah — setiap halaman laporan = satu halaman PDF. */
export async function unduhLaporanPdf(element, namaFile) {
  const pages = element.querySelectorAll('.rt__page');
  const pdf = new jsPDF({ unit: 'pt', format: 'a4', orientation: 'portrait' });
  const pageW = pdf.internal.pageSize.getWidth();
  const pageH = pdf.internal.pageSize.getHeight();

  for (let i = 0; i < pages.length; i++) {
    const canvas = await html2canvas(pages[i], {
      scale: 2,
      backgroundColor: '#FFFFFF',
      useCORS: true,
      logging: false
    });
    const img = canvas.toDataURL('image/jpeg', 0.95);

    if (i > 0) pdf.addPage();

    /* Sesuaikan lebar gambar ke lebar halaman, jaga rasio. */
    const rasio = canvas.height / canvas.width;
    let w = pageW;
    let h = w * rasio;
    if (h > pageH) {
      h = pageH;
      w = h / rasio;
    }
    const offsetX = (pageW - w) / 2;
    pdf.addImage(img, 'JPEG', offsetX, 0, w, h);
  }

  pdf.save(namaFile);
}

export function namaFileLaporan(namaInstrumen, periode) {
  const bersih = String(namaInstrumen).replace(/[^\w]+/g, '');
  const periodeSingkat = String(periode).replace(/[^\w]+/g, '');
  return `IntegrityView-${bersih}-${periodeSingkat}.pdf`;
}
