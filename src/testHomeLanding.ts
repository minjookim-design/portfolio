import {
  getBlueprintRevealSessionKey,
  markBlueprintRevealComplete,
} from './components/HomeBlueprintReveal'

export const TEST_HOME_LANDING_SESSION_KEY = 'portfolio-test-home-landing-v1'

export type TestHomeLandingProjectId = 'ar-fitting-room' | 'jojo'

export type TestHomeLandingIntent = {
  openProjectId: TestHomeLandingProjectId
  skipIntro: true
}

/** Persist intent before navigating from the under-construction modal → `/test-home`. */
export function setTestHomeLandingIntent(intent: TestHomeLandingIntent): void {
  try {
    sessionStorage.setItem(TEST_HOME_LANDING_SESSION_KEY, JSON.stringify(intent))
    if (intent.skipIntro) {
      markBlueprintRevealComplete(getBlueprintRevealSessionKey('test-home-split-widths'))
    }
  } catch {
    /* ignore */
  }
}

/** Read once on `/test-home` mount; clears storage so refresh behaves normally. */
export function consumeTestHomeLandingIntent(): TestHomeLandingIntent | null {
  try {
    const raw = sessionStorage.getItem(TEST_HOME_LANDING_SESSION_KEY)
    if (!raw) return null
    sessionStorage.removeItem(TEST_HOME_LANDING_SESSION_KEY)
    const parsed = JSON.parse(raw) as Partial<TestHomeLandingIntent>
    if (
      parsed.skipIntro === true &&
      (parsed.openProjectId === 'ar-fitting-room' || parsed.openProjectId === 'jojo')
    ) {
      return { openProjectId: parsed.openProjectId, skipIntro: true }
    }
  } catch {
    /* ignore */
  }
  return null
}
