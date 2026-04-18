import { HOME_SPLIT_ONBOARDING_SESSION_KEY } from '../components/HomeSplitOnboarding'
import { TestHomePageView, type TestHomePageExperienceConfig } from './TestHomePage'

/** Same shape as `/test`; production `/` uses different storage keys and no `data-design-test` root. */
export type HomePageExperienceConfig = TestHomePageExperienceConfig

export const HOME_PAGE_PRODUCTION_CONFIG: TestHomePageExperienceConfig = {
  splitWidthsStorageKey: 'home-split-widths',
  splitOnboardingSessionKey: HOME_SPLIT_ONBOARDING_SESSION_KEY,
  classicShellAndIntroColumn: true,
}

export function HomePage() {
  return <TestHomePageView config={HOME_PAGE_PRODUCTION_CONFIG} />
}
