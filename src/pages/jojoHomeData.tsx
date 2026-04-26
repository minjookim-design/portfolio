import React from 'react'

/** JoJo hero thumbnails in `public/jojo/`. */
export const JOJO_HERO_THUMB_LIGHT = '/jojo/Thumbnail-light.jpg'
export const JOJO_HERO_THUMB_DARK = '/jojo/Thumbnail-dark.jpg'

/** Home (/) JoJo third column — same section shape as Piik `PIIK_SECTIONS`. */
/** Same shape as Piik `PIIK_META_ROWS` — home + full JoJo project hero. */
export const JOJO_META_ROWS: { label: string; value: React.ReactNode }[] = [
  {
    label: 'Team / Role',
    value: 'Solo Project\u00a0\u00a0·\u00a0\u00a0Product Designer',
  },
  {
    label: 'Problem',
    value:
      'Users face difficulty maintaining cognitive focus and sustained engagement in digital environments. Furthermore, because cognitive thinking and engagement are abstract concepts, it is challenging for users to gauge their actual progress or improvement.',
  },
  {
    label: 'Solution',
    value:
      'An AI companion featuring an "Activeness Mode" that proactively stimulates deeper thought without requiring user prompts. This is paired with an intuitive reporting system that translates abstract cognitive thinking and engagement levels into clear, measurable visual data.',
  },
  {
    label: 'Potential Impact',
    value:
      'Validated through user research, with a majority of participants confirming the system would effectively help them maintain focus and expressing strong intent to actively engage with the personalized progress reports.',
  },
]

export const JOJO_SECTIONS = [
  {
    id: 'overview',
    label: 'Overview',
    heading: (
      <>
        Think Beyond <span style={{ color: '#FF7262' }}>AI</span>
      </>
    ),
    body:
      'Jojo is a personalized AI companion designed to encourage active thinking, improve focus, and help users regain balance in their digital lives. Unlike traditional AI tools that passively provide solutions, Jojo creates an engaging and interactive experience by integrating human-like interaction features and fostering critical thinking.',
    media: '',
  },
  {
    id: 'research',
    label: 'Research',
    spyLabel: 'Research',
    heading: <span className="case-study-emphasis-red">Research Question</span>,
    body:
      'How can conversational AI be designed as a complementary tool to engage critical thinking and address cognitive accessibility challenges for adults aged 18 to 35, reducing the effects of over-reliance on digital technology?\n\nAs someone who grew up immersed in digital technology, I often feel that it has negatively impacted our generation\'s cognitive abilities. This project aims to explore whether there is a correlation between digital technology and cognitive challenges and to investigate how conversational AI can be leveraged to address these issues.',
    media: '',
    postContent: [
      {
        heading: 'Why conversational AI specifically?',
        body:
          'Over the past two years, AI has revolutionized the tech industry and become an integral part of daily life. Efforts to implement AI in the existing products are increasing rapidly, and I\'ve noticed both myself and those around me frequently relying on AI tools. Since the use of digital technology is inevitable, I want to explore ways to optimize its implementation, ensuring it serves as a solution rather than exacerbating existing problems.\n\nThis project is dedicated to answering this research question and finding ways to design conversational AI that supports critical thinking and cognitive health.',
      },
      {
        heading: <span className="case-study-emphasis-red">Research Findings</span>,
        body:
          'Does digital technology truly cause cognitive issues, or is it merely a delusion?\n\nThe answer is yes, it does cause cognitive issues.',
        media: '/jojo/research1.png',
      },
      {
        body:
          'So what do we do when we can\'t focus?\n\nMaybe it\'s not the online environment itself that\'s the problem—it\'s how we\'re using it. What if we approached it differently?\n\nPassive listening or just making prompts isn\'t enough. The key is to engage actively. Talk, chat, participate—make it interactive. When you treat the online environment like a physical one and actively join in, it can actually work just as well.',
        media: '/jojo/research2.png',
      },
      {
        body:
          'And AI, a new digital technology, isn\'t actually all that bad!\n\nThe key isn\'t to avoid AI but to use it actively and in a balanced way, making technology a powerful ally rather than a threat.',
        media: '/jojo/research3.png',
      },
      {
        body:
          'Then which one is better Speech-based or text-based AI?\n\nWell… both! Each has its own strengths.',
        media: '/jojo/research5.png',
      },
      {
        body:
          'Alright, let\'s dive into what people really think about interacting with AI!\n\nMany find talking to GPT kind of boring.',
        media: '/jojo/research4.png',
      },
      {
        heading: '',
        body:
          'So... you\'re addressing a problem caused by digital technology using more digital technology?\n\nIsn\'t This a Paradox?\n\nThere\'s definitely a risk of worsening the problem by relying on the same digital technology that contributed to it.\n\nHowever,\n\nOver half of the interview participants reported experiencing cognitive issues and stated that they use AI to address these challenges.\n\nFive out of seven participants who noticed changes in their cognitive functions mentioned relying on AI tools like ChatGPT, Copilot, and Perplexity to stay focused. These tools have become essential for managing their daily lives, whether for work or study. People are already turning to digital technology, through AI, to solve the problems it has created.',
        redParagraphIndices: [1, 3],
      },
    ],
  },
  {
    id: 'the-goal',
    label: 'The Goal',
    heading: '',
    body:
      'Since coexistence with digital technology is inevitable, my goal is to identify ways to use it effectively and responsibly, avoiding a harmful cycle of dependency.',
    media: '',
  },
  {
    id: 'design',
    label: 'Design',
    spyLabel: 'Target User',
    heading: '',
    body:
      'The primary target users are young adults who want to use AI tools in a smart and sustainable way, but are concerned about becoming too dependent on them.',
    media: '',
  },
  {
    id: 'user-interview',
    label: 'User Interview',
    spyLabel: 'User Interview',
    heading: '',
    body: '',
    media: '',
    postContent: [
      {
        heading: 'Common painpoints',
        body:
          'Participants highlighted concerns about over-reliance on AI, as instant answers often diminish opportunities for critical thinking. They emphasized the need for AI tools to strike a balance between convenience and engagement by supporting focus and offering guided solutions.\n\nOver-Reliance, Distractions, and Vicious Cycle\n\nParticipants expressed concerns that instant answers from AI tools often reduced their opportunities to think critically.',
        media: '/jojo/user interview.jpg',
      },
      {
        body:
          'Some found it challenging to stay focused when accessing AI tools via laptops, often ending up distracted by social media.\nFeatures like automated meeting notes made participants less focused during meetings, leading to greater reliance on AI.',
      },
    ],
  },
  {
    id: 'problems',
    label: 'Problems',
    heading: '',
    body: '',
    media: '',
    subSections: [
      {
        heading: (
          <>
            <span className="case-study-emphasis-red">Problem 1</span>
          </>
        ),
        body:
          'Difficulty maintaining cognitive focus and sustained engagement in digital environments.\n\nCognitive challenges caused by digital technology are real, and many people rely on AI tools to help them stay focused and manage their tasks.',
        media: '',
      },
      {
        heading: <>Solution 1-1 (cognitive thinking decline)</>,
        subheading: 'Activeness Mode: stimulate deeper thought and active engagement without user prompts.',
        body:
          'A Background-Working Web App That Monitors User Activity\n\nJoJo runs in the background, using screen activity tracking, face recognition, and eye tracking to analyze user focus, confusion, or hesitation. Based on this data, JoJo proactively initiates thought-provoking questions tailored to the user\'s context, encouraging them to think critically rather than simply absorb information.\n\nQuestion Prompts Instead of Direct Answers\n\nJoJo runs in the background, using screen activity tracking, face recognition, and eye tracking to analyze user focus, confusion, or hesitation. Based on this data, JoJo proactively initiates thought-provoking questions tailored to the user\'s context, encouraging them to think critically rather than simply absorb information.',
        media: '',
      },
      {
        heading: <>Solution 1-2 (decreased engagement)</>,
        body:
          'An AI character that can express emotions through facial expressions based on the conversation flow.\n\nThe character\'s expressions help users stay focused and emotionally connected to the topic. Over time, the character learns from the user\'s expressions and gradually begins to mirror them, creating a more personal and empathetic interaction.',
        media: '',
      },
      {
        heading: (
          <>
            <span className="case-study-emphasis-red">Problem 2</span>
          </>
        ),
        body:
          'Cognitive thinking and engagement are abstract, which makes it hard for users to gauge their progress or improvement.\n\nCognitive challenges caused by digital technology are real, and many people rely on AI tools to help them stay focused and manage their tasks.',
        media: '',
      },
      {
        heading: <>Solution 2</>,
        body:
          'An intuitive reporting system that measures both cognitive thinking and engagement levels\n\nThe report translates complex data into clear, visual scores. Based on these insights, JoJo provides personalized feedback and motivational encouragement, helping users reflect on their behaviour, track their progress, and feel supported in their journey.',
        media: '',
      },
    ],
  },
  {
    id: 'prototypes',
    label: 'Prototypes',
    spyLabel: 'Prototype 1 & 2',
    heading: 'Prototype 1: AI Character',
    body:
      'The main reason of making a character is for enhancing interaction between AI with users. JoJo should adopt and make its own facial expression when it interacts with users, so I made various options for face animation for JoJo.',
    media: '/jojo/jojo.png',
    carousel: ['/jojo/1.png', '/jojo/2.png', '/jojo/3.png', '/jojo/4.png', '/jojo/5.png', '/jojo/6.png'],
    postContent: [
      {
        heading: 'Prototype 2: Web UI',
        body:
          'One key consideration I kept in mind while designing the UI was that JoJo is a background-working web app. That meant I had to carefully think about where the JoJo character should be positioned on the screen without disrupting the user\'s workflow.',
        media: '/jojo/webui.png',
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
        heading: (
          <>
            <span className="case-study-emphasis-red">Activeness mode + AI Character</span>
            {': JoJo offers thought-provoking questions or prompts based on what\'s on your screen'}
          </>
        ),
        headingMedia: '/jojo/presentation-background1.mp4',
        body: '',
        media: '',
      },
      {
        subsectionKey: 'final-solution-voice-flow',
        postContent: [
          {
            heading:
              'Users can start a discussion using their voice by simply clicking the JoJo icon in the background menu bar.',
            body:
              'There\'s no need to open the full app. Just speak directly about what\'s on the screen. All conversations are transcribed and automatically saved in a dedicated folder.',
          },
          {
            heading:
              'Of course, users can also engage in voice conversations within the regular chat window.',
            body: '',
          },
          {
            heading:
              'If Activeness Mode is turned on, even in a regular chat window, JoJo will ask questions to encourage deeper thinking instead of providing direct answers.',
            body: '',
          },
        ],
        carousel: [
          '/jojo/presentation-background2.mp4',
          '/jojo/speaking.mp4',
          '/jojo/presentation-background3.mp4',
        ],
      },
      {
        heading: (
          <>
            <span className="case-study-emphasis-red">Report</span>
            {
              ': JoJo\'s report is designed to help you build better habits with technology by tracking how you think, focus, and interact throughout your day.'
            }
          </>
        ),
        body:
          'Each circle represents a day\'s data.\nWhen you hover over a circle, you can see detailed data for that day on the right side. The red-filled circle highlights today\'s data.\n\nJoJo compares your current scores with your personal goals.\n\n• Your progress over time (daily, weekly, monthly)\n\n• Goal achievement rate\n\n• Specific recommendations on how to improve',
        bodyStyle: { fontFamily: 'Arial, sans-serif' },
        media: '',
      },
    ],
  },
  {
    id: 'takeaway',
    label: 'Takeaway',
    heading: 'SHIFT Grad Show 2025',
    body:
      'I also made a JoJo poster!\nFeatured at the SHIFT Grad Show 2025\n\n© 2025\ncontact@kimminjoo.com',
    media: '',
  },
]
