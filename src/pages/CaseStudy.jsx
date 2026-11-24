import { useEffect, useState } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import {
  FiArrowLeft,
  FiArrowRight,
  FiAlertCircle,
  FiTarget,
  FiXCircle,
  FiCheckCircle,
  FiPlay,
} from 'react-icons/fi'
import useProjects from '../hooks/useProjects'
import ProjectMockup from '../components/ProjectMockup'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import LoadingScreen from '../components/LoadingScreen'

const SECTIONS = [
  ['overview', 'Project Overview'],
  ['problem', 'Problem'],
  ['research', 'User Research'],
  ['persona', 'User Persona'],
  ['flow', 'User Flow'],
  ['wireframe', 'Wireframe'],
  ['ui', 'UI Design'],
  ['prototype', 'Prototype'],
  ['result', 'Final Result'],
]

function CaseBlock({ n, id, title, children }) {
  return (
    <section id={`cs-${id}`} className="scroll-mt-28 border-t border-line pt-10 first:border-0 first:pt-0">
      <p className="case-num mb-2">{n} / 09</p>
      <h2 className="case-section-title mb-5">{title}</h2>
      <div className="space-y-4 text-[0.95rem] leading-relaxed text-mute">{children}</div>
    </section>
  )
}

export default function CaseStudy() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { projects, getProject } = useProjects()
  const project = getProject(id)
  const [active, setActive] = useState('overview')

  const all = projects
  const idx = all.findIndex((p) => p.id === id)
  const next = idx >= 0 ? all[(idx + 1) % all.length] : null

  // Jika proyek tidak ditemukan (misal ID lama yang dihapus), arahkan otomatis ke beranda
  useEffect(() => {
    if (!project) {
      const timer = setTimeout(() => {
        navigate('/', { replace: true })
      }, 700)
      return () => clearTimeout(timer)
    }
  }, [project, navigate])

  useEffect(() => {
    const els = SECTIONS.map(([s]) => document.getElementById(`cs-${s}`)).filter(Boolean)
    if (!els.length) return
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.id.replace('cs-', ''))
        }
      },
      { rootMargin: '-30% 0px -60% 0px' },
    )
    els.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [id])

  if (!project) {
    return <LoadingScreen message="Menyiapkan data studi kasus..." />
  }

  const cs = project.caseStudy
  const jump = (s) =>
    document.getElementById(`cs-${s}`)?.scrollIntoView({ behavior: 'smooth' })

  return (
    <>
      <Navbar />

      <main className="pt-18">
        <div className="section bg-bg-soft">
          <div className="container">
            <Link
              to="/"
              className="mb-8 inline-flex items-center gap-2 text-[0.88rem] font-bold text-mute transition-colors hover:text-indigo"
            >
              <FiArrowLeft /> Kembali ke Beranda
            </Link>

            <div className="grid items-center gap-10 lg:grid-cols-[1fr_0.85fr]">
              <div data-aos="fade-up">
                <span
                  className="mb-4 inline-flex rounded-full px-4 py-1.5 text-[0.72rem] font-bold uppercase tracking-[0.16em]"
                  style={{ background: project.tint, color: project.accent }}
                >
                  {project.category}
                </span>
                <h1 className="mb-3 font-heading text-[clamp(2rem,4.5vw,3rem)] text-heading">
                  {project.title}
                </h1>
                <p className="mb-6 font-heading text-[1.05rem] font-semibold text-indigo">
                  {project.subtitle}
                </p>
                <p className="mb-8 max-w-130 text-[0.98rem] leading-relaxed text-mute">
                  {project.desc}
                </p>

                <div className="grid max-w-120 grid-cols-3 gap-3">
                  {[
                    ['Role', project.role],
                    ['Tools', (project.tools || []).join(', ')],
                    ['Duration', project.duration || '—'],
                  ].map(([label, value]) => (
                    <div key={label} className="card p-4">
                      <p className="text-[0.68rem] font-bold uppercase tracking-[0.12em] text-faint">
                        {label}
                      </p>
                      <p className="mt-1 text-[0.84rem] font-bold text-ink">{value}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div
                className="relative flex min-h-80 items-center justify-center overflow-hidden rounded-[1.75rem] border border-line p-8"
                style={{ background: project.tint }}
                data-aos="fade-up"
                data-aos-delay="100"
              >
                {project.variant ? (
                  project.frame === 'browser' ? (
                    <ProjectMockup variant={project.variant} frame="browser" className="w-full" />
                  ) : (
                    <ProjectMockup variant={project.variant} frame="phone" className="scale-110" />
                  )
                ) : (
                  <span
                    className="grid h-24 w-24 place-items-center rounded-3xl font-heading text-[2rem] font-bold text-white shadow-pop"
                    style={{ background: project.accent }}
                  >
                    {project.title.slice(0, 2).toUpperCase()}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="section bg-bg">
          <div
            className={`container grid gap-12 ${
              cs ? 'lg:grid-cols-[210px_1fr]' : ''
            }`}
          >
            {cs && (
              <aside className="hidden lg:block">
              <nav className="sticky top-28">
                <p className="mb-4 text-[0.7rem] font-bold uppercase tracking-[0.16em] text-faint">
                  Case Study
                </p>
                <ul className="flex flex-col gap-1 border-l border-line">
                  {SECTIONS.map(([s, label], i) => (
                    <li key={s}>
                      <button
                        type="button"
                        onClick={() => jump(s)}
                        className={`-ml-px block border-l-2 py-2 pl-4 text-left text-[0.84rem] font-semibold transition-colors ${
                          active === s
                            ? 'border-indigo text-indigo'
                            : 'border-transparent text-mute hover:text-heading'
                        }`}
                      >
                        <span className="mr-2 text-[0.7rem] text-faint">
                          {String(i + 1).padStart(2, '0')}
                        </span>
                        {label}
                      </button>
                    </li>
                  ))}
                </ul>
              </nav>
            </aside>
            )}

            <article className="min-w-0">
              {!cs ? (
                <div className="card p-9 text-center">
                  {project.image && (
                    <img
                      src={project.image}
                      alt={project.title}
                      className="mx-auto mb-7 aspect-4/3 w-full max-w-xl rounded-2xl border border-line object-cover"
                    />
                  )}
                  <h2 className="case-section-title mb-3">Case Study Menyusul</h2>
                  <p className="mx-auto mb-6 max-w-md text-[0.93rem] text-mute">
                    Project &ldquo;{project.title}&rdquo; baru ditambahkan. Ringkasan project
                    sudah terlihat di bagian atas, dan detail case study lengkap akan segera
                    diisi.
                  </p>
                  <div className="flex flex-wrap justify-center gap-3">
                    <Link to="/" className="btn btn-primary">
                      <FiArrowLeft /> Kembali ke Beranda
                    </Link>
                    {next && (
                      <Link to={`/case-study/${next.id}`} className="btn btn-outline">
                        Next Project <FiArrowRight />
                      </Link>
                    )}
                  </div>
                </div>
              ) : (
                <div className="flex flex-col gap-10">
                  <CaseBlock n="01" id="overview" title="Project Overview">
                    <p>{cs.overview}</p>
                    <div className="flex flex-wrap gap-2 pt-1">
                      {(project.tools || []).map((t) => (
                        <span key={t} className="chip chip-indigo">
                          {t}
                        </span>
                      ))}
                    </div>
                  </CaseBlock>

                  <CaseBlock n="02" id="problem" title="Problem">
                    <p>{cs.problem}</p>
                    <ul className="space-y-3 pt-1">
                      {cs.problemPoints.map((p) => (
                        <li
                          key={p}
                          className="flex gap-3 rounded-xl border border-line bg-bg-soft p-4 text-[0.9rem] text-ink"
                        >
                          <FiAlertCircle className="mt-0.5 shrink-0 text-[1.1rem] text-indigo" />
                          <span>{p}</span>
                        </li>
                      ))}
                    </ul>
                  </CaseBlock>

                  <CaseBlock n="03" id="research" title="User Research">
                    <p>{cs.research.summary}</p>
                    <div className="flex flex-wrap gap-2 pt-1">
                      {cs.research.methods.map((m) => (
                        <span key={m} className="chip">
                          {m}
                        </span>
                      ))}
                    </div>
                    <ul className="space-y-3 pt-1">
                      {cs.research.findings.map((f) => (
                        <li key={f} className="flex gap-3 text-[0.9rem] text-ink">
                          <FiCheckCircle className="mt-0.5 shrink-0 text-[1.05rem] text-emerald-500" />
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>
                  </CaseBlock>

                  <CaseBlock n="04" id="persona" title="User Persona">
                    <div className="card overflow-hidden">
                      <div
                        className="flex flex-wrap items-center gap-4 p-6"
                        style={{ background: project.tint }}
                      >
                        <span
                          className="grid h-16 w-16 shrink-0 place-items-center rounded-full font-heading text-[1.3rem] font-bold text-white"
                          style={{ background: project.accent }}
                        >
                          {cs.persona.name
                            .split(' ')
                            .map((w) => w[0])
                            .join('')}
                        </span>
                        <span>
                          <span className="block font-heading text-[1.1rem] font-bold text-heading">
                            {cs.persona.name}, {cs.persona.age}
                          </span>
                          <span className="block text-[0.85rem] font-semibold text-mute">
                            {cs.persona.job}
                          </span>
                        </span>
                      </div>

                      <div className="p-6">
                        <p className="mb-6 border-l-4 border-indigo pl-4 font-heading text-[0.98rem] font-semibold italic text-ink">
                          &ldquo;{cs.persona.quote}&rdquo;
                        </p>

                        <div className="grid gap-6 sm:grid-cols-2">
                          <div>
                            <p className="mb-3 flex items-center gap-2 text-[0.75rem] font-bold uppercase tracking-[0.12em] text-indigo">
                              <FiTarget /> Goals
                            </p>
                            <ul className="space-y-2">
                              {cs.persona.goals.map((g) => (
                                <li key={g} className="text-[0.87rem] text-mute">
                                  • {g}
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div>
                            <p className="mb-3 flex items-center gap-2 text-[0.75rem] font-bold uppercase tracking-[0.12em] text-rose-500">
                              <FiXCircle /> Frustrations
                            </p>
                            <ul className="space-y-2">
                              {cs.persona.frustrations.map((f) => (
                                <li key={f} className="text-[0.87rem] text-mute">
                                  • {f}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CaseBlock>

                  <CaseBlock n="05" id="flow" title="User Flow">
                    <div className="flex flex-wrap items-center gap-2.5 pt-1">
                      {cs.flow.map((step, i) => (
                        <span key={step} className="flex items-center gap-2.5">
                          <span className="flex items-center gap-2">
                            <span className="chip chip-indigo">
                              <span className="font-heading text-[0.7rem] font-bold text-faint">
                                {String(i + 1).padStart(2, '0')}
                              </span>
                              {step}
                            </span>
                            {i < cs.flow.length - 1 && (
                              <FiArrowRight className="text-[0.95rem] text-indigo" />
                            )}
                          </span>
                          {i < cs.flow.length - 1 && (
                            <FiArrowRight className="text-[0.95rem] text-indigo" />
                          )}
                        </span>
                      ))}
                    </div>
                  </CaseBlock>

                  <CaseBlock n="06" id="wireframe" title="Wireframe">
                    <p>{cs.wireframe}</p>
                    <div className="flex justify-center rounded-2xl border border-line bg-bg-soft py-8">
                      <ProjectMockup
                        variant={project.variant}
                        frame={project.frame}
                        mode="wireframe"
                      />
                    </div>
                  </CaseBlock>

                  <CaseBlock n="07" id="ui" title="UI Design">
                    <p>{cs.uiDesign}</p>
                    <div className="flex flex-wrap gap-3 pt-1">
                      {cs.palette.map((hex) => (
                        <span key={hex} className="flex items-center gap-2">
                          <span
                            className="h-9 w-9 rounded-xl border border-line"
                            style={{ background: hex }}
                          />
                          <span className="text-[0.78rem] font-semibold uppercase text-faint">
                            {hex}
                          </span>
                        </span>
                      ))}
                    </div>
                    <div className="flex justify-center rounded-2xl border border-line bg-bg-soft py-8">
                      {project.variant ? (
                        project.frame === 'browser' ? (
                          <ProjectMockup variant={project.variant} frame="browser" className="w-full max-w-xl" />
                        ) : (
                          <ProjectMockup variant={project.variant} frame="phone" />
                        )
                      ) : (
                        <div
                          className="grid h-40 w-40 place-items-center rounded-3xl font-heading text-[2rem] font-bold text-white"
                          style={{ background: project.accent }}
                        >
                          {project.title.slice(0, 2).toUpperCase()}
                        </div>
                      )}
                    </div>
                  </CaseBlock>

                  <CaseBlock n="08" id="prototype" title="Prototype">
                    <p>{cs.prototype}</p>
                    <div className="relative flex justify-center rounded-2xl border border-line bg-bg-soft py-8">
                      {project.variant ? (
                        project.frame === 'browser' ? (
                          <ProjectMockup variant={project.variant} frame="browser" className="w-full max-w-xl" />
                        ) : (
                          <ProjectMockup variant={project.variant} frame="phone" />
                        )
                      ) : (
                        <div
                          className="grid h-40 w-40 place-items-center rounded-3xl font-heading text-[2rem] font-bold text-white"
                          style={{ background: project.accent }}
                        >
                          {project.title.slice(0, 2).toUpperCase()}
                        </div>
                      )}
                      <span
                        aria-hidden="true"
                        className="absolute left-1/2 top-1/2 grid h-16 w-16 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-indigo text-[1.5rem] text-white shadow-button"
                      >
                        <FiPlay className="ml-1" />
                      </span>
                    </div>
                  </CaseBlock>

                  <CaseBlock n="09" id="result" title="Final Result">
                    <p>{cs.result}</p>
                    <ul className="space-y-3 pt-1">
                      {cs.outcomes.map((o) => (
                        <li
                          key={o}
                          className="flex gap-3 rounded-xl border border-emerald-500/20 bg-emerald-500/7 p-4 text-[0.9rem] text-ink"
                        >
                          <FiCheckCircle className="mt-0.5 shrink-0 text-[1.1rem] text-emerald-500" />
                          <span>{o}</span>
                        </li>
                      ))}
                    </ul>
                  </CaseBlock>
                </div>
              )}

              {next && (
                <div className="mt-14 border-t border-line pt-10">
                  <p className="mb-4 text-[0.72rem] font-bold uppercase tracking-[0.16em] text-faint">
                    Next Project
                  </p>
                  <Link
                    to={`/case-study/${next.id}`}
                    className="card card-hover group flex items-center justify-between gap-4 p-6"
                  >
                    <span>
                      <span className="block font-heading text-[1.2rem] font-bold text-heading">
                        {next.title}
                      </span>
                      <span className="block text-[0.85rem] text-mute">{next.subtitle}</span>
                    </span>
                    <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-indigo text-white transition-transform duration-200 group-hover:translate-x-1">
                      <FiArrowRight />
                    </span>
                  </Link>
                </div>
              )}
            </article>
          </div>
        </div>
      </main>

      <Footer />
    </>
  )
}
