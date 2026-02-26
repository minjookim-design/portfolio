import { motion } from 'framer-motion'
import { useScramble } from '../hooks/useScramble'

interface ScrambleTextProps {
  text: string
  className?: string
  speed?: number
  scrambleCycles?: number
  delay?: number
}

export function ScrambleText({
  text,
  className,
  speed = 35,
  scrambleCycles = 8,
  delay = 300,
}: ScrambleTextProps) {
  const display = useScramble({ text, speed, scrambleCycles, delay })

  return (
    <motion.span
      className={className}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.1 }}
    >
      {display}
    </motion.span>
  )
}
