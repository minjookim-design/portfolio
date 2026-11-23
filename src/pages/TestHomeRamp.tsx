/**
 * Editorial homepage used at `/` and `/test-home-ramp`.
 * Nested project routes render through `Outlet`.
 */
import { useEffect, useMemo, useRef, useState, type MouseEvent } from 'react'
import { createPortal } from 'react-dom'
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { usePageTheme } from '../context/PageThemeContext'
import type { ErdHomeOutletContext } from './testHome3/useErdHomePaths'
import './testHomeRamp.css'

const PIXEL_CELL = 45 / 16

const HUMAN_PIXELS = [
  '.....hhhhh......',
  '....hhhhhhh.....',
  '...hhssssshh....',
  '...hXsXssXhh....',
  '...hhssssshhss..',
  '....hhssshhsss..',
  '.....hwnwhsXsX..',
  '....hwwwwwssss..',
  '...hwwpppww.....',
  '...wwpppppw.....',
  '...wppppppw.....',
  '....pppppp......',
  '....pp..pp......',
  '....pp..pp......',
  '....XX..XX......',
  '...XXX..XXX.....',
] as const

const BUBBLE_PIXELS = [
  '.XXXXXXXXXXXXXXXXXXXXXXX.',
  'XwwwwwwwwwwwwwwwwwwwwwwwX',
  'XwwwwwwwwwwwwwwwwwwwwwwwX',
  'Xww###w###w#w#w###w#w#wwX',
  'Xwww#ww#w#w#w#w#www#w#wwX',
  'Xwww#ww#w#w#w#w#www###wwX',
  'Xwww#ww#w#w#w#w#www#w#wwX',
  'Xwww#ww###w###w###w#w#wwX',
  'XwwwwwwwwwwwwwwwwwwwwwwwX',
  '.XXXXXXwXXXXXXXXXXXXXXXX.',
  '......XwX................',
  '.......X.................',
] as const

const VIEW_BUBBLE_PIXELS = [
  '.XXXXXXXXXXXXXXXXXXX.',
  'XwwwwwwwwwwwwwwwwwwwX',
  'XwwwwwwwwwwwwwwwwwwwX',
  'Xww#w#w###w###w#w#wwX',
  'Xww#w#ww#ww#www#w#wwX',
  'Xww#w#ww#ww###w#w#wwX',
  'Xww#w#ww#ww#www#w#wwX',
  'Xwww#ww###w###w#w#wwX',
  'XwwwwwwwwwwwwwwwwwwwX',
  '.XXXXXXwXXXXXXXXXXXX.',
  '......XwX............',
  '.......X.............',
] as const

const ZOOM_BUBBLE_PIXELS = [
  '.XXXXXXXXXXXXXXXXXXX.',
  'XwwwwwwwwwwwwwwwwwwwX',
  'XwwwwwwwwwwwwwwwwwwwX',
  'Xww###w#w#w#w#w#w#wwX',
  'Xwwww#w#w#w#w#w###wwX',
  'Xwww#ww#w#w#w#w#w#wwX',
  'Xww#www#w#w#w#w#w#wwX',
  'Xww###w###w###w#w#wwX',
  'XwwwwwwwwwwwwwwwwwwwX',
  '.XXXXXXwXXXXXXXXXXXX.',
  '......XwX............',
  '.......X.............',
] as const

const HUMAN_FILL: Record<string, string> = {
  X: '#0a0a0a',
  h: '#1c1410',
  n: '#5a4038',
  s: '#f0c8a8',
  w: '#f4f0e8',
  p: '#c45c8a',
}

const BUBBLE_FILL: Record<string, string> = {
  X: '#0a0a0a',
  '#': '#0a0a0a',
  w: '#ffffff',
}

function PixelSprite({
  rows,
  fills,
}: {
  rows: readonly string[]
  fills: Record<string, string>
}) {
  const height = rows.length
  const width = rows[0].length
  return (
    <svg
      className="rc-touch-sprite"
      viewBox={`0 0 ${width} ${height}`}
      width={width * PIXEL_CELL}
      height={height * PIXEL_CELL}
      aria-hidden
      shapeRendering="crispEdges"
    >
      {rows.flatMap((row, y) =>
        Array.from(row, (cell, x) => {
          const fill = fills[cell]
          if (!fill) return null
          return <rect key={`${x}-${y}`} x={x} y={y} width={1} height={1} fill={fill} />
        }),
      )}
    </svg>
  )
}

function HumanTouchPhrase({ children }: { children: string }) {
  const [on, setOn] = useState(false)
  const iconRef = useRef<HTMLSpanElement>(null)
  const reduceMotion = useRef(
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  )

  function place(event: MouseEvent<HTMLSpanElement>) {
    const node = iconRef.current
    if (!node || reduceMotion.current) return
    node.style.transform = `translate3d(${event.clientX - 36}px, ${event.clientY - 25}px, 0)`
  }

  function enter(event: MouseEvent<HTMLSpanElement>) {
    place(event)
    setOn(true)
  }

  function leave() {
    setOn(false)
  }

  return (
    <>
      <span
        className="rc-touch"
        onMouseEnter={enter}
        onMouseMove={place}
        onMouseLeave={leave}
      >
        {children}
      </span>
      <span
        ref={iconRef}
        className={`rc-touch-icon${on ? ' is-on' : ''}${reduceMotion.current ? ' is-static' : ''}`}
        aria-hidden
      >
        <span className="rc-touch-icon-inner">
          <span className="rc-touch-cluster">
            <span className="rc-touch-bubble">
              <PixelSprite rows={BUBBLE_PIXELS} fills={BUBBLE_FILL} />
            </span>
            <PixelSprite rows={HUMAN_PIXELS} fills={HUMAN_FILL} />
          </span>
        </span>
      </span>
    </>
  )
}

const EMAIL = 'minjoo.kim.kor@gmail.com'
const LINKEDIN_URL = 'https://www.linkedin.com/in/minjoo-kim-kor/?skipRedirect=true'
const RESUME_URL = 'https://drive.google.com/file/d/1WRFvCfASQgqN4Utfcp4b-aEZtw2FzHY3/view'

function isMorePath(pathname: string) {
  return pathname === '/more' || pathname.startsWith('/more/')
}

type Project = {
  id: string
  name: string
  tag: string
  href: string
  summary: string
  image: string
  video?: string
  videoDark?: string
  youtube?: string
  embed?: string
  wide?: boolean
  gallery?: readonly string[]
  tint: string
  ratio: string
}

const PROJECTS: readonly Project[] = [
  {
    id: 'hovr',
    name: 'HOVR',
    tag: 'Start up • 0-to-1',
    href: '/hovr',
    summary: '84.9% faster driver approvals via OCR automation in the admin workflow.',
    image: '/hovr/Thumbnail-dark-sq.jpg',
    video: '/hovr/hovr.mp4',
    videoDark: '/hovr/hovr-dark.mp4',
    tint: '#EAF38080',
    ratio: '1 / 1',
  },
  {
    id: 'piik',
    name: 'Piik AI',
    tag: 'Start up • Founding member',
    href: '/piik-ai',
    summary: '75% support ticket drop through behavioral analysis of the creator editor.',
    image: '/piikai/Thumbnail-light-sq.png',
    video: '/piikai/piikai.mp4',
    videoDark: '/piikai/piikai-dark.mp4',
    tint: '#EBF12350',
    ratio: '1440 / 1080',
  },
  {
    id: 'jojo',
    name: 'Jojo',
    tag: 'Conversational AI',
    href: '/jojo',
    summary:
      'A personalized AI companion that stimulates active thinking and turns focus into measurable progress.',
    image: '/jojo/Thumbnail-light.jpg',
    video: '/jojo/jojo.mp4',
    videoDark: '/jojo/jojo-dark.mp4',
    tint: '#EBF12350',
    ratio: '2880 / 2160',
  },
  {
    id: 'ar',
    name: 'AR Fitting Room',
    tag: 'Award-winning',
    href: '/ar-fitting-room',
    summary: 'Award-winning accessible design: an AR solution for inclusive fashion.',
    image: '/arfittingroom/Thumbnail-light-pink.jpg',
    video: '/arfittingroom/Thumbnail-light-sq.mp4',
    videoDark: '/arfittingroom/Thumbnail-dark-sq.mp4',
    tint: '#DDF21A50',
    ratio: '1 / 1',
  },
] as const

const JAPAN_SCAN_GALLERY = [
  '/more-opt/japan/1.jpg',
  '/more-opt/japan/2.jpg',
  '/more-opt/japan/3.jpg',
  '/more-opt/japan/5.jpg',
  '/more-opt/japan/6.jpg',
  '/more-opt/japan/7.jpg',
  '/more-opt/japan/8.jpg',
  '/more-opt/japan/9.jpg',
  '/more-opt/japan/10.jpg',
  '/more-opt/japan/13.jpg',
  '/more-opt/japan/14.jpg',
  '/more-opt/japan/15.jpg',
  '/more-opt/japan/16.jpg',
  '/more-opt/japan/17.jpg',
  '/more-opt/japan/18.jpg',
  '/more-opt/japan/19.jpg',
  '/more-opt/japan/20.jpg',
  '/more-opt/japan/21.jpg',
  '/more-opt/japan/22.jpg',
  '/more-opt/japan/process.jpg',
  '/more-opt/japan/process2.jpg',
  '/more-opt/japan/process3.jpg',
] as const

const MORE_STILLS: readonly Project[] = [
  {
    id: 'me-2',
    name: 'Traveling',
    tag: 'Barcelona, Spain',
    href: '',
    summary: '',
    image: '/more-opt/me-2.jpg',
    tint: '#EBF12350',
    ratio: '1400 / 933',
  },
  {
    id: 'me-5',
    name: 'Traveling',
    tag: 'Moscow, Russia',
    href: '',
    summary: '',
    image: '/more-opt/me-5.jpg',
    tint: '#EBF12350',
    ratio: '1399 / 1400',
  },
  {
    id: 'me-7',
    name: 'Traveling',
    tag: 'Rome, Italy',
    href: '',
    summary: '',
    image: '/more-opt/me-7.jpg',
    tint: '#EBF12350',
    ratio: '1209 / 1400',
  },
  {
    id: 'me-8',
    name: "The World's Longest Railway",
    tag: 'Russia',
    href: '',
    summary: '',
    image: '/more-opt/me-8.jpg',
    tint: '#EBF12350',
    ratio: '1400 / 1400',
  },
  {
    id: 'fun-card-transaction',
    name: '2022 Credit Card Transaction',
    tag: 'Info · Interaction Design',
    href: '',
    summary: '',
    image: '/fun/thumbnail2.jpg',
    video: '/fun/card%20transaction.mp4',
    tint: '#EBF12350',
    ratio: '1920 / 1080',
  },
  {
    id: 'fun-pt',
    name: 'Experimental Portfolio Design',
    tag: 'UX/UI',
    href: '',
    summary: '',
    image: '/fun/pt.mp4',
    video: '/fun/pt.mp4',
    tint: '#EBF12350',
    ratio: '3194 / 2160',
  },
  {
    id: 'fun-final-image',
    name: 'Education & Social Impact',
    tag: 'Info Design',
    href: '',
    summary: '',
    image: '/fun/final-image.jpg',
    tint: '#EBF12350',
    ratio: '1400 / 1050',
  },
  {
    id: 'fun-final-png',
    name: 'Population Aging & Economic Growth',
    tag: 'Info Design',
    href: '',
    summary: '',
    image: '/more-opt/fun-final.jpg',
    tint: '#EBF12350',
    ratio: '1400 / 1327',
  },
  {
    id: 'fun-thumbnail2',
    name: 'Japan',
    tag: 'Book · Publication Design',
    href: '',
    summary: '',
    image: '/more-opt/fun-thumbnail2.jpg',
    gallery: JAPAN_SCAN_GALLERY,
    tint: '#EBF12350',
    ratio: '1400 / 1017',
  },
  {
    id: 'fun-skimekb',
    name: 'Bosudong, Busan',
    tag: 'Watercolor on paper',
    href: '',
    summary: '',
    image: '/more-opt/fun-skimekb.jpg',
    tint: '#EBF12350',
    ratio: '1031 / 1400',
  },
  {
    id: 'fun-ahwfrer',
    name: 'Spring',
    tag: 'Oil on canvas',
    href: '',
    summary: '',
    image: '/more-opt/fun-ahwfrer.jpg',
    tint: '#EBF12350',
    ratio: '1400 / 1149',
  },
  {
    id: 'fun-kap2ony',
    name: 'Untitled',
    tag: 'Charcoal on paper',
    href: '',
    summary: '',
    image: '/more-opt/fun-kap2ony.jpg',
    tint: '#EBF12350',
    ratio: '1050 / 1400',
  },
  {
    id: 'fun-df5iv63',
    name: 'Unofficial BIFF Poster',
    tag: 'Graphic Design',
    href: '',
    summary: '',
    image: '/more-opt/fun-df5iv63.jpg',
    tint: '#EBF12350',
    ratio: '875 / 1400',
  },
  {
    id: 'fun-qulyyzd',
    name: 'Unofficial BIFF Poster',
    tag: 'Illustration',
    href: '',
    summary: '',
    image: '/more-opt/fun-qulyyzd.jpg',
    tint: '#EBF12350',
    ratio: '875 / 1400',
  },
  {
    id: 'fun-7znmudx',
    name: 'Korean Instant Noodles',
    tag: 'Info Design',
    href: '',
    summary: '',
    image: '/more-opt/fun-7znmudx.jpg',
    tint: '#EBF12350',
    ratio: '1400 / 970',
  },
  {
    id: 'fun-szlccyp',
    name: 'Best Coffee in the World',
    tag: 'Info Design',
    href: '',
    summary: '',
    image: '/more-opt/fun-szlccyp.jpg',
    tint: '#EBF12350',
    ratio: '905 / 1400',
  },
  {
    id: 'yt-ga4dxwtcx9m',
    name: 'Swatch',
    tag: 'Motion Design',
    href: '',
    summary: '',
    image: 'https://img.youtube.com/vi/gA4dXWtcx9M/hqdefault.jpg',
    youtube: 'gA4dXWtcx9M',
    tint: '#EBF12350',
    ratio: '16 / 9',
  },
  {
    id: 'desn-2025',
    name: 'SHIFT: DESN Grad Show',
    tag: 'UX/UI',
    href: 'https://www.desn.ca/2025',
    summary: '',
    image: '',
    embed: 'https://www.desn.ca/2025',
    tint: '#EBF12350',
    ratio: '16 / 9',
  },
] as const

const EXPERIENCE = [
  { role: 'UX/UI Designer', company: 'BMAD', period: '2025 – Present' },
  { role: 'AI/ML Software Designer', company: 'PM Accelerator', period: '2025' },
  { role: 'UX/UI Designer', company: 'HOVR', period: '2024 – 2025' },
  { role: 'Product Designer', company: 'Piik AI', period: '2024' },
  { role: 'Multimedia Designer', company: 'Freelance', period: '2020 – 2023' },
] as const

function markThumbLoaded(el: HTMLImageElement | null) {
  if (el?.complete && el.naturalWidth > 0) el.classList.add('is-loaded')
}

function shuffleItems<T>(items: readonly T[]): T[] {
  const next = [...items]
  for (let index = next.length - 1; index > 0; index -= 1) {
    const swap = Math.floor(Math.random() * (index + 1))
    const current = next[index]
    next[index] = next[swap]!
    next[swap] = current!
  }
  return next
}

export function TestHomeRamp() {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const pageRef = useRef<HTMLDivElement>(null)
  const isMore = isMorePath(pathname)
  const { isDark, toggleTheme } = usePageTheme()
  const [dimming, setDimming] = useState(false)
  const projects = useMemo(() => {
    if (isMore) return shuffleItems(MORE_STILLS)
    return PROJECTS.map((item) => ({ ...item }))
  }, [isMore])

  useEffect(() => {
    document.title = isMore
      ? 'More | Minjoo Kim'
      : 'Minjoo Kim | Product Designer'
    document.documentElement.classList.add('ramp-test-home-active')
    return () => {
      document.title = "Minjoo's portfolio"
      document.documentElement.classList.remove('ramp-test-home-active')
    }
  }, [isMore])

  useEffect(() => {
    setDimming(false)
    window.scrollTo(0, 0)
    pageRef.current?.scrollTo(0, 0)
  }, [isMore])

  useEffect(() => {
    if (pathname !== '/') return
    window.scrollTo(0, 0)
    pageRef.current?.scrollTo(0, 0)
  }, [pathname])

  function goHome() {
    navigate('/')
  }

  function scrollWorkHomeToTop() {
    const behavior = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      ? 'auto'
      : 'smooth'
    window.scrollTo({ top: 0, behavior })
    pageRef.current?.scrollTo({ top: 0, behavior })
  }

  function onWorkNavClick(event: MouseEvent<HTMLAnchorElement>) {
    if (pathname !== '/') return
    event.preventDefault()
    scrollWorkHomeToTop()
  }

  return (
    <>
    <div ref={pageRef} className={`rc-page${isDark ? ' is-dark' : ''}`}>
      <header className="rc-top">
        <button type="button" className="rc-brand" onClick={goHome} aria-label="Minjoo Kim">
          <span className="rc-brand-mark">
            <img src="/me/me1.png" alt="" className="rc-brand-img rc-brand-img--default" decoding="async" />
            <img src="/me/me2.png" alt="" aria-hidden className="rc-brand-img rc-brand-img--hover" decoding="async" />
          </span>
        </button>
        <button
          type="button"
          className="rc-theme"
          aria-label={isDark ? 'Switch to light appearance' : 'Switch to dark appearance'}
          onClick={toggleTheme}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden>
            {isDark ? (
              <circle cx="8" cy="8" r="5" fill="currentColor" />
            ) : (
              <>
                <circle cx="8" cy="8" r="2.25" fill="currentColor" />
                <path
                  fill="currentColor"
                  d="M7.5 0h1v3h-1zM7.5 13h1v3h-1zM0 7.5h3v1H0zM13 7.5h3v1h-3zM2.05 2.05l.7-.7 2.12 2.12-.7.7zM11.13 11.13l.7-.7 2.12 2.12-.7.7zM2.05 13.95l2.12-2.12.7.7-2.12 2.12zM11.13 4.87l2.12-2.12.7.7-2.12 2.12z"
                />
              </>
            )}
          </svg>
        </button>
      </header>

      <div className="rc-shell">
        <nav className="rc-rail" aria-label="Sections">
          <Link
            to="/"
            className={`rc-nav-btn${!isMore ? ' is-active' : ''}`}
            aria-current={!isMore ? 'page' : undefined}
            onClick={onWorkNavClick}
          >
            Work
          </Link>
          <Link
            to="/more"
            className={`rc-nav-btn${isMore ? ' is-active' : ''}`}
            aria-current={isMore ? 'page' : undefined}
          >
            More
          </Link>
          <a className="rc-nav-btn" href={RESUME_URL} target="_blank" rel="noreferrer">
            Resume
          </a>
          <a className="rc-nav-btn" href={LINKEDIN_URL} target="_blank" rel="noreferrer">
            LinkedIn
          </a>
        </nav>

        <div className="rc-main">
          <main>
            {!isMore ? (
              <>
                <div className="rc-lede">
                  <h1 className="rc-hero">
                    Minjoo Kim,
                    <br />
                    <span className="rc-hero-line">a product designer who designs</span>
                    <br />
                    <span className="rc-hero-line">
                      digital experiences with a <HumanTouchPhrase>human touch</HumanTouchPhrase>.
                    </span>
                  </h1>
                  <p className="rc-lede-meta">
                    0-to-1 • B2B SaaS • Design Systems & Motion • Spatial Design
                  </p>
                </div>
                <section className="rc-bio" aria-label="Experience">
                  <ul className="rc-prev">
                    {EXPERIENCE.map((job, index) => (
                      <li key={`${job.company}-${job.period}`}>
                        <span
                          className={`rc-prev-dot${index === 0 ? ' is-current' : ''}`}
                          aria-hidden
                        />
                        <span className={`rc-prev-role${index === 0 ? ' is-current' : ''}`}>
                          {job.role}
                        </span>
                        <span className="rc-prev-meta">
                          {job.company} · {job.period}
                        </span>
                      </li>
                    ))}
                  </ul>
                </section>
              </>
            ) : null}
            <WorkGrid
              items={projects}
              dark={isDark}
              zoom={isMore}
              dimming={dimming}
              onEnter={() => setDimming(true)}
              onLeave={() => setDimming(false)}
            />
          </main>
        </div>
      </div>

      <footer className="rc-footer">
        <a className="rc-footer-email" href={`mailto:${EMAIL}`}>
          {EMAIL}
        </a>
      </footer>
    </div>
    <Outlet context={{ erdBasePath: isMore ? '/more' : '/' } satisfies ErdHomeOutletContext} />
    </>
  )
}

function youtubeEmbedSrc(id: string, options?: { muted?: boolean; controls?: boolean }) {
  const params = new URLSearchParams({
    autoplay: '1',
    loop: '1',
    playlist: id,
    modestbranding: '1',
    playsinline: '1',
    rel: '0',
    controls: options?.controls === false ? '0' : '1',
  })
  if (options?.muted) params.set('mute', '1')
  return `https://www.youtube-nocookie.com/embed/${id}?${params.toString()}`
}

function mediaFor(item: Project, dark: boolean) {
  if (item.gallery?.length) {
    return {
      src: item.image,
      video: false,
      youtube: false,
      embed: false,
      gallery: item.gallery,
    }
  }
  if (item.embed) {
    return { src: item.embed, video: false, youtube: false, embed: true }
  }
  if (item.youtube) {
    return { src: item.youtube, video: false, youtube: true, embed: false }
  }
  if (item.video) {
    return {
      src: dark && item.videoDark ? item.videoDark : item.video,
      video: true,
      youtube: false,
      embed: false,
    }
  }
  return { src: item.image, video: false, youtube: false, embed: false }
}

function groupWorkRows(items: readonly Project[]) {
  const rows: Array<
    | { key: string; kind: 'masonry'; items: Project[] }
    | { key: string; kind: 'wide'; item: Project }
  > = []
  let masonry: Project[] = []

  function flushMasonry() {
    if (!masonry.length) return
    rows.push({
      key: masonry.map((item) => item.id).join('-'),
      kind: 'masonry',
      items: masonry,
    })
    masonry = []
  }

  for (const item of items) {
    if (item.wide) {
      flushMasonry()
      rows.push({ key: item.id, kind: 'wide', item })
      continue
    }
    masonry.push(item)
  }
  flushMasonry()
  return rows
}

function WorkGrid({
  items,
  dark,
  zoom = false,
  dimming,
  onEnter,
  onLeave,
}: {
  items: readonly Project[]
  dark: boolean
  zoom?: boolean
  dimming: boolean
  onEnter: (event: MouseEvent<HTMLElement>, item: Project) => void
  onLeave: () => void
}) {
  const rows = groupWorkRows(items)
  const videos = useRef(new Map<string, HTMLVideoElement>())
  const hoveredId = useRef<string | null>(null)
  const viewCursor = useRef<HTMLSpanElement>(null)
  const [viewOn, setViewOn] = useState(false)
  const [lightbox, setLightbox] = useState<{
    src: string
    video: boolean
    youtube: boolean
    embed: boolean
    gallery?: readonly string[]
    name: string
  } | null>(null)
  const reduceMotion = useRef(
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  )

  useEffect(() => {
    if (!lightbox) return
    function onKey(event: KeyboardEvent) {
      if (event.key === 'Escape') setLightbox(null)
    }
    const html = document.documentElement
    const body = document.body
    const prevHtml = html.style.overflow
    const prevBody = body.style.overflow
    html.style.overflow = 'hidden'
    body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKey)
    return () => {
      html.style.overflow = prevHtml
      body.style.overflow = prevBody
      window.removeEventListener('keydown', onKey)
    }
  }, [lightbox])

  function placeViewCursor(event: MouseEvent<HTMLElement>) {
    const node = viewCursor.current
    if (!node || reduceMotion.current) return
    node.style.transform = `translate3d(${event.clientX + 10}px, ${event.clientY - 36}px, 0)`
  }

  function pauseOtherVideos(activeId: string) {
    hoveredId.current = activeId
    videos.current.forEach((video, id) => {
      if (id === activeId) {
        void video.play().catch(() => undefined)
        return
      }
      video.pause()
    })
  }

  function playAllVideos() {
    hoveredId.current = null
    videos.current.forEach((video) => {
      void video.play().catch(() => undefined)
    })
  }

  const cursorPixels = zoom ? ZOOM_BUBBLE_PIXELS : VIEW_BUBBLE_PIXELS

  function renderCard(item: Project, wide = false) {
    const thumb = (
      <>
        <div
          className="rc-thumb"
          onMouseEnter={(event) => {
            pauseOtherVideos(item.id)
            placeViewCursor(event)
            setViewOn(true)
          }}
          onMouseMove={placeViewCursor}
          onMouseLeave={() => setViewOn(false)}
        >
          {item.embed ? (
            <div className="rc-thumb-embed" style={{ aspectRatio: item.ratio }}>
              <iframe src={item.embed} title="" tabIndex={-1} />
            </div>
          ) : item.youtube ? (
            <div className="rc-thumb-yt" style={{ aspectRatio: item.ratio }}>
              <iframe
                src={youtubeEmbedSrc(item.youtube, { muted: true, controls: false })}
                title=""
                allow="autoplay; encrypted-media"
                tabIndex={-1}
              />
            </div>
          ) : item.video ? (
            <video
              key={dark && item.videoDark ? item.videoDark : item.video}
              src={dark && item.videoDark ? item.videoDark : item.video}
              autoPlay
              muted
              loop
              playsInline
              preload="auto"
              style={{ aspectRatio: item.ratio }}
              ref={(el) => {
                if (!el) {
                  videos.current.delete(item.id)
                  return
                }
                videos.current.set(item.id, el)
                el.muted = true
                if (hoveredId.current && hoveredId.current !== item.id) {
                  el.pause()
                  return
                }
                void el.play().catch(() => undefined)
              }}
            />
          ) : (
            <img
              src={item.image}
              alt=""
              loading="lazy"
              decoding="async"
              style={{ aspectRatio: item.ratio }}
              onLoad={(event) => event.currentTarget.classList.add('is-loaded')}
              ref={markThumbLoaded}
            />
          )}
          <span className="rc-thumb-veil" aria-hidden />
        </div>
        <div className="rc-caption">
          <p className="rc-caption-name">{item.name}</p>
          <p className="rc-caption-slash" aria-hidden>
            /
          </p>
          <p className="rc-caption-tag">{item.tag}</p>
        </div>
      </>
    )

    const className = `rc-card${wide ? ' is-wide' : ''}`

    if (zoom) {
      return (
        <button
          key={item.id}
          type="button"
          className={className}
          aria-label={`Zoom ${item.name}`}
          onClick={() => {
            const media = mediaFor(item, dark)
            setLightbox({ ...media, name: item.name })
          }}
          onMouseEnter={(event) => {
            pauseOtherVideos(item.id)
            onEnter(event, item)
          }}
          onMouseLeave={onLeave}
        >
          {thumb}
        </button>
      )
    }

    return (
      <Link
        key={item.id}
        to={item.href}
        className={className}
        onMouseEnter={(event) => {
          pauseOtherVideos(item.id)
          onEnter(event, item)
        }}
        onMouseLeave={onLeave}
      >
        {thumb}
      </Link>
    )
  }

  return (
    <div
      className={`rc-work${dimming ? ' is-dimming' : ''}`}
      onMouseLeave={playAllVideos}
    >
      {rows.map((row) => {
        if (row.kind === 'wide') return renderCard(row.item, true)

        const columns: Project[][] = [[], []]
        row.items.forEach((item, index) => {
          columns[index % 2].push(item)
        })

        return (
          <div key={row.key} className="rc-work-masonry">
            {columns.map((column, columnIndex) => (
              <div key={columnIndex} className="rc-work-col">
                {column.map((item) => renderCard(item))}
              </div>
            ))}
          </div>
        )
      })}
      <span
        ref={viewCursor}
        className={`rc-touch-icon rc-view-cursor${viewOn ? ' is-on' : ''}${reduceMotion.current ? ' is-static' : ''}`}
        aria-hidden
      >
        <span className="rc-touch-icon-inner">
          <PixelSprite rows={cursorPixels} fills={BUBBLE_FILL} />
        </span>
      </span>
      {lightbox && typeof document !== 'undefined'
        ? createPortal(
            <div
              className={`rc-zoom${lightbox.gallery ? ' is-gallery' : ''}`}
              role="dialog"
              aria-modal="true"
              aria-label={lightbox.name}
              onClick={() => setLightbox(null)}
            >
              <div className="rc-zoom-frame" onClick={(event) => event.stopPropagation()}>
                {lightbox.gallery ? (
                  <div className="rc-zoom-gallery">
                    {lightbox.gallery.map((src) => (
                      <img
                        key={src}
                        src={src}
                        alt=""
                        loading="lazy"
                        decoding="async"
                        onLoad={(event) => event.currentTarget.classList.add('is-loaded')}
                        ref={markThumbLoaded}
                      />
                    ))}
                  </div>
                ) : lightbox.embed ? (
                  <iframe src={lightbox.src} title={lightbox.name} />
                ) : lightbox.youtube ? (
                  <iframe
                    src={youtubeEmbedSrc(lightbox.src)}
                    title={lightbox.name}
                    allow="autoplay; encrypted-media; fullscreen"
                    allowFullScreen
                  />
                ) : lightbox.video ? (
                  <video src={lightbox.src} autoPlay muted loop playsInline />
                ) : (
                  <img
                    src={lightbox.src}
                    alt={lightbox.name}
                    decoding="async"
                    onLoad={(event) => event.currentTarget.classList.add('is-loaded')}
                    ref={markThumbLoaded}
                  />
                )}
              </div>
            </div>,
            document.body,
          )
        : null}
    </div>
  )
}
