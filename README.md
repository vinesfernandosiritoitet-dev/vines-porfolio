# Portofolio — Vines Fernando

Portofolio web modern 2026 yang dibangun dengan React + Vite + Tailwind CSS. Tema biru–ungu di atas latar gelap dengan animasi premium.

## Fitur

- Navbar sticky dengan blur + scroll-spy + menu mobile
- Hero dengan typing animation, floating icons, tombol Download CV & Hubungi Saya
- Section Tentang (glass card, statistik)
- Section Skills (progress bar + ikon)
- Section Project (kartu dengan efek hover)
- Section Kontak (Email, WhatsApp, Instagram + form kirim pesan via WhatsApp)
- Footer lengkap + tombol kembali ke atas
- Tema gelap & terang, responsive
- Palet warna indigo–ungu dengan background gradien statis

## Teknologi

React · Vite · Tailwind CSS · AOS · React Icons

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

- **Foto profil:** ganti `src/assets/hero.png`.
- **CV:** `public/cv.pdf` dihasilkan dari `scripts/gen-cv.mjs` (`node scripts/gen-cv.mjs`).
- **Link project:** ubah href di `src/components/Projects.jsx`.
- **Kontak & sosmed:** ubah di `src/components/Hero.jsx`, `Contact.jsx`, `Footer.jsx`.
