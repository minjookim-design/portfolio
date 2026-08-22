import { motion, useReducedMotion } from 'framer-motion'

/** X collage: center behind, four corners overlapping its edges. */
const FEEDBACK_EMAILS = [
  {
    src: '/Deck/email-5.png',
    alt: 'Creator email about limitations with current writing tools',
    x: '16%',
    y: '18%',
    z: 1,
    w: '68%',
  },
  {
    src: '/Deck/email-1.png',
    alt: 'Creator email with suggestions for the post editor',
    x: '0%',
    y: '0%',
    z: 3,
    w: '52%',
  },
  {
    src: '/Deck/email-3.png',
    alt: 'Creator email asking about saving drafts',
    x: '48%',
    y: '0%',
    z: 4,
    w: '52%',
  },
  {
    src: '/Deck/email-2.png',
    alt: 'Creator email feedback on editor UI and saving drafts',
    x: '0%',
    y: '48%',
    z: 5,
    w: '52%',
  },
  {
    src: '/Deck/email-4.png',
    alt: 'Creator email requesting better text formatting and embedding',
    x: '48%',
    y: '52%',
    z: 6,
    w: '52%',
  },
] as const

type CollageMode = 'mount' | 'inView'

/**
 * Shared email feedback collage — Piik deck + test-piik case study.
 * `mount` for deck slides; `inView` for scroll pages.
 */
export function PiikFeedbackEmailCollage({
  mode = 'inView',
  className = '',
}: {
  mode?: CollageMode
  className?: string
}) {
  const reduceMotion = useReducedMotion()

  return (
    <div
      className={`relative mx-auto aspect-[5/4] w-full max-w-[clamp(14rem,70vw,30.8rem)] min-h-[clamp(8rem,28vw,12.6rem)] ${className}`}
    >
      {FEEDBACK_EMAILS.map((email, i) => {
        const transition = reduceMotion
          ? { duration: 0 }
          : {
              type: 'spring' as const,
              stiffness: 60,
              damping: 15,
              delay: 0.2 + i * 0.2,
            }

        return (
          <motion.div
            key={email.src}
            className="absolute origin-center"
            style={{
              left: email.x,
              top: email.y,
              width: email.w,
              zIndex: email.z,
            }}
            initial={reduceMotion ? false : { opacity: 0, y: 100 }}
            {...(mode === 'inView'
              ? {
                  whileInView: { opacity: 1, y: 0 },
                  viewport: { once: true, amount: 0.25 },
                }
              : { animate: { opacity: 1, y: 0 } })}
            transition={transition}
          >
            <img
              src={email.src}
              alt={email.alt}
              className="block h-auto w-full rounded-none shadow-xl"
              draggable={false}
            />
          </motion.div>
        )
      })}
    </div>
  )
}
