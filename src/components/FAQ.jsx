import { useState } from 'react'
import { FiPlus, FiMinus, FiHelpCircle } from 'react-icons/fi'
import { FAQS } from '../data/faq'

export default function FAQ() {
  const [open, setOpen] = useState(0)

  return (
    <section id="faq" className="section bg-bg relative">
      <div className="container grid items-start gap-12 lg:grid-cols-[0.85fr_1.15fr]">
        {/* Left Column: Heading & WhatsApp CTA */}
        <div className="lg:sticky lg:top-28" data-aos="fade-up">
          <span className="section-eyebrow">Frequently Asked Questions</span>
          <h2 className="section-title">Pertanyaan yang Sering Diajukan</h2>
          <p className="mt-4 max-w-105 text-[0.98rem] leading-relaxed text-mute">
            Punya pertanyaan seputar durasi pengerjaan, format serah terima file Figma, atau skema kolaborasi? Temukan jawabannya di sini atau hubungi saya langsung.
          </p>

          <div className="mt-8 rounded-2xl border border-line bg-surface/90 p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-[#6258F5]/20 text-[#9BA8FF] text-[1.2rem]">
                <FiHelpCircle />
              </span>
              <div>
                <h4 className="font-heading font-bold text-heading text-[1rem]">Masih Ada Pertanyaan?</h4>
                <p className="text-[0.78rem] text-mute">Saya siap berdiskusi kapan saja.</p>
              </div>
            </div>
            <a
              href="https://wa.me/6285187169158?text=Halo%20Vines%2C%20saya%20ingin%20bertanya%20mengenai%20layanan%20desain%20UI%2FUX."
              target="_blank"
              rel="noreferrer"
              className="btn btn-primary w-full text-center"
            >
              Tanya via WhatsApp
            </a>
          </div>
        </div>

        {/* Right Column: Accordion Items */}
        <div className="flex flex-col gap-3.5" data-aos="fade-up" data-aos-delay="100">
          {FAQS.map((item, i) => {
            const isOpen = open === i
            return (
              <div
                key={item.q}
                className={`card overflow-hidden transition-all duration-300 ${
                  isOpen ? 'border-[#6258F5]/60 bg-surface shadow-card-hover' : 'hover:border-line'
                }`}
              >
                <button
                  type="button"
                  aria-expanded={isOpen}
                  onClick={() => setOpen(isOpen ? -1 : i)}
                  className="flex w-full cursor-pointer items-center justify-between gap-4 px-6 py-5 text-left"
                >
                  <span className="font-heading text-[1rem] font-bold text-heading">
                    {item.q}
                  </span>
                  <span
                    className={`grid h-8 w-8 shrink-0 place-items-center rounded-full transition-all duration-300 ${
                      isOpen
                        ? 'rotate-180 bg-[#6258F5] text-white shadow-md'
                        : 'bg-soft text-mute'
                    }`}
                  >
                    {isOpen ? <FiMinus /> : <FiPlus />}
                  </span>
                </button>

                <div className={`faq-body ${isOpen ? 'open' : ''}`}>
                  <div>
                    <p className="px-6 pb-5 text-[0.92rem] leading-relaxed text-mute border-t border-line/40 pt-3">
                      {item.a}
                    </p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
