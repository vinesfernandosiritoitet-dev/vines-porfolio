# Portofolio — Vines Fernando

Portfolio web modern untuk **UI/UX Designer** yang dibangun dengan **React + Vite + Tailwind CSS 4**. Desain premium **dark-first** dengan palet **navy — indigo**, grid background, glassmorphism, animasi halus, dan case study lengkap.

## Fitur

- **Tema gelap sebagai default** dengan toggle terang/gelap
- **Navbar** fixed dengan blur, scroll-spy, scroll progress bar, CTA *Hubungi Saya*, dan menu mobile
- **Hero** dark dengan grid lines, badge *Tersedia untuk freelance*, stats, foto dengan kartu melayang
- **Tools marquee** — strip logo tools berjalan tanpa henti
- **Tentang** — cerita singkat, chip keahlian, quick info, dan tombol Unduh CV
- **Keahlian** — 8 kartu kemampuan bersih tanpa progress bar
- **Proyek** — layout bento dengan kartu featured, preview mockup CSS/SVG (Ayomasak, Pandawa Store, School Assignment App, Car Service App)
- **Case Study** (`/case-study/:id`) — 9 bagian: Overview → Problem → User Research → User Persona → User Flow → Wireframe → UI Design → Prototype → Final Result, dengan TOC sticky
- **Proses Desain** — visual 7 langkah proses kerja
- **Testimoni** — kartu soscial proof dari klien (data di `src/data/testimonials.js`)
- **FAQ** — accordion pertanyaan umum (data di `src/data/faq.js`)
- **Kontak** — Email, WhatsApp, Instagram, LinkedIn + CTA *Chat via WhatsApp*
- **Footer** multi-kolom ala web bisnis (brand, navigasi, kontak, sosmed)
- Responsive, admin login untuk menambah project (rute `/admin`)

## Teknologi

React · Vite · Tailwind CSS 4 · AOS · React Icons · React Router

## Menjalankan

```bash
npm install
npm run dev
```

Build produksi:

```bash
npm run build
npm run preview
```

## Kustomisasi

- **Foto profil:** ganti `src/assets/hero.png` atau lewat tombol *Ganti Foto*.
- **CV:** `public/cv.pdf` dihasilkan dari `scripts/gen-cv.mjs` (`node scripts/gen-cv.mjs`).
- **Data project & case study:** edit `src/data/projects.js`.
- **Testimoni & FAQ:** edit `src/data/testimonials.js` dan `src/data/faq.js`.
- **Kontak & sosmed:** ubah di `src/components/Contact.jsx`, `Hero.jsx`, `Footer.jsx`.
- **Admin:** atur username/password di `.env` (`VITE_ADMIN_USERNAME`, `VITE_ADMIN_PASSWORD`).