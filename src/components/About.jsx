import {
  FiExternalLink,
  FiMapPin,
  FiCheckCircle,
  FiCompass,
  FiLayers,
  FiBookOpen,
  FiMail,
  FiUser,
  FiInstagram,
} from 'react-icons/fi'
import { FaWhatsapp } from 'react-icons/fa'

export default function About() {
  return (
    <section id="about" className="section bg-bg relative overflow-hidden">
      <div className="container">
        {/* Section Head */}
        <div className="section-head" data-aos="fade-up">
          <span className="section-eyebrow">Tentang Saya</span>
          <h2 className="section-title">Kenali Lebih Dekat</h2>
          <p className="section-sub">
            Dedikasi saya dalam merancang pengalaman digital yang memadukan keindahan visual dengan kemudahan pakai tingkat tinggi.
          </p>
        </div>

        {/* Main Content Grid */}
        <div className="grid items-start gap-12 lg:grid-cols-[1.2fr_0.8fr]">
          {/* Left: Biography & Actions */}
          <div data-aos="fade-up">
            <h3 className="mb-5 font-heading text-[clamp(1.4rem,2.5vw,1.85rem)] font-bold text-heading leading-snug">
              Halo, saya <span className="text-indigo">Vines Fernando</span>.
            </h3>

            <p className="mb-4 leading-relaxed text-mute text-[0.98rem]">
              Dulu, saya sama sekali tidak tahu apa itu <strong className="text-heading font-semibold">RPL (Rekayasa Perangkat Lunak)</strong>—bagaimana rasanya, apa yang dipelajari, dan apa yang akan saya hadapi. Saya hanyalah seorang anak kampung yang memiliki tekad besar untuk bisa berkembang dan mandiri. Setelah memutuskan untuk masuk ke <strong className="text-heading font-semibold">SMK Bagimu Negeriku</strong>, saya sempat merasa bingung: &ldquo;Ke depannya, saya mau jadi apa?&rdquo;
            </p>

            <p className="mb-4 leading-relaxed text-mute text-[0.98rem]">
              Namun, di tengah kebingungan dan pahitnya kehidupan, saya memilih untuk tidak menyerah dan tidak putus asa. Di sekolah inilah saya mulai belajar dari nol. Sedikit demi sedikit, saya mulai memahami ilmu yang diajarkan. Kini, rasa penasaran itu berbuah manis; saya sudah cukup menguasai bidang <strong className="text-heading font-semibold">Desain UI/UX</strong>.
            </p>

            <p className="mb-8 leading-relaxed text-mute text-[0.98rem]">
              Bukan hanya berhenti di situ, rasa haus akan ilmu membuat saya terus mengeksplorasi hal baru. Saat ini, saya juga sedang mendalami <strong className="text-heading font-semibold">Robotika</strong> dan <strong className="text-heading font-semibold">Front-End Development</strong>. Visi saya ke depan adalah bagaimana menggabungkan kemampuan UI/UX dengan coding Front-End ini untuk menciptakan tampilan website dan aplikasi yang tidak hanya berfungsi dengan baik, tetapi juga keren, estetik, dan menarik bagi pengguna.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-4">
              <a
                href="#contact"
                onClick={(e) => {
                  e.preventDefault()
                  document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })
                }}
                className="btn btn-primary"
              >
                Mulai Kolaborasi
              </a>
              <a
                href="/cv.pdf"
                target="_blank"
                rel="noreferrer"
                className="btn btn-outline"
                title="Buka CV Vines Fernando"
              >
                <FiExternalLink /> Buka CV
              </a>
            </div>
          </div>

          {/* Right: Premium Designer Identity Card */}
          <div
            className="card relative overflow-hidden p-6 sm:p-7 shadow-card lg:sticky lg:top-28"
            data-aos="fade-up"
            data-aos-delay="100"
          >
            {/* Designer Profile Header */}
            <div className="relative mb-5 flex items-center gap-4 border-b border-line pb-5">
              <div className="relative shrink-0 group/avatar">
                <img
                  src="/vines-photo.jpg"
                  alt="Vines Fernando"
                  className="h-20 w-20 rounded-2xl border-2 border-line bg-surface object-cover object-[55%_36%] shadow-sm transition-transform duration-300 group-hover/avatar:scale-105"
                />
                <span className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full border border-line bg-surface shadow-xs">
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 pulse-dot" />
                </span>
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <h4 className="truncate font-heading text-[1.25rem] font-extrabold text-heading">
                    Vines Fernando
                  </h4>
                  <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-line bg-bg-soft px-2.5 py-0.5 text-[0.7rem] font-bold text-mute">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 pulse-dot" />
                    Aktif
                  </span>
                </div>
                <p className="text-[0.78rem] font-bold uppercase tracking-wider text-indigo">
                  UI/UX Designer &amp; Front-End
                </p>
                <p className="mt-1 flex items-center gap-1.5 text-[0.76rem] font-medium text-mute">
                  <FiBookOpen className="shrink-0 text-indigo" />
                  <span className="truncate">SMK Bagimu Negeriku · RPL</span>
                </p>
              </div>
            </div>

              {/* Biodata & Identity Info Grid */}
              <div className="mb-4 rounded-2xl border border-line bg-bg-soft/80 p-3.5">
                <div className="flex items-center justify-between gap-2 border-b border-line/70 pb-2 text-[0.76rem]">
                  <span className="flex items-center gap-1.5 font-semibold text-mute">
                    <FiUser className="text-indigo" /> Nama Lengkap
                  </span>
                  <span className="font-heading font-bold text-heading text-right">
                    Vines Fernando Siritoitet
                  </span>
                </div>
                <div className="mt-2 flex items-center justify-between gap-2 text-[0.76rem]">
                  <span className="flex items-center gap-1.5 font-semibold text-mute">
                    <FiMail className="text-indigo" /> Email
                  </span>
                  <a
                    href="mailto:vinesfernandosiritoitet@gmail.com"
                    className="truncate font-semibold text-indigo hover:underline"
                  >
                    vinesfernandosiritoitet@gmail.com
                  </a>
                </div>
              </div>

              {/* 2x2 Bento Snapshot Grid */}
              <div className="mb-5 grid grid-cols-2 gap-3">
                <div className="group/cell rounded-xl border border-line bg-bg-soft/70 p-3.5 transition-all duration-250 hover:-translate-y-0.5 hover:border-indigo/40 hover:bg-surface hover:shadow-xs">
                  <div className="mb-1 flex items-center gap-1.5 text-[0.9rem] text-indigo">
                    <FiCompass className="transition-transform duration-300 group-hover/cell:rotate-45" />
                    <span className="text-[0.68rem] font-bold uppercase tracking-wider text-mute">
                      Fokus
                    </span>
                  </div>
                  <p className="font-heading text-[0.84rem] font-bold text-heading">
                    UI/UX, Web &amp; Robotika
                  </p>
                </div>

                <div className="group/cell rounded-xl border border-line bg-bg-soft/70 p-3.5 transition-all duration-250 hover:-translate-y-0.5 hover:border-indigo/40 hover:bg-surface hover:shadow-xs">
                  <div className="mb-1 flex items-center gap-1.5 text-[0.9rem] text-indigo">
                    <FiMapPin className="transition-transform duration-300 group-hover/cell:-translate-y-0.5" />
                    <span className="text-[0.68rem] font-bold uppercase tracking-wider text-mute">
                      Lokasi
                    </span>
                  </div>
                  <p className="font-heading text-[0.84rem] font-bold text-heading">
                    Indonesia
                  </p>
                </div>

                <div className="group/cell rounded-xl border border-line bg-bg-soft/70 p-3.5 transition-all duration-250 hover:-translate-y-0.5 hover:border-indigo/40 hover:bg-surface hover:shadow-xs">
                  <div className="mb-1 flex items-center gap-1.5 text-[0.9rem] text-indigo">
                    <FiLayers className="transition-transform duration-300 group-hover/cell:scale-110" />
                    <span className="text-[0.68rem] font-bold uppercase tracking-wider text-mute">
                      Tools
                    </span>
                  </div>
                  <p className="font-heading text-[0.84rem] font-bold text-heading">
                    Figma, React &amp; System
                  </p>
                </div>

                <div className="group/cell rounded-xl border border-line bg-bg-soft/70 p-3.5 transition-all duration-250 hover:-translate-y-0.5 hover:border-indigo/40 hover:bg-surface hover:shadow-xs">
                  <div className="mb-1 flex items-center gap-1.5 text-[0.9rem] text-emerald-500">
                    <FiCheckCircle className="transition-transform duration-300 group-hover/cell:scale-110" />
                    <span className="text-[0.68rem] font-bold uppercase tracking-wider text-mute">
                      Status
                    </span>
                  </div>
                  <p className="font-heading text-[0.84rem] font-bold text-heading">
                    Siap Proyek
                  </p>
                </div>
              </div>

              {/* Quick Identity Links */}
              <div className="mb-5 flex flex-wrap items-center gap-2">
                <a
                  href="https://wa.me/6285187169158"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-emerald-500/25 bg-emerald-500/10 px-3 py-2 text-[0.76rem] font-bold text-emerald-600 transition-colors hover:bg-emerald-500 hover:text-white"
                >
                  <FaWhatsapp className="text-[0.95rem]" /> WhatsApp
                </a>
                <a
                  href="https://instagram.com/saip.ul3446"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-rose-500/25 bg-rose-500/10 px-3 py-2 text-[0.76rem] font-bold text-rose-500 transition-colors hover:bg-rose-500 hover:text-white"
                >
                  <FiInstagram className="text-[0.9rem]" /> @saip.ul3446
                </a>
              </div>

              {/* Principle Quote Banner */}
              <div className="relative rounded-2xl border border-indigo/25 bg-linear-to-br from-indigo-soft/80 to-transparent p-4 transition-all duration-300 hover:border-indigo/45 hover:shadow-xs">
                <span className="mb-1 block text-[0.7rem] font-bold uppercase tracking-widest text-indigo">
                  Prinsip Hidup
                </span>
                <p className="text-[0.84rem] font-medium italic leading-relaxed text-heading">
                  &ldquo;Desain yang hebat bukan sekadar soal estetika, melainkan bagaimana ia mampu menyelesaikan masalah dan mempermudah hidup orang lain.&rdquo;
                </p>
              </div>
          </div>
        </div>
      </div>
    </section>
  )
}
