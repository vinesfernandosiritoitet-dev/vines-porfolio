import {
  FiArrowRight,
  FiMail,
  FiInstagram,
  FiExternalLink,
} from 'react-icons/fi'
import { FaWhatsapp } from 'react-icons/fa'
import KokardeLanyard from './KokardeLanyard'

const SOCIALS = [
  { href: 'mailto:vinesfernandosiritoitet@gmail.com', label: 'Email', Icon: FiMail },
  { href: 'https://wa.me/6285187169158?text=Halo%20Vines%2C%20saya%20tertarik%20bekerjasama%20untuk%20proyek%20UI%2FUX!', label: 'WhatsApp', Icon: FaWhatsapp },
  { href: 'https://instagram.com/saip.ul3446', label: 'Instagram', Icon: FiInstagram },
]

const STATS = [
  { num: '4', label: 'Keahlian Inti' },
  { num: '100%', label: 'Fokus Pengguna' },
]

export default function Hero() {
  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section id="home" className="relative overflow-x-clip bg-bg pt-24 pb-0 lg:pt-18 lg:pb-0 min-h-screen flex flex-col justify-between">
      {/* Background Foto Hitam & Putih (Tampak Jelas, Lebar & Penuh Hingga Dasar Layar) */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <img
          src="/vines-photo.jpg"
          alt="Background Vines Fernando S"
          className="h-full w-full object-cover object-[70%_25%] opacity-85 sm:opacity-90 dark:opacity-65 filter grayscale contrast-140 brightness-120 scale-110 transition-all duration-700"
        />
        {/* Gradiasi halus: menjaga teks sebelah kiri tetap terbaca sempurna */}
        <div className="absolute inset-0 bg-linear-to-r from-bg/95 via-bg/35 via-45% to-transparent" />
      </div>

      {/* Background ambient lighting */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 grid-lines opacity-30" />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-24 top-28 h-90 w-90 rounded-full blur-3xl animate-float-slow"
          style={{ background: 'radial-gradient(circle,rgba(37,99,235,0.14),transparent 70%)' }}
      />

      <div className="container relative my-auto grid items-start gap-12 lg:grid-cols-[1.1fr_1fr] xl:gap-14 pb-12 lg:pb-16">
        {/* Left Column: Text & Hero CTA */}
        <div className="z-10 lg:pt-14">
          {/* Sapaan: Halo, saya */}
          <p className="anim-enter font-heading text-[1.05rem] font-medium tracking-wide text-mute">
            Halo, saya
          </p>

          {/* Nama: Vines Fernando S */}
          <h1 className="anim-enter anim-delay-1 mt-1 font-heading text-[clamp(2.75rem,5.5vw,4.5rem)] font-extrabold tracking-tight text-heading leading-[1.08]">
            Vines{' '}
            <span className="animate-gradient-text bg-linear-to-r from-indigo via-indigo-light to-indigo-dark bg-clip-text text-transparent">
              Fernando S
            </span>
          </h1>

          {/* Profesi: UI/UX DESIGNER */}
          <div className="anim-enter anim-delay-2 mt-2 inline-block">
            <span className="font-heading text-[clamp(1rem,2vw,1.25rem)] font-bold uppercase tracking-[0.2em] text-indigo">
              UI/UX DESIGNER
            </span>
          </div>

          {/* Tagline */}
          <h2 className="anim-enter anim-delay-3 mt-4 font-heading text-[clamp(1.35rem,2.5vw,1.95rem)] font-bold leading-[1.3] text-heading">
            Saya percaya desain yang hebat adalah desain yang{' '}
            <span className="text-indigo">
              mempermudah hidup
            </span>{' '}
            orang lain.
          </h2>

          {/* Deskripsi kemampuan desain UI/UX */}
          <p className="anim-enter anim-delay-4 mt-5 max-w-135 text-[0.98rem] leading-relaxed text-mute">
            Mari kita wujudkan ide bisnis Anda menjadi pengalaman digital yang sederhana, menarik, dan bermakna. Saya siap berkolaborasi menciptakan antarmuka web &amp; mobile yang membuat pengguna betah dan bisnis Anda melesat.
          </p>

          {/* Buttons: Lihat Project, Hubungi Saya & Buka CV */}
          <div className="anim-enter anim-delay-5 mt-8 flex flex-wrap items-center gap-4">
            <button
              type="button"
              className="btn btn-primary group shadow-button"
              onClick={() => scrollTo('projects')}
            >
              Lihat Project{' '}
              <FiArrowRight className="transition-transform duration-200 group-hover:translate-x-1.5" />
            </button>
            <button
              type="button"
              className="btn btn-outline"
              onClick={() => scrollTo('contact')}
            >
              Hubungi Saya
            </button>
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

          {/* Social Icons */}
          <div className="anim-enter anim-delay-5 mt-8 flex items-center gap-3">
            <span className="text-[0.78rem] font-bold uppercase tracking-wider text-mute mr-1">
              Terhubung:
            </span>
            {SOCIALS.map(({ href, label, Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noreferrer"
                aria-label={label}
                title={label}
                className="grid h-10 w-10 place-items-center rounded-xl border border-line bg-surface text-[1rem] text-mute transition-all duration-250 hover:-translate-y-1.5 hover:scale-105 hover:border-indigo hover:bg-indigo-soft hover:text-indigo shadow-sm"
              >
                <Icon />
              </a>
            ))}
          </div>

          {/* Stats Bar */}
          <div className="anim-enter anim-delay-6 mt-9 grid max-w-80 grid-cols-2 gap-6 border-t border-line pt-6">
            {STATS.map(({ num, label }) => (
              <div key={label} className="group transition-transform duration-200 hover:-translate-y-0.5">
                <p className="font-heading text-[1.6rem] font-extrabold text-heading transition-colors group-hover:text-indigo">{num}</p>
                <p className="text-[0.76rem] font-medium text-mute">{label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Animasi Kokarde (Lanyard ID Badge Jatuh dari Atas) */}
        <div className="relative mx-auto flex w-full max-w-110 items-center justify-center lg:max-w-none lg:pl-24 xl:pl-28 lg:-mt-12 z-20">
          <KokardeLanyard />
        </div>
      </div>
    </section>
  )
}
