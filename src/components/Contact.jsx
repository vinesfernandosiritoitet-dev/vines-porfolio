import { useState } from 'react'
import {
  FiMail,
  FiArrowUpRight,
  FiInstagram,
  FiClock,
  FiSend,
  FiCheckCircle,
  FiAlertCircle,
  FiUser,
  FiFileText,
  FiMessageSquare,
} from 'react-icons/fi'
import { FaWhatsapp } from 'react-icons/fa'
import { validateContactForm, sanitizeInput } from '../utils/validation'
import { saveContactMessage } from '../utils/messages'

const OWNER_EMAIL = 'vinesfernandosiritoitet@gmail.com'
const OWNER_WHATSAPP = '6285187169158'

const CONTACT_CHANNELS = [
  {
    label: 'WhatsApp',
    value: '+62 851-8716-9158',
    sub: 'Respon Cepat (08.00 - 21.00 WIB)',
    href: `https://wa.me/${OWNER_WHATSAPP}?text=${encodeURIComponent('Halo Vines, saya tertarik bekerjasama untuk proyek UI/UX!')}`,
    Icon: FaWhatsapp,
    color: '#25D366',
    bg: 'rgba(37, 211, 102, 0.12)',
  },
  {
    label: 'Email',
    value: OWNER_EMAIL,
    sub: 'Untuk brief proyek & penawaran resmi',
    href: `mailto:${OWNER_EMAIL}`,
    Icon: FiMail,
    color: '#2563EB',
    bg: 'rgba(37, 99, 235, 0.12)',
  },
  {
    label: 'Instagram',
    value: '@saip.ul3446',
    sub: 'Eksplorasi visual & desain terbaru',
    href: 'https://instagram.com/saip.ul3446',
    Icon: FiInstagram,
    color: '#E4405F',
    bg: 'rgba(228, 64, 95, 0.12)',
  },
]

export default function Contact() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  })

  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submittedData, setSubmittedData] = useState(null)

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const { isValid, errors: validationErrors } = validateContactForm(form)
    if (!isValid) {
      setErrors(validationErrors)
      return
    }

    const cleanData = {
      name: form.name.trim(),
      email: form.email.trim(),
      subject: form.subject.trim(),
      message: form.message.trim(),
    }

    setIsSubmitting(true)

    let emailDelivered = false

    // 1. Kirim ke Backend API jika dikonfigurasi
    const apiBase = import.meta.env.VITE_API_BASE_URL
    if (apiBase) {
      try {
        const res = await fetch(`${apiBase}/api/contact`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: sanitizeInput(cleanData.name),
            email: sanitizeInput(cleanData.email),
            subject: sanitizeInput(cleanData.subject),
            message: sanitizeInput(cleanData.message),
          }),
        })
        if (res.ok) emailDelivered = true
      } catch (err) {
        console.warn('Gagal mengirim ke backend API, lanjut ke FormSubmit:', err)
      }
    }

    // 2. Kirim diam-diam langsung ke Email pemilik lewat FormSubmit AJAX
    if (!emailDelivered) {
      try {
        const res = await fetch(`https://formsubmit.co/ajax/${OWNER_EMAIL}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          body: JSON.stringify({
            name: cleanData.name,
            email: cleanData.email,
            _replyto: cleanData.email,
            _subject: `[Portofolio Vines] ${cleanData.subject}`,
            _template: 'table',
            _captcha: 'false',
            subject: cleanData.subject,
            message: cleanData.message,
          }),
        })
        if (res.ok) {
          const json = await res.json().catch(() => null)
          emailDelivered = json?.success === 'true' || json?.success === true || res.ok
        }
      } catch (err) {
        console.warn('Pengiriman otomatis FormSubmit gagal:', err)
      }
    }

    // 3. Simpan salinan ke riwayat pesan masuk di Dashboard Admin
    saveContactMessage({
      ...cleanData,
      emailDelivered,
    })

    // 4. Buka WhatsApp otomatis agar pesan langsung terkirim ke WhatsApp pemilik
    const waText = encodeURIComponent(
      `*Pesan Baru dari Portofolio*\n\n` +
      `👤 *Nama:* ${cleanData.name}\n` +
      `✉️ *Email:* ${cleanData.email}\n` +
      `📌 *Subjek:* ${cleanData.subject}\n\n` +
      `💬 *Pesan:*\n${cleanData.message}`
    )
    const waUrl = `https://wa.me/${OWNER_WHATSAPP}?text=${waText}`
    window.open(waUrl, '_blank', 'noopener,noreferrer')

    setIsSubmitting(false)
    setSubmittedData({ ...cleanData, waUrl })
    setForm({ name: '', email: '', subject: '', message: '' })
  }

  return (
    <section id="contact" className="section bg-bg-soft relative overflow-hidden">
      {/* Background grids and lights */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 grid-lines opacity-40" />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-36 top-1/4 h-125 w-125 rounded-full blur-3xl animate-float-slow"
          style={{ background: 'radial-gradient(circle,rgba(98,88,245,0.12),transparent 70%)' }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-36 bottom-0 h-100 w-100 rounded-full blur-2xl animate-float"
          style={{ background: 'radial-gradient(circle,rgba(59,130,246,0.14),transparent 70%)' }}
      />

      <div className="container relative">
        {/* Section Head */}
        <div className="section-head mb-12" data-aos="fade-up">
          <span className="section-eyebrow">Hubungi Saya</span>
          <h2 className="section-title">Mari Berdiskusi &amp; Berkolaborasi</h2>
          <p className="section-sub">
            Punya ide website, aplikasi mobile, atau proyek yang ingin didesain ulang? Kirimkan pesan Anda melalui formulir atau kontak langsung di bawah ini.
          </p>
        </div>

        <div className="grid items-start gap-12 lg:grid-cols-[1fr_1.2fr]">
          {/* Left Column: Direct Channels */}
          <div data-aos="fade-up">
            <h3 className="font-heading text-[1.5rem] font-bold text-heading mb-3">
              Informasi Kontak
            </h3>
            <p className="text-[0.92rem] text-mute mb-6 leading-relaxed">
              Saya terbuka untuk proyek freelance, kontrak kerja sama desain UI/UX, maupun diskusi santai terkait ide produk digital Anda.
            </p>

            {/* Availability Badges */}
            <div className="mb-8 flex flex-wrap gap-2.5">
              <span className="inline-flex items-center gap-2 rounded-full border border-line bg-surface px-3.5 py-1.5 text-[0.78rem] font-semibold text-mute shadow-xs">
                <span className="pulse-dot h-2 w-2 rounded-full bg-emerald-500" />
                Tersedia untuk Proyek Baru
              </span>
              <span className="inline-flex items-center gap-2 rounded-full border border-line bg-surface px-3.5 py-1.5 text-[0.78rem] font-semibold text-mute shadow-xs">
                <FiClock className="text-indigo" /> Respon dalam 1×24 Jam
              </span>
            </div>

            {/* Channels List */}
            <div className="flex flex-col gap-3.5">
              {CONTACT_CHANNELS.map(({ label, value, sub, href, Icon, color, bg }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  className="group flex items-center justify-between rounded-2xl border border-line bg-surface p-4 shadow-xs transition-all duration-300 hover:-translate-y-1 hover:border-indigo/60 hover:shadow-card-hover"
                >
                  <div className="flex items-center gap-3.5">
                    <span
                      className="grid h-12 w-12 shrink-0 place-items-center rounded-xl text-[1.25rem] transition-transform duration-200 group-hover:scale-105"
                      style={{ color, background: bg }}
                    >
                      <Icon />
                    </span>
                    <div>
                      <span className="block text-[0.72rem] font-bold uppercase tracking-wider text-indigo">
                        {label}
                      </span>
                      <span className="block font-heading text-[0.96rem] font-bold text-heading">
                        {value}
                      </span>
                      <span className="block text-[0.72rem] text-mute">
                        {sub}
                      </span>
                    </div>
                  </div>
                  <FiArrowUpRight className="text-[1.2rem] text-faint transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-indigo" />
                </a>
              ))}
            </div>
          </div>

          {/* Right Column: Contact Form with Validation */}
          <div
            className="rounded-3xl border border-line bg-surface p-7 sm:p-9 shadow-card"
            data-aos="fade-up"
            data-aos-delay="100"
          >
            <h3 className="font-heading text-[1.4rem] font-bold text-heading mb-1">
              Kirim Pesan
            </h3>
            <p className="text-[0.85rem] text-mute mb-6">
              Punya pertanyaan atau ingin mengajak kerja sama? Isi formulir di bawah ini, saya akan segera membalasnya.
            </p>

            <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
              {/* Nama */}
              <div>
                <label className="mb-1.5 flex items-center gap-2 text-[0.8rem] font-bold uppercase tracking-wider text-heading">
                  <FiUser className="text-indigo" /> Nama Lengkap
                </label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Contoh: Budi Santoso"
                  className={`form-control border-line bg-bg text-heading focus:bg-surface focus:border-indigo ${
                    errors.name ? 'border-rose-500 focus:border-rose-500' : ''
                  }`}
                />
                {errors.name && (
                  <p className="mt-1 flex items-center gap-1 text-[0.75rem] font-medium text-rose-500">
                    <FiAlertCircle /> {errors.name}
                  </p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="mb-1.5 flex items-center gap-2 text-[0.8rem] font-bold uppercase tracking-wider text-heading">
                  <FiMail className="text-indigo" /> Alamat Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="Contoh: budi@gmail.com"
                  className={`form-control border-line bg-bg text-heading focus:bg-surface focus:border-indigo ${
                    errors.email ? 'border-rose-500 focus:border-rose-500' : ''
                  }`}
                />
                {errors.email && (
                  <p className="mt-1 flex items-center gap-1 text-[0.75rem] font-medium text-rose-500">
                    <FiAlertCircle /> {errors.email}
                  </p>
                )}
              </div>

              {/* Subjek */}
              <div>
                <label className="mb-1.5 flex items-center gap-2 text-[0.8rem] font-bold uppercase tracking-wider text-heading">
                  <FiFileText className="text-indigo" /> Subjek / Keperluan
                </label>
                <input
                  type="text"
                  name="subject"
                  value={form.subject}
                  onChange={handleChange}
                  placeholder="Contoh: Tanya desain website / ajakan kerja sama"
                  className={`form-control border-line bg-bg text-heading focus:bg-surface focus:border-indigo ${
                    errors.subject ? 'border-rose-500 focus:border-rose-500' : ''
                  }`}
                />
                {errors.subject && (
                  <p className="mt-1 flex items-center gap-1 text-[0.75rem] font-medium text-rose-500">
                    <FiAlertCircle /> {errors.subject}
                  </p>
                )}
              </div>

              {/* Pesan */}
              <div>
                <label className="mb-1.5 flex items-center gap-2 text-[0.8rem] font-bold uppercase tracking-wider text-heading">
                  <FiMessageSquare className="text-indigo" /> Isi Pesan
                </label>
                <textarea
                  name="message"
                  rows="4"
                  value={form.message}
                  onChange={handleChange}
                  placeholder="Tuliskan pesan, pertanyaan, atau detail kebutuhan Anda di sini..."
                  className={`form-control border-line bg-bg text-heading focus:bg-surface focus:border-indigo ${
                    errors.message ? 'border-rose-500 focus:border-rose-500' : ''
                  }`}
                />
                {errors.message && (
                  <p className="mt-1 flex items-center gap-1 text-[0.75rem] font-medium text-rose-500">
                    <FiAlertCircle /> {errors.message}
                  </p>
                )}
              </div>

              {/* Tombol Kirim Pesan */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn btn-primary group mt-2 w-full py-4 text-[0.95rem] font-bold shadow-[0_10px_28px_rgba(37,99,235,0.45)]"
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Sedang Mengirim Pesan...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    Kirim Pesan <FiSend className="transition-transform duration-200 group-hover:translate-x-1 group-hover:-translate-y-0.5" />
                  </span>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* FEEDBACK MODAL: SUKSES KIRIM PESAN */}
        {submittedData && (
          <div
            className="fixed inset-0 z-1300 grid place-items-center bg-black/75 p-4 backdrop-blur-md"
            onClick={() => setSubmittedData(null)}
          >
            <div
              className="relative w-full max-w-md rounded-3xl border border-line bg-surface p-7 text-center shadow-pop text-heading animate-modal-in"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="mx-auto mb-4 grid h-16 w-16 place-items-center rounded-2xl bg-emerald-500/15 text-[2rem] text-emerald-500">
                <FiCheckCircle />
              </div>

              <h4 className="font-heading text-[1.45rem] font-bold text-heading mb-2">
                Pesan Terkirim!
              </h4>

              <p className="text-[0.88rem] leading-relaxed text-mute mb-6">
                Terima kasih, <strong className="text-heading">{submittedData.name}</strong>. Pesan Anda mengenai &ldquo;{submittedData.subject}&rdquo; telah dikirimkan ke Email dan diarahkan ke WhatsApp kami.
              </p>

              <div className="flex flex-col gap-2.5">
                <a
                  href={submittedData.waUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="btn w-full bg-[#25D366] text-white hover:bg-[#20ba5a] shadow-[0_8px_20px_rgba(37,211,102,0.35)]"
                >
                  <FaWhatsapp className="text-[1.1rem]" /> Lanjut di WhatsApp
                </a>
                <button
                  type="button"
                  className="btn btn-outline w-full"
                  onClick={() => setSubmittedData(null)}
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
