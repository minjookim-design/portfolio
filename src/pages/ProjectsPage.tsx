import { Link } from 'react-router-dom'
import { IMAGE_SIZES, OptimizedImage } from '../components/OptimizedImage'

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
    id: 'ar-fitting-room',
    label: 'AR-Fitting Room',
    desc: 'Award-Winning Accessible Design: AR Solution for Inclusive Fashion',
    media: { type: 'img', src: '/arfittingroom/Thumbnail-light.jpg' },
    to: '/projects/ar-fitting-room',
  },
]

function ProjectMedia({ media, priority }: { media: Media; priority?: boolean }) {
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

  return (
    <OptimizedImage
      src={media.src}
      className="absolute inset-0 h-full w-full object-cover"
      alt=""
      sizes={IMAGE_SIZES.projectCard}
      priority={priority}
      placeholder="blur"
    />
  )
}

function ProjectItem({
  project,
  mediaPriority,
}: {
  project: (typeof PROJECTS)[number]
  mediaPriority?: boolean
}) {
  const inner = (
    <div
      className="w-[min(90vw,calc(100vw-1.5rem))] max-w-[1200px] min-h-[min(420px,72dvh)] h-[min(75dvh,720px)] max-md:min-h-[min(320px,58dvh)] max-md:h-auto max-md:aspect-[4/5] snap-center relative rounded-[24px] md:rounded-[32px] overflow-hidden shadow-2xl shrink-0 cursor-pointer"
      style={{ fontFamily: 'Arial, sans-serif' }}
    >
      <ProjectMedia media={project.media} priority={mediaPriority} />
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent pointer-events-none" />
      <div className="absolute bottom-0 left-0 z-10 flex flex-col items-start p-6 md:p-16">
        <div className="mb-4 rounded-full bg-white px-4 py-2 text-xs font-bold text-black md:px-6 md:text-sm">
          Stream now
        </div>
        <p className="max-w-[95%] text-3xl font-bold leading-none tracking-tight text-white sm:text-4xl md:text-7xl">
          {project.label}
        </p>
        <p className="mt-3 max-w-3xl text-sm font-light leading-relaxed text-white/85 md:mt-4 md:text-base md:text-xl">
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
  return (
    <>
      <div
        className="theme-surface-transition flex flex-col w-full max-w-full min-w-0 h-screen max-md:overflow-x-hidden overflow-y-auto snap-y snap-mandatory gap-8 px-4 pb-[calc(20vh+5.5rem)] max-md:pb-[calc(20vh+5.5rem+env(safe-area-inset-bottom,0px))] pt-[10vh] items-center [&::-webkit-scrollbar]:hidden scrollbar-width-none md:px-0"
        style={{ backgroundColor: '#111111' }}
      >
        {PROJECTS.map((project, index) => (
          <ProjectItem key={project.id} project={project} mediaPriority={index === 0} />
        ))}
      </div>
    </>
  )
}
