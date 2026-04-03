import { useState, useEffect } from 'react'

export function useIsNarrow(breakpoint = 1200): boolean {
  const [isNarrow, setIsNarrow] = useState(window.innerWidth <= breakpoint)
  useEffect(() => {
    const check = () => setIsNarrow(window.innerWidth <= breakpoint)
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [breakpoint])
  return isNarrow
}
