import { FiLayout, FiSearch, FiPlayCircle, FiBox } from 'react-icons/fi'

// 4 Keahlian Utama UI/UX
const SKILLS = [
  {
    name: 'UI Design',
    category: 'Visual & Interface',
    note: 'Hierarki visual, tipografi presisi, harmoni warna, dan penyusunan komponen modern yang memanjakan mata.',
    icon: FiLayout,
    levelLabel: 'Expert',
    tags: ['Auto Layout', 'Visual Hierarchy', 'Clean UI'],
    accent: '#2563EB',
  },
  {
    name: 'UX Research',
    category: 'User Centered',
    note: 'User interview, empathy mapping, competitor audit, dan validasi mendalam terhadap kebutuhan nyata pengguna.',
    icon: FiSearch,
    levelLabel: 'Advanced',
    tags: ['Empathy Map', 'User Persona', 'Pain Points'],
    accent: '#0A66C2',
  },
  {
    name: 'Prototyping',
    category: 'Interaction',
    note: 'Simulasi interaksi realistis, transisi smart animate, dan alur aplikasi nyata yang siap diuji ke klien.',
    icon: FiPlayCircle,
    levelLabel: 'Expert',
    tags: ['Smart Animate', 'Micro-Interactions', 'Clickable Flow'],
    accent: '#A259FF',
  },
  {
    name: 'Design System',
    category: 'Scalability',
    note: 'Penyusunan design tokens, reusable components, variants, dan panduan dokumentasi konsisten untuk tim developer.',
    icon: FiBox,
    levelLabel: 'Expert',
    tags: ['Reusable Components', 'Design Tokens', 'Variants'],
    accent: '#25D366',
  },
]

// Tools yang Digunakan: Figma, React, JavaScript, HTML, CSS
const TOOLS = [
  {
    name: 'Figma',
    role: 'UI/UX & Design System',
    desc: 'Desain antarmuka, interactive prototype, dan komponen sistem terstruktur.',
    bg: 'rgba(10, 207, 131, 0.12)',
    badge: 'Primary Design',
    svg: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
        <path d="M8 24C10.2091 24 12 22.2091 12 20V16H8C5.79086 16 4 17.7909 4 20C4 22.2091 5.79086 24 8 24Z" fill="#0ACF83" />
        <path d="M4 12C4 9.79086 5.79086 8 8 8H12V16H8C5.79086 16 4 14.2091 4 12Z" fill="#A259FF" />
        <path d="M4 4C4 1.79086 5.79086 0 8 0H12V8H8C5.79086 8 4 6.20914 4 4Z" fill="#F24E1E" />
        <path d="M12 0H16C18.2091 0 20 1.79086 20 4C20 6.20914 18.2091 8 16 8H12V0Z" fill="#FF7262" />
        <path d="M20 12C20 14.2091 18.2091 16 16 16C13.7909 16 12 14.2091 12 12C12 9.79086 13.7909 8 16 8C18.2091 8 20 9.79086 20 12Z" fill="#1ABCFE" />
      </svg>
    ),
  },
  {
    name: 'React',
    role: 'Frontend Library',
    desc: 'Membangun antarmuka web modern berbasis komponen yang cepat dan interaktif.',
    bg: 'rgba(97, 218, 251, 0.14)',
    badge: 'UI Engineering',
    svg: (
      <svg width="26" height="26" viewBox="-11.5 -10.23174 23 20.46348" fill="none">
        <circle cx="0" cy="0" r="2.05" fill="#0EA5E9" />
        <g stroke="#0EA5E9" strokeWidth="1" fill="none">
          <ellipse rx="11" ry="4.2" />
          <ellipse rx="11" ry="4.2" transform="rotate(60)" />
          <ellipse rx="11" ry="4.2" transform="rotate(120)" />
        </g>
      </svg>
    ),
  },
  {
    name: 'JavaScript',
    role: 'Scripting & Logic',
    desc: 'Menghidupkan interaksi dinamis, animasi, dan logika aplikasi sisi klien.',
    bg: 'rgba(247, 223, 30, 0.16)',
    badge: 'Interactivity',
    svg: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
        <rect width="24" height="24" rx="5" fill="#F7DF1E" />
        <path
          d="M10.5 17.6C10.5 18.9 9.7 19.6 8.3 19.6C7.3 19.6 6.6 19.1 6.2 18.3L7.5 17.5C7.7 17.9 8 18.2 8.4 18.2C8.9 18.2 9.1 17.9 9.1 17.4V11.8H10.5V17.6ZM14.6 19.6C13.1 19.6 12.1 18.9 11.6 17.9L12.9 17.1C13.3 17.7 13.8 18.1 14.6 18.1C15.3 18.1 15.8 17.8 15.8 17.3C15.8 16.7 15.3 16.5 14.3 16.1L13.8 15.9C12.5 15.3 11.8 14.6 11.8 13.3C11.8 12.1 12.8 11.2 14.3 11.2C15.4 11.2 16.3 11.6 16.8 12.5L15.5 13.3C15.2 12.8 14.8 12.6 14.3 12.6C13.7 12.6 13.3 12.9 13.3 13.3C13.3 13.8 13.7 14 14.7 14.4L15.2 14.6C16.7 15.2 17.4 15.9 17.4 17.3C17.4 18.7 16.2 19.6 14.6 19.6Z"
          fill="#1E293B"
        />
      </svg>
    ),
  },
  {
    name: 'HTML',
    role: 'Web Markup',
    desc: 'Menyusun struktur halaman web semantik yang rapi, bersih, dan ramah aksesibilitas.',
    bg: 'rgba(227, 79, 38, 0.13)',
    badge: 'Structure',
    svg: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
        <path d="M3 2L4.6 20L12 22L19.4 20L21 2H3Z" fill="#E34F26" />
        <path d="M12 3.5V20.4L18 18.8L19.3 3.5H12Z" fill="#EF652A" />
        <path d="M7.5 6.8H16.5L16.3 9H9.9L10.1 11.3H16.1L15.5 17.1L12 18.1L8.5 17.1L8.3 14.3H10.5L10.6 15.5L12 15.9L13.4 15.5L13.6 13.4H8.1L7.5 6.8Z" fill="#FFFFFF" />
      </svg>
    ),
  },
  {
    name: 'CSS',
    role: 'Styling & Layout',
    desc: 'Mengatur tata letak responsif, tipografi, grid, dan animasi halus lintas perangkat.',
    bg: 'rgba(21, 114, 182, 0.13)',
    badge: 'Visual Style',
    svg: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
        <path d="M3 2L4.6 20L12 22L19.4 20L21 2H3Z" fill="#1572B6" />
        <path d="M12 3.5V20.4L18 18.8L19.3 3.5H12Z" fill="#33A9DC" />
        <path d="M7.5 6.8H16.5L16.2 9H12.1L16.1 11.1L15.5 17.1L12 18.1L8.5 17.1L8.3 14.3H10.5L10.6 15.5L12 15.9L13.4 15.5L13.6 13.2H8.2L8.4 11.1L12.3 9H7.7L7.5 6.8Z" fill="#FFFFFF" />
      </svg>
    ),
  },
]

export default function Skills() {
  return (
    <section id="skills" className="section bg-bg-soft relative">
      <div className="container">
        {/* Head */}
        <div className="section-head mb-12" data-aos="fade-up">
          <span className="section-eyebrow">Keahlian &amp; Kapabilitas</span>
          <h2 className="section-title">Apa yang Saya Kuasai</h2>
          <p className="section-sub">
            Fokus pada empat pilar utama perancangan produk digital, dari riset pengguna hingga implementasi design system yang terukur.
          </p>
        </div>

        {/* 4 Keahlian Cards Grid */}
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {SKILLS.map(
            ({ name, category, note, icon: Icon, levelLabel, tags, accent }, i) => (
              <div
                key={name}
                className="card group relative flex flex-col justify-between overflow-hidden p-6 transition-[border-color,box-shadow] duration-300 hover:border-indigo/50 hover:shadow-card-hover"
                data-aos="fade-up"
                data-aos-delay={i * 70}
              >
                <div>
                  {/* Top Bar: Icon & Level */}
                  <div className="mb-4 flex items-center justify-between">
                    <span
                      className="grid h-12 w-12 place-items-center rounded-2xl text-[1.35rem] transition-transform duration-300 group-hover:-translate-y-1 group-hover:scale-110 group-hover:rotate-3 shadow-xs"
                      style={{
                        color: accent,
                        backgroundColor: `${accent}18`,
                      }}
                    >
                      <Icon />
                    </span>
                    <span className="rounded-full border border-indigo/20 bg-indigo-soft px-2.5 py-0.5 text-[0.68rem] font-bold uppercase tracking-wider text-indigo">
                      {levelLabel}
                    </span>
                  </div>

                  <p className="text-[0.7rem] font-bold uppercase tracking-[0.14em] text-mute">
                    {category}
                  </p>
                  <h3 className="mt-1 font-heading text-[1.18rem] font-bold text-heading transition-colors group-hover:text-indigo">
                    {name}
                  </h3>
                  <p className="mt-2 text-[0.84rem] leading-relaxed text-mute">
                    {note}
                  </p>

                  {/* Deliverables / Skill Tags */}
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-lg border border-line/70 bg-bg-soft px-2.5 py-1 text-[0.72rem] font-medium text-mute transition-colors group-hover:border-indigo/25 group-hover:text-heading"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )
          )}
        </div>

        {/* Tools yang Digunakan Section */}
        <div className="mt-16 pt-12 border-t border-line" data-aos="fade-up">
          <div className="text-center mb-10">
            <span className="section-eyebrow">Design &amp; Tech Stack</span>
            <h3 className="font-heading text-[clamp(1.5rem,3vw,2rem)] font-bold text-heading">
              Tools yang Digunakan
            </h3>
            <p className="mx-auto mt-2 max-w-135 text-[0.92rem] text-mute">
              Perangkat desain dan teknologi web yang saya gunakan untuk mengubah konsep menjadi pengalaman digital yang nyata.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {TOOLS.map(({ name, role, desc, bg, badge, svg }, i) => (
              <div
                key={name}
                className="card group flex flex-col items-center text-center p-5 transition-[border-color,box-shadow] duration-300 hover:border-indigo/50 hover:shadow-card-hover"
                data-aos="fade-up"
                data-aos-delay={i * 60}
              >
                <div
                  className="mb-3.5 grid h-14 w-14 place-items-center rounded-2xl shadow-sm transition-transform duration-300 group-hover:-translate-y-1 group-hover:scale-110 group-hover:-rotate-3 animate-float"
                  style={{ background: bg, animationDelay: `${i * 0.4}s` }}
                >
                  {svg}
                </div>

                <span className="mb-1.5 rounded-full bg-soft px-2.5 py-0.5 text-[0.64rem] font-bold uppercase tracking-wider text-mute border border-line">
                  {badge}
                </span>

                <h4 className="font-heading text-[1.02rem] font-bold text-heading group-hover:text-indigo transition-colors">
                  {name}
                </h4>

                <p className="mt-0.5 text-[0.73rem] font-semibold text-indigo">
                  {role}
                </p>

                <p className="mt-2 text-[0.76rem] leading-relaxed text-mute">
                  {desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
