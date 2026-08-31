import { FiExternalLink, FiGithub } from 'react-icons/fi'
import {
  SiReact,
  SiFigma,
  SiLaravel,
  SiJavascript,
  SiPhp,
  SiTailwindcss,
  SiHtml5,
  SiCss,
} from 'react-icons/si'
import { MdDesignServices } from 'react-icons/md'

const PROJECTS = [
  {
    title: 'Website Portfolio',
    desc: 'Portofolio pribadi modern dengan animasi scroll, glassmorphism, dan desain responsif.',
    tags: ['React', 'Vite', 'Framer Motion'],
    Icon: SiReact,
    gradient: 'linear-gradient(135deg, #0ea5e9, #6366f1)',
  },
  {
    title: 'UI/UX Figma',
    desc: 'Desain antarmuka aplikasi dengan sistem desain, wireframe, hingga prototype interaktif.',
    tags: ['Figma', 'Prototype', 'Design System'],
    Icon: SiFigma,
    gradient: 'linear-gradient(135deg, #a259ff, #ff7262)',
  },
  {
    title: 'Laravel CRUD',
    desc: 'Aplikasi web dengan autentikasi dan CRUD lengkap menggunakan Laravel dan MySQL.',
    tags: ['Laravel', 'PHP', 'MySQL'],
    Icon: SiLaravel,
    gradient: 'linear-gradient(135deg, #ff2d20, #f97316)',
  },
  {
    title: 'React Website',
    desc: 'Situs dinamis berbasis React dengan komponen reusable dan state management rapi.',
    tags: ['React', 'Tailwind', 'Vite'],
    Icon: SiTailwindcss,
    gradient: 'linear-gradient(135deg, #22d3ee, #10b981)',
  },
  {
    title: 'Mobile Design',
    desc: 'Desain UI aplikasi mobile mulai dari onboarding hingga halaman detail produk.',
    tags: ['Figma', 'Mobile', 'UI Design'],
    Icon: MdDesignServices,
    gradient: 'linear-gradient(135deg, #8b5cf6, #ec4899)',
  },
]

const TAGS_ICON = {
  React: SiReact,
  Vite: SiJavascript,
  'Framer Motion': SiJavascript,
  Figma: SiFigma,
  Laravel: SiLaravel,
  PHP: SiPhp,
  Tailwind: SiTailwindcss,
  HTML: SiHtml5,
  CSS: SiCss,
}

export default function Projects() {
  return (
    <section id="projects" className="relative py-24 max-sm:py-[72px]">
      <div className="container">
        <div className="section-head" data-aos="fade-up">
          <span className="section-eyebrow">Project</span>
          <h2 className="section-title">
            Karya <span className="gradient">Terbaik</span>
          </h2>
          <p className="section-sub">
            Beberapa project yang pernah saya kerjakan — web, desain, dan mobile.
          </p>
        </div>

        <div className="grid gap-6 [grid-template-columns:repeat(auto-fill,minmax(300px,1fr))]">
          {PROJECTS.map(({ title, desc, tags, Icon, gradient }) => (
            <article
              key={title}
              className="glass-card group flex flex-col overflow-hidden"
              data-aos="fade-up"
            >
              <div
                className="relative grid h-[190px] place-items-center overflow-hidden max-sm:h-40"
                style={{ background: gradient }}
              >
                <span className="project-thumb-grid" />
                <Icon className="relative z-[1] text-[4rem] text-white/95 drop-shadow-[0_8px_20px_rgba(0,0,0,0.4)] transition-transform duration-300 group-hover:scale-[1.12]" />
                <span className="absolute left-3.5 top-3.5 z-[2] rounded-full border border-white/25 bg-black/35 px-3 py-1.5 text-[0.72rem] font-bold uppercase tracking-[0.08em] text-white backdrop-blur-md">
                  {tags[0]}
                </span>
              </div>

              <div className="flex flex-1 flex-col p-6">
                <h3 className="mb-2.5 font-heading text-[1.2rem] text-heading">
                  {title}
                </h3>
                <p className="mb-4 flex-1 text-[0.92rem] text-mute">{desc}</p>

                <div className="mb-5 flex flex-wrap gap-2">
                  {tags.map((t) => {
                    const Tag = TAGS_ICON[t] || SiJavascript
                    return (
                      <span
                        key={t}
                        className="inline-flex items-center gap-1.5 rounded-full border border-line bg-soft px-3 py-1.5 text-[0.76rem] font-semibold text-mute"
                      >
                        <Tag /> {t}
                      </span>
                    )
                  })}
                </div>

                <div className="flex gap-2.5">
                  <a
                    href="#"
                    className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue to-purple py-3 text-[0.88rem] font-bold text-white shadow-[0_6px_20px_rgba(99,102,241,0.3)] transition-colors hover:shadow-[0_10px_26px_rgba(168,85,247,0.4)]"
                    onClick={(e) => e.preventDefault()}
                  >
                    <FiExternalLink /> Demo
                  </a>
                  <a
                    href="https://github.com"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-line bg-soft py-3 text-[0.88rem] font-bold text-ink transition-colors hover:border-purple hover:text-heading"
                  >
                    <FiGithub /> GitHub
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}