import { useEffect, useState } from 'react'
import { FiMenu, FiMoon, FiSun, FiX } from 'react-icons/fi'
import useTheme from '../hooks/useTheme'

const LINKS = [
  { id: 'home', label: 'Beranda' },
  { id: 'about', label: 'Tentang' },
  { id: 'skills', label: 'Skills' },
  { id: 'projects', label: 'Project' },
  { id: 'contact', label: 'Kontak' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState('home')
  const { theme, toggle } = useTheme()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const sections = LINKS.map((l) => document.getElementById(l.id))
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.id)
        }
      },
      { rootMargin: '-45% 0px -50% 0px' },
    )
    sections.forEach((s) => s && observer.observe(s))
    return () => observer.disconnect()
  }, [])

  const go = (id) => {
    setOpen(false)
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <header
      className={`fixed inset-x-0 top-0 z-[1000] border-b transition-colors duration-300 ${
        scrolled
          ? 'border-line bg-nav shadow-[0_8px_30px_rgba(0,0,0,0.35)] backdrop-blur-2xl'
          : 'border-transparent'
      }`}
    >
      <nav className="container flex h-[72px] items-center justify-between gap-6">
        <button
          type="button"
          className="border-none bg-transparent font-heading text-[1.6rem] font-bold tracking-[0.02em] text-heading"
          onClick={() => go('home')}
        >
          VF<span className="text-purple-light">.</span>
        </button>

        <ul className="hidden items-center gap-1.5 md:flex">
          {LINKS.map((l) => (
            <li key={l.id}>
              <button
                type="button"
                className={`nav-link rounded-[10px] px-4 py-2.5 text-[0.92rem] font-semibold transition-colors ${
                  active === l.id ? 'active text-heading' : 'text-mute hover:text-heading'
                }`}
                onClick={() => go(l.id)}
              >
                {l.label}
              </button>
            </li>
          ))}
        </ul>

        <button
          type="button"
          className="grid h-[42px] w-[42px] shrink-0 place-items-center rounded-xl border border-line bg-surface text-[1.1rem] text-mute transition-colors hover:border-purple hover:text-heading"
          aria-label="Ganti tema"
          title="Ganti tema"
          onClick={toggle}
        >
          {theme === 'dark' ? <FiSun /> : <FiMoon />}
        </button>

        <a
          href="https://wa.me/6285187169158?text=Halo%20Vines!"
          target="_blank"
          rel="noreferrer"
          className="hidden rounded-full bg-gradient-to-r from-blue to-purple px-[22px] py-2.5 text-[0.85rem] font-bold text-white shadow-[0_6px_20px_rgba(99,102,241,0.35)] transition-colors md:inline-flex"
        >
          Hire Me
        </a>

        <button
          type="button"
          className="border-none bg-transparent text-[1.6rem] leading-none text-heading md:hidden"
          aria-label="Toggle menu"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <FiX /> : <FiMenu />}
        </button>
      </nav>

      {open && (
        <div className="flex max-h-screen flex-col overflow-hidden border-b border-line bg-nav-solid px-6 pb-6 pt-3 backdrop-blur-2xl md:hidden">
          {LINKS.map((l) => (
            <button
              key={l.id}
              type="button"
              className="border-0 border-b border-line bg-transparent px-2 py-3.5 text-left text-base font-semibold text-mute transition-colors last:border-0 hover:text-heading"
              onClick={() => go(l.id)}
            >
              {l.label}
            </button>
          ))}
        </div>
      )}
    </header>
  )
}