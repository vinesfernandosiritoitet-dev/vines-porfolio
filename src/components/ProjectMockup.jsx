import {
  FiSearch,
  FiHome,
  FiHeart,
  FiUser,
  FiShoppingBag,
  FiClock,
  FiTrendingUp,
  FiCalendar,
  FiUsers,
  FiDollarSign,
  FiBarChart2,
} from 'react-icons/fi'
import { FaTshirt, FaGraduationCap } from 'react-icons/fa'

function Phone({ children, className = '' }) {
  return (
    <div
      className={`relative aspect-[9/18.5] w-35 shrink-0 overflow-hidden rounded-[1.45rem] border-4 border-[#1b2233] bg-white shadow-pop ${className}`}
    >
      <div className="absolute left-1/2 top-1.5 z-20 h-3.5 w-16 -translate-x-1/2 rounded-full bg-[#1b2233]" />
      <div className="flex h-full flex-col pt-5">{children}</div>
    </div>
  )
}

function Browser({ children, className = '', url = 'vines-design.id' }) {
  return (
    <div
      className={`relative aspect-[16/10] w-full overflow-hidden rounded-xl border border-black/10 bg-white shadow-pop ${className}`}
    >
      <div className="flex h-7 items-center gap-1.5 border-b border-black/5 bg-[#f1f3f9] px-3">
        <span className="h-2 w-2 rounded-full bg-[#ff5f57]" />
        <span className="h-2 w-2 rounded-full bg-[#febc2e]" />
        <span className="h-2 w-2 rounded-full bg-[#28c840]" />
        <span className="ml-2 h-4 flex-1 rounded-full bg-white px-2 text-[7px] leading-4 text-[#98a0b3] truncate">
          {url}
        </span>
      </div>
      <div className="flex h-[calc(100%-1.75rem)] flex-col">{children}</div>
    </div>
  )
}

function BottomNav({ active = 0, color }) {
  const icons = [FiHome, FiSearch, FiHeart, FiUser]
  return (
    <div className="mt-auto flex h-11 items-center justify-around border-t border-black/5 bg-white px-2">
      {icons.map((Icon, i) => (
        <Icon
          key={i}
          className="text-[13px]"
          style={{ color: i === active ? color : '#c7ccd9' }}
        />
      ))}
    </div>
  )
}

function StatusBar({ dark = false }) {
  return (
    <div
      className={`flex items-center justify-between px-4 pb-1 text-[8px] font-bold ${
        dark ? 'text-white/85' : 'text-[#98a0b3]'
      }`}
    >
      <span>9:41</span>
      <span className="flex gap-0.5">
        <span className="h-1.5 w-2.5 rounded-xs bg-current opacity-70" />
        <span className="h-1.5 w-1.5 rounded-full bg-current opacity-70" />
        <span className="h-1.5 w-2 rounded-xs bg-current opacity-70" />
      </span>
    </div>
  )
}

// 1. SCHOOL ADMIN DASHBOARD (Dashboard Administrasi Sekolah)
function SchoolAdminScreen() {
  return (
    <Browser url="edumanage.sch.id/admin/dashboard">
      <div className="flex h-full bg-[#0D1224] text-white">
        {/* Sidebar */}
        <div className="w-[22%] border-r border-white/10 p-2 flex flex-col justify-between bg-[#080B16]">
          <div>
            <div className="flex items-center gap-1.5 mb-3 px-1">
              <FaGraduationCap className="text-[#6258F5] text-[12px]" />
              <span className="font-heading text-[8px] font-bold text-white">EduManage</span>
            </div>
            <div className="space-y-1">
              <div className="rounded bg-[#6258F5] px-2 py-1 text-[7px] font-bold text-white flex items-center gap-1.5">
                <FiHome className="text-[8px]" /> Dashboard
              </div>
              <div className="rounded px-2 py-1 text-[7px] text-slate-400 hover:text-white flex items-center gap-1.5">
                <FiUsers className="text-[8px]" /> Siswa &amp; Guru
              </div>
              <div className="rounded px-2 py-1 text-[7px] text-slate-400 hover:text-white flex items-center gap-1.5">
                <FiCalendar className="text-[8px]" /> Jadwal Pelajaran
              </div>
              <div className="rounded px-2 py-1 text-[7px] text-slate-400 hover:text-white flex items-center gap-1.5">
                <FiBarChart2 className="text-[8px]" /> Rekap Nilai
              </div>
            </div>
          </div>
          <div className="text-[6px] text-slate-500 px-1">TA 2026/2027 Ganjil</div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 p-2.5 flex flex-col justify-between">
          {/* Top Bar */}
          <div className="flex items-center justify-between border-b border-white/5 pb-2">
            <span className="font-heading text-[9px] font-bold text-white">Dashboard Administrasi Akademik</span>
            <span className="rounded-full bg-emerald-500/10 text-emerald-400 text-[6.5px] px-2 py-0.5 font-semibold">
              ● Absensi Hari Ini: 98.4%
            </span>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-3 gap-2 my-1.5">
            <div className="rounded-lg bg-[#12182E] p-2 border border-white/5">
              <span className="text-[6.5px] text-slate-400">Total Siswa Aktif</span>
              <p className="font-heading text-[11px] font-bold text-white">1,240</p>
              <span className="text-[6px] text-emerald-400">+32 siswa baru</span>
            </div>
            <div className="rounded-lg bg-[#12182E] p-2 border border-white/5">
              <span className="text-[6.5px] text-slate-400">Tenaga Pengajar</span>
              <p className="font-heading text-[11px] font-bold text-white">78 Guru</p>
              <span className="text-[6px] text-[#9BA8FF]">100% Hadir</span>
            </div>
            <div className="rounded-lg bg-[#12182E] p-2 border border-white/5">
              <span className="text-[6.5px] text-slate-400">Rerata Nilai Ujian</span>
              <p className="font-heading text-[11px] font-bold text-white">88.5 / 100</p>
              <span className="text-[6px] text-amber-300">Grade A</span>
            </div>
          </div>

          {/* Attendance Table Preview */}
          <div className="rounded-lg bg-[#12182E] p-2 border border-white/5 flex-1 flex flex-col justify-between">
            <div className="flex justify-between items-center text-[7px] font-bold text-slate-300 border-b border-white/5 pb-1">
              <span>Kelas / Rombel</span>
              <span>Wali Kelas</span>
              <span>Kehadiran</span>
              <span>Status</span>
            </div>
            {[
              { k: 'XII RPL 1', g: 'Drs. Hendra', a: '36/36 (100%)', s: 'Tuntas' },
              { k: 'XI DKV 2', g: 'Siti Aminah, M.Pd', a: '35/36 (97%)', s: 'Proses' },
              { k: 'X TKJ 1', g: 'Budi Santoso, S.Kom', a: '36/36 (100%)', s: 'Tuntas' },
            ].map((row, idx) => (
              <div key={idx} className="flex justify-between items-center text-[6.5px] text-slate-300 py-0.5">
                <span className="font-semibold text-white">{row.k}</span>
                <span className="text-slate-400">{row.g}</span>
                <span className="text-emerald-400">{row.a}</span>
                <span className="rounded bg-emerald-500/10 text-emerald-400 px-1 py-0.2">{row.s}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Browser>
  )
}

// 3. MOBILE E-COMMERCE MOCKUP (Aplikasi Mobile E-Commerce)
function MobileEcommerceScreen() {
  return (
    <Phone>
      <StatusBar dark={false} />
      <div className="flex flex-col h-full bg-[#F8FAFC] text-slate-800">
        {/* Top Header */}
        <div className="flex items-center justify-between px-3 pb-2 pt-1">
          <div>
            <span className="text-[7px] text-slate-500">Koleksi Terbaru</span>
            <p className="font-heading text-[10px] font-extrabold text-[#080B16]">UrbanVogue Store</p>
          </div>
          <span className="relative grid h-6 w-6 place-items-center rounded-full bg-white shadow-sm text-[10px]">
            <FiShoppingBag className="text-slate-700" />
            <span className="absolute -right-0.5 -top-0.5 grid h-3 w-3 place-items-center rounded-full bg-[#6258F5] text-[6px] font-bold text-white">
              2
            </span>
          </span>
        </div>

        {/* Promo Banner */}
        <div className="mx-3 rounded-xl bg-linear-to-r from-[#6258F5] to-[#9BA8FF] p-2.5 text-white shadow-sm">
          <span className="rounded bg-white/20 px-1.5 py-0.5 text-[5.5px] font-bold uppercase tracking-wider">
            FLASH SALE 40%
          </span>
          <p className="mt-1 font-heading text-[9.5px] font-bold">Mid-Season Streetwear</p>
          <span className="text-[6.5px] text-white/90">Gunakan voucher: URBAN40</span>
        </div>

        {/* Categories Pills */}
        <div className="flex gap-1.5 px-3 py-2 text-[6.5px] font-bold overflow-x-hidden">
          <span className="rounded-full bg-[#080B16] px-2 py-0.5 text-white">Semua</span>
          <span className="rounded-full bg-white px-2 py-0.5 text-slate-600 shadow-sm">Hoodie</span>
          <span className="rounded-full bg-white px-2 py-0.5 text-slate-600 shadow-sm">Sepatu</span>
          <span className="rounded-full bg-white px-2 py-0.5 text-slate-600 shadow-sm">Aksesoris</span>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-2 gap-2 px-3 flex-1 overflow-hidden">
          <div className="rounded-xl bg-white p-2 shadow-sm border border-slate-100 flex flex-col justify-between">
            <div className="h-14 rounded-lg bg-[#EFF6FF] flex items-center justify-center relative">
              <FaTshirt className="text-[20px] text-[#6258F5]" />
              <span className="absolute top-1 left-1 rounded bg-[#6258F5] text-white text-[5.5px] font-bold px-1">
                Baru
              </span>
            </div>
            <div className="mt-1">
              <p className="text-[7px] font-bold text-slate-800 truncate">Oversized Hoodie</p>
              <p className="text-[7.5px] font-extrabold text-[#6258F5]">Rp 349.000</p>
            </div>
          </div>

          <div className="rounded-xl bg-white p-2 shadow-sm border border-slate-100 flex flex-col justify-between">
            <div className="h-14 rounded-lg bg-[#FAF5FF] flex items-center justify-center relative">
              <span className="text-[20px]">👟</span>
              <span className="absolute top-1 left-1 rounded bg-rose-500 text-white text-[5.5px] font-bold px-1">
                -25%
              </span>
            </div>
            <div className="mt-1">
              <p className="text-[7px] font-bold text-slate-800 truncate">Retro Chunky Sneaker</p>
              <p className="text-[7.5px] font-extrabold text-[#6258F5]">Rp 599.000</p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <BottomNav active={0} color="#6258F5" />
      </div>
    </Phone>
  )
}

// 5. FINANCIAL DASHBOARD MOCKUP (Dashboard Keuangan)
function FinancialDashboardScreen() {
  return (
    <Browser url="finflow.analytics/overview">
      <div className="flex h-full bg-[#080B16] text-white">
        {/* Left Mini Nav */}
        <div className="w-[18%] border-r border-white/10 p-2 flex flex-col justify-between bg-[#0B0F1E]">
          <div>
            <div className="flex items-center gap-1 mb-3">
              <span className="h-3 w-3 rounded-full bg-emerald-400" />
              <span className="font-heading text-[8px] font-extrabold text-white">FinFlow</span>
            </div>
            <div className="space-y-1">
              <div className="rounded bg-[#6258F5] p-1 text-[7px] font-bold text-white flex items-center gap-1">
                <FiDollarSign className="text-[8px]" /> Arus Kas
              </div>
              <div className="rounded p-1 text-[7px] text-slate-400 flex items-center gap-1">
                <FiTrendingUp className="text-[8px]" /> Analitik
              </div>
              <div className="rounded p-1 text-[7px] text-slate-400 flex items-center gap-1">
                <FiClock className="text-[8px]" /> Transaksi
              </div>
            </div>
          </div>
          <span className="text-[5.5px] text-slate-500">Multi-Currency</span>
        </div>

        {/* Main Dashboard Panel */}
        <div className="flex-1 p-2.5 flex flex-col justify-between">
          <div className="flex items-center justify-between border-b border-white/5 pb-1.5">
            <div>
              <span className="text-[6px] text-slate-400">Total Liquid Balance</span>
              <p className="font-heading text-[12px] font-extrabold text-white">Rp 2.845.000.000</p>
            </div>
            <span className="rounded bg-emerald-500/10 px-2 py-0.5 text-[6.5px] font-bold text-emerald-400 border border-emerald-500/20">
              ▲ +32.4% vs Quartal Lalu
            </span>
          </div>

          {/* SVG Cashflow Graph */}
          <div className="my-1.5 rounded-lg bg-[#12182E] p-2 border border-white/5">
            <div className="flex justify-between text-[6.5px] text-slate-300 mb-1">
              <span className="font-bold text-white">Proyeksi Arus Kas &amp; Revenue</span>
              <span className="text-[#9BA8FF]">Nett Profit: 68.2%</span>
            </div>
            <div className="h-16 w-full">
              <svg viewBox="0 0 280 60" className="h-full w-full overflow-visible">
                <defs>
                  <linearGradient id="finGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10B981" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#10B981" stopOpacity="0.0" />
                  </linearGradient>
                </defs>
                <path
                  d="M0,50 Q45,35 90,40 T180,20 T280,10 L280,60 L0,60 Z"
                  fill="url(#finGrad)"
                />
                <path
                  d="M0,50 Q45,35 90,40 T180,20 T280,10"
                  fill="none"
                  stroke="#10B981"
                  strokeWidth="2.5"
                />
                <circle cx="180" cy="20" r="3.5" fill="#9BA8FF" />
                <circle cx="280" cy="10" r="4" fill="#FFFFFF" stroke="#10B981" strokeWidth="2" />
              </svg>
            </div>
          </div>

          {/* Recent Ledger Entries */}
          <div className="grid grid-cols-2 gap-2 text-[6.5px]">
            <div className="rounded bg-[#12182E] p-1.5 border border-white/5">
              <span className="text-slate-400 block">Pemasukan SaaS</span>
              <span className="font-bold text-emerald-400">+Rp 128.400.000</span>
            </div>
            <div className="rounded bg-[#12182E] p-1.5 border border-white/5">
              <span className="text-slate-400 block">Biaya Server &amp; Ops</span>
              <span className="font-bold text-rose-400">-Rp 18.250.000</span>
            </div>
          </div>
        </div>
      </div>
    </Browser>
  )
}

function extractDomain(rawLink, fallbackSlug) {
  if (!rawLink) return `${fallbackSlug}.vines.design`
  try {
    const parsed = new URL(/^https?:\/\//i.test(rawLink) ? rawLink : `https://${rawLink}`)
    return parsed.hostname.replace(/^www\./i, '')
  } catch {
    return rawLink.replace(/^https?:\/\//i, '').split('/')[0] || `${fallbackSlug}.vines.design`
  }
}

// 4. CUSTOM USER PROJECT PREVIEW (Tampilan estetik dark-glass UI showcase sesuai project)
function CustomProjectScreen({ project }) {
  const title = project?.title || 'Project Baru'
  const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'project'
  const domain = extractDomain(project?.link, slug)

  return (
    <div className="relative aspect-[16/10] w-full overflow-hidden rounded-xl border border-white/12 bg-linear-to-br from-[#0E1730] via-[#0B1124] to-[#070A14] shadow-[0_18px_40px_rgba(0,0,0,0.55)]">
      {/* Soft ambient mesh glow */}
      <div className="pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full bg-[#3B82F6]/30 blur-2xl" />
      <div className="pointer-events-none absolute -left-4 bottom-0 h-20 w-20 rounded-full bg-[#6366F1]/20 blur-2xl" />

      {/* Sleek Dark Glass Titlebar */}
      <div className="flex h-6 items-center justify-between border-b border-white/10 bg-white/4 px-3">
        <div className="flex items-center gap-1">
          <span className="h-1.5 w-1.5 rounded-full bg-white/30" />
          <span className="h-1.5 w-1.5 rounded-full bg-white/20" />
          <span className="h-1.5 w-1.5 rounded-full bg-white/20" />
        </div>
        <span className="rounded-full border border-white/10 bg-white/6 px-2.5 py-0.5 text-[7px] font-medium tracking-wide text-slate-300 truncate max-w-35">
          {domain}
        </span>
        <span className="h-1.5 w-4 rounded-full bg-[#3B82F6]/60" />
      </div>

      {/* Aesthetic UI Canvas Composition */}
      <div className="relative grid h-[calc(100%-1.5rem)] grid-cols-[1.25fr_0.95fr] gap-2.5 p-3">
        {/* Left: Featured Hero Card */}
        <div className="flex flex-col justify-between rounded-lg border border-white/10 bg-linear-to-br from-[#1E3A8A]/45 via-[#172554]/40 to-white/3 p-2.5">
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-[#60A5FA]" />
            <span className="h-1 w-8 rounded-full bg-white/25" />
          </div>

          <div className="my-auto">
            <h4 className="truncate font-heading text-[12px] font-extrabold capitalize tracking-tight text-white">
              {title}
            </h4>
            <div className="mt-1.5 space-y-1">
              <div className="h-1 w-4/5 rounded-full bg-white/20" />
              <div className="h-1 w-3/5 rounded-full bg-white/10" />
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="inline-block h-3.5 w-11 rounded-full bg-[#2563EB]/85" />
            <span className="inline-block h-3.5 w-8 rounded-full border border-white/15 bg-white/5" />
          </div>
        </div>

        {/* Right: Stylized UI Widgets */}
        <div className="flex flex-col gap-2">
          <div className="flex-1 rounded-lg border border-white/10 bg-white/4 p-2 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="h-1.5 w-8 rounded-full bg-white/25" />
              <span className="h-2 w-2 rounded-full bg-emerald-400/80" />
            </div>
            <div className="flex items-end gap-1 h-7 pt-1">
              <span className="w-1/5 h-[45%] rounded-t bg-[#3B82F6]/40" />
              <span className="w-1/5 h-[70%] rounded-t bg-[#3B82F6]/60" />
              <span className="w-1/5 h-[55%] rounded-t bg-[#3B82F6]/50" />
              <span className="w-1/5 h-[95%] rounded-t bg-[#60A5FA]" />
              <span className="w-1/5 h-[75%] rounded-t bg-[#3B82F6]/70" />
            </div>
          </div>

          <div className="rounded-lg border border-white/10 bg-white/4 p-2 flex items-center gap-2">
            <span className="h-4 w-4 shrink-0 rounded-md bg-linear-to-br from-[#3B82F6] to-[#6366F1]" />
            <div className="flex-1 space-y-1">
              <div className="h-1 w-full rounded-full bg-white/25" />
              <div className="h-1 w-2/3 rounded-full bg-white/10" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const SCREENS = {
  'school-admin': SchoolAdminScreen,
  'mobile-ecommerce': MobileEcommerceScreen,
  'financial-dashboard': FinancialDashboardScreen,
  custom: CustomProjectScreen,
  // backward compatibility aliases
  ecommerce: MobileEcommerceScreen,
  education: SchoolAdminScreen,
  automotive: FinancialDashboardScreen,
}

export default function ProjectMockup({
  variant = 'school-admin',
  project = null,
  className = '',
}) {
  const Screen = SCREENS[variant] || SchoolAdminScreen
  return (
    <div className={className}>
      <Screen project={project} />
    </div>
  )
}
