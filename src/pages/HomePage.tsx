/**
 * Production homepage at `/` — ERD archive + project overlays (same as `/test-home-3`).
 */
import { TestHomePage3 } from './TestHomePage3'
import { ERD_PRODUCTION_HOME } from './testHome3/erdHomePaths'

export function HomePage() {
  return <TestHomePage3 basePath={ERD_PRODUCTION_HOME} />
}
