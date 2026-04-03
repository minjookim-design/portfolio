import { useRef, useEffect, type ReactNode } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { useScrollSpy } from '../context/ScrollSpyContext'

interface ScrollSectionProps {
  id: string
  children: ReactNode
  className?: string
  /** Set to true to not report this section to scroll spy */
  silent?: boolean
}

export function ScrollSection({ id, children, className, silent }: ScrollSectionProps) {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollContainerRef, setActiveSection } = useScrollSpy()

  // Roll + fade driven by scroll progress through this section
  const { scrollYProgress } = useScroll({
    target: ref,
    container: scrollContainerRef,
    offset: ['start end', 'end start'],
  })

  // As section enters from below → y: 60px→0, opacity: 0→1
  // While centered → stays at y: 0, opacity: 1
  // As section exits above → y: 0→-60px, opacity: 1→0
  const y       = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], ['60px', '0px', '0px', '-60px'])
  const opacity = useTransform(scrollYProgress, [0, 0.25, 0.75, 1], [0, 1, 1, 0])

  // Scroll spy: fire setActiveSection when this section crosses 40% visibility
  useEffect(() => {
    if (silent) return
    const container = scrollContainerRef.current
    if (!container || !ref.current) return

    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) setActiveSection(id)
        })
      },
      { root: container, threshold: 0.4 },
    )

    observer.observe(ref.current)
    return () => observer.disconnect()
  }, [id, silent, scrollContainerRef, setActiveSection])

  return (
    <div
      ref={ref}
      id={id}
      className={`min-h-screen flex items-center ${className ?? ''}`}
    >
      <motion.div style={{ y, opacity }} className="w-full">
        {children}
      </motion.div>
    </div>
  )
}
