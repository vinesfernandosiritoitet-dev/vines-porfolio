const STATS = [
  { value: '1+', label: 'Tahun Belajar' },
  { value: '10+', label: 'Project Dibuat' },
  { value: '5+', label: 'Tools Dikuasai' },
  { value: '100%', label: 'Semangat Ngoding' },
]

export default function About() {
  return (
    <section id="about" className="relative py-24 max-sm:py-[72px]">
      <div className="container">
        <div className="section-head" data-aos="fade-up">
          <span className="section-eyebrow">Tentang Saya</span>
        </div>

        <div className="grid gap-7 lg:grid-cols-[1.05fr_1fr]">
          <div className="glass-card p-10 max-sm:p-[26px]" data-aos="fade-right">
            <h3 className="mb-1.5 font-heading text-[1.8rem] text-heading">
              Vines <span className="gradient-text">Fernando</span>
            </h3>
            <p className="mb-5 font-semibold text-blue-light"> UI/UX Designer</p>
            <p className="mb-7 text-mute">
              Halo! Saya senang belajar desain UI/UX dan saya Semangat membuat
              desain web atau mobile
            </p>
            <div className="grid gap-4">
              <div className="flex flex-col gap-0.5 rounded-[14px] border border-line bg-soft px-[18px] py-3.5">
                <span className="text-[0.78rem] font-bold uppercase tracking-[0.12em] text-faint">
                  Email
                </span>
                <a
                  href="mailto:vinesfernandosiritoitet@gmail.com"
                  className="font-semibold break-all text-ink"
                >
                  vinesfernandosiritoitet@gmail.com
                </a>
              </div>
              <div className="flex flex-col gap-0.5 rounded-[14px] border border-line bg-soft px-[18px] py-3.5">
                <span className="text-[0.78rem] font-bold uppercase tracking-[0.12em] text-faint">
                  Lokasi
                </span>
                <p className="font-semibold text-ink">Indonesia</p>
              </div>
              <div className="flex flex-col gap-0.5 rounded-[14px] border border-line bg-soft px-[18px] py-3.5">
                <span className="text-[0.78rem] font-bold uppercase tracking-[0.12em] text-faint">
                  Fokus
                </span>
                <p className="font-semibold text-ink">Designer UI/UX</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-7" data-aos="fade-left" data-aos-delay="100">
            <div className="grid grid-cols-2 gap-4">
              {STATS.map((s) => (
                <div
                  key={s.label}
                  className="glass-card flex flex-col items-center gap-1.5 px-4 py-[26px] text-center"
                >
                  <span className="gradient-text font-heading text-[2.2rem] font-bold">
                    {s.value}
                  </span>
                  <span className="text-[0.88rem] text-mute">{s.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}