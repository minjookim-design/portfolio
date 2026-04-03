import { useEffect, useRef, useState } from 'react'
import { caseStudyHomeRailGapPx } from '../components/CaseStudyRailTitle'

/** Measures the case-study column root and returns a rail↔body gap that scales with its width. */
export function useCaseStudyHomeRailGap() {
  const rootRef = useRef<HTMLDivElement>(null)
  const [railGapPx, setRailGapPx] = useState(161)

  useEffect(() => {
    const el = rootRef.current
    if (!el) return
    const update = () => {
      setRailGapPx(caseStudyHomeRailGapPx(el.getBoundingClientRect().width))
    }
    update()
    const ro = new ResizeObserver(update)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  return { rootRef, railGapPx }
}
