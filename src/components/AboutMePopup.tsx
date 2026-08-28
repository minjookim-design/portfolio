import { Fragment, useEffect, type CSSProperties, type Ref } from 'react'
import { AnimatePresence } from 'framer-motion'
import { IMAGE_SIZES, OptimizedImage } from './OptimizedImage'
import {
  PortfolioPopupPanel,
  PORTFOLIO_POPUP_LABEL_CLASS,
  PORTFOLIO_POPUP_SECTION_TITLE_CLASS,
  portfolioPopupLabelStyle,
} from './PortfolioPopupShell'

const GALLERY_TABLE_GRID =
  'grid grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)_4.0625rem] items-baseline justify-items-start gap-x-[0.75em] gap-y-[0.28em] pr-[16%]'

const EDUCATION_ENTRIES = [
  { degree: 'Bachelor of Design', school: 'York University', period: '2020 – 2025' },
  { degree: 'Diploma, Multimedia Design and Development', school: 'Humber College', period: '2018 – 2020' },
] as const

const INTEREST_ICON_CLASS =
  'inline-block h-[1em] w-auto shrink-0 align-middle text-current'

const ME_PHOTOS = [
  '/me/cat.jpg',
  '/me/2.jpg',
  '/me/3.jpg',
  '/me/4.jpeg',
  '/me/5.JPG',
  '/me/6.JPG',
  '/me/7.JPG',
  '/me/8.JPG',
  '/me/9.JPG',
  '/me/10.JPG',
] as const

function InterestCatIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 18" fill="none" className={INTEREST_ICON_CLASS} aria-hidden>
      <path
        d="M14 6H16V0H14V2H12V4H14V6ZM2 16H4V14H2V16ZM0 14H2V6H0V14ZM4 18H14V16H4V18ZM4 10H6V8H4V10ZM6 14H12V12H10V10H8V12H6V14ZM14 16H16V14H14V16ZM2 6H4V4H6V2H4V0H2V6ZM12 10H14V8H12V10ZM6 6H12V4H6V6ZM16 14H18V6H16V14Z"
        fill="currentColor"
      />
    </svg>
  )
}

function InterestTravelIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="none" className={INTEREST_ICON_CLASS} aria-hidden>
      <path
        d="M19.1667 3.33333V6.66667H18.3334V7.5H16.6667V8.33333H15V9.16667H13.3334V10H11.6667V10.8333H10V11.6667H8.33337V12.5H3.33337V11.6667H2.50004V10.8333H1.66671V10H0.833374V8.33333H1.66671V7.5H3.33337V8.33333H4.16671V9.16667H5.83337V8.33333H6.66671V7.5H5.83337V6.66667H5.00004V5.83333H4.16671V5H3.33337V4.16667H4.16671V3.33333H5.00004V2.5H5.83337V3.33333H7.50004V4.16667H9.16671V5H10.8334V5.83333H12.5V5H14.1667V4.16667H15.8334V3.33333H19.1667ZM0.833374 15H19.1667V16.6667H0.833374V15Z"
        fill="currentColor"
      />
    </svg>
  )
}

function InterestKeyboardIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 19 15" fill="none" className={INTEREST_ICON_CLASS} aria-hidden>
      <path
        d="M1.66667 15H16.6667V13.3333H18.3333V1.66667H16.6667V0H1.66667V1.66667H0V13.3333H1.66667V15ZM1.66667 11.6667V10H3.33333V11.6667H1.66667ZM3.33333 8.33333V6.66667H5V8.33333H3.33333ZM1.66667 5V3.33333H3.33333V5H1.66667ZM5 11.6667V10H13.3333V11.6667H5ZM6.66667 8.33333V6.66667H8.33333V8.33333H6.66667ZM5 5V3.33333H6.66667V5H5ZM10 8.33333V6.66667H11.6667V8.33333H10ZM15 11.6667V10H16.6667V11.6667H15ZM8.33333 5V3.33333H10V5H8.33333ZM13.3333 8.33333V6.66667H15V8.33333H13.3333ZM11.6667 5V3.33333H13.3333V5H11.6667ZM15 5V3.33333H16.6667V5H15Z"
        fill="currentColor"
      />
    </svg>
  )
}

function InterestDrawingIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="none" className={INTEREST_ICON_CLASS} aria-hidden>
      <path
        d="M19.1667 3.3335V5.8335H18.3334V6.66683H17.5V7.50016H16.6667V8.3335H15.8334V7.50016H15V6.66683H14.1667V5.8335H13.3334V5.00016H12.5V4.16683H11.6667V3.3335H12.5V2.50016H13.3334V1.66683H14.1667V0.833496H16.6667V1.66683H17.5V2.50016H18.3334V3.3335H19.1667ZM15 9.16683H15.8334V10.0002H15V12.5002H14.1667V15.0002H13.3334V15.8335H11.6667V16.6668H9.16671V17.5002H6.66671V18.3335H4.16671V19.1668H2.50004V18.3335H3.33337V17.5002H4.16671V16.6668H5.00004V15.8335H5.83337V15.0002H6.66671V14.1668H7.50004V13.3335H10V10.8335H9.16671V10.0002H6.66671V12.5002H5.83337V13.3335H5.00004V14.1668H4.16671V15.0002H3.33337V15.8335H2.50004V16.6668H1.66671V17.5002H0.833374V15.8335H1.66671V13.3335H2.50004V10.8335H3.33337V8.3335H4.16671V6.66683H5.00004V5.8335H7.50004V5.00016H10V4.16683H10.8334V5.00016H11.6667V5.8335H12.5V6.66683H13.3334V7.50016H14.1667V8.3335H15V9.16683Z"
        fill="currentColor"
      />
    </svg>
  )
}

function InterestKDramaIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 14" fill="none" className={INTEREST_ICON_CLASS} aria-hidden>
      <path
        d="M0 14V0H16V14M2 4H14V10H2M2 8H14V6H2M2 12H4V2H2M12 12H14V2H12"
        fill="currentColor"
      />
    </svg>
  )
}

/** Square “About me” panel — anchored above chrome links. */
export function AboutMePopupPanel({
  onClose,
  className,
  style,
  panelRef,
}: {
  onClose: () => void
  className?: string
  style?: CSSProperties
  panelRef?: Ref<HTMLDivElement>
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  const labelStyle = portfolioPopupLabelStyle()

  return (
    <PortfolioPopupPanel
      title="About Me"
      onClose={onClose}
      panelRef={panelRef}
      className={className}
      style={{
        width: 'var(--gallery-w, min(20rem, calc(100vw - 2rem)))',
        height: 'var(--gallery-w, min(20rem, calc(100vw - 2rem)))',
        position: 'fixed',
        ...style,
      }}
      aria-labelledby="about-me-popup-education-title about-me-popup-interests-title"
    >
      <div>
        <p id="about-me-popup-education-title" className={PORTFOLIO_POPUP_SECTION_TITLE_CLASS} style={labelStyle}>
          Education
        </p>
        <div
          className={`${GALLERY_TABLE_GRID} ${PORTFOLIO_POPUP_LABEL_CLASS} text-left text-black dark:text-white`}
          style={labelStyle}
        >
          {EDUCATION_ENTRIES.map((edu) => (
            <Fragment key={edu.degree}>
              <span className="min-w-0 justify-self-start leading-tight">{edu.degree.toUpperCase()}</span>
              <span className="min-w-0 justify-self-start leading-tight opacity-90">
                {edu.school.toUpperCase()}
              </span>
              <span className="shrink-0 justify-self-start whitespace-nowrap tabular-nums leading-tight opacity-90">
                {edu.period.toUpperCase()}
              </span>
            </Fragment>
          ))}
        </div>
      </div>

      <div className="mt-[20px]">
        <p id="about-me-popup-interests-title" className={PORTFOLIO_POPUP_SECTION_TITLE_CLASS} style={labelStyle}>
          I like
        </p>
        <p className={`${PORTFOLIO_POPUP_LABEL_CLASS} text-black dark:text-white`} style={labelStyle}>
          <span className="inline-flex flex-wrap items-center gap-x-1.5 gap-y-1">
            <span className="inline-flex items-center gap-1">
              <InterestCatIcon />
              CATS
            </span>
            <span aria-hidden>·</span>
            <span className="inline-flex items-center gap-1">
              <InterestTravelIcon />
              TRAVEL
            </span>
            <span aria-hidden>·</span>
            <span className="inline-flex items-center gap-1">
              <InterestKeyboardIcon />
              MECHANICAL KEYBOARDS
            </span>
            <span aria-hidden>·</span>
            <span className="inline-flex items-center gap-1">
              <InterestDrawingIcon />
              DRAWING & PAINTING
            </span>
            <span aria-hidden>·</span>
            <span className="inline-flex items-center gap-1">
              <InterestKDramaIcon />
              K-DRAMA
            </span>
          </span>
        </p>
      </div>

      <div className="mt-3 flex flex-col gap-1">
        {ME_PHOTOS.map((src) => (
          <OptimizedImage
            key={src}
            src={src}
            alt=""
            className="block h-auto w-full"
            sizes={IMAGE_SIZES.homeIntroFull}
            placeholder="blur"
          />
        ))}
      </div>
    </PortfolioPopupPanel>
  )
}

export function AboutMePopup({ open, onClose }: { open: boolean; onClose: () => void }) {
  return <AnimatePresence>{open ? <AboutMePopupPanel onClose={onClose} /> : null}</AnimatePresence>
}
