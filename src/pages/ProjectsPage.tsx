import { useEffect } from 'react'
import { usePageTheme } from '../context/PageThemeContext'
import { Link } from 'react-router-dom'

// ── Project data ───────────────────────────────────────────────────────────────

type Media = { type: 'video'; src: string } | { type: 'img'; src: string }

const PROJECTS: Array<{
  id: string
  label: string
  desc: string
  media: Media
  to: string
}> = [
  {
    id: 'hovr',
    label: 'HOVR',
    desc: '84.9% Faster Driver Approvals via OCR Automation',
    media: { type: 'video', src: '/hovr/Bulk-approval.mp4' },
    to: '/projects/hovr',
  },
  {
    id: 'piikai',
    label: 'Piik AI',
    desc: '75% Support Ticket Drop through Behavioral Analysis',
    media: { type: 'img', src: '/piikai/Thumbnail.gif' },
    to: '/projects/piik',
  },
  {
    id: 'jojo',
    label: 'JoJo',
    desc: 'Beyond Passive AI: Fostering Digital Balance & Critical Thinking',
    media: { type: 'video', src: '/jojo/Vid.mp4' },
    to: '/projects/jojo',
  },
  {
    id: 'ar-fitting-room',
    label: 'AR-Fitting Room',
    desc: 'Award-Winning Accessible Design: AR Solution for Inclusive Fashion',
    media: { type: 'img', src: '/arfittingroom/Thumbnail-light.jpg' },
    to: '/projects/ar-fitting-room',
  },
]

function ProjectMedia({ media }: { media: Media }) {
  if (media.type === 'video') {
    return (
      <video
        src={media.src}
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
      />
    )
  }

  return <img src={media.src} className="absolute inset-0 w-full h-full object-cover" alt="" />
}

function ProjectItem({ project }: { project: typeof PROJECTS[number] }) {
  const inner = (
    <div
      className="w-[90vw] max-w-[1200px] h-[75vh] min-h-[600px] snap-center relative rounded-[32px] overflow-hidden shadow-2xl shrink-0 cursor-pointer"
      style={{ fontFamily: 'Arial, sans-serif' }}
    >
      <ProjectMedia media={project.media} />
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent pointer-events-none" />
      <div className="absolute bottom-0 left-0 p-10 md:p-16 flex flex-col items-start z-10">
        <div className="bg-white text-black px-6 py-2 rounded-full font-bold text-sm mb-4">
          Stream now
        </div>
        <p className="text-white font-bold text-5xl md:text-7xl leading-none tracking-tight">
          {project.label}
        </p>
        <p className="mt-4 text-white/85 font-light text-base md:text-xl leading-relaxed max-w-3xl">
          {project.desc}
        </p>
      </div>
    </div>
  )

  if (project.to.startsWith('/')) {
    return <Link to={project.to}>{inner}</Link>
  }

  return inner
}

// ── Projects page ──────────────────────────────────────────────────────────────

export function ProjectsPage() {
  const { setIsDark } = usePageTheme()

  useEffect(() => { setIsDark(false) }, [setIsDark])

  return (
    <>
      <div
        className="flex flex-col w-full h-screen overflow-y-auto snap-y snap-mandatory gap-8 pb-[20vh] pt-[10vh] items-center [&::-webkit-scrollbar]:hidden scrollbar-width-none"
        style={{ backgroundColor: '#111111' }}
      >
        {PROJECTS.map((project) => (
          <ProjectItem key={project.id} project={project} />
        ))}
      </div>
    </>
  )
}
