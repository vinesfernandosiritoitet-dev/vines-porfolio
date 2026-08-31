import {
  FiArrowDown,
  FiDownload,
  FiInstagram,
  FiMail,
  FiPhone,
} from 'react-icons/fi'
import { FaGithub, FaWhatsapp } from 'react-icons/fa'
import {
  SiReact,
  SiLaravel,
  SiFigma,
  SiBootstrap,
  SiJavascript,
} from 'react-icons/si'
import heroImg from '../assets/hero.png'
import useTypewriter from '../hooks/useTypewriter'

const ROLES = [
  'Frontend Developer',
  'UI/UX Designer',
  'Web Developer',
  'Freelancer',
]

const FLOATERS = [
  { Icon: SiReact, color: '#61dafb', top: '2%', left: '-6%' },
  { Icon: SiLaravel, color: '#ff2d20', top: '18%', right: '-9%' },
  { Icon: SiFigma, color: '#a259ff', bottom: '10%', left: '-8%' },
  { Icon: SiBootstrap, color: '#7952b3', bottom: '2%', right: '-4%' },
  { Icon: SiJavascript, color: '#f7df1e', top: '-4%', right: '16%' },
]

export default function Hero() {
  const typed = useTypewriter(ROLES)

  return (
    <section
      id="home"
      className="relative flex min-h-svh items-center overflow-hidden pb-24 pt-[96px]"
    >
      <div className="container grid items-center gap-12 text-center lg:grid-cols-[1fr_1.1fr] lg:text-left">
        <div className="relative isolate grid place-items-center">
          <div className="relative aspect-[1/1.05] w-[min(320px,70vw)] rounded-full bg-gradient-to-br from-blue-light to-purple-light p-2 shadow-[0_0_80px_rgba(129,140,248,0.3)]">
            <div className="absolute -inset-[30%] -z-10 rounded-full bg-[radial-gradient(circle,rgba(129,140,248,0.25),rgba(168,85,247,0.15)_45%,transparent_70%)] blur-[20px]" />
            <img
              src={heroImg}
              alt="Vines Fernando"
              className="h-full w-full rounded-full bg-bg-soft object-cover"
            />
          </div>

          {FLOATERS.map(({ Icon, color, top, left, right, bottom }) => (
            <div
              key={color}
              className="absolute z-[3]"
              style={{ top, left, right, bottom, color }}
            >
              <span className="grid h-[54px] w-[54px] place-items-center rounded-2xl border border-line bg-[rgba(16,21,43,0.9)] text-[1.5rem] shadow-[0_10px_30px_rgba(0,0,0,0.45)] max-md:h-11 max-md:w-11 max-md:text-[1.2rem]">
                <Icon />
              </span>
            </div>
          ))}
        </div>

        <div className="text-center lg:text-left">
          <span className="mb-4 inline-flex items-center gap-2.5 font-semibold text-mute">
            <span className="h-2.5 w-2.5 rounded-full bg-[#22c55e]" />
            Hai, saya
          </span>

          <h1 className="mb-3.5 font-heading text-[clamp(2.6rem,6vw,4.4rem)] text-heading">
            Vines <span className="gradient-text">Fernando</span>
          </h1>

          <div className="mb-5 flex min-h-[2.2em] items-center gap-3 font-heading text-[clamp(1.2rem,2.5vw,1.6rem)] font-semibold text-heading">
            <span className="text-purple-light">&gt;</span>
            <span className="gradient-text">{typed}</span>
            <span className="inline-block h-[1.2em] w-[3px] animate-caret rounded-[2px] bg-blue-light" />
          </div>

          <p className="mx-auto mb-8 max-w-[520px] text-[1.05rem] text-mute lg:mr-auto lg:ml-0">
            Saya membangun pengalaman web modern yang cepat, indah, dan
            responsif — dari desain UI hingga kode yang rapi.
          </p>

          <div className="mb-8 flex flex-wrap justify-center gap-3.5 lg:justify-start">
            <a href="/cv.pdf" download className="glow-btn">
              <FiDownload /> Download CV
            </a>
            <a href="#contact" className="glow-btn ghost">
              <FiPhone /> Hubungi Saya
            </a>
          </div>

          <div className="flex justify-center gap-3 lg:justify-start">
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
            ].map(({ href, label, Icon: IconCmp }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noreferrer"
                aria-label={label}
                title={label}
                className="grid h-[46px] w-[46px] place-items-center rounded-[14px] border border-line bg-surface text-[1.15rem] text-mute transition-colors hover:border-purple hover:bg-purple/15 hover:text-heading"
              >
                <IconCmp />
              </a>
            ))}
          </div>
        </div>
      </div>

      <a
        href="#about"
        className="absolute bottom-7 left-1/2 grid h-11 w-11 -translate-x-1/2 place-items-center rounded-full border border-line bg-soft text-[1.3rem] text-mute"
        aria-label="Scroll ke bawah"
      >
        <FiArrowDown />
      </a>
    </section>
  )
}