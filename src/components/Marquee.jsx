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

function Item({ name, role, icon, color }) {
  const Icon = ICONS[icon] || SiFigma
  return (
    <span className="mx-6 inline-flex shrink-0 items-center gap-3 text-mute">
      <span
        className="grid h-10 w-10 place-items-center rounded-xl text-[1.2rem] shadow-sm"
        style={{ color, background: `${color}18` }}
      >
        <Icon />
      </span>
      <div>
        <span className="font-heading text-[0.95rem] font-bold tracking-tight text-heading">
          {name}
        </span>
        <span className="block text-[0.72rem] text-slate-400 font-medium">
          {role}
        </span>
      </div>
      <span aria-hidden="true" className="ml-4 h-1.5 w-1.5 rounded-full bg-[#6258F5]/40" />
    </span>
  )
}

export default function Marquee() {
  const row = [...TOOLS, ...TOOLS, ...TOOLS]

  return (
    <div className="border-y border-line bg-[#0D1224] py-4" aria-label="Tools yang digunakan">
      <div className="marquee">
        <div className="marquee-track items-center">
          {row.map((t, i) => (
            <Item key={`${t.name}-${i}`} {...t} />
          ))}
        </div>
      </div>
    </div>
  )
}
