import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FiMenu, FiMoon, FiSun, FiX } from 'react-icons/fi'
import useTheme from '../hooks/useTheme'

const LINKS = [
  { id: 'home', label: 'Beranda' },
  { id: 'about', label: 'Tentang' },
  { id: 'skills', label: 'Skill' },
  { id: 'projects', label: 'Project' },
  { id: 'contact', label: 'Contact' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [progress, setProgress] = useState(0)
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState('home')
  const { theme, toggle } = useTheme()
  const navigate = useNavigate()

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 24)
      const max = document.documentElement.scrollHeight - window.innerHeight
      setProgress(max > 0 ? (window.scrollY / max) * 100 : 0)
    }
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
    const el = document.getElementById(id)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' })
    } else {
      navigate('/', { replace: true })
      setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }), 250)
    }
  }

  return (
    <header
      className={`fixed inset-x-0 top-0 z-1000 border-b border-line/80 bg-nav backdrop-blur-2xl transition-shadow duration-300 animate-nav-in ${
        scrolled ? 'shadow-[0_8px_30px_rgba(0,0,0,0.25)]' : 'shadow-none'
      }`}
    >
      <nav className="container flex h-18 items-center justify-between gap-6">
        <button
          type="button"
          className="group flex items-center gap-2.5 border-none bg-transparent"
          onClick={() => go('home')}
        >
          <img
            src="/logo.png"
            alt="Logo Saipull Yiinn"
            className="h-10 w-10 sm:h-11 sm:w-11 rounded-full object-contain shadow-xs transition-transform duration-500 ease-out group-hover:rotate-180"
          />
          <span className="font-heading text-[1.15rem] font-bold tracking-[-0.02em] text-heading">
            Saipull Yiinn<span className="text-indigo-light">.</span>
          </span>
        </button>

        <ul className="hidden items-center gap-1.5 md:flex ml-auto mr-4">
          {LINKS.map((l) => (
            <li key={l.id}>
              <button
                type="button"
                className={`nav-link rounded-[10px] px-3 py-2.5 text-[0.84rem] font-semibold transition-colors ${
                  active === l.id ? 'active text-heading' : 'text-mute hover:text-heading'
                }`}
                onClick={() => go(l.id)}
              >
                {l.label}
              </button>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          <button
            type="button"
            className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-line bg-surface text-[1rem] text-mute transition-colors hover:border-indigo hover:text-indigo-light"
            aria-label="Ganti tema"
            title="Ganti tema"
            onClick={toggle}
          >
            {theme === 'dark' ? <FiSun /> : <FiMoon />}
          </button>


          <button
            type="button"
            className="border-none bg-transparent text-[1.5rem] leading-none text-heading md:hidden"
            aria-label="Toggle menu"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <FiX /> : <FiMenu />}
          </button>
        </div>
      </nav>

      <div
        aria-hidden="true"
        className="h-0.5 bg-transparent"
      >
        <span
          className="block h-full bg-linear-to-r from-indigo via-indigo-light to-indigo transition-[width] duration-150 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      {open && (
        <div className="max-h-[calc(100svh-74px)] overflow-y-auto border-b border-line bg-nav-solid px-6 pb-6 pt-2 backdrop-blur-2xl xl:hidden">
          {LINKS.map((l) => (
            <button
              key={l.id}
              type="button"
              className={`block w-full border-0 border-b border-line bg-transparent px-2 py-3.5 text-left text-base font-semibold transition-colors last:border-0 ${
                active === l.id ? 'text-indigo-light' : 'text-mute hover:text-heading'
              }`}
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
