import { FiArrowUp, FiHeart, FiInstagram, FiMail } from 'react-icons/fi'
import { FaGithub, FaWhatsapp } from 'react-icons/fa'

export default function Footer() {
  const go = (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })

  return (
    <footer className="relative z-[1] border-t border-line bg-footer-bg py-12 pb-24">
      <div className="container flex flex-col items-center gap-5 text-center">
        <button
          type="button"
          className="border-none bg-transparent font-heading text-[1.7rem] font-bold text-heading"
          onClick={() => go('home')}
        >
          VF<span className="text-purple-light">.</span>
        </button>

        <ul className="flex flex-wrap justify-center gap-x-6 gap-y-2">
          {[
            ['home', 'Beranda'],
            ['about', 'Tentang'],
            ['skills', 'Skills'],
            ['projects', 'Project'],
            ['contact', 'Kontak'],
          ].map(([id, label]) => (
            <li key={id}>
              <button
                type="button"
                className="border-none bg-transparent text-[0.9rem] font-semibold text-mute transition-colors hover:text-purple-light"
                onClick={() => go(id)}
              >
                {label}
              </button>
            </li>
          ))}
        </ul>

        <div className="flex gap-3">
          {[
            {
              href: 'mailto:vinesfernandosiritoitet@gmail.com',
              label: 'Email',
              Icon: FiMail,
            },
            {
              href: 'https://wa.me/6285187169158',
              label: 'WhatsApp',
              Icon: FaWhatsapp,
            },
            {
              href: 'https://instagram.com/saip.ul3446',
              label: 'Instagram',
              Icon: FiInstagram,
            },
            {
              href: 'https://github.com',
              label: 'GitHub',
              Icon: FaGithub,
            },
          ].map(({ href, label, Icon }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noreferrer"
              aria-label={label}
              className="grid h-[42px] w-[42px] place-items-center rounded-xl border border-line bg-surface text-[1.05rem] text-mute transition-all hover:-translate-y-1 hover:border-blue hover:bg-blue/10 hover:text-white hover:shadow-[0_8px_20px_rgba(59,130,246,0.25)]"
            >
              <Icon />
            </a>
          ))}
        </div>

        <p className="inline-flex items-center gap-1.5 text-[0.88rem] text-faint">
          Dibuat dengan <FiHeart className="text-rose-500" /> oleh Vines Fernando ©{' '}
          {new Date().getFullYear()}
        </p>
      </div>

      <button
        type="button"
        className="fixed bottom-6 right-6 z-[900] grid h-12 w-12 place-items-center rounded-[14px] bg-gradient-to-r from-blue to-purple text-[1.2rem] text-white shadow-[0_10px_30px_rgba(96,165,250,0.4)] transition-transform hover:-translate-y-1"
        onClick={() => go('home')}
        aria-label="Kembali ke atas"
      >
        <FiArrowUp />
      </button>
    </footer>
  )
}