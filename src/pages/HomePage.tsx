/**
 * Production homepage at `/`.
 * Gallery layout promoted from `/test-home-3`. Nested project overlays: `/hovr`, `/piik-ai`.
 * Previous homepage lives at `/test-home-classic`.
 */
import { Outlet } from 'react-router-dom'
import {
  TestHomePage3View,
  type TestHomePage3ExperienceConfig,
} from './TestHomePage3'

export const HOME_PAGE_PRODUCTION_CONFIG: TestHomePage3ExperienceConfig = {
  splitWidthsStorageKey: 'home-split-widths',
  splitOnboardingSessionKey: 'home-onboarding-v1',
  classicShellAndIntroColumn: true,
  galleryOnly: true,
  homePath: '/',
  routePrefix: '',
}

export function HomePage() {
  return (
    <>
      <TestHomePage3View config={HOME_PAGE_PRODUCTION_CONFIG} />
      <Outlet />
    </>
  )
}
