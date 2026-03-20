export interface Slide {
  slideNumber: number;
  title: string;
  content: string;
  talkingPoints: string[];
  designSuggestion: string;
}

export interface PitchDeck {
  id: string;
  companyName: string;
  industry: string;
  problem: string;
  solution: string;
  targetMarket: string;
  businessModel: string;
  fundingAsk: string;
  teamSize: number;
  stage: string;
  slides: Slide[];
  createdAt: string;
}

const decks: PitchDeck[] = [
  {
    id: "sample-1",
    companyName: "CloudMetrics",
    industry: "SaaS",
    problem: "Engineering teams waste 10+ hours per week manually tracking deployment metrics across fragmented tools.",
    solution: "CloudMetrics provides a unified dashboard that automatically aggregates deployment, performance, and cost metrics from all major cloud providers in real-time.",
    targetMarket: "Mid-market engineering teams (50-500 developers) at companies using multi-cloud infrastructure.",
    businessModel: "Usage-based SaaS with tiered pricing: Starter ($99/mo), Growth ($499/mo), Enterprise (custom).",
    fundingAsk: "$2M",
    teamSize: 5,
    stage: "seed",
    slides: [
      {
        slideNumber: 1,
        title: "CloudMetrics",
        content: "Unified Cloud Observability for Modern Engineering Teams. We help engineering leaders make data-driven infrastructure decisions by aggregating metrics from every cloud provider into one intelligent dashboard.",
        talkingPoints: [
          "Founded in 2025 by ex-AWS and Google Cloud engineers",
          "Already serving 40+ engineering teams in beta",
          "Raising $2M seed round to scale go-to-market"
        ],
        designSuggestion: "Clean hero slide with company logo centered, tagline below, and a subtle cloud infrastructure graphic in the background."
      },
      {
        slideNumber: 2,
        title: "The Problem",
        content: "Engineering teams are drowning in metrics fragmentation. The average team uses 5-7 different monitoring tools, spending 10+ hours per week context-switching between dashboards. This leads to delayed incident response, blind spots in cost optimization, and poor deployment decisions.",
        talkingPoints: [
          "73% of engineering managers report metrics fragmentation as a top-3 pain point",
          "Average cost of monitoring tool sprawl: $150K/year for mid-market companies",
          "Incident response times are 3x slower with fragmented observability",
          "Teams lose $500K+ annually in unoptimized cloud spend due to visibility gaps"
        ],
        designSuggestion: "Split layout showing chaotic multi-dashboard screenshot on the left vs. the pain points listed on the right with red accent highlights."
      },
      {
        slideNumber: 3,
        title: "Our Solution",
        content: "CloudMetrics is a single-pane-of-glass observability platform that connects to AWS, GCP, Azure, and 20+ DevOps tools. Our AI-powered engine automatically correlates deployment events with performance metrics and cost data, giving teams instant visibility into what matters.",
        talkingPoints: [
          "One-click integration with major cloud providers and CI/CD tools",
          "AI-powered anomaly detection reduces alert noise by 80%",
          "Automated cost optimization recommendations save customers an average of 30% on cloud spend",
          "Real-time deployment impact analysis shows performance changes instantly"
        ],
        designSuggestion: "Product screenshot in the center showing the unified dashboard, with integration logos arranged around it in an arc."
      },
      {
        slideNumber: 4,
        title: "Market Size",
        content: "TAM: $45B global cloud monitoring and observability market. SAM: $8.5B mid-market segment (companies with 50-500 developers). SOM: $425M addressable in Year 1 targeting North American SaaS companies.",
        talkingPoints: [
          "Cloud observability market growing at 15% CAGR through 2030",
          "Mid-market is the fastest-growing and most underserved segment",
          "Expansion opportunity into enterprise adds $20B+ to addressable market",
          "Land-and-expand motion: average customer grows 3x in first 12 months"
        ],
        designSuggestion: "Concentric circles showing TAM/SAM/SOM with dollar figures, using a gradient color scheme from outer to inner circle."
      },
      {
        slideNumber: 5,
        title: "Business Model",
        content: "Usage-based SaaS with three tiers: Starter ($99/mo, up to 10 services), Growth ($499/mo, up to 100 services), and Enterprise (custom pricing, unlimited). Annual contracts offer 20% discount. Average contract value: $6,000/year with 130% net revenue retention.",
        talkingPoints: [
          "Usage-based model aligns cost with customer value and enables organic expansion",
          "Gross margins of 82% typical for cloud-native SaaS",
          "12-month payback period on customer acquisition cost",
          "Expansion revenue driven by team growth and additional cloud provider connections"
        ],
        designSuggestion: "Pricing table with three tier columns, highlighting the Growth tier as most popular. Include a revenue growth chart below."
      },
      {
        slideNumber: 6,
        title: "Traction & Milestones",
        content: "Launched beta 6 months ago. Currently at $120K ARR with 42 paying customers and 200+ teams on the waitlist. Month-over-month growth of 25%. Key milestones: SOC 2 certification complete, launched marketplace partnerships with AWS and GCP.",
        talkingPoints: [
          "$0 to $120K ARR in 6 months with zero paid marketing",
          "42 paying customers including 3 companies with 200+ developers",
          "NPS score of 72, indicating strong product-market fit",
          "200+ teams on waitlist representing $800K+ in pipeline"
        ],
        designSuggestion: "Hockey-stick ARR chart on the left, key metrics (customers, NPS, growth rate) displayed as large stat cards on the right."
      },
      {
        slideNumber: 7,
        title: "Competitive Landscape",
        content: "Existing solutions are either too expensive and complex (Datadog, New Relic) or too narrow and fragmented (single-cloud tools). CloudMetrics uniquely combines multi-cloud aggregation, AI-powered insights, and mid-market pricing in one platform.",
        talkingPoints: [
          "Datadog and New Relic are enterprise-focused, averaging $50K+ annual contracts",
          "Native cloud tools (CloudWatch, Stackdriver) are siloed to single providers",
          "Our AI correlation engine is a defensible moat that improves with more data",
          "10x faster time-to-value: customers see ROI in hours, not weeks"
        ],
        designSuggestion: "2x2 competitive matrix with axes of 'Price' (low to high) and 'Multi-cloud Coverage' (narrow to broad), positioning CloudMetrics in the ideal quadrant."
      },
      {
        slideNumber: 8,
        title: "Team",
        content: "5-person founding team with deep cloud infrastructure and SaaS experience. Combined 40+ years at AWS, Google Cloud, and Datadog. Technical co-founders previously built observability tools used by Fortune 500 companies.",
        talkingPoints: [
          "CEO: 10 years at AWS, led the CloudWatch product team",
          "CTO: Ex-Google Cloud, built internal observability platform serving 10K+ engineers",
          "VP Engineering: Former Datadog tech lead, shipped 3 major product lines",
          "Advisors include VP of Engineering at Stripe and CTO of HashiCorp",
          "Hiring plan: 8 engineers and 3 sales reps in next 12 months"
        ],
        designSuggestion: "Team headshots in a row with name, title, and one-line bio below each. Advisor logos arranged beneath."
      },
      {
        slideNumber: 9,
        title: "Financial Projections",
        content: "Projecting $1.2M ARR by end of Year 1, $5M ARR by Year 2, and $15M ARR by Year 3. Path to profitability by Year 3 with 80%+ gross margins and improving unit economics at scale.",
        talkingPoints: [
          "Conservative assumptions: 20% MoM growth declining to 10% by end of Year 2",
          "CAC payback period improving from 12 months to 8 months with brand awareness",
          "Gross margins expand from 78% to 85% as infrastructure costs decline at scale",
          "Break-even at approximately $10M ARR with current cost structure"
        ],
        designSuggestion: "Three-year revenue projection bar chart with a line showing margin improvement. Include a small table with key financial metrics below."
      },
      {
        slideNumber: 10,
        title: "The Ask",
        content: "Raising $2M seed round to accelerate product development and go-to-market. Funds will be allocated: 50% engineering (hire 5 engineers), 30% sales & marketing (hire 3, launch paid acquisition), 20% operations and runway.",
        talkingPoints: [
          "$2M provides 18 months of runway at planned burn rate",
          "Key milestones for the round: $1.2M ARR, 150 customers, Series A readiness",
          "Target 3x ARR growth within 12 months of funding",
          "Previous angel round of $500K at $5M pre-money valuation"
        ],
        designSuggestion: "Pie chart showing fund allocation with dollar amounts. Timeline below showing key milestones over the next 18 months."
      },
      {
        slideNumber: 11,
        title: "Appendix",
        content: "Additional supporting materials including detailed product screenshots, customer testimonials, full competitive analysis, and technical architecture overview.",
        talkingPoints: [
          "Full product demo available upon request",
          "Customer case studies from beta users showing 40% reduction in incident response time",
          "Technical architecture designed for 99.99% uptime SLA",
          "Patent pending on multi-cloud metric correlation algorithm"
        ],
        designSuggestion: "Clean slide with four clickable sections linking to detailed appendix materials, each with an icon and brief description."
      }
    ],
    createdAt: new Date().toISOString(),
  }
];

export function getAllDecks(): PitchDeck[] {
  return decks;
}

export function getDeckById(id: string): PitchDeck | undefined {
  return decks.find((d) => d.id === id);
}

export function addDeck(deck: PitchDeck): void {
  decks.push(deck);
}
