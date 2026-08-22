import { HOME_SPLIT_ONBOARDING_SESSION_KEY } from './components/HomeSplitOnboarding'
import { TestHomePageView, type TestHomePageExperienceConfig } from './pages/TestHomePage'

/**
 * Backup of the previously published homepage (`TestHomePageView`).
 * Served at `/test-home`. Production `/` now uses `pages/HomePage`.
 */
export type TestHomeExperienceConfig = TestHomePageExperienceConfig

export const TEST_HOME_BACKUP_CONFIG: TestHomePageExperienceConfig = {
  splitWidthsStorageKey: 'test-home-split-widths',
  splitOnboardingSessionKey: `${HOME_SPLIT_ONBOARDING_SESSION_KEY}-backup`,
  classicShellAndIntroColumn: true,
}

export function TestHome() {
  return <TestHomePageView config={TEST_HOME_BACKUP_CONFIG} />
}
