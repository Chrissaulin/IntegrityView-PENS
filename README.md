# IntegrityView — frontend2 (Bento Dashboard Theme)

Theme 2 dari IntegrityView: dashboard + landing page dengan bahasa visual **bento grid** (kartu rounded-24, blob dekoratif, sidebar ikon gelap, aksen oranye brand).

Stack: **React 19 + Vite**, vanilla CSS dengan CSS variables (`src/styles/tokens.css`).

## Jalankan

```bash
npm install
npm run dev
```

Buka URL yang muncul (default `http://localhost:5173`).

## Build

```bash
npm run build
npm run preview
```

## Struktur

```
frontend2/
├── index.html
├── public/
│   └── pens.jpeg                 <- hero landing (dari frontend/assets/img)
├── src/
│   ├── styles/
│   │   ├── tokens.css            <- CSS variables warna §2 DESIGN2.md
│   │   └── globals.css
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Sidebar.jsx       <- icon-only, tooltip on-hover
│   │   │   ├── Topbar.jsx        <- greeting personal, search, jam live
│   │   │   └── BentoGrid.jsx     <- 12 kolom grid + span helper
│   │   ├── cards/
│   │   │   ├── StatCard.jsx      <- kartu putih / navy + blob
│   │   │   ├── HighlightCard.jsx <- kartu oranye solid (CTA)
│   │   │   ├── SoftStatCard.jsx  <- kartu peach progress bar
│   │   │   ├── ChartCard.jsx     <- line chart SVG + tooltip hover
│   │   │   ├── AddNewCard.jsx    <- dashed "tambah survei"
│   │   │   └── cards.css
│   │   └── tables/
│   │       └── ReportsTable.jsx  <- filter status, sort, klik-detail
│   ├── pages/
│   │   ├── LandingPage.jsx       <- hero foto + mini bento preview
│   │   └── Dashboard.jsx         <- bento interaktif (2 mode view)
│   ├── data/
│   │   └── mock.js               <- data simulasi
│   ├── App.jsx
│   └── main.jsx
└── README.md
```

## Interaksi Dashboard

- **Search topbar** memfilter tabel "Pengaduan Terbaru" secara live (kode, judul, kategori).
- **Tab Ringkasan / Per Instrumen** mengganti mode tampilan.
- **Chart mingguan**: hover titik mana pun → tooltip tanggal + nilai.
- **Tabel**: filter pill status, klik baris → panel detail, klik header "Tanggal" → toggle sort.
- **HighlightCard "Salin Link Survei"** menyalin link ke clipboard + toast konfirmasi.
- **Jam topbar** update tiap 30 detik.
- **Landing hero**: foto `pens.jpeg` dengan scrim, 3 kartu bento mengambang dengan efek parallax saat scroll.
- **Sidebar** collapse menjadi bottom-nav di mobile (≤ 900px).

## Catatan desain

Mengikuti `DESIGN2.md`:
- Palet navy `#0B1B33` + oranye `#F5843C`, teal `#2FB8A6` hanya untuk trend naik + garis benchmark.
- Card radius 24px, shadow soft, blob SVG opacity 14% di pojok.
- Merah `#DC4C4C` hanya untuk indikator peringatan, tidak untuk status data.
- Semua angka adalah **data simulasi**.
