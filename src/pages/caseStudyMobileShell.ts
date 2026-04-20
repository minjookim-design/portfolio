/**
 * Desktop home details column shell (`TestHomePage` `detailsColumnRef` `motion.div`, non-framed).
 */
export const HOME_DESKTOP_DETAILS_COLUMN_SHELL_UNFRAMED =
  'relative z-0 hidden min-h-0 min-w-0 max-w-full flex-1 flex-col gap-5 overflow-x-hidden overflow-y-auto md:flex md:h-full md:min-h-full md:max-h-full md:self-stretch md:border-t-[0.5px] md:border-t-black/[0.18] dark:md:border-t-white/[0.14]'

/** Same shell as {@link HOME_DESKTOP_DETAILS_COLUMN_SHELL_UNFRAMED}; merge layout adds `border-l` in `TestHomePage`. */
export const HOME_DESKTOP_DETAILS_COLUMN_SHELL_MERGED =
  'relative z-0 hidden min-h-0 min-w-0 max-w-full flex-1 flex-col gap-5 overflow-x-hidden overflow-y-auto md:flex md:h-full md:min-h-full md:max-h-full md:self-stretch md:border-t-[0.5px] md:border-t-black/[0.18] dark:md:border-t-white/[0.14]'

/**
 * Mobile standalone `/projects/*` inner scroll + home mobile sheet: identical layout to the desktop
 * details column, with `flex` instead of `hidden md:flex` (parent is `md:hidden`).
 */
export const CASE_STUDY_MOBILE_DETAILS_SCROLL_CLASS =
  'relative z-0 flex min-h-0 min-w-0 max-w-full flex-1 flex-col gap-5 overflow-x-hidden overflow-y-auto md:h-full md:min-h-full md:max-h-full md:self-stretch'

/**
 * Column rhythm only (no overflow-y); use when the scroll surface is an ancestor (e.g. JoJo `scrollRef`).
 */
export const CASE_STUDY_MOBILE_DETAILS_COLUMN_CLASS =
  'relative z-0 flex min-h-0 min-w-0 max-w-full flex-1 flex-col gap-5 overflow-x-hidden'
