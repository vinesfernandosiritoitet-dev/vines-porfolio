import { useState } from 'react'
import { FiMail, FiSend } from 'react-icons/fi'
import { FaInstagram, FaWhatsapp } from 'react-icons/fa'

const CONTACTS = [
  {
    label: 'Email',
    value: 'vinesfernandosiritoitet@gmail.com',
    href: 'mailto:vinesfernandosiritoitet@gmail.com',
    Icon: FiMail,
    color: '#60a5fa',
  },
  {
    label: 'WhatsApp',
    value: '+62 851-8716-9158',
    href: 'https://wa.me/6285187169158?text=Halo%20Vines!',
    Icon: FaWhatsapp,
    color: '#22c55e',
  },
  {
    label: 'Instagram',
    value: '@saip.ul3446',
    href: 'https://instagram.com/saip.ul3446',
    Icon: FaInstagram,
    color: '#ec4899',
  },
]

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' })

  const update = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const submit = (e) => {
    e.preventDefault()
    const text = encodeURIComponent(
      `Halo Vines! Saya ${form.name || '-'}.\nEmail: ${form.email || '-'}\n\n${form.message}`,
    )
    window.open(`https://wa.me/6285187169158?text=${text}`, '_blank')
  }

  return (
    <section id="contact" className="relative py-24 max-sm:py-[72px]">
      <div className="container">
        <div className="section-head" data-aos="fade-up">
          <span className="section-eyebrow">Kontak</span>
          <h2 className="section-title">
            Mari <span className="gradient">Berkolaborasi</span>
          </h2>
          <p className="section-sub">
            Punya project atau pertanyaan? Kirim pesan, saya akan segera balas.
          </p>
        </div>

        <div className="grid items-start gap-7 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="grid gap-4" data-aos="fade-up">
            {CONTACTS.map(({ label, value, href, Icon, color }) => (
              <a
                key={label}
                href={href}
                target={href.startsWith('http') ? '_blank' : undefined}
                rel="noreferrer"
                className="glass-card flex items-center gap-4 p-[22px] transition-transform hover:-translate-y-1"
              >
                <span
                  className="grid h-[52px] w-[52px] shrink-0 place-items-center rounded-[14px] text-[1.4rem]"
                  style={{ color, background: `${color}1a` }}
                >
                  <Icon />
                </span>
                <span className="flex min-w-0 flex-col gap-0.5">
                  <span className="text-[0.78rem] font-bold uppercase tracking-[0.12em] text-faint">
                    {label}
                  </span>
                  <span className="text-[0.95rem] font-semibold break-all text-ink">
                    {value}
                  </span>
                </span>
              </a>
            ))}
          </div>

          <form
            className="glass-card p-8 max-sm:p-[26px]"
            onSubmit={submit}
            data-aos="fade-up"
            data-aos-delay="100"
          >
            <div className="mb-4 grid gap-4 sm:grid-cols-2">
              <div className="flex flex-col gap-2">
                <label htmlFor="name" className="text-[0.85rem] font-bold text-mute">
                  Nama
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Nama kamu"
                  className="form-control"
                  value={form.name}
                  onChange={update}
                  required
                />
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor="email" className="text-[0.85rem] font-bold text-mute">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="email@kamu.com"
                  className="form-control"
                  value={form.email}
                  onChange={update}
                  required
                />
              </div>
            </div>
            <div className="mb-4 flex flex-col gap-2">
              <label htmlFor="message" className="text-[0.85rem] font-bold text-mute">
                Pesan
              </label>
              <textarea
                id="message"
                name="message"
                rows="5"
                placeholder="Ceritakan project kamu..."
                className="form-control"
                value={form.message}
                onChange={update}
                required
              />
            </div>
            <button type="submit" className="glow-btn w-full">
              <FiSend /> Kirim Pesan
            </button>
          </form>
        </div>
      </div>
    </section>
  )
}