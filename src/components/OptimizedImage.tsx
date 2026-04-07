import {
  useCallback,
  useLayoutEffect,
  useRef,
  useState,
  type ImgHTMLAttributes,
} from 'react'

/**
 * High-performance `<img>` wrapper for this Vite + React app (not Next.js — there is no `next/image`).
 *
 * - **priority**: `loading="eager"`, `fetchPriority="high"` for above-the-fold / LCP candidates.
 * - **Default**: `loading="lazy"`, `decoding="async"` for bandwidth-friendly loading.
 * - **placeholder="blur"**: short CSS blur until `onLoad` (smooth reveal). Pair with **quality** when exporting assets (~85).
 * - **sizes**: use with **srcSet** later for responsive downloads; with a single **src**, browsers still accept it for future-proofing.
 *
 * **WebP/AVIF**: static files in `/public` are served as-is. Add compressed variants and pass **srcSet** when ready.
 */
export const IMAGE_SIZES = {
  /** Case study / project column hero and full-width content */
  caseStudyFull: '(max-width: 768px) 100vw, (max-width: 1400px) 82vw, min(1000px, 75vw)',
  /** Projects index cards */
  projectCard: '(max-width: 768px) 90vw, min(1200px, 92vw)',
  /** Home intro portrait strip */
  homeIntroPhoto: '(max-width: 768px) 50vw, min(220px, 40vw)',
  /** ~80%-width carousel slides */
  carouselSlide80: '(max-width: 768px) 85vw, min(900px, 70vw)',
  /** Lightbox / zoom overlay */
  lightbox: '85vw',
  /** Full-width block in intro column */
  homeIntroFull: '(max-width: 768px) 100vw, min(700px, 90vw)',
} as const

export type OptimizedImageProps = Omit<
  ImgHTMLAttributes<HTMLImageElement>,
  'loading' | 'decoding' | 'fetchPriority'
> & {
  /** Preload / high fetch priority (hero, first project card, first visible thumb). */
  priority?: boolean
  /** Responsive hint; most useful when you add `srcSet` with width descriptors. */
  sizes?: string
  /**
   * Documentary: target ~85 when exporting JPEG/PNG from design tools.
   * No runtime effect for plain `/public` URLs.
   */
  quality?: number
  /** Blur until loaded (smooth transition). */
  placeholder?: 'empty' | 'blur'
}

export function OptimizedImage({
  priority = false,
  sizes,
  quality: _quality = 85,
  placeholder = 'empty',
  className,
  style,
  onLoad,
  alt,
  src,
  ...rest
}: OptimizedImageProps) {
  const imgRef = useRef<HTMLImageElement>(null)
  const [showBlur, setShowBlur] = useState(placeholder === 'blur' && !priority)

  useLayoutEffect(() => {
    if (priority || placeholder !== 'blur') return
    const el = imgRef.current
    if (el?.complete) setShowBlur(false)
  }, [src, priority, placeholder])

  const handleLoad = useCallback(
    (e: React.SyntheticEvent<HTMLImageElement>) => {
      setShowBlur(false)
      onLoad?.(e)
    },
    [onLoad],
  )

  const blurStyle: React.CSSProperties | undefined =
    placeholder === 'blur'
      ? {
          transition: 'filter 0.4s ease, opacity 0.4s ease',
          filter: showBlur ? 'blur(12px)' : 'none',
          opacity: showBlur ? 0.92 : 1,
        }
      : undefined

  return (
    <img
      ref={imgRef}
      src={src}
      alt={alt}
      sizes={sizes}
      loading={priority ? 'eager' : 'lazy'}
      decoding="async"
      fetchPriority={priority ? 'high' : undefined}
      className={className}
      style={{ ...blurStyle, ...style }}
      onLoad={placeholder === 'blur' ? handleLoad : onLoad}
      {...rest}
    />
  )
}
