import {
  SiHtml5,
  SiCss,
  SiJavascript,
  SiReact,
  SiLaravel,
  SiBootstrap,
  SiFigma,
} from 'react-icons/si'

const SKILLS = [
  { name: 'HTML', level: 92, Icon: SiHtml5, color: '#e34f26' },
  { name: 'CSS', level: 88, Icon: SiCss, color: '#1572b6' },
  { name: 'JavaScript', level: 80, Icon: SiJavascript, color: '#f7df1e' },
  { name: 'React', level: 78, Icon: SiReact, color: '#61dafb' },
  { name: 'Laravel', level: 70, Icon: SiLaravel, color: '#ff2d20' },
  { name: 'Bootstrap', level: 85, Icon: SiBootstrap, color: '#7952b3' },
  { name: 'Figma', level: 82, Icon: SiFigma, color: '#a259ff' },
]

export default function Skills() {
  return (
    <section id="skills" className="relative py-24 max-sm:py-[72px]">
      <div className="container">
        <div className="section-head" data-aos="fade-up">
          <span className="section-eyebrow">Skills</span>
          <h2 className="section-title">
            Keahlian <span className="gradient">Teknis</span>
          </h2>
          <p className="section-sub">
            Teknologi yang saya gunakan untuk membangun produk digital.
          </p>
        </div>

        <div className="grid gap-5 [grid-template-columns:repeat(auto-fill,minmax(250px,1fr))]">
          {SKILLS.map(({ name, level, Icon, color }) => (
            <div key={name} className="glass-card p-6" data-aos="fade-up">
              <div className="mb-4 flex items-center gap-3.5">
                <span
                  className="grid h-[46px] w-[46px] shrink-0 place-items-center rounded-xl text-[1.5rem]"
                  style={{ color, background: `${color}1a` }}
                >
                  <Icon />
                </span>
                <span className="font-heading text-[1.05rem] font-bold text-heading">
                  {name}
                </span>
                <span className="ml-auto font-heading text-[0.9rem] font-bold text-mute">
                  {level}%
                </span>
              </div>
              <div className="h-2 overflow-hidden rounded-[10px] bg-soft">
                <span
                  className="block h-full rounded-[10px] shadow-[0_0_12px_rgba(168,85,247,0.4)]"
                  style={{
                    width: `${level}%`,
                    background: `linear-gradient(90deg, ${color}, var(--color-purple))`,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}