import { FiStar, FiMessageSquare } from 'react-icons/fi'
import { TESTIMONIALS } from '../data/testimonials'

function initials(name) {
  return name
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase()
}

export default function Testimonials() {
  return (
    <section id="testimonials" className="section section-dark relative overflow-hidden">
      {/* Ambient background glows */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-40 top-0 h-120 w-120 rounded-full blur-2xl"
          style={{ background: 'radial-gradient(circle,rgba(98,88,245,0.25),transparent 70%)' }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-32 bottom-0 h-105 w-105 rounded-full blur-3xl"
          style={{ background: 'radial-gradient(circle,rgba(155,168,255,0.18),transparent 70%)' }}
      />

      <div className="container relative">
        <div className="section-head" data-aos="fade-up">
          <span className="section-eyebrow">Ulasan Klien &amp; Rekan</span>
          <h2 className="section-title text-white">Apa Kata Mereka</h2>
          <p className="section-sub text-[#94A3B8]">
            Testimoni jujur dari para founder, product manager, dan mitra kerja yang pernah berkolaborasi merancang produk digital bersama saya.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {TESTIMONIALS.map(({ id, name, role, company, quote, rating }, i) => (
            <figure
              key={id}
              className="glass flex flex-col justify-between rounded-2xl border border-white/10 bg-[#0D1224]/80 p-6 transition-all duration-300 hover:-translate-y-2 hover:border-[#6258F5]/60 hover:shadow-[0_15px_35px_rgba(0,0,0,0.5)]"
              data-aos="fade-up"
              data-aos-delay={i * 80}
            >
              <div>
                <div className="mb-4 flex items-center justify-between">
                  <FiMessageSquare
                    aria-hidden="true"
                    className="text-[1.5rem] text-[#9BA8FF]"
                  />
                  <div className="flex gap-1" aria-label={`${rating} dari 5 bintang`}>
                    {Array.from({ length: rating }).map((_, s) => (
                      <FiStar key={s} className="fill-amber-400 text-amber-400 text-[13px]" />
                    ))}
                  </div>
                </div>

                <blockquote className="text-[0.88rem] leading-relaxed text-slate-300">
                  &ldquo;{quote}&rdquo;
                </blockquote>
              </div>

              <figcaption className="mt-6 flex items-center gap-3.5 border-t border-white/10 pt-4">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-linear-to-br from-[#6258F5] to-[#4B41DB] font-heading text-[0.82rem] font-bold text-white shadow-md">
                  {initials(name)}
                </span>
                <div className="min-w-0">
                  <span className="block font-heading text-[0.92rem] font-bold text-white truncate">
                    {name}
                  </span>
                  <span className="block text-[0.74rem] text-[#9BA8FF] truncate">
                    {role} · {company}
                  </span>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  )
}
