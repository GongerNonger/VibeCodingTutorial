export interface StartupInput {
  name: string;
  industry: string;
  problem: string;
  solution: string;
  targetMarket: string;
  businessModel: string;
  traction: string;
  team: string;
  fundingAsk: string;
}

export interface Slide {
  title: string;
  bullets: string[];
  talkingPoints: string[];
  suggestedVisuals: string[];
}

export interface Deck {
  id: string;
  startupName: string;
  style: DeckStyle;
  slides: Slide[];
  createdAt: string;
}

export type DeckStyle = 'yc-style' | 'classic' | 'storytelling';

const STYLE_CONFIGS: Record<DeckStyle, { tone: string; emphasis: string }> = {
  'yc-style': {
    tone: 'concise and data-driven',
    emphasis: 'metrics and traction',
  },
  classic: {
    tone: 'professional and thorough',
    emphasis: 'market opportunity and business fundamentals',
  },
  storytelling: {
    tone: 'narrative and emotionally compelling',
    emphasis: 'founder journey and customer stories',
  },
};

function generateTitleSlide(input: StartupInput, style: DeckStyle): Slide {
  const cfg = STYLE_CONFIGS[style];
  const bullets =
    style === 'yc-style'
      ? [`${input.name} — ${input.industry}`, `${input.solution.split('.')[0]}.`]
      : style === 'storytelling'
        ? [`${input.name}`, `A new chapter in ${input.industry}`, `"${input.solution.split('.')[0]}."`]
        : [`${input.name}`, `Transforming ${input.industry}`, `${input.solution.split('.')[0]}.`];

  return {
    title: input.name,
    bullets,
    talkingPoints: [
      `Introduce ${input.name} with a ${cfg.tone} tone`,
      `Emphasize ${cfg.emphasis}`,
      'Set the stage for the problem you are solving',
    ],
    suggestedVisuals: ['Company logo centered', 'Clean background with brand colors', 'Tagline in large font'],
  };
}

function generateProblemSlide(input: StartupInput, style: DeckStyle): Slide {
  const problemSentences = input.problem.split(/[.!?]+/).filter(Boolean).map(s => s.trim());
  const bullets =
    style === 'yc-style'
      ? [problemSentences[0] || input.problem, 'Current solutions fail because they are too slow or expensive', `${input.targetMarket} deserves better`]
      : style === 'storytelling'
        ? [`Imagine this: ${problemSentences[0] || input.problem}`, 'Every day, people struggle with this challenge', `For ${input.targetMarket}, the pain is real`]
        : [`The core problem: ${problemSentences[0] || input.problem}`, 'Existing alternatives fall short', `${input.targetMarket} is underserved`];

  return {
    title: 'The Problem',
    bullets,
    talkingPoints: [
      'Make the audience feel the pain point personally',
      'Quantify the impact of this problem where possible',
      `Relate specifically to ${input.targetMarket}`,
    ],
    suggestedVisuals: ['Pain point illustration or icon', 'Statistics or data showing problem scale', 'Before/after comparison'],
  };
}

function generateSolutionSlide(input: StartupInput, style: DeckStyle): Slide {
  const bullets =
    style === 'yc-style'
      ? [`${input.name}: ${input.solution}`, 'How it works in 3 simple steps', 'Key differentiator vs. incumbents']
      : style === 'storytelling'
        ? [`Then we built ${input.name}`, input.solution, 'And everything changed for our users']
        : [`Our solution: ${input.solution}`, `${input.name} provides a comprehensive approach`, 'Key features and capabilities'];

  return {
    title: 'Our Solution',
    bullets,
    talkingPoints: [
      'Demo or walkthrough of the product',
      'Highlight the "aha moment" for users',
      'Explain why this approach is 10x better',
    ],
    suggestedVisuals: ['Product screenshot or mockup', 'Feature highlight diagram', 'User workflow illustration'],
  };
}

function generateMarketSlide(input: StartupInput, style: DeckStyle): Slide {
  const bullets =
    style === 'yc-style'
      ? [`TAM: $XX billion ${input.industry} market`, `SAM: ${input.targetMarket} segment`, 'SOM: Initial beachhead market']
      : style === 'storytelling'
        ? [`The ${input.industry} landscape is shifting`, `${input.targetMarket} represents a massive opportunity`, 'And we are at the right place at the right time']
        : [`Total addressable market in ${input.industry}`, `Primary segment: ${input.targetMarket}`, 'Market growth trends and tailwinds'];

  return {
    title: 'Market Size',
    bullets,
    talkingPoints: [
      'Use bottom-up market sizing for credibility',
      `Explain why ${input.targetMarket} is the ideal starting point`,
      'Show market growth trajectory',
    ],
    suggestedVisuals: ['TAM/SAM/SOM concentric circles', 'Market growth chart', 'Industry trend data'],
  };
}

function generateBusinessModelSlide(input: StartupInput, style: DeckStyle): Slide {
  const bullets =
    style === 'yc-style'
      ? [`Revenue model: ${input.businessModel}`, 'Unit economics breakdown', 'Path to profitability']
      : style === 'storytelling'
        ? [`We make money by: ${input.businessModel}`, 'Our customers love the value proposition', 'The economics work beautifully']
        : [`Business model: ${input.businessModel}`, 'Revenue streams and pricing strategy', 'Customer lifetime value analysis'];

  return {
    title: 'Business Model',
    bullets,
    talkingPoints: [
      'Walk through the revenue model clearly',
      'Show unit economics (CAC, LTV, margins)',
      'Explain pricing rationale',
    ],
    suggestedVisuals: ['Revenue model diagram', 'Pricing table', 'Unit economics breakdown chart'],
  };
}

function generateTractionSlide(input: StartupInput, style: DeckStyle): Slide {
  const bullets =
    style === 'yc-style'
      ? [input.traction || 'Early traction metrics', 'Month-over-month growth rate', 'Key milestones achieved']
      : style === 'storytelling'
        ? ['Our journey so far has been incredible', input.traction || 'Growing momentum', 'Customer love letters and testimonials']
        : [input.traction || 'Current traction and progress', 'Growth metrics and KPIs', 'Notable partnerships and milestones'];

  return {
    title: 'Traction',
    bullets,
    talkingPoints: [
      'Lead with your strongest metric',
      'Show growth trajectory, not just snapshots',
      'Include social proof and customer quotes',
    ],
    suggestedVisuals: ['Growth chart (hockey stick preferred)', 'Customer logos', 'Key metrics dashboard'],
  };
}

function generateCompetitionSlide(input: StartupInput, style: DeckStyle): Slide {
  const bullets =
    style === 'yc-style'
      ? ['Competitive landscape overview', `${input.name} advantage: unique positioning`, 'Why now — timing and moat']
      : style === 'storytelling'
        ? ['Others have tried to solve this', `But ${input.name} approaches it differently`, 'Our unfair advantage']
        : [`Competitive landscape in ${input.industry}`, `${input.name} differentiators`, 'Sustainable competitive advantages'];

  return {
    title: 'Competition',
    bullets,
    talkingPoints: [
      'Acknowledge competitors respectfully',
      'Highlight your unique positioning clearly',
      'Explain your defensibility and moat',
    ],
    suggestedVisuals: ['2x2 competitive matrix', 'Feature comparison table', 'Positioning map'],
  };
}

function generateTeamSlide(input: StartupInput, style: DeckStyle): Slide {
  const bullets =
    style === 'yc-style'
      ? [input.team || 'Founding team', 'Relevant domain expertise', 'Why this team wins']
      : style === 'storytelling'
        ? ['Meet the people behind the mission', input.team || 'A team built for this challenge', 'United by a shared vision']
        : ['Leadership team', input.team || 'Team background and expertise', 'Advisory board and key hires'];

  return {
    title: 'Team',
    bullets,
    talkingPoints: [
      'Highlight relevant experience for this specific problem',
      'Show why this team has an unfair advantage',
      'Mention key advisors or board members',
    ],
    suggestedVisuals: ['Team headshots with titles', 'Career highlights and logos', 'Team culture photo'],
  };
}

function generateFinancialsSlide(input: StartupInput, style: DeckStyle): Slide {
  const bullets =
    style === 'yc-style'
      ? ['Revenue projections (3-year)', 'Key assumptions', 'Burn rate and runway']
      : style === 'storytelling'
        ? ['Where we are headed financially', 'Conservative yet ambitious projections', 'The path to sustainable growth']
        : ['Financial projections and forecasts', 'Key assumptions and drivers', 'Capital efficiency metrics'];

  return {
    title: 'Financials',
    bullets,
    talkingPoints: [
      'Present realistic yet ambitious projections',
      'Be transparent about key assumptions',
      'Show capital efficiency',
    ],
    suggestedVisuals: ['Revenue projection chart', 'P&L summary table', 'Key financial metrics'],
  };
}

function generateAskSlide(input: StartupInput, style: DeckStyle): Slide {
  const bullets =
    style === 'yc-style'
      ? [`Raising: ${input.fundingAsk || 'Seed round'}`, 'Use of funds breakdown', 'Key milestones this capital unlocks']
      : style === 'storytelling'
        ? [`Join us on this journey`, `We are raising ${input.fundingAsk || 'our next round'}`, 'Together, we can transform this industry']
        : [`Funding ask: ${input.fundingAsk || 'To be discussed'}`, 'Use of proceeds', 'Expected milestones with this funding'];

  return {
    title: 'The Ask',
    bullets,
    talkingPoints: [
      'State the ask clearly and confidently',
      'Show specific use of funds with percentages',
      'Define what milestones this funding achieves',
    ],
    suggestedVisuals: ['Use of funds pie chart', 'Milestone timeline', 'Contact information and next steps'],
  };
}

const SLIDE_GENERATORS = [
  generateTitleSlide,
  generateProblemSlide,
  generateSolutionSlide,
  generateMarketSlide,
  generateBusinessModelSlide,
  generateTractionSlide,
  generateCompetitionSlide,
  generateTeamSlide,
  generateFinancialsSlide,
  generateAskSlide,
];

export function generateDeck(input: StartupInput, style: DeckStyle = 'yc-style'): Deck {
  const slides = SLIDE_GENERATORS.map(gen => gen(input, style));

  return {
    id: `deck_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    startupName: input.name,
    style,
    slides,
    createdAt: new Date().toISOString(),
  };
}

export const SLIDE_NAMES = [
  'Title',
  'Problem',
  'Solution',
  'Market Size',
  'Business Model',
  'Traction',
  'Competition',
  'Team',
  'Financials',
  'The Ask',
];
