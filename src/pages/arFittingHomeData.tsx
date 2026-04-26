import arFittingChallengeImg from '../assets/arfittingroom/challenge.png'
import arFittingUt1Img from '../assets/arfittingroom/ut1.png'
import arFittingUt2Img from '../assets/arfittingroom/ut2.png'

/** Hero thumbnails in `public/arfittingroom/`. */
export const AR_FITTING_THUMB_LIGHT = '/arfittingroom/Thumbnail-light.jpg'
export const AR_FITTING_THUMB_DARK = '/arfittingroom/Thumbnail-dark.jpg'

/** Full-page + home (/) third column — same section shape as Piik `PIIK_SECTIONS`. */
export const AR_FITTING_SECTIONS = [
  {
    id: 'overview',
    label: 'Overview',
    heading:
      'An Augmented Reality (AR) mirror device aimed at enhancing the online shopping experience for individuals with mobility challenges.',
    body: 'This solution enables users to virtually try on clothing and accessories from the comfort of their homes, significantly reducing the need for offline store visits.',
    media: '/arfittingroom/overview.png',
  },
  {
    id: 'background',
    label: 'Background',
    heading: '',
    body: "Everything started with my grandfather.\n\nHe loved to be cool and fashionable, so he always enjoyed shopping for clothing until he had mobility issues because of Parkinson's disease.",
    media: '',
  },
  {
    id: 'problem',
    label: 'The Problem',
    heading: '',
    body: "People who have mobility issues have difficulty going shopping offline.\n\nAccording to Fable, 50 percent of individuals with disabilities shop online for physical products once a week. In contrast, only 22 percent of general consumers shop online with the same frequency.\n\nPeople with disabilities have clear criteria for selecting an e-commerce store: accessibility, variety, and price. Accessibility was the most commonly cited factor influencing their choice of one website over another.\n\nAnd before my grandfather passed away, we went shopping, and he struggled due to the lack of accessibility at the mall. However, an even bigger issue was seeing him struggle just to try on clothes multiple times to find the right fit. That experience made me wonder if there could be a way to provide an intuitive online shopping experience—one that doesn’t require traveling to the mall or relying on a small screen for online shopping.",
    media: '/arfittingroom/problem.png',
  },
  {
    id: 'goal',
    label: 'The Goal',
    heading: 'Shopping should be an enjoyable experience for every individual with any condition.',
    body: 'The goal of this project is to enable people with mobility issues to shop for clothes with minimal inconvenience.',
    media: '',
  },
  {
    id: 'solution-sketch',
    label: 'Solution Sketch',
    heading: '',
    body: 'What if users could try on clothes in their own room?\n\nHow can I create an inclusive shopping experience that addresses accessibility challenges, such as finding the right fit without visiting a physical store or trying on clothes multiple times?\n\nA full-body mirror with a built-in camera can provide the best online shopping service.\n\nThis potential solution offers an AR fitting room service, allowing users to try on clothes in the comfort of their own space.\n\nThe AR feature will allow users to try on clothes virtually.\n\nLet\'s imagine a user interested in purchasing clothes. They might select a jacket they like and try it on virtually. However, the user may be uncertain about the fit and have no one to consult. In such situations, the recording and sharing option during the virtual fitting room experience would be helpful for users who need opinions from their family or friends about the fit.',
    media: '',
    /** Insert after body paragraph at this index (0-based). */
    midMediaAfterParagraphIndex: 1,
    midMedia: '/arfittingroom/sketch.png',
    /** Same Bodoni Moda lead style as paragraph 0 (e.g. opening “What if…”). */
    bodyLeadParagraphIndices: [0, 2],
  },
  {
    id: 'challenge',
    label: 'The Challenge',
    heading: '',
    body: "The biggest challenge was measuring the size of a full-length mirror-sized screen.\n\nA full-length mirror differs from typical digital devices due to its significantly larger interface size compared to devices available in the market. Treating design elements intended for smaller devices would result in an interface too large for practical use when implemented at full scale. The solution to this challenge was simply creating a real-size paper wireframe and measuring the correct size of the icons and buttons.",
    media: arFittingChallengeImg,
  },
  {
    id: 'user-testings',
    label: 'User Testings',
    spyLabel: 'User Testings',
    heading: '',
    body: '',
    media: '',
    subSections: [
      {
        heading: 'User testing: accessibility development 1',
        body: "Why is the nav bar on the right? It is hard to tap for me as a left-handed!\n\nThis was a good point. I added the selection option as an initial setting page for choosing the nav bar location.",
        media: arFittingUt1Img,
      },
      {
        heading: 'User testing: accessibility development 2',
        body: "If the menu bar moves horizontally, it should also be able to reposition vertically.\n\nVarious users' conditions might include different heights, people in wheelchairs, or people tired of standing up when using the device. For example, touching the screen when the navigation bar is positioned at the top of the interface can be uncomfortable for a user in a wheelchair. In this case, the solution could be repositioning the menu bar into a long-press button. This flexible menu bar would enable users to swipe and relocate it according to their preferences.",
        media: arFittingUt2Img,
      },
      {
        heading: 'User testing: accessibility development 3',
        body: 'The timer will help users when the users take pictures.\n\nDuring the ideation phase, the need for a recording feature was identified while users have a virtual fitting room experience. Users have to tap a shoot button to take pictures, right? However, since the camera is located at the top of the device, users cannot take a proper picture of their outfit. Considering the size of the mirror, it cannot function like a phone selfie. In this case, the timer can help users take a proper picture of their outfit. Users can take a moment to step back after tapping the shoot button!',
        media: '/arfittingroom/ut3.png',
      },
    ],
  },
  {
    id: 'final-solution',
    label: 'Final Solution',
    heading: '',
    body: '',
    media: '',
    subSections: [
      {
        heading: 'UI concept',
        body: 'Simple and intuitive UI to avoid overwhelming users.\n\nThe smart mirror itself is a new device, which might pose a challenge to users. The inspiration for the design comes from kiosks currently in use, such as those found in shopping malls. These kiosk screens are designed with simple buttons and minimal features, offering users an intuitive experience. Similarly, the goal was to keep the UI as simple and straightforward as possible, ensuring that users feel the device is easy to use rather than overwhelming.',
        media: '/arfittingroom/final2.png',
        mediaAbove: '/arfittingroom/poster.png',
        mediaAboveMarginBottomPx: 100,
      },
      {
        heading: 'Pre-setting stage',
        body: 'Users can customize a screen position before they start experiencing AR Fitting Room.\n\nThe device offers options for preferred hand and height and users can choose them based on their various conditions.',
        media: '/arfittingroom/final3.png',
        mediaBeside: { src: '/arfittingroom/setting.gif', gapPx: 10 },
      },
      {
        heading: "Let's do shopping",
        body: "It's basically a shopping device that feels like browsing a website or mobile app.\n\nJust like on a computer or phone, users can select clothes they want to try on, save items to a wishlist or bag, and even try them using the AR feature by tapping the AR menu on the navigation bar.\n\nAdditionally, users have the flexibility to reposition the navigation bar at any time while shopping by simply long-pressing it. While the menu bar can be preset to a lower position during the initial setup, users who prefer standing while shopping might set it higher. If they suddenly decide to sit down, they can easily readjust the menu bar to a lower position without going back to the settings page.",
        media: '/arfittingroom/final4.png',
        mediaBeside: { src: '/arfittingroom/long%20press%20copy.gif', gapPx: 10 },
      },
      {
        heading: 'Experience AR Fitting Room',
        body: 'Users can virtually try on clothes with the AR feature.\n\nA camera mounted on the mirror recognizes users and utilizes AR technology to display how the selected clothes look on them, directly in the reflection. Users can pose and check the fit of the clothes as if they were actually wearing them.\n\nAdditionally, just like in a video call, users can set virtual backgrounds or apply video filters to see how the outfit might look in different settings, giving them the impression of wearing the clothes while out and about.\n\nThe device also provides a feature to capture these moments as photos, allowing users to share them with friends and family. A timer option lets users step back from the mirror to strike the perfect pose before the photo is taken. Once the picture is captured, options to share image, video, information appear for easy sharing.',
        media: '/arfittingroom/final1.png',
        mediaBeside: { src: '/arfittingroom/timer.gif', gapPx: 10 },
      },
    ],
  },
  {
    id: 'takeaway',
    label: 'Takeaway',
    heading: 'Trying different methods helps in reaching a solution.',
    body: "Throughout this project, I gained crucial insight into the role of precise size measurement in UX/UI design, particularly when applied to everyday products rather than conventional mobile screens. Creating a device like a full-length mirror required consideration of users' height, preferred hand, and gaze direction. I used various methods to find a solution, from physical to digital wireframes. It helped me find pain points while I tested them out. I learned that trying different ways can guide me to the solution effectively.",
    media: '',
  },
]

export type ArFittingSection = (typeof AR_FITTING_SECTIONS)[number]

function arHomeSpyBodySnippet(body: string): string {
  return body.slice(0, 160) + (body.length > 160 ? '…' : '')
}

/** Home folder spy (middle column): one label per section, never subsection titles. */
export const AR_FITTING_HOME_SPY_LABELS: Record<string, string> = {
  overview: 'Overview',
  background: 'Background',
  problem: 'The Problem',
  goal: 'The Goal',
  'solution-sketch': 'Solution Sketch',
  challenge: 'The Challenge',
  'user-testings': 'User Testings',
  'final-solution': 'Final Solution',
  takeaway: 'Takeaway',
}

function arHomeSpyLeadSubBody(s: ArFittingSection): string {
  if (
    (s.id === 'final-solution' || s.id === 'user-testings') &&
    'subSections' in s &&
    Array.isArray(s.subSections) &&
    s.subSections[0]
  ) {
    const lead = s.subSections[0] as { body?: string }
    if (typeof lead.body === 'string') return lead.body
  }
  return typeof s.body === 'string' ? s.body : ''
}

/** Labels and ids for the project-folder scroll spy on home (one entry per `AR_FITTING_SECTIONS` row). */
export function getArFittingHomeSpyItems(): { id: string; label: string; body: string }[] {
  return AR_FITTING_SECTIONS.map((s) => ({
    id: s.id,
    label: AR_FITTING_HOME_SPY_LABELS[s.id] ?? ('spyLabel' in s && s.spyLabel != null ? String(s.spyLabel) : s.label),
    body: arHomeSpyBodySnippet(arHomeSpyLeadSubBody(s)),
  }))
}

export const AR_FITTING_HOME_SPY_FIRST_ID = getArFittingHomeSpyItems()[0]?.id ?? 'overview'

export const AR_FITTING_META_ROWS = [
  {
    label: 'Team / Role',
    value: 'Solo Project\u00a0\u00a0·\u00a0\u00a0Product Designer',
  },
  {
    label: 'Problem',
    value:
      'Addressed the physical barriers of traditional fitting rooms and "fit uncertainty" in online shopping, focusing on improving accessibility for users with limited mobility or time constraints.',
  },
  {
    label: 'Solution',
    value:
      'Designed an inclusive, AR-powered interface that allows users to virtually wear 3D garments on their real-time body data, eliminating the need for physical exertion.',
  },
  {
    label: 'Impact',
    value:
      'Successfully validated the business and social value by increasing purchase confidence, earning the RGD Student Award 2024 — Honourable Mention, Accessible Design · Indigo Design Award 2024 — Bronze, UX / Interface & Navigation for its innovative and accessible design.',
  },
]
