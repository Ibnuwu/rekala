# Dokumentasi Perbaikan & Pembaruan Sistem (FIXES.md)

Dokumen ini merangkum seluruh temuan audit, akar penyebab masalah, perbaikan yang telah diterapkan, serta panduan pemeliharaan sistem pada proyek **REKALA (Platform Arsip Digital | OJT Skillhub Kemnaker)**.

---

## 1. Ringkasan Perubahan Utama

### A. Konsolidasi Kategori Arsip (3 Kategori Baku)
- **Kategori Baru**:
  1. `Peristiwa`: "Momen dan kejadian penting dalam sejarah Banten."
  2. `Bangunan`: "Gedung, situs, dan bangunan bersejarah di Banten."
  3. `Tokoh`: "Sosok yang berperan dalam perjalanan sejarah Banten."
- **Single Source of Truth**: Didefinisikan pada [`src/data/categories.ts`](file:///f:/NunuU/rekala/src/data/categories.ts) dengan tipe union terikat (`'peristiwa' | 'bangunan' | 'tokoh'`).
- **Sinkronisasi URL**: Halaman Galeri ([`/galeri`](file:///f:/NunuU/rekala/src/app/galeri/page.tsx)) kini menyinkronkan parameter URL `?kategori=peristiwa|bangunan|tokoh` secara dua arah dengan filter chips dan pencarian instan.
- **Bagian Beranda**: Ditambahkan seksi editorial *"Telusuri Berdasarkan Kategori"* dengan tipografi serif, numeral `01/02/03`, deskripsi netral, jumlah arsip, dan pembatas hairline (*hairline dividers*).

### B. Koreksi Branding & Identitas Proyek
- **Identitas Resmi**: `"REKALA — Platform Arsip Digital | OJT Skillhub Kemnaker"`
- **Tagline Utama**: `"REKALA: Mereka Waktu, Menghidupkan Sejarah."`
- **Subtitle Wordmark**: `"ARSIP DIGITAL FOTO SEJARAH PROVINSI BANTEN"`
- **Pembersihan Kata Kunci**: Seluruh penyebutan istilah lama *"Magang"* telah dibersihkan 100% dari seluruh repositori.
- **Apresiasi Kolaborasi**: Bagian *"Ucapan Terima Kasih"* pada halaman Tentang mencantumkan Kemnaker, BBPVP Serang, dan Dinas Perpustakaan dan Kearsipan Provinsi Banten.

### C. Pembaruan Halaman Tentang (`/about`)
1. **Seksi Filosofi Nama REKALA**:
   - Menjelaskan makna etimologis dan kontekstual dari dua perspektif:
     - `Reka + Kala`: Menyusun, merancang, dan memberi bentuk narasi atas rekaman peristiwa masa lalu.
     - `Re- + Kala`: Mengulang dan menghidupkan kembali jejak sejarah melalui teknologi modern.
   - Dilengkapi *pull-quote* tagline utama bernuansa tipografi editorial museum.
2. **Seksi Struktur Tim**:
   - Menampilkan 7 anggota dalam 3 seksi kerja (`Seksi Developer`, `Seksi Kearsipan`, `Seksi Dokumentasi`) berdasarkan dataset terstruktur [`src/data/team.ts`](file:///f:/NunuU/rekala/src/data/team.ts).
   - Layout responsif bergantian (*alternating*) pada desktop dan tertumpuk rapi pada perangkat seluler.

### D. Redesain Footer
- Tipografi arang (*charcoal* `#1F1C18`) dengan wordmark berukuran masif dan proporsional (fluid typography clamp).
- Grid 12 kolom yang memisahkan identitas inisiatif dengan navigasi cepat.
- Tautan jangkar aksesibel *"Kembali ke atas"* tanpa dependensi JavaScript tambahan.

### E. Optimasi Navigasi & Pemindai QR
- **Navigasi Seluler**: Panel menu mobile menggunakan skala z-index terisolasi (`z-40` / `z-50`), kunci scroll yang aman, dan transisi `opacity`/`visibility` sehingga tidak pernah menghalangi klik (*pointer-events intercept*) saat ditutup.
- **Pemindai QR**: Menambahkan validasi ID arsip manual dengan pesan kesalahan inline aksesibel, tombol senter (*torch*) untuk kamera pendukung, dan audio feedback sintetis via Web Audio API.

---

## 2. Akar Masalah & Solusi Teknis (Root Causes & Solutions)

| Komponen / Fitur | Gejala / Isu Awal | Akar Masalah (Root Cause) | Solusi yang Diterapkan |
| :--- | :--- | :--- | :--- |
| **Google Fonts Build** | Build error `Turbopack build failed: Failed to fetch Inter/Newsreader` | `next/font/google` memblokir kompilasi saat offline/sandbox tanpa koneksi luar ke `fonts.googleapis.com`. | Memindahkan pemuatan webfont ke tag `<link>` pada `<head>` dengan fallback stack CSS yang solid (`Newsreader`, `Georgia`, `Inter`, `system-ui`). |
| **Mobile Menu Overlay** | Navigasi halaman terkadang tidak dapat diklik atau tertutup elemen transparan. | Elemen drawer mobile yang ditutup tanpa `pointer-events-none` atau `invisible` tetap mencegat event pointer mouse/touch. | Menerapkan transisi state eksplisit dengan kelas Tailwind `opacity-100 pointer-events-auto visible` dan `opacity-0 pointer-events-none invisible`. |
| **Manual Input Scan** | Pengguna yang mengetik ID salah tidak mendapat feedback visual yang jelas. | Penanganan manual input hanya mencoba navigasi tanpa validasi dataset lokal. | Menambahkan validasi keberadaan ID arsip dan menampilkan notifikasi kesalahan inline (`aria-invalid="true"`). |
| **Layout Shift Filter** | Filter kategori berpindah posisi atau menyebabkan pergeseran horizontal pada layar kecil. | Penggunaan kategori yang terlalu banyak (6 kategori) pada baris sempit. | Konsolidasi menjadi 3 kategori ringkas (`Peristiwa`, `Bangunan`, `Tokoh`) yang pas dalam 1 baris di viewport 320px–414px. |

---

## 3. Panduan Pemeliharaan (Maintenance Guide)

### Cara Mengganti / Menyesuaikan Foto Tim
1. Simpan file foto kelompok berorientasi landscape (rasio 4:3 atau 3:2, resolusi ~1200x800px, ukuran <200 KB) ke dalam direktori:
   - `public/team/developer.jpg`
   - `public/team/kearsipan.jpg`
   - `public/team/dokumentasi.jpg`
2. Ubah nama anggota dan peran pada berkas [`src/data/team.ts`](file:///f:/NunuU/rekala/src/data/team.ts).

### Cara Menambah / Mengedit Data Arsip
1. Buka berkas [`src/data/archives.ts`](file:///f:/NunuU/rekala/src/data/archives.ts).
2. Tambahkan objek arsip baru dengan menyertakan `category` yang valid (`'Peristiwa' | 'Bangunan' | 'Tokoh'`).
3. Sistem secara otomatis akan menggenerasi halaman statis (`/arsip/[id]`), memperbarui galeri, dan menghitung total dokumen per kategori.
