import { useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import {
  FiArrowLeft,
  FiLock,
  FiLogIn,
  FiEdit2,
  FiTrash2,
  FiEye,
  FiEyeOff,
  FiImage,
  FiX,
  FiCheck,
  FiAlertCircle,
  FiLayers,
  FiClock,
  FiActivity,
  FiUsers,
  FiUploadCloud,
  FiMonitor,
  FiSmartphone,
  FiExternalLink,
  FiSun,
  FiMoon,
  FiKey,
  FiShield,
  FiMail,
  FiMessageSquare,
  FiCamera,
  FiPlus,
  FiPlay,
  FiPause,
  FiHeart,
  FiSend,
} from 'react-icons/fi'
import { FaSpotify } from 'react-icons/fa'
import useAuth from '../auth/useAuth'
import useProjects from '../hooks/useProjects'
import useTheme from '../hooks/useTheme'
import AdminLayout from '../layouts/AdminLayout'
import { validateProjectForm } from '../utils/validation'
import { getVisitStats, clearVisitLogs } from '../utils/analytics'
import {
  getContactMessages,
  addContactMessageReply,
  clearContactMessages,
} from '../utils/messages'
import {
  getFavoritePhotos,
  addFavoritePhoto,
  deleteFavoritePhoto,
  getFavoriteSongs,
  addFavoriteSong,
  deleteFavoriteSong,
  compressFavoriteImage,
} from '../utils/favorites'

function getSpotifyEmbedUrl(rawUrl) {
  if (!rawUrl) return ''
  const match = rawUrl.match(
    /open\.spotify\.com\/(?:intl-[a-z]+\/)?(track|album|playlist|episode)\/([a-zA-Z0-9]+)/i,
  )
  if (!match) return ''
  return `https://open.spotify.com/embed/${match[1]}/${match[2]}?utm_source=generator`
}

function formatDateTime(iso) {
  if (!iso) return '-'
  try {
    return new Intl.DateTimeFormat('id-ID', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    }).format(new Date(iso))
  } catch {
    return iso
  }
}

export default function AdminLogin() {
  const { isAdmin, user, hasCustomCredentials, login, updateCredentials } = useAuth()
  const { projects, history, updateProject, deleteProject, clearHistory } = useProjects()
  const { theme, toggle } = useTheme()

  // Statistik Pengunjung Website & Pesan Masuk
  const [visitStats, setVisitStats] = useState(() => getVisitStats())
  const [contactMessages, setContactMessages] = useState(() => getContactMessages())
  const [activeChatId, setActiveChatId] = useState(null)
  const [chatReplyText, setChatReplyText] = useState('')
  const [chatNotice, setChatNotice] = useState('')
  const chatThreadEndRef = useRef(null)
  const activeChatMsg = contactMessages.find((m) => m.id === activeChatId) || null

  // Tempat Foto & Lagu Favorit
  const [favPhotos, setFavPhotos] = useState(() => getFavoritePhotos())
  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false)
  const [previewPhoto, setPreviewPhoto] = useState(null)
  const [photoForm, setPhotoForm] = useState({ title: '', caption: '', image: '' })
  const [photoError, setPhotoError] = useState('')
  const favPhotoInputRef = useRef(null)

  const [favSongs, setFavSongs] = useState(() => getFavoriteSongs())
  const [isSongModalOpen, setIsSongModalOpen] = useState(false)
  const [songForm, setSongForm] = useState({ title: '', artist: '', url: '', thumbnail: '' })
  const [songError, setSongError] = useState('')
  const [playingSongId, setPlayingSongId] = useState(null)

  // Filter Riwayat Project ('all' | 'upload' | 'delete')
  const [historyFilter, setHistoryFilter] = useState('all')

  // State Login
  const [loginForm, setLoginForm] = useState({ username: '', password: '' })
  const [showLoginPass, setShowLoginPass] = useState(false)
  const [loginError, setLoginError] = useState('')
  const [isLoggingIn, setIsLoggingIn] = useState(false)

  // State Pengaturan Akun Pribadi (Buat / Ubah Username & Password)
  const [isAccountModalOpen, setIsAccountModalOpen] = useState(false)
  const [accountForm, setAccountForm] = useState({
    username: '',
    password: '',
    confirmPassword: '',
  })
  const [showNewPass, setShowNewPass] = useState(false)
  const [accountError, setAccountError] = useState('')
  const [accountSuccess, setAccountSuccess] = useState('')
  const [isSavingAccount, setIsSavingAccount] = useState(false)

  // State Modal Edit
  const [editingId, setEditingId] = useState(null)
  const [projectForm, setProjectForm] = useState({
    title: '',
    subtitle: '',
    category: 'Website',
    duration: '3 Minggu',
    link: '',
    desc: '',
    role: 'UI/UX Designer',
    tools: '',
    image: '',
  })
  const [formErrors, setFormErrors] = useState({})
  const imageInputRef = useRef(null)

  // Handle Login
  const handleLoginSubmit = async (e) => {
    e.preventDefault()
    setLoginError('')
    setIsLoggingIn(true)

    const result = await login(loginForm.username.trim(), loginForm.password)
    setIsLoggingIn(false)

    if (!result?.ok) {
      setLoginError(result?.error || 'Kombinasi username atau password salah. Akses ditolak.')
      return
    }
    setLoginForm({ username: '', password: '' })
    setVisitStats(getVisitStats())
    setContactMessages(getContactMessages())
  }

  const openAccountModal = () => {
    setAccountForm({
      username: user?.username || '',
      password: '',
      confirmPassword: '',
    })
    setAccountError('')
    setAccountSuccess('')
    setShowNewPass(false)
    setIsAccountModalOpen(true)
  }

  const handleAccountSubmit = async (e) => {
    e.preventDefault()
    setAccountError('')
    setAccountSuccess('')

    if (accountForm.password !== accountForm.confirmPassword) {
      setAccountError('Konfirmasi password tidak cocok.')
      return
    }

    setIsSavingAccount(true)
    const result = await updateCredentials(accountForm.username, accountForm.password)
    setIsSavingAccount(false)

    if (!result?.ok) {
      setAccountError(result?.error || 'Gagal memperbarui akun admin.')
      return
    }

    setAccountSuccess(
      'Username & password pribadi berhasil disimpan! Kini hanya akun baru Anda yang bisa mengakses halaman admin.',
    )
    setAccountForm((prev) => ({ ...prev, password: '', confirmPassword: '' }))
  }

  // Buka Modal Edit
  const openEditModal = (p) => {
    setEditingId(p.id)
    setProjectForm({
      title: p.title || '',
      subtitle: p.subtitle || '',
      category: p.category || 'Website',
      duration: p.duration || '3 Minggu',
      link: p.link || '',
      desc: p.desc || '',
      role: p.role || 'UI/UX Designer',
      tools: Array.isArray(p.tools) ? p.tools.join(', ') : p.tools || '',
      image: p.image || '',
    })
    setFormErrors({})
  }

  // Upload Gambar
  const handleImageChange = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith('image/')) {
      alert('Hanya berkas gambar (JPG, PNG, WebP, SVG) yang diperbolehkan.')
      return
    }
    const reader = new FileReader()
    reader.onload = () => {
      setProjectForm((prev) => ({ ...prev, image: reader.result }))
    }
    reader.readAsDataURL(file)
  }

  // Submit Simpan Perubahan Proyek
  const handleProjectSubmit = (e) => {
    e.preventDefault()
    const { isValid, errors } = validateProjectForm(projectForm)
    if (!isValid) {
      setFormErrors(errors)
      return
    }

    const rawLink = projectForm.link.trim()
    const normalizedLink = rawLink
      ? /^https?:\/\//i.test(rawLink)
        ? rawLink
        : `https://${rawLink}`
      : ''

    if (editingId) {
      updateProject(editingId, {
        title: projectForm.title.trim(),
        subtitle: projectForm.subtitle.trim(),
        category: projectForm.category.trim(),
        duration: projectForm.duration.trim(),
        link: normalizedLink,
        desc: projectForm.desc.trim(),
        role: projectForm.role.trim(),
        tools: projectForm.tools
          .split(',')
          .map((t) => t.trim())
          .filter(Boolean),
        image: projectForm.image || undefined,
      })
    }

    setEditingId(null)
  }

  // Hapus Proyek (otomatis tercatat ke riwayat penghapusan + waktunya)
  const handleDelete = (id, title) => {
    if (window.confirm(`Apakah Anda yakin ingin menghapus proyek "${title}"?`)) {
      deleteProject(id)
    }
  }

  const handleClearVisits = () => {
    if (window.confirm('Bersihkan seluruh catatan pengunjung website?')) {
      clearVisitLogs()
      setVisitStats(getVisitStats())
    }
  }

  const handleClearHistory = () => {
    if (window.confirm('Bersihkan semua riwayat upload dan penghapusan project?')) {
      clearHistory()
    }
  }

  const handleClearMessages = () => {
    if (window.confirm('Bersihkan seluruh daftar pesan masuk dari form kontak?')) {
      clearContactMessages()
      setContactMessages([])
      setActiveChatId(null)
    }
  }

  const scrollChatToBottom = () => {
    setTimeout(() => {
      chatThreadEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, 50)
  }

  const openChatModal = (msgId) => {
    setActiveChatId(msgId)
    setChatReplyText('')
    setChatNotice('')
    scrollChatToBottom()
  }

  const closeChatModal = () => {
    setActiveChatId(null)
    setChatReplyText('')
    setChatNotice('')
  }

  const openEmailReply = (msg, customBody = '') => {
    if (!msg?.email) return
    const subject = `Re: ${msg.subject || 'Pesan Portofolio'}`
    const body =
      customBody.trim() ||
      `Halo ${msg.name},\n\nTerima kasih sudah menghubungi saya mengenai "${msg.subject}".\n\n`
    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(
      msg.email,
    )}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
    window.open(gmailUrl, '_blank', 'noopener,noreferrer')
  }

  const handleSendChatReply = (e, { alsoOpenGmail = false } = {}) => {
    if (e) e.preventDefault()
    if (!activeChatMsg) return
    const cleanReply = chatReplyText.trim()
    if (!cleanReply) return

    const updated = addContactMessageReply(activeChatMsg.id, {
      text: cleanReply,
      sender: 'admin',
      via: alsoOpenGmail ? 'gmail' : 'chat',
    })
    setContactMessages(updated)
    setChatReplyText('')
    setChatNotice(
      alsoOpenGmail
        ? 'Balasan disimpan ke riwayat obrolan & Gmail dibuka.'
        : 'Balasan ditambahkan ke riwayat obrolan.',
    )
    scrollChatToBottom()

    if (alsoOpenGmail) {
      openEmailReply(activeChatMsg, cleanReply)
    }
  }

  // Handler Foto Favoritku
  const handlePickFavPhoto = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith('image/')) {
      setPhotoError('Hanya berkas gambar (JPG, PNG, WebP) yang diperbolehkan.')
      return
    }
    setPhotoError('')
    compressFavoriteImage(file, (imgData) =>
      setPhotoForm((prev) => ({ ...prev, image: imgData })),
    )
    e.target.value = ''
  }

  const handleSaveFavPhoto = (e) => {
    e.preventDefault()
    if (!photoForm.image) {
      setPhotoError('Silakan pilih foto terlebih dahulu.')
      return
    }
    const res = addFavoritePhoto({
      title: photoForm.title.trim(),
      caption: photoForm.caption.trim(),
      image: photoForm.image,
    })
    if (!res.ok) {
      setPhotoError(res.error)
      return
    }
    setFavPhotos(res.list)
    setPhotoForm({ title: '', caption: '', image: '' })
    setPhotoError('')
    setIsPhotoModalOpen(false)
  }

  const handleDeleteFavPhoto = (id, title) => {
    if (window.confirm(`Hapus foto favorit "${title}"?`)) {
      setFavPhotos(deleteFavoritePhoto(id))
      if (previewPhoto?.id === id) setPreviewPhoto(null)
    }
  }

  // Handler Lagu Favoritku (Spotify)
  const openSpotifyDirect = (query = '') => {
    const cleanQ = String(query || '').trim()
    const target = cleanQ
      ? `https://open.spotify.com/search/${encodeURIComponent(cleanQ)}`
      : 'https://open.spotify.com/'
    window.open(target, '_blank', 'noopener,noreferrer')
  }

  const handleSpotifyUrlChange = (rawVal) => {
    setSongForm((prev) => ({ ...prev, url: rawVal }))
    setSongError('')
    const trimmed = rawVal.trim()
    if (/open\.spotify\.com\//i.test(trimmed)) {
      const normalized = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`
      fetch(`https://open.spotify.com/oembed?url=${encodeURIComponent(normalized)}`)
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => {
          if (!data) return
          setSongForm((prev) => ({
            ...prev,
            title: prev.title.trim() ? prev.title : data.title || '',
            thumbnail: data.thumbnail_url || prev.thumbnail,
          }))
        })
        .catch(() => {
          /* ignore oEmbed network errors */
        })
    }
  }

  const handleSaveFavSong = (e) => {
    e.preventDefault()
    const rawUrl = songForm.url.trim()
    const normalizedUrl = rawUrl
      ? /^https?:\/\//i.test(rawUrl)
        ? rawUrl
        : `https://${rawUrl}`
      : ''

    if (!normalizedUrl) {
      setSongError('Silakan tempelkan link lagu Spotify terlebih dahulu.')
      return
    }
    if (!songForm.title.trim()) {
      setSongError('Judul lagu wajib diisi.')
      return
    }

    const res = addFavoriteSong({
      title: songForm.title.trim(),
      artist: songForm.artist.trim(),
      url: normalizedUrl,
      thumbnail: songForm.thumbnail,
    })
    if (!res.ok) {
      setSongError(res.error)
      return
    }
    setFavSongs(res.list)
    setSongForm({ title: '', artist: '', url: '', thumbnail: '' })
    setSongError('')
    setIsSongModalOpen(false)
  }

  const handleDeleteFavSong = (id, title) => {
    if (window.confirm(`Hapus lagu "${title}" dari daftar favorit?`)) {
      if (playingSongId === id) setPlayingSongId(null)
      setFavSongs(deleteFavoriteSong(id))
    }
  }

  // TAMPILAN LOGIN JIKA BELUM AUTENTIKASI (Mengikuti background Beranda & tema Light / Dark)
  if (!isAdmin) {
    return (
      <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-bg px-6 py-20 text-ink transition-colors duration-300">
        {/* Background Foto Hitam & Putih sama seperti Beranda */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
          <img
            src="/vines-photo.jpg"
            alt="Background Vines Fernando S"
            className="h-full w-full object-cover object-[70%_28%] opacity-85 sm:opacity-90 dark:opacity-60 filter grayscale contrast-140 brightness-120 scale-105 transition-all duration-700"
          />
          <div className="absolute inset-0 bg-linear-to-r from-bg/95 via-bg/40 to-transparent" />
          <div className="absolute inset-0 bg-linear-to-t from-bg via-transparent to-transparent opacity-50" />
        </div>

        {/* Background ambient lighting & grid seperti Beranda */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 grid-lines opacity-30" />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -left-24 top-28 h-90 w-90 rounded-full blur-3xl animate-float-slow"
          style={{ background: 'radial-gradient(circle,rgba(37,99,235,0.14),transparent 70%)' }}
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-32 top-1/4 h-112.5 w-112.5 rounded-full blur-3xl"
          style={{ background: 'radial-gradient(circle,rgba(37,99,235,0.2),transparent 70%)' }}
        />

        <div className="relative z-10 w-full max-w-md" data-aos="fade-up">
          <div className="mb-6 flex items-center justify-between">
            <Link
              to="/"
              className="inline-flex items-center gap-2 rounded-xl border border-line/70 bg-surface/80 px-3 py-1.5 text-[0.86rem] font-bold text-mute backdrop-blur-md transition-colors hover:border-indigo hover:text-heading"
            >
              <FiArrowLeft /> Kembali ke Beranda
            </Link>
            <button
              type="button"
              onClick={toggle}
              aria-label="Ganti tema"
              title="Ganti tema"
              className="grid h-9 w-9 place-items-center rounded-xl border border-line bg-surface/85 text-mute backdrop-blur-md transition-colors hover:border-indigo hover:text-indigo"
            >
              {theme === 'dark' ? <FiSun /> : <FiMoon />}
            </button>
          </div>

          <div className="rounded-3xl border border-line bg-surface/92 p-8 shadow-pop backdrop-blur-xl">
            <div className="mb-7 flex flex-col items-center gap-3 text-center">
              <div className="grid h-14 w-14 place-items-center rounded-2xl bg-linear-to-br from-indigo to-indigo-dark text-[1.4rem] text-white shadow-button">
                <FiLock />
              </div>
              <h1 className="font-heading text-[1.6rem] font-bold text-heading">
                Login Panel Admin
              </h1>
              <p className="text-[0.88rem] leading-relaxed text-mute">
                Masuk untuk memantau pengunjung portofolio, mengelola daftar project, dan melihat riwayat upload/penghapusan.
              </p>
            </div>

            {loginError && (
              <div className="mb-5 flex items-center gap-2.5 rounded-xl border border-rose-500/30 bg-rose-500/10 p-3.5 text-[0.84rem] font-medium text-rose-500">
                <FiAlertCircle className="shrink-0 text-[1.1rem]" />
                <span>{loginError}</span>
              </div>
            )}

            <form onSubmit={handleLoginSubmit} className="flex flex-col gap-4">
              <div>
                <label className="mb-1.5 block text-[0.78rem] font-bold uppercase tracking-wider text-mute">
                  Username
                </label>
                <input
                  type="text"
                  name="username"
                  autoComplete="username"
                  required
                  placeholder="Masukkan username admin"
                  value={loginForm.username}
                  onChange={(e) => setLoginForm({ ...loginForm, username: e.target.value })}
                  className="form-control"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-[0.78rem] font-bold uppercase tracking-wider text-mute">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showLoginPass ? 'text' : 'password'}
                    name="password"
                    autoComplete="current-password"
                    required
                    placeholder="Masukkan password admin"
                    value={loginForm.password}
                    onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                    className="form-control pr-11"
                  />
                  <button
                    type="button"
                    aria-label={showLoginPass ? 'Sembunyikan password' : 'Lihat password'}
                    onClick={() => setShowLoginPass((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-mute hover:text-heading"
                  >
                    {showLoginPass ? <FiEyeOff /> : <FiEye />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoggingIn}
                className="btn btn-primary mt-2 w-full py-3.5 text-[0.92rem] font-bold shadow-button"
              >
                {isLoggingIn ? (
                  <span className="flex items-center gap-2">
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Memverifikasi...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    Masuk ke Dashboard <FiLogIn />
                  </span>
                )}
              </button>
            </form>

            <div className="mt-6 border-t border-line pt-4 text-center">
              <span className="text-[0.75rem] text-faint">
                Dilindungi enkripsi SHA-256 &amp; penguncian otomatis 5x salah login
              </span>
            </div>
          </div>
        </div>
      </main>
    )
  }

  const uploadCount = history.filter((h) => h.action === 'upload').length
  const deleteCount = history.filter((h) => h.action === 'delete').length
  const filteredHistory =
    historyFilter === 'all'
      ? history
      : history.filter((h) => h.action === historyFilter)

  // TAMPILAN DASHBOARD KELOLA PROYEK JIKA SUDAH LOGIN (Mengikuti tema Light / Dark)
  return (
    <AdminLayout title="Dashboard Manajemen Proyek">
      {/* Peringatan jika masih memakai kredensial bawaan */}
      {!hasCustomCredentials && (
        <div className="mb-6 flex flex-col justify-between gap-4 rounded-2xl border border-amber-500/35 bg-amber-500/10 p-4 sm:flex-row sm:items-center">
          <div className="flex items-start gap-3">
            <FiShield className="mt-0.5 shrink-0 text-[1.25rem] text-amber-500" />
            <div>
              <p className="font-heading text-[0.95rem] font-bold text-heading">
                Amankan Akses Admin Khusus Anda
              </p>
              <p className="text-[0.8rem] text-mute">
                Saat ini masih memakai akun bawaan. Buat Nama Pengguna &amp; Password pribadi Anda sendiri agar tidak bisa diakses sembarang orang.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={openAccountModal}
            className="btn btn-primary shrink-0 py-2 px-4 text-[0.8rem]"
          >
            <FiKey /> Buat Username &amp; Password
          </button>
        </div>
      )}

      {/* Metric Cards Row */}
      <div className="mb-8 grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-line bg-surface p-5 shadow-card">
          <div className="flex items-center justify-between text-mute">
            <span className="text-[0.8rem] font-bold uppercase tracking-wider">Total Proyek</span>
            <FiLayers className="text-indigo text-[1.2rem]" />
          </div>
          <p className="mt-2 font-heading text-[2rem] font-extrabold text-heading">{projects.length}</p>
          <span className="text-[0.75rem] font-medium text-emerald-500">Aktif &amp; Terpublikasi</span>
        </div>

        <div className="flex flex-col justify-between rounded-2xl border border-line bg-surface p-5 shadow-card">
          <div>
            <div className="flex items-center justify-between text-mute">
              <span className="text-[0.8rem] font-bold uppercase tracking-wider">Keamanan Akun</span>
              <FiActivity className="text-emerald-500 text-[1.2rem]" />
            </div>
            <p className="mt-2 font-heading text-[1.1rem] font-bold text-heading">
              {hasCustomCredentials ? 'Akun Pribadi Aktif' : 'Akun Bawaan'}
            </p>
            <span className="text-[0.74rem] text-mute">
              Login sebagai: <strong className="text-indigo">{user?.username || 'vines'}</strong>
            </span>
          </div>
          <button
            type="button"
            onClick={openAccountModal}
            className="mt-3 inline-flex w-fit items-center gap-1.5 rounded-lg border border-indigo/30 bg-indigo-soft px-3 py-1.5 text-[0.75rem] font-bold text-indigo transition-colors hover:bg-indigo hover:text-white"
          >
            <FiKey /> {hasCustomCredentials ? 'Ubah Username & Password' : 'Buat Username & Password'}
          </button>
        </div>

        <div className="rounded-2xl border border-line bg-surface p-5 shadow-card">
          <div className="flex items-center justify-between text-mute">
            <span className="text-[0.8rem] font-bold uppercase tracking-wider">Pengunjung Website</span>
            <FiUsers className="text-indigo text-[1.2rem]" />
          </div>
          <p className="mt-2 font-heading text-[2rem] font-extrabold text-heading">
            {visitStats.totalVisits}{' '}
            <span className="text-[0.9rem] font-semibold text-mute">Orang</span>
          </p>
          <span className="text-[0.75rem] font-medium text-indigo">
            Hari ini: {visitStats.todayVisits} kunjungan masuk
          </span>
        </div>
      </div>

      {/* Daftar Portofolio UI/UX */}
      <div className="mb-8 rounded-2xl border border-line bg-surface p-6 shadow-card">
        <div className="mb-6 border-b border-line pb-4">
          <h2 className="font-heading text-[1.3rem] font-bold text-heading">
            Daftar Portofolio UI/UX
          </h2>
          <p className="mt-0.5 text-[0.82rem] text-mute">
            Kelola daftar proyek yang tampil di portofolio, sunting informasi, atau hapus proyek.
          </p>
        </div>

        {/* Project List */}
        <div className="space-y-3.5">
          {projects.length === 0 ? (
            <div className="rounded-xl border border-dashed border-line bg-bg-soft p-8 text-center text-[0.85rem] text-mute">
              Belum ada proyek di daftar portofolio saat ini.
            </div>
          ) : (
            projects.map((p, idx) => (
              <div
                key={p.id || idx}
                className="flex flex-col justify-between gap-4 rounded-xl border border-line bg-bg-soft p-4 transition-all hover:border-indigo/50 sm:flex-row sm:items-center"
              >
                <div className="flex items-center gap-4 min-w-0">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-soft font-heading text-[0.9rem] font-bold text-indigo border border-line">
                    {idx + 1}
                  </span>
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-heading text-[1.05rem] font-bold capitalize text-heading">
                        {p.title}
                      </h3>
                      <span className="rounded-full bg-indigo-soft px-2.5 py-0.5 text-[0.68rem] font-bold text-indigo">
                        {p.category}
                      </span>
                      {p.duration && (
                        <span className="inline-flex items-center gap-1 text-[0.72rem] text-mute">
                          <FiClock className="text-[11px]" /> {p.duration}
                        </span>
                      )}
                    </div>
                    {p.desc && (
                      <p className="mt-0.5 max-w-xl text-[0.8rem] text-mute line-clamp-1">
                        {p.desc}
                      </p>
                    )}
                    {p.link && (
                      <a
                        href={p.link}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-1 inline-flex items-center gap-1.5 text-[0.74rem] text-indigo hover:underline max-w-full"
                      >
                        <FiExternalLink className="shrink-0 text-[11px]" />
                        <span className="truncate">{p.link}</span>
                      </a>
                    )}
                    {p.tools && p.tools.length > 0 && (
                      <div className="mt-1 flex flex-wrap gap-1 text-[0.72rem] text-mute">
                        <span className="font-semibold">Tools:</span>
                        <span>{p.tools.join(', ')}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                  {p.link ? (
                    <a
                      href={p.link}
                      target="_blank"
                      rel="noreferrer"
                      title="Buka Link Project"
                      className="grid h-9 w-9 place-items-center rounded-lg border border-line bg-surface text-mute transition-colors hover:border-indigo/50 hover:text-heading"
                    >
                      <FiExternalLink className="text-[14px]" />
                    </a>
                  ) : (
                    <Link
                      to={`/case-study/${p.id}`}
                      target="_blank"
                      rel="noreferrer"
                      title="Lihat Halaman Studi Kasus"
                      className="grid h-9 w-9 place-items-center rounded-lg border border-line bg-surface text-mute transition-colors hover:border-indigo/50 hover:text-heading"
                    >
                      <FiEye className="text-[14px]" />
                    </Link>
                  )}
                  <button
                    type="button"
                    title="Sunting Proyek"
                    onClick={() => openEditModal(p)}
                    className="grid h-9 w-9 place-items-center rounded-lg border border-indigo/30 bg-indigo-soft text-indigo transition-colors hover:bg-indigo hover:text-white"
                  >
                    <FiEdit2 className="text-[14px]" />
                  </button>
                  <button
                    type="button"
                    title="Hapus Proyek"
                    onClick={() => handleDelete(p.id, p.title)}
                    className="grid h-9 w-9 place-items-center rounded-lg border border-rose-500/30 bg-rose-500/10 text-rose-500 transition-colors hover:bg-rose-500 hover:text-white"
                  >
                    <FiTrash2 className="text-[14px]" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Grid Bawah: Riwayat Upload/Hapus Project & Log Pengunjung Website */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Panel 1: Riwayat Penguploadan & Penghapusan Project */}
        <div className="flex flex-col rounded-2xl border border-line bg-surface p-6 shadow-card">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3 border-b border-line pb-4">
            <div>
              <h2 className="font-heading text-[1.15rem] font-bold text-heading">
                Riwayat Project
              </h2>
              <p className="text-[0.78rem] text-mute">
                Catatan waktu penguploadan &amp; penghapusan project.
              </p>
            </div>
            {history.length > 0 && (
              <button
                type="button"
                onClick={handleClearHistory}
                className="rounded-lg border border-line bg-bg-soft px-2.5 py-1 text-[0.72rem] font-semibold text-mute transition-colors hover:border-rose-500/40 hover:text-rose-500"
              >
                Bersihkan
              </button>
            )}
          </div>

          {/* Filter Tabs */}
          <div className="mb-4 flex flex-wrap gap-2">
            {[
              { id: 'all', label: `Semua (${history.length})` },
              { id: 'upload', label: `Upload (${uploadCount})` },
              { id: 'delete', label: `Dihapus (${deleteCount})` },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setHistoryFilter(tab.id)}
                className={`rounded-full px-3 py-1 text-[0.74rem] font-bold transition-colors ${
                  historyFilter === tab.id
                    ? 'bg-indigo text-white'
                    : 'border border-line bg-bg-soft text-mute hover:text-heading'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="space-y-2.5 max-h-85 overflow-y-auto pr-1">
            {filteredHistory.length === 0 ? (
              <div className="rounded-xl border border-dashed border-line bg-bg-soft p-6 text-center text-[0.8rem] text-mute">
                Belum ada riwayat penguploadan atau penghapusan project.
              </div>
            ) : (
              filteredHistory.map((item) => {
                const isUpload = item.action === 'upload'
                return (
                  <div
                    key={item.id}
                    className="flex items-start justify-between gap-3 rounded-xl border border-line bg-bg-soft p-3.5"
                  >
                    <div className="flex items-start gap-3 min-w-0">
                      <span
                        className={`mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-lg ${
                          isUpload
                            ? 'bg-emerald-500/15 text-emerald-500'
                            : 'bg-rose-500/15 text-rose-500'
                        }`}
                      >
                        {isUpload ? <FiUploadCloud /> : <FiTrash2 />}
                      </span>
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-heading text-[0.92rem] font-bold capitalize text-heading truncate">
                            {item.projectTitle}
                          </span>
                          <span
                            className={`rounded-full px-2 py-0.5 text-[0.65rem] font-bold uppercase ${
                              isUpload
                                ? 'bg-emerald-500/15 text-emerald-500'
                                : 'bg-rose-500/15 text-rose-500'
                            }`}
                          >
                            {isUpload ? 'Diupload' : 'Dihapus'}
                          </span>
                        </div>
                        <p className="mt-0.5 text-[0.74rem] text-mute">
                          Kategori: {item.category || '-'}
                        </p>
                      </div>
                    </div>

                    <div className="shrink-0 text-right">
                      <span className="inline-flex items-center gap-1 text-[0.7rem] text-mute">
                        <FiClock className="text-[10px]" />
                        {formatDateTime(item.timestamp)}
                      </span>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </div>

        {/* Panel 2: Log Pengunjung Website Portofolio */}
        <div className="flex flex-col rounded-2xl border border-line bg-surface p-6 shadow-card">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3 border-b border-line pb-4">
            <div>
              <h2 className="font-heading text-[1.15rem] font-bold text-heading">
                Pengunjung Website Masuk
              </h2>
              <p className="text-[0.78rem] text-mute">
                Total {visitStats.totalVisits} kunjungan tercatat ({visitStats.todayVisits} hari ini).
              </p>
            </div>
            {visitStats.logs.length > 0 && (
              <button
                type="button"
                onClick={handleClearVisits}
                className="rounded-lg border border-line bg-bg-soft px-2.5 py-1 text-[0.72rem] font-semibold text-mute transition-colors hover:border-rose-500/40 hover:text-rose-500"
              >
                Reset
              </button>
            )}
          </div>

          <div className="space-y-2.5 max-h-96 overflow-y-auto pr-1">
            {visitStats.logs.length === 0 ? (
              <div className="rounded-xl border border-dashed border-line bg-bg-soft p-6 text-center text-[0.8rem] text-mute">
                Belum ada pengunjung yang tercatat membuka halaman beranda portofolio.
              </div>
            ) : (
              visitStats.logs.map((visit, idx) => (
                <div
                  key={visit.id}
                  className="flex items-center justify-between gap-3 rounded-xl border border-line bg-bg-soft p-3.5"
                >
                  <div className="flex items-center gap-3">
                    <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-indigo-soft text-indigo">
                      {visit.device === 'Mobile' ? <FiSmartphone /> : <FiMonitor />}
                    </span>
                    <div>
                      <p className="text-[0.84rem] font-semibold text-heading">
                        Pengunjung #{visitStats.totalVisits - idx}
                      </p>
                      <p className="text-[0.72rem] text-mute">
                        {visit.device} &middot; {visit.browser}
                      </p>
                    </div>
                  </div>
                  <span className="inline-flex items-center gap-1 text-[0.7rem] text-mute">
                    <FiClock className="text-[10px]" />
                    {formatDateTime(visit.visitedAt)}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Panel 3: Pesan Masuk dari Form Contact (Nama Pengirim, Email, Subjek & Pesan) */}
      <div className="mt-8 rounded-2xl border border-line bg-surface p-6 shadow-card">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3 border-b border-line pb-4">
          <div>
            <h2 className="font-heading text-[1.15rem] font-bold text-heading">
              Pesan Masuk (Form Kontak)
            </h2>
            <p className="text-[0.78rem] text-mute">
              Daftar pengirim yang menghubungi Anda lewat form kontak ({contactMessages.length} pesan).
            </p>
          </div>
          {contactMessages.length > 0 && (
            <button
              type="button"
              onClick={handleClearMessages}
              className="rounded-lg border border-line bg-bg-soft px-2.5 py-1 text-[0.72rem] font-semibold text-mute transition-colors hover:border-rose-500/40 hover:text-rose-500"
            >
              Bersihkan
            </button>
          )}
        </div>

        <div className="space-y-3 max-h-90 overflow-y-auto pr-1">
          {contactMessages.length === 0 ? (
            <div className="rounded-xl border border-dashed border-line bg-bg-soft p-6 text-center text-[0.8rem] text-mute">
              Belum ada pesan yang dikirim melalui formulir kontak.
            </div>
          ) : (
            contactMessages.map((msg) => {
              const replyCount = Array.isArray(msg.replies) ? msg.replies.length : 0
              return (
                <div
                  key={msg.id}
                  onClick={() => openChatModal(msg.id)}
                  className="group cursor-pointer rounded-xl border border-line bg-bg-soft p-4 transition-all duration-200 hover:border-indigo/60 hover:bg-surface hover:shadow-card"
                >
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation()
                          openChatModal(msg.id)
                        }}
                        title="Klik untuk melanjutkan obrolan"
                        aria-label={`Lanjutkan obrolan dengan ${msg.name}`}
                        className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-indigo-soft text-indigo transition-all duration-200 group-hover:bg-indigo group-hover:text-white group-hover:scale-105"
                      >
                        <FiMessageSquare />
                      </button>
                      <div>
                        <p className="font-heading text-[0.95rem] font-bold text-heading">
                          {msg.name}
                        </p>
                        <p className="flex items-center gap-1 text-[0.74rem] text-indigo">
                          <FiMail className="text-[11px]" /> {msg.email}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span
                        className={`inline-block rounded-full px-2.5 py-0.5 text-[0.65rem] font-bold uppercase ${
                          msg.emailDelivered
                            ? 'bg-emerald-500/15 text-emerald-500'
                            : 'bg-amber-500/15 text-amber-500'
                        }`}
                      >
                        {msg.emailDelivered ? 'Terkirim ke Email' : 'Via Fallback'}
                      </span>
                      <p className="mt-1 flex items-center justify-end gap-1 text-[0.7rem] text-mute">
                        <FiClock className="text-[10px]" /> {formatDateTime(msg.sentAt)}
                      </p>
                    </div>
                  </div>
                  <p className="mt-2.5 text-[0.8rem] font-bold text-heading">
                    Subjek: {msg.subject}
                  </p>
                  <p className="mt-1 text-[0.82rem] leading-relaxed text-mute whitespace-pre-line">
                    {msg.message}
                  </p>

                  <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-line/70 pt-2.5">
                    <span className="text-[0.72rem] text-mute">
                      {replyCount > 0
                        ? `${replyCount} balasan dalam obrolan`
                        : 'Klik pesan ini untuk membalas & melanjutkan obrolan'}
                    </span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation()
                        openChatModal(msg.id)
                      }}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-soft px-3 py-1.5 text-[0.75rem] font-bold text-indigo transition-colors group-hover:bg-indigo group-hover:text-white"
                    >
                      <FiMessageSquare className="text-[12px]" /> Lanjutkan Obrolan
                    </button>
                  </div>
                </div>
              )
            })
          )}
        </div>
      </div>

      {/* Koleksi Pribadi Admin: Foto Favoritku & Lagu Favoritku */}
      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        {/* Panel Foto Favoritku */}
        <div className="flex flex-col rounded-2xl border border-line bg-surface p-6 shadow-card">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3 border-b border-line pb-4">
            <div className="flex items-center gap-2.5">
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-indigo-soft text-indigo">
                <FiCamera />
              </span>
              <div>
                <h2 className="flex items-center gap-1.5 font-heading text-[1.15rem] font-bold text-heading">
                  Foto Favoritku <FiHeart className="text-[0.9rem] text-rose-500" />
                </h2>
                <p className="text-[0.76rem] text-mute">
                  Simpan foto momen &amp; kenangan spesial ({favPhotos.length} foto).
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                setPhotoForm({ title: '', caption: '', image: '' })
                setPhotoError('')
                setIsPhotoModalOpen(true)
              }}
              className="btn btn-primary py-2 px-3.5 text-[0.78rem]"
            >
              <FiPlus /> Tambah Foto
            </button>
          </div>

          {favPhotos.length === 0 ? (
            <div className="rounded-xl border border-dashed border-line bg-bg-soft p-8 text-center text-[0.82rem] text-mute">
              Belum ada foto favorit yang disimpan. Klik <strong>+ Tambah Foto</strong> untuk mengunggah.
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 max-h-95 overflow-y-auto pr-1">
              {favPhotos.map((photo) => (
                <div
                  key={photo.id}
                  onClick={() => setPreviewPhoto(photo)}
                  className="group relative aspect-square cursor-pointer overflow-hidden rounded-xl border border-line bg-bg-soft"
                >
                  <img
                    src={photo.image}
                    alt={photo.title}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-black/80 via-black/40 to-transparent p-2.5 text-white">
                    <p className="truncate text-[0.75rem] font-bold">{photo.title}</p>
                    {photo.caption && (
                      <p className="truncate text-[0.65rem] text-slate-300">{photo.caption}</p>
                    )}
                  </div>
                  <button
                    type="button"
                    title="Hapus Foto"
                    aria-label="Hapus Foto"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleDeleteFavPhoto(photo.id, photo.title)
                    }}
                    className="absolute right-2 top-2 grid h-7 w-7 place-items-center rounded-lg bg-black/65 text-white opacity-85 transition-all hover:bg-rose-500 hover:opacity-100"
                  >
                    <FiTrash2 className="text-[11px]" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Panel Lagu Favoritku (Spotify) */}
        <div className="flex flex-col rounded-2xl border border-line bg-surface p-6 shadow-card">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3 border-b border-line pb-4">
            <div className="flex items-center gap-2.5">
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-[#1DB954]/15 text-[#1DB954] text-[1.15rem]">
                <FaSpotify />
              </span>
              <div>
                <h2 className="flex items-center gap-1.5 font-heading text-[1.15rem] font-bold text-heading">
                  Lagu Favoritku <FiHeart className="text-[0.9rem] text-rose-500" />
                </h2>
                <p className="text-[0.76rem] text-mute">
                  Playlist lagu favorit dari Spotify ({favSongs.length} lagu).
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => openSpotifyDirect()}
                className="btn py-2 px-3 text-[0.76rem] bg-[#1DB954] text-white hover:bg-[#1aa34a]"
                title="Langsung buka Spotify untuk memilih lagu"
              >
                <FaSpotify /> Buka Spotify
              </button>
              <button
                type="button"
                onClick={() => {
                  setSongForm({ title: '', artist: '', url: '', thumbnail: '' })
                  setSongError('')
                  setIsSongModalOpen(true)
                }}
                className="btn btn-primary py-2 px-3.5 text-[0.78rem]"
              >
                <FiPlus /> Tambah Lagu
              </button>
            </div>
          </div>

          {favSongs.length === 0 ? (
            <div className="rounded-xl border border-dashed border-line bg-bg-soft p-8 text-center text-[0.82rem] text-mute">
              Belum ada lagu favorit. Klik <strong>Buka Spotify</strong> untuk mencari lagu atau <strong>+ Tambah Lagu</strong> untuk menyimpannya ke daftar.
            </div>
          ) : (
            <div className="space-y-3 max-h-95 overflow-y-auto pr-1">
              {favSongs.map((song) => {
                const embedUrl = getSpotifyEmbedUrl(song.url)
                const isPlaying = playingSongId === song.id

                return (
                  <div
                    key={song.id}
                    className="rounded-xl border border-line bg-bg-soft p-3.5 transition-colors hover:border-[#1DB954]/50"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        {song.thumbnail ? (
                          <img
                            src={song.thumbnail}
                            alt={song.title}
                            className="h-10 w-10 shrink-0 rounded-lg object-cover border border-line"
                          />
                        ) : (
                          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[#1DB954]/15 text-[#1DB954]">
                            <FaSpotify className="text-[1.1rem]" />
                          </span>
                        )}
                        <div className="min-w-0">
                          <p className="truncate font-heading text-[0.94rem] font-bold text-heading">
                            {song.title}
                          </p>
                          <p className="truncate text-[0.74rem] text-mute">
                            {song.artist || 'Spotify Track'}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        {embedUrl && (
                          <button
                            type="button"
                            title={isPlaying ? 'Tutup pemutar Spotify' : 'Putar preview Spotify'}
                            onClick={() => setPlayingSongId(isPlaying ? null : song.id)}
                            className={`grid h-8 w-8 place-items-center rounded-lg transition-colors ${
                              isPlaying
                                ? 'bg-[#1DB954] text-white'
                                : 'border border-[#1DB954]/30 bg-[#1DB954]/10 text-[#1DB954] hover:bg-[#1DB954] hover:text-white'
                            }`}
                          >
                            {isPlaying ? <FiPause className="text-[13px]" /> : <FiPlay className="text-[13px]" />}
                          </button>
                        )}
                        {song.url && (
                          <a
                            href={song.url}
                            target="_blank"
                            rel="noreferrer"
                            title="Buka di Spotify"
                            className="grid h-8 w-8 place-items-center rounded-lg border border-line bg-surface text-[#1DB954] transition-colors hover:border-[#1DB954]"
                          >
                            <FiExternalLink className="text-[13px]" />
                          </a>
                        )}
                        <button
                          type="button"
                          title="Hapus Lagu"
                          onClick={() => handleDeleteFavSong(song.id, song.title)}
                          className="grid h-8 w-8 place-items-center rounded-lg border border-rose-500/30 bg-rose-500/10 text-rose-500 transition-colors hover:bg-rose-500 hover:text-white"
                        >
                          <FiTrash2 className="text-[13px]" />
                        </button>
                      </div>
                    </div>

                    {isPlaying && embedUrl && (
                      <div className="mt-3 overflow-hidden rounded-xl border border-line">
                        <iframe
                          src={embedUrl}
                          title={`Spotify ${song.title}`}
                          width="100%"
                          height="152"
                          frameBorder="0"
                          allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                          loading="lazy"
                        />
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>

      {/* MODAL EDIT PROYEK */}
      {editingId && (
        <div
          className="fixed inset-0 z-1200 grid place-items-center bg-black/75 p-4 backdrop-blur-md overflow-y-auto"
          onClick={() => setEditingId(null)}
        >
          <div
            className="relative my-8 w-full max-w-lg rounded-3xl border border-line bg-surface p-6 sm:p-8 shadow-pop text-heading"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-5 flex items-center justify-between border-b border-line pb-3">
              <h3 className="font-heading text-[1.3rem] font-bold text-heading">
                Sunting Data Proyek
              </h3>
              <button
                type="button"
                onClick={() => setEditingId(null)}
                className="grid h-8 w-8 place-items-center rounded-full bg-soft text-mute hover:text-heading"
              >
                <FiX />
              </button>
            </div>

            <form onSubmit={handleProjectSubmit} className="flex flex-col gap-3.5">
              <div>
                <label className="text-[0.75rem] font-bold uppercase tracking-wider text-mute">
                  Nama Proyek
                </label>
                <input
                  type="text"
                  required
                  value={projectForm.title}
                  onChange={(e) => setProjectForm({ ...projectForm, title: e.target.value })}
                  placeholder="Misal: Dashboard Administrasi Sekolah"
                  className="form-control mt-1"
                />
                {formErrors.title && (
                  <p className="mt-1 text-[0.72rem] text-rose-500">{formErrors.title}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[0.75rem] font-bold uppercase tracking-wider text-mute">
                    Kategori
                  </label>
                  <input
                    type="text"
                    value={projectForm.category}
                    onChange={(e) => setProjectForm({ ...projectForm, category: e.target.value })}
                    placeholder="Website / Dashboard / Mobile"
                    className="form-control mt-1"
                  />
                </div>
                <div>
                  <label className="text-[0.75rem] font-bold uppercase tracking-wider text-mute">
                    Durasi Pengerjaan
                  </label>
                  <input
                    type="text"
                    value={projectForm.duration}
                    onChange={(e) => setProjectForm({ ...projectForm, duration: e.target.value })}
                    placeholder="Contoh: 3 Minggu"
                    className="form-control mt-1"
                  />
                </div>
              </div>

              <div>
                <label className="text-[0.75rem] font-bold uppercase tracking-wider text-mute">
                  Link Project
                </label>
                <input
                  type="text"
                  value={projectForm.link}
                  onChange={(e) => setProjectForm({ ...projectForm, link: e.target.value })}
                  placeholder="https://figma.com/... atau https://domainanda.com"
                  className="form-control mt-1"
                />
              </div>

              <div>
                <label className="text-[0.75rem] font-bold uppercase tracking-wider text-mute">
                  Deskripsi Proyek (Opsional)
                </label>
                <textarea
                  rows="3"
                  value={projectForm.desc}
                  onChange={(e) => setProjectForm({ ...projectForm, desc: e.target.value })}
                  placeholder="Jelaskan tujuan dan solusi UI/UX yang dibuat..."
                  className="form-control mt-1"
                />
              </div>

              <div>
                <label className="text-[0.75rem] font-bold uppercase tracking-wider text-mute">
                  Tools yang Digunakan (Pisahkan Koma)
                </label>
                <input
                  type="text"
                  value={projectForm.tools}
                  onChange={(e) => setProjectForm({ ...projectForm, tools: e.target.value })}
                  placeholder="Figma, React, JavaScript, HTML, CSS"
                  className="form-control mt-1"
                />
              </div>

              {/* Upload Gambar Preview */}
              <div>
                <label className="text-[0.75rem] font-bold uppercase tracking-wider text-mute">
                  Preview Gambar Desain (Opsional)
                </label>
                <div className="mt-1 flex items-center gap-3">
                  <input
                    type="file"
                    ref={imageInputRef}
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => imageInputRef.current?.click()}
                    className="btn btn-outline py-2 px-3 text-[0.8rem]"
                  >
                    <FiImage /> Pilih Gambar Baru
                  </button>
                  {projectForm.image && (
                    <span className="text-[0.75rem] text-emerald-500 font-semibold flex items-center gap-1">
                      <FiCheck /> Gambar Terpilih
                    </span>
                  )}
                </div>
                {projectForm.image && (
                  <div className="mt-2.5 h-28 w-full overflow-hidden rounded-xl border border-line bg-black/20">
                    <img
                      src={projectForm.image}
                      alt="Preview"
                      className="h-full w-full object-cover"
                    />
                  </div>
                )}
              </div>

              {/* Submit Buttons */}
              <div className="mt-4 flex gap-3 border-t border-line pt-4">
                <button type="submit" className="btn btn-primary flex-1">
                  <FiCheck /> Simpan Data Proyek
                </button>
                <button
                  type="button"
                  onClick={() => setEditingId(null)}
                  className="btn btn-outline"
                >
                  Batal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL BUAT / UBAH USERNAME & PASSWORD ADMIN */}
      {isAccountModalOpen && (
        <div
          className="fixed inset-0 z-1200 grid place-items-center bg-black/75 p-4 backdrop-blur-md overflow-y-auto"
          onClick={() => setIsAccountModalOpen(false)}
        >
          <div
            className="relative my-8 w-full max-w-md rounded-3xl border border-line bg-surface p-6 sm:p-7 shadow-pop text-heading"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-5 flex items-center justify-between border-b border-line pb-3">
              <div className="flex items-center gap-2.5">
                <span className="grid h-9 w-9 place-items-center rounded-xl bg-indigo-soft text-indigo">
                  <FiKey />
                </span>
                <div>
                  <h3 className="font-heading text-[1.1rem] font-bold text-heading">
                    Akun Pribadi Admin
                  </h3>
                  <p className="text-[0.74rem] text-mute">
                    Buat nama pengguna &amp; password khusus milik Anda sendiri.
                  </p>
                </div>
              </div>
              <button
                type="button"
                aria-label="Tutup modal akun"
                onClick={() => setIsAccountModalOpen(false)}
                className="grid h-8 w-8 place-items-center rounded-full bg-soft text-mute hover:text-heading"
              >
                <FiX />
              </button>
            </div>

            {accountError && (
              <div className="mb-4 flex items-center gap-2 rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-[0.8rem] font-medium text-rose-500">
                <FiAlertCircle className="shrink-0" />
                <span>{accountError}</span>
              </div>
            )}

            {accountSuccess && (
              <div className="mb-4 flex items-start gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-[0.8rem] font-medium text-emerald-500">
                <FiCheck className="mt-0.5 shrink-0" />
                <span>{accountSuccess}</span>
              </div>
            )}

            <form onSubmit={handleAccountSubmit} className="flex flex-col gap-3.5">
              <div>
                <label className="text-[0.75rem] font-bold uppercase tracking-wider text-mute">
                  Nama Pengguna Baru (Username)
                </label>
                <input
                  type="text"
                  required
                  minLength={3}
                  value={accountForm.username}
                  onChange={(e) => setAccountForm({ ...accountForm, username: e.target.value })}
                  placeholder="Minimal 3 karakter"
                  className="form-control mt-1"
                />
              </div>

              <div>
                <label className="text-[0.75rem] font-bold uppercase tracking-wider text-mute">
                  Password Baru
                </label>
                <div className="relative mt-1">
                  <input
                    type={showNewPass ? 'text' : 'password'}
                    required
                    minLength={6}
                    value={accountForm.password}
                    onChange={(e) => setAccountForm({ ...accountForm, password: e.target.value })}
                    placeholder="Minimal 6 karakter"
                    className="form-control pr-11"
                  />
                  <button
                    type="button"
                    aria-label={showNewPass ? 'Sembunyikan password' : 'Lihat password'}
                    onClick={() => setShowNewPass((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-mute hover:text-heading"
                  >
                    {showNewPass ? <FiEyeOff /> : <FiEye />}
                  </button>
                </div>
              </div>

              <div>
                <label className="text-[0.75rem] font-bold uppercase tracking-wider text-mute">
                  Ulangi Password Baru
                </label>
                <input
                  type={showNewPass ? 'text' : 'password'}
                  required
                  minLength={6}
                  value={accountForm.confirmPassword}
                  onChange={(e) =>
                    setAccountForm({ ...accountForm, confirmPassword: e.target.value })
                  }
                  placeholder="Ketik ulang password baru"
                  className="form-control mt-1"
                />
              </div>

              <div className="mt-3 flex gap-3 border-t border-line pt-4">
                <button
                  type="submit"
                  disabled={isSavingAccount}
                  className="btn btn-primary flex-1"
                >
                  <FiCheck /> {isSavingAccount ? 'Menyimpan...' : 'Simpan Akun Saya'}
                </button>
                <button
                  type="button"
                  onClick={() => setIsAccountModalOpen(false)}
                  className="btn btn-outline"
                >
                  Tutup
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL TAMBAH FOTO FAVORIT */}
      {isPhotoModalOpen && (
        <div
          className="fixed inset-0 z-1200 grid place-items-center bg-black/75 p-4 backdrop-blur-md overflow-y-auto"
          onClick={() => setIsPhotoModalOpen(false)}
        >
          <div
            className="relative my-8 w-full max-w-md rounded-3xl border border-line bg-surface p-6 shadow-pop text-heading animate-modal-in"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex items-center justify-between border-b border-line pb-3">
              <h3 className="flex items-center gap-2 font-heading text-[1.15rem] font-bold text-heading">
                <FiCamera className="text-indigo" /> Tambah Foto Favorit
              </h3>
              <button
                type="button"
                onClick={() => setIsPhotoModalOpen(false)}
                className="grid h-8 w-8 place-items-center rounded-full bg-soft text-mute hover:text-heading"
              >
                <FiX />
              </button>
            </div>

            {photoError && (
              <div className="mb-3 flex items-center gap-2 rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-[0.78rem] font-medium text-rose-500">
                <FiAlertCircle className="shrink-0" />
                <span>{photoError}</span>
              </div>
            )}

            <form onSubmit={handleSaveFavPhoto} className="flex flex-col gap-3.5">
              <div>
                <label className="text-[0.75rem] font-bold uppercase tracking-wider text-mute">
                  Pilih Foto <span className="text-rose-500">*</span>
                </label>
                <input
                  ref={favPhotoInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handlePickFavPhoto}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => favPhotoInputRef.current?.click()}
                  className="btn btn-outline mt-1.5 w-full py-2.5 text-[0.82rem]"
                >
                  <FiImage /> {photoForm.image ? 'Ganti Foto' : 'Pilih Foto dari Perangkat'}
                </button>
                {photoForm.image && (
                  <div className="mt-2.5 h-44 w-full overflow-hidden rounded-xl border border-line bg-black/20">
                    <img
                      src={photoForm.image}
                      alt="Preview Foto Favorit"
                      className="h-full w-full object-cover"
                    />
                  </div>
                )}
              </div>

              <div>
                <label className="text-[0.75rem] font-bold uppercase tracking-wider text-mute">
                  Judul / Nama Momen
                </label>
                <input
                  type="text"
                  value={photoForm.title}
                  onChange={(e) => setPhotoForm({ ...photoForm, title: e.target.value })}
                  placeholder="Contoh: Kegiatan Pramuka SMK"
                  className="form-control mt-1"
                />
              </div>

              <div>
                <label className="text-[0.75rem] font-bold uppercase tracking-wider text-mute">
                  Catatan Singkat (Opsional)
                </label>
                <input
                  type="text"
                  value={photoForm.caption}
                  onChange={(e) => setPhotoForm({ ...photoForm, caption: e.target.value })}
                  placeholder="Kenangan seru bersama teman-teman..."
                  className="form-control mt-1"
                />
              </div>

              <div className="mt-2 flex gap-3 border-t border-line pt-4">
                <button type="submit" className="btn btn-primary flex-1">
                  <FiCheck /> Simpan Foto
                </button>
                <button
                  type="button"
                  onClick={() => setIsPhotoModalOpen(false)}
                  className="btn btn-outline"
                >
                  Batal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* LIGHTBOX PREVIEW FOTO FAVORIT */}
      {previewPhoto && (
        <div
          className="fixed inset-0 z-1300 grid place-items-center bg-black/85 p-4 backdrop-blur-md"
          onClick={() => setPreviewPhoto(null)}
        >
          <div
            className="relative w-full max-w-2xl overflow-hidden rounded-3xl border border-line bg-surface shadow-pop animate-modal-in"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setPreviewPhoto(null)}
              className="absolute right-4 top-4 z-10 grid h-9 w-9 place-items-center rounded-full bg-black/60 text-white hover:bg-black/80"
            >
              <FiX />
            </button>
            <img
              src={previewPhoto.image}
              alt={previewPhoto.title}
              className="max-h-[70vh] w-full object-contain bg-black/90"
            />
            <div className="p-5">
              <h4 className="font-heading text-[1.15rem] font-bold text-heading">
                {previewPhoto.title}
              </h4>
              {previewPhoto.caption && (
                <p className="mt-1 text-[0.86rem] text-mute">{previewPhoto.caption}</p>
              )}
              <p className="mt-2 flex items-center gap-1.5 text-[0.74rem] text-faint">
                <FiClock className="text-[11px]" /> Disimpan pada {formatDateTime(previewPhoto.createdAt)}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* MODAL TAMBAH LAGU FAVORIT (SPOTIFY) */}
      {isSongModalOpen && (
        <div
          className="fixed inset-0 z-1200 grid place-items-center bg-black/75 p-4 backdrop-blur-md overflow-y-auto"
          onClick={() => setIsSongModalOpen(false)}
        >
          <div
            className="relative my-8 w-full max-w-md rounded-3xl border border-line bg-surface p-6 shadow-pop text-heading animate-modal-in"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex items-center justify-between border-b border-line pb-3">
              <h3 className="flex items-center gap-2 font-heading text-[1.15rem] font-bold text-heading">
                <FaSpotify className="text-[#1DB954] text-[1.3rem]" /> Tambah Lagu Spotify
              </h3>
              <button
                type="button"
                onClick={() => setIsSongModalOpen(false)}
                className="grid h-8 w-8 place-items-center rounded-full bg-soft text-mute hover:text-heading"
              >
                <FiX />
              </button>
            </div>

            {songError && (
              <div className="mb-3 flex items-center gap-2 rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-[0.78rem] font-medium text-rose-500">
                <FiAlertCircle className="shrink-0" />
                <span>{songError}</span>
              </div>
            )}

            <div className="mb-4 rounded-2xl border border-[#1DB954]/25 bg-[#1DB954]/10 p-3.5">
              <p className="text-[0.78rem] text-mute mb-2.5">
                Klik tombol di bawah untuk langsung masuk ke <strong>Spotify</strong>, pilih lagunya, lalu salin link lagunya ke sini:
              </p>
              <button
                type="button"
                onClick={() => openSpotifyDirect(songForm.title)}
                className="btn w-full py-2.5 text-[0.84rem] bg-[#1DB954] text-white hover:bg-[#1aa34a]"
              >
                <FaSpotify className="text-[1.1rem]" /> Buka &amp; Pilih Lagu di Spotify
              </button>
            </div>

            <form onSubmit={handleSaveFavSong} className="flex flex-col gap-3.5">
              <div>
                <label className="text-[0.75rem] font-bold uppercase tracking-wider text-mute">
                  Link Lagu Spotify <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={songForm.url}
                  onChange={(e) => handleSpotifyUrlChange(e.target.value)}
                  placeholder="https://open.spotify.com/track/..."
                  className="form-control mt-1"
                />
              </div>

              {songForm.thumbnail && (
                <div className="flex items-center gap-3 rounded-xl border border-line bg-bg-soft p-2.5">
                  <img
                    src={songForm.thumbnail}
                    alt="Cover Spotify"
                    className="h-12 w-12 rounded-lg object-cover"
                  />
                  <div className="min-w-0">
                    <p className="text-[0.72rem] font-bold uppercase text-[#1DB954]">
                      Terdeteksi dari Spotify
                    </p>
                    <p className="truncate text-[0.82rem] font-semibold text-heading">
                      {songForm.title || 'Track Spotify'}
                    </p>
                  </div>
                </div>
              )}

              <div>
                <label className="text-[0.75rem] font-bold uppercase tracking-wider text-mute">
                  Judul Lagu <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={songForm.title}
                  onChange={(e) => setSongForm({ ...songForm, title: e.target.value })}
                  placeholder="Otomatis terisi dari link atau ketik manual"
                  className="form-control mt-1"
                />
              </div>

              <div>
                <label className="text-[0.75rem] font-bold uppercase tracking-wider text-mute">
                  Penyanyi / Artis
                </label>
                <input
                  type="text"
                  value={songForm.artist}
                  onChange={(e) => setSongForm({ ...songForm, artist: e.target.value })}
                  placeholder="Contoh: Pamungkas / Hindia"
                  className="form-control mt-1"
                />
              </div>

              <div className="mt-2 flex gap-3 border-t border-line pt-4">
                <button type="submit" className="btn btn-primary flex-1">
                  <FiCheck /> Simpan Lagu
                </button>
                <button
                  type="button"
                  onClick={() => setIsSongModalOpen(false)}
                  className="btn btn-outline"
                >
                  Batal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL LANJUTKAN OBROLAN / CHAT PESAN MASUK */}
      {activeChatMsg && (
        <div
          className="fixed inset-0 z-1300 grid place-items-center bg-black/75 p-4 backdrop-blur-md"
          onClick={closeChatModal}
        >
          <div
            className="flex max-h-[88vh] w-full max-w-2xl flex-col overflow-hidden rounded-3xl border border-line bg-surface shadow-pop text-heading animate-modal-in"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header Obrolan */}
            <div className="border-b border-line bg-surface px-6 py-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-indigo-soft text-indigo text-[1.15rem]">
                    <FiMessageSquare />
                  </span>
                  <div className="min-w-0">
                    <h3 className="truncate font-heading text-[1.15rem] font-bold text-heading">
                      {activeChatMsg.name}
                    </h3>
                    <p className="flex items-center gap-1.5 truncate text-[0.78rem] text-indigo">
                      <FiMail className="shrink-0 text-[12px]" /> {activeChatMsg.email}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={closeChatModal}
                  aria-label="Tutup obrolan"
                  className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-line text-mute transition-colors hover:border-indigo hover:text-indigo"
                >
                  <FiX />
                </button>
              </div>

              <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
                <span className="inline-flex items-center rounded-lg bg-bg-soft px-2.5 py-1 text-[0.74rem] font-semibold text-heading border border-line">
                  Subjek: {activeChatMsg.subject}
                </span>
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => openEmailReply(activeChatMsg, chatReplyText)}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-indigo/30 bg-indigo-soft px-2.5 py-1 text-[0.72rem] font-bold text-indigo transition-colors hover:bg-indigo hover:text-white"
                  >
                    <FiMail className="text-[11px]" /> Balas via Gmail
                  </button>
                  <a
                    href={`mailto:${activeChatMsg.email}?subject=${encodeURIComponent(
                      `Re: ${activeChatMsg.subject || 'Pesan Portofolio'}`,
                    )}`}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-line bg-bg-soft px-2.5 py-1 text-[0.72rem] font-semibold text-mute transition-colors hover:border-indigo/40 hover:text-indigo"
                  >
                    <FiExternalLink className="text-[11px]" /> App Email
                  </a>
                </div>
              </div>
            </div>

            {/* Area Riwayat Obrolan */}
            <div className="flex-1 space-y-3 overflow-y-auto bg-bg-soft/70 p-5">
              {/* Pesan Awal Pengirim */}
              <div className="flex justify-start">
                <div className="max-w-[85%] rounded-2xl rounded-tl-sm border border-line bg-surface px-4 py-3 shadow-xs">
                  <div className="mb-1 flex items-center justify-between gap-4">
                    <span className="text-[0.72rem] font-bold text-indigo">
                      {activeChatMsg.name}
                    </span>
                    <span className="text-[0.65rem] text-mute">
                      {formatDateTime(activeChatMsg.sentAt)}
                    </span>
                  </div>
                  <p className="text-[0.84rem] leading-relaxed text-heading whitespace-pre-line">
                    {activeChatMsg.message}
                  </p>
                </div>
              </div>

              {/* Balasan Lanjutan */}
              {Array.isArray(activeChatMsg.replies) &&
                activeChatMsg.replies.map((rep) => (
                  <div key={rep.id} className="flex justify-end">
                    <div className="max-w-[85%] rounded-2xl rounded-tr-sm bg-indigo px-4 py-3 text-white shadow-xs">
                      <div className="mb-1 flex items-center justify-between gap-4">
                        <span className="text-[0.72rem] font-bold text-white/90">
                          Anda (Admin){rep.via === 'gmail' ? ' · via Gmail' : ''}
                        </span>
                        <span className="text-[0.65rem] text-white/75">
                          {formatDateTime(rep.sentAt)}
                        </span>
                      </div>
                      <p className="text-[0.84rem] leading-relaxed whitespace-pre-line">
                        {rep.text}
                      </p>
                      <div className="mt-2 flex justify-end border-t border-white/15 pt-1.5">
                        <button
                          type="button"
                          onClick={() => openEmailReply(activeChatMsg, rep.text)}
                          className="inline-flex items-center gap-1 text-[0.68rem] font-semibold text-white/85 transition-colors hover:text-white"
                        >
                          <FiExternalLink className="text-[10px]" /> Teruskan ke Gmail
                        </button>
                      </div>
                    </div>
                  </div>
                ))}

              <div ref={chatThreadEndRef} />
            </div>

            {/* Form Input Lanjutkan Obrolan */}
            <form
              onSubmit={(e) => handleSendChatReply(e, { alsoOpenGmail: false })}
              className="border-t border-line bg-surface p-4"
            >
              {chatNotice && (
                <p className="mb-2 flex items-center gap-1.5 text-[0.74rem] font-medium text-emerald-500">
                  <FiCheck /> {chatNotice}
                </p>
              )}

              <textarea
                rows={2}
                value={chatReplyText}
                onChange={(e) => {
                  setChatReplyText(e.target.value)
                  if (chatNotice) setChatNotice('')
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault()
                    handleSendChatReply(null, { alsoOpenGmail: false })
                  }
                }}
                placeholder={`Tulis pesan balasan untuk melanjutkan obrolan dengan ${activeChatMsg.name}... (Enter untuk kirim)`}
                className="form-control min-h-18 resize-none text-[0.85rem]"
              />

              <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={(e) => handleSendChatReply(e, { alsoOpenGmail: true })}
                  disabled={!chatReplyText.trim()}
                  className="btn btn-outline py-2 px-3.5 text-[0.78rem] disabled:opacity-50"
                >
                  <FiMail /> Kirim &amp; Buka Gmail
                </button>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={closeChatModal}
                    className="btn btn-outline py-2 px-3.5 text-[0.78rem]"
                  >
                    Tutup
                  </button>
                  <button
                    type="submit"
                    disabled={!chatReplyText.trim()}
                    className="btn btn-primary py-2 px-4 text-[0.8rem] disabled:opacity-50"
                  >
                    <FiSend /> Kirim Pesan
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  )
}
