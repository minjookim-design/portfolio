import { isValidElement, type ReactNode } from 'react'
import type { DeckVisualSection } from '../Deck'

/** Strip React nodes to plain text for deck typography. */
export function plainTextFromReactNode(node: ReactNode): string {
  if (node == null || node === false || node === true) return ''
  if (typeof node === 'string' || typeof node === 'number') return String(node)
  if (Array.isArray(node)) {
    return node
      .map(plainTextFromReactNode)
      .filter(Boolean)
      .join(' ')
      .replace(/\s+/g, ' ')
      .trim()
  }
  if (isValidElement(node)) {
    const props = node.props as { children?: ReactNode }
    return plainTextFromReactNode(props?.children ?? '')
  }
  return ''
}

export function spyLabel(section: { label: string; spyLabel?: unknown }): string {
  if ('spyLabel' in section && section.spyLabel != null && String(section.spyLabel).trim()) {
    return String(section.spyLabel)
  }
  return section.label
}

function firstStringMedia(value: unknown): string | null {
  if (typeof value === 'string' && value.trim()) return value.trim()
  if (Array.isArray(value)) {
    for (const item of value) {
      const found = firstStringMedia(item)
      if (found) return found
    }
  }
  return null
}

/** First media URL on this object (not walking into subSections). */
function pickMediaFromRecord(rec: Record<string, unknown>): string {
  const ma = rec.mediaAbove
  if (typeof ma === 'string' && ma.trim()) return ma.trim()
  if (typeof rec.midMedia === 'string' && rec.midMedia.trim()) return rec.midMedia.trim()

  const fromMedia = firstStringMedia(rec.media)
  if (fromMedia) return fromMedia

  const carousel = rec.carousel
  if (Array.isArray(carousel)) {
    for (const c of carousel) {
      if (typeof c === 'string' && c.trim()) return c.trim()
    }
  }

  const phone = rec.phoneCarousel as { srcs?: unknown[] } | undefined
  if (Array.isArray(phone?.srcs)) {
    for (const src of phone.srcs) {
      if (typeof src === 'string' && src.trim()) return src.trim()
    }
  }

  const mb = rec.mediaBeside as { src?: unknown } | undefined
  if (typeof mb?.src === 'string' && mb.src.trim()) return mb.src.trim()

  return ''
}

/** Deep pick including nested subSections (for top-level sections only). */
function pickPrimaryMedia(section: Record<string, unknown>): string {
  const direct = pickMediaFromRecord(section)
  if (direct) return direct

  const subs = section.subSections as Array<Record<string, unknown>> | undefined
  if (subs) {
    for (const sub of subs) {
      const sm = pickMediaFromRecord(sub)
      if (sm) return sm
    }
  }

  return ''
}

export function textFromField(value: unknown): string {
  if (typeof value === 'string') return value.trim()
  return plainTextFromReactNode(value as ReactNode).trim()
}

function truncate(s: string, max: number): string {
  if (s.length <= max) return s
  return `${s.slice(0, max - 1)}…`
}

const FALLBACK_IMAGE: Record<'hovr' | 'piik' | 'ar-fitting', string> = {
  hovr: '/hovr/Title.jpg',
  piik: '',
  /** Deck-only: never use overview art as a generic empty slide fallback. */
  'ar-fitting': '',
}

function slideId(...parts: (string | number)[]): string {
  return parts.map(String).join('--')
}

function makeSlide(
  id: string,
  labelPart: string,
  heading: string,
  body: string,
  image: string,
  fallback: string,
): DeckVisualSection {
  return {
    id,
    label: labelPart,
    heading: truncate(heading || labelPart, 160),
    body: truncate(body, 520),
    image: image || fallback,
  }
}

/** Ordered visual URLs for a leaf section (carousel, media array, single media, midMedia). */
function collectOrderedVisualUrls(section: Record<string, unknown>): string[] {
  const seen = new Set<string>()
  const out: string[] = []
  const push = (u: string) => {
    const t = u.trim()
    if (!t || seen.has(t)) return
    seen.add(t)
    out.push(t)
  }

  const ma = section.mediaAbove
  if (typeof ma === 'string') push(ma)

  const media = section.media
  if (Array.isArray(media)) {
    for (const m of media) {
      if (typeof m === 'string') push(m)
    }
  } else if (typeof media === 'string' && media.trim()) {
    push(media)
  }

  const carousel = section.carousel
  if (Array.isArray(carousel)) {
    for (const c of carousel) {
      if (typeof c === 'string') push(c)
    }
  }

  if (typeof section.midMedia === 'string' && section.midMedia.trim()) {
    push(section.midMedia)
  }

  const mb = section.mediaBeside as { src?: unknown } | undefined
  if (typeof mb?.src === 'string') push(String(mb.src))

  return out
}

function subBodyWithSubheading(sub: Record<string, unknown>): string {
  const subh = textFromField(sub.subheading)
  const body = textFromField(sub.body)
  if (subh && body) return `${subh}\n\n${body}`
  return body || subh
}

function isDeckMediaBesidePair(sub: Record<string, unknown>, subUrls: string[]): boolean {
  const phone = sub.phoneCarousel as { srcs?: unknown[] } | undefined
  if (Array.isArray(phone?.srcs) && phone.srcs.length > 0) return false
  const mb = sub.mediaBeside as { src?: unknown } | undefined
  const besideSrc = typeof mb?.src === 'string' ? mb.src.trim() : ''
  return subUrls.length === 2 && Boolean(besideSrc) && subUrls[1] === besideSrc
}

function countSubSectionSlides(sub: Record<string, unknown>): number {
  const phone = sub.phoneCarousel as { srcs?: unknown[] } | undefined
  if (Array.isArray(phone?.srcs) && phone.srcs.length > 0) return phone.srcs.length
  const subUrls = collectOrderedVisualUrls(sub)
  const postN = (sub.postContent as unknown[] | undefined)?.length ?? 0
  if (isDeckMediaBesidePair(sub, subUrls)) return 1 + postN
  if (subUrls.length > 1) return subUrls.length + postN
  if (postN > 0) return 1 + postN
  return 1
}

function countExpandedSlidesForTopSection(section: Record<string, unknown>): number {
  const subs = section.subSections as Array<Record<string, unknown>> | undefined
  if (subs?.length) {
    return subs.reduce((acc, sub) => acc + countSubSectionSlides(sub), 0)
  }

  const urls = collectOrderedVisualUrls(section)
  const posts = (section.postContent as unknown[] | undefined)?.length ?? 0
  const picked = pickPrimaryMedia(section)
  const urlCount = urls.length > 0 ? urls.length : picked ? 1 : 0
  if (urlCount === 0 && posts === 0) return 1
  if (urlCount === 0) return Math.max(1, posts)
  return urlCount + posts
}

function expandSubSection(
  sub: Record<string, unknown>,
  parentLabel: string,
  parentId: string,
  subIndex: number,
  totalInParent: number,
  partCounter: { n: number },
  fallback: string,
): DeckVisualSection[] {
  const out: DeckVisualSection[] = []
  const phone = sub.phoneCarousel as {
    srcs?: string[]
    captions?: Array<{ title?: unknown; body?: unknown }>
  } | undefined

  const subHead = textFromField(sub.heading) || parentLabel
  const subBody = subBodyWithSubheading(sub)
  const subMedia = pickMediaFromRecord(sub)
  const postA = sub.postContent as Array<Record<string, unknown>> | undefined
  const subUrls = collectOrderedVisualUrls(sub)

  if (isDeckMediaBesidePair(sub, subUrls)) {
    const mb = sub.mediaBeside as { src?: string; gapPx?: unknown } | undefined
    const besideSrc = typeof mb?.src === 'string' ? mb.src.trim() : ''
    const gapPx =
      typeof mb?.gapPx === 'number' && Number.isFinite(mb.gapPx) ? Math.max(0, Math.round(mb.gapPx)) : 10
    partCounter.n++
    out.push({
      id: slideId(parentId, 'sub', subIndex, 'pair'),
      label: `${parentLabel} · ${partCounter.n}/${totalInParent}`,
      heading: truncate(subHead, 160),
      body: truncate(subBody, 520),
      image: subUrls[0] ?? '',
      imageBeside: besideSrc,
      mediaBesideGapPx: gapPx,
    })
    if (postA?.length) {
      for (let j = 0; j < postA.length; j++) {
        partCounter.n++
        const pc = postA[j]
        const h = textFromField(pc.heading) || subHead
        const b = textFromField(pc.body)
        const img = pickMediaFromRecord(pc) || subUrls[0] || fallback
        out.push(
          makeSlide(
            slideId(parentId, 'sub', subIndex, 'post', j),
            `${parentLabel} · ${partCounter.n}/${totalInParent}`,
            h,
            b,
            img,
            fallback,
          ),
        )
      }
    }
    return out
  }

  if (subUrls.length > 1 && !(Array.isArray(phone?.srcs) && phone.srcs.length > 0)) {
    subUrls.forEach((url, i) => {
      partCounter.n++
      const isFirst = i === 0
      out.push(
        makeSlide(
          slideId(parentId, 'sub', subIndex, 'asset', i),
          `${parentLabel} · ${partCounter.n}/${totalInParent}`,
          truncate(isFirst ? subHead : `${subHead} · ${i + 1}/${subUrls.length}`, 160),
          isFirst ? subBody : '',
          url,
          fallback,
        ),
      )
    })
    if (postA?.length) {
      for (let j = 0; j < postA.length; j++) {
        partCounter.n++
        const pc = postA[j]
        const h = textFromField(pc.heading) || subHead
        const b = textFromField(pc.body)
        const img = pickMediaFromRecord(pc) || subUrls[0] || fallback
        out.push(
          makeSlide(
            slideId(parentId, 'sub', subIndex, 'post', j),
            `${parentLabel} · ${partCounter.n}/${totalInParent}`,
            h,
            b,
            img,
            fallback,
          ),
        )
      }
    }
    return out
  }

  if (Array.isArray(phone?.srcs) && phone.srcs.length > 0) {
    const captions = phone.captions ?? []
    phone.srcs.forEach((src, i) => {
      partCounter.n++
      const cap = captions[i]
      const h =
        (cap?.title != null && textFromField(cap.title)) ||
        textFromField(sub.heading) ||
        parentLabel
      const b =
        (cap?.body != null && textFromField(cap.body)) || subBodyWithSubheading(sub) || textFromField(sub.body)
      out.push(
        makeSlide(
          slideId(parentId, 'sub', subIndex, 'clip', i),
          `${parentLabel} · ${partCounter.n}/${totalInParent}`,
          h,
          b,
          src,
          fallback,
        ),
      )
    })
    return out
  }

  partCounter.n++

  out.push(
    makeSlide(
      slideId(parentId, 'sub', subIndex),
      `${parentLabel} · ${partCounter.n}/${totalInParent}`,
      subHead,
      subBody,
      subMedia,
      fallback,
    ),
  )

  if (postA?.length) {
    for (let j = 0; j < postA.length; j++) {
      partCounter.n++
      const pc = postA[j]
      const h = textFromField(pc.heading) || subHead
      const b = textFromField(pc.body)
      const img = pickMediaFromRecord(pc) || subMedia || fallback
      out.push(
        makeSlide(
          slideId(parentId, 'sub', subIndex, 'post', j),
          `${parentLabel} · ${partCounter.n}/${totalInParent}`,
          h,
          b,
          img,
          fallback,
        ),
      )
    }
  }

  return out
}

function expandSectionWithSubSections(
  section: Record<string, unknown> & { id: string; label: string },
  parentLabel: string,
  fallback: string,
): DeckVisualSection[] {
  const subs = section.subSections as Array<Record<string, unknown>>
  const parentId = String(section.id)
  const total = countExpandedSlidesForTopSection(section)
  const partCounter = { n: 0 }
  const out: DeckVisualSection[] = []
  subs.forEach((sub, subIndex) => {
    out.push(...expandSubSection(sub, parentLabel, parentId, subIndex, total, partCounter, fallback))
  })
  return out
}

function expandLeafSection(
  section: Record<string, unknown> & { id: string; label: string },
  parentLabel: string,
  fallback: string,
): DeckVisualSection[] {
  const parentId = String(section.id)
  const headingFromString = typeof section.heading === 'string' ? section.heading.trim() : ''
  const headingFromReact = plainTextFromReactNode(section.heading as ReactNode).trim()
  const mainHeading = truncate(headingFromString || headingFromReact || parentLabel, 160)
  const mainBody = truncate(textFromField(section.body), 520)

  const urls = collectOrderedVisualUrls(section)
  const picked = pickPrimaryMedia(section)
  const urlList = urls.length > 0 ? urls : picked ? [picked] : []
  const posts = (section.postContent as Array<Record<string, unknown>> | undefined) ?? []
  const total = countExpandedSlidesForTopSection(section)

  if (urlList.length === 0 && posts.length === 0) {
    return [
      makeSlide(parentId, parentLabel, mainHeading, mainBody || parentLabel, pickMediaFromRecord(section), fallback),
    ]
  }

  const out: DeckVisualSection[] = []
  let part = 0

  if (urlList.length > 0) {
    urlList.forEach((url, i) => {
      part++
      const isFirst = i === 0
      const h = isFirst ? mainHeading : `${mainHeading} · ${i + 1}/${urlList.length}`
      const b = isFirst ? mainBody : ''
      out.push(
        makeSlide(
          slideId(parentId, 'asset', i),
          `${parentLabel} · ${part}/${total}`,
          truncate(h, 160),
          b,
          url,
          fallback,
        ),
      )
    })
  } else if (posts.length === 0) {
    part++
    out.push(
      makeSlide(
        slideId(parentId, 'main'),
        `${parentLabel} · ${part}/${total}`,
        mainHeading,
        mainBody || parentLabel,
        picked,
        fallback,
      ),
    )
  }

  const primaryVisual = urlList[0] ?? picked
  posts.forEach((pc, j) => {
    part++
    const h = textFromField(pc.heading) || mainHeading
    const b = textFromField(pc.body)
    const img = pickMediaFromRecord(pc) || primaryVisual || fallback
    out.push(
      makeSlide(
        slideId(parentId, 'post', j),
        `${parentLabel} · ${part}/${total}`,
        truncate(h, 160),
        truncate(b, 520),
        img,
        fallback,
      ),
    )
  })

  return out
}

/**
 * Deck slides mirror scroll-spy order; sections with subSections, postContent,
 * phoneCarousel clips, or multiple images expand to one slide each.
 */
export function toDeckVisualSections(
  sections: readonly Record<string, unknown>[],
  projectKey: keyof typeof FALLBACK_IMAGE,
): DeckVisualSection[] {
  const fallback = FALLBACK_IMAGE[projectKey]
  const out: DeckVisualSection[] = []

  for (const raw of sections) {
    const section = raw as Record<string, unknown> & { id: string; label: string }
    const label = spyLabel(section as { label: string; spyLabel?: unknown })

    if (projectKey === 'piik' && section.id === 'overview') {
      const carouselRaw = section.carousel
      if (
        Array.isArray(carouselRaw) &&
        carouselRaw.length > 0 &&
        carouselRaw.every((x) => typeof x === 'string')
      ) {
        const urls = carouselRaw as string[]
        const headingFromString = typeof section.heading === 'string' ? section.heading.trim() : ''
        const headingFromReact = plainTextFromReactNode(section.heading as ReactNode).trim()
        const mainHeading = truncate(headingFromString || headingFromReact || label, 160)
        const mainBody = truncate(textFromField(section.body), 520)
        out.push({
          id: 'overview',
          label,
          heading: mainHeading,
          body: mainBody,
          image: '',
          carousel: [...urls],
        })
        continue
      }
    }

    if (projectKey === 'ar-fitting' && section.id === 'overview') {
      const headingFromString = typeof section.heading === 'string' ? section.heading.trim() : ''
      const headingFromReact = plainTextFromReactNode(section.heading as ReactNode).trim()
      const mainHeading = truncate(headingFromString || headingFromReact || label, 160)
      const mainBody = truncate(textFromField(section.body), 520)
      out.push({
        id: 'overview',
        label,
        heading: mainHeading,
        body: mainBody,
        image: '',
      })
      continue
    }

    const subs = section.subSections as Array<Record<string, unknown>> | undefined

    if (subs?.length) {
      out.push(...expandSectionWithSubSections(section, label, fallback))
    } else {
      out.push(...expandLeafSection(section, label, fallback))
    }
  }

  return out
}
