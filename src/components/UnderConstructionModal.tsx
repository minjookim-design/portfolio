import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { MD_INK } from '../testMd3Layout'
import { setTestHomeLandingIntent } from '../testHomeLanding'

/** Light pink / light orange — match AR Fitting Room & JoJo thumbnail tones. */
const MODAL_BG: Record<UnderConstructionProjectId, string> = {
  'ar-fitting-room': 'bg-[#FFE8F0]',
  jojo: 'bg-[#FFEAD6]',
}

const HERO_SUIT = "font-['SUIT_Variable',sans-serif]"
const HERO_TITLE =
  `${HERO_SUIT} text-[14pt] font-semibold leading-[1.2] tracking-[-0.02em] text-black dark:text-[#f2f2f2]`
const HERO_BODY =
  `${HERO_SUIT} text-[12pt] font-normal leading-[1.2] tracking-[-0.02em] text-[color:var(--color-muted,#666666)] dark:text-white/75`

function CloseGlyph() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      aria-hidden
    >
      <path
        d="M2 14H0V12H2V14ZM14 14H12V12H14V14ZM4 10V12H2V10H4ZM12 12H10V10H12V12ZM6 10H4V8H6V10ZM10 10H8V8H10V10ZM8 8H6V6H8V8ZM6 6H4V4H6V6ZM10 6H8V4H10V6ZM4 4H2V2H4V4ZM12 4H10V2H12V4ZM2 2H0V0H2V2ZM14 2H12V0H14V2Z"
        fill="currentColor"
      />
    </svg>
  )
}

export type UnderConstructionProjectId = 'ar-fitting-room' | 'jojo'

type UnderConstructionModalProps = {
  projectId: UnderConstructionProjectId
  onClose: () => void
}

/**
 * Notice modal — HOVR hero surface (`system-core-local` grid) + project close control.
 */
export function UnderConstructionModal({ projectId, onClose }: UnderConstructionModalProps) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = prev
    }
  }, [onClose])

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25 }}
        onClick={onClose}
        role="dialog"
        aria-modal="true"
        aria-labelledby="under-construction-title"
      >
        <motion.div
          className={`system-core-local relative mx-4 w-full max-w-md overflow-hidden rounded-none ${MODAL_BG[projectId]} ${MD_INK}`}
          style={{ maxWidth: 'min(28rem, 90%)' }}
          initial={{ scale: 0.92, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.92, opacity: 0 }}
          transition={{ duration: 0.25 }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="system-core-grid" aria-hidden />
          <button
            type="button"
            className="system-core-button absolute top-4 right-4 z-[2] sm:top-6 sm:right-6"
            onClick={onClose}
            aria-label="Close"
          >
            <CloseGlyph />
          </button>
          <div className="relative z-[1] flex max-w-[36ch] flex-col px-4 py-8 sm:px-6 md:py-10">
            <h2 id="under-construction-title" className={HERO_TITLE}>
              Oops! Under construction.
            </h2>
            <p className={`mt-4 ${HERO_BODY}`}>
              View my{' '}
              <Link
                to="/test-home"
                onClick={() =>
                  setTestHomeLandingIntent({ openProjectId: projectId, skipIntro: true })
                }
                className={`font-semibold underline underline-offset-2 decoration-black/35 transition-colors hover:decoration-black dark:decoration-white/40 dark:hover:decoration-white ${MD_INK}`}
              >
                previous portfolio website
              </Link>{' '}
              version to read this project.
            </p>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
