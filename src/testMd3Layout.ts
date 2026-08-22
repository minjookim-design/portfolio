/**
 * Test-page layout tokens (grid structure) + live homepage visual skin.
 * Colors, surfaces, and corner radii match `TestHomePage` / `index.css`
 * (`--color-bg-base`, cream `#faf7f0` / dark `#111111`, thumb `rounded-[10px]`,
 * chrome `rounded-none`). Typography uses SUIT Variable (`.test-typeface-tall`).
 */

/** SUIT Variable + 2% vertical glyph scale (see `.test-typeface-tall` in index.css) */
export const MD_TYPEFACE_CLASS = 'test-typeface-tall'

/** Explicit vertical-scale target for non-semantic text wrappers (divs, overlays) */
export const MD_TYPE_Y = 'test-type-y'

/** Page edge margins: 16dp compact → 24dp medium+ */
export const MD_PAGE_MARGIN = 'px-4 sm:px-6'

/** Column gutters: 8dp compact → 16dp medium → 24dp large */
export const MD_GUTTER = 'gap-2 sm:gap-4 lg:gap-6'

/** Vertical section rhythm (24 / 32 / 48dp) */
export const MD_SECTION_GAP = 'gap-6 sm:gap-8 lg:gap-12'

/**
 * Responsive column grid:
 * compact <600 → 4 cols | medium 600+ → 8 cols | expanded 840+ → 12 cols
 */
export const MD_COLS = 'grid grid-cols-4 sm:grid-cols-8 min-[840px]:grid-cols-12'

/** Bio / supporting pane: 4 of 12 on expanded */
export const MD_PANE_SUPPORT = 'col-span-4 sm:col-span-8 min-[840px]:col-span-4'

/** Main feed pane: 8 of 12 on expanded */
export const MD_PANE_MAIN = 'col-span-4 sm:col-span-8 min-[840px]:col-span-8'

/** Article body: centered 8 cols on expanded (detail / case study) */
export const MD_ARTICLE =
  'col-span-4 sm:col-span-8 min-[840px]:col-span-8 min-[840px]:col-start-3'

/** Full-bleed media within page margins */
export const MD_MEDIA_FULL = 'col-span-4 sm:col-span-8 min-[840px]:col-span-12'

/** Detail header: title + meta split */
export const MD_DETAIL_HEADER =
  'grid grid-cols-1 gap-6 py-8 sm:grid-cols-[minmax(0,2fr)_minmax(0,1fr)] sm:gap-6 lg:py-10'

/**
 * Homepage chrome: sharp corners (`rounded-none` on folds / list rows).
 * @see TestHomePage HUMAN_FOLD_* / project list rows
 */
export const MD_SHAPE_MEDIUM = 'rounded-none'

/**
 * Test-home / test-project shared radius — matches gallery thumbs (`rounded-[10px]`).
 * Use for media, sheets, and buttons on test surfaces.
 */
export const TEST_RADIUS = 'rounded-[10px]'
export const TEST_RADIUS_PX = 10

/**
 * Homepage project media radius (`rounded-[10px]` on rail thumbs).
 * @see TestHomePage project thumbnail imgs
 */
export const MD_SHAPE_LARGE = TEST_RADIUS

/** Same as media radius for inset sheets / elevated panels */
export const MD_SHAPE_XL = TEST_RADIUS

/** Top app bar height + inset */
export const MD_TOP_APP_BAR = 'h-16 px-4 sm:px-6'

/** Minimum touch target */
export const MD_ICON_BUTTON = 'size-12'

/** Inset sheet — left/right match top (64px / 16dp×4) */
export const MD_SHEET_INSET = 'mx-16 mb-16 mt-16'

/** No Material elevation — homepage relies on flat surfaces */
export const MD_ELEVATION_1 = ''
export const MD_ELEVATION_2 = ''

/**
 * Live homepage surfaces — CSS vars from `index.css`
 * light `#faf7f0` / dark `#111111`
 */
export const MD_SURFACE = 'bg-[var(--color-bg-base,#faf7f0)]'
export const MD_SURFACE_CONTAINER = 'bg-[var(--color-bg-base,#faf7f0)]'
export const MD_SURFACE_CONTAINER_LOW = 'bg-transparent'
export const MD_SURFACE_CONTAINER_HIGH = 'bg-[var(--color-bg-base,#faf7f0)]'

/**
 * On-surface ink — matches TestHomePage (`text-black` / `text-[#f2f2f2]`)
 */
export const MD_INK = 'text-black dark:text-[#f2f2f2]'
export const MD_INK_MUTED = 'text-[color:var(--color-muted,#666666)]'
export const MD_INK_FAINT = 'text-black/50 dark:text-white/50'
export const MD_BORDER =
  'border-black/14 dark:border-white/[0.22]'
/** Homepage fold / list hover */
export const MD_HOVER_SURFACE =
  'hover:bg-black/[0.05] dark:hover:bg-white/[0.07]'
/** Inverted CTA — black on cream / white on charcoal */
export const MD_CTA =
  'bg-black text-white dark:bg-white dark:text-black'

/** Scrim behind modal sheets */
export const MD_SCRIM = 'bg-black/60'

/** Detail sheet: homepage cream/charcoal, sharp corners (test project popups). */
export const MD_DETAIL_SHEET = `rounded-none ${MD_SURFACE}`

/**
 * Test project pages: content max-width 60vw when viewport ≥ 1200px (centered).
 * Shared by `/test-hovr`, `/test-piik-ai`, and sheet detail body.
 */
export const MD_PROJECT_PAGE_MAX =
  'w-full min-[1200px]:mx-auto min-[1200px]:max-w-[60vw]'

/** Expand animation — bottom margin matches top (64px); radius 0 for sharp sheet. */
export const MD_SHEET_EXPAND = {
  marginX: 64,
  marginBottom: 64,
  marginTop: 64,
  radius: 0,
} as const
