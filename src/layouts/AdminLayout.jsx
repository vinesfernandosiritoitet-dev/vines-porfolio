import { Link } from 'react-router-dom'
import { FiArrowLeft, FiLogOut, FiMoon, FiShield, FiSun, FiUser } from 'react-icons/fi'
import useAuth from '../auth/useAuth'
import useTheme from '../hooks/useTheme'

export default function AdminLayout({ children, title = 'Admin Panel' }) {
  const { logout, user } = useAuth()
  const { theme, toggle } = useTheme()

  return (
    <div className="min-h-screen bg-bg-soft text-ink transition-colors duration-300">
      {/* Admin Top Navigation Bar */}
      <header className="sticky top-0 z-50 border-b border-line bg-nav backdrop-blur-xl transition-colors duration-300">
        <div className="container flex h-16 items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Link
              to="/"
              className="flex items-center gap-2 rounded-lg border border-line bg-surface px-3 py-1.5 text-[0.8rem] font-semibold text-mute transition-colors hover:border-indigo/50 hover:text-heading"
            >
              <FiArrowLeft /> Beranda
            </Link>
            <div className="h-4 w-px bg-line" />
            <span className="flex items-center gap-1.5 font-heading text-[0.95rem] font-bold text-heading">
              <FiShield className="text-indigo" /> {title}
            </span>
          </div>

          <div className="flex items-center gap-2.5">
            <span className="hidden items-center gap-1.5 text-[0.78rem] text-mute sm:flex">
              <FiUser className="text-indigo" /> {user?.username || 'Admin'}
            </span>
            <button
              type="button"
              onClick={toggle}
              aria-label="Ganti tema"
              title="Ganti tema"
              className="grid h-8 w-8 place-items-center rounded-lg border border-line bg-surface text-[0.95rem] text-mute transition-colors hover:border-indigo hover:text-indigo"
            >
              {theme === 'dark' ? <FiSun /> : <FiMoon />}
            </button>
            <button
              type="button"
              onClick={logout}
              className="flex items-center gap-1.5 rounded-lg border border-rose-500/30 bg-rose-500/10 px-3 py-1.5 text-[0.78rem] font-bold text-rose-500 transition-colors hover:bg-rose-500 hover:text-white"
            >
              <FiLogOut /> Keluar
            </button>
          </div>
        </div>
      </header>

      {/* Main Admin Content */}
      <main className="py-8">
        <div className="container">
          {children}
        </div>
      </main>
    </div>
  )
}
