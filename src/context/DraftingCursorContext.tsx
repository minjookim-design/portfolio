/* eslint-disable react-refresh/only-export-components -- provider + cursor hooks share one module */
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'

export type DraftingCursorMode = 'default' | 'project-hover'

type DraftingCursorContextValue = {
  mode: DraftingCursorMode
  setMode: (mode: DraftingCursorMode) => void
  /** Monospace hint next to viewfinder (e.g. `[ TARGET: OPEN ]`). */
  hoverCaption: string
  setHoverCaption: (caption: string) => void
}

const DraftingCursorContext = createContext<DraftingCursorContextValue | null>(null)

export function DraftingCursorProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<DraftingCursorMode>('default')
  const [hoverCaption, setHoverCaption] = useState('[ TARGET: OPEN ]')

  const value = useMemo(
    () => ({
      mode,
      setMode,
      hoverCaption,
      setHoverCaption,
    }),
    [mode, hoverCaption],
  )

  return <DraftingCursorContext.Provider value={value}>{children}</DraftingCursorContext.Provider>
}

export function useDraftingCursor(): DraftingCursorContextValue {
  const ctx = useContext(DraftingCursorContext)
  if (!ctx) {
    throw new Error('useDraftingCursor must be used within DraftingCursorProvider')
  }
  return ctx
}

/** Safe optional hook for deep leaves (e.g. home list) when provider may be absent in tests. */
export function useDraftingCursorOptional(): DraftingCursorContextValue | null {
  return useContext(DraftingCursorContext)
}

export function useProjectRowDraftingCursor() {
  const ctx = useDraftingCursorOptional()
  const onProjectRowEnter = useCallback(
    (projectLabel?: string) => {
      if (!ctx) return
      ctx.setMode('project-hover')
      const trimmed = projectLabel?.trim()
      ctx.setHoverCaption(
        trimmed && trimmed.length > 0
          ? `[ VIEW: ${trimmed.toUpperCase()} ]`
          : '[ TARGET: OPEN ]',
      )
    },
    [ctx],
  )
  const onProjectRowLeave = useCallback(() => {
    if (!ctx) return
    ctx.setMode('default')
  }, [ctx])
  return { onProjectRowEnter, onProjectRowLeave }
}
