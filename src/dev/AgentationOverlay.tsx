/**
 * Dev-only: Agentation UI. Imported only when `import.meta.env.DEV` (see `main.tsx`).
 * This file must not be imported from production code paths.
 */
import { Agentation } from 'agentation'

export default function AgentationOverlay() {
  return <Agentation />
}
