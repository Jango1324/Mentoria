import type { DNAType, LearningDNA, Opportunity, Course } from '@/types'

// ─── Quiz ────────────────────────────────────────────────────────────────────

export interface QuizOption {
  text: string
  scores: Partial<Record<DNAType, number>>
}

export interface QuizQuestion {
  id: number
  text: string
  options: QuizOption[]
}

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    text: "When you have free time, you're most likely to:",
    options: [
      { text: 'Read about something completely new to you', scores: { Explorer: 2 } },
      { text: 'Start building something — code, design, or a prototype', scores: { Builder: 2 } },
      { text: 'Take a mock test or work toward a measurable goal', scores: { Competitor: 2 } },
      { text: 'Go deep on one topic until you truly understand it', scores: { Researcher: 2 } },
    ],
  },
  {
    id: 2,
    text: 'Which outcome excites you most after a year of hard work?',
    options: [
      { text: 'A structured plan that executed exactly as intended', scores: { Strategist: 2 } },
      { text: 'Something original that didn\'t exist before you made it', scores: { Creator: 2 } },
      { text: 'A major award, scholarship, or ranking', scores: { Competitor: 2 } },
      { text: 'Deep, rigorous expertise in a field', scores: { Researcher: 2 } },
    ],
  },
  {
    id: 3,
    text: "You're starting a big project. Your first instinct is to:",
    options: [
      { text: 'Research broadly and follow whatever threads look interesting', scores: { Explorer: 2 } },
      { text: 'Build a rough version immediately and iterate from there', scores: { Builder: 2 } },
      { text: 'Map out a detailed plan before touching anything', scores: { Strategist: 2 } },
      { text: 'Find the most original angle nobody has tried before', scores: { Creator: 2 } },
    ],
  },
  {
    id: 4,
    text: 'Which type of challenge do you find most satisfying?',
    options: [
      { text: 'Ranked competitions with clear winners', scores: { Competitor: 2 } },
      { text: 'Open-ended research problems with no single answer', scores: { Researcher: 2 } },
      { text: 'Long-term projects requiring sustained planning', scores: { Strategist: 2 } },
      { text: 'Creative briefs where you define the rules', scores: { Creator: 2 } },
    ],
  },
  {
    id: 5,
    text: 'A mentor gives you three months to pursue anything. You:',
    options: [
      { text: 'Explore several different fields and see what connects them', scores: { Explorer: 2 } },
      { text: 'Build something real — an app, a product, a tool', scores: { Builder: 2 } },
      { text: 'Enter every relevant competition and aim to place top three', scores: { Competitor: 2 } },
      { text: 'Master one subject at a near-expert level', scores: { Researcher: 2 } },
    ],
  },
  {
    id: 6,
    text: 'How do you prefer to learn new things?',
    options: [
      { text: 'Design a learning roadmap and follow it systematically', scores: { Strategist: 2 } },
      { text: 'Invent your own method — one others haven\'t tried', scores: { Creator: 2 } },
      { text: 'Wander — following links, books, and unexpected tangents', scores: { Explorer: 2 } },
      { text: 'Do — trial, error, and building things by hand', scores: { Builder: 2 } },
    ],
  },
  {
    id: 7,
    text: 'When a project hits a wall, you:',
    options: [
      { text: 'Find the bottleneck and attack it with full intensity', scores: { Competitor: 2 } },
      { text: 'Revisit your assumptions from first principles', scores: { Researcher: 2 } },
      { text: 'Restructure the plan and adjust the strategy', scores: { Strategist: 2 } },
      { text: 'Throw out the current approach and reimagine it completely', scores: { Creator: 2 } },
    ],
  },
  {
    id: 8,
    text: 'The work that makes you lose track of time looks like:',
    options: [
      { text: 'Discovering unexpected connections across different fields', scores: { Explorer: 2 } },
      { text: 'Making something tangible that actually works', scores: { Builder: 2 } },
      { text: 'Executing a well-laid plan and watching it come together', scores: { Strategist: 2 } },
      { text: 'Expressing an idea in a way nobody has quite done before', scores: { Creator: 2 } },
    ],
  },
  {
    id: 9,
    text: 'Which of these frustrates you most?',
    options: [
      { text: 'Being forced to specialize before you\'ve explored enough', scores: { Explorer: 2 } },
      { text: 'Spending time planning without actually building anything', scores: { Builder: 2 } },
      { text: 'No clear way to measure your progress against others', scores: { Competitor: 2 } },
      { text: 'Shallow explanations that skip the hard parts', scores: { Researcher: 2 } },
    ],
  },
  {
    id: 10,
    text: "You're dropped into a topic you know nothing about. You:",
    options: [
      { text: 'Build a plan: what to learn first, what to learn next', scores: { Strategist: 2 } },
      { text: 'Create something with it immediately to see what\'s possible', scores: { Creator: 2 } },
      { text: 'Find the hardest challenge on the topic and attempt it cold', scores: { Competitor: 2 } },
      { text: 'Find the definitive textbook and read it cover to cover', scores: { Researcher: 2 } },
    ],
  },
  {
    id: 11,
    text: "You're deciding what to work on next. You choose:",
    options: [
      { text: "Whatever you're most curious about right now", scores: { Explorer: 2 } },
      { text: 'Whatever lets you build something new', scores: { Builder: 2 } },
      { text: 'Whatever fits your long-term strategic plan', scores: { Strategist: 2 } },
      { text: 'Whatever feels most original and unexplored', scores: { Creator: 2 } },
    ],
  },
  {
    id: 12,
    text: 'In five years, what would make you feel most proud?',
    options: [
      { text: 'Having competed at the highest level and placed', scores: { Competitor: 2 } },
      { text: 'Having contributed something new to a field', scores: { Researcher: 2 } },
      { text: 'Having built something widely used by others', scores: { Builder: 2 } },
      { text: 'Having explored broadly and found exactly what you want', scores: { Explorer: 2 } },
    ],
  },
  {
    id: 13,
    text: 'When you explain something to someone else, you naturally:',
    options: [
      { text: 'Structure it into a clear framework or model', scores: { Strategist: 2 } },
      { text: 'Use an unexpected metaphor that surprises them', scores: { Creator: 2 } },
      { text: 'Turn it into a challenge for them to figure out', scores: { Competitor: 2 } },
      { text: 'Walk through it step by step from first principles', scores: { Researcher: 2 } },
    ],
  },
]

// ─── Scoring ─────────────────────────────────────────────────────────────────

export const EMPTY_SCORES: Record<DNAType, number> = {
  Explorer: 0,
  Builder: 0,
  Competitor: 0,
  Researcher: 0,
  Strategist: 0,
  Creator: 0,
}

// answers is { [questionId]: optionIndex }. Returns the top-scoring type and the full score map.
export function calculateDNAType(
  answers: Record<number, number>
): { dnaType: DNAType; breakdown: Record<DNAType, number> } {
  const breakdown = { ...EMPTY_SCORES }

  for (const [questionId, optionIndex] of Object.entries(answers)) {
    const question = QUIZ_QUESTIONS.find((q) => q.id === Number(questionId))
    if (!question) continue
    const option = question.options[optionIndex]
    if (!option) continue
    for (const [type, points] of Object.entries(option.scores)) {
      breakdown[type as DNAType] += points
    }
  }

  const dnaType = (Object.entries(breakdown).sort(([, a], [, b]) => b - a)[0][0]) as DNAType
  return { dnaType, breakdown }
}

// ─── DNA Type Profiles ────────────────────────────────────────────────────────

export interface DNAProfile {
  type: DNAType
  label: string
  description: string
  strengths: string[]
  weaknesses: string[]
  color: string
  opportunityCategories: string[]
  courseCategories: string[]
}

export const DNA_PROFILES: Record<DNAType, DNAProfile> = {
  Explorer: {
    type: 'Explorer',
    label: 'Explorer',
    description:
      'You learn through breadth. You follow curiosity across disciplines, connect ideas others miss, and thrive when given the freedom to wander. Your superpower is synthesis — seeing patterns across unrelated fields.',
    strengths: ['Cross-disciplinary thinking', 'Adaptability', 'Pattern recognition', 'Intellectual range'],
    weaknesses: ['Depth over breadth tension', 'Difficulty committing to one path', 'Risk of staying surface-level'],
    color: '#0f6b4a',
    opportunityCategories: ['STEM', 'Research', 'Olympiad'],
    courseCategories: ['STEM', 'Research'],
  },
  Builder: {
    type: 'Builder',
    label: 'Builder',
    description:
      'You learn by making. Concepts only become real when you can apply them to something tangible. You ship early, iterate fast, and measure success by what exists at the end. Theory is only worth what you can build with it.',
    strengths: ['Practical execution', 'Iteration speed', 'Technical problem-solving', 'Shipping under pressure'],
    weaknesses: ['Undervaluing theory', 'Impatience with planning', 'Skipping documentation'],
    color: '#7c3aed',
    opportunityCategories: ['STEM', 'Programming'],
    courseCategories: ['Programming', 'STEM'],
  },
  Competitor: {
    type: 'Competitor',
    label: 'Competitor',
    description:
      'You perform best with stakes. Rankings, deadlines, and measurable outcomes sharpen your focus. You set ambitious goals and hold yourself to them. Competition is not pressure for you — it is fuel.',
    strengths: ['Goal orientation', 'Resilience under pressure', 'Consistency', 'High standards'],
    weaknesses: ['Burnout risk', 'Comparison trap', 'Difficulty with open-ended work'],
    color: '#b45309',
    opportunityCategories: ['Olympiad', 'Scholarship', 'SAT', 'IELTS', 'University'],
    courseCategories: ['SAT', 'IELTS', 'University'],
  },
  Researcher: {
    type: 'Researcher',
    label: 'Researcher',
    description:
      'You learn through depth. Shallow explanations frustrate you. You want to understand not just what is true, but why — and then verify it. Your rigour sets you apart; your patience is a competitive advantage.',
    strengths: ['Deep expertise', 'Analytical rigour', 'Evidence-based reasoning', 'Intellectual patience'],
    weaknesses: ['Analysis paralysis', 'Slower output pace', 'Difficulty with ambiguity'],
    color: '#0369a1',
    opportunityCategories: ['Research', 'STEM', 'University'],
    courseCategories: ['Research', 'STEM'],
  },
  Strategist: {
    type: 'Strategist',
    label: 'Strategist',
    description:
      'You learn through planning. You see the whole board before making a move. Systems, frameworks, and long-term thinking are your native language. You are most effective when working toward a clearly defined vision.',
    strengths: ['Systems thinking', 'Long-term planning', 'Prioritisation', 'Efficient execution'],
    weaknesses: ['Over-planning', 'Rigidity when plans break', 'Difficulty with spontaneity'],
    color: '#6d28d9',
    opportunityCategories: ['Business', 'University', 'SAT', 'IELTS'],
    courseCategories: ['Business', 'University'],
  },
  Creator: {
    type: 'Creator',
    label: 'Creator',
    description:
      'You learn through originality. Existing frameworks are starting points, not destinations. You ask "what if it worked differently?" before accepting how things are. Your best work comes from inventing your own approach.',
    strengths: ['Original thinking', 'Creative problem-solving', 'Aesthetic sensibility', 'Unconventional perspective'],
    weaknesses: ['Resistance to structure', 'Inconsistent output', 'Difficulty with routine tasks'],
    color: '#be185d',
    opportunityCategories: ['Business', 'Research'],
    courseCategories: ['Business', 'Research'],
  },
}

// ─── Recommendations ─────────────────────────────────────────────────────────

export function getDNARecommendedOpportunities(
  dna: LearningDNA,
  opportunities: Opportunity[]
): Opportunity[] {
  const profile = DNA_PROFILES[dna.dna_type as DNAType]
  if (!profile) return []
  return opportunities.filter(
    (opp) =>
      opp.is_active &&
      (profile.opportunityCategories.includes(opp.category) ||
        opp.tags.some((t) => profile.opportunityCategories.includes(t)))
  )
}

export function getDNARecommendedCourses(
  dna: LearningDNA,
  courses: Course[]
): Course[] {
  const profile = DNA_PROFILES[dna.dna_type as DNAType]
  if (!profile) return []
  return courses.filter(
    (course) =>
      course.is_published && profile.courseCategories.includes(course.category)
  )
}
