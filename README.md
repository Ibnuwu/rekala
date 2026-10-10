# REKALA — Layanan Arsip Digital | OJT Skillhub Kemnaker

> **Tagline:** *REKALA - Reka Waktu, Hidupkan Sejarah.*  
> **Subjudul:** *ARSIP DIGITAL FOTO SEJARAH PROVINSI BANTEN*

REKALA adalah platform layanan arsip digital foto sejarah Provinsi Banten yang dirancang untuk menghubungkan koleksi foto bersejarah fisik di Dinas Perpustakaan dan Kearsipan Provinsi Banten dengan eksplorasi digital interaktif melalui pemindaian kode QR.

---

## 🏛️ Kategori Arsip

Koleksi arsip digital REKALA diklasifikasikan ke dalam 3 kategori utama:
1. **Peristiwa**: Momen dan kejadian penting dalam sejarah Banten.
2. **Bangunan**: Gedung, situs, dan bangunan bersejarah di Banten.
3. **Tokoh**: Sosok yang berperan dalam perjalanan sejarah Banten.

---

## 🚀 Fitur Utama

- **Pemindai QR Interaktif (`/scan`)**: Pemindai kode QR kamera dengan reticle laser, dukungan senter (*torch*), audio chime feedback, dan fallback input manual ID arsip.
- **Galeri Foto (`/galeri`)**: Filter kategori instan (Peristiwa, Bangunan, Tokoh), pencarian multi-bidang, penyortiran, dan sinkronisasi parameter URL (`?kategori=...`).
- **Detail Arsip Digital (`/arsip/[id]`)**: Tampilan resolusi tinggi dengan mode pembesar layar penuh (*lightbox zoom*), rincian metadata kearsipan, narasi sejarah, dan tautan berbagi.
- **Panduan Pengunjung (`/panduan`)**: Tata cara interaksi dan pemindaian kode QR serta FAQ kearsipan.
- **Tentang REKALA (`/about`)**: Uraian filosofi nama (*Reka + Kala* & *Re- + Kala*), profil struktur tim 7 anggota, dan apresiasi mitra kolaborasi.

---

## 🛠️ Teknologi yang Digunakan

- **Framework**: Next.js (App Router, Server Components & Static Site Generation)
- **Bahasa**: TypeScript
- **Styling**: Tailwind CSS & CSS Design Tokens (Dark Obsidian & Light Off-White)
- **Deployment**: Static Export / Standalone

---

## 💻 Menjalankan Proyek Secara Lokal

```bash
# Menjalankan server pengembangan lokal
npm run dev

# Membangun produksi (Static Pre-rendering)
npm run build

# Menjalankan hasil build produksi
npm start
```
