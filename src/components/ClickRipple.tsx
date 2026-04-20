"use client"

import { useState, useEffect, useRef } from "react"
import { createPortal } from "react-dom"
import { motion, AnimatePresence } from "framer-motion"

type Ripple = { id: number; x: number; y: number }

/**
 * Global click feedback: expanding 0.5px ring — **`#00F7F0` border + `mix-blend-mode: difference`** on cream `#faf7f0`
 * reads as a vibrant red ring (difference inverts the cyan channel against the warm base).
 */
export function ClickRipple() {
  const [ripples, setRipples] = useState<Ripple[]>([])
  const idRef = useRef(0)
  const timeoutsRef = useRef<Map<number, ReturnType<typeof setTimeout>>>(new Map())

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const id = Date.now() + (idRef.current += 1)
      setRipples((prev) => [...prev, { id, x: e.clientX, y: e.clientY }])
      const t = window.setTimeout(() => {
        setRipples((prev) => prev.filter((r) => r.id !== id))
        timeoutsRef.current.delete(id)
      }, 800)
      timeoutsRef.current.set(id, t)
    }

    window.addEventListener("mousedown", handleClick)
    return () => {
      window.removeEventListener("mousedown", handleClick)
      timeoutsRef.current.forEach((timeoutId) => clearTimeout(timeoutId))
      timeoutsRef.current.clear()
    }
  }, [])

  if (typeof document === "undefined" || document.body == null) {
    return null
  }

  return createPortal(
    <div className="pointer-events-none fixed inset-0 z-[99998] overflow-hidden">
      <AnimatePresence>
        {ripples.map((ripple) => (
          <motion.div
            key={ripple.id}
            initial={{
              top: ripple.y,
              left: ripple.x,
              width: 0,
              height: 0,
              opacity: 1,
              x: "-50%",
              y: "-50%",
            }}
            animate={{ width: 300, height: 300, opacity: [1, 0.9, 0] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.7, ease: "easeOut", times: [0, 0.7, 1] }}
            className="absolute rounded-full"
            style={{
              border: "0.5px solid #00F7F0",
              mixBlendMode: "difference",
            }}
          />
        ))}
      </AnimatePresence>
    </div>,
    document.body,
  )
}
