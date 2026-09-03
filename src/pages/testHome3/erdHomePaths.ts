export const ERD_PRODUCTION_HOME = '/'
export const ERD_SANDBOX_HOME = '/test-home-3'

const ERD_PROJECT_SEGMENTS = ['hovr', 'piik-ai', 'ar-fitting-room', 'about'] as const

/** Build `/segment` or `/base/segment` without double slashes. */
export function erdHomePath(basePath: string, segment: string): string {
  const normalizedBase = basePath === '/' ? '' : basePath.replace(/\/$/, '')
  const normalizedSegment = segment.replace(/^\//, '')
  if (!normalizedBase) return `/${normalizedSegment}`
  return `${normalizedBase}/${normalizedSegment}`
}

export function erdHomeRoot(basePath: string): string {
  return basePath === '/' || basePath === '' ? '/' : basePath.replace(/\/$/, '')
}

export function isErdHomePathname(pathname: string): boolean {
  if (pathname === '/' || pathname === '') return true
  if (pathname === ERD_SANDBOX_HOME || pathname.startsWith(`${ERD_SANDBOX_HOME}/`)) {
    return true
  }
  for (const segment of ERD_PROJECT_SEGMENTS) {
    if (pathname === `/${segment}`) return true
  }
  return false
}
