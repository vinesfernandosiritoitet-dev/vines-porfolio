import {
  FiSearch,
  FiGitCommit,
  FiGrid,
  FiPenTool,
  FiPlay,
  FiCheckCircle,
} from 'react-icons/fi'
import { DESIGN_PROCESS } from '../data/projects'

const ICONS = {
  research: FiSearch,
  flow: FiGitCommit,
  wireframe: FiGrid,
  ui: FiPenTool,
  prototype: FiPlay,
  testing: FiCheckCircle,
}

export default function DesignProcess() {
  return (
    <section id="process" className="section bg-bg-soft relative">
      <div className="container">
        {/* Head */}
        <div className="section-head" data-aos="fade-up">
          <span className="section-eyebrow">Alur Kerja</span>
          <h2 className="section-title">Proses Desain UI/UX</h2>
          <p className="section-sub">
            Pendekatan terstruktur dan berulang (iterative) untuk memastikan setiap solusi digital tepat guna,
            efisien bagi bisnis, dan dicintai oleh pengguna.
          </p>
        </div>

        {/* 6 Steps Process Cards */}
        <div className="relative" data-aos="fade-up">
          {/* Connecting line for desktop */}
          <div
            aria-hidden="true"
            className="absolute left-6 right-6 top-9.5 hidden border-t-2 border-dashed border-[#6258F5]/30 lg:block"
          />

          <ol className="relative grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-6 lg:gap-3.5">
            {DESIGN_PROCESS.map(({ step, title, desc, deliverable, icon }, i) => {
              const Icon = ICONS[icon] || FiCheckCircle
              return (
                <li
                  key={step}
                  className="group flex flex-col justify-between rounded-2xl border border-line bg-surface p-5 transition-all duration-300 hover:-translate-y-2 hover:border-[#6258F5]/60 hover:shadow-card-hover"
                  data-aos="fade-up"
                  data-aos-delay={i * 70}
                >
                  <div>
                    {/* Step Icon & Number Badge */}
                    <div className="relative mb-4 flex items-center justify-between">
                      <span className="grid h-14 w-14 place-items-center rounded-2xl bg-indigo-soft text-[1.4rem] text-[#9BA8FF] transition-all duration-300 group-hover:scale-110 group-hover:bg-[#6258F5] group-hover:text-white group-hover:shadow-[0_8px_20px_rgba(98,88,245,0.35)]">
                        <Icon />
                      </span>
                      <span className="grid h-7 w-7 place-items-center rounded-full bg-linear-to-br from-[#6258F5] to-[#4B41DB] font-heading text-[0.72rem] font-extrabold text-white shadow-md">
                        {step}
                      </span>
                    </div>

                    <h3 className="font-heading text-[1.08rem] font-bold text-heading group-hover:text-[#9BA8FF] transition-colors">
                      {title}
                    </h3>

                    <p className="mt-2 text-[0.82rem] leading-relaxed text-mute">
                      {desc}
                    </p>
                  </div>

                  <div className="mt-4 border-t border-line/60 pt-3">
                    <span className="block text-[0.65rem] font-bold uppercase tracking-wider text-faint">
                      Output:
                    </span>
                    <span className="text-[0.74rem] font-semibold text-[#9BA8FF]">
                      {deliverable}
                    </span>
                  </div>
                </li>
              )
            })}
          </ol>
        </div>
      </div>
    </section>
  )
}
