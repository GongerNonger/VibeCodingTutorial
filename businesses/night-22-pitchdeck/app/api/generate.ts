import { PitchDeck, Slide } from "./store";

interface DeckInput {
  companyName: string;
  industry: string;
  problem: string;
  solution: string;
  targetMarket: string;
  businessModel: string;
  fundingAsk: string;
  teamSize: number;
  stage: string;
}

const MARKET_DATA: Record<string, { tam: number; growth: number; label: string }> = {
  SaaS: { tam: 300, growth: 14, label: "global SaaS market" },
  FinTech: { tam: 210, growth: 17, label: "global fintech market" },
  HealthTech: { tam: 180, growth: 19, label: "global digital health market" },
  EdTech: { tam: 120, growth: 16, label: "global edtech market" },
  "E-commerce": { tam: 450, growth: 12, label: "global e-commerce platform market" },
  Marketplace: { tam: 250, growth: 13, label: "global digital marketplace market" },
  Other: { tam: 200, growth: 11, label: "addressable technology market" },
};

function formatMoney(billions: number): string {
  if (billions >= 1) return `$${billions.toFixed(1)}B`;
  return `$${(billions * 1000).toFixed(0)}M`;
}

function getMarketSizing(industry: string): { tam: string; sam: string; som: string; growth: number } {
  const data = MARKET_DATA[industry] || MARKET_DATA["Other"];
  const tam = data.tam;
  const sam = tam * 0.18;
  const som = sam * 0.05;
  return {
    tam: formatMoney(tam),
    sam: formatMoney(sam),
    som: formatMoney(som),
    growth: data.growth,
  };
}

function getStageLabel(stage: string): string {
  switch (stage) {
    case "pre-seed": return "Pre-Seed";
    case "seed": return "Seed";
    case "series-a": return "Series A";
    default: return stage;
  }
}

function getRunwayMonths(stage: string): number {
  switch (stage) {
    case "pre-seed": return 12;
    case "seed": return 18;
    case "series-a": return 24;
    default: return 18;
  }
}

function getMilestonesByStage(stage: string): string[] {
  switch (stage) {
    case "pre-seed":
      return [
        "Validate product-market fit with 50+ paying customers",
        "Achieve $100K ARR milestone",
        "Launch v2.0 with core feature set complete",
      ];
    case "seed":
      return [
        "Scale to $1M+ ARR",
        "Expand team to 15+ employees",
        "Establish repeatable sales process and achieve Series A readiness",
      ];
    case "series-a":
      return [
        "Reach $5M+ ARR with clear path to profitability",
        "Expand into 2-3 new market segments or geographies",
        "Build management team and scale to 50+ employees",
      ];
    default:
      return ["Achieve significant growth milestones", "Expand market presence"];
  }
}

export function generateDeck(input: DeckInput): PitchDeck {
  const market = getMarketSizing(input.industry);
  const stageLabel = getStageLabel(input.stage);
  const runway = getRunwayMonths(input.stage);
  const milestones = getMilestonesByStage(input.stage);
  const marketData = MARKET_DATA[input.industry] || MARKET_DATA["Other"];

  const slides: Slide[] = [
    {
      slideNumber: 1,
      title: input.companyName,
      content: `${input.solution} We are a ${stageLabel}-stage ${input.industry} startup solving a critical problem in the ${input.targetMarket} space. We are raising ${input.fundingAsk} to accelerate growth and capture market share.`,
      talkingPoints: [
        `${input.companyName} is a ${input.industry} company targeting the ${input.targetMarket} market`,
        `Currently at the ${stageLabel} stage with a team of ${input.teamSize}`,
        `Raising ${input.fundingAsk} to scale our proven solution`,
      ],
      designSuggestion: "Bold company name centered with a concise tagline below. Use a high-impact hero image or abstract graphic related to the industry.",
    },
    {
      slideNumber: 2,
      title: "The Problem",
      content: input.problem,
      talkingPoints: [
        "This problem affects millions of potential users and is growing worse each year",
        `Current solutions in the ${input.industry} space are inadequate, fragmented, or too expensive`,
        "The cost of inaction is significant: lost revenue, wasted time, and missed opportunities",
        "Validated through extensive customer discovery and market research",
      ],
      designSuggestion: "Use a bold problem statement as the headline. Include supporting data points or a compelling visual showing the pain point's scale.",
    },
    {
      slideNumber: 3,
      title: "Our Solution",
      content: input.solution,
      talkingPoints: [
        `${input.companyName} provides a fundamentally better approach to this problem`,
        "Our solution is 10x better than alternatives in terms of speed, cost, or user experience",
        "Built with modern technology stack enabling rapid iteration and scalability",
        "Designed from the ground up for the needs of our target customers",
      ],
      designSuggestion: "Product screenshot or mockup as the centerpiece. Show 3-4 key feature highlights with icons around the product image.",
    },
    {
      slideNumber: 4,
      title: "Market Size",
      content: `TAM: ${market.tam} ${marketData.label}. SAM: ${market.sam} segment directly addressable with our current product. SOM: ${market.som} realistic capture in the first 2-3 years based on go-to-market capacity and geographic focus.`,
      talkingPoints: [
        `The ${marketData.label} is valued at ${market.tam} and growing at ${market.growth}% CAGR`,
        `Our serviceable addressable market of ${market.sam} represents the segments we can reach with our current offering`,
        `We target ${market.som} in near-term revenue based on our go-to-market strategy`,
        "Multiple expansion vectors will increase our addressable market over time",
      ],
      designSuggestion: "Concentric circles diagram showing TAM, SAM, and SOM with dollar values. Include a CAGR growth arrow and source citations.",
    },
    {
      slideNumber: 5,
      title: "Business Model",
      content: `${input.businessModel} This model is designed for recurring revenue, strong unit economics, and scalable growth within the ${input.industry} sector.`,
      talkingPoints: [
        "Revenue model optimized for predictability and customer lifetime value",
        "Target gross margins of 70-85% at scale",
        "Multiple revenue streams provide diversification and upsell opportunities",
        "Pricing validated through customer interviews and competitive analysis",
      ],
      designSuggestion: "Revenue model diagram showing pricing tiers or revenue streams. Include a simple unit economics box showing LTV, CAC, and payback period.",
    },
    {
      slideNumber: 6,
      title: "Traction & Milestones",
      content: `As a ${stageLabel}-stage company with a team of ${input.teamSize}, we have been focused on validating our core assumptions and building the foundation for scale. Key milestones achieved demonstrate strong momentum and product-market fit signals.`,
      talkingPoints: [
        "Product development milestones: MVP built and iterated based on user feedback",
        "Customer validation: active engagement from target market segments",
        "Team building: assembled a strong founding team with relevant domain expertise",
        `Next milestones: ${milestones[0]}`,
      ],
      designSuggestion: "Timeline visualization showing milestones achieved and upcoming. Use checkmarks for completed items and target icons for future goals.",
    },
    {
      slideNumber: 7,
      title: "Competitive Landscape",
      content: `The ${input.industry} market has existing players, but none fully address the problem the way ${input.companyName} does. Our unique combination of technology, focus, and execution creates a defensible competitive advantage.`,
      talkingPoints: [
        "Incumbents are slow to innovate and overcharge for underdelivered solutions",
        "New entrants lack the domain expertise and technical depth we bring",
        `${input.companyName}'s unfair advantage: purpose-built solution with deep market understanding`,
        "Strong barriers to entry through technology, data, and customer relationships",
      ],
      designSuggestion: "2x2 competitive matrix positioning the company in the ideal quadrant. Include competitor logos and a brief legend explaining the axes.",
    },
    {
      slideNumber: 8,
      title: "Team",
      content: `Our team of ${input.teamSize} brings together deep expertise in ${input.industry}, technology, and business building. We have the right people to execute on this vision and scale the company through the next phase of growth.`,
      talkingPoints: [
        "Founding team has direct experience with the problem we are solving",
        `Combined expertise spans ${input.industry}, engineering, product, and go-to-market`,
        "Track record of building and scaling products in relevant domains",
        `Plan to grow team to ${input.teamSize * 3}+ over the next ${runway} months post-funding`,
      ],
      designSuggestion: "Team member photos with name, title, and a one-liner about their background. Include advisor or investor logos below.",
    },
    {
      slideNumber: 9,
      title: "Financial Projections",
      content: `With ${input.fundingAsk} in funding, we project significant revenue growth over the next 3 years. Our financial model is based on conservative assumptions with clear unit economics and a path to profitability.`,
      talkingPoints: [
        "Year 1: Focus on product-market fit and initial revenue traction",
        "Year 2: Scale go-to-market and grow revenue 3-5x",
        "Year 3: Expand market reach and approach profitability",
        "Assumptions stress-tested with multiple scenarios (bear, base, bull case)",
      ],
      designSuggestion: "Three-year revenue projection chart with a secondary line for expenses. Include key metrics table: ARR, gross margin, burn rate, and customer count.",
    },
    {
      slideNumber: 10,
      title: "The Ask",
      content: `We are raising ${input.fundingAsk} at the ${stageLabel} stage to fund ${runway} months of growth. Funds will be allocated across product development (50%), go-to-market (30%), and operations (20%).`,
      talkingPoints: [
        `${input.fundingAsk} provides ${runway} months of runway at planned burn rate`,
        `Key milestones: ${milestones.join("; ")}`,
        "Fund allocation designed to maximize growth while maintaining capital efficiency",
        "Clear path to next funding round with defined metrics and milestones",
      ],
      designSuggestion: "Pie chart showing fund allocation percentages. Include a timeline below with key milestones mapped to the runway period.",
    },
    {
      slideNumber: 11,
      title: "Appendix",
      content: "Supporting materials including detailed product documentation, market research, customer testimonials, technical architecture, and full financial model available upon request.",
      talkingPoints: [
        "Detailed product demo available for interested investors",
        "Customer references and testimonials can be provided",
        "Full financial model with assumptions available for due diligence",
        "Technical architecture documentation shows scalability and security approach",
      ],
      designSuggestion: "Clean slide with four sections linking to appendix materials: Product Demo, Market Research, Financials, and Technical Architecture.",
    },
  ];

  const deck: PitchDeck = {
    id: `deck-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    companyName: input.companyName,
    industry: input.industry,
    problem: input.problem,
    solution: input.solution,
    targetMarket: input.targetMarket,
    businessModel: input.businessModel,
    fundingAsk: input.fundingAsk,
    teamSize: input.teamSize,
    stage: input.stage,
    slides,
    createdAt: new Date().toISOString(),
  };

  return deck;
}
