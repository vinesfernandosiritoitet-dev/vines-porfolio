import { SiFigma } from 'react-icons/si'
import { FaPalette, FaPaintBrush } from 'react-icons/fa'
import { FiPlayCircle, FiFeather } from 'react-icons/fi'
import { TOOLS } from '../data/projects'

const ICONS = {
  figma: SiFigma,
  rive: FiPlayCircle,
  canva: FaPalette,
  illustrator: FiFeather,
  photoshop: FaPaintBrush,
}

export default function Tools() {
  return (
    <section id="tools" className="section bg-bg">
      <div className="container">
        <div className="section-head" data-aos="fade-up">
          <span className="section-eyebrow">Design Stack</span>
          <h2 className="section-title">Tools yang Saya Gunakan</h2>
          <p className="section-sub">
            Perangkat standar industri untuk riset kebutuhan, wireframing, perancangan visual, dan prototyping interaktif.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {TOOLS.map(({ name, role, icon, color }, i) => {
            const Icon = ICONS[icon] || SiFigma
            return (
              <div
                key={name}
                className="card card-hover flex flex-col items-center gap-3 p-5 text-center"
                data-aos="fade-up"
                data-aos-delay={(i % 5) * 60}
              >
                <span
                  className="grid h-14 w-14 place-items-center rounded-2xl text-[1.6rem]"
                  style={{ color, background: `${color}1a` }}
                >
                  <Icon />
                </span>
                <div>
                  <span className="block font-heading text-[0.98rem] font-bold text-heading">
                    {name}
                  </span>
                  <span className="block text-[0.74rem] text-mute">{role}</span>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
