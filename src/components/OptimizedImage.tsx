import {
  useCallback,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type ImgHTMLAttributes,
  type SyntheticEvent,
} from 'react'
import imageFormatVariants from '../generated/imageFormatVariants.json'

/**
 * High-performance image wrapper for this Vite + React app (not Next.js — there is no `next/image`).
 *
 * - **priority**: `loading="eager"`, `fetchPriority="high"` for above-the-fold / LCP.
 * - **Default**: `loading="lazy"`, `decoding="async"`, `placeholder="blur"` with a neutral tint.
 * - **quality** (default 88): documentary — export raster assets at ~88 for a near-lossless look with smaller files.
 * - **Modern formats**: add `sameName.webp` / `sameName.avif` next to sources in `public/`, then run `npm run catalog:images` (or `npm run build`).
 * - **sizes**: pass for responsive layouts so the browser can choose the right resource when you add width-based `srcSet` later.
 */
export const IMAGE_SIZES = {
  caseStudyFull: '(max-width: 768px) 100vw, (max-width: 1400px) 82vw, min(1000px, 75vw)',
  projectCard: '(max-width: 768px) 90vw, min(1200px, 92vw)',
  homeIntroPhoto: '(max-width: 768px) 50vw, min(220px, 40vw)',
  carouselSlide80: '(max-width: 768px) 85vw, min(900px, 70vw)',
  lightbox: '85vw',
  homeIntroFull: '(max-width: 768px) 100vw, min(700px, 90vw)',
  /** Desktop cursor-follow project list hover card (~276px). */
  projectListHoverPreview: '276px',
} as const

const DEFAULT_QUALITY = 88
const ONBOARD_EASE = 'cubic-bezier(0.42, 0, 0.58, 1)'
const BLUR_TRANSITION = `filter 0.45s ${ONBOARD_EASE}, opacity 0.45s ${ONBOARD_EASE}`

type FormatEntry = { webp?: string; avif?: string }
const FORMAT_LOOKUP = imageFormatVariants as Record<string, FormatEntry>

function formatVariantsForSrc(src: string): FormatEntry | null {
  if (!src.startsWith('/')) return null
  const key = src.split('?')[0]
  const v = FORMAT_LOOKUP[key]
  return v && (v.webp || v.avif) ? v : null
}

export type OptimizedImageProps = Omit<
  ImgHTMLAttributes<HTMLImageElement>,
  'loading' | 'decoding' | 'fetchPriority'
> & {
  priority?: boolean
  sizes?: string
  /** Target export quality from design tools (default 88). No runtime re-encode in Vite — documentary. */
  quality?: number
  placeholder?: 'empty' | 'blur'
  /** Subtle surface while blurred (`placeholder="blur"` only). */
  placeholderTint?: string
  /** Inline `object-fit` alternative to Tailwind `object-cover` / `object-contain`. */
  objectFit?: CSSProperties['objectFit']
}

export function OptimizedImage({
  priority = false,
  sizes,
  quality: _quality = DEFAULT_QUALITY,
  placeholder = 'blur',
  placeholderTint = 'rgba(12, 12, 14, 0.08)',
  objectFit,
  className,
  style,
  onLoad,
  alt,
  src,
  ...rest
}: OptimizedImageProps) {
  void _quality
  const imgRef = useRef<HTMLImageElement>(null)
  const [showBlur, setShowBlur] = useState(placeholder === 'blur' && !priority)

  useLayoutEffect(() => {
    if (priority || placeholder !== 'blur') return
    const el = imgRef.current
    if (el?.complete) setShowBlur(false)
  }, [src, priority, placeholder])

  const handleLoad = useCallback(
    (e: SyntheticEvent<HTMLImageElement>) => {
      setShowBlur(false)
      onLoad?.(e)
    },
    [onLoad],
  )

  const mergedStyle: CSSProperties = {
    ...style,
    ...(objectFit != null ? { objectFit } : {}),
    ...(placeholder === 'blur'
      ? {
          transition: BLUR_TRANSITION,
          filter: showBlur ? 'blur(10px)' : 'none',
          opacity: showBlur ? 0.88 : 1,
          backgroundColor: showBlur ? placeholderTint : undefined,
        }
      : {}),
  }

  const shared: Omit<ImgHTMLAttributes<HTMLImageElement>, 'ref'> = {
    src,
    alt: alt ?? '',
    sizes,
    loading: priority ? 'eager' : 'lazy',
    decoding: 'async',
    fetchPriority: priority ? 'high' : undefined,
    className,
    style: mergedStyle,
    onLoad: placeholder === 'blur' ? handleLoad : onLoad,
    ...rest,
  }

  const formats = typeof src === 'string' ? formatVariantsForSrc(src) : null

  if (!formats) {
    return <img ref={imgRef} {...shared} />
  }

  return (
    <picture style={{ display: 'contents' }}>
      {formats.avif ? (
        <source type="image/avif" srcSet={formats.avif} sizes={sizes} />
      ) : null}
      {formats.webp ? (
        <source type="image/webp" srcSet={formats.webp} sizes={sizes} />
      ) : null}
      <img ref={imgRef} {...shared} />
    </picture>
  )
}
