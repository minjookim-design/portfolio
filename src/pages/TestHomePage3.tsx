/**
 * ERD archive homepage — production at `/` with nested project overlays.
 * Reference: https://www.enfantsrichesdeprimes.com
 */
import { useCallback, useEffect, useRef, useState } from 'react'
import { LayoutGroup, motion, useReducedMotion, type Variants } from 'framer-motion'
import { Link, Outlet, useLocation, useMatch } from 'react-router-dom'
import { usePageTheme } from '../context/PageThemeContext'
import { ErdSiteNav } from './testHome3/ErdChrome'
import {
  ERD_PRODUCTION_HOME,
  erdHomePath,
  erdHomeRoot,
} from './testHome3/erdHomePaths'
import type { ErdHomeOutletContext } from './testHome3/useErdHomePaths'
import './testHomePage3.css'

const MotionLink = motion.create(Link)

/** Soft ease-in-out for all page appear motion. */
const ERD_ENTRANCE_EASE = [0.45, 0, 0.55, 1] as const

const erdNavEntranceVariants: Variants = {
  hidden: { opacity: 0, y: -40 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.63, ease: ERD_ENTRANCE_EASE, delay: 1.25 },
  },
}

const erdShopRowVariants: Variants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.06,
    },
  },
}

/** Card shell — orchestrates media + label children. */
const erdShopCardVariants: Variants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.06,
      when: 'beforeChildren',
    },
  },
}

/**
 * Rising square: media is clipped from the bottom upward
 * so the image stays full-size while the frame fills.
 */
const erdShopCardMediaVariantsUp: Variants = {
  hidden: { clipPath: 'inset(100% 0 0 0)' },
  show: {
    clipPath: 'inset(0% 0 0 0)',
    transition: { duration: 1.25, ease: ERD_ENTRANCE_EASE },
  },
}

/** Opposite: fills from the top downward. */
const erdShopCardMediaVariantsDown: Variants = {
  hidden: { clipPath: 'inset(0 0 100% 0)' },
  show: {
    clipPath: 'inset(0 0 0% 0)',
    transition: { duration: 1.25, ease: ERD_ENTRANCE_EASE },
  },
}

/** Image drifts with the reveal direction. */
const erdShopCardMediaRiseVariantsUp: Variants = {
  hidden: { y: '14%', scale: 1.08 },
  show: {
    y: '0%',
    scale: 1,
    transition: { duration: 1.4, ease: ERD_ENTRANCE_EASE },
  },
}

const erdShopCardMediaRiseVariantsDown: Variants = {
  hidden: { y: '-14%', scale: 1.08 },
  show: {
    y: '0%',
    scale: 1,
    transition: { duration: 1.4, ease: ERD_ENTRANCE_EASE },
  },
}

const erdShopCardLabelVariants: Variants = {
  hidden: { opacity: 0, y: 18 },
  show: {
        opacity: 1,
        y: 0,
    transition: { duration: 0.85, ease: ERD_ENTRANCE_EASE, delay: 0.35 },
  },
}

const erdShopSquareVariants: Variants = {
  hidden: { clipPath: 'inset(100% 0 0 0)' },
  show: {
    clipPath: 'inset(0% 0 0 0)',
    transition: { duration: 1.25, ease: ERD_ENTRANCE_EASE },
  },
}

const erdShopSquareInnerVariants: Variants = {
  hidden: {},
  show: {
        transition: {
      staggerChildren: 0.08,
      delayChildren: 0.18,
    },
  },
}

const erdShopSquareTextVariants: Variants = {
  hidden: { opacity: 0, y: 12 },
  show: {
        opacity: 1,
        y: 0,
    transition: { duration: 0.85, ease: ERD_ENTRANCE_EASE },
  },
}

const PIIK_SHOP_MEDIA = {
  light: {
    image: '/piikai/Thumbnail-light-sq.png',
    video: '/piikai/Thumbnail-light-sq.mp4',
  },
  dark: {
    image: '/piikai/Thumbnail-dark-sq.png',
    video: '/piikai/Thumbnail-dark-sq.mp4',
  },
} as const

const PIIK_SHOP_CARD = {
  segment: 'piik-ai',
  label: 'Piik AI',
  subtitle: '75% Support Ticket Drop through Behavioral Analysis',
  imageAlt: 'Piik AI project thumbnail',
} as const

const HOVR_SHOP_MEDIA = {
  light: {
    image: '/hovr/Thumbnail-dark-sq.jpg',
    video: '/hovr/Thumbnail-light-sq.mp4',
  },
  dark: {
    image: '/hovr/Thumbnail-dark-sq.jpg',
    video: '/hovr/Thumbnail-dark-sq.mp4',
  },
} as const

const HOVR_SHOP_CARD = {
  segment: 'hovr',
  label: 'HOVR',
  subtitle: '84.9% Faster Driver Approvals via OCR Automation',
  imageAlt: 'HOVR project thumbnail',
} as const

const AR_FITTING_SHOP_MEDIA = {
  light: {
    image: '/arfittingroom/Thumbnail-light-sq.png',
    video: '/arfittingroom/Thumbnail-light-sq.mp4',
  },
  dark: {
    image: '/arfittingroom/Thumbnail-dark-sq.png',
    video: '/arfittingroom/Thumbnail-dark-sq.mp4',
  },
} as const

const AR_FITTING_SHOP_CARD = {
  segment: 'ar-fitting-room',
  label: 'AR Fitting Room',
  subtitle: 'Award-Winning Accessible Design: AR Solution for Inclusive Fashion',
  imageAlt: 'AR Fitting Room project thumbnail',
} as const

const SHOP_SQUARE_GREETING = {
  name: 'Minjoo Kim',
  location: 'Based in Toronto, Canada.',
  line: 'Crafting UX solutions grounded in Data and communication',
} as const

const SHOP_SQUARE_EXPERIENCE = [
  { role: 'UX/UI Designer', company: 'BMAD', period: '2025 – Present' },
  { role: 'AI/ML Software Designer', company: 'PM Accelerator', period: '2025' },
  { role: 'UX/UI Designer', company: 'HOVR', period: '2024 – 2025' },
  { role: 'Product Designer', company: 'Piik AI', period: '2024' },
  { role: 'Multimedia Designer', company: 'Freelance', period: '2020 – 2023' },
] as const

function ShopVideoCard({
  href,
  image,
  imageAlt,
  label,
  subtitle,
  hoverVideo,
  videoPlaybackRate = 1,
  className,
  reveal = 'up',
}: {
  href: string
  image: string
  imageAlt: string
  label: string
  subtitle?: string
  hoverVideo?: string
  videoPlaybackRate?: number
  className?: string
  /** `up` = bottom→top fill; `down` = top→bottom fill. */
  reveal?: 'up' | 'down'
}) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [hovered, setHovered] = useState(false)
  const [videoReady, setVideoReady] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const hasHoverVideo = Boolean(hoverVideo)
  const playWithoutHover = isMobile && hasHoverVideo
  const showVideo = hasHoverVideo && videoReady && (playWithoutHover || hovered)
  const mediaVariants = reveal === 'down' ? erdShopCardMediaVariantsDown : erdShopCardMediaVariantsUp
  const mediaRiseVariants =
    reveal === 'down' ? erdShopCardMediaRiseVariantsDown : erdShopCardMediaRiseVariantsUp

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)')
    const sync = () => setIsMobile(mq.matches)
    sync()
    mq.addEventListener('change', sync)
    return () => mq.removeEventListener('change', sync)
  }, [])

  useEffect(() => {
    if (!hoverVideo) return
    const video = videoRef.current
    if (!video) return

    setVideoReady(false)
    video.src = hoverVideo
    video.playbackRate = videoPlaybackRate
    video.load()

    const onPlaying = () => setVideoReady(true)

    video.addEventListener('playing', onPlaying)
    return () => video.removeEventListener('playing', onPlaying)
  }, [hoverVideo, videoPlaybackRate])

  useEffect(() => {
    setHovered(false)
    setVideoReady(false)
  }, [image, hoverVideo])

  useEffect(() => {
    if (!playWithoutHover || !hoverVideo) return
    const video = videoRef.current
    if (!video) return
    video.playbackRate = videoPlaybackRate
    void video.play().catch(() => {})
  }, [playWithoutHover, hoverVideo, videoPlaybackRate, image])

  const handleMouseEnter = useCallback(() => {
    if (playWithoutHover) return
    setHovered(true)
    if (!hoverVideo) return
    const video = videoRef.current
    if (!video) return
    video.playbackRate = videoPlaybackRate
    void video.play().catch(() => {})
  }, [hoverVideo, videoPlaybackRate, playWithoutHover])

  const handleMouseLeave = useCallback(() => {
    if (playWithoutHover) return
    setHovered(false)
    setVideoReady(false)
    if (!hoverVideo) return
    const video = videoRef.current
    if (!video) return
    video.pause()
    requestAnimationFrame(() => {
      video.currentTime = 0
    })
  }, [hoverVideo, playWithoutHover])

  const isInternalLink = href.startsWith('/') && !href.startsWith('//')
  const cardClassName = [
    'erd-shop-card',
    hasHoverVideo ? 'erd-shop-card--video-hover' : '',
    playWithoutHover || hovered ? 'is-hovered' : '',
    showVideo ? 'is-video-ready' : '',
    className ?? '',
  ]
    .filter(Boolean)
    .join(' ')

  const cardBody = (
    <>
      <motion.div className="erd-shop-card-media" variants={mediaVariants}>
        <motion.div className="erd-shop-card-media-rise" variants={mediaRiseVariants}>
          <img src={image} alt={imageAlt} loading="eager" decoding="async" />
          {hasHoverVideo ? (
            <video
              ref={videoRef}
              className="erd-shop-card-video"
              src={hoverVideo}
              muted
              playsInline
              loop
              autoPlay={playWithoutHover}
              preload="auto"
              aria-label={`${label} ${playWithoutHover ? 'preview' : 'hover preview'}`}
              data-video-src={hoverVideo}
            />
          ) : null}
        </motion.div>
      </motion.div>
      <motion.div className="erd-shop-card-label" variants={erdShopCardLabelVariants}>
        <div className="erd-shop-card-copy">
          <span className="erd-arrow-link">{label}</span>
          {subtitle ? <p className="erd-shop-card-subtitle">{subtitle}</p> : null}
        </div>
      </motion.div>
    </>
  )

  if (isInternalLink) {
  return (
      <MotionLink
        to={href}
        className={cardClassName}
        variants={erdShopCardVariants}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {cardBody}
      </MotionLink>
    )
  }

  return (
    <motion.a
      href={href}
      className={cardClassName}
      variants={erdShopCardVariants}
      onClick={(e) => e.preventDefault()}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {cardBody}
    </motion.a>
  )
}

function ErdShopSquare() {
  const reduceMotion = useReducedMotion()
  const textInitial = reduceMotion ? false : 'hidden'

  return (
          <motion.div
      id="about"
      className="erd-shop-square"
      variants={erdShopSquareVariants}
            role="region"
      aria-label="About Minjoo Kim"
    >
      <motion.div
        className="erd-shop-square-inner"
        variants={erdShopSquareInnerVariants}
        initial={textInitial}
        animate="show"
      >
        <motion.div className="erd-shop-square-intro" variants={erdShopSquareTextVariants}>
          <p className="erd-shop-square-name">{SHOP_SQUARE_GREETING.name}</p>
          <p className="erd-shop-square-location">{SHOP_SQUARE_GREETING.location}</p>
          <p className="erd-shop-square-greeting">{SHOP_SQUARE_GREETING.line}</p>
        </motion.div>
        <motion.div className="erd-shop-square-experience" variants={erdShopSquareTextVariants}>
          <p className="erd-shop-square-experience-label">Experience</p>
          <ul className="erd-shop-square-experience-list">
            {SHOP_SQUARE_EXPERIENCE.map((job) => (
              <li key={`${job.company}-${job.period}`}>
                <span className="erd-shop-square-experience-role">{job.role}</span>
                <span className="erd-shop-square-experience-meta">
                  {job.company} · {job.period}
                  </span>
              </li>
            ))}
          </ul>
        </motion.div>
      </motion.div>
    </motion.div>
  )
}

export function TestHomePage3({
  basePath = ERD_PRODUCTION_HOME,
}: {
  basePath?: string
} = {}) {
  const { isDark } = usePageTheme()
  const reduceMotion = useReducedMotion()
  const shopMediaTheme = isDark ? 'dark' : 'light'
  const piikShopMedia = PIIK_SHOP_MEDIA[shopMediaTheme]
  const hovrShopMedia = HOVR_SHOP_MEDIA[shopMediaTheme]
  const arFittingShopMedia = AR_FITTING_SHOP_MEDIA[shopMediaTheme]
  const location = useLocation()
  const homePath = erdHomeRoot(basePath)
  const aboutHref = erdHomePath(basePath, 'about')
  const piikHref = erdHomePath(basePath, PIIK_SHOP_CARD.segment)
  const hovrHref = erdHomePath(basePath, HOVR_SHOP_CARD.segment)
  const arFittingHref = erdHomePath(basePath, AR_FITTING_SHOP_CARD.segment)
  const hovrProjectOpen = Boolean(useMatch({ path: hovrHref, end: true }))
  const piikProjectOpen = Boolean(useMatch({ path: piikHref, end: true }))
  const arFittingProjectOpen = Boolean(useMatch({ path: arFittingHref, end: true }))
  const aboutProjectOpen = Boolean(useMatch({ path: aboutHref, end: true }))
  const outletContext: ErdHomeOutletContext = { erdBasePath: basePath }
  const projectOpen =
    hovrProjectOpen || piikProjectOpen || arFittingProjectOpen || aboutProjectOpen
  const entranceInitial = reduceMotion ? false : 'hidden'

  useEffect(() => {
    document.title = "Minjoo's portfolio"
  }, [])

  useEffect(() => {
    document.body.style.overflow = projectOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [projectOpen])

  useEffect(() => {
    if (projectOpen || location.hash !== '#about') return
    const el = document.getElementById('about')
    if (!el) return
    requestAnimationFrame(() => {
      el.scrollIntoView({
      behavior: reduceMotion ? 'auto' : 'smooth',
        block: 'center',
      })
    })
  }, [location.hash, projectOpen, reduceMotion])

      return (
    <LayoutGroup id="erd-home-production">
    <div
      className={`erd-site erd-site--${isDark ? 'dark' : 'light'}${projectOpen ? ' erd-site--project-open' : ''} fixed inset-0 z-0 overflow-y-auto overflow-x-hidden`}
    >
      {!projectOpen ? (
        <ErdSiteNav
          logoTo={homePath}
          pillEntrance={erdNavEntranceVariants}
          aboutSectionId="about"
          aboutPath={homePath}
                    />
                  ) : null}

      <main className="erd-main min-h-screen" aria-hidden={projectOpen}>
        <h1 className="sr-only">Minjoo's portfolio</h1>

        <motion.section
          className="erd-shop-row"
          id="archive"
          initial={entranceInitial}
          animate="show"
          variants={erdShopRowVariants}
        >
          <ShopVideoCard
            href={piikHref}
            image={piikShopMedia.image}
            imageAlt={PIIK_SHOP_CARD.imageAlt}
            label={PIIK_SHOP_CARD.label}
            subtitle={PIIK_SHOP_CARD.subtitle}
            hoverVideo={piikShopMedia.video}
            reveal="down"
          />
          <ShopVideoCard
            href={arFittingHref}
            image={arFittingShopMedia.image}
            imageAlt={AR_FITTING_SHOP_CARD.imageAlt}
            label={AR_FITTING_SHOP_CARD.label}
            subtitle={AR_FITTING_SHOP_CARD.subtitle}
            hoverVideo={arFittingShopMedia.video}
            videoPlaybackRate={1.5}
          />
          <ShopVideoCard
            href={hovrHref}
            image={hovrShopMedia.image}
            imageAlt={HOVR_SHOP_CARD.imageAlt}
            label={HOVR_SHOP_CARD.label}
            subtitle={HOVR_SHOP_CARD.subtitle}
            hoverVideo={hovrShopMedia.video}
          />
          <ErdShopSquare />
        </motion.section>
      </main>

      <Outlet context={outletContext} />
        </div>
    </LayoutGroup>
  )
}
