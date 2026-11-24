import { useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import {
  FiArrowRight,
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiX,
  FiExternalLink,
  FiClock,
  FiCheckCircle,
  FiImage,
} from 'react-icons/fi'
import useProjects from '../hooks/useProjects'
import useAuth from '../auth/useAuth'
import ProjectMockup from './ProjectMockup'
import { validateProjectForm } from '../utils/validation'

const BUILTIN_IDS = ['school-admin', 'mobile-ecommerce', 'financial-dashboard']

function getSmartLinkPreview(rawLink) {
  if (!rawLink) return null
  const targetUrl = normalizeLink(rawLink)
  if (!targetUrl) return null

  // 1. Link YouTube -> langsung ambil thumbnail resolusi tinggi
  const ytMatch = targetUrl.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/,
  )
  if (ytMatch) {
    return {
      type: 'image',
      src: `https://img.youtube.com/vi/${ytMatch[1]}/hqdefault.jpg`,
    }
  }

  // 2. Link file/design/prototype Figma -> gunakan Figma official embed
  if (/figma\.com\/(file|design|proto|board)\//i.test(targetUrl)) {
    return {
      type: 'iframe',
      src: `https://www.figma.com/embed?embed_host=share&url=${encodeURIComponent(targetUrl)}`,
    }
  }

  // 3. Link website lainnya -> ambil screenshot live tampilan web via thum.io
  return {
    type: 'image',
    src: `https://image.thum.io/get/width/800/crop/520/${targetUrl}`,
  }
}

function LinkOrMockupPreview({ p }) {
  const preview = getSmartLinkPreview(p.link)
  const [loaded, setLoaded] = useState(false)
  const [failed, setFailed] = useState(false)

  if (!preview || failed) {
    return (
      <div className="flex h-full items-start justify-center px-3.5 pt-10">
        <ProjectMockup variant="custom" project={p} className="w-full" />
      </div>
    )
  }

  return (
    <div className="relative h-full w-full">
      {!loaded && (
        <div className="flex h-full items-start justify-center px-3.5 pt-10">
          <ProjectMockup variant="custom" project={p} className="w-full" />
        </div>
      )}

      {preview.type === 'iframe' ? (
        <iframe
          src={preview.src}
          title={`Preview desain ${p.title}`}
          onLoad={() => setLoaded(true)}
          className={`pointer-events-none h-full w-full border-0 transition-opacity duration-500 ${
            loaded ? 'opacity-100' : 'opacity-0 absolute inset-0'
          }`}
          loading="lazy"
        />
      ) : (
        <img
          src={preview.src}
          alt={`Tampilan desain ${p.title}`}
          onLoad={() => setLoaded(true)}
          onError={() => setFailed(true)}
          className={`h-full w-full object-cover object-top transition-opacity duration-500 ${
            loaded ? 'opacity-100' : 'opacity-0 absolute inset-0'
          }`}
        />
      )}
    </div>
  )
}

function Preview({ p }) {
  if (p.image) {
    return (
      <img
        src={p.image}
        alt={p.title}
        className="h-full w-full object-cover object-top"
      />
    )
  }

  const isCustomProject = p.isCustom || p.variant === 'custom' || !BUILTIN_IDS.includes(p.id)
  if (isCustomProject) {
    return <LinkOrMockupPreview key={`${p.id}-${p.link || ''}`} p={p} />
  }

  if (p.frame === 'browser') {
    return (
      <div className="flex h-full items-start justify-center px-3.5 pt-10">
        <ProjectMockup variant={p.variant} project={p} frame="browser" className="w-full" />
      </div>
    )
  }

  return (
    <div className="flex h-full items-start justify-center pt-5">
      <ProjectMockup variant={p.variant} project={p} frame="phone" />
    </div>
  )
}

function normalizeLink(raw) {
  const trimmed = String(raw || '').trim()
  if (!trimmed) return ''
  return /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`
}

function formatHost(raw) {
  if (!raw) return ''
  try {
    const parsed = new URL(normalizeLink(raw))
    return parsed.hostname.replace(/^www\./i, '')
  } catch {
    return raw.replace(/^https?:\/\//i, '').split('/')[0]
  }
}

function readAndCompressImage(file, onDone) {
  const reader = new FileReader()
  reader.onload = () => {
    const dataUrl = reader.result
    if (typeof dataUrl !== 'string' || file.size <= 450 * 1024) {
      onDone(dataUrl)
      return
    }
    const img = new Image()
    img.onload = () => {
      const maxW = 1200
      const scale = img.width > maxW ? maxW / img.width : 1
      const canvas = document.createElement('canvas')
      canvas.width = Math.round(img.width * scale)
      canvas.height = Math.round(img.height * scale)
      const ctx = canvas.getContext('2d')
      if (!ctx) {
        onDone(dataUrl)
        return
      }
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
      onDone(canvas.toDataURL('image/jpeg', 0.84))
    }
    img.onerror = () => onDone(dataUrl)
    img.src = dataUrl
  }
  reader.readAsDataURL(file)
}

export default function Projects() {
  const { projects, addProject, updateProject, deleteProject } = useProjects()
  const { isAdmin } = useAuth()
  const [selectedProject, setSelectedProject] = useState(null)
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [editingProject, setEditingProject] = useState(null)
  const [formError, setFormError] = useState('')
  const [form, setForm] = useState({
    title: '',
    duration: '',
    category: 'Website',
    link: '',
    image: '',
  })
  const coverRef = useRef(null)
  const editCoverRef = useRef(null)

  const update = (e) => {
    if (formError) setFormError('')
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const onCover = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    readAndCompressImage(file, (imgData) => setForm((f) => ({ ...f, image: imgData })))
    e.target.value = ''
  }

  const openEdit = (p) => {
    setEditingProject({
      id: p.id,
      isCustom: Boolean(p.isCustom || !BUILTIN_IDS.includes(p.id)),
      title: p.title || '',
      subtitle: p.subtitle || '',
      category: p.category || 'Website',
      desc: p.desc || '',
      role: p.role || 'UI/UX Designer',
      duration: p.duration || '3 Minggu',
      link: p.link || '',
      tags: Array.isArray(p.tools) ? p.tools.join(', ') : p.tools || '',
      image: p.image || '',
    })
  }

  const onEditCover = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    readAndCompressImage(file, (imgData) =>
      setEditingProject((prev) => ({ ...prev, image: imgData })),
    )
    e.target.value = ''
  }

  const submitEdit = (e) => {
    e.preventDefault()
    if (!editingProject) return
    const normalized = {
      ...editingProject,
      category: editingProject.category.trim() || 'Website',
    }
    const { isValid } = validateProjectForm(normalized)
    if (!isValid) return

    updateProject(editingProject.id, {
      title: editingProject.title.trim(),
      subtitle: editingProject.subtitle.trim(),
      category: normalized.category,
      desc: editingProject.desc.trim(),
      role: editingProject.role.trim() || 'UI/UX Designer',
      duration: editingProject.duration.trim() || '3 Minggu',
      link: normalizeLink(editingProject.link),
      tools: editingProject.tags
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean),
      image: editingProject.image || undefined,
    })
    setEditingProject(null)
  }

  const submit = (e) => {
    e.preventDefault()
    const normalized = {
      ...form,
      category: form.category.trim() || 'Website',
    }
    const { isValid, errors } = validateProjectForm(normalized)
    if (!isValid) {
      setFormError(Object.values(errors)[0] || 'Mohon isi nama project.')
      return
    }

    const projectLink = normalizeLink(form.link)

    addProject({
      title: form.title.trim(),
      subtitle: normalized.category,
      category: normalized.category,
      desc: '',
      role: 'UI/UX Designer',
      duration: form.duration.trim() || '3 Minggu',
      link: projectLink,
      tools: [],
      image: form.image || undefined,
      variant: 'custom',
      frame: 'browser',
      isCustom: true,
    })
    setForm({
      title: '',
      duration: '',
      category: 'Website',
      link: '',
      image: '',
    })
    setFormError('')
    setIsAddOpen(false)
  }

  const remove = (id, title) => {
    if (window.confirm(`Hapus project "${title}"?`)) deleteProject(id)
  }

  return (
    <section id="projects" className="section bg-bg relative">
      <div className="container">
        {/* Section Head */}
        <div className="section-head" data-aos="fade-up">
          <span className="section-eyebrow">Portfolio &amp; Studi Kasus</span>
          <h2 className="section-title">Galeri Karya UI/UX</h2>
          <p className="section-sub">
            Kumpulan proyek pilihan mulai dari website, dashboard analitik, hingga aplikasi mobile
            dengan pendekatan human-centered design.
          </p>
        </div>

        {/* Tombol Tambah Proyek */}
        <div className="mb-8 flex justify-end" data-aos="fade-up">
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => {
              setFormError('')
              setIsAddOpen(true)
            }}
          >
            <FiPlus /> Tambah Proyek
          </button>
        </div>

        {/* Project Cards Grid */}
        {projects.length === 0 ? (
          <div
            className="rounded-2xl border border-line bg-surface/60 p-10 text-center"
            data-aos="fade-up"
          >
            <p className="font-heading text-[1.05rem] font-bold text-heading">
              Belum ada proyek yang ditampilkan
            </p>
            <p className="mt-1.5 text-[0.86rem] text-mute">
              Klik tombol <strong className="text-indigo">+ Tambah Proyek</strong> di kanan atas untuk menambahkan proyek terbaru Anda.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((p, i) => {
            const isCustom = Boolean(p.isCustom || !BUILTIN_IDS.includes(p.id))
            const showSubtitle = p.subtitle && p.subtitle.toLowerCase() !== (p.category || '').toLowerCase()

            return (
              <div
                key={p.id}
                className="group flex flex-col overflow-hidden rounded-2xl border border-line/80 bg-surface shadow-card transition-[border-color,box-shadow] duration-300 hover:border-indigo/50 hover:shadow-[0_18px_42px_-14px_rgba(37,99,235,0.28)]"
                data-aos="fade-up"
                data-aos-delay={(i % 3) * 80}
              >
                {/* Preview Gambar Desain Header */}
                <div className="relative h-44 overflow-hidden border-b border-line bg-[#080B16] sm:h-48">
                  <div
                    className="absolute inset-0 opacity-45 transition-opacity duration-300 group-hover:opacity-70"
                    style={{
                      background: `radial-gradient(circle at top right, ${p.accent || '#2563EB'}35, transparent 70%)`,
                    }}
                  />

                  <div
                    role="button"
                    tabIndex={0}
                    onClick={() => {
                      if (isCustom && p.link) {
                        window.open(p.link, '_blank', 'noreferrer')
                      } else {
                        setSelectedProject(p)
                      }
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        if (isCustom && p.link) {
                          window.open(p.link, '_blank', 'noreferrer')
                        } else {
                          setSelectedProject(p)
                        }
                      }
                    }}
                    className="relative block h-full w-full cursor-pointer"
                  >
                    <Preview p={p} />
                  </div>

                  {/* Kategori Badge */}
                  <span className="absolute left-3 top-2.5 rounded-full border border-white/15 bg-[#080B16]/75 px-2.5 py-0.5 text-[0.64rem] font-bold uppercase tracking-[0.12em] text-[#60A5FA] backdrop-blur-md shadow-sm">
                    {p.category}
                  </span>

                  {/* Actions (Admin atau proyek buatan sendiri) */}
                  {(isAdmin || isCustom) && (
                    <div className="absolute right-3 top-2.5 z-20 flex items-center gap-1 opacity-85 transition-opacity group-hover:opacity-100">
                      <button
                        type="button"
                        title="Sunting proyek"
                        aria-label="Sunting proyek"
                        className="grid h-7 w-7 place-items-center rounded-lg border border-white/15 bg-[#080B16]/75 text-slate-200 backdrop-blur-md shadow-sm transition-colors hover:border-[#2563EB] hover:bg-[#2563EB] hover:text-white"
                        onClick={(e) => {
                          e.stopPropagation()
                          openEdit(p)
                        }}
                      >
                        <FiEdit2 className="text-[11px]" />
                      </button>
                      <button
                        type="button"
                        title="Hapus proyek"
                        aria-label="Hapus proyek"
                        className="grid h-7 w-7 place-items-center rounded-lg border border-white/15 bg-[#080B16]/75 text-slate-200 backdrop-blur-md shadow-sm transition-colors hover:border-rose-500 hover:bg-rose-500 hover:text-white"
                        onClick={(e) => {
                          e.stopPropagation()
                          remove(p.id, p.title)
                        }}
                      >
                        <FiTrash2 className="text-[11px]" />
                      </button>
                    </div>
                  )}
                </div>

                {/* Body: Nama Proyek, Durasi, Link, Button */}
                <div className="flex flex-1 flex-col p-5">
                  <div className="mb-1.5 flex items-center justify-between gap-2 text-[0.7rem] font-semibold tracking-wide text-mute">
                    {showSubtitle ? (
                      <span className="truncate font-bold uppercase tracking-[0.1em] text-indigo">
                        {p.subtitle}
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 text-indigo font-bold uppercase tracking-[0.1em]">
                        <span className="h-1.5 w-1.5 rounded-full bg-indigo" />
                        {p.category}
                      </span>
                    )}
                    {p.duration && (
                      <span className="flex shrink-0 items-center gap-1 rounded-full bg-soft px-2 py-0.5 text-[0.68rem] font-medium text-mute">
                        <FiClock className="text-[10px]" /> {p.duration}
                      </span>
                    )}
                  </div>

                  <h3
                    onClick={() => {
                      if (isCustom && p.link) {
                        window.open(p.link, '_blank', 'noreferrer')
                      } else {
                        setSelectedProject(p)
                      }
                    }}
                    className="cursor-pointer font-heading text-[1.15rem] font-bold capitalize tracking-tight text-heading transition-colors group-hover:text-indigo line-clamp-1"
                  >
                    {p.title}
                  </h3>

                  {p.desc && (
                    <p className="mt-2 flex-1 text-[0.82rem] leading-relaxed text-mute line-clamp-3">
                      {p.desc}
                    </p>
                  )}

                  {p.link && (
                    <a
                      href={p.link}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-2 inline-flex items-center gap-1.5 text-[0.76rem] font-medium text-mute transition-colors hover:text-indigo w-fit max-w-full"
                    >
                      <FiExternalLink className="shrink-0 text-[11px] text-indigo" />
                      <span className="truncate">{formatHost(p.link)}</span>
                    </a>
                  )}

                  {/* Tools yang Digunakan */}
                  {p.tools && p.tools.length > 0 && (
                    <div className="my-3.5 border-t border-line/60 pt-3">
                      <div className="flex flex-wrap gap-1">
                        {p.tools.map((tool) => (
                          <span
                            key={tool}
                            className="rounded-md border border-line bg-soft px-2 py-0.5 text-[0.68rem] font-semibold text-heading"
                          >
                            {tool}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Tombol Aksi */}
                  <div className="mt-auto flex items-center justify-between gap-2 pt-4">
                    {p.link ? (
                      <a
                        href={p.link}
                        target="_blank"
                        rel="noreferrer"
                        className="btn btn-primary w-full py-2 text-[0.8rem]"
                      >
                        Buka Project <FiExternalLink />
                      </a>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setSelectedProject(p)}
                        className="btn btn-primary w-full py-2 text-[0.8rem]"
                      >
                        Lihat Detail <FiArrowRight />
                      </button>
                    )}
                    {!isCustom && (
                      <Link
                        to={`/case-study/${p.id}`}
                        title="Buka Studi Kasus Penuh"
                        className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-line bg-surface text-mute transition-all hover:border-[#2563EB] hover:text-[#60A5FA]"
                      >
                        <FiExternalLink className="text-[14px]" />
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
          </div>
        )}

        {/* MODAL LIHAT DETAIL PROYEK */}
        {selectedProject && (
          <div
            className="fixed inset-0 z-1200 grid place-items-center bg-black/80 p-4 backdrop-blur-md overflow-y-auto"
            onClick={() => setSelectedProject(null)}
          >
            <div
              className="relative my-8 w-full max-w-3xl rounded-3xl border border-white/15 bg-[#0D1224] p-6 sm:p-8 shadow-[0_30px_90px_rgba(0,0,0,0.8)] text-white animate-modal-in"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                type="button"
                aria-label="Tutup modal"
                onClick={() => setSelectedProject(null)}
                className="absolute right-5 top-5 grid h-9 w-9 place-items-center rounded-full border border-white/10 bg-white/5 text-slate-400 transition-colors hover:bg-white/10 hover:text-white"
              >
                <FiX className="text-[18px]" />
              </button>

              {/* Modal Header */}
              <div className="mb-5">
                <span className="rounded-full bg-[#2563EB]/20 px-3 py-1 text-[0.72rem] font-bold uppercase tracking-wider text-[#60A5FA] border border-[#2563EB]/30">
                  {selectedProject.category}
                </span>
                <h3 className="mt-2 font-heading text-[1.7rem] font-bold text-white">
                  {selectedProject.title}
                </h3>
                <p className="text-[0.95rem] text-[#60A5FA]">
                  {selectedProject.subtitle}
                </p>
              </div>

              {/* Mockup Preview Inside Modal */}
              <div className="mb-6 h-60 overflow-hidden rounded-2xl border border-white/10 bg-[#080B16] sm:h-72">
                <Preview p={selectedProject} />
              </div>

              {/* Project Meta Info */}
              <div className="mb-6 grid grid-cols-2 gap-4 rounded-xl border border-white/10 bg-white/5 p-4 sm:grid-cols-4 text-[0.8rem]">
                <div>
                  <span className="block text-slate-400 text-[0.7rem] uppercase font-bold">Peran</span>
                  <span className="font-semibold text-white">{selectedProject.role}</span>
                </div>
                <div>
                  <span className="block text-slate-400 text-[0.7rem] uppercase font-bold">Durasi</span>
                  <span className="font-semibold text-white">{selectedProject.duration || '4 Minggu'}</span>
                </div>
                <div className="sm:col-span-2">
                  <span className="block text-slate-400 text-[0.7rem] uppercase font-bold">Tools</span>
                  <span className="font-semibold text-[#60A5FA]">
                    {(selectedProject.tools || []).join(', ')}
                  </span>
                </div>
              </div>

              {/* Case study highlights */}
              {selectedProject.caseStudy && (
                <div className="space-y-4 text-[0.9rem] leading-relaxed text-slate-300">
                  <div>
                    <h4 className="font-heading font-bold text-white text-[1.05rem] mb-1">
                      Ringkasan Solusi Desain
                    </h4>
                    <p>{selectedProject.caseStudy.overview}</p>
                  </div>

                  <div className="rounded-xl border border-white/5 bg-[#12182E] p-4">
                    <h4 className="font-heading font-bold text-[#60A5FA] text-[0.95rem] mb-2 flex items-center gap-2">
                      <FiCheckCircle /> Alur Perjalanan Pengguna (User Flow):
                    </h4>
                    <div className="flex flex-wrap gap-2 text-[0.78rem]">
                      {(selectedProject.caseStudy.flow || []).map((step, idx) => (
                        <span
                          key={step}
                          className="rounded-md bg-white/5 px-2.5 py-1 text-slate-200 border border-white/5"
                        >
                          {idx + 1}. {step}
                        </span>
                      ))}
                    </div>
                  </div>

                  {selectedProject.caseStudy.problem && (
                    <div>
                      <h4 className="font-heading font-bold text-white text-[1rem] mb-1">
                        Tantangan Utama
                      </h4>
                      <p>{selectedProject.caseStudy.problem}</p>
                    </div>
                  )}
                </div>
              )}

              {/* Modal Footer CTA */}
              <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-white/10 pt-5">
                <Link
                  to={`/case-study/${selectedProject.id}`}
                  className="btn btn-primary"
                  onClick={() => setSelectedProject(null)}
                >
                  Baca Studi Kasus Lengkap <FiArrowRight />
                </Link>
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={() => setSelectedProject(null)}
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        )}

        {/* MODAL TAMBAH PROYEK */}
        {isAddOpen && (
          <div
            className="fixed inset-0 z-1200 grid place-items-center bg-black/80 p-4 backdrop-blur-md overflow-y-auto"
            onClick={() => setIsAddOpen(false)}
          >
            <div
              className="relative my-6 w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl border border-line bg-surface p-6 shadow-pop text-heading animate-modal-in"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="mb-5 flex items-center justify-between border-b border-line pb-3">
                <h3 className="font-heading text-[1.2rem] font-bold text-heading">
                  Tambah Proyek Baru
                </h3>
                <button
                  type="button"
                  aria-label="Tutup form"
                  onClick={() => setIsAddOpen(false)}
                  className="text-[1.2rem] text-mute hover:text-heading"
                >
                  <FiX />
                </button>
              </div>

              {formError && (
                <div className="mb-3 rounded-xl border border-rose-500/30 bg-rose-500/10 px-3.5 py-2.5 text-[0.82rem] font-medium text-rose-500">
                  {formError}
                </div>
              )}

              <form onSubmit={submit} className="flex flex-col gap-3.5">
                <div>
                  <label className="text-[0.75rem] font-bold uppercase text-mute">
                    Nama Project <span className="text-rose-500">*</span>
                  </label>
                  <input
                    name="title"
                    value={form.title}
                    onChange={update}
                    required
                    placeholder="Contoh: Website Pemesanan Villa"
                    className="form-control mt-1"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[0.75rem] font-bold uppercase text-mute">Durasi</label>
                    <input
                      name="duration"
                      value={form.duration}
                      onChange={update}
                      placeholder="Contoh: 3 Minggu"
                      className="form-control mt-1"
                    />
                  </div>
                  <div>
                    <label className="text-[0.75rem] font-bold uppercase text-mute">Kategori</label>
                    <input
                      name="category"
                      value={form.category}
                      onChange={update}
                      placeholder="Website / Dashboard / Mobile"
                      className="form-control mt-1"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[0.75rem] font-bold uppercase text-mute">
                    Link Project
                  </label>
                  <input
                    name="link"
                    type="text"
                    value={form.link}
                    onChange={update}
                    placeholder="https://figma.com/... atau https://domainanda.com"
                    className="form-control mt-1"
                  />
                  <p className="mt-1 text-[0.7rem] text-mute">
                    Preview tampilan web/desain akan otomatis dibaca dari link, atau unggah foto langsung di bawah.
                  </p>
                </div>

                <div>
                  <label className="text-[0.75rem] font-bold uppercase text-mute">
                    Foto Tampilan Desain (Opsional)
                  </label>
                  <div className="mt-1 flex items-center gap-3">
                    <input
                      ref={coverRef}
                      type="file"
                      accept="image/*"
                      onChange={onCover}
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => coverRef.current?.click()}
                      className="btn btn-outline py-2 px-3.5 text-[0.78rem]"
                    >
                      <FiImage /> {form.image ? 'Ganti Foto Desain' : 'Pilih Foto Desain'}
                    </button>
                    {form.image && (
                      <button
                        type="button"
                        onClick={() => setForm((f) => ({ ...f, image: '' }))}
                        className="text-[0.74rem] font-semibold text-rose-400 hover:underline"
                      >
                        Hapus Foto
                      </button>
                    )}
                  </div>
                  {form.image && (
                    <div className="mt-2.5 h-32 w-full overflow-hidden rounded-xl border border-line bg-black/40">
                      <img
                        src={form.image}
                        alt="Preview desain"
                        className="h-full w-full object-cover object-top"
                      />
                    </div>
                  )}
                </div>

                <div className="mt-4 flex gap-3">
                  <button type="submit" className="btn btn-primary flex-1">
                    Simpan Proyek
                  </button>
                  <button
                    type="button"
                    className="btn btn-outline"
                    onClick={() => setIsAddOpen(false)}
                  >
                    Batal
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* MODAL SUNTING (EDIT) PROYEK */}
        {editingProject && (
          <div
            className="fixed inset-0 z-1200 grid place-items-center bg-black/80 p-4 backdrop-blur-md overflow-y-auto"
            onClick={() => setEditingProject(null)}
          >
            <div
              className="relative my-6 w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl border border-line bg-surface p-6 shadow-pop text-heading animate-modal-in"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="mb-5 flex items-center justify-between border-b border-line pb-3">
                <h3 className="font-heading text-[1.2rem] font-bold text-heading">
                  Sunting Data Proyek
                </h3>
                <button
                  type="button"
                  aria-label="Tutup form"
                  onClick={() => setEditingProject(null)}
                  className="text-[1.2rem] text-mute hover:text-heading"
                >
                  <FiX />
                </button>
              </div>

              <form onSubmit={submitEdit} className="flex flex-col gap-3">
                <div>
                  <label className="text-[0.75rem] font-bold uppercase text-mute">Nama Project</label>
                  <input
                    value={editingProject.title}
                    onChange={(e) => setEditingProject({ ...editingProject, title: e.target.value })}
                    required
                    className="form-control mt-1"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[0.75rem] font-bold uppercase text-mute">Durasi</label>
                    <input
                      value={editingProject.duration}
                      onChange={(e) => setEditingProject({ ...editingProject, duration: e.target.value })}
                      className="form-control mt-1"
                    />
                  </div>
                  <div>
                    <label className="text-[0.75rem] font-bold uppercase text-mute">Kategori</label>
                    <input
                      value={editingProject.category}
                      onChange={(e) => setEditingProject({ ...editingProject, category: e.target.value })}
                      className="form-control mt-1"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[0.75rem] font-bold uppercase text-mute">Link Project</label>
                  <input
                    value={editingProject.link}
                    onChange={(e) => setEditingProject({ ...editingProject, link: e.target.value })}
                    placeholder="https://figma.com/... atau https://domainanda.com"
                    className="form-control mt-1"
                  />
                </div>

                <div>
                  <label className="text-[0.75rem] font-bold uppercase text-mute">
                    Foto Tampilan Desain (Opsional)
                  </label>
                  <div className="mt-1 flex items-center gap-3">
                    <input
                      ref={editCoverRef}
                      type="file"
                      accept="image/*"
                      onChange={onEditCover}
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => editCoverRef.current?.click()}
                      className="btn btn-outline py-2 px-3.5 text-[0.78rem]"
                    >
                      <FiImage /> {editingProject.image ? 'Ganti Foto Desain' : 'Pilih Foto Desain'}
                    </button>
                    {editingProject.image && (
                      <button
                        type="button"
                        onClick={() => setEditingProject((prev) => ({ ...prev, image: '' }))}
                        className="text-[0.74rem] font-semibold text-rose-400 hover:underline"
                      >
                        Hapus Foto
                      </button>
                    )}
                  </div>
                  {editingProject.image && (
                    <div className="mt-2.5 h-32 w-full overflow-hidden rounded-xl border border-line bg-black/40">
                      <img
                        src={editingProject.image}
                        alt="Preview desain"
                        className="h-full w-full object-cover object-top"
                      />
                    </div>
                  )}
                </div>

                {!editingProject.isCustom && (
                  <>
                    <div>
                      <label className="text-[0.75rem] font-bold uppercase text-mute">Deskripsi</label>
                      <textarea
                        rows="3"
                        value={editingProject.desc}
                        onChange={(e) => setEditingProject({ ...editingProject, desc: e.target.value })}
                        className="form-control mt-1"
                      />
                    </div>

                    <div>
                      <label className="text-[0.75rem] font-bold uppercase text-mute">Tools (pisahkan koma)</label>
                      <input
                        value={editingProject.tags}
                        onChange={(e) => setEditingProject({ ...editingProject, tags: e.target.value })}
                        className="form-control mt-1"
                      />
                    </div>
                  </>
                )}

                <div className="mt-4 flex gap-3">
                  <button type="submit" className="btn btn-primary flex-1">
                    Simpan Perubahan
                  </button>
                  <button
                    type="button"
                    className="btn btn-outline"
                    onClick={() => setEditingProject(null)}
                  >
                    Batal
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
