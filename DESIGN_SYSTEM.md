# Portfolio design system — source of truth

This document describes how the Minjoo Kim portfolio is structured today. Use it when adding projects, pages, or AI-assisted refactors so layout, motion, and content stay consistent.

**Stack:** Vite, React 19, React Router, Framer Motion, Tailwind CSS. There is **no** Next.js (`next/image` does not apply).

---

## 1. Responsive architecture

### Breakpoint contract

- **Mobile:** viewport width **≤ 768px** (aligned with Tailwind `max-md` / `useIsNarrow(768)` / `MOBILE_THEME_QUERY` in `PageThemeContext`).
- **Desktop / split layout:** width **≥ 768px** (Tailwind `md:`). Home uses a **resizable** three-column shell when `!useIsNarrow(767)` (`isSplitDesktop`).

### Desktop (Home): three columns

1. **Column 1 — Intro / bio**  
   Resizable width (`colWidths.c1`, min width enforced). Scrolls with the shell on desktop; typography uses Instrument Serif + mono accents per existing patterns.

2. **Column 2 — Project rail / “folder” UI**  
   Project list, HOVR-style sub-navigation when unfolded, and spy links into the third column. Width is the middle pane of the split.

3. **Column 3 — Case study body**  
   Scrollable content: `HomeHovrCaseStudy`, `HomePiikCaseStudy`, `HomeArFittingCaseStudy`, `HomeJojoCaseStudy` (same components as full case-study pages where applicable). Uses `CaseStudyRailTitle` + body copy with a **rail label** column and **content** column (gap from `useCaseStudyHomeRailGap` / `caseStudyHomeRailGapPx`).

Implementation anchor: `HomePage.tsx` — outer `grid` becomes `md:flex md:flex-row` with column width styles and draggable dividers.

### Mobile (Home): single column

- Same route (`/`) stacks as **`grid-cols-1`** with vertical scroll (`max-md:overflow-y-auto` on the scroll container).
- Intro, project chooser, and case study content follow in one flow (no sticky intro split like desktop).
- **Mobile project overlay:** `HomeMobileProjectContext` can open a full-screen project detail on home; **back** closes overlay (`MobileProjectBackButton`).

### Mobile-only project routes & desktop redirect

- Standalone case studies live under **`/projects/hovr`**, **`/projects/piik`**, **`/projects/jojo`**, **`/projects/ar-fitting-room`**, **`/projects/bmad`**.
- **`useRedirectHomeWhenDesktop`** (`src/hooks/useRedirectHomeWhenDesktop.ts`): if `window.innerWidth > 768` (default `MOBILE_ONLY_MAX_WIDTH_PX`), **`navigate('/', { replace: true })`** on mount and on **every resize** (no debounce).
- **`MobileOnlyCaseStudyRoute`** in `App.tsx` wraps those routes with **`blockChildMountOnDesktop: true`** so heavy case-study trees do not mount before redirect on desktop.

**Rule for new projects:** if a route should only exist for small viewports, wrap it the same way and keep the 768px contract in sync with `MOBILE_ONLY_MAX_WIDTH_PX`.

---

## 2. UI / UX standards

### Spacing

- **Horizontal shell padding:** Home (and the main fixed shell) uses **`px-4` (16px)** on the outer column, with safe-area-aware **`pt` / `pb`** (see `HomePage` root `className`).
- **Mobile quick nav / back:** **`left-4` / `right-4`** (16px) from edges; FAB sits above **`safe-area-inset-bottom`** with **`bottom-[max(1rem, …)]`**.
- Prefer **16px** as the default edge inset for new mobile chrome unless a design explicitly diverges.

### Borders & section chrome

- Case study sections use **typographic rails** (`CaseStudyRailTitle`) rather than heavy boxed cards.
- Intro column uses **`md:border-0`** where borders would separate layout on larger breakpoints; the product intent is **minimal chrome** — no loud section borders on mobile, and desktop stays **clean / borderless by default** for the main content rail pattern.
- Floating controls use **subtle borders** (`border-white/20`, `border-black/10`) on **glass** backgrounds (`backdrop-blur`, semi-transparent fills).

### Navigation

| Surface | Behavior |
|--------|-----------|
| **Desktop** | `PillNav` + `ThemeToggle` (see `App.tsx` / `PillNav.tsx`); not the focus of mobile patterns. |
| **Mobile bottom FAB** | **`MobileQuickNav`** (`md:hidden`): fixed **bottom-right**, folder icon opens a menu. Each item = **folder icon + label** (mono ~13px semibold). Routes: HOVR, Piik, AR Fitting Room (**JoJo is not in this menu** today — add explicitly if required). |
| **Mobile back** | **`MobileProjectBackButton`** (`md:hidden`): fixed **`left-4`**, top with safe-area. On **`/projects/*`** → “Back to Home” → `/`. On home with project overlay open → “Back” → closes overlay. |

---

## 3. Animations & transitions

### Home menu sequence (desktop, full motion)

Phases (`HomeMenuSeqPhase` in `HomePage.tsx`):  
**`idle_before_intro` → `snap` → `unfold` → `reveal` → `done`**

1. After intro completes, menu enters **`snap`** (staggered “snap into place” feel).
2. **`unfold`**: HOVR folder / rail expands (last spy item triggers timed transition to **`reveal`**).
3. **`reveal`**: hero entrance on the active case study; **`onHeroEntranceComplete`** moves to **`done`**.
4. **Fallback:** if hero completion never fires, a **timeout** forces **`done`** so downstream UI (e.g. split onboarding) is not stuck.

Respect **`usePrefersReducedMotion`**: reduced motion short-circuits to a simpler / immediate state.

### Split column onboarding (desktop only)

**`useHomeSplitColumnGuide`** + `HomeSplitOnboarding.tsx` (not shown on mobile or when reduced motion).

- **Sequence:** `fadeBars` → **`pulse1` (single breath)** → `tooltip` → `exit` → `done`.
- **Pulse:** one smooth **0 → peak → 0** glow on the divider (Framer **cubic-bezier(0.42, 0, 0.58, 1)**), duration **`PULSE_DURATION_S` (0.4s)**.
- **Light mode:** bar **`#FFFFFF`**, glow peak white (~0.88 alpha).
- **Dark mode:** **subtle** bar / glow (**~0.27 / ~0.14** alpha on white) — “ghost line,” not a loud flash.
- **Tooltip:** portal to `document.body`, high z-index; session key `HOME_SPLIT_ONBOARDING_SESSION_KEY` (dev may bypass session for testing).

---

## 4. Image & performance policy

All page-level images should go through **`OptimizedImage`** (`src/components/OptimizedImage.tsx`), not raw `<img>` (except inside that component).

| Policy | Detail |
|--------|--------|
| **Quality target** | Default **88** — documentary for exports (near-lossless *feel*; Vite does not re-encode at runtime). |
| **Loading** | Default **`lazy`** + **`decoding="async"`**; **`priority`** → **`eager`** + **`fetchPriority="high"`** for LCP (heroes, first carousel slide, first project card image, etc.). |
| **Placeholder** | Default **blur** (short CSS blur + tint); use **`placeholder="empty"`** where blur conflicts (e.g. crossfades, lightbox). |
| **`sizes`** | Use presets from **`IMAGE_SIZES`** or page-specific strings so layout stays honest for future `srcSet`. |
| **Modern formats** | Optional **`.webp` / `.avif`** siblings in `public/`; run **`npm run catalog:images`** or **`npm run build`** (`prebuild` runs the catalog). `<picture>` is emitted only when the JSON catalog lists variants (avif → webp → fallback `src`). |
| **Fit** | Prefer Tailwind **`object-cover` / `object-contain`** on media blocks; lightbox uses **contain** with max viewport bounds. |

Videos (`.mp4`) use `<video>` with **`muted`**, **`playsInline`**, loop where appropriate — not `OptimizedImage`.

---

## 5. Content guidelines

### Case study hero meta: Problem / Solution / Impact

Established pattern in **`HOVR_META_ROWS`** (`HovrProjectPage.tsx`) and mirrored in Piik meta rows:

1. **Problem** — user / business pain, concrete and concise.  
2. **Solution** — what you designed or shipped (can include inline emphasis).  
3. **Impact** — measurable or qualitative outcome (percentages, pipeline speed, etc.).

When adding a project, add parallel **`META_ROWS`** (or equivalent) and keep **labels** consistent: **“Problem”**, **“Solution”**, **“Impact”** (Piik uses plural **“Problems”** for a multi-issue section — follow the same file’s structure).

### Accessibility

- AR Fitting Room and related copy explicitly call out **accessibility** / inclusive design where true (e.g. meta lines: “Accessibility Design”).
- Prefer **semantic headings**, **aria-labels** on icon-only controls, and **keyboard** support (e.g. Escape closes `MobileQuickNav` overlay).
- Respect **reduced motion** for all decorative or sequential entrance animations.

### Footer attribution (canonical string)

The typewriter line in the footer should read:

> **Designed by me, Coded by Claude & Cursor (connected to figma mcp)**

Implement as the single source string in **`App.tsx`** (`FOOTER_ATTRIBUTION`) so it stays in sync with this document.

---

## 6. Quick file map for LLMs

| Concern | Primary files |
|--------|----------------|
| Routes, mobile-only guard, footer string | `src/App.tsx` |
| Desktop redirect | `src/hooks/useRedirectHomeWhenDesktop.ts` |
| Home layout & menu phases | `src/pages/HomePage.tsx` |
| Split onboarding | `src/components/HomeSplitOnboarding.tsx` |
| Images | `src/components/OptimizedImage.tsx`, `scripts/catalog-image-variants.mjs`, `src/generated/imageFormatVariants.json` |
| Mobile nav & back | `src/components/MobileQuickNav.tsx`, `src/components/MobileProjectBackButton.tsx` |
| Theme / mobile query constant | `src/context/PageThemeContext.tsx` |
| HOVR content + meta template | `src/pages/HovrProjectPage.tsx` |
| Piik / AR / JoJo home embeds | `PiikProjectPage.tsx`, `ArFittingProjectPage.tsx`, `JojoProjectPage.tsx` |

---

*Last aligned with repository behavior: design-system doc authored for AI + human maintainers. Update this file when breakpoints, phases, or attribution copy change.*
