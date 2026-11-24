import { Link } from 'react-router-dom'
import { FiHome, FiArrowLeft, FiCompass } from 'react-icons/fi'

export default function NotFound() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-bg px-6 py-20 text-heading">
      {/* Background ambient lighting */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-40 top-1/4 h-125 w-125 rounded-full blur-3xl"
          style={{ background: 'radial-gradient(circle,rgba(98,88,245,0.12),transparent 70%)' }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-40 bottom-1/4 h-112.5 w-112.5 rounded-full blur-3xl"
          style={{ background: 'radial-gradient(circle,rgba(155,168,255,0.14),transparent 70%)' }}
      />

      <div className="relative z-10 mx-auto max-w-lg text-center" data-aos="fade-up">
        {/* 404 Icon & Large Number */}
        <div className="mb-6 inline-flex items-center justify-center">
          <span className="grid h-20 w-20 place-items-center rounded-3xl border border-indigo/30 bg-indigo-soft text-[2.5rem] text-indigo shadow-sm">
            <FiCompass />
          </span>
        </div>

        <h1 className="font-heading text-[clamp(4.5rem,10vw,7rem)] font-extrabold tracking-tight text-heading leading-none">
          4<span className="text-indigo">0</span>4
        </h1>

        <h2 className="mt-3 font-heading text-[clamp(1.4rem,3vw,1.85rem)] font-bold text-heading">
          Halaman Tidak Ditemukan
        </h2>

        <p className="mt-4 text-[0.95rem] leading-relaxed text-mute">
          Maaf, tautan atau halaman yang Anda cari tidak tersedia, telah dipindahkan, atau alamat URL yang dimasukkan keliru.
        </p>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3.5">
          <Link to="/" className="btn btn-primary">
            <FiHome /> Kembali ke Beranda
          </Link>
          <button
            type="button"
            onClick={() => window.history.back()}
            className="btn btn-outline"
          >
            <FiArrowLeft /> Halaman Sebelumnya
          </button>
        </div>

        <p className="mt-10 text-[0.78rem] text-slate-500">
          Vines Fernando Personal Portfolio &copy; 2026
        </p>
      </div>
    </main>
  )
}
