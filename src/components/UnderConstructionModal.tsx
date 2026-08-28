import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { MD_INK } from '../testMd3Layout'
import { setTestHomeLandingIntent } from '../testHomeLanding'
import {
  PortfolioPopupPanel,
  PORTFOLIO_POPUP_LABEL_CLASS,
  portfolioPopupLabelStyle,
} from './PortfolioPopupShell'

export type UnderConstructionProjectId = 'ar-fitting-room' | 'jojo'

type UnderConstructionModalProps = {
  projectId: UnderConstructionProjectId
  onClose: () => void
}

export function UnderConstructionModal({ projectId, onClose }: UnderConstructionModalProps) {
  const messageStyle = {
    ...portfolioPopupLabelStyle(),
    fontSize:
      'clamp(calc(8px + 2pt), calc(calc(var(--gallery-cell-h, 10rem) * 0.042) + 2pt), calc(12px + 2pt))',
  }

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

  if (typeof document === 'undefined') return null

  return createPortal(
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 flex items-center justify-center bg-black/40"
        style={{ zIndex: 'var(--portfolio-popup-z)' }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25 }}
        onClick={onClose}
        role="presentation"
      >
        <div onClick={(e) => e.stopPropagation()} className="w-full max-w-md px-4">
          <PortfolioPopupPanel
            title="Under Construction"
            onClose={onClose}
            originClass="origin-center"
            className="w-full"
            style={{ maxWidth: 'min(28rem, 100%)' }}
            contentClassName="max-w-[36ch]"
            aria-labelledby="under-construction-title"
          >
            <p
              id="under-construction-title"
              className={`normal-case ${PORTFOLIO_POPUP_LABEL_CLASS} leading-[1.35] text-black/90 dark:text-white/90`}
              style={messageStyle}
            >
              Hi visitors! I&apos;m updating it right now. but you can visit{' '}
              <Link
                to="/test-home"
                onClick={() =>
                  setTestHomeLandingIntent({ openProjectId: projectId, skipIntro: true })
                }
                className={`font-semibold underline underline-offset-2 decoration-black/35 transition-colors hover:decoration-black dark:decoration-white/40 dark:hover:decoration-white ${MD_INK}`}
              >
                my previous portfolio website
              </Link>
            </p>
          </PortfolioPopupPanel>
        </div>
      </motion.div>
    </AnimatePresence>,
    document.body,
  )
}
